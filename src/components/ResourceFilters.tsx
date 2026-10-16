import { Check, ChevronDown, Search, X } from 'lucide-react'
import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

export type FacetKey = 'type' | 'useCase' | 'workload'

export type Filters = { query: string } & Record<FacetKey, string[]>

export type Facet = {
  key: FacetKey
  label: string
  options: readonly string[]
}

type Props = {
  value: Filters
  onChange: (next: Filters) => void
  facets: Facet[]
  resultCount: number
}

// Dropdowns open as a popover from 1024px up and as a bottom sheet below.
const DESKTOP_QUERY = '(min-width: 64rem)'

export function ResourceFilters({ value, onChange, facets, resultCount }: Props) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  // Remember which layout a facet was opened in, so crossing the breakpoint
  // closes it instead of swapping a popover for a modal sheet mid-use.
  const [opened, setOpened] = useState<{ key: FacetKey; desktop: boolean } | null>(null)
  const openKey = opened && opened.desktop === isDesktop ? opened.key : null
  const popoverKey = isDesktop ? openKey : null
  const sheetKey = isDesktop ? null : openKey

  const bar = useRef<HTMLDivElement>(null)
  const triggers = useRef(new Map<FacetKey, HTMLButtonElement>())
  const baseId = useId()
  const sheetId = `${baseId}-sheet`

  const close = () => setOpened(null)
  const toggle = (key: FacetKey) =>
    setOpened((prev) => (prev?.key === key ? null : { key, desktop: isDesktop }))
  const setFacet = (key: FacetKey, selected: string[]) => onChange({ ...value, [key]: selected })

  useEffect(() => {
    if (!popoverKey) return
    const onPointerDown = (e: PointerEvent) => {
      if (!bar.current?.contains(e.target as Node)) setOpened(null)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpened(null)
      triggers.current.get(popoverKey)?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [popoverKey])

  const sheetFacet = facets.find((f) => f.key === sheetKey) ?? null

  return (
    <>
      <div
        ref={bar}
        role="search"
        onBlur={(e) => {
          // Tabbing out of the bar closes the popover.
          const next = e.relatedTarget as Node | null
          if (popoverKey && next && !e.currentTarget.contains(next)) close()
        }}
        className="relative -mx-px grid grid-cols-1 border border-black sm:grid-cols-3 lg:grid-cols-[1fr_repeat(3,11.25rem)]"
      >
        <label className="relative flex h-12 items-center border-b border-black sm:col-span-3 lg:col-span-1 lg:border-b-0">
          <span className="sr-only">Search resources</span>
          <Search
            size={20}
            strokeWidth={2}
            aria-hidden
            className="pointer-events-none absolute left-4 text-black sm:left-6"
          />
          <input
            type="search"
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            placeholder="Search resources"
            className="h-full w-full bg-transparent pr-4 pl-12 text-body text-black placeholder:text-black focus-visible:outline-offset-[-2px] sm:pl-14 [&::-webkit-search-cancel-button]:hidden"
          />
        </label>

        {facets.map((facet, i) => {
          const selected = value[facet.key]
          const expanded = openKey === facet.key
          const panelId = `${baseId}-${facet.key}`
          return (
            <Fragment key={facet.key}>
              <button
                ref={(el) => {
                  if (el) triggers.current.set(facet.key, el)
                  else triggers.current.delete(facet.key)
                }}
                type="button"
                aria-expanded={expanded}
                aria-controls={isDesktop ? panelId : sheetId}
                onClick={() => toggle(facet.key)}
                className={`flex h-12 cursor-pointer items-center gap-2 border-black px-4 text-left text-body text-black transition-colors hover:bg-light-grey focus-visible:outline-offset-[-2px] aria-expanded:bg-light-grey sm:border-l ${
                  i < facets.length - 1 ? 'border-b sm:border-b-0' : ''
                } ${i === 0 ? 'sm:border-l-0 lg:border-l' : ''}`}
              >
                <span className="flex-1 truncate">{facet.label}</span>
                {selected.length > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center bg-brand px-1 text-label font-medium text-white">
                    <span className="sr-only">, </span>
                    {selected.length}
                    <span className="sr-only"> selected</span>
                  </span>
                )}
                <ChevronDown
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden
                  className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                    expanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {popoverKey === facet.key && (
                <div
                  id={panelId}
                  className="absolute -inset-x-px top-full z-20 border border-t-grey border-black bg-white transition-[opacity,translate] duration-150 ease-out starting:-translate-y-1 starting:opacity-0 motion-reduce:transition-none"
                >
                  <FacetOptions
                    facet={facet}
                    selected={selected}
                    onChange={(next) => setFacet(facet.key, next)}
                    className="grid-cols-3 gap-x-6 gap-y-3 p-6"
                  />
                  {selected.length > 0 && (
                    <div className="flex justify-end border-t border-grey px-6 py-3">
                      <button
                        type="button"
                        onClick={() => setFacet(facet.key, [])}
                        className="cursor-pointer text-body font-medium text-secondary underline-offset-4 hover:text-secondary-hover hover:underline"
                      >
                        Clear {facet.label.toLowerCase()}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Fragment>
          )
        })}
      </div>

      <FilterSheet
        id={sheetId}
        facet={sheetFacet}
        selected={sheetFacet ? value[sheetFacet.key] : []}
        onChange={(next) => sheetFacet && setFacet(sheetFacet.key, next)}
        onClose={() => {
          close()
          // Not every browser restores focus to the trigger (e.g. after a tap).
          if (sheetKey) triggers.current.get(sheetKey)?.focus()
        }}
        resultCount={resultCount}
      />
    </>
  )
}

type FacetOptionsProps = {
  facet: Facet
  selected: string[]
  onChange: (next: string[]) => void
  className: string
}

function FacetOptions({ facet, selected, onChange, className }: FacetOptionsProps) {
  return (
    <fieldset>
      <legend className="sr-only">{facet.label}</legend>
      <div className={`grid ${className}`}>
        {facet.options.map((option) => {
          const checked = selected.includes(option)
          return (
            <label
              key={option}
              className="flex cursor-pointer items-start gap-3 py-1 text-body text-black"
            >
              <span className="relative mt-0.5 flex size-5 shrink-0">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange(checked ? selected.filter((s) => s !== option) : [...selected, option])
                  }
                  className="peer size-5 cursor-pointer appearance-none border border-black bg-white transition-colors checked:border-brand checked:bg-brand"
                />
                <Check
                  size={14}
                  strokeWidth={2.5}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100"
                />
              </span>
              {option}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

type FilterSheetProps = {
  id: string
  facet: Facet | null
  selected: string[]
  onChange: (next: string[]) => void
  onClose: () => void
  resultCount: number
}

// A modal bottom sheet built on <dialog>, which supplies the focus trap,
// Escape to close, inert page behind and focus return to the trigger.
function FilterSheet({ id, facet, selected, onChange, onClose, resultCount }: FilterSheetProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  // Keep the last facet rendered while the sheet slides away.
  const [shown, setShown] = useState(facet)
  if (facet && facet !== shown) setShown(facet)
  const titleId = `${id}-title`

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (facet && !el.open) el.showModal()
    if (!facet && el.open) el.close()
  }, [facet])

  return (
    <dialog
      ref={dialog}
      id={id}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-0 mt-auto w-full max-w-none translate-y-full border-0 border-t border-black bg-white p-0 text-black transition-[translate,overlay,display] transition-discrete duration-250 ease-[cubic-bezier(0.32,0.72,0,1)] backdrop:bg-black/0 backdrop:transition-[background-color,overlay,display] backdrop:transition-discrete backdrop:duration-250 open:translate-y-0 open:backdrop:bg-black/50 starting:open:translate-y-full starting:open:backdrop:bg-black/0 motion-reduce:transition-none motion-reduce:backdrop:transition-none"
    >
      {shown && (
        <div className="flex max-h-[85dvh] flex-col">
          <div className="flex items-center justify-between border-b border-grey py-2 pr-2 pl-4 sm:pl-6">
            <h2 id={titleId} className="text-title-sm">
              {shown.label}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-11 cursor-pointer items-center justify-center"
            >
              <span className="sr-only">Close</span>
              <X size={24} strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          <div className="overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
            <FacetOptions
              facet={shown}
              selected={selected}
              onChange={onChange}
              className="grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6"
            />
          </div>

          <div className="flex gap-3 border-t border-grey p-4 sm:px-6">
            <button
              type="button"
              onClick={() => onChange([])}
              disabled={selected.length === 0}
              className="h-12 cursor-pointer border border-black px-5 text-body font-medium text-black transition-colors hover:bg-light-grey disabled:cursor-default disabled:border-grey disabled:text-muted disabled:hover:bg-transparent"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 cursor-pointer bg-brand px-5 text-body font-medium text-white transition-colors hover:bg-brand-hover"
            >
              Show {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
