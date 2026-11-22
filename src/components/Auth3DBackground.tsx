import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { TerrainSurface } from '@/lib/authTerrain'

export type QualityPreset = 'Low' | 'Medium' | 'High' | 'Max'

const QUALITY_CONFIGS: Record<
  QualityPreset,
  {
    pixelRatioCap: number
    shadowMapSize: number
    shadows: boolean
    msaa: number
    bloom: boolean
    bloomStrength: number
    bloomRadius: number
    bloomThreshold: number
  }
> = {
  Low: { pixelRatioCap: 1, shadowMapSize: 512, shadows: false, msaa: 0, bloom: false, bloomStrength: 0, bloomRadius: 0, bloomThreshold: 1 },
  Medium: { pixelRatioCap: 1.5, shadowMapSize: 1024, shadows: true, msaa: 2, bloom: true, bloomStrength: 0.16, bloomRadius: 0.55, bloomThreshold: 0.88 },
  High: { pixelRatioCap: 2, shadowMapSize: 1024, shadows: true, msaa: 4, bloom: true, bloomStrength: 0.19, bloomRadius: 0.62, bloomThreshold: 0.88 },
  Max: { pixelRatioCap: 2, shadowMapSize: 2048, shadows: true, msaa: 4, bloom: true, bloomStrength: 0.22, bloomRadius: 0.65, bloomThreshold: 0.88 },
}

