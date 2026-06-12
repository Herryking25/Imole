import React, { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, X, Award, CheckCircle } from 'lucide-react'
import { useLanguage } from '../App'
import sunLogo from '../assets/sun.png'

interface CertificateProps {
  childName: string
  skillKey: string
  skillName: string
  onClose: () => void
}

export default function CertificateGenerator({ childName, skillKey, skillName, onClose }: CertificateProps) {
  const { t } = useLanguage()
  const certificateRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleDownload = async () => {
    if (!certificateRef.current) return
    setDownloading(true)
    
    try {
      // Small delay to ensure all assets are loaded
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        backgroundColor: '#FFFDF7',
        width: 600,
        height: 420,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          margin: '0',
          padding: '0'
        }
      })
      
      const link = document.createElement('a')
      link.download = `${childName.replace(/\s+/g, '_')}_Imole_${skillKey}_Certificate.png`
      link.href = dataUrl
      link.click()
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error rendering certificate to image:', error)
      alert('Could not download image. Try taking a screenshot instead!')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Card wrapper */}
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-fade-in relative flex flex-col gap-4 border border-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition active-tap text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center mt-2">
          <h3 className="text-lg font-black text-slate-800 font-display">
            {t('cert_completed')}
          </h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Download your achievement card to show your parents!
          </p>
        </div>

        {/* Certificate Container (The actual node converted to PNG) */}
        <div className="overflow-hidden border border-slate-200/50 rounded-2xl shadow-inner bg-slate-50 flex items-center justify-center p-2">
          <div
            ref={certificateRef}
            id="imole-certificate-print"
            className="w-[600px] h-[420px] bg-[#FFFDF7] border-[12px] border-amber-500 rounded-lg p-8 flex flex-col justify-between items-center text-center relative select-none font-sans"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(254, 243, 199, 0.2) 0%, transparent 80%)',
            }}
          >
            {/* Elegant Corner Borders */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

            {/* Header Badge & Title */}
            <div className="flex flex-col items-center gap-1.5 mt-1">
              <Award className="w-10 h-10 text-amber-500 fill-amber-100 stroke-[2.5]" />
              <h1 className="font-display text-2xl font-black tracking-wide text-amber-500 uppercase">
                Certificate of Achievement
              </h1>
              <p className="text-[10px] font-bold tracking-widest text-[#1E293B]/60 uppercase font-sans">
                Imole Life Skills Journey
              </p>
            </div>

            {/* Awardee details */}
            <div className="flex flex-col gap-2 my-2 w-full">
              <p className="text-xs font-semibold text-slate-400 italic">This certifies that</p>
              <h2 className="text-2xl font-black text-slate-800 font-display border-b-2 border-dashed border-amber-200 w-fit mx-auto px-6 pb-1 capitalize">
                {childName}
              </h2>
              <p className="text-xs font-bold text-slate-600 max-w-sm mx-auto leading-relaxed mt-1.5">
                has successfully completed the <span className="text-amber-500 font-extrabold">{skillName}</span> journey, showing outstanding consistency and commitment to self-development.
              </p>
            </div>

            {/* Footer Signatures */}
            <div className="w-full flex justify-between items-end px-8 mt-1">
              {/* Date */}
              <div className="flex flex-col items-start gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date Unlocked</span>
                <span className="text-xs font-bold text-slate-800 font-sans">
                  {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              {/* Glowing Seal in Center */}
              <div className="w-12 h-12 rounded-full bg-amber-500 border-2 border-amber-600 flex items-center justify-center shadow-md -translate-y-1">
                <img src={sunLogo} alt="Imole Seal" className="w-8 h-8 object-contain" />
              </div>

              {/* Signature */}
              <div className="flex flex-col items-end gap-1">
                <span className="font-serif italic text-base font-bold text-amber-600 select-none mr-2">Imole Team</span>
                <div className="h-0.5 w-24 bg-slate-300" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Authorized Sign</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-display text-base font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition duration-150 flex items-center justify-center gap-2 active-tap"
          >
            <Download className="w-4 h-4 fill-white" />
            <span>{downloading ? 'Preparing File...' : t('download_certificate')}</span>
          </button>

          {success && (
            <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-bold text-center animate-pulse">
              <CheckCircle className="w-4 h-4" />
              <span>Certificate saved to your device gallery!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
