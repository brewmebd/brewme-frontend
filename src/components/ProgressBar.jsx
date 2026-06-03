export default function ProgressBar({ value = 0, max = 100, label = '', className = '' }) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-inter text-sm font-medium text-brew-text">{label}</span>
          <span className="font-inter text-sm text-brew-muted">{Math.round(percent)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-brew-yellow-badge rounded-pill overflow-hidden">
        <div
          className="h-full bg-brew-yellow rounded-pill transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
