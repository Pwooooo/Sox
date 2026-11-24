import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  loadEquippedClothingIds,
  resolveEquippedClothing,
  syncUserMetadata,
  EQUIPPED_CLOTHING_EVENT,
  CLOTHING_UPDATED_EVENT,
} from '@/data/clothingStore'

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

const AVATAR_COLORS_STORAGE_KEY = 'novelo_avatar_body_colors'
export const AVATAR_COLORS_EVENT = 'novelo-avatar-colors-updated'

export function loadSavedBodyColors(): BodyColors | null {
  try {
    const raw = localStorage.getItem(AVATAR_COLORS_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.head === 'string' && typeof parsed.torso === 'string') {
      return parsed as BodyColors
    }
  } catch {
    // ignore
  }
  return null
}

export function saveBodyColors(colors: BodyColors, syncRemote = true) {
  try {
    localStorage.setItem(AVATAR_COLORS_STORAGE_KEY, JSON.stringify(colors))
    window.dispatchEvent(new CustomEvent(AVATAR_COLORS_EVENT, { detail: colors }))
  } catch {
    // ignore
  }
  if (syncRemote) {
    syncUserMetadata({ avatar_colors: colors })
  }
}

function resolveBodyPartKey(name: string): keyof BodyColors | null {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (clean.includes('head')) return 'head'
  if (clean.includes('torso')) return 'torso'
  if (clean.includes('leftarm')) return 'leftArm'
  if (clean.includes('rightarm')) return 'rightArm'
  if (clean.includes('leftleg')) return 'leftLeg'
  if (clean.includes('rightleg')) return 'rightLeg'
  return null
}

export interface ClothingSelection {
  shirt?: string
  pants?: string
  tshirt?: string
}

interface ClothingPartSlot {
  mesh: THREE.Mesh
  attachParent: THREE.Object3D
  size: THREE.Vector3
  localPos: THREE.Vector3
  localQuat: THREE.Quaternion
  localScale: THREE.Vector3
}

interface TemplateRegions {
  px: [number, number, number, number]
  nx: [number, number, number, number]
  py: [number, number, number, number]
  ny: [number, number, number, number]
  pz: [number, number, number, number]
  nz: [number, number, number, number]
}

const TORSO_REGIONS: TemplateRegions = {
  px: [361, 74, 64, 128],
  nx: [165, 74, 64, 128],
  py: [231, 8, 128, 64],
  ny: [231, 204, 128, 64],
  pz: [231, 74, 128, 128],
  nz: [427, 74, 128, 128],
}

const RIGHT_LIMB_REGIONS: TemplateRegions = {
  px: [19, 355, 64, 128],
  nx: [151, 355, 64, 128],
  py: [217, 289, 64, 64],
  ny: [217, 485, 64, 64],
  pz: [217, 355, 64, 128],
  nz: [85, 355, 64, 128],
}

const LEFT_LIMB_REGIONS: TemplateRegions = {
  px: [374, 355, 64, 128],
  nx: [440, 355, 64, 128],
  py: [308, 289, 64, 64],
  ny: [308, 485, 64, 64],
  pz: [308, 355, 64, 128],
  nz: [506, 355, 64, 128],
}

