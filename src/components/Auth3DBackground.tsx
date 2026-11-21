import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type QualityPreset = 'Low' | 'Medium' | 'High' | 'Max'

const QUALITY_CONFIGS: Record<
  QualityPreset,
  {
    pixelRatioCap: number
    terrainSegments: number
    shadowMapSize: number
    shadows: boolean
    treeCount: number
    cloudCount: number
    islandCount: number
  }
> = {
  Low: { pixelRatioCap: 1, terrainSegments: 48, shadowMapSize: 512, shadows: false, treeCount: 18, cloudCount: 6, islandCount: 2 },
  Medium: { pixelRatioCap: 1.5, terrainSegments: 80, shadowMapSize: 1024, shadows: true, treeCount: 40, cloudCount: 10, islandCount: 3 },
  High: { pixelRatioCap: 2, terrainSegments: 112, shadowMapSize: 1024, shadows: true, treeCount: 65, cloudCount: 14, islandCount: 4 },
  Max: { pixelRatioCap: 2, terrainSegments: 144, shadowMapSize: 2048, shadows: true, treeCount: 95, cloudCount: 18, islandCount: 5 },
}

// Deterministic terrain height function for the 3D Novelo landscape
function terrainHeight(x: number, z: number): number {
  const dist = Math.sqrt(x * x + z * z)
  const ridge1 = Math.sin(x * 0.085) * Math.cos(z * 0.085) * 4.8
  const ridge2 = Math.sin(x * 0.19 + 1.2) * Math.sin(z * 0.16 - 0.6) * 2.1
  const detail = Math.cos((x + z) * 0.35) * 0.55
  // Carve a central valley/lake basin near origin and rise into mountains further out
  const basin = -3.2 * Math.exp(-(dist * dist) / 260)
  const rim = Math.max(0, (dist - 18) * 0.24)
  return ridge1 + ridge2 + detail + basin + rim
}

