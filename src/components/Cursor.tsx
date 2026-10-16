import { useEffect, useRef } from 'react'

// Mouse and trackpad only; touch screens keep their native behaviour.
const FINE_POINTER = '(hover: hover) and (pointer: fine)'
// Surfaces darker than this relative luminance get the light cursor.
const DARK_LUMINANCE = 0.25

// A small diamond (a square turned 45° with softened corners), echoing the
// basic unit of the Rubrik logo. Tracks the pointer exactly: an easing lag made
// it harder to aim.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = dot.current
    const fine = window.matchMedia(FINE_POINTER)
    if (!el || !fine.matches) return

    const root = document.documentElement
    root.dataset.customCursor = ''
    const pointer = { x: -100, y: -100 }

    const updateSurface = () => {
      const under = document.elementFromPoint(pointer.x, pointer.y)
      el.dataset.surface = under && isDark(under) ? 'dark' : 'light'
    }

    const onMove = (e: MouseEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      el.style.translate = `${pointer.x}px ${pointer.y}px`
      el.dataset.visible = ''
      updateSurface()
    }
    const onLeave = () => delete el.dataset.visible

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', updateSurface, { passive: true })
    root.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', updateSurface)
      root.removeEventListener('mouseleave', onLeave)
      delete root.dataset.customCursor
    }
  }, [])

  return (
    <div
      ref={dot}
      aria-hidden
      data-cursor-dot
      className="pointer-events-none fixed top-0 left-0 z-100 -mt-1.5 -ml-1.5 size-3 rotate-45 rounded-xs bg-brand opacity-0 transition-[background-color,opacity] duration-200 data-visible:opacity-100 data-[surface=dark]:bg-grey"
    />
  )
}

// Walks up from the element to the first painted background, blending any
// translucency over white, and checks how dark it is.
function isDark(start: Element) {
  for (let node: Element | null = start; node; node = node.parentElement) {
    const [r, g, b, a] = toRgba(getComputedStyle(node).backgroundColor)
    if (a === 0) continue
    const [lr, lg, lb] = [r, g, b].map((c) => {
      const s = (c * a + 255 * (1 - a)) / 255
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb < DARK_LUMINANCE
  }
  return false
}

// Any CSS colour (rgb, oklab, color-mix output…) to 0–255 RGB plus 0–1 alpha.
let swatch: CanvasRenderingContext2D | null = null
function toRgba(color: string): [number, number, number, number] {
  swatch ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  if (!swatch) return [255, 255, 255, 0]
  swatch.clearRect(0, 0, 1, 1)
  swatch.fillStyle = color
  swatch.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = swatch.getImageData(0, 0, 1, 1).data
  return [r, g, b, a / 255]
}
