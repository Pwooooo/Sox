import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-primary/10 animate-pulse rounded-[calc(var(--radius)-4px)]', className)}
      {...props}
    />
  )
}

export { Skeleton }
