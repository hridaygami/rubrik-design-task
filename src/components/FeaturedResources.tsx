import { ArrowUpRight } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from 'react'
import type { FeaturedResource } from '../data/resources'
import { Tag } from './Tag'

// Images are hotlinked, never committed. Abstract painting by Kier in Sight
// Archives via Unsplash (unsplash.com/photos/HkLxLxBNWQ0).
const revealImage = 'https://images.unsplash.com/photo-1620873977339-9e0bf1200cc5'
const revealWidths = [640, 1024, 1600, 2400]
const revealSrcSet = revealWidths
  .map((w) => `${revealImage}?auto=format&q=75&w=${w} ${w}w`)
  .join(', ')

// A card stays revealed this long after the pointer leaves it, so a quick
// sweep across the list briefly shows the whole image before it clears.
const REVEAL_HOLD_MS = 250

// On touch screens there's no hover, so scrolling stands in for the cursor:
// cards crossing a band in the middle of the viewport reveal, and everything
// clears shortly after scrolling stops.
const SWEEP_BAND = { top: 0.4, bottom: 0.6 }
const SCROLL_IDLE_MS = 150
const SWEEP_QUERY = '(hover: none) and (prefers-reduced-motion: no-preference)'

// Fast in, slower out: each class swaps duration with the revealed state.
const revealTransition =
  'duration-300 ease-in-out group-data-revealed:duration-100 group-data-revealed:ease-out motion-reduce:transition-none'

// Entrance stagger (see the rise utility). Starts after the hero headline, and
// the image fades in only once every card has landed, so it never shows
// through a half-faded card.
const ENTER_START_MS = 160
const ENTER_STEP_MS = 60
const ENTER_DURATION_MS = 600
const riseDelay = (ms: number) => ({ '--rise-delay': `${ms}ms` }) as CSSProperties

export function FeaturedResources({ items }: { items: FeaturedResource[] }) {
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(new Set())
  const timers = useRef(new Map<string, number>())
  const cards = useRef(new Map<string, HTMLAnchorElement>())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  const reveal = useCallback((id: string) => {
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setRevealed((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }, [])

  // An already-pending conceal keeps its original deadline, so repeated calls
  // (every scroll frame) can't stretch the hold.
  const conceal = useCallback((id: string) => {
    if (timers.current.has(id)) return
    const timer = window.setTimeout(() => {
      timers.current.delete(id)
      setRevealed((prev) => {
        if (!prev.has(id)) return prev
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, REVEAL_HOLD_MS)
    timers.current.set(id, timer)
  }, [])

  useEffect(() => {
    const query = window.matchMedia(SWEEP_QUERY)
    let idle = 0

    const onScroll = () => {
      const top = window.innerHeight * SWEEP_BAND.top
      const bottom = window.innerHeight * SWEEP_BAND.bottom
      cards.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect()
        if (rect.bottom > top && rect.top < bottom) reveal(id)
        else conceal(id)
      })
      window.clearTimeout(idle)
      idle = window.setTimeout(() => cards.current.forEach((_, id) => conceal(id)), SCROLL_IDLE_MS)
    }

    const sync = () => {
      if (query.matches) window.addEventListener('scroll', onScroll, { passive: true })
      else window.removeEventListener('scroll', onScroll)
    }

    sync()
    query.addEventListener('change', sync)
    return () => {
      query.removeEventListener('change', sync)
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(idle)
    }
  }, [reveal, conceal])

  // Touch taps navigate straight away, so only mouse and pen reveal on hover.
  const isHoverPointer = (e: PointerEvent) => e.pointerType !== 'touch'

  return (
    <section aria-labelledby="featured-heading">
      <h2
        id="featured-heading"
        style={riseDelay(ENTER_START_MS)}
        className="rise inline-flex h-6 items-center bg-secondary px-4 text-label font-medium tracking-[0.12em] text-white uppercase"
      >
        Fresh off the press
      </h2>

      <div className="relative isolate border-t border-grey">
        <img
          src={`${revealImage}?auto=format&q=75&w=1600`}
          srcSet={revealSrcSet}
          sizes="(min-width: 1440px) 1392px, 100vw"
          alt=""
          style={riseDelay(ENTER_START_MS + items.length * ENTER_STEP_MS + ENTER_DURATION_MS)}
          className="appear absolute inset-0 -z-10 size-full object-cover"
        />

        <ul>
          {items.map((item, i) => (
            <li
              key={item.id}
              style={riseDelay(ENTER_START_MS + i * ENTER_STEP_MS)}
              className="rise border-b border-grey"
            >
              <a
                href={item.href}
                ref={(el) => {
                  if (el) cards.current.set(item.id, el)
                  else cards.current.delete(item.id)
                }}
                data-revealed={revealed.has(item.id) || undefined}
                onPointerEnter={(e) => isHoverPointer(e) && reveal(item.id)}
                onPointerLeave={(e) => isHoverPointer(e) && conceal(item.id)}
                onFocus={(e: FocusEvent<HTMLAnchorElement>) =>
                  e.currentTarget.matches(':focus-visible') && reveal(item.id)
                }
                onBlur={() => conceal(item.id)}
                className="group relative isolate flex flex-col items-start gap-3 p-4 focus-visible:outline-offset-[-2px] lg:min-h-16 lg:flex-row lg:items-center lg:gap-4 lg:py-3"
              >
                {/* Revealed state: dark scrim and light frame over the image. The
                    frame sits 1px outside the card, on the shared divider and
                    rail lines, so neighbouring revealed cards share one line. */}
                <span
                  aria-hidden
                  className="absolute -inset-px -z-10 bg-black/50 ring-1 ring-white/55 ring-inset"
                />
                {/* Default state: an opaque white card that fades away to reveal. */}
                <span
                  aria-hidden
                  className={`absolute inset-0 -z-10 bg-white transition-opacity group-data-revealed:opacity-0 ${revealTransition}`}
                />

                <span
                  className={`text-title-sm text-black transition-colors group-data-revealed:text-white lg:text-title ${revealTransition}`}
                >
                  {item.title}
                </span>
                <span className="-order-1 flex shrink-0 lg:order-none">
                  <Tag>{item.type}</Tag>
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-3 text-body font-medium whitespace-nowrap text-secondary underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] group-data-revealed:text-white group-data-revealed:decoration-white lg:ml-auto ${revealTransition}`}
                >
                  {item.cta}
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
