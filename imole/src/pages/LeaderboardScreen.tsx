import React, { useState, useEffect } from 'react'
import { Trophy, Flame, Award, Star } from 'lucide-react'
import { useLanguage, useProfile } from '../App'
import { StorageService, type Streak, type Scores } from '../services/storage'

interface LeaderboardUser {
  rank?: number
  name: string
  streak: number
  xp: number
  badge: string
  isUser?: boolean
}

export default function LeaderboardScreen() {
  const { t } = useLanguage()
  const { profile } = useProfile()
  
  const [boardData, setBoardData] = useState<LeaderboardUser[]>([])

  useEffect(() => {
    // 1. Fetch user scores and streaks
    const scores = StorageService.getScores()
    const streak = StorageService.getStreak()
    const name = profile?.name || 'You'

    // 2. Default seeded board data
    const seedUsers: LeaderboardUser[] = [
      { name: 'Star Learner 🌟', streak: 15, xp: 1800, badge: 'Consistency Hero' },
      { name: 'Bright Thinker 💡', streak: 12, xp: 1450, badge: 'Bright Thinker' },
      { name: 'Future Leader 🚀', streak: 8, xp: 950, badge: 'Future Leader' },
      { name: 'Naira Saver 💰', streak: 5, xp: 600, badge: 'Future Leader' },
      { name: 'Zobo Boss 🍹', streak: 3, xp: 350, badge: 'Star Learner' },
      { name: 'Logic Master 🧩', streak: 1, xp: 150, badge: 'Star Learner' }
    ]

    // 3. Add current user
    const userRecord: LeaderboardUser = {
      name: `${name} (${t('you')}) 💡`,
      streak: streak.current,
      xp: scores.totalXp,
      badge: streak.current >= 7 ? 'Consistency Hero' : (streak.current >= 3 ? 'Bright Thinker' : 'Star Learner'),
      isUser: true
    }

    // Combine and sort by XP, then streak
    const combined = [...seedUsers, userRecord]
    combined.sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp
      return b.streak - a.streak
    })

    // Assign ranks
    const ranked = combined.map((u, i) => ({ ...u, rank: i + 1 }))
    setBoardData(ranked)
  }, [profile, t])

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-600', icon: '🏆' }
      case 2:
        return { bg: 'bg-slate-100 border-slate-200', text: 'text-slate-500', icon: '🥈' }
      case 3:
        return { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-600', icon: '🥉' }
      default:
        return { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-400', icon: '' }
    }
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-6">
      
      {/* 1. Header Title */}
      <div className="flex items-center gap-3 mt-2">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
          <Trophy className="w-6 h-6 text-amber-500 fill-amber-50" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 font-display">{t('leaderboard_title')}</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">{t('leaderboard_subtitle')}</p>
        </div>
      </div>

      {/* 2. Podium Highlights (Top 3 Visuals) */}
      <div className="grid grid-cols-3 gap-2 items-end justify-center py-4 bg-slate-50/50 rounded-3xl border border-slate-100 px-3 shadow-inner mt-1">
        
        {/* 2nd Place */}
        {boardData[1] && (
          <div className="flex flex-col items-center gap-1 animate-fade-in">
            <span className="text-2xl">🥈</span>
            <div className="bg-white border-2 border-slate-200/50 h-24 w-full rounded-2xl p-2 flex flex-col justify-between items-center text-center shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 truncate w-full">{boardData[1].name.split(' ')[0]}</span>
              <span className="text-xs font-black text-slate-800 font-display">{boardData[1].xp} XP</span>
              <span className="bg-slate-100 text-slate-500 text-[8px] font-bold py-0.5 px-2 rounded-full flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 fill-current" /> {boardData[1].streak}d
              </span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {boardData[0] && (
          <div className="flex flex-col items-center gap-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-3xl animate-bounce">🏆</span>
            <div className="bg-amber-50 border-2 border-amber-300 h-32 w-full rounded-2xl p-2 flex flex-col justify-between items-center text-center shadow-md">
              <span className="text-xs font-black text-amber-700 truncate w-full">{boardData[0].name.split(' ')[0]}</span>
              <span className="text-sm font-black text-slate-800 font-display">{boardData[0].xp} XP</span>
              <span className="bg-amber-100 text-amber-600 text-[8px] font-bold py-0.5 px-2.5 rounded-full flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 fill-current" /> {boardData[0].streak}d
              </span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {boardData[2] && (
          <div className="flex flex-col items-center gap-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-2xl">🥉</span>
            <div className="bg-white border-2 border-orange-200 h-24 w-full rounded-2xl p-2 flex flex-col justify-between items-center text-center shadow-sm">
              <span className="text-[10px] font-bold text-orange-500 truncate w-full">{boardData[2].name.split(' ')[0]}</span>
              <span className="text-xs font-black text-slate-800 font-display">{boardData[2].xp} XP</span>
              <span className="bg-orange-50 text-orange-500 text-[8px] font-bold py-0.5 px-2 rounded-full flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 fill-current" /> {boardData[2].streak}d
              </span>
            </div>
          </div>
        )}

      </div>

      {/* 3. Leaderboard List Table */}
      <div className="flex flex-col gap-2.5">
        {boardData.map((user) => {
          const rank = user.rank || 4
          const styles = getRankStyle(rank)
          
          return (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-4 rounded-3xl border transition duration-150 ${
                user.isUser
                  ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                  : 'border-slate-100 bg-white shadow-sm'
              }`}
            >
              {/* Left Details (Rank, Name, Badge) */}
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-display font-extrabold text-xs border ${styles.bg} ${styles.text}`}>
                  {styles.icon ? styles.icon : rank}
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className={`text-sm font-bold truncate max-w-[150px] ${user.isUser ? 'text-amber-700 font-black' : 'text-slate-800'}`}>
                    {user.name}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    {user.badge}
                  </span>
                </div>
              </div>

              {/* Right details (Streak & XP) */}
              <div className="flex items-center gap-4">
                {/* Streak flame */}
                <div className="flex items-center gap-1">
                  <Flame className={`w-4 h-4 ${user.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-300'}`} />
                  <span className="text-xs font-bold text-slate-600">{user.streak}d</span>
                </div>
                
                {/* XP */}
                <div className="bg-slate-50 border border-slate-100 py-1 px-3 rounded-full text-right min-w-[70px] shadow-inner">
                  <span className="text-xs font-black text-slate-700 font-display">{user.xp} XP</span>
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
