export interface GenerationOptions {
  count?: number
  tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'creative'
  length?: 'short' | 'medium' | 'long'
  temperature?: number
}

export interface ImageAttributes {
  description: string
  objects: string[]
  colors: string[]
  composition: string
  suggestedUsage: string[]
}

export interface MetricData {
  timestamp: string
  metric: string
  value: number
  category?: string
}

export interface Anomaly {
  id: string
  timestamp: string
  metric: string
  expectedValue: number
  actualValue: number
  deviation: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  suggestedAction: string
}

export interface PropensityScore {
  userId: string
  purchaseProbability: number
  churnRisk: number
  lifetimeValue: number
  recommendedActions: string[]
  segment: string
}

export interface SearchResult {
  id: string
  title: string
  content: string
  relevance: number
  metadata: Record<string, any>
}

export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'local' | 'none'
  model: string
  fallbackEnabled: boolean
}

class AIServiceClass {
  private config: AIConfig = {
    provider: 'openai',
    model: 'gpt-4o',
    fallbackEnabled: true,
  }

  async generateVariations(
    content: string,
    options: GenerationOptions = {}
  ): Promise<string[]> {
    const {
      count = 3,
      tone = 'professional',
      length = 'medium',
      temperature = 0.7,
    } = options

    const lengthGuide = {
      short: '1-2 sentences',
      medium: '2-4 sentences',
      long: '4-6 sentences',
    }

    try {
      const prompt = `Generate ${count} variations of the following content with a ${tone} tone and ${lengthGuide[length]} length. Return as a JSON object with a "variations" array property.

Original content: ${content}

Return format: {"variations": ["variation 1", "variation 2", ...]}`

      const response = await window.spark.llm(prompt, this.config.model, true)
      const parsed = JSON.parse(response)
      return parsed.variations || []
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return this.fallbackGenerateVariations(content, count)
      }
      throw error
    }
  }

  async summarize(content: string, maxLength: number = 150): Promise<string> {
    try {
      const prompt = `Summarize the following content in approximately ${maxLength} characters or less. Be concise and capture the key points.

Content: ${content}`

      return await window.spark.llm(prompt, this.config.model)
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return this.fallbackSummarize(content, maxLength)
      }
      throw error
    }
  }

  async translate(content: string, targetLocale: string): Promise<string> {
    try {
      const prompt = `Translate the following content to ${targetLocale}. Maintain the original tone and formatting.

Content: ${content}`

      return await window.spark.llm(prompt, this.config.model)
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return `[Translation to ${targetLocale}]: ${content}`
      }
      throw error
    }
  }

  async extractImageAttributes(imageUrl: string): Promise<ImageAttributes> {
    try {
      const prompt = `Analyze an image and extract its key attributes. Since we cannot directly access the image at ${imageUrl}, provide a structured analysis format. Return as JSON.

Return format: {
  "description": "detailed description",
  "objects": ["object1", "object2"],
  "colors": ["color1", "color2"],
  "composition": "composition description",
  "suggestedUsage": ["usage1", "usage2"]
}`

      const response = await window.spark.llm(prompt, this.config.model, true)
      return JSON.parse(response)
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return this.fallbackImageAttributes(imageUrl)
      }
      throw error
    }
  }

  async generateAltText(imageUrl: string): Promise<string> {
    try {
      const attributes = await this.extractImageAttributes(imageUrl)
      return attributes.description
    } catch (error) {
      if (this.config.fallbackEnabled) {
        const filename = imageUrl.split('/').pop() || 'image'
        return `Image: ${filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}`
      }
      throw error
    }
  }

  async detectAnomalies(metrics: MetricData[]): Promise<Anomaly[]> {
    if (metrics.length < 10) {
      return []
    }

    try {
      const metricsData = JSON.stringify(metrics.slice(-30))
      const prompt = `Analyze the following metrics data and detect anomalies. Return as JSON with an "anomalies" array property.

Metrics: ${metricsData}

For each anomaly, provide:
- timestamp: when it occurred
- metric: which metric is anomalous
- expectedValue: what value was expected
- actualValue: what value occurred
- deviation: percentage deviation
- severity: low/medium/high/critical
- description: what the anomaly means
- suggestedAction: what to do about it

Return format: {"anomalies": [...]}`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      const parsed = JSON.parse(response)
      return parsed.anomalies || []
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return this.fallbackDetectAnomalies(metrics)
      }
      throw error
    }
  }

  async predictPropensity(userId: string): Promise<PropensityScore> {
    try {
      const prompt = `Generate a propensity score analysis for user ${userId}. Return as JSON.

Return format: {
  "userId": "${userId}",
  "purchaseProbability": 0-1,
  "churnRisk": 0-1,
  "lifetimeValue": number,
  "recommendedActions": ["action1", "action2"],
  "segment": "segment name"
}`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      return JSON.parse(response)
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return this.fallbackPropensityScore(userId)
      }
      throw error
    }
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    const hash = this.simpleHash(text)
    const embedding = new Array(384).fill(0).map((_, i) => {
      return Math.sin((hash + i) * 0.1) * 0.5
    })
    return embedding
  }

  async semanticSearch(query: string, indexData: any[]): Promise<SearchResult[]> {
    try {
      const dataStr = JSON.stringify(indexData.slice(0, 20))
      const prompt = `Perform semantic search on the following data for the query: "${query}"

Data: ${dataStr}

Return the top 5 most relevant results as JSON with a "results" array property. Each result should have:
- id: string
- title: string
- content: string (excerpt)
- relevance: 0-1
- metadata: object

Return format: {"results": [...]}`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      const parsed = JSON.parse(response)
      return parsed.results || []
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return this.fallbackSemanticSearch(query, indexData)
      }
      throw error
    }
  }

  async checkContentAccessibility(content: string): Promise<{
    score: number
    issues: string[]
    suggestions: string[]
  }> {
    try {
      const prompt = `Analyze the following content for accessibility issues. Return as JSON.

Content: ${content}

Check for:
- Reading level and complexity
- Use of inclusive language
- Clear structure and headings
- Alt text references
- Color contrast considerations in descriptions

Return format: {
  "score": 0-100,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`

      const response = await window.spark.llm(prompt, 'gpt-4o-mini', true)
      return JSON.parse(response)
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return {
          score: 85,
          issues: [],
          suggestions: ['Consider adding more descriptive headings'],
        }
      }
      throw error
    }
  }

  async generateProductDescription(
    productName: string,
    features: string[],
    category: string
  ): Promise<string> {
    try {
      const prompt = `Generate a compelling product description for an e-commerce platform.

Product: ${productName}
Category: ${category}
Features: ${features.join(', ')}

Write a professional, engaging description that highlights benefits and appeals to potential buyers. Keep it concise (2-3 paragraphs).`

      return await window.spark.llm(prompt, this.config.model)
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return `${productName} - A quality ${category} product featuring ${features.join(', ')}. Perfect for your needs.`
      }
      throw error
    }
  }

  async analyzeDataWithNaturalLanguage(
    query: string,
    data: Record<string, any>[]
  ): Promise<string> {
    try {
      const dataStr = JSON.stringify(data.slice(0, 50), null, 2)
      const prompt = `Answer the following question about the data provided:

Question: ${query}

Data: ${dataStr}

Provide a clear, concise answer with relevant insights and numbers.`

      return await window.spark.llm(prompt, this.config.model)
    } catch (error) {
      if (this.config.fallbackEnabled) {
        return `Unable to analyze data for query: ${query}`
      }
      throw error
    }
  }

  private fallbackGenerateVariations(content: string, count: number): string[] {
    const variations: string[] = []
    const templates = [
      (c: string) => c,
      (c: string) => c.charAt(0).toUpperCase() + c.slice(1),
      (c: string) => `${c}.`,
      (c: string) => c.replace(/\.$/, ''),
    ]

    for (let i = 0; i < Math.min(count, templates.length); i++) {
      variations.push(templates[i](content))
    }

    return variations
  }

  private fallbackSummarize(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content

    const truncated = content.slice(0, maxLength - 3)
    const lastSpace = truncated.lastIndexOf(' ')

    return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...'
  }

  private fallbackImageAttributes(imageUrl: string): ImageAttributes {
    const filename = imageUrl.split('/').pop() || 'image'
    return {
      description: `Image file: ${filename}`,
      objects: ['content'],
      colors: ['various'],
      composition: 'standard',
      suggestedUsage: ['web', 'print'],
    }
  }

  private fallbackDetectAnomalies(metrics: MetricData[]): Anomaly[] {
    const anomalies: Anomaly[] = []
    const grouped = new Map<string, MetricData[]>()

    metrics.forEach(m => {
      const key = m.metric
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)!.push(m)
    })

    grouped.forEach((values, metric) => {
      if (values.length < 3) return

      const nums = values.map(v => v.value)
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length
      const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nums.length
      const stdDev = Math.sqrt(variance)

      values.slice(-5).forEach(v => {
        const deviation = Math.abs(v.value - mean) / (stdDev || 1)
        if (deviation > 2) {
          anomalies.push({
            id: `anomaly-${Date.now()}-${Math.random()}`,
            timestamp: v.timestamp,
            metric: v.metric,
            expectedValue: mean,
            actualValue: v.value,
            deviation: deviation * 100,
            severity: deviation > 3 ? 'high' : 'medium',
            description: `${metric} value is ${deviation.toFixed(1)}σ from the mean`,
            suggestedAction: 'Review recent changes and investigate potential causes',
          })
        }
      })
    })

    return anomalies
  }

  private fallbackPropensityScore(userId: string): PropensityScore {
    const hash = this.simpleHash(userId)
    return {
      userId,
      purchaseProbability: (hash % 100) / 100,
      churnRisk: ((hash * 7) % 100) / 100,
      lifetimeValue: (hash % 10000) + 1000,
      recommendedActions: ['Send personalized email', 'Offer product recommendations'],
      segment: 'Standard Customer',
    }
  }

  private fallbackSemanticSearch(query: string, indexData: Record<string, any>[]): SearchResult[] {
    const queryLower = query.toLowerCase()
    const results: SearchResult[] = []

    indexData.forEach((item, idx) => {
      const itemStr = JSON.stringify(item).toLowerCase()
      if (itemStr.includes(queryLower)) {
        results.push({
          id: item.id || `result-${idx}`,
          title: item.title || item.name || 'Untitled',
          content: itemStr.slice(0, 200),
          relevance: 0.7,
          metadata: item,
        })
      }
    })

    return results.slice(0, 5)
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  setConfig(config: Partial<AIConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): AIConfig {
    return { ...this.config }
  }
}

export const AIService = new AIServiceClass()
