import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sparkle,
  TextAa,
  Translate,
  Image as ImageIcon,
  MagnifyingGlass,
  ChartLineUp,
  Warning,
  Users,
  FileText,
  ArrowsClockwise,
} from '@phosphor-icons/react'
import { AIService, GenerationOptions } from '@/lib/ai-service'
import { toast } from 'sonner'

export function AIServices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Services</h1>
        <p className="text-muted-foreground mt-2">
          Powerful AI-driven tools for content generation, analysis, and optimization
        </p>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content" className="gap-2">
            <TextAa size={18} />
            Content Generation
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-2">
            <ImageIcon size={18} />
            Image Analysis
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <MagnifyingGlass size={18} />
            Smart Search
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <ChartLineUp size={18} />
            Analytics AI
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="gap-2">
            <Warning size={18} />
            Accessibility
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ContentVariations />
            <ContentSummarizer />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <ContentTranslator />
            <ProductDescriptionGenerator />
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ImageAttributeExtractor />
            <AltTextGenerator />
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <SemanticSearch />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            <AnomalyDetector />
            <PropensityScoring />
            <NaturalLanguageQuery />
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <AccessibilityChecker />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ContentVariations() {
  const [content, setContent] = useState('')
  const [variations, setVariations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'formal' | 'creative'>('professional')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [count, setCount] = useState(3)

  const handleGenerate = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content')
      return
    }

    setLoading(true)
    try {
      const options: GenerationOptions = { count, tone, length }
      const results = await AIService.generateVariations(content, options)
      setVariations(results)
      toast.success(`Generated ${results.length} variations`)
    } catch (error) {
      toast.error('Failed to generate variations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkle size={24} weight="fill" className="text-primary" />
          Content Variations
        </CardTitle>
        <CardDescription>
          Generate multiple versions of your content with different tones and lengths
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content-input">Original Content</Label>
          <Textarea
            id="content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v: any) => setTone(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Length</Label>
            <Select value={length} onValueChange={(v: any) => setLength(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Count</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? 'Generating...' : 'Generate Variations'}
        </Button>

        {variations.length > 0 && (
          <ScrollArea className="h-64 rounded-md border p-4">
            <div className="space-y-4">
              {variations.map((variation, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Variation {idx + 1}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(variation)
                        toast.success('Copied to clipboard')
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm">{variation}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

function ContentSummarizer() {
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [maxLength, setMaxLength] = useState(150)

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content')
      return
    }

    setLoading(true)
    try {
      const result = await AIService.summarize(content, maxLength)
      setSummary(result)
      toast.success('Summary generated')
    } catch (error) {
      toast.error('Failed to generate summary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText size={24} className="text-primary" />
          Content Summarizer
        </CardTitle>
        <CardDescription>
          Generate concise summaries of long content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summarize-input">Content to Summarize</Label>
          <Textarea
            id="summarize-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content..."
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label>Max Length (characters)</Label>
          <Input
            type="number"
            min={50}
            max={500}
            value={maxLength}
            onChange={(e) => setMaxLength(parseInt(e.target.value) || 150)}
          />
        </div>

        <Button onClick={handleSummarize} disabled={loading} className="w-full">
          {loading ? 'Summarizing...' : 'Generate Summary'}
        </Button>

        {summary && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Summary</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(summary)
                  toast.success('Copied to clipboard')
                }}
              >
                Copy
              </Button>
            </div>
            <div className="rounded-md border p-4 bg-muted">
              <p className="text-sm">{summary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ContentTranslator() {
  const [content, setContent] = useState('')
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)
  const [targetLocale, setTargetLocale] = useState('es-ES')

  const handleTranslate = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content')
      return
    }

    setLoading(true)
    try {
      const result = await AIService.translate(content, targetLocale)
      setTranslation(result)
      toast.success('Translation complete')
    } catch (error) {
      toast.error('Failed to translate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Translate size={24} className="text-primary" />
          Content Translator
        </CardTitle>
        <CardDescription>
          Translate content to different languages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="translate-input">Content to Translate</Label>
          <Textarea
            id="translate-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Target Language</Label>
          <Select value={targetLocale} onValueChange={setTargetLocale}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es-ES">Spanish</SelectItem>
              <SelectItem value="fr-FR">French</SelectItem>
              <SelectItem value="de-DE">German</SelectItem>
              <SelectItem value="it-IT">Italian</SelectItem>
              <SelectItem value="pt-BR">Portuguese (BR)</SelectItem>
              <SelectItem value="ja-JP">Japanese</SelectItem>
              <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleTranslate} disabled={loading} className="w-full">
          {loading ? 'Translating...' : 'Translate'}
        </Button>

        {translation && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Translation</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(translation)
                  toast.success('Copied to clipboard')
                }}
              >
                Copy
              </Button>
            </div>
            <div className="rounded-md border p-4 bg-muted">
              <p className="text-sm">{translation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ProductDescriptionGenerator() {
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [features, setFeatures] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!productName.trim() || !category.trim() || !features.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const featureList = features.split(',').map(f => f.trim()).filter(Boolean)
      const result = await AIService.generateProductDescription(productName, featureList, category)
      setDescription(result)
      toast.success('Product description generated')
    } catch (error) {
      toast.error('Failed to generate description')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkle size={24} weight="fill" className="text-primary" />
          Product Description Generator
        </CardTitle>
        <CardDescription>
          AI-generated product descriptions for e-commerce
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product-name">Product Name</Label>
          <Input
            id="product-name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Premium Wireless Headphones"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Electronics, Audio"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">Features (comma-separated)</Label>
          <Textarea
            id="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="e.g., Noise cancellation, 30-hour battery, Bluetooth 5.0"
            rows={3}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? 'Generating...' : 'Generate Description'}
        </Button>

        {description && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Description</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(description)
                  toast.success('Copied to clipboard')
                }}
              >
                Copy
              </Button>
            </div>
            <div className="rounded-md border p-4 bg-muted">
              <p className="text-sm whitespace-pre-wrap">{description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ImageAttributeExtractor() {
  const [imageUrl, setImageUrl] = useState('')
  const [attributes, setAttributes] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleExtract = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }

    setLoading(true)
    try {
      const result = await AIService.extractImageAttributes(imageUrl)
      setAttributes(result)
      toast.success('Attributes extracted')
    } catch (error) {
      toast.error('Failed to extract attributes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon size={24} className="text-primary" />
          Image Attribute Extraction
        </CardTitle>
        <CardDescription>
          Extract detailed attributes from images
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL</Label>
          <Input
            id="image-url"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <Button onClick={handleExtract} disabled={loading} className="w-full">
          {loading ? 'Extracting...' : 'Extract Attributes'}
        </Button>

        {attributes && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Description</Label>
              <p className="text-sm rounded-md border p-3 bg-muted">{attributes.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Objects Detected</Label>
              <div className="flex flex-wrap gap-2">
                {attributes.objects.map((obj: string, idx: number) => (
                  <Badge key={idx} variant="secondary">{obj}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Colors</Label>
              <div className="flex flex-wrap gap-2">
                {attributes.colors.map((color: string, idx: number) => (
                  <Badge key={idx} variant="outline">{color}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Composition</Label>
              <p className="text-sm rounded-md border p-3 bg-muted">{attributes.composition}</p>
            </div>

            <div className="space-y-2">
              <Label>Suggested Usage</Label>
              <div className="flex flex-wrap gap-2">
                {attributes.suggestedUsage.map((usage: string, idx: number) => (
                  <Badge key={idx}>{usage}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AltTextGenerator() {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }

    setLoading(true)
    try {
      const result = await AIService.generateAltText(imageUrl)
      setAltText(result)
      toast.success('Alt text generated')
    } catch (error) {
      toast.error('Failed to generate alt text')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon size={24} className="text-primary" />
          Alt Text Generator
        </CardTitle>
        <CardDescription>
          Generate accessibility-compliant alt text for images
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="alt-image-url">Image URL</Label>
          <Input
            id="alt-image-url"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? 'Generating...' : 'Generate Alt Text'}
        </Button>

        {altText && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Alt Text</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(altText)
                  toast.success('Copied to clipboard')
                }}
              >
                Copy
              </Button>
            </div>
            <div className="rounded-md border p-4 bg-muted">
              <p className="text-sm">{altText}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SemanticSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const sampleData = [
    { id: '1', title: 'Product Launch Strategy', content: 'Comprehensive guide to launching new products in the market...', category: 'Marketing' },
    { id: '2', title: 'Customer Support Best Practices', content: 'Essential tips for providing excellent customer service...', category: 'Support' },
    { id: '3', title: 'SEO Optimization Techniques', content: 'Advanced strategies for improving search engine rankings...', category: 'SEO' },
  ]

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setLoading(true)
    try {
      const searchResults = await AIService.semanticSearch(query, sampleData)
      setResults(searchResults)
      toast.success(`Found ${searchResults.length} results`)
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MagnifyingGlass size={24} className="text-primary" />
          Semantic Search
        </CardTitle>
        <CardDescription>
          AI-powered search that understands context and meaning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {results.length > 0 && (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.id} className="rounded-md border p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{result.title}</h3>
                    <Badge variant="secondary">{Math.round(result.relevance * 100)}% match</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{result.content}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

function AnomalyDetector() {
  const [loading, setLoading] = useState(false)
  const [anomalies, setAnomalies] = useState<any[]>([])

  const generateSampleData = () => {
    const data: Array<{ timestamp: string; metric: string; value: number }> = []
    const baseValue = 1000
    for (let i = 0; i < 30; i++) {
      const timestamp = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString()
      const variation = i === 25 ? baseValue * 2.5 : baseValue + (Math.random() * 200 - 100)
      data.push({
        timestamp,
        metric: 'page_views',
        value: variation,
      })
    }
    return data
  }

  const handleDetect = async () => {
    setLoading(true)
    try {
      const sampleData = generateSampleData()
      const detected = await AIService.detectAnomalies(sampleData)
      setAnomalies(detected)
      toast.success(`Detected ${detected.length} anomalies`)
    } catch (error) {
      toast.error('Failed to detect anomalies')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Warning size={24} className="text-primary" />
          Anomaly Detection
        </CardTitle>
        <CardDescription>
          AI-powered detection of unusual patterns in your metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleDetect} disabled={loading} className="w-full">
          {loading ? 'Detecting...' : 'Detect Anomalies in Sample Data'}
        </Button>

        {anomalies.length > 0 && (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="rounded-md border p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{anomaly.metric}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={getSeverityColor(anomaly.severity) as any}>
                      {anomaly.severity}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Expected</p>
                      <p className="font-medium">{anomaly.expectedValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Actual</p>
                      <p className="font-medium">{anomaly.actualValue.toFixed(2)}</p>
                    </div>
                  </div>

                  <p className="text-sm">{anomaly.description}</p>
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-xs font-medium mb-1">Suggested Action:</p>
                    <p className="text-xs">{anomaly.suggestedAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

function PropensityScoring() {
  const [userId, setUserId] = useState('')
  const [score, setScore] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleScore = async () => {
    if (!userId.trim()) {
      toast.error('Please enter a user ID')
      return
    }

    setLoading(true)
    try {
      const result = await AIService.predictPropensity(userId)
      setScore(result)
      toast.success('Propensity score calculated')
    } catch (error) {
      toast.error('Failed to calculate score')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={24} className="text-primary" />
          Audience Propensity Scoring
        </CardTitle>
        <CardDescription>
          Predict customer behavior and lifetime value
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
            onKeyDown={(e) => e.key === 'Enter' && handleScore()}
          />
          <Button onClick={handleScore} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </Button>
        </div>

        {score && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-md border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Purchase Probability</p>
                <p className="text-2xl font-bold text-primary">
                  {(score.purchaseProbability * 100).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-md border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Churn Risk</p>
                <p className="text-2xl font-bold text-destructive">
                  {(score.churnRisk * 100).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-md border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Lifetime Value</p>
                <p className="text-2xl font-bold text-teal">
                  ${score.lifetimeValue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Segment</Label>
              <Badge variant="secondary" className="text-sm">{score.segment}</Badge>
            </div>

            <div className="space-y-2">
              <Label>Recommended Actions</Label>
              <ul className="space-y-1">
                {score.recommendedActions.map((action: string, idx: number) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <ArrowsClockwise size={16} className="text-primary mt-0.5" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function NaturalLanguageQuery() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const sampleData = [
    { date: '2024-01', revenue: 125000, orders: 450, customers: 320 },
    { date: '2024-02', revenue: 138000, orders: 490, customers: 360 },
    { date: '2024-03', revenue: 152000, orders: 520, customers: 395 },
  ]

  const handleQuery = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query')
      return
    }

    setLoading(true)
    try {
      const result = await AIService.analyzeDataWithNaturalLanguage(query, sampleData)
      setAnswer(result)
      toast.success('Query answered')
    } catch (error) {
      toast.error('Failed to answer query')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLineUp size={24} className="text-primary" />
          Natural Language Data Query
        </CardTitle>
        <CardDescription>
          Ask questions about your data in plain English
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nl-query">Your Question</Label>
          <Textarea
            id="nl-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What was the average revenue growth rate?"
            rows={3}
          />
        </div>

        <Button onClick={handleQuery} disabled={loading} className="w-full">
          {loading ? 'Analyzing...' : 'Ask Question'}
        </Button>

        {answer && (
          <div className="space-y-2">
            <Label>Answer</Label>
            <div className="rounded-md border p-4 bg-muted">
              <p className="text-sm whitespace-pre-wrap">{answer}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AccessibilityChecker() {
  const [content, setContent] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content')
      return
    }

    setLoading(true)
    try {
      const checkResult = await AIService.checkContentAccessibility(content)
      setResult(checkResult)
      toast.success('Accessibility check complete')
    } catch (error) {
      toast.error('Failed to check accessibility')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Warning size={24} className="text-primary" />
          Content Accessibility Checker
        </CardTitle>
        <CardDescription>
          Analyze content for accessibility compliance and inclusivity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accessibility-content">Content to Check</Label>
          <Textarea
            id="accessibility-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content..."
            rows={8}
          />
        </div>

        <Button onClick={handleCheck} disabled={loading} className="w-full">
          {loading ? 'Checking...' : 'Check Accessibility'}
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="text-center p-6 rounded-md border bg-muted">
              <p className="text-sm text-muted-foreground mb-2">Accessibility Score</p>
              <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}
              </p>
              <p className="text-sm text-muted-foreground mt-2">out of 100</p>
            </div>

            {result.issues.length > 0 && (
              <div className="space-y-2">
                <Label className="text-destructive">Issues Found</Label>
                <ul className="space-y-2">
                  {result.issues.map((issue: string, idx: number) => (
                    <li key={idx} className="text-sm flex items-start gap-2 rounded-md border border-destructive/50 p-3 bg-destructive/5">
                      <Warning size={16} className="text-destructive mt-0.5" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions.length > 0 && (
              <div className="space-y-2">
                <Label>Suggestions for Improvement</Label>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion: string, idx: number) => (
                    <li key={idx} className="text-sm flex items-start gap-2 rounded-md border p-3 bg-muted">
                      <Sparkle size={16} className="text-primary mt-0.5" weight="fill" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
