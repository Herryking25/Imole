import React from 'react'
import sunLogo from '../assets/sun.png'

type ImoleLoaderProps = {
  label?: string
}

export default function ImoleLoader({ label = 'Loading Imole' }: ImoleLoaderProps) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFFDF7] px-6 text-center"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="relative flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
        <div className="imole-loader-ring absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 border-r-amber-300" />
        <div className="imole-loader-glow absolute inset-4 rounded-full bg-amber-100/70 blur-xl" />
        <img
          src={sunLogo}
          alt=""
          className="imole-loader-logo relative h-16 w-16 object-contain"
          aria-hidden="true"
        />
      </div>

      <div className="mt-5 flex flex-col items-center gap-2">
        <h1 className="font-display text-4xl font-black tracking-tight text-amber-500">
          Imole
        </h1>
        <span className="sr-only">{label}</span>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-amber-100">
          <div className="imole-loader-bar h-full w-1/2 rounded-full bg-amber-500" />
        </div>
      </div>
    </div>
  )
}
