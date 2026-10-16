import { useMemo, useState } from 'react'
import { FeaturedResources } from './components/FeaturedResources'
import { ResourceFilters, type Filters } from './components/ResourceFilters'
import { ResourceList } from './components/ResourceList'
import { SiteHeader } from './components/SiteHeader'
import { contentTypes, featuredResources, resources, useCases, workloads } from './data/resources'

const emptyFilters: Filters = { query: '', type: '', useCase: '', workload: '' }

function App() {
  const [filters, setFilters] = useState<Filters>(emptyFilters)

  const results = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    return resources.filter(
      (r) =>
        (!query || r.title.toLowerCase().includes(query)) &&
        (!filters.type || r.type === filters.type) &&
        (!filters.useCase || r.useCase === filters.useCase) &&
        (!filters.workload || r.workload === filters.workload),
    )
  }, [filters])

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-[1440px] pb-20 sm:px-6">
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
                  className="text-5xl leading-[1.1] font-medium tracking-[-0.01em] text-black md:text-7xl"
                >
                  Find your next insight
                </h2>
                <p className="mt-6 max-w-[60rem] text-lg text-muted md:mt-3 md:text-[21px]">
                  Explore research, expert insights and practical guidance to strengthen cyber
                  resilience.
                </p>
              </div>

              <ResourceFilters
                value={filters}
                onChange={setFilters}
                selects={[
                  { key: 'type', label: 'Content type', options: contentTypes },
                  { key: 'useCase', label: 'Use cases', options: useCases },
                  { key: 'workload', label: 'Workload', options: workloads },
                ]}
              />

              <p role="status" className="px-4 pt-12 pb-4 text-base text-muted sm:px-6">
                Showing {results.length} of {resources.length} resources
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
