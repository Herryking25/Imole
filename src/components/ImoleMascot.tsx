import React from 'react'

interface MascotProps {
  expression?: 'happy' | 'excited' | 'thinking' | 'sad';
  size?: number;
  className?: string;
}

export default function ImoleMascot({ expression = 'happy', size = 120, className = '' }: MascotProps) {
  // SVG paths for eyes
  const renderEyes = () => {
    switch (expression) {
      case 'excited':
        return (
          <>
            {/* Starry Eyes */}
            <path d="M42 45 L45 39 L48 45 L54 48 L48 51 L45 57 L42 51 L36 48 Z" fill="#FFF" />
            <path d="M72 45 L75 39 L78 45 L84 48 L78 51 L75 57 L72 51 L66 48 Z" fill="#FFF" />
          </>
        )
      case 'thinking':
        return (
          <>
            {/* Thinking Eyes - one curved, one round */}
            <circle cx="45" cy="48" r="5" fill="#1E293B" />
            <path d="M68 45 Q75 42 80 48" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </>
        )
      case 'sad':
        return (
          <>
            {/* Droopy/Sad Eyes */}
            <path d="M40 50 Q45 44 50 50" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M70 50 Q75 44 80 50" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        )
      case 'happy':
      default:
        return (
          <>
            {/* Big Round Happy Eyes with sparkles */}
            <circle cx="45" cy="48" r="6" fill="#1E293B" />
            <circle cx="43" cy="46" r="2" fill="#FFF" />
            <circle cx="75" cy="48" r="6" fill="#1E293B" />
            <circle cx="73" cy="46" r="2" fill="#FFF" />
          </>
        )
    }
  };

  // SVG paths for mouth
  const renderMouth = () => {
    switch (expression) {
      case 'excited':
        return (
          /* Wide Open Happy Mouth */
          <path d="M52 62 Q60 74 68 62 Z" fill="#E11D48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        )
      case 'thinking':
        return (
          /* Puzzled/Wobbly Mouth */
          <path d="M54 64 Q60 62 66 64" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
        )
      case 'sad':
        return (
          /* Sad Curved Mouth */
          <path d="M52 66 Q60 58 68 66" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
        )
      case 'happy':
      default:
        return (
          /* Friendly Smile */
          <path d="M52 60 Q60 70 68 60" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        )
    }
  };

  // SVG paths for glowing light
  const getGlowIntensity = () => {
    switch (expression) {
      case 'excited':
        return 'rgba(245, 158, 11, 0.45)';
      case 'sad':
        return 'rgba(245, 158, 11, 0.1)';
      case 'happy':
      case 'thinking':
      default:
        return 'rgba(245, 158, 11, 0.3)';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size * 1.25}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-float"
      >
        <defs>
          {/* Radial Glow Filter */}
          <radialGradient id="lanternGlow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#FBBF24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFDF7" stopOpacity="0" />
          </radialGradient>
          {/* Flame Gradient */}
          <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
        </defs>

        {/* 1. Ambient Glow (behind the lantern) */}
        <circle cx="60" cy="75" r="45" fill="url(#lanternGlow)" style={{ fill: getGlowIntensity() }} />

        {/* 2. Lantern Handle / Hook */}
        <path
          d="M60 35 C60 10, 40 10, 40 22 C40 25, 45 25, 45 22 C45 15, 55 15, 55 35"
          stroke="#1E293B"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 3. Lantern Cap (Top Lid) */}
        <path d="M30 35 H90 L80 25 H40 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
        <rect x="52" y="20" width="16" height="5" rx="1.5" fill="#F59E0B" />

        {/* 4. Glass Chamber (Body Background) */}
        <path
          d="M32 35 L25 95 C25 102, 35 108, 60 108 C85 108, 95 102, 95 95 L88 35 Z"
          fill="rgba(254, 243, 199, 0.4)"
          stroke="#1E293B"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* 5. Flame Inside (Animated jumping shape) */}
        <path
          d="M60 92 C67 92, 70 82, 60 62 C50 82, 53 92, 60 92 Z"
          fill="url(#flameGrad)"
          className="origin-bottom transform transition-all duration-300"
          style={{
            transform: expression === 'excited' ? 'scale(1.2) translateY(-5px)' : 'none',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />

        {/* 6. Eye and Mouth Expressions */}
        {renderEyes()}
        {renderMouth()}

        {/* Cheek Blushes (Cute circles) */}
        {expression !== 'sad' && (
          <>
            <circle cx="35" cy="56" r="4" fill="#F43F5E" fillOpacity="0.4" />
            <circle cx="85" cy="56" r="4" fill="#F43F5E" fillOpacity="0.4" />
          </>
        )}

        {/* 7. Metal Guard Wires (Foreground details) */}
        <path d="M32 35 C42 60, 42 70, 27 92" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M88 35 C78 60, 78 70, 93 92" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* 8. Lantern Base */}
        <path d="M22 95 H98 V105 H22 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M30 105 L26 115 H94 L90 105 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />

        {/* Thinking Bubbles if thinking */}
        {expression === 'thinking' && (
          <>
            <circle cx="95" cy="25" r="3" fill="#F59E0B" />
            <circle cx="102" cy="18" r="5" fill="#F59E0B" />
            <circle cx="112" cy="8" r="8" fill="#FBBF24" />
            <text x="109" y="11" fill="#1E293B" fontSize="9" fontWeight="bold">?</text>
          </>
        )}
      </svg>
    </div>
  )
}
