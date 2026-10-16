import type { Resource } from '../data/resources'
import { ArrowUpRight } from 'lucide-react'
import { Tag } from './Tag'

export function ResourceList({ items }: { items: Resource[] }) {
  if (items.length === 0) {
    return (
      <p className="border-t border-grey px-4 py-10 text-base text-muted sm:px-6">
        No resources match your filters.
      </p>
    )
  }

  return (
    <ul className="border-t border-grey">
      {items.map((item) => (
        <li key={item.id} className="border-b border-grey last:border-b-0">
          <a href={item.href} className="group flex min-h-16 transition-colors hover:bg-light-grey">
            <span className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:py-3">
              <span className="text-xl text-black md:text-2xl">{item.title}</span>
              <Tag>{item.type}</Tag>
            </span>
            <span className="flex w-16 shrink-0 items-center justify-center border-l border-grey text-black">
              <ArrowUpRight
                size={20}
                strokeWidth={1.5}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
