import React, { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, X, Flame, CheckCircle, Share2 } from 'lucide-react'
import { useLanguage } from '../App'
import sunLogo from '../assets/sun.png'

interface ShareCardProps {
  childName: string
  streakCount: number
  completedCount: number
  totalXp: number
  onClose: () => void
}

export default function ShareCardGenerator({ childName, streakCount, completedCount, totalXp, onClose }: ShareCardProps) {
  const { t } = useLanguage()
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current) return
    setDownloading(true)
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#FFFDF7',
        width: 400,
        height: 400,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          margin: '0',
          padding: '0'
        }
      })
      
      const link = document.createElement('a')
      link.download = `${childName.replace(/\s+/g, '_')}_Imole_Achievements.png`
      link.href = dataUrl
      link.click()
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error rendering share card:', error)
      alert('Could not download image. Try taking a screenshot instead!')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Card wrapper */}
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in relative flex flex-col gap-4 border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition active-tap text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center mt-2">
          <h3 className="text-lg font-black text-slate-800 font-display flex items-center justify-center gap-1.5">
            <Share2 className="w-5 h-5 text-amber-500" />
            <span>{t('share_card_title')}</span>
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            {t('share_card_subtitle')}
          </p>
        </div>

        {/* Share Card Container (Visual Node) */}
        <div className="overflow-hidden border border-slate-200/50 rounded-2xl shadow-inner bg-slate-50 flex items-center justify-center p-2">
          <div
            ref={cardRef}
            id="imole-share-card-print"
            className="w-[400px] height-[400px] aspect-square bg-[#FFFDF7] border-8 border-slate-800 p-6 flex flex-col justify-between items-center text-center relative select-none font-sans"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
            }}
          >
            {/* Logo Badge */}
            <div className="flex items-center gap-1.5">
              <img src={sunLogo} alt="Imole Logo" className="w-6 h-6 object-contain" />
              <span className="font-display text-base font-extrabold tracking-tight text-amber-500">Imole</span>
            </div>

            {/* Achievement text */}
            <div className="flex flex-col gap-1 w-full my-2">
              <span className="text-[10px] font-black tracking-widest text-[#1E293B]/50 uppercase">Look my growth!</span>
              <h2 className="text-xl font-black text-slate-800 font-display capitalize">
                {childName}
              </h2>
              <p className="text-xs font-bold text-slate-500 max-w-xs mx-auto leading-relaxed mt-1">
                is learning important life skills and shining bright on Imole!
              </p>
            </div>

            {/* Stats display */}
            <div className="grid grid-cols-2 gap-4 w-full my-1.5">
              {/* Streak info */}
              <div className="bg-amber-50 border-2 border-amber-500/10 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">Consistency</span>
                <span className="text-sm font-extrabold text-slate-800 font-display">{streakCount} Day Streak</span>
              </div>

              {/* Completion info */}
              <div className="bg-emerald-50 border-2 border-emerald-500/10 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1">Completed</span>
                <span className="text-sm font-extrabold text-slate-800 font-display">{completedCount} Challenges</span>
              </div>
            </div>

            {/* Quote slogan */}
            <div className="flex flex-col items-center mt-1">
              <p className="text-xs font-bold text-slate-700 italic font-sans">
                "Be the Light Among Your Peers."
              </p>
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">
                imole-app.web.app • join me!
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-2.5 mt-1">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-display text-base font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 active-tap"
          >
            <Download className="w-4 h-4 text-amber-400 fill-current" />
            <span>{downloading ? 'Preparing File...' : t('download_share')}</span>
          </button>

          {success && (
            <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-bold text-center animate-pulse">
              <CheckCircle className="w-4 h-4" />
              <span>Share card saved to your device gallery!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
