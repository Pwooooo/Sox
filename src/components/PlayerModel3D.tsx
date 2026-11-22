import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function applyAreaWeightedNormals(geometry: THREE.BufferGeometry): void {
  const pos = geometry.getAttribute('position')
  if (!pos) return

  const index = geometry.getIndex()
  const count = pos.count
  const accum = new Float32Array(count * 3)
  const keyMap = new Map<string, number[]>()

  for (let i = 0; i < count; i++) {
    const key = `${pos.getX(i).toFixed(4)}_${pos.getY(i).toFixed(4)}_${pos.getZ(i).toFixed(4)}`
    let list = keyMap.get(key)
    if (!list) {
      list = []
      keyMap.set(key, list)
    }
    list.push(i)
  }

  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  const fn = new THREE.Vector3()

  const triCount = index ? index.count / 3 : count / 3
  for (let t = 0; t < triCount; t++) {
    const i0 = index ? index.getX(t * 3) : t * 3
    const i1 = index ? index.getX(t * 3 + 1) : t * 3 + 1
    const i2 = index ? index.getX(t * 3 + 2) : t * 3 + 2

    a.fromBufferAttribute(pos, i0)
    b.fromBufferAttribute(pos, i1)
    c.fromBufferAttribute(pos, i2)

    ab.subVectors(b, a)
    ac.subVectors(c, a)
    fn.crossVectors(ab, ac)
    const area2 = fn.lengthSq()
    if (area2 < 1e-12) continue
    fn.normalize().multiplyScalar(area2)

    for (const idx of [i0, i1, i2]) {
      const key = `${pos.getX(idx).toFixed(4)}_${pos.getY(idx).toFixed(4)}_${pos.getZ(idx).toFixed(4)}`
      const shared = keyMap.get(key)!
      for (const s of shared) {
        accum[s * 3] += fn.x
        accum[s * 3 + 1] += fn.y
        accum[s * 3 + 2] += fn.z
      }
    }
  }

  const normals = new Float32Array(count * 3)
  const v = new THREE.Vector3()
  for (let i = 0; i < count; i++) {
    v.set(accum[i * 3], accum[i * 3 + 1], accum[i * 3 + 2])
    if (v.lengthSq() > 0) v.normalize()
    else v.set(0, 1, 0)
    normals[i * 3] = v.x
    normals[i * 3 + 1] = v.y
    normals[i * 3 + 2] = v.z
  }
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
}

export interface BodyColors {
  head: string
  torso: string
  leftArm: string
  rightArm: string
  leftLeg: string
  rightLeg: string
}

function resolveBodyPartKey(name: string): keyof BodyColors | null {
  const n = name.toLowerCase()
  if (n.includes('head')) return 'head'
  if (n.includes('torso')) return 'torso'
  if (n.includes('left arm')) return 'leftArm'
  if (n.includes('right arm')) return 'rightArm'
  if (n.includes('left leg')) return 'leftLeg'
  if (n.includes('right leg')) return 'rightLeg'
  return null
}

interface PlayerModel3DProps {
  mode?: 'full' | 'headshot'
  interactive?: boolean
  className?: string
  bodyColors?: BodyColors
}

