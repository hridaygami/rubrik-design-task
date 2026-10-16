import { useMemo, useState } from 'react'
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
      <SiteHeader />
      <div className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-6">
        <div className="border-x border-grey">
          <main>
            <h1 className="sr-only">Resources</h1>
            <div className="pt-12 md:pt-20">
              <FeaturedResources items={featuredResources} />
            </div>

            <section aria-labelledby="library-heading">
              <div className="px-4 pt-16 pb-12 sm:px-6 md:pt-20">
                <h2
                  id="library-heading"
                  className="rise text-display-sm font-normal tracking-[-0.01em] text-black md:text-display"
                >
                  Find your next insight
                </h2>
                <p className="rise mt-6 max-w-[60rem] text-lead-sm text-muted [--rise-delay:80ms] md:mt-3 md:text-lead">
                  Explore research, expert insights and practical guidance to strengthen cyber
                  resilience.
                </p>
              </div>

              {/* Lifted above the list so the filter popover can overlap it. */}
              <div className="rise relative z-20 [--rise-delay:460ms]">
                <ResourceFilters
                  value={filters}
                  onChange={setFilters}
                  facets={facets}
                  resultCount={results.length}
                />
              </div>

              <p role="status" className="px-4 pt-12 pb-4 text-body text-muted sm:px-6">
                Showing {results.length} of {libraryResources.length} resources
              </p>

              <ResourceList items={results} />
            </section>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
