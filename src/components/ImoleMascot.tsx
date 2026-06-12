import React from 'react'
import sun from '../assets/sun.png'

interface MascotProps {
  size?: number;
  className?: string;
  alt?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'sad' | string;
}

export default function ImoleMascot({ size = 120, className = '', alt = 'Imole Sun' }: MascotProps) {
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
