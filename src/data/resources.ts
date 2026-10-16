// Placeholder content. Titles and types come from the Figma frame; links,
// use cases and workloads are stand-ins until real data is wired up.

export type ContentType = 'Gartner report' | 'Report' | 'Article' | 'Webinar hub'

export type Resource = {
  id: string
  title: string
  type: ContentType
  href: string
  cta: string
  useCase: string
  workload: string
}

export const resources: Resource[] = [
  {
    id: 'gartner-leader',
    title: '7 Times a Leader. 1 Clear Vision.',
    type: 'Gartner report',
    href: '#',
    cta: 'Get the report',
    useCase: 'Cyber recovery',
    workload: 'Enterprise',
  },
  {
    id: 'gigaom-radar',
    title: '2025 GigaOm Radar on Cloud Data Protection Solutions',
    type: 'Report',
    href: '#',
    cta: 'Get the report',
    useCase: 'Data protection',
    workload: 'Cloud',
  },
  {
    id: 'unstructured-data',
    title: '5 Ways to Stay Cyber Resilient Amidst the Unstructured Data Explosion',
    type: 'Article',
    href: '#',
    cta: 'Explore insights',
    useCase: 'Cyber recovery',
    workload: 'Unstructured data',
  },
  {
    id: 'rubrik-now',
    title: 'Rubrik Now: Watch. Learn. Stay ahead.',
    type: 'Webinar hub',
    href: '#',
    cta: 'Explore Rubrik Now',
    useCase: 'Data security posture',
    workload: 'SaaS',
  },
]

export const featuredResources = resources

export const contentTypes: ContentType[] = ['Gartner report', 'Report', 'Article', 'Webinar hub']
export const useCases = [...new Set(resources.map((r) => r.useCase))]
export const workloads = [...new Set(resources.map((r) => r.workload))]