export function Auth3DBackground({ quality = 'Max' }: { quality?: QualityPreset }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cfg = QUALITY_CONFIGS[quality]
    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      return
    }

    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.pixelRatioCap))
    renderer.setSize(w, h)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.02
    if (cfg.shadows) {
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#c8ddf0')
    scene.fog = new THREE.FogExp2('#c8ddf0', 0.0012)

    const camera = new THREE.PerspectiveCamera(48, w / h, 0.2, 520)

    let composer: EffectComposer | null = null
    if (cfg.bloom) {
      const target = new THREE.WebGLRenderTarget(w, h, {
        samples: cfg.msaa,
        type: THREE.HalfFloatType,
      })
      composer = new EffectComposer(renderer, target)
      composer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.pixelRatioCap))
      composer.setSize(w, h)
      composer.addPass(new RenderPass(scene, camera))
      composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(w, h),
          cfg.bloomStrength,
          cfg.bloomRadius,
          cfg.bloomThreshold,
        ),
      )
      composer.addPass(new OutputPass())
    }

    // Crisp Golden-Afternoon Sky Dome with Puffy Cumulus Clouds
    const skyGeo = new THREE.SphereGeometry(480, 32, 20)
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color('#3b73b8') },
        horizonColor: { value: new THREE.Color('#d2e4f4') },
        bottomColor: { value: new THREE.Color('#f5efe6') },
        sunDir: { value: new THREE.Vector3(76, 48, 44).normalize() },
        sunColor: { value: new THREE.Color('#ffe5be') },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 horizonColor;
        uniform vec3 bottomColor;
        uniform vec3 sunDir;
        uniform vec3 sunColor;
        uniform float uTime;
        varying vec3 vWorldPos;

        float hash2(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float noise2(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash2(i), hash2(i + vec2(1.0, 0.0)), u.x),
            mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }
        float fbmCloud(vec2 p) {
          float v = 0.0;
          float a = 0.52;
          for (int i = 0; i < 5; i++) {
            v += a * noise2(p);
            p = p * 2.03 + vec2(13.7, 7.9);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 dir = normalize(vWorldPos);
          float h = dir.y;
          vec3 col = h >= 0.0
            ? mix(horizonColor, topColor, pow(clamp(h, 0.0, 1.0), 0.52))
            : mix(horizonColor, bottomColor, pow(clamp(-h, 0.0, 1.0), 0.55));

          // Sculpted puffy cumulus clouds in the upper sky dome
          if (h > 0.02) {
            vec2 cloudUV = dir.xz / (h + 0.22) * 0.95 + vec2(uTime * 0.009, uTime * 0.003);
            float n = fbmCloud(cloudUV);
            float detail = fbmCloud(cloudUV * 2.4 - vec2(uTime * 0.006, 0.0));
            float shape = n * 0.8 + detail * 0.22;
            float density = smoothstep(0.47, 0.62, shape);
            float horizonFade = smoothstep(0.02, 0.16, h);
            float cloudAlpha = density * horizonFade * 0.92;
            vec3 cloudShadow = vec3(0.66, 0.72, 0.80);
            vec3 cloudHighlight = vec3(0.99, 0.98, 0.96);
            vec3 cloudLit = mix(cloudShadow, cloudHighlight, smoothstep(0.46, 0.68, shape));
            col = mix(col, cloudLit, cloudAlpha);
          }

          float sunDot = max(dot(dir, normalize(sunDir)), 0.0);
          col += sunColor * pow(sunDot, 140.0) * 1.3;
          col += sunColor * pow(sunDot, 10.0) * 0.22;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    const skyDome = new THREE.Mesh(skyGeo, skyMat)
    scene.add(skyDome)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = new THREE.Scene()
    envScene.add(skyDome.clone())
    const envRT = pmrem.fromScene(envScene, 0.04)
    scene.environment = envRT.texture
    scene.environmentIntensity = 0.65
    pmrem.dispose()

    // Crisp golden-afternoon daylight with grounded tree shadows
    const hemi = new THREE.HemisphereLight('#dcecff', '#3a4a2a', 0.95)
    scene.add(hemi)

    const ambient = new THREE.AmbientLight('#f5efe6', 0.24)
    scene.add(ambient)

    const sunLight = new THREE.DirectionalLight('#ffe4be', 2.15)
    sunLight.position.set(76, 48, 44)
    if (cfg.shadows) {
      sunLight.castShadow = true
      sunLight.shadow.mapSize.set(cfg.shadowMapSize, cfg.shadowMapSize)
      sunLight.shadow.radius = 6
      sunLight.shadow.bias = -0.0003
      sunLight.shadow.normalBias = 0.04
      sunLight.shadow.camera.near = 1
      sunLight.shadow.camera.far = 280
      const d = 85
      sunLight.shadow.camera.left = -d
      sunLight.shadow.camera.right = d
      sunLight.shadow.camera.top = d
      sunLight.shadow.camera.bottom = -d
    }
    scene.add(sunLight)

    const rimLight = new THREE.DirectionalLight('#b4c8f0', 0.35)
    rimLight.position.set(-55, 40, -55)
    scene.add(rimLight)

    // Generate the Novelo landscape on Max Blending
    const terrain = new TerrainSurface()
    terrain.generate({
      size: [240, 64, 240],
      position: [0, 0, 0],
      biomes: ['Mountains', 'Hills', 'Plains', 'Water'],
      blending: 1.0,
      biomeSize: 140,
      seed: 618033988,
    })
    scene.add(terrain.group)

    const onResize = () => {
      if (!container || !renderer) return
      const nw = Math.max(1, container.clientWidth)
      const nh = Math.max(1, container.clientHeight)
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
      composer?.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    let rafId = 0
    const clock = new THREE.Clock()
    let smoothCamY = 22
    let smoothLookY = 12
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      terrain.update(t)
      skyMat.uniforms.uTime.value = t

      const camX = -10 + Math.sin(t * 0.065) * 14
      const camZ = 40 + Math.cos(t * 0.05) * 6
      const lookX = 6 + Math.sin(t * 0.04) * 6
      const lookZ = -32

      // Keep camera safely above the meadow looking out across the hero tree & mountain ridge
      const groundAtCam = terrain.getHeightAt(camX, camZ)
      const groundAtLook = terrain.getHeightAt(lookX, lookZ)
      const targetCamY = Math.max(20, groundAtCam + 6.0)
      const targetLookY = Math.max(19, groundAtLook * 0.55 + 10)
      smoothCamY += (targetCamY - smoothCamY) * 0.06
      smoothLookY += (targetLookY - smoothLookY) * 0.06

      camera.position.set(camX, Math.max(smoothCamY, groundAtCam + 5.0), camZ)
      camera.lookAt(lookX, smoothLookY, lookZ)

      if (composer) {
        composer.render()
      } else {
        renderer?.render(scene, camera)
      }
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      terrain.clear()
      envRT.dispose()
      composer?.dispose()
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    }
  }, [quality])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
