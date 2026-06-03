export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white border border-brew-border rounded-card p-6 shadow-card
        ${hover ? 'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
