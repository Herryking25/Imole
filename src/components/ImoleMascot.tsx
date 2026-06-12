import React from 'react'
import sun from '../assets/sun.png'

interface MascotProps {
  size?: number;
  className?: string;
  alt?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'sad' | string;
  variant?: 'mascot' | 'logo';
}

export default function ImoleMascot({
  size = 120,
  className = '',
  alt = 'Imole Sun',
  expression = 'happy',
  variant = 'mascot'
}: MascotProps) {
  if (variant === 'logo') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img
          src={sun}
          alt={alt}
          width={size}
          height={size}
          className="animate-float object-contain"
          style={{ display: 'block' }}
        />
      </div>
    )
  }

  const isThinking = expression === 'thinking'
  const isExcited = expression === 'excited'
  const isSad = expression === 'sad'
  const eyeClass = isExcited ? 'h-3 w-3 rounded-full' : 'h-2.5 w-2.5 rounded-full'
  const mouthClass = isSad
    ? 'h-3 w-7 rounded-t-full border-t-2 border-slate-700'
    : isThinking
      ? 'h-2 w-5 rounded-full border-2 border-slate-700 bg-transparent'
      : 'h-4 w-8 rounded-b-full border-b-2 border-slate-700'

  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="img"
      aria-label={alt}
      style={{ width: size, minWidth: size }}
    >
      <div
        className="animate-float relative"
        style={{ width: size, height: Math.round(size * 1.25) }}
      >
        <div className="absolute left-1/2 top-0 h-[22%] w-[22%] -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.45)]" />
        <div className="absolute left-1/2 top-[10%] h-[36%] w-[42%] -translate-x-1/2 rounded-t-full bg-amber-400 shadow-[0_8px_18px_rgba(245,158,11,0.22)]" />
        <div className="absolute left-1/2 top-[24%] h-[48%] w-[64%] -translate-x-1/2 rounded-[28%] border-[3px] border-amber-600 bg-amber-100 shadow-md" />
        <div className="absolute left-[18%] top-[38%] h-[8%] w-[16%] rounded-full bg-amber-700" />
        <div className="absolute right-[18%] top-[38%] h-[8%] w-[16%] rounded-full bg-amber-700" />
        <div className="absolute left-1/2 top-[36%] flex -translate-x-1/2 items-center gap-3">
          <span className={`${eyeClass} bg-slate-800`} />
          <span className={`${eyeClass} bg-slate-800`} />
        </div>
        <div className="absolute left-1/2 top-[51%] -translate-x-1/2">
          <div className={mouthClass} />
        </div>
        <div className="absolute left-[12%] top-[69%] h-[13%] w-[76%] rounded-b-2xl rounded-t-md bg-amber-600" />
        <div className="absolute left-[5%] top-[79%] h-[11%] w-[90%] rounded-2xl bg-slate-800" />
        <div className="absolute left-[20%] top-[88%] h-[8%] w-[14%] rounded-b-xl bg-slate-700" />
        <div className="absolute right-[20%] top-[88%] h-[8%] w-[14%] rounded-b-xl bg-slate-700" />
      </div>
    </div>
  )
}
