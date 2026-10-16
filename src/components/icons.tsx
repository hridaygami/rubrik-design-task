import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

export function SearchIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" strokeWidth="2" {...base} {...props}>
      <circle cx="8.5" cy="8.5" r="5.75" />
      <path d="m13 13 4.5 4.5" />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth="1.75" {...base} {...props}>
      <path d="m3.5 6 4.5 4.5L12.5 6" />
    </svg>
  )
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" strokeWidth="1.5" {...base} {...props}>
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.75" {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.75" {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}
