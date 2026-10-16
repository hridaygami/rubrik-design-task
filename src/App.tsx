import { useMemo, useRef, useState } from 'react'
import { Cursor } from './components/Cursor'
import { FeaturedResources } from './components/FeaturedResources'
import { ResourceFilters, type Facet, type Filters } from './components/ResourceFilters'
import { ResourceList } from './components/ResourceList'
import { SiteHeader } from './components/SiteHeader'
import {
  contentTypes,
  featuredResources,
  libraryResources,
  useCases,
  workloads,
} from './data/resources'

const emptyFilters: Filters = { query: '', type: [], useCase: [], workload: [] }

const facets: Facet[] = [
  { key: 'type', label: 'Content type', options: contentTypes },
  { key: 'useCase', label: 'Use cases', options: useCases },
  { key: 'workload', label: 'Workload', options: workloads },
]

// Any match within a facet, every facet must match.
const matches = (selected: string[], value: string) => !selected.length || selected.includes(value)

function App() {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const libraryHeading = useRef<HTMLHeadingElement>(null)
  const searchBar = useRef<HTMLDivElement>(null)

  // Starting a search brings the section to the top, so results update in view.
  // Phones go to the search bar itself, since the keyboard leaves no room for
  // the heading as well.
  const showLibrary = () => {
    const target = matchMedia('(min-width: 40rem)').matches ? libraryHeading : searchBar
    target.current?.scrollIntoView({
      block: 'start',
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  const results = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    return libraryResources.filter(
      (r) =>
        (!query || r.title.toLowerCase().includes(query)) &&
        matches(filters.type, r.type) &&
        matches(filters.useCase, r.useCase) &&
        matches(filters.workload, r.workload),
    )
  }, [filters])

  return (
    <>
      <Cursor />
      <SiteHeader />
      <div className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6">
        <div className="border-x border-grey">
          <main>
            <h1 className="sr-only">Resources</h1>
            <div className="pt-12 lg:pt-20">
              <FeaturedResources items={featuredResources} />
            </div>

            <section aria-labelledby="library-heading">
              <div className="px-4 pt-16 pb-12 sm:px-6 sm:pt-12 sm:pb-8 lg:pt-20 lg:pb-12">
                <h2
                  ref={libraryHeading}
                  id="library-heading"
                  className="rise scroll-mt-8 text-display-sm font-normal tracking-[-0.01em] text-black md:text-display-md lg:text-display"
                >
                  Find your next insight
                </h2>
                <p className="rise mt-6 max-w-[60rem] text-lead-sm text-muted [--rise-delay:80ms] md:mt-3 md:text-lead">
                  Explore research, expert insights and practical guidance to strengthen cyber
                  resilience.
                </p>
              </div>

              {/* Lifted above the list so the filter popover can overlap it. */}
              <div ref={searchBar} className="rise relative z-20 scroll-mt-4 [--rise-delay:460ms]">
                <ResourceFilters
                  value={filters}
                  onChange={setFilters}
                  onSearchFocus={showLibrary}
                  facets={facets}
                  resultCount={results.length}
                />
              </div>

              {/* Keeps the page at least a screen tall below the search bar, so a
                  short result list can't pull the scroll position (and the
                  section) back down. */}
              <div className="min-h-[calc(100lvh-22rem)]">
                <p role="status" className="px-4 pt-12 pb-4 text-body text-muted">
                  Showing {results.length} of {libraryResources.length} resources
                </p>

                <ResourceList items={results} />
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