function buildConformalClothingGeo(
  sourceMesh: THREE.Mesh,
  regions: TemplateRegions,
  inflate: number
): THREE.BufferGeometry {
  const geo = sourceMesh.geometry.index
    ? sourceMesh.geometry.toNonIndexed()
    : sourceMesh.geometry.clone()
  geo.computeBoundingBox()
  const bb = geo.boundingBox ?? new THREE.Box3()
  const min = bb.min
  const size = new THREE.Vector3()
  bb.getSize(size)
  if (size.x < 0.0001) size.x = 1
  if (size.y < 0.0001) size.y = 1
  if (size.z < 0.0001) size.z = 1

  const pos = geo.getAttribute('position')
  const norm = geo.getAttribute('normal')
  const count = pos.count
  const uvs = new Float32Array(count * 2)

  // Detect meshes with inverted/inward-pointing normals (e.g. mirrored limbs)
  const center = new THREE.Vector3()
  bb.getCenter(center)
  let outwardDot = 0
  if (norm) {
    for (let i = 0; i < count; i++) {
      outwardDot +=
        (pos.getX(i) - center.x) * norm.getX(i) +
        (pos.getY(i) - center.y) * norm.getY(i) +
        (pos.getZ(i) - center.z) * norm.getZ(i)
    }
  }
  const outwardSign = outwardDot < 0 ? -1 : 1

  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  const fn = new THREE.Vector3()
  const vn = new THREE.Vector3()

  for (let i = 0; i + 2 < count; i += 3) {
    a.fromBufferAttribute(pos, i)
    b.fromBufferAttribute(pos, i + 1)
    c.fromBufferAttribute(pos, i + 2)
    ab.subVectors(b, a)
    ac.subVectors(c, a)
    fn.crossVectors(ab, ac).multiplyScalar(outwardSign)

    const ax = Math.abs(fn.x)
    const ay = Math.abs(fn.y)
    const az = Math.abs(fn.z)

    let axis: 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz' = 'pz'
    if (az >= ax && az >= ay) axis = fn.z >= 0 ? 'pz' : 'nz'
    else if (ax >= ay && ax >= az) axis = fn.x >= 0 ? 'px' : 'nx'
    else axis = fn.y >= 0 ? 'py' : 'ny'

    const [rx, ry, rw, rh] = regions[axis]

    for (let k = 0; k < 3; k++) {
      const idx = i + k
      const vx = pos.getX(idx)
      const vy = pos.getY(idx)
      const vz = pos.getZ(idx)

      const nx = (vx - min.x) / size.x
      const ny = (vy - min.y) / size.y
      const nz = (vz - min.z) / size.z

      let fu = 0.5
      let fv = 0.5
      if (axis === 'pz') { fu = nx; fv = 1 - ny }
      else if (axis === 'nz') { fu = 1 - nx; fv = 1 - ny }
      else if (axis === 'px') { fu = 1 - nz; fv = 1 - ny }
      else if (axis === 'nx') { fu = nz; fv = 1 - ny }
      else if (axis === 'py') { fu = nx; fv = nz }
      else { fu = nx; fv = 1 - nz }

      fu = Math.max(0.003, Math.min(0.997, fu))
      fv = Math.max(0.003, Math.min(0.997, fv))

      uvs[idx * 2] = (rx + fu * rw) / 585
      uvs[idx * 2 + 1] = 1 - (ry + fv * rh) / 559

      if (norm) {
        vn.fromBufferAttribute(norm, idx).normalize().multiplyScalar(outwardSign)
        pos.setXYZ(idx, vx + vn.x * inflate, vy + vn.y * inflate, vz + vn.z * inflate)
      }
    }
  }

  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  pos.needsUpdate = true
  return geo
}