export function Auth3DBackground({ quality = 'Max' }: { quality?: QualityPreset }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cfg = QUALITY_CONFIGS[quality]

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      })
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
    scene.background = new THREE.Color('#0b0d14')
    scene.fog = new THREE.FogExp2('#0d1018', 0.015)

    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.2,
      220,
    )

    // Sky gradient dome (Twilight / Sunset atmosphere)
    const skyGeo = new THREE.SphereGeometry(160, 32, 24)
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        topColor: { value: new THREE.Color('#070912') },
        midColor: { value: new THREE.Color('#161b2e') },
        horizonColor: { value: new THREE.Color('#2c2538') },
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
        uniform vec3 midColor;
        uniform vec3 horizonColor;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          vec3 col = mix(horizonColor, midColor, smoothstep(-0.05, 0.28, h));
          col = mix(col, topColor, smoothstep(0.28, 0.85, h));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    scene.add(new THREE.Mesh(skyGeo, skyMat))

    // Lighting
    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.7)
    scene.add(hemi)

    const sunLight = new THREE.DirectionalLight(0xffd6a5, 2.2)
    sunLight.position.set(34, 28, -26)
    if (cfg.shadows) {
      sunLight.castShadow = true
      sunLight.shadow.mapSize.set(cfg.shadowMapSize, cfg.shadowMapSize)
      sunLight.shadow.camera.near = 5
      sunLight.shadow.camera.far = 130
      const d = 48
      sunLight.shadow.camera.left = -d
      sunLight.shadow.camera.right = d
      sunLight.shadow.camera.top = d
      sunLight.shadow.camera.bottom = -d
      sunLight.shadow.bias = -0.0005
    }
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x6366f1, 0.75)
    fillLight.position.set(-28, 12, 24)
    scene.add(fillLight)

    // Terrain mesh with vertex colors (sand, grass, rock, snow)
    const size = 120
    const terrainGeo = new THREE.PlaneGeometry(size, size, cfg.terrainSegments, cfg.terrainSegments)
    terrainGeo.rotateX(-Math.PI / 2)

    const posAttr = terrainGeo.attributes.position
    const colors = new Float32Array(posAttr.count * 3)
    const cSand = new THREE.Color('#8a7d65')
    const cGrass = new THREE.Color('#2f5e3c')
    const cForest = new THREE.Color('#1f452c')
    const cRock = new THREE.Color('#3b3f4c')
    const cSnow = new THREE.Color('#cbd5e1')
    const tmpColor = new THREE.Color()

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const z = posAttr.getZ(i)
      const y = terrainHeight(x, z)
      posAttr.setY(i, y)

      if (y < -0.3) {
        tmpColor.copy(cSand)
      } else if (y < 2.2) {
        tmpColor.copy(cGrass).lerp(cForest, Math.min(1, (y + 0.3) / 2.5))
      } else if (y < 5.8) {
        tmpColor.copy(cForest).lerp(cRock, (y - 2.2) / 3.6)
      } else {
        tmpColor.copy(cRock).lerp(cSnow, Math.min(1, (y - 5.8) / 3.2))
      }

      colors[i * 3] = tmpColor.r
      colors[i * 3 + 1] = tmpColor.g
      colors[i * 3 + 2] = tmpColor.b
    }

    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    terrainGeo.computeVertexNormals()

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.05,
    })
    const terrain = new THREE.Mesh(terrainGeo, terrainMat)
    terrain.receiveShadow = cfg.shadows
    terrain.castShadow = cfg.shadows
    scene.add(terrain)

    // Water lake plane in the basin
    const waterGeo = new THREE.PlaneGeometry(size, size)
    waterGeo.rotateX(-Math.PI / 2)
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x16324f,
      roughness: 0.14,
      metalness: 0.65,
      transparent: true,
      opacity: 0.86,
    })
    const water = new THREE.Mesh(waterGeo, waterMat)
    water.position.y = -0.55
    water.receiveShadow = cfg.shadows
    scene.add(water)

    // Stylized low-poly pine trees placed on grass slopes
    const trunkGeo = new THREE.CylinderGeometry(0.14, 0.2, 0.9, 6)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.9 })
    const foliageGeo = new THREE.ConeGeometry(0.85, 2.2, 7)
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x245435, roughness: 0.85 })

    let placed = 0
    for (let i = 0; i < cfg.treeCount * 3 && placed < cfg.treeCount; i++) {
      // Deterministic pseudo-random spread
      const rx = Math.sin(i * 12.9898) * 43758.5453
      const rz = Math.sin(i * 78.233) * 43758.5453
      const x = ((rx - Math.floor(rx)) - 0.5) * 78
      const z = ((rz - Math.floor(rz)) - 0.5) * 78
      const y = terrainHeight(x, z)
      if (y > 0.1 && y < 4.2) {
        const tree = new THREE.Group()
        const trunk = new THREE.Mesh(trunkGeo, trunkMat)
        trunk.position.y = 0.45
        trunk.castShadow = cfg.shadows
        const crown = new THREE.Mesh(foliageGeo, foliageMat)
        crown.position.y = 1.8
        crown.castShadow = cfg.shadows
        const scale = 0.75 + ((i % 5) * 0.12)
        tree.add(trunk, crown)
        tree.position.set(x, y - 0.05, z)
        tree.scale.setScalar(scale)
        scene.add(tree)
        placed++
      }
    }

    // Floating sky islands
    const islands: { group: THREE.Group; baseY: number; phase: number }[] = []
    const islandTopMat = new THREE.MeshStandardMaterial({ color: 0x2f5e3c, roughness: 0.85 })
    const islandRockMat = new THREE.MeshStandardMaterial({ color: 0x3b3f4c, roughness: 0.9 })
    for (let i = 0; i < cfg.islandCount; i++) {
      const group = new THREE.Group()
      const angle = (i / cfg.islandCount) * Math.PI * 2 + 0.5
      const radius = 20 + (i % 2) * 8
      const baseY = 9.5 + (i % 3) * 2.5

      const top = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.4, 0.65, 7), islandTopMat)
      top.castShadow = cfg.shadows
      const underside = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.8, 7), islandRockMat)
      underside.rotation.x = Math.PI
      underside.position.y = -1.7
      underside.castShadow = cfg.shadows
      group.add(top, underside)
      group.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius)
      scene.add(group)
      islands.push({ group, baseY, phase: i * 1.4 })
    }

    // Drifting clouds
    const clouds: { mesh: THREE.Mesh; speed: number; limit: number }[] = []
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 1,
      transparent: true,
      opacity: 0.25,
    })
    for (let i = 0; i < cfg.cloudCount; i++) {
      const w = 5 + (i % 4) * 2.5
      const cloud = new THREE.Mesh(new THREE.BoxGeometry(w, 0.85, 2.6 + (i % 3)), cloudMat)
      const cx = (((i * 37) % 100) - 50) * 1.1
      const cz = (((i * 61) % 100) - 50) * 1.1
      cloud.position.set(cx, 15 + (i % 4) * 2.2, cz)
      scene.add(cloud)
      clouds.push({ mesh: cloud, speed: 0.35 + (i % 3) * 0.15, limit: 60 })
    }

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

      // Smooth scenic flyover around the lake & mountain peaks
      const orbit = t * 0.06
      camera.position.x = Math.sin(orbit) * 24
      camera.position.z = Math.cos(orbit) * 24
      camera.position.y = 7.5 + Math.sin(t * 0.18) * 1.1
      camera.lookAt(Math.sin(orbit + 0.6) * 4, 1.5, Math.cos(orbit + 0.6) * 4)

      for (const isl of islands) {
        isl.group.position.y = isl.baseY + Math.sin(t * 0.7 + isl.phase) * 0.45
      }

      for (const c of clouds) {
        c.mesh.position.x += c.speed * 0.016
        if (c.mesh.position.x > c.limit) c.mesh.position.x = -c.limit
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
  }, [quality])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
