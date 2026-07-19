import * as React from 'react'
import { cn } from '@/lib/utils'

function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'border-input bg-input text-foreground flex h-9 w-full min-w-0 rounded-[calc(var(--radius)-2px)] border px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
