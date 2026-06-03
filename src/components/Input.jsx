export default function Input({ label, id, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-inter font-medium text-sm text-brew-text"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`font-inter text-sm w-full px-4 py-2.5 bg-white border border-brew-input-border rounded-input text-brew-text placeholder:text-brew-muted/50 focus:outline-none focus:border-brew-yellow focus:ring-1 focus:ring-brew-yellow transition-colors min-h-[44px] ${className}`}
        {...props}
      />
    </div>
  )
}
