import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Flame, Sparkles, XCircle } from 'lucide-react'
import { useLanguage, useProfile } from '../App'
import { StorageService } from '../services/storage'

interface ChallengeTranslation {
  prompt: string
  options?: string[]
  correctAnswer?: string
  feedbackTip: string
}

interface Challenge {
  id: string
  skill: 'mentalMath' | 'speaking' | 'finance' | 'creativity' | 'emotionalIQ'
  difficulty: number
  responseType: 'text' | 'multipleChoice' | 'scenario'
  videoUrl?: string
  videoTitle?: string
  translations: {
    en: ChallengeTranslation
    pcm: ChallengeTranslation
    yo: ChallengeTranslation
  }
}

interface FeedbackState {
  isCorrect: boolean
  score: number
  xpEarned: number
  feedbackTip: string
  correctAnswer: string | null
  responseType: 'text' | 'multipleChoice' | 'scenario'
  skill: string
  challenge?: Challenge
}

export default function FeedbackScreen() {
  const { t } = useLanguage()
  const { profile } = useProfile()
  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state as FeedbackState | undefined

  useEffect(() => {
    if (!state) {
      navigate('/dashboard', { replace: true })
    }
  }, [state, navigate])

  if (!state) return null

  const { isCorrect, xpEarned, feedbackTip, challenge } = state
  const streak = StorageService.getStreak()
  const streakCount = streak.current || 0
  const isMilestone = isCorrect && streakCount > 0 && streakCount % 7 === 0
  const displayPoints = isCorrect ? xpEarned : 0

  const title = isCorrect
    ? isMilestone
      ? 'You are on fire!'
      : `Well done,\n${profile?.name || 'Imole Star'}!`
    : t('incorrect_title')

  const lesson = isCorrect
    ? feedbackTip
    : feedbackTip || t('incorrect_subtitle')

  const handleSecondaryAction = () => {
    if (isCorrect || !challenge) {
      navigate('/dashboard')
      return
    }
    navigate('/challenge', { state: { challenge }, replace: true })
  }

  return (
    <div className="min-h-dvh w-full bg-[#F8EFD9] px-5 py-10 text-[#171717]">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-sm flex-col">
        <section className="flex flex-1 flex-col items-center pt-8 text-center">
          <div className="flex h-[116px] w-[116px] items-center justify-center rounded-full bg-[#F9C94A] text-slate-950 shadow-sm">
            {isMilestone ? (
              <div className="flex flex-col items-center leading-none">
                <span className="font-display text-6xl font-black tracking-normal">{streakCount}</span>
                <span className="mt-1 text-xs font-black uppercase">Days</span>
              </div>
            ) : isCorrect ? (
              <Sparkles className="h-14 w-14 stroke-[2.5]" />
            ) : (
              <XCircle className="h-16 w-16 stroke-[2.2]" />
            )}
          </div>

          {isMilestone && (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#D99A1B] px-4 py-2 text-sm font-bold text-slate-950">
              <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
              <span>{streakCount}- day Milestone</span>
            </div>
          )}

          <h1 className="mt-6 whitespace-pre-line font-display text-[32px] font-black leading-tight tracking-normal">
            {title}
          </h1>

          <p className="mt-5 text-base font-semibold text-[#B57700]">
            + {displayPoints} points earned
          </p>

          {!isMilestone && (
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#E7DDC9] px-4 py-2 text-sm font-semibold text-[#A86F00]">
              <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
              <span>{streakCount}- day Streak</span>
            </div>
          )}

          <div className="mt-16 w-full rounded-2xl bg-[#FFF4BE] px-4 py-6 text-left shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-normal text-slate-400">
              Today's Lesson
            </h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-slate-700">
              {lesson}
            </p>
          </div>

          {/* YouTube Watch Again Card */}
          {challenge?.videoUrl && (
            <a
              href={challenge.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm hover:bg-slate-50 transition active-tap text-left"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Watch the lesson video
                </span>
                <span className="truncate text-xs font-bold text-slate-600">
                  {challenge.videoTitle}
                </span>
              </div>
              <svg viewBox="0 0 24 24" className="ml-auto h-4 w-4 shrink-0 fill-none stroke-slate-300 stroke-2" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>
          )}
        </section>

        <section className="flex w-full flex-col gap-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-8">
          <button
            type="button"
            onClick={() => navigate('/progress')}
            className="h-11 w-full rounded-full bg-[#F59E0B] text-base font-black text-black shadow-sm transition hover:bg-[#E89208] active-tap"
          >
            See my progress
          </button>

          <button
            type="button"
            onClick={handleSecondaryAction}
            className="h-11 w-full rounded-full bg-white text-base font-black text-slate-900 shadow-sm transition hover:bg-slate-50 active-tap"
          >
            {isCorrect ? 'Back to Home' : 'Try Again'}
          </button>
        </section>
      </div>
    </div>
  )
}