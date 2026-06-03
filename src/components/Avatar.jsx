export default function Avatar({ name = '', src = '', size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border-2 border-brew-yellow-light ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-brew-yellow-light text-brew-text font-inter font-bold flex items-center justify-center border-2 border-brew-yellow/30 ${className}`}
    >
      {initials || '?'}
    </div>
  )
}
