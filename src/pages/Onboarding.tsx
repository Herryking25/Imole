import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { useProfile, useLanguage } from '../App'
import ImoleMascot from '../components/ImoleMascot'

export default function Onboarding() {
  const { setProfile } = useProfile()
  const { language: currentLang, setLanguage } = useLanguage()
  const navigate = useNavigate()

  // Form states
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [age, setAge] = useState<number | null>(null)
  const [selectedLang, setSelectedLang] = useState<'en' | 'pcm' | 'yo'>(currentLang)

  const ages = [8, 9, 10, 11, 12, 13, 14, 15, 16]

  // Translation helpers specifically for onboarding BEFORE profile is set
  const getOnboardingText = {
    title: {
      en: "Let's get you set up!",
      pcm: "Make we set you up!",
      yo: "Jẹ ki a ṣe eto rẹ!"
    },
    subtitle: {
      en: "Be the Light among your peers.",
      pcm: "Be the Light among your peers.",
      yo: "Jẹ Imọlẹ laarin awọn ẹlẹgbẹ rẹ."
    },
    nameLabel: {
      en: "Wetin be your name? / What is your name?",
      pcm: "Wetin be your name? / What is your name?",
      yo: "Kini orúkọ rẹ?"
    },
    namePlaceholder: {
      en: "Enter your nickname...",
      pcm: "Enter your nickname...",
      yo: "Kọ orúkọ rẹ si ibi..."
    },
    ageLabel: {
      en: "How old are you?",
      pcm: "How old you dey?",
      yo: "Ọdun melo ni ọ?"
    },
    langLabel: {
      en: "Which language do you prefer?",
      pcm: "Which language you like pass?",
      yo: "Ede wo ni o fẹran ju?"
    },
    back: {
      en: "Back",
      pcm: "Back",
      yo: "Pada"
    },
    next: {
      en: "Next",
      pcm: "Go front",
      yo: "Tẹsiwaju"
    },
    finish: {
      en: "Let's Go!",
      pcm: "Make we go!",
      yo: "Bẹrẹ!"
    },
    errorName: {
      en: "Please enter your name!",
      pcm: "Please put your name here!",
      yo: "Jọwọ kọ orúkọ rẹ!"
    },
    errorAge: {
      en: "Please select your age!",
      pcm: "Please select your age!",
      yo: "Jọwọ yan ọjọ-ori rẹ!"
    }
  }

  const tOnboard = (key: keyof typeof getOnboardingText) => {
    return getOnboardingText[key][selectedLang] || getOnboardingText[key]['en']
  }

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        alert(tOnboard('errorName'))
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!age) {
        alert(tOnboard('errorAge'))
        return
      }
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFinish = () => {
    if (!name.trim() || !age) return

    // Save profile to local storage and trigger global state update
    const newProfile = {
      name: name.trim(),
      age: age,
      language: selectedLang,
      createdAt: new Date().toISOString()
    }
    
    // Set language context
    setLanguage(selectedLang)
    // Save profile (triggers app refresh)
    setProfile(newProfile)
    // Navigate to dashboard
    navigate('/dashboard')
  }

  return (
    <div className="flex-grow flex flex-col justify-between px-6 py-8 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        {step > 1 ? (
          <button 
            onClick={handleBack}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold text-sm py-1.5 px-3 rounded-xl hover:bg-slate-100 transition active-tap"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{tOnboard('back')}</span>
          </button>
        ) : (
          <div className="w-10" />
        )}
        
        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-amber-500 w-4' : 'bg-slate-200'}`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-amber-500 w-4' : 'bg-slate-200'}`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-amber-500 w-4' : 'bg-slate-200'}`} />
        </div>

        <div className="w-10" />
      </div>

      {/* Center Content Card */}
      <div className="flex-grow flex flex-col items-center justify-center my-6 max-w-sm mx-auto w-full">
        
        {/* Step 1: Mascot & Name Input */}
        {step === 1 && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            <ImoleMascot expression="happy" size={120} />
            
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-800 font-display">{tOnboard('title')}</h2>
              <p className="text-sm text-slate-500 font-sans mt-1">{tOnboard('subtitle')}</p>
            </div>

            <div className="w-full flex flex-col gap-2 mt-2">
              <label className="text-sm font-bold text-slate-600 self-start px-1">
                {tOnboard('nameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={tOnboard('namePlaceholder')}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-base font-bold text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none transition duration-200"
                maxLength={20}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Step 2: Mascot & Age Picker Grid */}
        {step === 2 && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            <ImoleMascot expression="thinking" size={110} />
            
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-800 font-display">{tOnboard('ageLabel')}</h2>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full mt-2">
              {ages.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAge(item)}
                  className={`border-2 rounded-2xl py-4.5 text-lg font-extrabold font-display transition duration-150 active-tap ${
                    age === item
                      ? 'border-amber-500 bg-amber-50 text-amber-600 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Mascot & Language Flags Selector */}
        {step === 3 && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            <ImoleMascot expression="excited" size={110} />
            
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-800 font-display">{tOnboard('langLabel')}</h2>
            </div>

            <div className="flex flex-col gap-3 w-full mt-2">
              {/* English */}
              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`flex items-center justify-between border-2 rounded-2xl p-4 text-left transition duration-150 active-tap ${
                  selectedLang === 'en'
                    ? 'border-amber-500 bg-amber-50 text-amber-600 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <span className="font-display font-extrabold text-base">English</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedLang === 'en' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                  {selectedLang === 'en' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>

              {/* Pidgin */}
              <button
                type="button"
                onClick={() => setSelectedLang('pcm')}
                className={`flex items-center justify-between border-2 rounded-2xl p-4 text-left transition duration-150 active-tap ${
                  selectedLang === 'pcm'
                    ? 'border-amber-500 bg-amber-50 text-amber-600 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇳🇬</span>
                  <span className="font-display font-extrabold text-base">Nigerian Pidgin</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedLang === 'pcm' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                  {selectedLang === 'pcm' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>

              {/* Yoruba */}
              <button
                type="button"
                onClick={() => setSelectedLang('yo')}
                className={`flex items-center justify-between border-2 rounded-2xl p-4 text-left transition duration-150 active-tap ${
                  selectedLang === 'yo'
                    ? 'border-amber-500 bg-amber-50 text-amber-600 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇳🇬</span>
                  <span className="font-display font-extrabold text-base">Yorùbá</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedLang === 'yo' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                  {selectedLang === 'yo' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Actions */}
      <div className="w-full max-w-sm mx-auto mt-4">
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-display text-lg font-extrabold py-4 rounded-2xl shadow-md transition duration-200 flex items-center justify-center gap-2 active-tap"
          >
            <span>{tOnboard('next')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-display text-lg font-extrabold py-4 rounded-2xl shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition duration-200 flex items-center justify-center gap-2 active-tap"
          >
            <span>{tOnboard('finish')}</span>
          </button>
        )}
      </div>

    </div>
  )
}
