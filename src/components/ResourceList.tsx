import type { Resource } from '../data/resources'
import { ArrowUpRightIcon } from './icons'
import { Tag } from './Tag'

export function ResourceList({ items }: { items: Resource[] }) {
  if (items.length === 0) {
    return (
      <p className="border-t border-line px-4 py-10 text-base text-muted sm:px-6">
        No resources match your filters.
      </p>
    )
  }

  return (
    <ul className="border-t border-line">
      {items.map((item) => (
        <li key={item.id} className="border-b border-line last:border-b-0">
          <a href={item.href} className="group flex min-h-16 transition-colors hover:bg-tag">
            <span className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 md:py-3">
              <span className="text-xl text-text md:text-2xl">{item.title}</span>
              <Tag>{item.type}</Tag>
            </span>
            <span className="flex w-16 shrink-0 items-center justify-center border-l border-line-subtle text-text">
              <ArrowUpRightIcon width={20} height={20} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
