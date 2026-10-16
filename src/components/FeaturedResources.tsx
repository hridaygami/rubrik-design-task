import type { Resource } from '../data/resources'
import { ArrowUpRightIcon } from './icons'
import { Tag } from './Tag'

export function FeaturedResources({ items }: { items: Resource[] }) {
  return (
    <section aria-labelledby="featured-heading">
      <h2
        id="featured-heading"
        className="inline-flex h-6 items-center bg-accent px-4 text-xs font-medium tracking-[0.12em] text-white uppercase"
      >
        Fresh off the press
      </h2>
      <ul className="border-t border-line">
        {items.map((item) => (
          <li key={item.id} className="border-b border-line">
            <a
              href={item.href}
              className="group flex min-h-16 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 transition-colors hover:bg-tag md:py-3"
            >
              <span className="text-xl text-text md:text-2xl">{item.title}</span>
              <Tag>{item.type}</Tag>
              <span className="inline-flex w-full items-center gap-3 text-base text-accent group-hover:text-accent-strong md:ml-auto md:w-auto">
                {item.cta}
                <ArrowUpRightIcon width={12} height={12} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
