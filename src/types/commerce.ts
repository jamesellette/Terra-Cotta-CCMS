export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  status: 'draft' | 'active' | 'inactive' | 'archived'
  type: 'simple' | 'variable' | 'subscription'
  price: number
  compareAtPrice?: number
  cost?: number
  taxable: boolean
  categoryIds: string[]
  tags: string[]
  images: ProductImage[]
  variants?: ProductVariant[]
  inventory: ProductInventory[]
  metadata: Record<string, unknown>
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  position: number
}

export interface ProductVariant {
  id: string
  sku: string
  name: string
  price: number
  compareAtPrice?: number
  options: Record<string, string>
  inventory: ProductInventory[]
}

export interface ProductInventory {
  warehouseId: string
  quantity: number
  reserved: number
  available: number
  reorderPoint: number
  reorderQuantity: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  position: number
  status: 'active' | 'inactive'
  image?: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerEmail: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded'
  fulfillmentStatus: 'unfulfilled' | 'partial' | 'fulfilled'
  trackingNumber?: string
  notes?: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  sku: string
  name: string
  quantity: number
  price: number
  total: number
  metadata: Record<string, unknown>
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
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
  status: 'active' | 'inactive'
  groups: string[]
  companyId?: string
  defaultShippingAddress?: Address
  defaultBillingAddress?: Address
  totalOrders: number
  totalSpent: number
  lifetimeValue: number
  tags: string[]
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface Promotion {
  id: string
  name: string
  description?: string
  type: 'percentage' | 'fixed' | 'free_shipping' | 'bogo'
  value: number
  code?: string
  status: 'active' | 'inactive' | 'scheduled'
  conditions: PromotionCondition[]
  startDate: string
  endDate?: string
  usageLimit?: number
  usageCount: number
  customerLimit?: number
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface PromotionCondition {
  type: 'min_purchase' | 'product' | 'category' | 'customer_group'
  value: string | number
}

export interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired'
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  expiresAt: string
  notes?: string
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface PriceBook {
  id: string
  name: string
  currency: string
  customerGroups: string[]
  prices: PriceBookEntry[]
  validFrom: string
  validTo?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface PriceBookEntry {
  productId: string
  variantId?: string
  price: number
  tiers?: PriceTier[]
}

export interface PriceTier {
  minQuantity: number
  price: number
}
