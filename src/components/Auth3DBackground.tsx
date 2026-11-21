import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export type QualityPreset = 'Low' | 'Medium' | 'High' | 'Max'

const QUALITY_CONFIGS: Record<
  QualityPreset,
  {
    pixelRatioCap: number
    shadowMapSize: number
    shadows: boolean
    bloom: boolean
    bloomStrength: number
    bloomRadius: number
    bloomThreshold: number
    envMap: boolean
    grassCount: number
  }
> = {
  Low: {
    pixelRatioCap: 1,
    shadowMapSize: 512,
    shadows: false,
    bloom: false,
    bloomStrength: 0,
    bloomRadius: 0,
    bloomThreshold: 1,
    envMap: false,
    grassCount: 0,
  },
  Medium: {
    pixelRatioCap: 1.5,
    shadowMapSize: 1024,
    shadows: true,
    bloom: true,
    bloomStrength: 0.3,
    bloomRadius: 0.65,
    bloomThreshold: 0.72,
    envMap: false,
    grassCount: 1500,
  },
  High: {
    pixelRatioCap: 2,
    shadowMapSize: 1024,
    shadows: true,
    bloom: true,
    bloomStrength: 0.42,
    bloomRadius: 0.78,
    bloomThreshold: 0.65,
    envMap: true,
    grassCount: 4000,
  },
  Max: {
    pixelRatioCap: 2,
    shadowMapSize: 2048,
    shadows: true,
    bloom: true,
    bloomStrength: 0.52,
    bloomRadius: 0.88,
    bloomThreshold: 0.58,
    envMap: true,
    grassCount: 8000,
  },
}

const SKY_PALETTES: Record<
  string,
  {
    top: string
    horizon: string
    sunColor: string
    sunDisc: string
    sunPos: [number, number, number]
    fog: string
  }
