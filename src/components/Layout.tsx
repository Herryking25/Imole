import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Home, Award, Trophy, User, Flame, Globe, Sparkles } from 'lucide-react'
import { useLanguage, useProfile } from '../App'
import { StorageService, type Streak, type Scores } from '../services/storage'
import ImoleMascot from './ImoleMascot'
import sunLogo from '../assets/sun.png'

export default function Layout() {
  const { t, language, setLanguage } = useLanguage()
  const { profile } = useProfile()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [streak, setStreak] = useState<Streak>({ current: 0, best: 0, lastCompletedDate: "" })
  const [scores, setScores] = useState<Scores>({ mentalMath: 0, speaking: 0, finance: 0, creativity: 0, emotionalIQ: 0, totalXp: 0 })
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

  useEffect(() => {
    // Fetch streak and scores on mount or path change
    const activeStreak = StorageService.getStreak()
    setStreak(activeStreak)
    const activeScores = StorageService.getScores()
    setScores(activeScores)
  }, [location.pathname])

  const handleLanguageChange = (lang: 'en' | 'pcm' | 'yo') => {
    setLanguage(lang)
    setShowLanguageDropdown(false)
  }

  const getLanguageLabel = () => {
    switch (language) {
      case 'yo': return 'Yorùbá 🇳🇬'
      case 'pcm': return 'Pidgin 🇳🇬'
      case 'en':
      default:
        return 'English 🇬🇧'
    }
  }

  // Hide header/footer/sidebars on challenge and feedback screens to minimize cognitive load
  const isMinimalLayout = location.pathname === '/challenge' || location.pathname === '/feedback'

  const navItems = [
    { to: '/dashboard', label: t('nav_home'), icon: Home },
    { to: '/progress', label: t('nav_progress'), icon: Award },
    { to: '/leaderboard', label: t('nav_leaderboard'), icon: Trophy },
    { to: '/profile', label: t('nav_profile'), icon: User }
  ]

  // If playing a challenge, show full-width centered card
  if (isMinimalLayout) {
    return (
      <div className="flex flex-col min-h-dvh bg-[#FFFDF7] justify-center items-center py-4 md:py-6">
        <div className="w-full max-w-md bg-white md:shadow-md md:border md:border-slate-100 rounded-3xl min-h-[calc(100dvh-2rem)] md:min-h-[90vh] flex flex-col justify-between overflow-y-auto">
          <Outlet />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-dvh relative bg-[#FFFDF7] md:flex-row md:items-stretch overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR (Visible on width >= 768px) */}
      <aside className="hidden md:flex md:flex-col md:justify-between md:w-64 md:border-r md:border-[#F59E0B]/10 md:p-6 bg-white shrink-0">
        
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer px-2" onClick={() => navigate('/dashboard')}>
            <img src={sunLogo} alt="Imole Logo" className="w-9 h-9 object-contain animate-pulse" />
            <span className="font-display text-2xl font-black tracking-tight text-amber-500">Imole</span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const IconComp = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition duration-150 font-display text-sm font-extrabold active-tap ${
                      isActive 
                        ? 'bg-amber-50 text-amber-500 border border-amber-200/40 shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`
                  }
                >
                  <IconComp className="w-5 h-5 stroke-[2.5]" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Desktop Profile Status Footer */}
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 px-2">
          {/* User Quick Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200/50">
              <User className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800 capitalize leading-none">{profile?.name}</span>
              <span className="text-[10px] font-bold text-slate-400 mt-1">Level {Math.floor(scores.totalXp / 300) + 1}</span>
            </div>
          </div>
          
          {/* Language select buttons directly in sidebar */}
          <div className="flex gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
            {(['en', 'pcm', 'yo'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`flex-1 text-[9px] font-extrabold font-display py-1.5 rounded-lg border transition ${
                  language === lang 
                    ? 'bg-white text-amber-500 border-slate-200/50 shadow-sm' 
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'pcm' ? 'PG' : 'YO'}
              </button>
            ))}
          </div>
        </div>

      </aside>

      {/* 2. MOBILE HEADER (Hidden on desktop) */}
      <header className="md:hidden bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-[#F59E0B]/10 px-4 py-3 flex items-center justify-between shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <img src={sunLogo} alt="Imole Logo" className="w-7 h-7 object-contain animate-pulse" />
          <span className="font-display text-xl font-extrabold tracking-tight text-amber-500">Imole</span>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Streak Counter */}
          <div 
            onClick={() => navigate('/progress')}
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/50 py-1 px-3 rounded-full cursor-pointer hover:bg-amber-100 transition active-tap shadow-sm"
          >
            <Flame className={`w-5 h-5 ${streak.current > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-display font-bold text-sm text-slate-800">{streak.current}</span>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-1 bg-slate-50 border border-slate-200 py-1 px-3 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-100 active-tap shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{getLanguageLabel()}</span>
            </button>

            {showLanguageDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLanguageDropdown(false)} />
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in py-1">
                  <button onClick={() => handleLanguageChange('en')} className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-amber-50 transition ${language === 'en' ? 'text-amber-500' : 'text-slate-700'}`}>English 🇬🇧</button>
                  <button onClick={() => handleLanguageChange('pcm')} className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-amber-50 transition ${language === 'pcm' ? 'text-amber-500' : 'text-slate-700'}`}>Pidgin 🇳🇬</button>
                  <button onClick={() => handleLanguageChange('yo')} className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-amber-50 transition ${language === 'yo' ? 'text-amber-500' : 'text-slate-700'}`}>Yorùbá 🇳🇬</button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. CONTENT AREA (Scrollable pane) */}
      <div className="flex-grow flex flex-col md:flex-row h-full overflow-hidden">
        
        {/* Main Content Column */}
        <main className="flex-grow p-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:p-6 md:max-w-2xl overflow-y-auto">
          <Outlet />
        </main>

        {/* 4. DESKTOP STATS SIDEBAR (Visible on width >= 1024px or similar, or just desktop side panel) */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-l lg:border-[#F59E0B]/10 lg:p-6 bg-slate-50/30 gap-6 shrink-0 overflow-y-auto">
          
          {/* Quick stats title */}
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-sans">Growth Dashboard</h4>
            <span className="text-xs font-bold text-slate-500">Track your milestones</span>
          </div>

          {/* Streak details card */}
          <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 animate-pulse-fire">
              <Flame className={`w-5 h-5 ${streak.current > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Current Streak</span>
              <span className="text-sm font-extrabold text-slate-800 font-display">{streak.current} Days</span>
            </div>
          </div>

          {/* XP details card */}
          <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">XP Collected</span>
              <span className="text-sm font-extrabold text-slate-800 font-display">{scores.totalXp} XP</span>
            </div>
          </div>

          {/* Decorative Talking Mascot Panel on Desktop side */}
          <div className="bg-amber-50/70 border border-amber-200/30 rounded-3xl p-4 flex flex-col items-center gap-3 text-center mt-2 relative shadow-sm">
            <ImoleMascot expression="happy" size={80} />
            <div className="bg-white border border-amber-100 p-3 rounded-2xl text-[11px] font-bold text-slate-700 leading-relaxed font-sans shadow-sm">
              "Be the light among your peers! Complete daily quests to earn badges and awards."
            </div>
          </div>

        </aside>

      </div>

      {/* 5. MOBILE BOTTOM TAB BAR (Hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 px-6 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-40">
        {navItems.map((item) => {
          const IconComp = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 flex-1 py-1.5 transition-all duration-200 active-tap ${
                  isActive ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              <IconComp className="w-6 h-6 stroke-[2.5]" />
              <span className="text-[10px] tracking-wide">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

    </div>
  )
}
