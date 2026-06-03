export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center font-inter font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brew-yellow focus-visible:ring-offset-2 text-sm px-6 py-2.5 rounded-pill min-h-[44px] cursor-pointer no-underline'

  const variants = {
    primary:
      'bg-brew-yellow text-brew-text border border-brew-yellow hover:bg-brew-yellow-hover hover:-translate-y-px active:translate-y-0',
    secondary:
      'bg-white text-brew-text border border-brew-yellow hover:bg-brew-yellow-light hover:-translate-y-px active:translate-y-0',
    ghost:
      'bg-transparent text-brew-muted border border-transparent hover:bg-brew-yellow-light hover:text-brew-text hover:-translate-y-px active:translate-y-0',
  }

  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  )
}
