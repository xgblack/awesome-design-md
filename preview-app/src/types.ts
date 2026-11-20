export type VisualFacetKey =
  | 'moods'
  | 'tones'
  | 'temperature'
  | 'chroma'
  | 'accentHues'
  | 'backgrounds'
  | 'layouts'
  | 'density'
  | 'typography'
  | 'headingScale'
  | 'headingWeight'
  | 'geometry'
  | 'layering'
  | 'visualMedia'
  | 'motion'
  | 'scenarios'
export type Features = Partial<Record<VisualFacetKey, string[]>>
export type MultiFacetKey =
  | Exclude<VisualFacetKey, 'density' | 'headingScale' | 'headingWeight'>
  | 'interactions'
  | 'viewports'
  | 'colors'
export type SingleFacetKey = 'density' | 'headingScale' | 'headingWeight' | 'category'
export interface FeatureEvidence {
  source: string
  reason: string
  kind?: 'explicit' | 'interpretation' | 'observation'
  fields?: VisualFacetKey[]
}
export interface ExampleInfo {
  title: string
  description: string
  status: 'draft' | 'ready'
  features: Features
  interactions: string[]
  viewports: string[]
  notes: string[]
  references: FeatureEvidence[]
  assets: { file: string; source: string; license: string }[]
}
export interface StyleEntry {
  id: string
  name: string
  summary: string
  referenceFeatures: Features
  referenceEvidence: FeatureEvidence[]
  example?: ExampleInfo
  exampleError?: string
  // Read-only projections for concise summaries. The maintained source is referenceFeatures.
  moods: string[]
  tone: string
  scenarios: string[]
  density: string
  colors: string[]
  category: string
  palette: string[]
  metadata: 'valid' | 'missing' | 'invalid'
  curated: boolean
  preview: 'pending' | 'ready'
  sourcePath: string
  lineCount: number
}
export type Filters = Record<MultiFacetKey, string[]> &
  Record<SingleFacetKey, string> & {
    q: string
    basis: 'reference' | 'example'
    status: 'all' | 'ready' | 'pending'
    sort: 'featured' | 'az' | 'za'
  }
export interface AtlasRoute {
  page: 'discover' | 'favorites' | 'style' | 'compare' | 'not-found'
  id: string
  tab: 'preview' | 'spec'
  mode: 'read' | 'raw'
  viewport: 'desktop' | 'mobile'
  compareMode: 'pages' | 'notes'
  filters: Filters
  compare: string[]
  notices: string[]
}
