export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  avatar?: string
  lastActive?: string
}

export interface Site {
  id: string
  name: string
  domain: string
  defaultLocale: string
  settings: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Page {
  id: string
  siteId: string
  parentId?: string
  slug: string
  template: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt?: string
  createdAt: string
  updatedAt: string
  versions: PageVersion[]
}

export interface PageVersion {
  id: string
  pageId: string
  version: number
  title: string
  content: BlockContent[]
  meta: PageMeta
  locale: string
  createdBy: string
  createdAt: string
}

export interface BlockContent {
  id: string
  type: 'text' | 'heading' | 'image' | 'video' | 'code' | 'quote' | 'list' | 'fragment'
  content: any
  settings?: Record<string, any>
}

export interface PageMeta {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
}

export interface ContentFragment {
  id: string
  siteId: string
  name: string
  modelId: string
  data: Record<string, any>
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface ContentModel {
  id: string
  name: string
  schema: ContentModelField[]
  description?: string
  createdAt: string
}

export interface ContentModelField {
  name: string
  type: 'text' | 'richtext' | 'number' | 'boolean' | 'date' | 'media' | 'reference'
  required: boolean
  defaultValue?: any
  validation?: Record<string, any>
}

export interface Taxonomy {
  id: string
  siteId: string
  name: string
  slug: string
  type: 'category' | 'tag' | 'custom'
  terms: TaxonomyTerm[]
}

export interface TaxonomyTerm {
  id: string
  taxonomyId: string
  parentId?: string
  name: string
  slug: string
  description?: string
  metadata?: Record<string, any>
}

export interface ContentItem {
  id: string
  title: string
  type: 'article' | 'page' | 'blog'
  status: 'draft' | 'published' | 'archived'
  author: string
  createdAt: string
  updatedAt: string
  content?: string
  excerpt?: string
  tags?: string[]
  views?: number
  locale?: string
  scheduledPublishAt?: string
  siteId?: string
  taxonomyTerms?: string[]
}

export interface Product {
  id: string
  name: string
  sku: string
  price: number
  inventory: number
  status: 'active' | 'inactive' | 'out_of_stock'
  category: string
  image?: string
  description?: string
  createdAt: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: number
  date: string
}

export interface MediaAsset {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  url: string
  size: number
  uploadedAt: string
  tags?: string[]
}

export interface AnalyticsMetric {
  label: string
  value: number
  change: number
  trend: 'up' | 'down' | 'neutral'
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}
