import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { FeaturedResource } from '../data/resources'
import { Tag } from './Tag'

// Entrance stagger (see the rise utility): starts after the hero headline.
const ENTER_START_MS = 160
const ENTER_STEP_MS = 60
const riseDelay = (ms: number) => ({ '--rise-delay': `${ms}ms` }) as CSSProperties

export function FeaturedResources({ items }: { items: FeaturedResource[] }) {
  return (
    <section aria-labelledby="featured-heading">
      <h2
        id="featured-heading"
        style={riseDelay(ENTER_START_MS)}
        className="rise inline-flex h-6 items-center bg-secondary px-4 text-label font-medium tracking-[0.12em] text-white uppercase"
      >
        Fresh off the press
      </h2>

      <ul className="border-t border-grey">
        {items.map((item, i) => (
          <li
            key={item.id}
            style={riseDelay(ENTER_START_MS + i * ENTER_STEP_MS)}
            className="rise border-b border-grey"
          >
            <a
              href={item.href}
              className="group flex flex-col items-start gap-3 p-4 transition-colors duration-800 ease-out hover:bg-light-grey hover:duration-150 focus-visible:outline-offset-[-2px] lg:min-h-16 lg:flex-row lg:items-center lg:gap-4 lg:py-3"
            >
              <span className="text-title-sm text-black lg:text-title">{item.title}</span>
              <span className="-order-1 flex shrink-0 lg:order-none">
                <Tag>{item.type}</Tag>
              </span>
              <span className="inline-flex shrink-0 items-center gap-3 text-body font-medium whitespace-nowrap text-secondary lg:ml-auto">
                <span className="underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-800 ease-out group-hover:decoration-current group-hover:duration-150">
                  {item.cta}
                </span>
                <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