export function applyAvatarToRiggedModel(
  model: THREE.Object3D,
  colors: BodyColors | null,
  sel?: ClothingSelection
): void {
  const prevOverlays: THREE.Mesh[] = []
  const slots: Partial<Record<'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg', THREE.Mesh>> = {}

  model.updateMatrixWorld(true)
  const modelInv = new THREE.Matrix4().copy(model.matrixWorld).invert()

  model.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return
    const mesh = obj as THREE.Mesh
    if (mesh.userData?.__noveloClothingOverlay) {
      prevOverlays.push(mesh)
      return
    }
    const partKey = resolveBodyPartKey(mesh.name)
    if (!partKey) return

    if (colors) {
      if (!mesh.userData.__noveloMatCloned) {
        const rawMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        const cloned = rawMats.map((m) => m.clone())
        mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0]
        mesh.userData.__noveloMatCloned = true
      }
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const m of mats) {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.color.set(colors[partKey])
          m.roughness = 0.52
          m.needsUpdate = true
        }
      }
    }

    if (partKey !== 'head') {
      slots[partKey] = mesh
    }
  })

  for (const old of prevOverlays) {
    old.parent?.remove(old)
    old.geometry.dispose()
    if (Array.isArray(old.material)) old.material.forEach((m) => m.dispose())
    else old.material.dispose()
  }

  if (!sel) return

  const makeTemplateMat = (src: string) => {
    const tex = new THREE.TextureLoader().load(src)
    tex.colorSpace = THREE.SRGBColorSpace
    return new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.65,
      metalness: 0,
      side: THREE.DoubleSide,
      depthWrite: true,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    })
  }

  const spawnOverlay = (
    key: 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg',
    regions: TemplateRegions,
    mat: THREE.MeshStandardMaterial,
    inflate: number
  ) => {
    const baseMesh = slots[key]
    if (!baseMesh || !baseMesh.parent) return
    const geo = buildConformalClothingGeo(baseMesh, regions, inflate)
    let overlay: THREE.Mesh
    if ((baseMesh as THREE.SkinnedMesh).isSkinnedMesh) {
      const srcSkinned = baseMesh as THREE.SkinnedMesh
      const skinned = new THREE.SkinnedMesh(geo, mat)
      skinned.bind(srcSkinned.skeleton, srcSkinned.bindMatrix)
      overlay = skinned
    } else {
      overlay = new THREE.Mesh(geo, mat)
      overlay.position.copy(baseMesh.position)
      overlay.quaternion.copy(baseMesh.quaternion)
      overlay.scale.copy(baseMesh.scale)
    }
    overlay.userData.__noveloClothingOverlay = true
    baseMesh.parent.add(overlay)
  }

  if (sel.pants) {
    const pantsMat = makeTemplateMat(sel.pants)
    spawnOverlay('torso', TORSO_REGIONS, pantsMat, 0.004)
    spawnOverlay('rightLeg', RIGHT_LIMB_REGIONS, pantsMat, 0.005)
    spawnOverlay('leftLeg', LEFT_LIMB_REGIONS, pantsMat, 0.005)
  }

  if (sel.shirt) {
    const shirtMat = makeTemplateMat(sel.shirt)
    spawnOverlay('torso', TORSO_REGIONS, shirtMat, 0.008)
    spawnOverlay('rightArm', RIGHT_LIMB_REGIONS, shirtMat, 0.008)
    spawnOverlay('leftArm', LEFT_LIMB_REGIONS, shirtMat, 0.008)
  }

  if (sel.tshirt && slots.torso) {
    const torsoMesh = slots.torso
    const box = new THREE.Box3().setFromObject(torsoMesh)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)
    const torsoParent = torsoMesh.parent || model
    const parentInv = new THREE.Matrix4().copy(torsoParent.matrixWorld).invert()
    const localPos = center.clone().applyMatrix4(parentInv)
    const pQuat = new THREE.Quaternion()
    torsoParent.getWorldQuaternion(pQuat)
    const mQuat = new THREE.Quaternion()
    model.getWorldQuaternion(mQuat)
    const localQuat = pQuat.clone().invert().multiply(mQuat)
    const pScale = new THREE.Vector3()
    torsoParent.getWorldScale(pScale)
    const mScale = new THREE.Vector3()
    model.getWorldScale(mScale)
    const localScale = new THREE.Vector3(
      mScale.x / (pScale.x || 1),
      mScale.y / (pScale.y || 1),
      mScale.z / (pScale.z || 1)
    )
    void modelInv

    const tex = new THREE.TextureLoader().load(sel.tshirt)
    tex.colorSpace = THREE.SRGBColorSpace
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.7,
      metalness: 0,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    })
    const decalSize = Math.min(size.x, size.y) * 0.75
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(decalSize, decalSize), mat)
    const frontOffset = new THREE.Vector3(0, 0, size.z * 0.5 + 0.028).applyQuaternion(localQuat)
    decal.position.copy(localPos).add(frontOffset)
    decal.quaternion.copy(localQuat)
    decal.scale.copy(localScale)
    decal.userData.__noveloClothingOverlay = true
    torsoParent.add(decal)
  }
}

