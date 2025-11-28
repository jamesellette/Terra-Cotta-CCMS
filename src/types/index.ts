export * from './auth'
export * from './commerce'
export * from './content'
export * from './analytics'
export * from './ai'

export interface SparkUser {
  id: string
  login: string
  email: string
  avatarUrl: string
  isOwner: boolean
}

export interface KVStore<T = unknown> {
  keys: () => Promise<string[]>
  get: <R = T>(key: string) => Promise<R | undefined>
  set: <R = T>(key: string, value: R) => Promise<void>
  delete: (key: string) => Promise<void>
}

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface LoadingState {
  status: Status
  error?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

export interface SortParams {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterParams {
  field: string
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'in'
  value: unknown
}

export interface SearchParams {
  query?: string
  filters?: FilterParams[]
  sort?: SortParams
  pagination?: PaginationParams
}

export interface ApiResponse<T> {
  data: T
  meta?: {
    pagination?: PaginationParams
    timestamp?: string
  }
  error?: string
}

export interface DashboardMetric {
  label: string
  value: number | string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: string
  format?: 'number' | 'currency' | 'percentage' | 'duration'
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  fill?: boolean
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  duration?: number
  timestamp: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface MenuAction {
  label: string
  icon?: string
  onClick: () => void
  disabled?: boolean
  destructive?: boolean
}

export interface TableColumn<T = unknown> {
  id: string
  label: string
  accessor: keyof T | ((row: T) => unknown)
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: { label: string; value: string | number }[]
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    message?: string
  }
}

export interface Tab {
  id: string
  label: string
  icon?: string
  content: React.ReactNode
  disabled?: boolean
}
