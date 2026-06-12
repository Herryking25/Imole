import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Flame, CheckCircle2, Play, Award, HelpCircle } from 'lucide-react'
import { useProfile, useLanguage } from '../App'
import { StorageService, getLocalDateString, type Streak, type Scores, type Session } from '../services/storage'
import challengesData from '../data/challenges.json'
import ImoleMascot from '../components/ImoleMascot'

type SkillKey = 'mentalMath' | 'speaking' | 'finance' | 'creativity' | 'emotionalIQ'
type Challenge = (typeof challengesData)[number]

export default function Dashboard() {
  const { profile } = useProfile()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  // App states
  const [completedToday, setCompletedToday] = useState(false)
  const [streak, setStreak] = useState<Streak>({ current: 0, best: 0, lastCompletedDate: "" })
  const [scores, setScores] = useState<Scores>({ mentalMath: 0, speaking: 0, finance: 0, creativity: 0, emotionalIQ: 0, totalXp: 0 })
  const [completedCount, setCompletedCount] = useState(0)
  const [mascotTip, setMascotTip] = useState("")

  // Determine today's challenge
  const getDayOfYear = (): number => {
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now.getTime() - start.getTime()
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }

  const dayOfYear = getDayOfYear()
  const todayChallenge = challengesData[dayOfYear % challengesData.length]
  const skillTranslationKey = `skills.${todayChallenge.skill}`
  const challengeTitle = t(skillTranslationKey)
  const completedChallengeIds = new Set(
    StorageService.getSessions().map((session) => session.challengeId)
  )
  const skillOrder: SkillKey[] = ['mentalMath', 'speaking', 'finance', 'creativity', 'emotionalIQ']
  const challengeTracks = skillOrder.map((skill) => {
    const challenges = challengesData.filter((item) => item.skill === skill)
    const completed = challenges.filter((item) => completedChallengeIds.has(item.id)).length
    const nextChallenge = challenges.find((item) => !completedChallengeIds.has(item.id)) || challenges[0]

    return {
      skill,
      challenges,
      completed,
      nextChallenge,
      isComplete: completed >= challenges.length
    }
  })

  // Localized greetings
  const getGreeting = () => {
    if (!profile) return ""
    switch (language) {
      case 'yo':
        return `Kí nì nǹkan, ${profile.name}! 👋`
      case 'pcm':
        return `How body, ${profile.name}! 👋`
      case 'en':
      default:
        return `Hello, ${profile.name}! 👋`
    }
  }

  // Localized speech bubbles from Mascot
  const getMascotBubbles = {
    en: [
      "Let's be the light today! Complete your challenge to keep your streak burning.",
      "Doing daily challenges makes you smarter and more responsible!",
      "Save your Naira, speak with confidence, and be kind to others!",
      "Need a challenge? Tap the card below to start today's quest!"
    ],
    pcm: [
      "Make we shine light today! Do your daily work make your fire dey burn.",
      "To do this challenge every day go make you get sense and level!",
      "Save your Naira, talk with confidence, make you dey help people!",
      "Challenge dey wait for you! Tap the button make we start today's work."
    ],
    yo: [
      "Jẹ ki a tan imọlẹ loni! Pari ipenija rẹ lati jẹ ki streak rẹ ma jo.",
      "Gbigbe ipenija lojoojumọ n mu ki o gbọ́n ati ni oye si!",
      "Fipamọ owó Naira rẹ, sọrọ pẹlu igboya, ki o si ṣaanu fun awọn miiran!",
      "Ipenija oni ti ṣetan! Tẹ ibi lati bẹrẹ igbiyanju ti oni."
    ]
  }

  useEffect(() => {
    // 1. Fetch completion status
    const doneToday = StorageService.hasCompletedToday()
    setCompletedToday(doneToday)

    // 2. Fetch streak
    const activeStreak = StorageService.getStreak()
    setStreak(activeStreak)

    // 3. Fetch scores
    const activeScores = StorageService.getScores()
    setScores(activeScores)

    // 4. Fetch total completed sessions
    const sessions = StorageService.getSessions()
    setCompletedCount(sessions.length)

    // 5. Select a random mascot tip for today
    const tips = getMascotBubbles[language] || getMascotBubbles.en
    const tipIndex = dayOfYear % tips.length
    setMascotTip(tips[tipIndex])
  }, [location.pathname, language, dayOfYear])

  const handleStartChallenge = () => {
    navigate('/challenge', { state: { challenge: todayChallenge } })
  }

  const handleStartSkillChallenge = (challenge: Challenge) => {
    navigate('/challenge', { state: { challenge } })
  }

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 3 }).map((_, i) => (
      <span 
        key={i} 
        className={`text-lg font-bold ${i < difficulty ? 'text-amber-500' : 'text-slate-200'}`}
      >
        ★
      </span>
    ))
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-6">
      
      {/* 1. Header Greeting */}
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight font-display">
          {getGreeting()}
        </h2>
        <p className="text-sm text-slate-500 font-sans font-medium">
          {completedToday ? t('completed_today') : t('welcome_slogan')}
        </p>
      </div>

      {/* 2. Mascot Talking Bubble */}
      <div className="bg-amber-50 border border-amber-200/40 rounded-3xl p-4 flex items-center gap-4 relative shadow-sm">
        <ImoleMascot expression={completedToday ? 'excited' : 'happy'} size={70} className="shrink-0" />
        <div className="flex-grow">
          {/* Talk bubble arrow */}
          <div className="absolute left-[80px] top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-50 border-l border-t border-amber-200/40 rotate-[-45deg] hidden xs:block" />
          <p className="text-xs font-bold text-slate-700 leading-relaxed font-sans px-2">
            {mascotTip}
          </p>
        </div>
      </div>

      {/* 3. Streak & Progress Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Streak card */}
        <div 
          onClick={() => navigate('/progress')}
          className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.02)] cursor-pointer hover:bg-slate-50/50 transition active-tap"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center mb-2 animate-pulse-fire">
            <Flame className={`w-6 h-6 ${streak.current > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
          </div>
          <span className="text-xs font-bold text-slate-400 font-sans uppercase tracking-wider">{t('streak_label')}</span>
          <span className="text-xl font-extrabold text-slate-800 font-display mt-0.5">{streak.current} {t('days_streak')}</span>
        </div>

        {/* XP / Completed card */}
        <div 
          onClick={() => navigate('/progress')}
          className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgba(0,0,0,0.02)] cursor-pointer hover:bg-slate-50/50 transition active-tap"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2">
            <Award className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-xs font-bold text-slate-400 font-sans uppercase tracking-wider">XP Points</span>
          <span className="text-xl font-extrabold text-slate-800 font-display mt-0.5">{scores.totalXp} XP</span>
        </div>
      </div>

      {/* 4. Today's Daily Challenge Panel */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-black text-slate-800 font-display uppercase tracking-wide px-1">
          {t('daily_challenge')}
        </h3>

        {completedToday ? (
          /* Challenge Done State */
          <div className="bg-emerald-50/60 border-2 border-emerald-200/50 rounded-3xl p-6 flex flex-col items-center text-center gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/30 rounded-full translate-x-8 -translate-y-8" />
            <CheckCircle2 className="w-14 h-14 text-emerald-500 fill-emerald-50 stroke-[2.5]" />
            <div>
              <h4 className="text-xl font-black text-slate-800 font-display">{t('completed_today')}</h4>
              <p className="text-sm font-semibold text-emerald-600 mt-1 font-sans px-4">
                {t('return_tomorrow')}
              </p>
            </div>
            
            {/* View certificate shortcut */}
            <button
              onClick={() => navigate('/progress')}
              className="mt-2 text-xs font-bold text-slate-500 hover:text-slate-800 underline active-tap"
            >
              {t('certificates_title')} →
            </button>
          </div>
        ) : (
          /* Active Play State */
          <div className="bg-white border-2 border-amber-500/20 rounded-3xl p-6 flex flex-col gap-4 shadow-md hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden">
            {/* Orange background blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full translate-x-12 -translate-y-12 z-0" />
            
            <div className="relative z-10 flex flex-col gap-1.5">
              {/* Category tag */}
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider font-sans">
                  {challengeTitle}
                </span>
                <div className="flex items-center gap-0.5">
                  {getDifficultyStars(todayChallenge.difficulty)}
                </div>
              </div>

              {/* Challenge summary */}
              <h4 className="text-2xl font-black text-slate-800 tracking-tight font-display mt-2 leading-snug">
                Today's Life Skill Quest
              </h4>
              <p className="text-sm font-semibold text-slate-500 font-sans leading-relaxed mt-1 line-clamp-3">
                {/* Grab preview from English for dashboard simplicity */}
                {todayChallenge.translations[language]?.prompt || todayChallenge.translations.en.prompt}
              </p>
            </div>

            <button
              onClick={handleStartChallenge}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-display text-base font-extrabold py-3.5 px-6 rounded-2xl shadow-[0_4px_12px_rgba(245,158,11,0.25)] transition duration-150 flex items-center justify-center gap-2 active-tap mt-2 z-10"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t('start_challenge')}</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Practice Tracks */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between px-1">
          <div>
            <h3 className="text-lg font-black text-slate-800 font-display uppercase tracking-wide">
              Skill Practice
            </h3>
            <p className="text-xs font-semibold text-slate-400">
              Complete all 30 challenges to unlock every certificate
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {challengeTracks.map((track) => {
            const progressPercent = Math.round((track.completed / track.challenges.length) * 100)
            const preview = track.nextChallenge.translations[language]?.prompt || track.nextChallenge.translations.en.prompt

            return (
              <button
                key={track.skill}
                type="button"
                onClick={() => handleStartSkillChallenge(track.nextChallenge)}
                className="group rounded-3xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:border-amber-300 hover:bg-amber-50/30 active-tap"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-sm font-extrabold text-slate-800">
                      {t(`skills.${track.skill}`)}
                    </span>
                    <span className="line-clamp-2 text-xs font-semibold leading-relaxed text-slate-500">
                      {track.isComplete ? 'All challenges complete. Tap to replay.' : preview}
                    </span>
                  </div>

                  <span className={`shrink-0 rounded-2xl px-2.5 py-1 text-[10px] font-black ${
                    track.isComplete
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {track.completed}/{track.challenges.length}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${track.isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Summary Info Banner */}
      <div className="bg-slate-800 text-white rounded-3xl p-5 flex items-center justify-between shadow-md overflow-hidden relative">
        <div className="absolute left-0 top-0 w-24 h-24 bg-white/5 rounded-full -translate-x-8 -translate-y-8" />
        <div className="flex flex-col gap-1 z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Total Journey</span>
          <span className="text-lg font-black font-display">{completedCount} Challenges Done</span>
        </div>
        <div className="bg-amber-500 text-white text-xs font-extrabold font-display py-2 px-4 rounded-xl z-10 shadow-sm">
          🏆 Level {Math.floor(scores.totalXp / 300) + 1}
        </div>
      </div>

    </div>
  )
}
