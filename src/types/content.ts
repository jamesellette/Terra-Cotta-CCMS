export interface Page {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  template: string
  blocks: ContentBlock[]
  seoTitle?: string
  seoDescription?: string
  metadata: Record<string, unknown>
  publishedAt?: string
  createdAt: string
  updatedAt: string
  authorId: string
  version: number
}

export interface ContentBlock {
  id: string
  type: BlockType
  position: number
  data: Record<string, unknown>
}

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'video'
  | 'code'
  | 'quote'
  | 'list'
  | 'table'
  | 'embed'
  | 'fragment'
  | 'custom'

export interface ContentFragment {
  id: string
  name: string
  type: string
  fields: Record<string, unknown>
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  authorId: string
}

export interface ContentModel {
  id: string
  name: string
  apiName: string
  description?: string
  fields: ModelField[]
  createdAt: string
  updatedAt: string
}

export interface ModelField {
  id: string
  name: string
  apiName: string
  type: FieldType
  required: boolean
  unique: boolean
  defaultValue?: unknown
  validation?: FieldValidation
  options?: FieldOption[]
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'rich_text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'email'
  | 'url'
  | 'select'
  | 'multiselect'
  | 'reference'
  | 'media'
  | 'json'

export interface FieldValidation {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  message?: string
}

export interface FieldOption {
  label: string
  value: string
}

export interface MediaAsset {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document' | 'other'
  mimeType: string
  url: string
  thumbnailUrl?: string
  size: number
  width?: number
  height?: number
  duration?: number
  alt?: string
  caption?: string
  tags: string[]
  folderId?: string
  metadata: Record<string, unknown>
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export interface Taxonomy {
  id: string
  name: string
  slug: string
  type: 'category' | 'tag' | 'custom'
  terms: TaxonomyTerm[]
  hierarchical: boolean
  createdAt: string
  updatedAt: string
}

export interface TaxonomyTerm {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  count: number
  metadata: Record<string, unknown>
}

export interface Site {
  id: string
  name: string
  domain: string
  locale: string
  timezone: string
  status: 'active' | 'inactive'
  theme: string
  settings: SiteSettings
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  siteTitle: string
  siteDescription: string
  logo?: string
  favicon?: string
  socialMedia: Record<string, string>
  analytics?: {
    googleAnalytics?: string
    facebookPixel?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: string
  }
}
