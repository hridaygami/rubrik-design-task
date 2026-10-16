import { ArrowUpRight } from 'lucide-react'
import type { LibraryResource } from '../data/resources'
import { Tag } from './Tag'

export function ResourceList({ items }: { items: LibraryResource[] }) {
  if (items.length === 0) {
    return (
      <p className="border-y border-grey px-4 py-10 text-body text-muted sm:px-6">
        No resources match your filters.
      </p>
    )
  }

  return (
    <ul className="border-t border-grey">
      {items.map((item) => (
        <li key={item.id} className="border-b border-grey">
          <a href={item.href} className="group flex transition-colors hover:bg-light-grey">
            <span className="flex flex-1 flex-col items-start gap-3 p-4">
              <span className="text-title-sm text-black lg:text-title">{item.title}</span>
              <span className="-order-1 flex">
                <Tag>{item.type}</Tag>
              </span>
            </span>
            <span className="flex w-16 shrink-0 items-center justify-center border-l border-grey text-black">
              <ArrowUpRight
                size={20}
                strokeWidth={1.5}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
