import React, { createContext, useContext, useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import translationsData from './data/translations.json'
import { StorageService, type Profile } from './services/storage'

// Type definitions for translations
type LanguageCode = 'en' | 'pcm' | 'yo'
type Translations = typeof translationsData.en

// Language Context
interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}

// Profile Context
interface ProfileContextType {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
  signIn: (accountId: string) => Profile | null
  signOut: () => void
  refreshProfile: () => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile must be used within a ProfileProvider')
  return context
}

// Translation Helper helper function
function getNestedValue(obj: any, path: string): string {
  const parts = path.split('.')
  let current = obj
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return path // fallback to key
    }
  }
  return typeof current === 'string' ? current : path
}

// Main Screens Imports (to be created next)
import Splash from './pages/Splash'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import ChallengeScreen from './pages/ChallengeScreen'
import FeedbackScreen from './pages/FeedbackScreen'
import ProgressScreen from './pages/ProgressScreen'
import LeaderboardScreen from './pages/LeaderboardScreen'
import ProfileScreen from './pages/ProfileScreen'
import Layout from './components/Layout'
import ImoleLoader from './components/ImoleLoader'

function MainAppRoutes() {
  const { profile } = useProfile()
  const location = useLocation()
  
  // Exclude splash and onboarding from profile gate
  const isPublicPage = location.pathname === '/' || location.pathname === '/onboarding'

  if (!profile && !isPublicPage) {
    return <Navigate to="/" replace />
  }

  if (profile && isPublicPage) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* Tabbed Layout Pages */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/challenge" element={<ChallengeScreen />} />
        <Route path="/feedback" element={<FeedbackScreen />} />
        <Route path="/progress" element={<ProgressScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      
      <Route path="*" element={<Navigate to={profile ? "/dashboard" : "/"} replace />} />
    </Routes>
  )
}

export default function App() {
  const [profile, setProfileState] = useState<Profile | null>(null)
  const [language, setLanguageState] = useState<LanguageCode>('en')
  const [isLoading, setIsLoading] = useState(true)
  const [loaderLabel, setLoaderLabel] = useState('Loading Imole')

  const showLoaderBriefly = (label: string) => {
    setLoaderLabel(label)
    setIsLoading(true)
    window.setTimeout(() => setIsLoading(false), 750)
  }

  const refreshProfile = () => {
    const activeProfile = StorageService.getProfile()
    setProfileState(activeProfile)
    if (activeProfile) {
      setLanguageState(activeProfile.language)
    }
  }

  useEffect(() => {
    refreshProfile()
    setIsLoading(false)
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    if (profile) {
      const updatedProfile = { ...profile, language: lang }
      StorageService.saveProfile(updatedProfile)
      setProfileState(updatedProfile)
    }
  }

  const setProfile = (newProfile: Profile | null) => {
    if (newProfile) {
      showLoaderBriefly('Setting up Imole')
      StorageService.saveProfile(newProfile)
      setLanguageState(newProfile.language)
    } else {
      showLoaderBriefly('Signing out')
      StorageService.signOut()
    }
    setProfileState(newProfile)
  }

  const signIn = (accountId: string): Profile | null => {
    showLoaderBriefly('Signing in to Imole')
    const signedInProfile = StorageService.signIn(accountId)
    setProfileState(signedInProfile)
    if (signedInProfile) {
      setLanguageState(signedInProfile.language)
    }
    return signedInProfile
  }

  const signOut = () => {
    setProfile(null)
  }

  // Value translation helper
  const t = (key: string): string => {
    const langDict = translationsData[language] || translationsData.en
    return getNestedValue(langDict, key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ProfileContext.Provider value={{ profile, setProfile, signIn, signOut, refreshProfile }}>
        <HashRouter>
          <div className="min-h-screen bg-[#FFFDF7] text-[#1E293B] flex justify-center">
            {/* Limit UI bounds on mobile, but expand to support desktop viewports */}
            <div className="w-full max-w-md md:max-w-5xl bg-[#FFFDF7] shadow-xl relative flex flex-col min-h-screen border-x border-[#F59E0B]/10 overflow-x-hidden">
              {isLoading ? <ImoleLoader label={loaderLabel} /> : <MainAppRoutes />}
            </div>
          </div>
        </HashRouter>
      </ProfileContext.Provider>
    </LanguageContext.Provider>
  )
}
