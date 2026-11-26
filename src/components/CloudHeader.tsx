import { useEffect, useRef } from 'react'

const VERTEX_SHADER = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.52;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.03 + vec2(17.1, 31.7);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_res.x / max(u_res.y, 1.0);

  // Subtle mouse parallax and horizontal perspective stretch
  vec2 p = vec2((uv.x - 0.5) * aspect * 1.15, (1.0 - uv.y) * 1.35);
  p += (u_mouse - 0.5) * vec2(0.18, 0.08);

  float t = u_time * 0.025;

  // Domain-warped FBM for realistic wispy volumetric clouds
  vec2 q = vec2(
    fbm(p * 1.3 + vec2(t * 0.9, 0.0)),
    fbm(p * 1.3 + vec2(5.2, 1.3) - vec2(t * 0.5, 0.0))
  );
  float base = fbm(p * 1.65 + 1.8 * q + vec2(t * 1.2, 0.0));

  // Secondary fine detail layer for soft cloud edges
  float detail = fbm(p * 3.4 - vec2(t * 1.6, t * 0.3) + q);
  float density = clamp(base * 0.78 + detail * 0.32 - 0.34, 0.0, 1.0);
  density = smoothstep(0.04, 0.78, density);

  // Directional top-down moonlight / frost lighting inside the cloud volume
  float litSample = fbm((p + vec2(0.03, -0.06)) * 1.65 + 1.8 * q + vec2(t * 1.2, 0.0));
  float highlight = clamp((base - litSample) * 3.6 + 0.42, 0.0, 1.0);

  // Vertical bank fade so clouds sit naturally in the header
  float bankMask = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.18, 1.0 - uv.y);
  float alpha = density * bankMask;

  vec3 skyCol = vec3(0.039, 0.043, 0.055);       // #0a0b0e
  vec3 shadowCol = vec3(0.082, 0.110, 0.165);    // deep midnight blue-slate
  vec3 midCol = vec3(0.205, 0.275, 0.385);       // cool frost slate
  vec3 rimCol = vec3(0.560, 0.690, 0.860);       // soft moonlit frost silver-blue

  vec3 cloudCol = mix(shadowCol, midCol, smoothstep(0.15, 0.7, highlight));
  cloudCol = mix(cloudCol, rimCol, pow(highlight, 2.2) * 0.65);

  vec3 finalCol = mix(skyCol, cloudCol, alpha * 0.92);
  gl_FragColor = vec4(finalCol, alpha * 0.9);
}
`

export function CloudHeader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' })
    if (!gl) return

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)
      if (!sh) return null
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh)
        return null
      }
      return sh
    }

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const posLoc = gl.getAttribLocation(prog, 'a_pos')
    const timeLoc = gl.getUniformLocation(prog, 'u_time')
    const resLoc = gl.getUniformLocation(prog, 'u_res')
    const mouseLoc = gl.getUniformLocation(prog, 'u_mouse')

    let targetMouse = [0.5, 0.5]
    let curMouse = [0.5, 0.5]

    const onMouseMove = (e: MouseEvent) => {
      targetMouse = [
        e.clientX / Math.max(window.innerWidth, 1),
        e.clientY / Math.max(window.innerHeight, 1),
      ]
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    let rafId = 0
    const start = performance.now()

    const render = (now: number) => {
      resize()
      curMouse[0] += (targetMouse[0] - curMouse[0]) * 0.04
      curMouse[1] += (targetMouse[1] - curMouse[1]) * 0.04

      gl.useProgram(prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

      gl.uniform1f(timeLoc, (now - start) / 1000)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform2f(mouseLoc, curMouse[0], curMouse[1])

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
