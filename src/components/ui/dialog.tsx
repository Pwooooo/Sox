import * as React from 'react'
import { cn } from '@/lib/utils'

function Dialog({ open, onOpenChange, children }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'bg-popover text-popover-foreground relative z-50 w-full max-w-lg rounded-[calc(var(--radius)+4px)] border border-border p-6 shadow-lg',
          'animate-[fadeIn_0.15s_ease]'
        )}
      >
        {children}
      </div>
    </div>
  )
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)} {...props} />
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-muted-foreground text-sm', className)} {...props} />
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-2', className)} {...props} />
}

export { Dialog, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
