import * as THREE from 'three'
export type Vec3 = [number, number, number]

export type TerrainBiome =
  | 'Arctic'
  | 'Dunes'
  | 'Canyons'
  | 'Lavascape'
  | 'Water'
  | 'Mountains'
  | 'Hills'
  | 'Plains'
  | 'Marsh'

export type TerrainSculptTool = 'add' | 'subtract' | 'smooth' | 'flatten' | 'paint'

export type TerrainPaintMaterial = 'Grass' | 'Rock' | 'Sand' | 'Snow' | 'Basalt'

export interface TerrainGenerateConfig {
  size: Vec3
  position: Vec3
  biomes: TerrainBiome[]
  blending: number
  biomeSize: number
  seed: number
}

const PAINT_COLORS: Record<TerrainPaintMaterial, THREE.Color> = {
  Grass: new THREE.Color('#4b974b'),
  Rock: new THREE.Color('#64748b'),
  Sand: new THREE.Color('#e6c280'),
  Snow: new THREE.Color('#f1f5f9'),
  Basalt: new THREE.Color('#27272a'),
}

// Deterministic hash-based 2D value noise for seeded terrain generation
function hash2D(ix: number, iz: number, seed: number): number {
  let n = Math.imul(ix, 374761393) + Math.imul(iz, 668265263) + Math.imul(seed | 0, 1442695041)
  n = (n ^ (n >>> 13)) | 0
  n = Math.imul(n, 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295
}

function smoothNoise2D(x: number, z: number, seed: number): number {
  const ix = Math.floor(x)
  const iz = Math.floor(z)
  const fx = x - ix
  const fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uz = fz * fz * (3 - 2 * fz)

  const a = hash2D(ix, iz, seed)
  const b = hash2D(ix + 1, iz, seed)
  const c = hash2D(ix, iz + 1, seed)
  const d = hash2D(ix + 1, iz + 1, seed)

  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz
}

function fbm2D(x: number, z: number, seed: number, octaves = 4): number {
  let total = 0
  let amp = 0.5
  let freq = 1
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    total += smoothNoise2D(x * freq, z * freq, seed + i * 101) * amp
    norm += amp
    amp *= 0.5
    freq *= 2.05
  }
  return total / norm
}

function createTerrainDetailTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(size, size)
  const data = img.data
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n1 = smoothNoise2D(x * 0.16, y * 0.16, 101)
      const n2 = smoothNoise2D(x * 0.48, y * 0.48, 307)
      const grain = hash2D(x, y, 709)
      const val = Math.round((0.45 + n1 * 0.25 + n2 * 0.16 + grain * 0.24) * 240)
      const c = Math.max(85, Math.min(255, val))
      const i = (y * size + x) * 4
      data[i] = c
      data[i + 1] = c
      data[i + 2] = c
      data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(80, 80)
  tex.needsUpdate = true
  return tex
}

function createBarkTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(size, size)
  const data = img.data
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Deep vertical bark ridges + horizontal cracks
      const furrow = smoothNoise2D(x * 0.22, y * 0.035, 511)
      const crack = Math.pow(smoothNoise2D(x * 0.45, y * 0.08, 619), 2.0)
      const micro = hash2D(x, y, 823) * 0.15
      const v = 0.28 + furrow * 0.42 + crack * 0.22 + micro
      const i = (y * size + x) * 4
      data[i] = Math.min(255, Math.round(v * 145))
      data[i + 1] = Math.min(255, Math.round(v * 98))
      data[i + 2] = Math.min(255, Math.round(v * 64))
      data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 5)
  tex.needsUpdate = true
  return tex
}

function createLeafClusterTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)

  const cx = size / 2
  const cy = size / 2

  // Draw branching woody twigs radiating from center + forks
  ctx.strokeStyle = '#332419'
  ctx.lineCap = 'round'
  for (let b = 0; b < 8; b++) {
    const a = (b / 8) * Math.PI * 2 + 0.2
    const ex = cx + Math.cos(a) * size * 0.36
    const ey = cy + Math.sin(a) * size * 0.36
    ctx.lineWidth = 3.2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(ex, ey)
    ctx.stroke()

    // Sub-fork
    ctx.lineWidth = 1.8
    const fa = a + (b % 2 === 0 ? 0.55 : -0.55)
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * size * 0.18, cy + Math.sin(a) * size * 0.18)
    ctx.lineTo(cx + Math.cos(a) * size * 0.18 + Math.cos(fa) * size * 0.16, cy + Math.sin(a) * size * 0.18 + Math.sin(fa) * size * 0.16)
    ctx.stroke()
  }

  // 220 crisp veined leaves with natural light/dark variation and air gaps
  for (let i = 0; i < 220; i++) {
    const h1 = Math.sin(i * 12.9898) * 43758.5453
    const h2 = Math.sin(i * 78.233) * 43758.5453
    const r1 = h1 - Math.floor(h1)
    const r2 = h2 - Math.floor(h2)
    const angle = r1 * Math.PI * 2
    const dist = Math.sqrt(r2) * size * 0.42
    const lx = cx + Math.cos(angle) * dist
    const ly = cy + Math.sin(angle) * dist

    ctx.save()
    ctx.translate(lx, ly)
    ctx.rotate(angle + (r1 - 0.5) * 1.2)
    const shade = 135 + ((i * 29) % 105)
    const rCol = Math.round(shade * 0.68)
    const gCol = shade
    const bCol = Math.round(shade * 0.54)
    ctx.fillStyle = `rgb(${rCol}, ${gCol}, ${bCol})`
    const lw = size * (0.036 + (i % 3) * 0.008)
    const lh = size * (0.017 + (i % 3) * 0.004)
    ctx.beginPath()
    ctx.moveTo(-lw, 0)
    ctx.quadraticCurveTo(0, -lh, lw, 0)
    ctx.quadraticCurveTo(0, lh, -lw, 0)
    ctx.fill()

    // Subtle midrib vein
    ctx.strokeStyle = `rgba(${Math.min(255, rCol + 25)}, ${Math.min(255, gCol + 30)}, ${bCol}, 0.45)`
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(-lw * 0.75, 0)
    ctx.lineTo(lw * 0.75, 0)
    ctx.stroke()
    ctx.restore()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function buildBranchingTreeGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = []
  const addCyl = (rTop: number, rBot: number, h: number, pos: [number, number, number], rot: [number, number, number]) => {
    const g = new THREE.CylinderGeometry(rTop, rBot, h, 6)
    g.translate(0, h / 2, 0)
    g.rotateX(rot[0])
    g.rotateZ(rot[2])
    g.rotateY(rot[1])
    g.translate(pos[0], pos[1], pos[2])
    parts.push(g)
  }

  // Main tapered trunk
  addCyl(0.09, 0.24, 3.6, [0, 0, 0], [0, 0, 0])

  // 5 spreading primary branches connecting trunk to canopy leaf clusters
  const branches: { y: number; yaw: number; tilt: number; len: number }[] = [
    { y: 2.1, yaw: 0.2, tilt: 0.68, len: 1.75 },
    { y: 2.35, yaw: 1.45, tilt: 0.62, len: 1.85 },
    { y: 2.55, yaw: 2.7, tilt: 0.65, len: 1.7 },
    { y: 2.75, yaw: 3.95, tilt: 0.58, len: 1.65 },
    { y: 3.0, yaw: 5.2, tilt: 0.52, len: 1.55 },
    { y: 3.3, yaw: 0.8, tilt: 0.22, len: 1.4 },
  ]
  for (const b of branches) {
    addCyl(0.035, 0.085, b.len, [0, b.y, 0], [b.tilt, b.yaw, 0])
  }

  // Merge geometries into single BufferGeometry (including UVs for bark texture)
  let totalVerts = 0
  for (const p of parts) totalVerts += p.attributes.position.count
  const posArr = new Float32Array(totalVerts * 3)
  const normArr = new Float32Array(totalVerts * 3)
  const uvArr = new Float32Array(totalVerts * 2)
  const indices: number[] = []
  let vOff = 0
  for (const p of parts) {
    posArr.set(p.attributes.position.array as Float32Array, vOff * 3)
    normArr.set(p.attributes.normal.array as Float32Array, vOff * 3)
    if (p.attributes.uv) {
      uvArr.set(p.attributes.uv.array as Float32Array, vOff * 2)
    }
    if (p.index) {
      for (const id of p.index.array) indices.push(id + vOff)
    }
    vOff += p.attributes.position.count
    p.dispose()
  }
  const merged = new THREE.BufferGeometry()
  merged.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
  merged.setAttribute('normal', new THREE.BufferAttribute(normArr, 3))
  merged.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2))
  merged.setIndex(indices)
  return merged
}