interface PlayerModel3DProps {
  mode?: 'full' | 'headshot'
  interactive?: boolean
  className?: string
  bodyColors?: BodyColors
  clothing?: ClothingSelection
  useSavedColors?: boolean
  useSavedClothing?: boolean
  autoRotate?: boolean
  initialYaw?: number
}

export function PlayerModel3D({
  mode = 'full',
  interactive = false,
  className = '',
  bodyColors,
  clothing,
  useSavedColors = true,
  useSavedClothing = true,
  autoRotate = true,
  initialYaw,
}: PlayerModel3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const partMaterialsRef = useRef<Partial<Record<keyof BodyColors, THREE.MeshStandardMaterial[]>>>({})
  const clothingSlotsRef = useRef<Partial<Record<'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg', ClothingPartSlot>>>({})
  const clothingMeshesRef = useRef<THREE.Mesh[]>([])
  const [savedClothing, setSavedClothing] = useState<ClothingSelection>(() =>
    resolveEquippedClothing(loadEquippedClothingIds())
  )
  const effectiveClothing = clothing ?? (useSavedClothing ? savedClothing : undefined)
  const clothingRef = useRef<ClothingSelection | undefined>(effectiveClothing)
  clothingRef.current = effectiveClothing
  const applyClothingRef = useRef<((sel?: ClothingSelection) => void) | null>(null)
  const [savedColors, setSavedColors] = useState<BodyColors | null>(() => loadSavedBodyColors())
  const effectiveColors = bodyColors ?? (useSavedColors ? savedColors ?? undefined : undefined)
  const bodyColorsRef = useRef<BodyColors | undefined>(effectiveColors)
  bodyColorsRef.current = effectiveColors

  useEffect(() => {
    const syncClothing = () =>
      setSavedClothing(resolveEquippedClothing(loadEquippedClothingIds()))
    window.addEventListener(EQUIPPED_CLOTHING_EVENT, syncClothing)
    window.addEventListener(CLOTHING_UPDATED_EVENT, syncClothing)
    window.addEventListener('storage', syncClothing)
    return () => {
      window.removeEventListener(EQUIPPED_CLOTHING_EVENT, syncClothing)
      window.removeEventListener(CLOTHING_UPDATED_EVENT, syncClothing)
      window.removeEventListener('storage', syncClothing)
    }
  }, [])

  useEffect(() => {
    applyClothingRef.current?.(effectiveClothing)
  }, [effectiveClothing])

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<BodyColors>).detail
      setSavedColors(detail ?? loadSavedBodyColors())
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === AVATAR_COLORS_STORAGE_KEY) {
        setSavedColors(loadSavedBodyColors())
      }
    }
    window.addEventListener(AVATAR_COLORS_EVENT, onUpdate)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(AVATAR_COLORS_EVENT, onUpdate)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    const syncClothing = () =>
      setSavedClothing(resolveEquippedClothing(loadEquippedClothingIds()))
    window.addEventListener(EQUIPPED_CLOTHING_EVENT, syncClothing)
    window.addEventListener(CLOTHING_UPDATED_EVENT, syncClothing)
    window.addEventListener('storage', syncClothing)
    return () => {
      window.removeEventListener(EQUIPPED_CLOTHING_EVENT, syncClothing)
      window.removeEventListener(CLOTHING_UPDATED_EVENT, syncClothing)
      window.removeEventListener('storage', syncClothing)
    }
  }, [])

  useEffect(() => {
    applyClothingRef.current?.(effectiveClothing)
  }, [effectiveClothing])

  useEffect(() => {
    if (!effectiveColors) return
    const map = partMaterialsRef.current
    ;(Object.keys(effectiveColors) as (keyof BodyColors)[]).forEach((part) => {
      const mats = map[part]
      if (!mats) return
      for (const m of mats) {
        m.color.set(effectiveColors[part])
      }
    })
  }, [effectiveColors])

  useEffect(() => {
    const syncClothing = () =>
      setSavedClothing(resolveEquippedClothing(loadEquippedClothingIds()))
    window.addEventListener(EQUIPPED_CLOTHING_EVENT, syncClothing)
    window.addEventListener(CLOTHING_UPDATED_EVENT, syncClothing)
    window.addEventListener('storage', syncClothing)
    return () => {
      window.removeEventListener(EQUIPPED_CLOTHING_EVENT, syncClothing)
      window.removeEventListener(CLOTHING_UPDATED_EVENT, syncClothing)
      window.removeEventListener('storage', syncClothing)
    }
  }, [])

  useEffect(() => {
    applyClothingRef.current?.(effectiveClothing)
  }, [effectiveClothing])

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
    let yaw = initialYaw ?? (mode === 'headshot' ? 0.15 : 0.25)
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

      // Build rest-pose clothing attachment slots for Torso, Arms, and Legs
      const partMeshes: Partial<Record<'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg', THREE.Mesh>> = {}
      const partBones: Partial<Record<'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg', THREE.Object3D>> = {}
      model.traverse((obj) => {
        const clean = obj.name.toLowerCase().replace(/[^a-z0-9]/g, '')
        if ((obj as THREE.Mesh).isMesh) {
          if (clean.includes('torso')) partMeshes.torso = obj as THREE.Mesh
          else if (clean.includes('leftarm')) partMeshes.leftArm = obj as THREE.Mesh
          else if (clean.includes('rightarm')) partMeshes.rightArm = obj as THREE.Mesh
          else if (clean.includes('leftleg')) partMeshes.leftLeg = obj as THREE.Mesh
          else if (clean.includes('rightleg')) partMeshes.rightLeg = obj as THREE.Mesh
        }
        if ((obj as THREE.Bone).isBone) {
          if (clean === 'uppertorso') partBones.torso = obj
          else if (clean === 'upperarml') partBones.leftArm = obj
          else if (clean === 'upperarmr') partBones.rightArm = obj
          else if (clean === 'upperlegl') partBones.leftLeg = obj
          else if (clean === 'upperlegr') partBones.rightLeg = obj
        }
      })

      const slots: Partial<Record<'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg', ClothingPartSlot>> = {}
      ;(['torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'] as const).forEach((key) => {
        const mesh = partMeshes[key]
        if (!mesh) return
        const pBox = new THREE.Box3().setFromObject(mesh)
        if (pBox.isEmpty()) return
        const pSize = new THREE.Vector3()
        const pCenter = new THREE.Vector3()
        pBox.getSize(pSize)
        pBox.getCenter(pCenter)
        const attachParent = partBones[key] || mesh
        attachParent.updateMatrixWorld(true)
        const localPos = pCenter.clone()
        attachParent.worldToLocal(localPos)
        const pQuat = new THREE.Quaternion()
        attachParent.getWorldQuaternion(pQuat)
        const pScale = new THREE.Vector3()
        attachParent.getWorldScale(pScale)
        slots[key] = {
          mesh,
          attachParent,
          size: pSize,
          localPos,
          localQuat: pQuat.invert(),
          localScale: new THREE.Vector3(
            pScale.x > 0.0001 ? 1 / pScale.x : 1,
            pScale.y > 0.0001 ? 1 / pScale.y : 1,
            pScale.z > 0.0001 ? 1 / pScale.z : 1,
          ),
        }
      })
      clothingSlotsRef.current = slots

      const applyClothing = (sel?: ClothingSelection) => {
        for (const oldMesh of clothingMeshesRef.current) {
          oldMesh.parent?.remove(oldMesh)
          oldMesh.geometry.dispose()
          if (Array.isArray(oldMesh.material)) oldMesh.material.forEach((m) => m.dispose())
          else oldMesh.material.dispose()
        }
        clothingMeshesRef.current = []
        if (!sel || disposed) return

        const spawnConformalOverlay = (
          key: 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg',
          regions: TemplateRegions,
          mat: THREE.MeshStandardMaterial,
          inflate: number
        ) => {
          const slot = clothingSlotsRef.current[key]
          if (!slot || !slot.mesh.parent) return
          const geo = buildConformalClothingGeo(slot.mesh, regions, inflate)
          let overlay: THREE.Mesh
          if ((slot.mesh as THREE.SkinnedMesh).isSkinnedMesh) {
            const srcSkinned = slot.mesh as THREE.SkinnedMesh
            const skinned = new THREE.SkinnedMesh(geo, mat)
            skinned.bind(srcSkinned.skeleton, srcSkinned.bindMatrix)
            overlay = skinned
          } else {
            overlay = new THREE.Mesh(geo, mat)
            overlay.position.copy(slot.mesh.position)
            overlay.quaternion.copy(slot.mesh.quaternion)
            overlay.scale.copy(slot.mesh.scale)
          }
          slot.mesh.parent.add(overlay)
          clothingMeshesRef.current.push(overlay)
        }

        const makeTemplateMat = (src: string) => {
          const tex = new THREE.TextureLoader().load(src)
          tex.colorSpace = THREE.SRGBColorSpace
          return new THREE.MeshStandardMaterial({
            map: tex,
            transparent: true,
            alphaTest: 0.05,
            roughness: 0.65,
            metalness: 0,
            side: THREE.DoubleSide,
            depthWrite: true,
            polygonOffset: true,
            polygonOffsetFactor: -1,
          })
        }

        if (sel.pants) {
          const pantsMat = makeTemplateMat(sel.pants)
          spawnConformalOverlay('torso', TORSO_REGIONS, pantsMat, 0.004)
          spawnConformalOverlay('rightLeg', RIGHT_LIMB_REGIONS, pantsMat, 0.005)
          spawnConformalOverlay('leftLeg', LEFT_LIMB_REGIONS, pantsMat, 0.005)
        }

        if (sel.shirt) {
          const shirtMat = makeTemplateMat(sel.shirt)
          spawnConformalOverlay('torso', TORSO_REGIONS, shirtMat, 0.008)
          spawnConformalOverlay('rightArm', RIGHT_LIMB_REGIONS, shirtMat, 0.008)
          spawnConformalOverlay('leftArm', LEFT_LIMB_REGIONS, shirtMat, 0.008)
        }

        if (sel.tshirt) {
          const slot = clothingSlotsRef.current.torso
          if (slot) {
            const tex = new THREE.TextureLoader().load(sel.tshirt)
            tex.colorSpace = THREE.SRGBColorSpace
            const mat = new THREE.MeshStandardMaterial({
              map: tex,
              transparent: true,
              alphaTest: 0.05,
              roughness: 0.7,
              metalness: 0,
              depthWrite: false,
              polygonOffset: true,
              polygonOffsetFactor: -2,
            })
            const decalSize = Math.min(slot.size.x, slot.size.y) * 0.75
            const decal = new THREE.Mesh(new THREE.PlaneGeometry(decalSize, decalSize), mat)
            const frontOffset = new THREE.Vector3(0, 0, slot.size.z * 0.5 + 0.028)
            frontOffset.applyQuaternion(slot.localQuat)
            decal.position.copy(slot.localPos).add(frontOffset)
            decal.quaternion.copy(slot.localQuat)
            decal.scale.copy(slot.localScale)
            slot.attachParent.add(decal)
            clothingMeshesRef.current.push(decal)
          }
        }
      }

      applyClothingRef.current = applyClothing
      applyClothing(clothingRef.current)

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
      if (mixer) mixer.update(autoRotate || interactive ? dt : 0)
      if (mode === 'full' && autoRotate && !dragging) {
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
  }, [mode, interactive, autoRotate, initialYaw])

  return (
    <div
      ref={containerRef}
      className={className}
      style={interactive ? { cursor: 'grab' } : undefined}
    />
  )
}
