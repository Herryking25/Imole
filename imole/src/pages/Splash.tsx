import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, LogIn, Play, Plus } from 'lucide-react'
import { useLanguage, useProfile } from '../App'
import ImoleMascot from '../components/ImoleMascot'
import { StorageService, type Profile } from '../services/storage'

export default function Splash() {
  const { t } = useLanguage()
  const { signIn } = useProfile()
  const navigate = useNavigate()
  
  // PWA installation prompt states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallBtn, setShowInstallBtn] = useState(false)
  const [accounts, setAccounts] = useState<Profile[]>([])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e)
      // Update UI to notify the user they can install the PWA
      setShowInstallBtn(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already running in standalone (PWA) mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBtn(false)
    }

    setAccounts(StorageService.getAccounts())

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to install prompt: ${outcome}`)
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null)
    setShowInstallBtn(false)
  }

  const handleSignIn = (accountId: string | undefined) => {
    if (!accountId) return
    const signedInProfile = signIn(accountId)
    if (signedInProfile) {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-between px-6 py-12 bg-gradient-to-b from-[#FFFDF7] via-[#FFFDF7] to-amber-50/40 text-[#1E293B] text-center select-none">
      
      {/* Top spacing */}
      <div className="w-full h-4" />

      {/* Hero Mascot & Branding */}
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Lantern Mascot */}
        <ImoleMascot expression="happy" size={150} />

        {/* Brand Name */}
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-black tracking-tight text-amber-500 font-display uppercase drop-shadow-sm">
            Imole
          </h1>
          <p className="text-sm font-semibold tracking-widest text-[#1E293B]/60 uppercase font-sans">
            — L I G H T —
          </p>
        </div>

        {/* Mission Statement Quote */}
        <div className="max-w-xs mt-2 relative">
          <span className="absolute -top-3 -left-4 text-4xl text-amber-200 font-serif font-black select-none">“</span>
          <p className="text-lg font-bold font-sans text-slate-700 italic leading-relaxed">
            {t('welcome_slogan')}
          </p>
          <span className="absolute -bottom-6 -right-4 text-4xl text-amber-200 font-serif font-black select-none">”</span>
        </div>
      </div>

      {/* Call to Actions (Buttons) */}
      <div className="w-full flex flex-col gap-4 max-w-sm mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        
        {accounts.length > 0 && (
          <div className="flex flex-col gap-2 rounded-3xl border border-amber-100 bg-white/80 p-3 shadow-sm">
            <div className="flex items-center gap-2 px-1 text-left">
              <LogIn className="h-4 w-4 text-amber-500" />
              <span className="font-display text-xs font-black uppercase tracking-widest text-slate-500">
                Sign in
              </span>
            </div>
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleSignIn(account.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left transition hover:border-amber-200 hover:bg-amber-50 active-tap"
              >
                <div className="flex flex-col">
                  <span className="font-display text-sm font-extrabold capitalize text-slate-800">
                    {account.name}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {account.age} years old
                  </span>
                </div>
                <LogIn className="h-4 w-4 text-amber-500" />
              </button>
            ))}
          </div>
        )}

        {/* Get Started Button */}
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-display text-lg font-extrabold py-4 px-6 rounded-2xl shadow-[0_4px_16px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] transition duration-200 flex items-center justify-center gap-2 active-tap"
        >
          {accounts.length > 0 ? <Plus className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          <span>{accounts.length > 0 ? 'Create new account' : t('get_started')}</span>
        </button>

        {/* Install PWA Button (Hidden if already installed or unsupported) */}
        {showInstallBtn && (
          <button
            onClick={handleInstallClick}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-display text-base font-bold py-3.5 px-6 rounded-2xl transition duration-200 flex items-center justify-center gap-2 border border-slate-700 active-tap shadow-sm"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{t('install_app')}</span>
          </button>
        )}

      </div>

      {/* Decorative wave at the bottom */}
      <div className="text-[10px] font-semibold text-slate-400/80 mt-6 font-sans">
        © 2026 Imole Platform • Made for Nigeria 🇳🇬
      </div>

    </div>
  )
}