export class TerrainSurface {
  public group = new THREE.Group()
  public mesh: THREE.Mesh | null = null
  public waterMesh: THREE.Mesh | null = null
  private waterUniforms: { uTime: { value: number } } | null = null
  private terrainTex: THREE.Texture | null = null
  private barkTex: THREE.Texture | null = null
  private leafTex: THREE.Texture | null = null
  private terrainGrassMesh: THREE.InstancedMesh | null = null
  private terrainGrassMat: THREE.MeshStandardMaterial | null = null
  private treeTrunksMesh: THREE.InstancedMesh | null = null
  private treeLeavesMesh: THREE.InstancedMesh | null = null
  private treeLeavesMat: THREE.MeshStandardMaterial | null = null
  private geometry: THREE.PlaneGeometry | null = null
  private segX = 96
  private segZ = 96
  private width = 96
  private depth = 76
  private origin: Vec3 = [0, 0, 0]

  public generate(cfg: TerrainGenerateConfig): void {
    this.clear()

    this.width = Math.max(8, cfg.size[0])
    const maxHeight = Math.max(2, cfg.size[1])
    this.depth = Math.max(8, cfg.size[2])
    this.origin = [...cfg.position]

    this.segX = Math.min(200, Math.max(48, Math.round(this.width * 0.85)))
    this.segZ = Math.min(200, Math.max(48, Math.round(this.depth * 0.85)))

    const geom = new THREE.PlaneGeometry(this.width, this.depth, this.segX, this.segZ)
    geom.rotateX(-Math.PI / 2)

    const posAttr = geom.attributes.position
    const count = posAttr.count
    const colors = new Float32Array(count * 3)

    const activeBiomes: TerrainBiome[] =
      cfg.biomes.length > 0 ? cfg.biomes : ['Mountains', 'Hills', 'Plains', 'Water']
    const nonWaterBiomes = activeBiomes.filter((b) => b !== 'Water')
    const biomeList = nonWaterBiomes.length > 0 ? nonWaterBiomes : (['Plains'] as TerrainBiome[])
    const hasWater = activeBiomes.includes('Water')

    const freqScale = 1 / Math.max(18, cfg.biomeSize * 0.55)
    const tmpColor = new THREE.Color()
    const blendColor = new THREE.Color()

    const sampleBiome = (biome: TerrainBiome, wx: number, wz: number, n1: number, n2: number) => {
      const ridge = 1 - Math.abs(n1 * 2 - 1)
      let hNorm = n1
      let hex = '#4b974b'
      switch (biome) {
        case 'Mountains':
          hNorm = Math.pow(ridge, 1.8) * 1.1 + Math.pow(n1, 1.35) * 0.45 + n2 * 0.18
          hex = hNorm > 0.72 ? '#e2e8f0' : hNorm > 0.42 ? '#64748b' : '#3b7a48'
          break
        case 'Hills':
          hNorm = n1 * 0.58 + n2 * 0.16 + 0.08
          hex = hNorm > 0.48 ? '#4e7343' : '#3b7a48'
          break
        case 'Plains':
          hNorm = n1 * 0.24 + n2 * 0.06 + 0.06
          hex = '#3f8a47'
          break
        case 'Dunes':
          hNorm = Math.abs(Math.sin(wx * freqScale * 3.5 + n1 * 4)) * 0.35 + n1 * 0.22
          hex = '#e6c280'
          break
        case 'Arctic':
          hNorm = Math.pow(ridge, 1.4) * 0.65 + n1 * 0.25 + 0.08
          hex = hNorm > 0.32 ? '#f1f5f9' : '#93c5fd'
          break
        case 'Canyons':
          hNorm = (Math.floor(n1 * 6) / 6) * 0.85 + 0.08
          hex = hNorm > 0.45 ? '#c2593f' : '#9a3412'
          break
        case 'Lavascape':
          hNorm = Math.pow(ridge, 1.9) * 0.85
          hex = hNorm < 0.18 ? '#ea580c' : '#27272a'
          break
        case 'Marsh':
          hNorm = n1 * 0.2
          hex = hNorm < 0.1 ? '#0e7490' : '#3f6212'
          break
        default:
          hNorm = n1 * 0.3
          hex = '#4b974b'
      }
      return { hNorm, hex }
    }

    for (let i = 0; i < count; i++) {
      const lx = posAttr.getX(i)
      const lz = posAttr.getZ(i)
      const wx = lx + this.origin[0]
      const wz = lz + this.origin[2]

      const biomeNoise = fbm2D(wx * freqScale * 0.42, wz * freqScale * 0.42, cfg.seed + 999, 2)
      const scaled = biomeNoise * biomeList.length
      const bIdx = Math.min(biomeList.length - 1, Math.floor(scaled))
      const nextIdx = Math.min(biomeList.length - 1, bIdx + 1)
      const frac = Math.max(0, Math.min(1, scaled - bIdx))
      const blendT = cfg.blending > 0 ? Math.max(0, Math.min(1, (frac - (1 - cfg.blending)) / Math.max(0.01, cfg.blending))) : 0

      const n1 = fbm2D(wx * freqScale, wz * freqScale, cfg.seed, 5)
      const n2 = fbm2D(wx * freqScale * 2.4, wz * freqScale * 2.4, cfg.seed + 313, 3)

      const s1 = sampleBiome(biomeList[bIdx], wx, wz, n1, n2)
      const s2 = sampleBiome(biomeList[nextIdx], wx, wz, n1, n2)

      let hNorm = THREE.MathUtils.lerp(s1.hNorm, s2.hNorm, blendT)
      tmpColor.set(s1.hex).lerp(blendColor.set(s2.hex), blendT)

      // Smoothly blend edges to ground level
      const edgeX = 1 - Math.pow(Math.abs(lx) / (this.width * 0.5), 6)
      const edgeZ = 1 - Math.pow(Math.abs(lz) / (this.depth * 0.5), 6)
      const edgeMask = Math.max(0, Math.min(1, edgeX * edgeZ))

      const y = hNorm * maxHeight * edgeMask
      if (hasWater && y < maxHeight * 0.16) {
        tmpColor.lerp(blendColor.set('#d9bc82'), 0.65)
      }
      posAttr.setY(i, y)

      colors[i * 3] = tmpColor.r
      colors[i * 3 + 1] = tmpColor.g
      colors[i * 3 + 2] = tmpColor.b
    }

    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geom.computeVertexNormals()

    const terrainTex = createTerrainDetailTexture(512)
    this.terrainTex = terrainTex
    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      map: terrainTex,
      bumpMap: terrainTex,
      bumpScale: 1.15,
      roughness: 0.92,
      metalness: 0.02,
      flatShading: false,
    })

    const mesh = new THREE.Mesh(geom, mat)
    mesh.position.set(this.origin[0], this.origin[1], this.origin[2])
    mesh.receiveShadow = true
    mesh.castShadow = true
    mesh.userData.isTerrain = true

    this.geometry = geom
    this.mesh = mesh
    this.group.add(mesh)

    const waterLevel = this.origin[1] + maxHeight * 0.16

    if (hasWater) {
      const waterGeom = new THREE.PlaneGeometry(this.width, this.depth, 96, 96)
      waterGeom.rotateX(-Math.PI / 2)
      const uniforms = { uTime: { value: 0 } }
      this.waterUniforms = uniforms
      const waterMat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        vertexShader: `
          uniform float uTime;
          varying vec3 vWorldPos;
          void main() {
            vec3 p = position;
            p.y += sin(p.x * 0.18 + uTime * 1.1) * 0.08 + cos(p.z * 0.15 + uTime * 0.9) * 0.07;
            vec4 wp = modelMatrix * vec4(p, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vWorldPos;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }
          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 4; i++) {
              v += a * noise(p);
              p = p * 2.05 + vec2(17.3, 9.2);
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec2 uv = vWorldPos.xz * 0.55;
            float e = 0.05;
            float h0 = fbm(uv + vec2(uTime * 0.16, uTime * 0.11)) + 0.35 * fbm(uv * 2.7 - vec2(uTime * 0.24, 0.0));
            float hx = fbm(uv + vec2(e, 0.0) + vec2(uTime * 0.16, uTime * 0.11)) + 0.35 * fbm((uv + vec2(e, 0.0)) * 2.7 - vec2(uTime * 0.24, 0.0));
            float hz = fbm(uv + vec2(0.0, e) + vec2(uTime * 0.16, uTime * 0.11)) + 0.35 * fbm((uv + vec2(0.0, e)) * 2.7 - vec2(uTime * 0.24, 0.0));
            vec3 normal = normalize(vec3((h0 - hx) * 4.2, 1.0, (h0 - hz) * 4.2));

            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

            vec3 sunDir = normalize(vec3(-0.65, 0.35, -0.55));
            vec3 halfDir = normalize(sunDir + viewDir);
            float spec = pow(max(dot(normal, halfDir), 0.0), 220.0);

            vec3 clearWater = vec3(0.05, 0.35, 0.46);
            float caustic = pow(clamp(fbm(uv * 2.4 - vec2(uTime * 0.25, -uTime * 0.19)), 0.0, 1.0), 2.1);
            clearWater += vec3(0.14, 0.32, 0.38) * caustic;

            vec3 skyRefl = mix(vec3(0.42, 0.7, 0.88), vec3(0.95, 0.72, 0.52), 0.42);
            vec3 col = mix(clearWater, skyRefl, clamp(fresnel * 0.88, 0.0, 0.88));
            col += vec3(1.0, 0.94, 0.82) * spec * 1.8;

            float alpha = clamp(0.44 + fresnel * 0.48 + caustic * 0.08, 0.44, 0.92);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      })
      const water = new THREE.Mesh(waterGeom, waterMat)
      water.position.set(this.origin[0], waterLevel, this.origin[2])
      this.waterMesh = water
      this.group.add(water)
    }

    // Collect grassy terrain points for 3D grass leaves + custom leafy trees
    const grassPoints: { x: number; y: number; z: number; r: number; g: number; b: number }[] = []
    for (let i = 0; i < count; i++) {
      const y = this.origin[1] + posAttr.getY(i)
      if (hasWater && y <= waterLevel + 0.35) continue
      const r = colors[i * 3]
      const g = colors[i * 3 + 1]
      const b = colors[i * 3 + 2]
      if (g > r * 1.08 && g > b * 1.12) {
        grassPoints.push({
          x: this.origin[0] + posAttr.getX(i),
          y,
          z: this.origin[2] + posAttr.getZ(i),
          r,
          g,
          b,
        })
      }
    }

    if (grassPoints.length > 0) {
      // 1. Dense 6-blade swaying grass clusters across grassy terrain slopes
      const makeBlade = (ox: number, oz: number, rotY: number, tilt: number, hScale: number) => {
        const g = new THREE.PlaneGeometry(0.18, 0.56 * hScale, 1, 2)
        g.translate(0, 0.28 * hScale, 0)
        const p = g.attributes.position
        const n = g.attributes.normal
        for (let i = 0; i < p.count; i++) {
          const h = p.getY(i) / (0.56 * hScale)
          p.setX(i, p.getX(i) * (1 - h * 0.88))
          p.setZ(i, h * h * tilt)
          n.setXYZ(i, 0, 1, 0)
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
      const totalV = subBlades.reduce((a, s) => a + s.attributes.position.count, 0)
      const pArr = new Float32Array(totalV * 3)
      const nArr = new Float32Array(totalV * 3)
      const idxs: number[] = []
      let vOff = 0
      for (const s of subBlades) {
        pArr.set(s.attributes.position.array as Float32Array, vOff * 3)
        nArr.set(s.attributes.normal.array as Float32Array, vOff * 3)
        for (const id of s.index!.array) idxs.push(id + vOff)
        vOff += s.attributes.position.count
        s.dispose()
      }
      const grassGeo = new THREE.BufferGeometry()
      grassGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3))
      grassGeo.setAttribute('normal', new THREE.BufferAttribute(nArr, 3))
      grassGeo.setIndex(idxs)

      const grassMat = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.85,
        metalness: 0,
        emissive: new THREE.Color('#19381f'),
        emissiveIntensity: 0.45,
        side: THREE.DoubleSide,
      })
      grassMat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = { value: 0 }
        grassMat.userData.shader = shader
        shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          float hFactor = clamp(position.y / 0.56, 0.0, 1.0);
          vec4 worldInst = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          float distCam = length(cameraPosition - worldInst.xyz);
          float distFade = 1.0 - smoothstep(42.0, 88.0, distCam);
          float sway = sin(uTime * 2.0 + worldInst.x * 0.35 + worldInst.z * 0.25) * 0.16 * hFactor * hFactor;
          transformed.y *= distFade;
          transformed.x += sway * distFade;
          transformed.z += sway * 0.6 * distFade;`,
        )
      }

      const grassCount = Math.min(24000, grassPoints.length)
      const grassInst = new THREE.InstancedMesh(grassGeo, grassMat, grassCount)
      grassInst.receiveShadow = true
      const dummy = new THREE.Object3D()
      const tmpC = new THREE.Color()
      const stride = Math.max(1, Math.floor(grassPoints.length / grassCount))
      for (let i = 0; i < grassCount; i++) {
        const pt = grassPoints[(i * stride) % grassPoints.length]
        const rx = Math.sin(i * 12.9898) * 43758.5453
        const rz = Math.sin(i * 78.233) * 43758.5453
        dummy.position.set(
          pt.x + ((rx - Math.floor(rx)) - 0.5) * 0.8,
          pt.y - 0.05,
          pt.z + ((rz - Math.floor(rz)) - 0.5) * 0.8,
        )
        dummy.rotation.set(0, rx % 6.28, 0)
        const sc = 0.85 + (i % 5) * 0.14
        dummy.scale.set(sc, sc * (0.9 + (i % 3) * 0.18), sc)
        dummy.updateMatrix()
        grassInst.setMatrixAt(i, dummy.matrix)
        tmpC.setRGB(pt.r, pt.g, pt.b).offsetHSL(0.01 * ((i % 3) - 1), 0.06, 0.08)
        grassInst.setColorAt(i, tmpC)
      }
      grassInst.instanceMatrix.needsUpdate = true
      if (grassInst.instanceColor) grassInst.instanceColor.needsUpdate = true
      this.terrainGrassMat = grassMat
      this.terrainGrassMesh = grassInst
      this.group.add(grassInst)

      // 2. Custom Leafy Trees (branching 3D skeleton + 512px veined leaf sprigs)
      const treeCandidates = grassPoints.filter((pt) => pt.y < this.origin[1] + maxHeight * 0.62)
      const treeCount = Math.min(200, Math.max(30, Math.floor(treeCandidates.length / 150)))
      if (treeCandidates.length > 0 && treeCount > 0) {
        const trunkGeo = buildBranchingTreeGeometry()
        const barkTex = createBarkTexture(512)
        this.barkTex = barkTex
        const trunkMat = new THREE.MeshStandardMaterial({
          map: barkTex,
          bumpMap: barkTex,
          bumpScale: 0.45,
          roughness: 0.94,
        })
        const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount)
        trunks.castShadow = true
        trunks.receiveShadow = true

        const leafTex = createLeafClusterTexture(512)
        leafTex.anisotropy = 8
        leafTex.minFilter = THREE.LinearMipmapLinearFilter
        leafTex.magFilter = THREE.LinearFilter
        this.leafTex = leafTex
        const leafCardGeo = new THREE.PlaneGeometry(2.35, 2.35)
        const leafMat = new THREE.MeshStandardMaterial({
          map: leafTex,
          alphaTest: 0.2,
          alphaToCoverage: true,
          roughness: 0.78,
          metalness: 0,
          emissive: new THREE.Color('#1c3f21'),
          emissiveIntensity: 0.32,
          side: THREE.DoubleSide,
        })
        const leavesPerTree = 56
        const leaves = new THREE.InstancedMesh(leafCardGeo, leafMat, treeCount * leavesPerTree)
        leaves.castShadow = true
        leaves.receiveShadow = true

        const leafPalette = ['#4f7f4c', '#5d8f56', '#6ca161', '#437043', '#75ab66']
        let leafIdx = 0

        for (let t = 0; t < treeCount; t++) {
          const hashT = Math.sin(t * 91.73 + 17.3) * 43758.5453
          const randIdx = Math.floor((hashT - Math.floor(hashT)) * treeCandidates.length)
          const pt = treeCandidates[randIdx]
          const s = 0.92 + (t % 5) * 0.16
          const rotY = (t * 2.39996) % (Math.PI * 2)

          dummy.position.set(pt.x, pt.y - 0.15, pt.z)
          dummy.rotation.set(0, rotY, 0)
          dummy.scale.set(s, s, s)
          dummy.updateMatrix()
          trunks.setMatrixAt(t, dummy.matrix)

          for (let l = 0; l < leavesPerTree; l++) {
            const angle = (l / leavesPerTree) * Math.PI * 2 * 4.3 + rotY
            const tier = l < 18 ? 0 : l < 36 ? 1 : l < 48 ? 2 : 3
            const radius = tier === 0 ? 1.45 : tier === 1 ? 1.2 : tier === 2 ? 0.78 : 0.28
            const ly = tier === 0 ? 2.8 : tier === 1 ? 3.7 : tier === 2 ? 4.55 : 5.25
            dummy.position.set(
              pt.x + Math.cos(angle) * radius * s,
              pt.y + (ly + ((l % 3) - 1) * 0.24) * s,
              pt.z + Math.sin(angle) * radius * s,
            )
            dummy.rotation.set(
              ((l % 5) - 2) * 0.36,
              angle + l * 0.9,
              ((l % 3) - 1) * 0.42,
            )
            const ls = s * (0.85 + (l % 3) * 0.18)
            dummy.scale.set(ls, ls, ls)
            dummy.updateMatrix()
            leaves.setMatrixAt(leafIdx, dummy.matrix)
            tmpC.set(leafPalette[(t + l) % leafPalette.length])
            leaves.setColorAt(leafIdx, tmpC)
            leafIdx++
          }
        }
        trunks.instanceMatrix.needsUpdate = true
        leaves.instanceMatrix.needsUpdate = true
        if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true

        this.treeTrunksMesh = trunks
        this.treeLeavesMat = leafMat
        this.treeLeavesMesh = leaves
        this.group.add(trunks, leaves)
      }
    }
  }

  public update(timeSec: number): void {
    if (this.waterUniforms) {
      this.waterUniforms.uTime.value = timeSec
    }
    if (this.terrainGrassMat?.userData?.shader) {
      this.terrainGrassMat.userData.shader.uniforms.uTime.value = timeSec
    }
  }

  public sculptAt(
    worldPoint: THREE.Vector3,
    tool: TerrainSculptTool,
    radius: number,
    strength: number,
    paintMat: TerrainPaintMaterial = 'Grass',
  ): void {
    if (!this.geometry || !this.mesh) return

    const posAttr = this.geometry.attributes.position
    const colorAttr = this.geometry.attributes.color
    const lxCenter = worldPoint.x - this.mesh.position.x
    const lzCenter = worldPoint.z - this.mesh.position.z
    const lyCenter = worldPoint.y - this.mesh.position.y

    const paintColor = PAINT_COLORS[paintMat]

    // For smooth tool, compute average height in brush first
    let avgY = lyCenter
    if (tool === 'smooth') {
      let sum = 0
      let cnt = 0
      for (let i = 0; i < posAttr.count; i++) {
        const dx = posAttr.getX(i) - lxCenter
        const dz = posAttr.getZ(i) - lzCenter
        if (dx * dx + dz * dz <= radius * radius) {
          sum += posAttr.getY(i)
          cnt++
        }
      }
      if (cnt > 0) avgY = sum / cnt
    }

    for (let i = 0; i < posAttr.count; i++) {
      const dx = posAttr.getX(i) - lxCenter
      const dz = posAttr.getZ(i) - lzCenter
      const dist = Math.hypot(dx, dz)
      if (dist > radius) continue

      const falloff = 0.5 * (1 + Math.cos((Math.PI * dist) / radius))
      const curY = posAttr.getY(i)

      if (tool === 'add') {
        posAttr.setY(i, curY + strength * falloff * 0.6)
      } else if (tool === 'subtract') {
        posAttr.setY(i, Math.max(0, curY - strength * falloff * 0.6))
      } else if (tool === 'smooth') {
        posAttr.setY(i, curY + (avgY - curY) * Math.min(1, falloff * 0.35 * strength))
      } else if (tool === 'flatten') {
        posAttr.setY(i, curY + (lyCenter - curY) * Math.min(1, falloff * 0.4 * strength))
      } else if (tool === 'paint' && colorAttr) {
        const t = Math.min(1, falloff * 0.55 * strength)
        const r = colorAttr.getX(i)
        const g = colorAttr.getY(i)
        const b = colorAttr.getZ(i)
        colorAttr.setXYZ(
          i,
          r + (paintColor.r - r) * t,
          g + (paintColor.g - g) * t,
          b + (paintColor.b - b) * t,
        )
      }
    }

    posAttr.needsUpdate = true
    if (colorAttr) colorAttr.needsUpdate = true
    this.geometry.computeVertexNormals()
  }

  public clear(): void {
    if (this.mesh) {
      this.group.remove(this.mesh)
      ;(this.mesh.material as THREE.Material).dispose()
      this.mesh = null
    }
    if (this.waterMesh) {
      this.group.remove(this.waterMesh)
      this.waterMesh.geometry.dispose()
      ;(this.waterMesh.material as THREE.Material).dispose()
      this.waterMesh = null
      this.waterUniforms = null
    }
    if (this.terrainTex) {
      this.terrainTex.dispose()
      this.terrainTex = null
    }
    if (this.barkTex) {
      this.barkTex.dispose()
      this.barkTex = null
    }
    if (this.leafTex) {
      this.leafTex.dispose()
      this.leafTex = null
    }
    if (this.terrainGrassMesh) {
      this.group.remove(this.terrainGrassMesh)
      this.terrainGrassMesh.geometry.dispose()
      this.terrainGrassMesh = null
    }
    if (this.terrainGrassMat) {
      this.terrainGrassMat.dispose()
      this.terrainGrassMat = null
    }
    if (this.treeTrunksMesh) {
      this.group.remove(this.treeTrunksMesh)
      this.treeTrunksMesh.geometry.dispose()
      ;(this.treeTrunksMesh.material as THREE.Material).dispose()
      this.treeTrunksMesh = null
    }
    if (this.treeLeavesMesh) {
      this.group.remove(this.treeLeavesMesh)
      this.treeLeavesMesh.geometry.dispose()
      this.treeLeavesMesh = null
    }
    if (this.treeLeavesMat) {
      this.treeLeavesMat.dispose()
      this.treeLeavesMat = null
    }
    if (this.geometry) {
      this.geometry.dispose()
      this.geometry = null
    }
  }
}
