export function NoveloCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer text-left group select-none"
    >
      <svg
        viewBox="0 0 14 14"
        className="size-3.5 shrink-0 block transition-transform duration-150 group-active:scale-90"
      >
        <rect
          x="0.75"
          y="0.75"
          width="12.5"
          height="12.5"
          rx="3.2"
          fill={checked ? 'transparent' : 'rgba(255,255,255,0.03)'}
          stroke={checked ? '#ffffff' : 'rgba(255,255,255,0.28)'}
          strokeWidth="1.5"
          className="transition-all duration-150 group-hover:stroke-white/60"
        />
        <rect
          x="3.5"
          y="3.5"
          width="7"
          height="7"
          rx="1.6"
          fill="#ffffff"
          style={{
            transformOrigin: '7px 7px',
            transform: checked ? 'scale(1)' : 'scale(0.35)',
            opacity: checked ? 1 : 0,
            transition: 'transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 140ms ease',
          }}
        />
      </svg>
      {label && (
        <span className="text-[11px] text-white/80 group-hover:text-white transition-colors duration-150">
          {label}
        </span>
      )}
    </button>
  )
}
