import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export function Auth3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#070709')
    scene.fog = new THREE.FogExp2('#070709', 0.042)

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 120)
    camera.position.set(10, 6.5, 13)
    camera.lookAt(0, 1.2, 0)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    // Soft moody studio lighting
    const ambient = new THREE.AmbientLight(0xdbeafe, 0.55)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6)
    keyLight.position.set(8, 14, 10)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.1)
    rimLight.position.set(-10, 6, -8)
    scene.add(rimLight)

    const accentPoint = new THREE.PointLight(0xe2e8f0, 2.2, 22)
    accentPoint.position.set(0, 4.5, 2)
    scene.add(accentPoint)

    // Floating Novelo baseplate island
    const worldGroup = new THREE.Group()
    scene.add(worldGroup)

    const baseGeo = new THREE.BoxGeometry(12, 0.8, 12)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x16171d,
      roughness: 0.7,
      metalness: 0.15,
    })
    const baseplate = new THREE.Mesh(baseGeo, baseMat)
    baseplate.position.y = -0.4
    worldGroup.add(baseplate)

    const grid = new THREE.GridHelper(12, 12, 0x3b3d4a, 0x22242d)
    grid.position.y = 0.01
    worldGroup.add(grid)

    // Spawn pad
    const spawnGeo = new THREE.BoxGeometry(2.6, 0.14, 2.6)
    const spawnMat = new THREE.MeshStandardMaterial({
      color: 0x262833,
      roughness: 0.4,
      metalness: 0.25,
    })
    const spawnPad = new THREE.Mesh(spawnGeo, spawnMat)
    spawnPad.position.set(0, 0.07, 0)
    worldGroup.add(spawnPad)

    // Floating ambient blocks around the island
    const floaters: { mesh: THREE.Mesh; baseY: number; speed: number; phase: number }[] = []
    const floaterPositions = [
      [-6.5, 1.8, -4.5, 1.1],
      [6.8, 2.5, -3.5, 0.9],
      [-5.2, 3.2, 5.4, 0.75],
      [5.8, 1.4, 5.2, 1.2],
      [0.5, 4.8, -7.2, 0.85],
    ]
    const floaterMat = new THREE.MeshStandardMaterial({
      color: 0x232530,
      roughness: 0.35,
      metalness: 0.4,
    })
    floaterPositions.forEach(([x, y, z, s], idx) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), floaterMat)
      m.position.set(x, y, z)
      m.rotation.set(idx * 0.4, idx * 0.7, 0)
      worldGroup.add(m)
      floaters.push({ mesh: m, baseY: y, speed: 0.7 + idx * 0.15, phase: idx * 1.3 })
    })

    // Load Novelo_Player.glb onto the spawn pad
    let playerModel: THREE.Object3D | null = null
    const loader = new GLTFLoader()
    loader.load(
      '/models/Novelo_Player.glb',
      (gltf) => {
        const model = gltf.scene
        model.position.set(0, 0.14, 0)
        model.scale.setScalar(1.15)
        worldGroup.add(model)
        playerModel = model
      },
      undefined,
      () => {
        // Ignore if model fails to load
      },
    )

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

      // Gentle orbital camera drift
      const angle = t * 0.11
      camera.position.x = Math.sin(angle) * 13.5
      camera.position.z = Math.cos(angle) * 13.5
      camera.position.y = 5.6 + Math.sin(t * 0.25) * 0.5
      camera.lookAt(0, 1.4, 0)

      for (const f of floaters) {
        f.mesh.position.y = f.baseY + Math.sin(t * f.speed + f.phase) * 0.35
        f.mesh.rotation.y += 0.004
        f.mesh.rotation.x += 0.002
      }

      if (playerModel) {
        playerModel.rotation.y = Math.sin(t * 0.4) * 0.35
      }

      renderer?.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
