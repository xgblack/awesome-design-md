export interface StyleEntry {
  id: string
  name: string
  summary: string
  moods: string[]
  tone: string
  scenarios: string[]
  density: string
  colors: string[]
  category: string
  palette: string[]
  metadata: 'valid' | 'missing' | 'invalid'
  curated: boolean
  preview: 'pending'
  sourcePath: string
  lineCount: number
}

export interface Filters {
  q: string
  moods: string[]
  tones: string[]
  scenarios: string[]
  colors: string[]
  density: string
  category: string
  status: 'all' | 'ready' | 'pending'
  sort: 'featured' | 'az' | 'za'
}

export interface AtlasRoute {
  page: 'discover' | 'favorites' | 'style' | 'compare' | 'not-found'
  id: string
  tab: 'preview' | 'spec'
  mode: 'read' | 'raw'
  filters: Filters
  compare: string[]
  notices: string[]
}
