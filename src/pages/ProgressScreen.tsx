import React, { useState, useEffect } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Award, Share2, Shield, Lock, Eye, AlertCircle } from 'lucide-react'
import { useLanguage, useProfile } from '../App'
import { StorageService, type Scores, type Session, type Streak } from '../services/storage'
import CertificateGenerator from '../components/CertificateGenerator'
import ShareCardGenerator from '../components/ShareCardGenerator'
import challengesData from '../data/challenges.json'

type SkillKey = 'mentalMath' | 'speaking' | 'finance' | 'creativity' | 'emotionalIQ'

export default function ProgressScreen() {
  const { t } = useLanguage()
  const { profile } = useProfile()

  // Modals state
  const [activeCert, setActiveCert] = useState<{ key: string; name: string } | null>(null)
  const [showShareCard, setShowShareCard] = useState(false)

  // Scores and stats state
  const [scores, setScores] = useState<Scores>({ mentalMath: 0, speaking: 0, finance: 0, creativity: 0, emotionalIQ: 0, totalXp: 0 })
  const [sessions, setSessions] = useState<Session[]>([])
  const [streak, setStreak] = useState<Streak>({ current: 0, best: 0, lastCompletedDate: "" })
  
  // Category completions
  const [completions, setCompletions] = useState({
    mentalMath: 0,
    speaking: 0,
    finance: 0,
    creativity: 0,
    emotionalIQ: 0
  })

  useEffect(() => {
    const activeScores = StorageService.getScores()
    setScores(activeScores)

    const activeSessions = StorageService.getSessions()
    setSessions(activeSessions)

    const activeStreak = StorageService.getStreak()
    setStreak(activeStreak)

    // Calculate unique completions per skill from the implemented challenge set.
    const completedIds = new Set(activeSessions.map((session) => session.challengeId))
    const counts = {
      mentalMath: challengesData.filter(item => item.skill === 'mentalMath' && completedIds.has(item.id)).length,
      speaking: challengesData.filter(item => item.skill === 'speaking' && completedIds.has(item.id)).length,
      finance: challengesData.filter(item => item.skill === 'finance' && completedIds.has(item.id)).length,
      creativity: challengesData.filter(item => item.skill === 'creativity' && completedIds.has(item.id)).length,
      emotionalIQ: challengesData.filter(item => item.skill === 'emotionalIQ' && completedIds.has(item.id)).length
    }
    setCompletions(counts)
  }, [])

  // Prepare chart data
  const skillsData = [
    { subject: t('skills.mentalMath'), A: completions.mentalMath * 16.6 || 0, fullMark: 100 },
    { subject: t('skills.speaking'), A: completions.speaking * 16.6 || 0, fullMark: 100 },
    { subject: t('skills.finance'), A: completions.finance * 16.6 || 0, fullMark: 100 },
    { subject: t('skills.creativity'), A: completions.creativity * 16.6 || 0, fullMark: 100 },
    { subject: t('skills.emotionalIQ'), A: completions.emotionalIQ * 16.6 || 0, fullMark: 100 }
  ]

  // Check if any certificates are unlocked (requires 6 completed challenges per category)
  const skillCategories = [
    { key: 'mentalMath', name: t('skills.mentalMath'), color: 'bg-blue-500' },
    { key: 'speaking', name: t('skills.speaking'), color: 'bg-purple-500' },
    { key: 'finance', name: t('skills.finance'), color: 'bg-emerald-500' },
    { key: 'creativity', name: t('skills.creativity'), color: 'bg-orange-500' },
    { key: 'emotionalIQ', name: t('skills.emotionalIQ'), color: 'bg-rose-500' }
  ]

  const totalPossible = challengesData.length
  const uniqueCompletedCount = new Set(sessions.map((session) => session.challengeId)).size
  const completionPercentage = Math.round((uniqueCompletedCount / totalPossible) * 100)

  // Quick total completions checking
  const hasUnlocks = Object.values(completions).some(val => val >= 6)

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-6">
      
      {/* 1. Header with Share button */}
      <div className="flex justify-between items-center mt-2">
        <div>
          <h2 className="text-2xl font-black text-slate-800 font-display">{t('nav_progress')}</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Check your skills growth and download awards</p>
        </div>
        
        {/* Share Button */}
        <button
          onClick={() => setShowShareCard(true)}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-display text-xs font-bold py-2.5 px-4 rounded-2xl transition duration-150 active-tap shadow-sm"
        >
          <Share2 className="w-4 h-4 fill-white" />
          <span>{t('share_card_title')}</span>
        </button>
      </div>

      {/* 2. Visual Analytics Radar Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col items-center">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest font-display self-start mb-2 px-1">
          {t('overall_skills')} (%)
        </h3>
        
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-3">
            <AlertCircle className="w-10 h-10 text-amber-500" />
            <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-xs">
              Complete your first challenge to see your skills radar chart!
            </p>
          </div>
        ) : (
          <div className="w-full h-60 flex items-center justify-center pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillsData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 8 }} />
                <Radar
                  name={profile?.name || 'User'}
                  dataKey="A"
                  stroke="#F59E0B"
                  fill="#FBBF24"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 3. Completed Journey stats list */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total completed */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Quests</span>
          <span className="text-2xl font-black text-slate-800 font-display mt-1">{uniqueCompletedCount} / {totalPossible}</span>
        </div>

        {/* Completion rate */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Rate</span>
          <span className="text-2xl font-black text-slate-800 font-display mt-1">{completionPercentage}%</span>
        </div>
      </div>

      {/* 4. Certificates Grid */}
      <div className="flex flex-col gap-3">
        <div className="px-1">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest font-display">
            {t('certificates_title')}
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            {t('certificates_subtitle')}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {skillCategories.map((cat) => {
            const count = completions[cat.key as keyof typeof completions] || 0
            const skillKey = cat.key as SkillKey
            const totalInCategory = challengesData.filter(item => item.skill === skillKey).length
            const isUnlocked = count >= totalInCategory
            const progressPercent = Math.min(Math.round((count / totalInCategory) * 100), 100)

            return (
              <div 
                key={cat.key}
                className={`border rounded-3xl p-4.5 bg-white flex items-center justify-between shadow-sm relative overflow-hidden transition-all duration-200 ${
                  isUnlocked ? 'border-amber-500/30' : 'border-slate-100'
                }`}
              >
                {/* Visual left colored bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${cat.color}`} />

                <div className="pl-4 flex-grow flex flex-col gap-1.5">
                  {/* Category Name */}
                  <span className="font-display font-extrabold text-sm text-slate-800">
                    {cat.name}
                  </span>
                  
                  {/* Progress details */}
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 h-2 w-32 rounded-full overflow-hidden relative shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      {count}/{totalInCategory} challenges
                    </span>
                  </div>
                </div>

                {/* Status indicator and action */}
                {isUnlocked ? (
                  <button
                    onClick={() => setActiveCert({ key: skillKey, name: cat.name })}
                    className="flex items-center justify-center p-2 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 transition active-tap shadow-sm"
                    title={t('download_certificate')}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="flex items-center justify-center p-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-300">
                    <Lock className="w-5 h-5" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Modals Mount */}
      {activeCert && profile && (
        <CertificateGenerator
          childName={profile.name}
          skillKey={activeCert.key}
          skillName={activeCert.name}
          onClose={() => setActiveCert(null)}
        />
      )}

      {showShareCard && profile && (
        <ShareCardGenerator
          childName={profile.name}
          streakCount={streak.current}
          completedCount={sessions.length}
          totalXp={scores.totalXp}
          onClose={() => setShowShareCard(false)}
        />
      )}

    </div>
  )
}
