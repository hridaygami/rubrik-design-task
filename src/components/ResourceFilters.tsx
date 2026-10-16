import { ChevronDownIcon, SearchIcon } from './icons'

export type Filters = {
  query: string
  type: string
  useCase: string
  workload: string
}

type SelectFilter = {
  key: 'type' | 'useCase' | 'workload'
  label: string
  options: string[]
}

type Props = {
  value: Filters
  onChange: (next: Filters) => void
  selects: SelectFilter[]
}

export function ResourceFilters({ value, onChange, selects }: Props) {
  return (
    <div
      role="search"
      className="grid grid-cols-1 border-y border-grey sm:grid-cols-3 md:grid-cols-[1fr_repeat(3,11.25rem)]"
    >
      <label className="relative flex h-12 items-center border-b border-grey sm:col-span-3 md:col-span-1 md:border-b-0">
        <span className="sr-only">Search resources</span>
        <SearchIcon className="pointer-events-none absolute left-4 text-black sm:left-6" />
        <input
          type="search"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Search resources"
          className="h-full w-full bg-transparent pr-4 pl-12 text-base sm:pl-14 text-black placeholder:text-black focus-visible:outline-offset-[-2px] [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      {selects.map((select, i) => (
        <div
          key={select.key}
          className={`relative flex h-12 items-center border-grey sm:border-l ${
            i < selects.length - 1 ? 'border-b sm:border-b-0' : ''
          } ${i === 0 ? 'sm:border-l-0 md:border-l' : ''}`}
        >
          <select
            aria-label={select.label}
            value={value[select.key]}
            onChange={(e) => onChange({ ...value, [select.key]: e.target.value })}
            className="h-full w-full cursor-pointer appearance-none bg-transparent pr-12 pl-4 text-base text-black focus-visible:outline-offset-[-2px]"
          >
            <option value="">{select.label}</option>
            {select.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-5 text-muted" />
        </div>
      ))}
    </div>
  )
}
