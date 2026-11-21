import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type QualityPreset = 'Low' | 'Medium' | 'High' | 'Max'

const QUALITY_CONFIGS: Record<
  QualityPreset,
  { pixelRatioCap: number; shadowMapSize: number; shadows: boolean }
> = {
  Low: { pixelRatioCap: 1, shadowMapSize: 512, shadows: false },
  Medium: { pixelRatioCap: 1.5, shadowMapSize: 1024, shadows: true },
  High: { pixelRatioCap: 2, shadowMapSize: 1024, shadows: true },
  Max: { pixelRatioCap: 2, shadowMapSize: 2048, shadows: true },
}

const SKY_PALETTES: Record<
  string,
  { top: string; horizon: string; sunColor: string; sunPos: [number, number, number]; fog: string }
> = {
  BrightDay: { top: '#1e3a8a', horizon: '#7dd3fc', sunColor: '#fff6e8', sunPos: [62, 88, 48], fog: '#93c5fd' },
  GoldenSunset: { top: '#1e1035', horizon: '#c25e3e', sunColor: '#fed7aa', sunPos: [-75, 26, -55], fog: '#3b243b' },
  StarryMidnight: { top: '#020617', horizon: '#1e1b4b', sunColor: '#cbd5e1', sunPos: [40, 75, -50], fog: '#0f172a' },
  CyberpunkNeon: { top: '#090d16', horizon: '#311042', sunColor: '#e879f9', sunPos: [-50, 40, -60], fog: '#140b24' },
}

interface NvloPartNode {
  className?: string
  name?: string
  properties?: {
    Name?: string
    Shape?: string
    Position?: [number, number, number]
    Rotation?: [number, number, number]
    Size?: [number, number, number]
    Color?: string
    Material?: string
    Transparency?: number
  }
  children?: NvloPartNode[]
}

function collectNvloParts(node: NvloPartNode | undefined, out: NvloPartNode[] = []): NvloPartNode[] {
  if (!node) return out
  if (node.className === 'Part') out.push(node)
  if (Array.isArray(node.children)) {
    for (const c of node.children) collectNvloParts(c, out)
  }
  return out
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.pixelRatioCap))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    if (cfg.shadows) {
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.2,
      300,
    )

    const animatedCrystals: THREE.Mesh[] = []
    const animatedClouds: THREE.Mesh[] = []

    const buildFromDoc = (doc: any) => {
      const preset = doc?.lighting?.preset || 'GoldenSunset'
      const pal = SKY_PALETTES[preset] || SKY_PALETTES.GoldenSunset

      scene.background = new THREE.Color(pal.fog)
      scene.fog = new THREE.FogExp2(pal.fog, 0.011)

      // Sky gradient dome
      const skyGeo = new THREE.SphereGeometry(200, 32, 20)
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          topColor: { value: new THREE.Color(pal.top) },
          horizonColor: { value: new THREE.Color(pal.horizon) },
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
          varying vec3 vWorldPos;
          void main() {
            float h = normalize(vWorldPos).y;
            gl_FragColor = vec4(mix(horizonColor, topColor, smoothstep(-0.05, 0.55, h)), 1.0);
          }
        `,
      })
      scene.add(new THREE.Mesh(skyGeo, skyMat))

      const hemi = new THREE.HemisphereLight(pal.sunColor, '#1e293b', 0.8)
      scene.add(hemi)

      const sunLight = new THREE.DirectionalLight(pal.sunColor, 2.1)
      sunLight.position.set(...pal.sunPos)
      if (cfg.shadows) {
        sunLight.castShadow = true
        sunLight.shadow.mapSize.set(cfg.shadowMapSize, cfg.shadowMapSize)
        sunLight.shadow.camera.near = 5
        sunLight.shadow.camera.far = 200
        const d = 65
        sunLight.shadow.camera.left = -d
        sunLight.shadow.camera.right = d
        sunLight.shadow.camera.top = d
        sunLight.shadow.camera.bottom = -d
        sunLight.shadow.bias = -0.0005
      }
      scene.add(sunLight)

      const fill = new THREE.DirectionalLight('#6366f1', 0.6)
      fill.position.set(-pal.sunPos[0], 20, -pal.sunPos[2])
      scene.add(fill)

      const parts = collectNvloParts(doc?.root)
      for (const p of parts) {
        const props = p.properties || {}
        const shape = props.Shape || 'Brick'
        const size = props.Size || [4, 1, 4]
        const pos = props.Position || [0, 0, 0]
        const rot = props.Rotation || [0, 0, 0]
        const matType = props.Material || 'SmoothPlastic'
        const transparency = props.Transparency ?? 0
        const colorHex = props.Color || '#94a3b8'

        let geo: THREE.BufferGeometry
        if (shape === 'Cylinder') {
          geo = new THREE.CylinderGeometry(size[0] / 2, size[0] / 2, size[1], 18)
        } else if (shape === 'Sphere') {
          geo = new THREE.SphereGeometry(size[0] / 2, 16, 14)
        } else {
          geo = new THREE.BoxGeometry(size[0], size[1], size[2])
        }

        const isNeon = matType === 'Neon'
        const isWater = matType === 'Water'
        const mat = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: isWater ? 0.12 : matType === 'Grass' || matType === 'Wood' ? 0.88 : 0.55,
          metalness: isWater ? 0.65 : matType === 'Slate' ? 0.15 : 0.05,
          emissive: isNeon ? new THREE.Color(colorHex) : new THREE.Color('#000000'),
          emissiveIntensity: isNeon ? 1.4 : 0,
          transparent: transparency > 0,
          opacity: 1 - transparency,
        })

        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(pos[0], pos[1], pos[2])
        mesh.rotation.set(
          THREE.MathUtils.degToRad(rot[0]),
          THREE.MathUtils.degToRad(rot[1]),
          THREE.MathUtils.degToRad(rot[2]),
        )
        mesh.castShadow = cfg.shadows && transparency === 0
        mesh.receiveShadow = cfg.shadows
        scene.add(mesh)

        if (isNeon) animatedCrystals.push(mesh)
        if ((props.Name || p.name) === 'Cloud') animatedClouds.push(mesh)
      }
    }

    let cancelled = false
    fetch('/scenes/auth-landscape.nvlo')
      .then((r) => (r.ok ? r.json() : null))
      .then((doc) => {
        if (!cancelled && doc) buildFromDoc(doc)
      })
      .catch(() => {})

    const onResize = () => {
      if (!container || !renderer) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    let rafId = 0
    const clock = new THREE.Clock()
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      const orbit = t * 0.06
      camera.position.x = Math.sin(orbit) * 30
      camera.position.z = Math.cos(orbit) * 30
      camera.position.y = 9.5 + Math.sin(t * 0.2) * 1.3
      camera.lookAt(0, 2.5, 0)

      for (const c of animatedCrystals) {
        c.rotation.y += 0.012
      }
      for (const cl of animatedClouds) {
        cl.position.x += 0.01
        if (cl.position.x > 65) cl.position.x = -65
      }

      renderer?.render(scene, camera)
    }
    animate()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
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
