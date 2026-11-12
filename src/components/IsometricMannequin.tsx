interface IsometricMannequinProps {
  name?: string
  type?: string
  className?: string
  shirtType?: string
  faceType?: string
}

export function IsometricMannequin({
  name = '',
  type = '',
  className = '',
  shirtType,
  faceType,
}: IsometricMannequinProps) {
  const isShirt =
    type === 'clothing' ||
    type === 'shirt' ||
    name === 'i like cats' ||
    name.includes('Shirt') ||
    name.includes('Jacket') ||
    name.includes('Armor') ||
    name.includes('Tee') ||
    name.includes('Suit') ||
    shirtType !== undefined

  const isHat =
    type === 'hat' ||
    type === 'antlers' ||
    name.includes('Crown') ||
    name.includes('Halo') ||
    name.includes('Hat') ||
    name.includes('Helmet') ||
    name.includes('Bomber')

  const isHair =
    type === 'hair' ||
    name.includes('Hair') ||
    name.includes('Ponytail') ||
    name.includes('Braids') ||
    name.includes('Bun')

  const isFace =
    type === 'face' ||
    faceType !== undefined ||
    name === 'Single Celled ...' ||
    name === 'D-Delayed?' ||
    name.includes('Face') ||
    name.includes('Shades') ||
    name.includes('Monocle')

  const isAccessory =
    type === 'accessory' ||
    type === 'tool' ||
    name.includes('Wings') ||
    name.includes('Necklace') ||
    name.includes('Watch') ||
    name.includes('Aura') ||
    name.includes('Staff') ||
    name.includes('Sword')

  // Shirt colors and texture
  const isCatShirt =
    name === 'i like cats' ||
    shirtType === 'cat' ||
    name.includes('Cat') ||
    name.includes('Pizza')

  let shirtColor = '#e4e4e7'
  let shirtSideColor = '#cbd5e1'

  if (isShirt) {
    if (isCatShirt) {
      shirtColor = '#141416'
      shirtSideColor = '#0a0a0c'
    } else if (name.includes('Samurai') || name.includes('Red') || shirtType === 'red') {
      shirtColor = '#991b1b'
      shirtSideColor = '#7f1d1d'
    } else if (name.includes('Cyberpunk') || name.includes('Blue') || name.includes('Teal')) {
      shirtColor = '#0f172a'
      shirtSideColor = '#020617'
    } else if (name.includes('Tuxedo') || shirtType === 'black' || name.includes('Black')) {
      shirtColor = '#18181b'
      shirtSideColor = '#09090b'
    } else if (shirtType === 'white') {
      shirtColor = '#f4f4f5'
      shirtSideColor = '#e4e4e7'
    }
  }

  const isJeans = name.includes('Jeans') || name.includes('Pants')

  return (
    <div
      className={`w-full h-44 flex items-center justify-center relative select-none ${className}`}
    >
      <svg
        viewBox="0 0 160 190"
        className="w-full h-full max-h-44 object-contain filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.45)]"
      >
        <defs>
          <linearGradient id="isoHeadFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#d4d4d8" />
          </linearGradient>
          <linearGradient id="isoHeadSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4d4d8" />
            <stop offset="100%" stopColor="#a1a1aa" />
          </linearGradient>
          <linearGradient id="isoLegFront" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f4f4f5" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="isoLegRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* 1. Ground Drop Shadow */}
        <ellipse cx="80" cy="180" rx="44" ry="8" fill="rgba(0, 0, 0, 0.45)" />

        {/* 2. Accessories Behind (e.g. Wings) */}
        {isAccessory && name.includes('Wings') && (
          <g opacity="0.95">
            <path d="M 50 65 Q 15 35 10 75 Q 35 85 55 85 Z" fill="#a855f7" />
            <path d="M 110 65 Q 145 35 150 75 Q 125 85 105 85 Z" fill="#9333ea" />
          </g>
        )}

        {/* 3. Legs */}
        {/* Left Leg */}
        <rect x="58" y="104" width="21" height="66" rx="4" fill="url(#isoLegFront)" />
        {isJeans && (
          <rect x="58" y="104" width="21" height="52" rx="3" fill="#2563eb" />
        )}

        {/* Right Leg (Angled side depth) */}
        <rect x="80" y="101" width="21" height="66" rx="4" fill="url(#isoLegRight)" />
        {isJeans && (
          <rect x="80" y="101" width="21" height="52" rx="3" fill="#1d4ed8" />
        )}

        {/* 4. Torso */}
        <rect x="54" y="52" width="48" height="52" rx="4" fill={shirtColor} />
        <polygon points="102,52 108,46 108,96 102,104" fill={shirtSideColor} />

        {/* Graphic / Texture on Torso */}
        {isCatShirt ? (
          <g>
            <rect x="62" y="58" width="32" height="34" rx="2" fill="#242427" />
            <image
              href="/entropy.png"
              x="64"
              y="60"
              width="28"
              height="28"
              preserveAspectRatio="xMidYMid slice"
            />
            <line
              x1="88"
              y1="88"
              x2="94"
              y2="76"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="95" cy="74" r="3.5" fill="#ef4444" />
          </g>
        ) : isShirt && (name.includes('Samurai') || name.includes('Armor')) ? (
          <g>
            <rect x="60" y="58" width="36" height="40" rx="2" fill="#7f1d1d" />
            <line x1="60" y1="70" x2="96" y2="70" stroke="#f59e0b" strokeWidth="2" />
            <line x1="60" y1="84" x2="96" y2="84" stroke="#f59e0b" strokeWidth="2" />
          </g>
        ) : (
          !isShirt && <circle cx="78" cy="78" r="5" fill="#cbd5e1" opacity="0.5" />
        )}

        {/* 5. Left Arm */}
        <rect
          x="32"
          y="54"
          width="20"
          height="50"
          rx="4"
          fill={isCatShirt ? '#141416' : shirtColor}
        />
        {isCatShirt && (
          <rect x="32" y="76" width="20" height="28" rx="3" fill="#e4e4e7" />
        )}

        {/* 6. Right Arm (Angled back) */}
        <rect
          x="104"
          y="50"
          width="20"
          height="50"
          rx="4"
          fill={isCatShirt ? '#0a0a0c' : shirtSideColor}
        />
        {isCatShirt && (
          <rect x="104" y="72" width="20" height="28" rx="3" fill="#cbd5e1" />
        )}

        {/* 7. Head (3D Cylinder with round cap) */}
        <rect x="65" y="16" width="32" height="34" rx="9" fill="url(#isoHeadFront)" />
        <path
          d="M 87 16 Q 97 16 97 25 L 97 41 Q 97 50 87 50 Z"
          fill="url(#isoHeadSide)"
          opacity="0.65"
        />

        {/* Antlers accessory */}
        {type === 'antlers' && (
          <g>
            <path
              d="M 68 18 Q 50 2 46 14 Q 56 12 66 22 Z"
              fill="#c084fc"
              opacity="0.9"
            />
            <path
              d="M 94 18 Q 112 2 116 14 Q 106 12 96 22 Z"
              fill="#a855f7"
              opacity="0.9"
            />
          </g>
        )}

        {/* Face Features */}
        {name === 'Single Celled ...' || faceType === 'derp' ? (
          <g>
            <circle cx="75" cy="30" r="1.5" fill="#000000" />
            <circle cx="89" cy="30" r="1.5" fill="#000000" />
            <path
              d="M 77 39 Q 82 45 87 40"
              fill="none"
              stroke="#000000"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        ) : name === 'D-Delayed?' ? (
          <g>
            <line
              x1="88"
              y1="20"
              x2="94"
              y2="22"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <ellipse
              cx="76"
              cy="27"
              rx="2.5"
              ry="3.5"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="1.2"
            />
            <ellipse
              cx="88"
              cy="27"
              rx="2.5"
              ry="3.5"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="1.2"
            />
            <circle cx="76" cy="27" r="1" fill="#000000" />
            <circle cx="88" cy="27" r="1" fill="#000000" />
            <path
              d="M 74 32 Q 76 34 78 32"
              fill="none"
              stroke="#000000"
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M 86 32 Q 88 34 90 32"
              fill="none"
              stroke="#000000"
              strokeWidth="1"
              opacity="0.6"
            />
            <path
              d="M 77 39 Q 82 42 87 39"
              fill="none"
              stroke="#000000"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        ) : faceType === 'smirk' ? (
          <g>
            <circle cx="76" cy="29" r="1.5" fill="#000000" />
            <circle cx="88" cy="29" r="1.5" fill="#000000" />
            <path
              d="M 77 38 Q 82 42 88 37"
              fill="none"
              stroke="#000000"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
        ) : name.includes('Shades') ? (
          <g>
            <rect x="68" y="26" width="26" height="8" rx="2" fill="#09090b" />
            <line x1="70" y1="30" x2="92" y2="30" stroke="#06b6d4" strokeWidth="2" />
          </g>
        ) : name.includes('Monocle') ? (
          <g>
            <circle cx="75" cy="30" r="1.5" fill="#000000" />
            <circle cx="88" cy="30" r="4.5" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="88" cy="30" r="1.5" fill="#000000" />
            <path d="M 88 35 Q 92 40 94 48" fill="none" stroke="#f59e0b" strokeWidth="1" />
            <path d="M 78 38 Q 81 41 84 38" fill="none" stroke="#000000" strokeWidth="1.4" />
          </g>
        ) : (
          !isFace && (
            <g opacity="0.5">
              <circle cx="76" cy="30" r="1.2" fill="#000000" />
              <circle cx="86" cy="30" r="1.2" fill="#000000" />
              <path d="M 78 37 Q 81 40 84 37" fill="none" stroke="#000000" strokeWidth="1.2" />
            </g>
          )
        )}

        {/* Hats */}
        {isHat && (
          <g>
            {name.includes('Crown') && (
              <path
                d="M 64 16 L 68 8 L 74 14 L 81 6 L 88 14 L 94 8 L 98 16 Z"
                fill="#eab308"
                stroke="#ca8a04"
                strokeWidth="1"
              />
            )}
            {name.includes('Halo') && (
              <ellipse
                cx="81"
                cy="8"
                rx="16"
                ry="4"
                fill="none"
                stroke="#facc15"
                strokeWidth="2.5"
              />
            )}
            {name.includes('Top Hat') && (
              <g>
                <rect x="71" y="2" width="20" height="15" rx="1" fill="#18181b" />
                <ellipse cx="81" cy="16" rx="16" ry="3" fill="#18181b" />
              </g>
            )}
            {name.includes('Bomber') && (
              <path d="M 63 16 Q 81 8 99 16 L 97 22 Q 81 18 65 22 Z" fill="#ec4899" />
            )}
            {name.includes('Helmet') && (
              <g>
                <path d="M 64 20 Q 81 8 98 20 Z" fill="#475569" />
                <path
                  d="M 64 20 Q 56 12 58 6"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 98 20 Q 106 12 104 6"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
        )}

        {/* Hair */}
        {isHair && (
          <path
            d="M 63 22 Q 81 10 99 22 Q 95 12 81 12 Q 67 12 63 22 Z"
            fill={name.includes('Blonde') ? '#eab308' : '#78350f'}
          />
        )}
      </svg>
    </div>
  )
}
