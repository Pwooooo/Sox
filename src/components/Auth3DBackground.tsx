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
  Medium: { pixelRatioCap: 1.5, shadowMapSize: 1024, shadows: true, msaa: 2, bloom: true, bloomStrength: 0.25, bloomRadius: 0.7, bloomThreshold: 0.8 },
  High: { pixelRatioCap: 2, shadowMapSize: 1024, shadows: true, msaa: 4, bloom: true, bloomStrength: 0.35, bloomRadius: 0.9, bloomThreshold: 0.75 },
  Max: { pixelRatioCap: 2, shadowMapSize: 2048, shadows: true, msaa: 4, bloom: true, bloomStrength: 0.42, bloomRadius: 1.0, bloomThreshold: 0.72 },
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
    renderer.toneMappingExposure = 1.12
    if (cfg.shadows) {
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
    }
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#dce8f2')
    scene.fog = new THREE.FogExp2('#dce8f2', 0.0025)

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

    // Soft BrightDay Sky Dome
    const skyGeo = new THREE.SphereGeometry(480, 32, 20)
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color('#5b92d1') },
        horizonColor: { value: new THREE.Color('#dce8f2') },
        bottomColor: { value: new THREE.Color('#f5f7fa') },
        sunDir: { value: new THREE.Vector3(62, 82, 48).normalize() },
        sunColor: { value: new THREE.Color('#fff9ed') },
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
        varying vec3 vWorldPos;
        void main() {
          vec3 dir = normalize(vWorldPos);
          float h = dir.y;
          vec3 col = h >= 0.0
            ? mix(horizonColor, topColor, pow(clamp(h, 0.0, 1.0), 0.52))
            : mix(horizonColor, bottomColor, pow(clamp(-h, 0.0, 1.0), 0.55));
          float sunDot = max(dot(dir, normalize(sunDir)), 0.0);
          col += sunColor * pow(sunDot, 140.0) * 1.3;
          col += sunColor * pow(sunDot, 10.0) * 0.25;
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
    scene.environmentIntensity = 1.15
    pmrem.dispose()

    // Ultra-soft diffuse daylight lighting
    const hemi = new THREE.HemisphereLight('#f8fafc', '#60785a', 1.65)
    scene.add(hemi)

    const ambient = new THREE.AmbientLight('#f1f5f9', 0.62)
    scene.add(ambient)

    const sunLight = new THREE.DirectionalLight('#fff9ed', 0.95)
    sunLight.position.set(62, 82, 48)
    if (cfg.shadows) {
      sunLight.castShadow = true
      sunLight.shadow.mapSize.set(cfg.shadowMapSize, cfg.shadowMapSize)
      sunLight.shadow.radius = 8
      sunLight.shadow.bias = -0.00015
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

    const rimLight = new THREE.DirectionalLight('#e0f2fe', 0.48)
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
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      terrain.update(t)

      const orbit = t * 0.045
      camera.position.x = Math.sin(orbit) * 48
      camera.position.z = Math.cos(orbit) * 48
      camera.position.y = 26 + Math.sin(t * 0.16) * 2.5
      camera.lookAt(Math.sin(orbit + 0.7) * 14, 14, Math.cos(orbit + 0.7) * 14)

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
