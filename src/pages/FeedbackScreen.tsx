import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, X, Award, Flame, ArrowRight } from 'lucide-react'
import { useLanguage } from '../App'
import ImoleMascot from '../components/ImoleMascot'

interface FeedbackState {
  isCorrect: boolean
  score: number
  xpEarned: number
  feedbackTip: string
  correctAnswer: string | null
  responseType: 'text' | 'multipleChoice' | 'scenario'
  skill: string
}

export default function FeedbackScreen() {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state as FeedbackState | undefined

  // Redirect if accessed directly
  useEffect(() => {
    if (!state) {
      navigate('/dashboard', { replace: true })
    }
  }, [state, navigate])

  if (!state) return null

  const { isCorrect, score, xpEarned, feedbackTip, correctAnswer, responseType, skill } = state

  // Confetti particles generator
  const [particles, setParticles] = useState<{ id: number; color: string; left: number; size: number; delay: number; duration: number }[]>([])

  useEffect(() => {
    if (isCorrect) {
      const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#EF4444', '#FBBF24']
      const items = Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100, // percentage width
        size: Math.random() * 8 + 6, // px width/height
        delay: Math.random() * 1.5, // seconds delay
        duration: Math.random() * 2 + 2 // seconds duration
      }))
      setParticles(items)
    }
  }, [isCorrect])

  return (
    <div className="flex-grow flex flex-col justify-between select-none relative min-h-screen px-6 py-10 overflow-hidden">
      
      {/* Confetti Background rendering (Only if correct) */}
      {isCorrect && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-sm opacity-80"
              style={{
                backgroundColor: p.color,
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: `${p.left}%`,
                top: `-20px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
              }}
            />
          ))}
          {/* Confetti Animation Style */}
          <style>{`
            @keyframes fall {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(105vh) rotate(360deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {/* Main Feedback State */}
      <div className="flex-grow flex flex-col items-center justify-center gap-6 z-10 max-w-sm mx-auto w-full animate-fade-in">
        
        {/* Mascot representation */}
        <ImoleMascot expression={isCorrect ? 'excited' : 'sad'} size={120} />

        {/* Evaluation Banner */}
        <div className="text-center">
          {isCorrect ? (
            <>
              {/* Correct State */}
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-full text-white mb-3 shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight font-display">
                {t('congrats')}
              </h2>
              <p className="text-sm text-slate-500 font-semibold mt-1">
                {t('keep_it_up')}
              </p>
            </>
          ) : (
            <>
              {/* Incorrect State */}
              <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500 rounded-full text-white mb-3 shadow-[0_4px_12px_rgba(245,158,11,0.3)]">
                <X className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight font-display">
                {t('incorrect_title')}
              </h2>
              <p className="text-sm text-slate-500 font-semibold mt-1">
                {t('incorrect_subtitle')}
              </p>
            </>
          )}
        </div>

        {/* Score & XP Cards */}
        <div className="flex gap-4 w-full mt-2">
          {/* XP Gained card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-4 flex-1 flex flex-col items-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Points</span>
            <span className="text-lg font-extrabold text-amber-500 font-display mt-0.5">+{xpEarned} XP</span>
          </div>

          {/* Correct answer check if wrong */}
          {!isCorrect && correctAnswer && (
            <div className="bg-white border border-slate-100 rounded-3xl p-4 flex-1 flex flex-col items-center shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Correct Answer</span>
              <span className="text-xs font-bold text-emerald-600 font-sans mt-1 line-clamp-2">
                {correctAnswer}
              </span>
            </div>
          )}
        </div>

        {/* Expert Tip speech bubble card */}
        <div className="w-full bg-[#FFFDF7] border-2 border-[#F59E0B]/20 rounded-3xl p-5 shadow-sm mt-2">
          <h4 className="text-xs font-black text-amber-600 font-display uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            💡 {t('feedback_title')}
          </h4>
          <p className="text-sm font-bold text-slate-700 leading-relaxed font-sans">
            {feedbackTip}
          </p>
        </div>

      </div>

      {/* Action button */}
      <div className="w-full max-w-sm mx-auto z-10 mt-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-display text-base font-extrabold py-4 px-6 rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 active-tap"
        >
          <span>{t('back_to_dashboard')}</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

    </div>
  )
}