> = {
  BrightDay: {
    top: '#1e3a8a',
    horizon: '#7dd3fc',
    sunColor: '#fff6e8',
    sunDisc: '#fffbeb',
    sunPos: [62, 88, 48],
    fog: '#93c5fd',
  },
  GoldenSunset: {
    top: '#160d2e',
    horizon: '#d96b43',
    sunColor: '#fed7aa',
    sunDisc: '#ffedd5',
    sunPos: [-75, 22, -55],
    fog: '#351f38',
  },
  StarryMidnight: {
    top: '#020617',
    horizon: '#1e1b4b',
    sunColor: '#cbd5e1',
    sunDisc: '#e2e8f0',
    sunPos: [40, 75, -50],
    fog: '#0f172a',
  },
  CyberpunkNeon: {
    top: '#090d16',
    horizon: '#311042',
    sunColor: '#e879f9',
    sunDisc: '#f5d0fe',
    sunPos: [-50, 40, -60],
    fog: '#140b24',
  },
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

    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.pixelRatioCap))
    renderer.setSize(w, h)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    if (cfg.shadows) {
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, w / h, 0.2, 320)

    let composer: EffectComposer | null = null
    if (cfg.bloom) {
      composer = new EffectComposer(renderer)
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

    let envRT: THREE.WebGLRenderTarget | null = null
    const animatedCrystals: THREE.Mesh[] = []
    const animatedClouds: THREE.Mesh[] = []
    let grassMaterial: THREE.MeshStandardMaterial | null = null

    const buildFromDoc = (doc: any) => {
      const preset = doc?.lighting?.preset || 'GoldenSunset'
      const pal = SKY_PALETTES[preset] || SKY_PALETTES.GoldenSunset

      scene.background = new THREE.Color(pal.fog)
      scene.fog = new THREE.FogExp2(pal.fog, 0.01)

      // Sky gradient dome
      const skyGeo = new THREE.SphereGeometry(220, 32, 24)
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
      const skyDome = new THREE.Mesh(skyGeo, skyMat)
      scene.add(skyDome)

      // Glowing Sun Disc for bloom & reflections
      const sunDisc = new THREE.Mesh(
        new THREE.SphereGeometry(7.5, 24, 24),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(pal.sunDisc).multiplyScalar(2.4),
        }),
      )
      sunDisc.position.set(pal.sunPos[0] * 1.6, pal.sunPos[1] * 1.4, pal.sunPos[2] * 1.6)
      scene.add(sunDisc)

      // Bake sky + sun into an IBL environment map for Water/Slate/SmoothPlastic reflections
      if (cfg.envMap && renderer) {
        const pmrem = new THREE.PMREMGenerator(renderer)
        const envScene = new THREE.Scene()
        envScene.add(skyDome.clone())
        envScene.add(sunDisc.clone())
        envRT = pmrem.fromScene(envScene, 0.04)
        scene.environment = envRT.texture
        pmrem.dispose()
      }

      const hemi = new THREE.HemisphereLight(pal.sunColor, '#1e293b', 0.85)
      scene.add(hemi)

      const sunLight = new THREE.DirectionalLight(pal.sunColor, 2.3)
      sunLight.position.set(...pal.sunPos)
      if (cfg.shadows) {
        sunLight.castShadow = true
        sunLight.shadow.mapSize.set(cfg.shadowMapSize, cfg.shadowMapSize)
        sunLight.shadow.camera.near = 5
        sunLight.shadow.camera.far = 210
        const d = 68
        sunLight.shadow.camera.left = -d
        sunLight.shadow.camera.right = d
        sunLight.shadow.camera.top = d
        sunLight.shadow.camera.bottom = -d
        sunLight.shadow.bias = -0.0005
      }
      scene.add(sunLight)

      const fill = new THREE.DirectionalLight('#818cf8', 0.65)
      fill.position.set(-pal.sunPos[0], 20, -pal.sunPos[2])
      scene.add(fill)

      const parts = collectNvloParts(doc?.root)
      const grassSurfaces: { x: number; y: number; z: number; sx: number; sz: number; color: string; perStud: number }[] = []

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
          geo = new THREE.CylinderGeometry(size[0] / 2, size[0] / 2, size[1], 20)
        } else if (shape === 'Sphere') {
          geo = new THREE.SphereGeometry(size[0] / 2, 18, 16)
        } else {
          geo = new THREE.BoxGeometry(size[0], size[1], size[2])
        }

        const isNeon = matType === 'Neon'
        const isWater = matType === 'Water'
        const mat = new THREE.MeshStandardMaterial({
          color: colorHex,
          roughness: isWater ? 0.08 : matType === 'Grass' || matType === 'Wood' ? 0.85 : 0.45,
          metalness: isWater ? 0.78 : matType === 'Slate' ? 0.2 : 0.08,
          envMapIntensity: isWater ? 1.8 : 0.9,
          emissive: isNeon ? new THREE.Color(colorHex) : new THREE.Color('#000000'),
          emissiveIntensity: isNeon ? 2.4 : 0,
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
        if (matType === 'Grass' && shape !== 'Sphere') {
          const perStud = Math.max(1, Math.min(24, Number((props as any).GrassPerStud ?? 6) || 6))
          grassSurfaces.push({
            x: pos[0],
            y: pos[1] + size[1] / 2,
            z: pos[2],
            sx: size[0],
            sz: size[2],
            color: colorHex,
            perStud,
          })
        }
      }

      // Instanced 3D Grass Leaves / Blades: dense 6-blade cluster per stud across entire Grass surface
      if (cfg.grassCount > 0 && grassSurfaces.length > 0) {
        const makeBlade = (ox: number, oz: number, rotY: number, tilt: number, hScale: number) => {
          const g = new THREE.PlaneGeometry(0.16, 0.52 * hScale, 1, 2)
          g.translate(0, 0.26 * hScale, 0)
          const pos = g.attributes.position
          const norm = g.attributes.normal
          for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i)
            const h = y / (0.52 * hScale)
            pos.setX(i, pos.getX(i) * (1 - h * 0.88))
            pos.setZ(i, h * h * tilt)
            norm.setXYZ(i, 0, 1, 0)
          }
          g.rotateY(rotY)
          g.translate(ox, 0, oz)
          return g
        }

        const subBlades = [
          makeBlade(-0.22, -0.18, 0.2, 0.14, 0.9),
          makeBlade(0.24, -0.14, 1.3, 0.12, 1.05),
          makeBlade(-0.15, 0.22, 2.1, 0.15, 0.85),
          makeBlade(0.2, 0.21, 0.8, 0.11, 1.0),
          makeBlade(0.0, -0.02, 2.7, 0.13, 1.15),
          makeBlade(-0.28, 0.05, 1.7, 0.12, 0.8),
        ]
        const totalVerts = subBlades.reduce((acc, b) => acc + b.attributes.position.count, 0)
        const posArr = new Float32Array(totalVerts * 3)
        const normArr = new Float32Array(totalVerts * 3)
        const indices: number[] = []
        let vOffset = 0
        for (const b of subBlades) {
          const pa = b.attributes.position.array as Float32Array
          const na = b.attributes.normal.array as Float32Array
          posArr.set(pa, vOffset * 3)
          normArr.set(na, vOffset * 3)
          for (const idx of b.index!.array) {
            indices.push(idx + vOffset)
          }
          vOffset += b.attributes.position.count
          b.dispose()
        }
        const mergedGeo = new THREE.BufferGeometry()
        mergedGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
        mergedGeo.setAttribute('normal', new THREE.BufferAttribute(normArr, 3))
        mergedGeo.setIndex(indices)

        grassMaterial = new THREE.MeshStandardMaterial({
          color: '#ffffff',
          roughness: 0.85,
          metalness: 0.0,
          emissive: new THREE.Color('#19381f'),
          emissiveIntensity: 0.45,
          side: THREE.DoubleSide,
        })
        grassMaterial.onBeforeCompile = (shader) => {
          shader.uniforms.uTime = { value: 0 }
          grassMaterial!.userData.shader = shader
          shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader
          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
            float hFactor = clamp(position.y / 0.55, 0.0, 1.0);
            vec4 worldInst = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            float sway = sin(uTime * 2.1 + worldInst.x * 0.35 + worldInst.z * 0.25) * 0.15 * hFactor * hFactor;
            transformed.x += sway;
            transformed.z += sway * 0.6;`,
          )
        }

        const placements: { x: number; y: number; z: number; color: string }[] = []
        for (const surf of grassSurfaces) {
          const clustersPerStud = Math.max(0.25, surf.perStud / 6)
          const step = Math.max(0.45, Math.min(2.0, 1 / Math.sqrt(clustersPerStud)))
          for (let gx = surf.x - surf.sx / 2 + step * 0.5; gx < surf.x + surf.sx / 2; gx += step) {
            for (let gz = surf.z - surf.sz / 2 + step * 0.5; gz < surf.z + surf.sz / 2; gz += step) {
              placements.push({ x: gx, y: surf.y, z: gz, color: surf.color })
            }
          }
        }

        const instancedGrass = new THREE.InstancedMesh(mergedGeo, grassMaterial, placements.length)
        instancedGrass.receiveShadow = cfg.shadows
        const dummy = new THREE.Object3D()
        const baseCol = new THREE.Color()

        for (let i = 0; i < placements.length; i++) {
          const pl = placements[i]
          const rx = Math.sin(i * 12.9898) * 43758.5453
          const rz = Math.sin(i * 78.233) * 43758.5453
          const jx = ((rx - Math.floor(rx)) - 0.5) * 0.7
          const jz = ((rz - Math.floor(rz)) - 0.5) * 0.7

          dummy.position.set(pl.x + jx, pl.y - 0.02, pl.z + jz)
          dummy.rotation.set(0, rx % 6.28, 0)
          const s = 0.8 + (i % 5) * 0.14
          dummy.scale.set(s, s * (0.85 + (i % 3) * 0.2), s)
          dummy.updateMatrix()
          instancedGrass.setMatrixAt(i, dummy.matrix)

          baseCol.set(pl.color).offsetHSL(0.01 * ((i % 3) - 1), 0.06, 0.08 + 0.04 * (i % 3))
          instancedGrass.setColorAt(i, baseCol)
        }
        instancedGrass.instanceMatrix.needsUpdate = true
        if (instancedGrass.instanceColor) instancedGrass.instanceColor.needsUpdate = true
        scene.add(instancedGrass)
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
      if (grassMaterial?.userData?.shader) {
        grassMaterial.userData.shader.uniforms.uTime.value = t
      }

      if (composer) {
        composer.render()
      } else {
        renderer?.render(scene, camera)
      }
    }
    animate()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      envRT?.dispose()
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
