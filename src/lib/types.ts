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
  slug: string
  description?: string
  type: 'simple' | 'variant' | 'bundle' | 'subscription'
  status: 'draft' | 'active' | 'inactive' | 'archived'
  visibility: 'visible' | 'catalog' | 'search' | 'hidden'
  basePrice: number
  compareAtPrice?: number
  cost?: number
  categoryIds: string[]
  tags: string[]
  attributes: Record<string, any>
  variants?: ProductVariant[]
  images?: string[]
  weight?: number
  dimensions?: { length?: number; width?: number; height?: number }
  inventory: number
  trackInventory: boolean
  allowBackorder: boolean
  taxable: boolean
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  name?: string
  attributes: Record<string, string>
  price?: number
  compareAtPrice?: number
  cost?: number
  weight?: number
  inventory: number
  imageUrl?: string
  createdAt: string
}

export interface Category {
  id: string
  parentId?: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  position: number
  isActive: boolean
  metadata: Record<string, any>
  createdAt: string
}

export interface PriceBook {
  id: string
  name: string
  currency: string
  isDefault: boolean
  customerGroupId?: string
  validFrom?: string
  validTo?: string
  prices: Price[]
  createdAt: string
}

export interface Price {
  id: string
  priceBookId: string
  productId?: string
  variantId?: string
  amount: number
  minQuantity: number
  createdAt: string
}

export interface Cart {
  id: string
  customerId?: string
  sessionId?: string
  status: 'active' | 'abandoned' | 'converted'
  currency: string
  items: CartItem[]
  subtotal: number
  taxTotal: number
  shippingTotal: number
  discountTotal: number
  grandTotal: number
  metadata: Record<string, any>
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  variantId?: string
  sku: string
  name: string
  quantity: number
  unitPrice: number
  total: number
  metadata: Record<string, any>
}

export interface Order {
  id: string
  orderNumber: string
  customerId?: string
  customerName: string
  customerEmail: string
  status: 'pending' | 'payment_pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'unpaid' | 'paid' | 'partially_paid' | 'refunded' | 'failed'
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled'
  items: OrderItem[]
  subtotal: number
  taxTotal: number
  shippingTotal: number
  discountTotal: number
  grandTotal: number
  currency: string
  shippingAddress?: Address
  billingAddress?: Address
  shippingMethod?: string
  paymentMethod?: string
  promotionCodes?: string[]
  notes?: string
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string
  sku: string
  name: string
  quantity: number
  unitPrice: number
  total: number
  taxAmount: number
  discountAmount: number
  metadata: Record<string, any>
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  companyId?: string
  customerGroupIds: string[]
  defaultShippingAddress?: Address
  defaultBillingAddress?: Address
  tags: string[]
  totalSpent: number
  orderCount: number
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface CustomerGroup {
  id: string
  name: string
  description?: string
  priceBookId?: string
  discountPercentage?: number
  metadata: Record<string, any>
  createdAt: string
}

export interface Company {
  id: string
  name: string
  taxId?: string
  buyerHierarchy: CompanyBuyer[]
  paymentTerms?: string
  creditLimit?: number
  addresses: Address[]
  metadata: Record<string, any>
  createdAt: string
}

export interface CompanyBuyer {
  id: string
  userId: string
  role: 'admin' | 'buyer' | 'approver'
  permissions: string[]
  spendingLimit?: number
}

export interface Promotion {
  id: string
  name: string
  code?: string
  type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y'
  value: number
  conditions: PromotionConditions
  usageLimit?: number
  usageCount: number
  startsAt?: string
  endsAt?: string
  isActive: boolean
  createdAt: string
}

export interface PromotionConditions {
  minPurchaseAmount?: number
  maxPurchaseAmount?: number
  productIds?: string[]
  categoryIds?: string[]
  customerGroupIds?: string[]
  firstOrderOnly?: boolean
}

export interface Warehouse {
  id: string
  name: string
  code: string
  address: Address
  isActive: boolean
  metadata: Record<string, any>
  createdAt: string
}

export interface InventoryItem {
  id: string
  productId?: string
  variantId?: string
  sku: string
  warehouseId: string
  quantity: number
  reserved: number
  available: number
  reorderPoint?: number
  reorderQuantity?: number
  lastRestocked?: string
  updatedAt: string
}

export interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  companyId?: string
  items: QuoteItem[]
  subtotal: number
  taxTotal: number
  shippingTotal: number
  grandTotal: number
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired' | 'converted'
  expiresAt: string
  notes?: string
  terms?: string
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface QuoteItem {
  id: string
  quoteId: string
  productId: string
  variantId?: string
  sku: string
  name: string
  quantity: number
  unitPrice: number
  discountPercentage?: number
  total: number
  notes?: string
}

export interface Subscription {
  id: string
  customerId: string
  productId: string
  variantId?: string
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  billingInterval: 'daily' | 'weekly' | 'monthly' | 'yearly'
  billingIntervalCount: number
  currentPeriodStart: string
  currentPeriodEnd: string
  nextBillingDate: string
  amount: number
  currency: string
  trialEndsAt?: string
  cancelledAt?: string
  metadata: Record<string, any>
  createdAt: string
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
