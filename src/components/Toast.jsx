import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 350)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-card bg-white border border-brew-yellow shadow-card-hover font-inter text-sm
        ${visible ? 'animate-toast' : 'opacity-0 translate-y-4 transition-all duration-300'}`}
    >
      {type === 'success' ? (
        <CheckCircle size={18} className="text-brew-yellow-hover shrink-0" />
      ) : (
        <AlertTriangle size={18} className="text-brew-yellow-hover shrink-0" />
      )}
      <span className="text-brew-text">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 350) }}
        className="ml-2 p-1 rounded-full hover:bg-brew-yellow-light transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} className="text-brew-muted" />
      </button>
    </div>
  )
}
