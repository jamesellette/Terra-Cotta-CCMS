export interface AIContentRequest {
  content: string
  tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive'
  length?: 'short' | 'medium' | 'long'
  variations?: number
}

export interface AIContentResponse {
  variations: string[]
  timestamp: string
}

export interface AISummaryRequest {
  content: string
  maxLength?: number
}

export interface AISummaryResponse {
  summary: string
  originalLength: number
  summaryLength: number
  timestamp: string
}

export interface AITranslationRequest {
  content: string
  targetLanguage: string
  sourceLanguage?: string
}

export interface AITranslationResponse {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  timestamp: string
}

export interface AIProductDescriptionRequest {
  productName: string
  category: string
  features: string[]
  tone?: string
}

export interface AIProductDescriptionResponse {
  description: string
  highlights: string[]
  timestamp: string
}

export interface AIImageAnalysisRequest {
  imageUrl: string
}

export interface AIImageAnalysisResponse {
  objects: string[]
  colors: string[]
  composition: string
  usageSuggestions: string[]
  dominantTheme: string
  timestamp: string
}

export interface AIAltTextRequest {
  imageUrl: string
}

export interface AIAltTextResponse {
  altText: string
  confidence: number
  timestamp: string
}

export interface AISemanticSearchRequest {
  query: string
  context?: string
  limit?: number
}

export interface AISemanticSearchResult {
  id: string
  title: string
  description: string
  relevanceScore: number
  url?: string
}

export interface AISemanticSearchResponse {
  results: AISemanticSearchResult[]
  timestamp: string
}

export interface AIAnomalyDetectionRequest {
  metrics: MetricDataPoint[]
  sensitivity?: 'low' | 'medium' | 'high'
}

export interface MetricDataPoint {
  timestamp: string
  value: number
  label?: string
}

export interface AIAnomalyDetectionResponse {
  anomalies: {
    timestamp: string
    value: number
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    suggestedActions: string[]
  }[]
  accuracy: number
  timestamp: string
}

export interface AIPropensityRequest {
  userId: string
  userHistory?: unknown[]
}

export interface AIPropensityResponse {
  purchaseProbability: number
  churnRisk: number
  lifetimeValue: number
  segment: string
  confidence: number
  recommendedActions: string[]
  timestamp: string
}

export interface AINaturalLanguageQueryRequest {
  query: string
  context?: 'analytics' | 'commerce' | 'content'
}

export interface AINaturalLanguageQueryResponse {
  answer: string
  metrics?: Record<string, number>
  confidence: number
  timestamp: string
}

export interface AIAccessibilityCheckRequest {
  content: string
  contentType: 'html' | 'text' | 'markdown'
}

export interface AIAccessibilityCheckResponse {
  score: number
  issues: AccessibilityIssue[]
  suggestions: string[]
  readingLevel: string
  inclusiveLanguageScore: number
  timestamp: string
}

export interface AccessibilityIssue {
  severity: 'error' | 'warning' | 'info'
  type: string
  description: string
  wcagCriterion?: string
  suggestion: string
}

export interface ColorPalette {
  id: string
  name: string
  colors: string[]
  harmonyType: HarmonyType
  createdAt: string
}

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'square'
  | 'monochromatic'

export interface ImageColorExtractionRequest {
  imageUrl: string
  maxColors?: number
}

export interface ImageColorExtractionResponse {
  colors: ExtractedColor[]
  dominantColor: string
  timestamp: string
}

export interface ExtractedColor {
  hex: string
  rgb: [number, number, number]
  percentage: number
}

export interface GradientConfig {
  colors: string[]
  steps: number
  type?: 'linear' | 'radial'
}

export interface GradientResponse {
  gradient: string[]
  css: string
}
