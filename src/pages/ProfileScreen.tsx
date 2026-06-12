import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Globe, RotateCcw, Calendar, Award, LogOut } from 'lucide-react'
import { useLanguage, useProfile } from '../App'
import { StorageService, type Scores } from '../services/storage'

interface Achievement {
  id: string
  title: string
  desc: string
  icon: string
  unlocked: boolean
}

export default function ProfileScreen() {
  const { t, language, setLanguage } = useLanguage()
  const { profile, setProfile, signOut } = useProfile()
  const navigate = useNavigate()

  // Profile fields state
  const [name, setName] = useState(profile?.name || '')
  const [age, setAge] = useState<number>(profile?.age || 10)
  const [selectedLang, setSelectedLang] = useState(language)
  
  const [isEditing, setIsEditing] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    if (profile) {
      setName(profile.name)
      setAge(profile.age)
    }

    const scores = StorageService.getScores()
    const streak = StorageService.getStreak()
    const sessions = StorageService.getSessions()

    // Define badges unlocked by user progress
    const badges: Achievement[] = [
      {
        id: 'first_light',
        title: 'First Light 💡',
        desc: 'Complete your first gamified challenge.',
        icon: '💡',
        unlocked: sessions.length >= 1
      },
      {
        id: 'streak_3',
        title: '3-Day Spark 🔥',
        desc: 'Build consistency with a 3-day streak.',
        icon: '🔥',
        unlocked: streak.best >= 3
      },
      {
        id: 'streak_7',
        title: '7-Day Flame ☀️',
        desc: 'Build strong habits with a 7-day streak.',
        icon: '☀️',
        unlocked: streak.best >= 7
      },
      {
        id: 'naira_saver',
        title: 'Naira Planner 💰',
        desc: 'Complete 3 Financial Literacy tasks.',
        icon: '💰',
        unlocked: sessions.filter(s => s.skillArea === 'finance').length >= 3
      },
      {
        id: 'logic_master',
        title: 'Logic Master 🧩',
        desc: 'Complete 3 Logic & Math tasks.',
        icon: '🧩',
        unlocked: sessions.filter(s => s.skillArea === 'mentalMath').length >= 3
      },
      {
        id: 'bright_speaker',
        title: 'Bold Speaker 🗣️',
        desc: 'Complete 3 Speaking tasks.',
        icon: '🗣️',
        unlocked: sessions.filter(s => s.skillArea === 'speaking').length >= 3
      }
    ]
    setAchievements(badges)
  }, [profile])

  const handleSave = () => {
    if (!name.trim()) return
    const updated = {
      name: name.trim(),
      age: age,
      language: selectedLang,
      createdAt: profile?.createdAt || new Date().toISOString()
    }
    setProfile(updated)
    setLanguage(selectedLang)
    setIsEditing(false)
  }

  const handleReset = () => {
    StorageService.resetAllData()
    setProfile(null)
    setShowResetModal(false)
    navigate('/', { replace: true })
  }

  const handleSignOut = () => {
    signOut()
    navigate('/', { replace: true })
  }

  const getJoinDate = () => {
    if (!profile?.createdAt) return ''
    const date = new Date(profile.createdAt)
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getLanguageLabel = (langCode: 'en' | 'pcm' | 'yo') => {
    switch (langCode) {
      case 'yo': return 'Yorùbá 🇳🇬'
      case 'pcm': return 'Pidgin 🇳🇬'
      case 'en':
      default:
        return 'English 🇬🇧'
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-6">
      
      {/* 1. Profile card Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center gap-3 relative mt-2">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-300">
          <User className="w-8 h-8 text-amber-500" />
        </div>
        
        {isEditing ? (
          <div className="w-full flex flex-col gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-center text-base font-bold focus:border-amber-500 focus:outline-none"
              maxLength={20}
            />
            <select
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-center font-bold focus:border-amber-500 focus:outline-none text-slate-700"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <option key={i} value={i + 8}>{i + 8} years old</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs active-tap"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs active-tap shadow-sm"
              >
                {t('save_btn')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-black text-slate-800 font-display capitalize">{profile?.name}</h2>
            <p className="text-xs text-slate-400 font-bold mt-0.5">{profile?.age} years old • {getLanguageLabel(language)}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2.5 text-xs font-black text-amber-500 hover:text-amber-600 underline active-tap"
            >
              Edit Details
            </button>
          </div>
        )}

        <div className="w-full h-[1px] bg-slate-100 my-1" />
        
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{t('joined')} {getJoinDate()}</span>
        </div>
      </div>

      {/* 2. Language preferences */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest font-display flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-500" />
          <span>{t('change_language')}</span>
        </h3>

        <div className="flex gap-2">
          {(['en', 'pcm', 'yo'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setSelectedLang(lang)
                setLanguage(lang)
              }}
              className={`flex-1 py-3 px-1.5 rounded-2xl border-2 font-display text-[11px] font-extrabold transition duration-150 active-tap ${
                language === lang
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-slate-100 bg-slate-50 text-slate-600'
              }`}
            >
              {getLanguageLabel(lang).split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Unlocked Achievements Badges */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest font-display px-1 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>{t('achievements')}</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`border rounded-3xl p-4 flex flex-col items-center text-center gap-2 bg-white shadow-sm transition-all duration-350 relative ${
                badge.unlocked ? 'border-amber-500/20' : 'border-slate-100 opacity-60'
              }`}
            >
              {/* Badge Icon bubble */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                badge.unlocked ? 'bg-amber-50 border border-amber-200/50' : 'bg-slate-50 border border-slate-200'
              }`}>
                {badge.unlocked ? badge.icon : '🔒'}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className={`text-xs font-black font-display ${badge.unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                  {badge.title}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 leading-normal px-2">
                  {badge.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Account actions */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col items-center">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 font-display text-sm font-extrabold py-2 px-6 rounded-2xl hover:bg-slate-50 transition active-tap"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>

      {/* 5. Dangerous resetting actions */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col items-center">
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-display text-sm font-extrabold py-2 px-6 rounded-2xl hover:bg-rose-50 transition active-tap"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('reset_progress')}</span>
        </button>
      </div>

      {/* 6. Reset progress Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in text-center flex flex-col gap-5 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6 text-rose-500" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-black text-slate-800 font-display">Are you sure?</h3>
              <p className="text-xs font-bold text-slate-500 leading-relaxed px-4">
                {t('confirm_reset')}
              </p>
            </div>

            <div className="flex gap-3 mt-1">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold py-3.5 rounded-2xl text-xs active-tap"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-display font-extrabold py-3.5 rounded-2xl text-xs active-tap shadow-md"
              >
                {t('yes_reset')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
