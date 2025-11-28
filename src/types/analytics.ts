export interface AnalyticsMetric {
  id: string
  name: string
  value: number
  previousValue?: number
  change?: number
  changePercent?: number
  trend: 'up' | 'down' | 'neutral'
  format: 'number' | 'currency' | 'percentage' | 'duration'
  timestamp: string
}

export interface TrafficSource {
  source: string
  sessions: number
  users: number
  pageviews: number
  bounceRate: number
  avgSessionDuration: number
  conversions: number
  conversionRate: number
}

export interface DeviceBreakdown {
  device: 'desktop' | 'mobile' | 'tablet'
  sessions: number
  users: number
  percentage: number
}

export interface CustomerJourney {
  userId: string
  sessionId: string
  touchpoints: Touchpoint[]
  entryPage: string
  exitPage: string
  converted: boolean
  conversionValue?: number
  duration: number
  timestamp: string
}

export interface Touchpoint {
  id: string
  type: 'page_view' | 'click' | 'form_submit' | 'purchase' | 'custom'
  page: string
  action?: string
  value?: number
  timestamp: string
}

export interface FunnelStage {
  name: string
  users: number
  dropoffRate: number
  conversionRate: number
  avgTimeToNext?: number
}

export interface CohortData {
  cohortDate: string
  size: number
  retention: Record<string, number>
}

export interface AttributionModel {
  name: 'linear' | 'first_touch' | 'last_touch' | 'time_decay' | 'position_based'
  channels: AttributionChannel[]
}

export interface AttributionChannel {
  channel: string
  touchpoints: number
  credit: number
  conversions: number
  revenue: number
  roi: number
  roas: number
}

export interface ABTest {
  id: string
  name: string
  status: 'draft' | 'running' | 'completed' | 'paused'
  variants: ABVariant[]
  trafficAllocation: number
  startDate: string
  endDate?: string
  winner?: string
  confidence?: number
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface ABVariant {
  id: string
  name: string
  traffic: number
  sessions: number
  conversions: number
  conversionRate: number
  avgOrderValue?: number
  revenue?: number
}

export interface Anomaly {
  id: string
  metric: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'spike' | 'drop' | 'trend_change' | 'outlier'
  description: string
  detectedAt: string
  value: number
  expectedValue: number
  deviation: number
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
  suggestedActions: string[]
}

export interface AudienceSegment {
  id: string
  name: string
  description: string
  size: number
  criteria: SegmentCriteria[]
  value: number
  growthRate: number
  aiGenerated: boolean
  createdAt: string
  updatedAt: string
}

export interface SegmentCriteria {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: unknown
}

export interface CustomReport {
  id: string
  name: string
  description?: string
  metrics: string[]
  dimensions: string[]
  filters: ReportFilter[]
  dateRange: DateRange
  schedule?: ReportSchedule
  exports: ReportExport[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ReportFilter {
  field: string
  operator: string
  value: unknown
}

export interface DateRange {
  type: 'custom' | 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'last_month'
  startDate?: string
  endDate?: string
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  timezone: string
  recipients: string[]
}

export interface ReportExport {
  id: string
  format: 's3' | 'bigquery' | 'snowflake' | 'csv' | 'excel' | 'pdf'
  destination: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  exportedAt?: string
}

export interface PropensityScore {
  userId: string
  purchaseProbability: number
  churnRisk: number
  lifetimeValue: number
  segment: string
  confidence: number
  factors: string[]
  recommendedActions: string[]
  calculatedAt: string
}
