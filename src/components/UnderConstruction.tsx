import { ArrowLeft, Home } from 'lucide-react'

interface UnderConstructionProps {
  title?: string
  description?: string
  onGoBack?: () => void
  onGoHome?: () => void
}

export function UnderConstruction({
  title = 'This page is under construction',
  description = 'This page is under construction, come back later.',
  onGoBack,
  onGoHome,
}: UnderConstructionProps) {
  return (
    <div className="w-full flex-1 min-h-[440px] flex flex-col items-center justify-center text-center px-4 py-12 select-none">
      {/* Sticker Illustration matching reference */}
      <img
        src="/under-construction.png"
        alt="Under Construction"
        className="w-60 sm:w-72 md:w-80 h-auto object-contain mb-5 pointer-events-none"
      />

      {/* Heading */}
      <h2 className="text-xl sm:text-2xl md:text-[26px] font-black text-white tracking-tight">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-white/45 font-medium mt-2 max-w-md">
        {description}
      </p>

      {/* Action Buttons matching reference */}
      {(onGoBack || onGoHome) && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="h-9 px-4 rounded-[10px] bg-[#161618] hover:bg-[#222226] border border-white/[0.06] text-white/90 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="size-3.5" />
              <span>Go back</span>
            </button>
          )}

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="h-9 px-4 rounded-[10px] bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-none shadow-md active:scale-95"
            >
              <Home className="size-3.5" />
              <span>Go home</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
