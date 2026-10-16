// Placeholder content. Featured titles come from the Figma frame; library
// titles, types and filter options come from rubrik.com screenshots. Links and
// each item's use case and workload are stand-ins until real data is wired up.

export type FeaturedResource = {
  id: string
  title: string
  type: string
  href: string
  cta: string
}

export const featuredResources: FeaturedResource[] = [
  {
    id: 'gartner-leader',
    title: '7 Times a Leader. 1 Clear Vision.',
    type: 'Gartner report',
    href: '#',
    cta: 'Get the report',
  },
  {
    id: 'gigaom-radar',
    title: '2025 GigaOm Radar on Cloud Data Protection Solutions',
    type: 'Report',
    href: '#',
    cta: 'Get the report',
  },
  {
    id: 'unstructured-data',
    title: '5 Ways to Stay Cyber Resilient Amidst the Unstructured Data Explosion',
    type: 'Article',
    href: '#',
    cta: 'Explore insights',
  },
  {
    id: 'rubrik-now',
    title: 'Rubrik Now: Watch. Learn. Stay ahead.',
    type: 'Webinar hub',
    href: '#',
    cta: 'Explore Rubrik Now',
  },
]

export const contentTypes = [
  'Analyst report',
  'Blog-AI',
  'Blog-frontend',
  'CXO',
  'Case study',
  'Data sheet',
  'Infographic',
  'Podcast',
  'Rubrik 101 demos',
  'Solution brief',
  'White paper',
  'Workshop',
  'eBook',
] as const

export const useCases = [
  'AI',
  'Anomaly Detection',
  'Cloud native protection',
  'Data Security Posture Management',
  'Data archival',
  'Database backup',
  'Frontend',
  'Identity',
  'Managed Service Provider (MSP)',
  'Multiple use cases',
  'Orchestrated Application Recovery',
  'Sensitive Data Discovery',
  'Threat Containment',
  'Threat Hunting',
  'VM backup',
] as const

export const workloads = [
  'AWS',
  'Amazon RDS',
  'Azure',
  'Cassandra',
  'Google Cloud',
  'Kubernetes',
  'Microsoft 365',
  'Microsoft Exchange',
  'Microsoft Hyper-V',
  'Microsoft SQL',
  'MongoDB',
  'Multiple workloads',
  'NAS',
  'Nutanix AHV',
  'Oracle',
  'SAP HANA',
  'Salesforce',
  'VMware vSphere',
  'Virtual environment',
] as const

export type LibraryResource = {
  id: string
  title: string
  type: (typeof contentTypes)[number]
  href: string
  useCase: (typeof useCases)[number]
  workload: (typeof workloads)[number]
}

export const libraryResources: LibraryResource[] = [
  {
    id: 'azure-local',
    title: 'Rubrik for Microsoft Azure Local',
    type: 'Data sheet',
    href: '#',
    useCase: 'VM backup',
    workload: 'Azure',
  },
  {
    id: 'olvm',
    title: 'Protecting Oracle Linux Virtualization Manager with Rubrik Security Cloud',
    type: 'White paper',
    href: '#',
    useCase: 'VM backup',
    workload: 'Oracle',
  },
  {
    id: 'proxmox',
    title: 'Protecting Proxmox VE with Rubrik Security Cloud',
    type: 'White paper',
    href: '#',
    useCase: 'VM backup',
    workload: 'Virtual environment',
  },
  {
    id: 'pure-flasharray',
    title: 'Beyond the Array: Cyber-Resilient Data Protection for Pure Storage FlashArray',
    type: 'White paper',
    href: '#',
    useCase: 'Multiple use cases',
    workload: 'Multiple workloads',
  },
  {
    id: 'iam-playbook',
    title: 'The IAM Backup and Recovery Playbook',
    type: 'Analyst report',
    href: '#',
    useCase: 'Identity',
    workload: 'Multiple workloads',
  },
  {
    id: 'm365-accelerator',
    title: 'M365 Enablement Accelerator',
    type: 'Solution brief',
    href: '#',
    useCase: 'Cloud native protection',
    workload: 'Microsoft 365',
  },
  {
    id: 'google-workspace',
    title: 'Google Workspace Backup and Recovery Ebook',
    type: 'eBook',
    href: '#',
    useCase: 'Cloud native protection',
    workload: 'Google Cloud',
  },
  {
    id: 'hypervisor-rules',
    title: '5 Data Protection Rules for the Modern Hypervisor Era',
    type: 'eBook',
    href: '#',
    useCase: 'VM backup',
    workload: 'VMware vSphere',
  },
  {
    id: 'rsc-private',
    title: 'Rubrik Security Cloud–Private',
    type: 'Solution brief',
    href: '#',
    useCase: 'Multiple use cases',
    workload: 'Multiple workloads',
  },
  {
    id: 'data-sovereignty',
    title: 'Data Sovereignty with Rubrik Security Cloud',
    type: 'Solution brief',
    href: '#',
    useCase: 'Data Security Posture Management',
    workload: 'Multiple workloads',
  },
]