export function PlayerModel3D({
  mode = 'full',
  interactive = false,
  className = '',
  bodyColors,
}: PlayerModel3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const partMaterialsRef = useRef<Partial<Record<keyof BodyColors, THREE.MeshStandardMaterial[]>>>({})
  const bodyColorsRef = useRef<BodyColors | undefined>(bodyColors)
  bodyColorsRef.current = bodyColors

  useEffect(() => {
    if (!bodyColors) return
    const map = partMaterialsRef.current
    ;(Object.keys(bodyColors) as (keyof BodyColors)[]).forEach((part) => {
      const mats = map[part]
      if (!mats) return
      for (const m of mats) {
        m.color.set(bodyColors[part])
      }
    })
  }, [bodyColors])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }

    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(mode === 'headshot' ? 30 : 34, w / h, 0.1, 100)
    if (mode === 'headshot') {
      camera.position.set(0.45, 4.1, 4.3)
      camera.lookAt(0, 3.92, 0)
    } else {
      camera.position.set(1.2, 2.75, 10.6)
      camera.lookAt(0, 2.35, 0)
    }

    // Studio 3-point lighting
    const hemi = new THREE.HemisphereLight('#f8fafc', '#2b2d36', 1.15)
    scene.add(hemi)

    const keyLight = new THREE.DirectionalLight('#fff5e6', 1.8)
    keyLight.position.set(3.5, 6.5, 5.5)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight('#b8d4ff', 0.9)
    rimLight.position.set(-4.0, 4.5, -4.5)
    scene.add(rimLight)

    const root = new THREE.Group()
    scene.add(root)

    let mixer: THREE.AnimationMixer | null = null
    let disposed = false
    let yaw = mode === 'headshot' ? 0.15 : 0.25
    let dragging = false
    let lastX = 0

    const loader = new GLTFLoader()
    loader.load('/models/Novelo_Player.glb', (gltf) => {
      if (disposed) return
      const model = gltf.scene
      const newPartMaterials: Partial<Record<keyof BodyColors, THREE.MeshStandardMaterial[]>> = {}
      model.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh
          applyAreaWeightedNormals(mesh.geometry)
          const rawMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          const clonedMats = rawMats.map((m) => m.clone())
          mesh.material = Array.isArray(mesh.material) ? clonedMats : clonedMats[0]

          const partKey = resolveBodyPartKey(mesh.name)
          const initialColor = partKey && bodyColorsRef.current ? bodyColorsRef.current[partKey] : null

          for (const m of clonedMats) {
            if (m instanceof THREE.MeshPhysicalMaterial) {
              m.clearcoat = 0
              m.roughness = 0.52
              if (initialColor) m.color.set(initialColor)
              m.needsUpdate = true
              if (partKey) {
                ;(newPartMaterials[partKey] ??= []).push(m)
              }
            } else if (m instanceof THREE.MeshStandardMaterial) {
              m.roughness = 0.52
              if (initialColor) m.color.set(initialColor)
              m.needsUpdate = true
              if (partKey) {
                ;(newPartMaterials[partKey] ??= []).push(m)
              }
            }
          }
        }
      })
      partMaterialsRef.current = newPartMaterials

      const box = new THREE.Box3().setFromObject(model)
      const size = new THREE.Vector3()
      box.getSize(size)
      if (size.y > 0.001) {
        const scale = 4.7 / size.y
        model.scale.setScalar(scale)
        model.updateMatrixWorld(true)
        const scaledBox = new THREE.Box3().setFromObject(model)
        model.position.y -= scaledBox.min.y
      }

      // Compute head bounds and attach starter face BEFORE adding to `root`
      // so `root.rotation.y` (which animates while GLB loads) never offsets the decal.
      model.updateMatrixWorld(true)

      // Attach starter face decal onto the front of the Head (bone-tracked if rigged)
      const faceTex = new THREE.TextureLoader().load('/models/Novelo_Standard_Face.png')
      faceTex.colorSpace = THREE.SRGBColorSpace
      const faceMat = new THREE.MeshStandardMaterial({
        map: faceTex,
        transparent: true,
        alphaTest: 0.05,
        roughness: 0.8,
        metalness: 0,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      })

      let headTarget: THREE.Object3D | null = null
      let headMesh: THREE.Mesh | null = null
      model.traverse((obj) => {
        const lower = obj.name.toLowerCase()
        if (!headTarget && (obj as THREE.Bone).isBone && lower.includes('head')) {
          headTarget = obj
        }
        if (!headMesh && (obj as THREE.Mesh).isMesh && lower.includes('head')) {
          headMesh = obj as THREE.Mesh
        }
      })

      // Measure the world-space head bounds (top ~25% of the 4.7-tall normalized model)
      const headBox = new THREE.Box3()
      if (headMesh) {
        headBox.setFromObject(headMesh)
      } else {
        const wp = new THREE.Vector3()
        model.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const pos = (obj as THREE.Mesh).geometry.getAttribute('position')
            if (!pos) return
            for (let i = 0; i < pos.count; i++) {
              wp.fromBufferAttribute(pos, i).applyMatrix4(obj.matrixWorld)
              if (wp.y >= 3.45) headBox.expandByPoint(wp)
            }
          }
        })
      }

      if (!headBox.isEmpty()) {
        const hSize = new THREE.Vector3()
        const hCenter = new THREE.Vector3()
        headBox.getSize(hSize)
        headBox.getCenter(hCenter)
        const faceSize = Math.min(hSize.x, hSize.y) * 0.94
        const faceGeo = new THREE.PlaneGeometry(faceSize, faceSize, 16, 1)
        const cylRadius = hSize.z * 0.5 + 0.005
        const posAttr = faceGeo.getAttribute('position')
        for (let i = 0; i < posAttr.count; i++) {
          const x = posAttr.getX(i)
          const theta = x / cylRadius
          posAttr.setX(i, cylRadius * Math.sin(theta))
          posAttr.setZ(i, cylRadius * Math.cos(theta) - cylRadius)
        }
        faceGeo.computeVertexNormals()

        const faceMesh = new THREE.Mesh(faceGeo, faceMat)
        const worldFront = new THREE.Vector3(hCenter.x, hCenter.y - hSize.y * 0.03, headBox.max.z + 0.005)

        const attachParent = headTarget || headMesh || model
        attachParent.updateMatrixWorld(true)
        attachParent.worldToLocal(worldFront)
        faceMesh.position.copy(worldFront)
        // Counter-rotate & counter-scale so faceMesh faces model +Z at exact size inside rigged parent
        const pQuat = new THREE.Quaternion()
        attachParent.getWorldQuaternion(pQuat)
        faceMesh.quaternion.copy(pQuat).invert()
        const pScale = new THREE.Vector3()
        attachParent.getWorldScale(pScale)
        faceMesh.scale.set(
          pScale.x > 0.0001 ? 1 / pScale.x : 1,
          pScale.y > 0.0001 ? 1 / pScale.y : 1,
          pScale.z > 0.0001 ? 1 / pScale.z : 1,
        )
        attachParent.add(faceMesh)
      }

      root.add(model)
      model.updateMatrixWorld(true)

      if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        const idle =
          gltf.animations.find((c) => c.name === 'Novelo_Idle') ?? gltf.animations[0]
        mixer.clipAction(idle).play()
      }
    })

    const onPointerDown = (e: PointerEvent) => {
      if (!interactive) return
      dragging = true
      lastX = e.clientX
      container.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!interactive || !dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      yaw += dx * 0.012
    }
    const onPointerUp = (e: PointerEvent) => {
      if (!interactive || !dragging) return
      dragging = false
      try {
        container.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    }

    if (interactive) {
      container.addEventListener('pointerdown', onPointerDown)
      container.addEventListener('pointermove', onPointerMove)
      container.addEventListener('pointerup', onPointerUp)
      container.addEventListener('pointercancel', onPointerUp)
    }

    const onResize = () => {
      if (!container || !renderer) return
      const nw = Math.max(1, container.clientWidth)
      const nh = Math.max(1, container.clientHeight)
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    let rafId = 0
    const clock = new THREE.Clock()
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      if (mixer) mixer.update(dt)
      if (mode === 'full' && !dragging) {
        yaw += dt * 0.25
      }
      root.rotation.y = yaw
      renderer?.render(scene, camera)
    }
    animate()

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      if (interactive) {
        container.removeEventListener('pointerdown', onPointerDown)
        container.removeEventListener('pointermove', onPointerMove)
        container.removeEventListener('pointerup', onPointerUp)
        container.removeEventListener('pointercancel', onPointerUp)
      }
      mixer?.stopAllAction()
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    }
  }, [mode, interactive])

  return (
    <div
      ref={containerRef}
      className={className}
      style={interactive ? { cursor: 'grab' } : undefined}
    />
  )
}
