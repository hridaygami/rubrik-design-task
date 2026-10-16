import type { ReactNode } from 'react'

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 shrink-0 items-center border border-mid-grey bg-faint-grey px-2 text-label font-medium tracking-[0.1em] text-black uppercase">
      {children}
    </span>
  )
}
