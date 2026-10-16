import type { Resource } from '../data/resources'
import { ArrowUpRight } from 'lucide-react'
import { Tag } from './Tag'

export function FeaturedResources({ items }: { items: Resource[] }) {
  return (
    <section aria-labelledby="featured-heading">
      <h2
        id="featured-heading"
        className="inline-flex h-6 items-center bg-secondary px-4 text-xs font-medium tracking-[0.12em] text-white uppercase"
      >
        Fresh off the press
      </h2>
      <ul className="border-t border-grey">
        {items.map((item) => (
          <li key={item.id} className="border-b border-grey">
            <a
              href={item.href}
              className="group flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 transition-colors hover:bg-light-grey md:py-3"
            >
              <span className="text-xl text-black md:text-2xl">{item.title}</span>
              <Tag>{item.type}</Tag>
              <span className="inline-flex w-full items-center gap-3 text-base text-secondary group-hover:text-secondary-hover md:ml-auto md:w-auto">
                {item.cta}
                <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
