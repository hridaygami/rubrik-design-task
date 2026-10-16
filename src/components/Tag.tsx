import type { ReactNode } from 'react'

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 shrink-0 items-center border border-tag-line bg-tag px-2 text-xs font-medium tracking-[0.1em] text-text uppercase">
      {children}
    </span>
  )
}
