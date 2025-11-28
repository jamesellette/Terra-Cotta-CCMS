import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MapPin,
  ShoppingCart,
  Eye,
  Mouse,
  CheckCircle,
  Warning
} from '@phosphor-icons/react'

interface JourneyStep {
  id: string
  type: 'page_view' | 'click' | 'cart_add' | 'checkout' | 'purchase' | 'exit'
  page: string
  timestamp: string
  duration?: string
  properties?: Record<string, any>
}

const mockJourneys: JourneyStep[] = [
  { id: '1', type: 'page_view', page: 'Homepage', timestamp: '2:30 PM', duration: '45s' },
  { id: '2', type: 'click', page: 'Search: "running shoes"', timestamp: '2:31 PM' },
  { id: '3', type: 'page_view', page: 'Product Listing', timestamp: '2:31 PM', duration: '2m 15s' },
  { id: '4', type: 'click', page: 'Product: Trail Runner Pro', timestamp: '2:33 PM' },
  { id: '5', type: 'page_view', page: 'Product Details', timestamp: '2:33 PM', duration: '1m 30s' },
  { id: '6', type: 'cart_add', page: 'Added to Cart', timestamp: '2:35 PM', properties: { product: 'Trail Runner Pro', price: 129.99 } },
  { id: '7', type: 'page_view', page: 'Shopping Cart', timestamp: '2:35 PM', duration: '45s' },
  { id: '8', type: 'checkout', page: 'Checkout', timestamp: '2:36 PM', duration: '3m 20s' },
  { id: '9', type: 'purchase', page: 'Order Confirmation', timestamp: '2:39 PM', properties: { order_id: 'ORD-12345', total: 129.99 } },
]

const getStepIcon = (type: string) => {
  switch (type) {
    case 'page_view':
      return <Eye size={18} weight="fill" />
    case 'click':
      return <Mouse size={18} weight="fill" />
    case 'cart_add':
      return <ShoppingCart size={18} weight="fill" />
    case 'checkout':
    case 'purchase':
      return <CheckCircle size={18} weight="fill" />
    case 'exit':
      return <Warning size={18} weight="fill" />
    default:
      return <MapPin size={18} weight="fill" />
  }
}

const getStepColor = (type: string) => {
  switch (type) {
    case 'purchase':
      return 'bg-teal text-teal-foreground'
    case 'cart_add':
      return 'bg-primary text-primary-foreground'
    case 'exit':
      return 'bg-destructive text-destructive-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function CustomerJourney() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Customer Journey Analytics</h2>
        <p className="text-muted-foreground mt-1">Track user paths from entry to conversion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Avg. Journey Length</div>
          <div className="text-2xl font-bold">8.3 steps</div>
          <div className="text-xs text-teal mt-1">+12% vs last week</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Avg. Time to Convert</div>
          <div className="text-2xl font-bold">24m 15s</div>
          <div className="text-xs text-destructive mt-1">-8% vs last week</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Drop-off Rate</div>
          <div className="text-2xl font-bold">34.2%</div>
          <div className="text-xs text-teal mt-1">-5% vs last week</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
          <div className="text-2xl font-bold">3.8%</div>
          <div className="text-xs text-teal mt-1">+0.4% vs last week</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Sample Journey</h3>
          <div className="text-sm text-muted-foreground">Session ID: sess_abc123xyz • User: Anonymous • Device: Mobile Safari</div>
        </div>

        <ScrollArea className="h-[600px] pr-4">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {mockJourneys.map((step, index) => (
                <div key={step.id} className="relative flex gap-4 group">
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${getStepColor(step.type)} flex items-center justify-center shadow-sm`}>
                    {getStepIcon(step.type)}
                  </div>
                  
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{step.page}</div>
                        <div className="text-sm text-muted-foreground">{step.timestamp}</div>
                      </div>
                      {step.duration && (
                        <Badge variant="outline" className="text-xs">
                          {step.duration}
                        </Badge>
                      )}
                    </div>
                    
                    {step.properties && (
                      <div className="mt-2 p-3 bg-muted rounded-lg text-sm space-y-1">
                        {Object.entries(step.properties).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                            <span className="font-medium">{typeof value === 'number' ? `$${value.toFixed(2)}` : value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Entry Points</h3>
          <div className="space-y-3">
            {[
              { page: 'Homepage', count: 12450, rate: 45 },
              { page: 'Product Pages (SEO)', count: 8900, rate: 32 },
              { page: 'Blog Posts', count: 3200, rate: 12 },
              { page: 'Category Pages', count: 2100, rate: 8 },
              { page: 'Landing Pages', count: 850, rate: 3 },
            ].map((entry, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{entry.page}</span>
                  <span className="text-muted-foreground">{entry.count.toLocaleString()} visits</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${entry.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Common Exit Points</h3>
          <div className="space-y-3">
            {[
              { page: 'Shopping Cart', count: 5200, rate: 38 },
              { page: 'Checkout - Shipping', count: 3100, rate: 23 },
              { page: 'Product Listing', count: 2800, rate: 21 },
              { page: 'Product Details', count: 1500, rate: 11 },
              { page: 'Checkout - Payment', count: 950, rate: 7 },
            ].map((exit, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{exit.page}</span>
                  <span className="text-muted-foreground">{exit.count.toLocaleString()} exits</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-destructive h-2 rounded-full transition-all"
                    style={{ width: `${exit.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
