export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  avatar?: string
  lastActive?: string
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
