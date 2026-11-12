import { useState, useRef, useEffect, ReactNode } from 'react'
import { ChevronsUpDown } from 'lucide-react'

export interface DropdownOption<T extends string = string> {
  value: T
  label: string
  icon?: ReactNode
}

interface CustomDropdownProps<T extends string = string> {
  value: T
  onChange: (value: T) => void
  options: DropdownOption<T>[]
  className?: string
  buttonClassName?: string
  menuClassName?: string
  placeholder?: string
}

export function CustomDropdown<T extends string = string>({
  value,
  onChange,
  options,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  placeholder = 'Select option',
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button with tighter radius matching Screenshot 2 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-8.5 pl-3 pr-2.5 rounded-[8px] bg-[#141416] hover:bg-[#1a1a1d] border border-white/10 flex items-center justify-between gap-2.5 text-xs font-semibold text-white cursor-pointer select-none transition-colors ${buttonClassName}`}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronsUpDown className="size-3 text-white/50 shrink-0" />
      </button>

      {/* Dropdown Menu Popup with crisp corners and no checkmarks matching Screenshot 2 */}
      {isOpen && (
        <div
          className={`absolute left-0 top-full mt-1.5 z-50 min-w-full w-max max-w-xs rounded-[8px] bg-[#141416] border border-white/10 p-1 shadow-2xl flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95 duration-100 ${menuClassName}`}
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-2.5 py-1.5 rounded-[6px] flex items-center gap-2 text-xs font-semibold transition-colors cursor-pointer border-none text-left ${
                  isSelected
                    ? 'bg-white/[0.08] text-white font-bold'
                    : 'bg-transparent text-white/70 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {option.icon && (
                  <div className="size-3.5 flex items-center justify-center shrink-0">
                    {option.icon}
                  </div>
                )}
                <span className="truncate">{option.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
