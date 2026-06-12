import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, Globe, Send } from 'lucide-react'
import { useLanguage, useProfile } from '../App'
import { StorageService, getLocalDateString, type Session } from '../services/storage'
import ImoleMascot from '../components/ImoleMascot'

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
  translations: {
    en: ChallengeTranslation
    pcm: ChallengeTranslation
    yo: ChallengeTranslation
  }
}

export default function ChallengeScreen() {
  const { t, language: profileLang } = useLanguage()
  const { profile } = useProfile()
  const location = useLocation()
  const navigate = useNavigate()

  // Retrieve challenge from navigation state
  const challenge = location.state?.challenge as Challenge | undefined

  // Redirect if no challenge is loaded
  useEffect(() => {
    if (!challenge) {
      navigate('/dashboard', { replace: true })
    }
  }, [challenge, navigate])

  if (!challenge) return null

  // Language state for this specific challenge (starts at user's profile preference)
  const [challengeLang, setChallengeLang] = useState<'en' | 'pcm' | 'yo'>(profileLang)
  const [showLangDropdown, setShowLangDropdown] = useState(false)

  // Form input states
  const [textAnswer, setTextAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  
  // Get active translations based on selected language
  const activeTranslation = challenge.translations[challengeLang] || challenge.translations.en
  const { prompt, options, correctAnswer, feedbackTip } = activeTranslation

  const handleLangSelect = (lang: 'en' | 'pcm' | 'yo') => {
    setChallengeLang(lang)
    setShowLangDropdown(false)
    // Clear answer selections if switching language to avoid option mismatches
    setSelectedOption(null)
  }

  const isSubmitDisabled = () => {
    if (challenge.responseType === 'text') {
      return textAnswer.trim().length < 5
    }
    return selectedOption === null
  }

  const handleSubmit = () => {
    if (isSubmitDisabled()) return

    // Calculate score
    let score = 0
    let isCorrect = false

    if (challenge.responseType === 'text') {
      // Open-ended answers are awarded full score for participation/effort
      score = 100
      isCorrect = true
    } else {
      // Multiple choice or scenario matches correct answer
      isCorrect = selectedOption === correctAnswer
      score = isCorrect ? 100 : 0
    }

    const xpEarned = isCorrect ? 100 : 50 // 100 XP for correct/effort, 50 XP participation

    // Save session log
    const session: Session = {
      date: getLocalDateString(),
      skillArea: challenge.skill,
      challengeId: challenge.id,
      response: challenge.responseType === 'text' ? textAnswer : (selectedOption || ""),
      score: score,
      completedAt: new Date().toISOString()
    }
    StorageService.saveSession(session)

    // Update streak tracking
    StorageService.updateStreakOnCompletion()

    // Add running score XP
    StorageService.addScore(challenge.skill, score, xpEarned)

    // Route to feedback screen
    navigate('/feedback', {
      state: {
        isCorrect,
        score,
        xpEarned,
        feedbackTip,
        correctAnswer: challenge.responseType !== 'text' ? correctAnswer : null,
        responseType: challenge.responseType,
        skill: challenge.skill
      },
      replace: true
    })
  }

  const getLanguageLabel = () => {
    switch (challengeLang) {
      case 'yo': return 'Yorùbá 🇳🇬'
      case 'pcm': return 'Pidgin 🇳🇬'
      case 'en':
      default:
        return 'English 🇬🇧'
    }
  }

  return (
    <div className="flex-grow flex flex-col justify-between select-none min-h-screen px-4 py-6">
      
      {/* 1. Minimal Header */}
      <div className="flex items-center justify-between w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2.5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition active-tap bg-white shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>

        {/* Progress Bar (Duolingo Style) */}
        <div className="flex-grow mx-4 bg-slate-100 h-3 rounded-full overflow-hidden relative shadow-inner">
          <div className="bg-amber-500 h-full rounded-full transition-all duration-300 w-1/2" />
        </div>

        {/* Challenge Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 border border-slate-200 bg-white py-2 px-3.5 rounded-2xl text-xs font-extrabold text-slate-700 shadow-sm active-tap"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{getLanguageLabel()}</span>
          </button>

          {showLangDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLangDropdown(false)} />
              <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1 animate-fade-in">
                <button
                  onClick={() => handleLangSelect('en')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-amber-50 transition ${challengeLang === 'en' ? 'text-amber-500' : 'text-slate-700'}`}
                >
                  English 🇬🇧
                </button>
                <button
                  onClick={() => handleLangSelect('pcm')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-amber-50 transition ${challengeLang === 'pcm' ? 'text-amber-500' : 'text-slate-700'}`}
                >
                  Pidgin 🇳🇬
                </button>
                <button
                  onClick={() => handleLangSelect('yo')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-amber-50 transition ${challengeLang === 'yo' ? 'text-amber-500' : 'text-slate-700'}`}
                >
                  Yorùbá 🇳🇬
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Challenge Body */}
      <div className="flex-grow flex flex-col justify-center my-6 max-w-sm mx-auto w-full gap-5">
        
        {/* Skill tag & Mascot header */}
        <div className="flex items-center gap-4">
          <ImoleMascot expression="thinking" size={70} className="shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider w-fit font-sans">
              {t(`skills.${challenge.skill}`)}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Difficulty: {Array.from({ length: challenge.difficulty }).map(() => '★').join('')}
            </span>
          </div>
        </div>

        {/* Prompt Question */}
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight leading-relaxed font-display px-1">
          {prompt}
        </h3>

        {/* Answer Input Area */}
        <div className="w-full mt-2">
          
          {challenge.responseType === 'text' && (
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder={t('placeholder_answer')}
              className="w-full min-h-[140px] bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 text-base font-semibold text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none transition duration-200 shadow-inner resize-none font-sans"
              maxLength={250}
            />
          )}

          {(challenge.responseType === 'multipleChoice' || challenge.responseType === 'scenario') && options && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 font-sans">
                {t('select_option')}
              </span>
              
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full border-2 rounded-2xl p-4.5 text-left text-sm font-bold leading-normal transition duration-150 active-tap ${
                    selectedOption === option
                      ? 'border-amber-500 bg-amber-50/60 text-amber-700 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedOption === option ? 'border-amber-500 bg-amber-500' : 'border-slate-300 bg-white'}`}>
                      {selectedOption === option && <div className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    <span className="font-sans font-bold">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* 3. Bottom Action Button */}
      <div className="w-full max-w-sm mx-auto">
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
          className={`w-full py-4.5 rounded-2xl font-display text-base font-extrabold flex items-center justify-center gap-2 transition duration-150 ${
            isSubmitDisabled()
              ? 'bg-slate-150 text-slate-400 cursor-not-allowed border-2 border-slate-200'
              : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md active-tap'
          }`}
        >
          <Send className="w-4 h-4 fill-current" />
          <span>{t('submit_btn')}</span>
        </button>
      </div>

    </div>
  )
}
