export default function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-pill bg-brew-yellow-badge text-brew-yellow-badge-text font-inter font-medium text-xs ${className}`}>
      {children}
    </span>
  )
}
