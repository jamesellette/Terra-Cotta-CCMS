import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts'
import { 
  Eye, 
  Users, 
  ShoppingCart, 
  CurrencyDollar,
  TrendUp,
  TrendDown,
  Globe,
  DeviceMobile
} from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

const generateRealtimeData = () => {
  const now = new Date()
  return Array.from({ length: 30 }, (_, i) => {
    const time = new Date(now.getTime() - (29 - i) * 2000)
    return {
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      visitors: Math.floor(Math.random() * 50) + 80,
      pageviews: Math.floor(Math.random() * 120) + 150,
    }
  })
}

interface RealtimeMetric {
  label: string
  value: number
  change: number
  trend: 'up' | 'down'
  Icon: any
}

export function RealtimeDashboard() {
  const [data, setData] = useState(generateRealtimeData())
  const [metrics, setMetrics] = useState<RealtimeMetric[]>([
    { label: 'Active Visitors', value: 847, change: 12, trend: 'up', Icon: Users },
    { label: 'Pages/Session', value: 3.2, change: -5, trend: 'down', Icon: Eye },
    { label: 'Active Carts', value: 124, change: 8, trend: 'up', Icon: ShoppingCart },
    { label: 'Revenue (Today)', value: 15847, change: 18, trend: 'up', Icon: CurrencyDollar },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)]
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          visitors: Math.floor(Math.random() * 50) + 80,
          pageviews: Math.floor(Math.random() * 120) + 150,
        })
        return newData
      })

      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.label === 'Revenue (Today)' 
          ? metric.value + Math.floor(Math.random() * 50)
          : metric.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
        change: Math.floor(Math.random() * 20) - 10,
        trend: Math.random() > 0.5 ? 'up' : 'down',
      })))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const topPages = [
    { page: '/products/trail-runner-pro', visitors: 234, avgTime: '3m 42s' },
    { page: '/category/running-shoes', visitors: 189, avgTime: '2m 18s' },
    { page: '/blog/marathon-training', visitors: 156, avgTime: '5m 12s' },
    { page: '/products/ultra-comfort-socks', visitors: 142, avgTime: '2m 45s' },
    { page: '/', visitors: 128, avgTime: '1m 33s' },
  ]

  const topReferrers = [
    { source: 'Google Search', visitors: 342, percentage: 40 },
    { source: 'Facebook', visitors: 198, percentage: 23 },
    { source: 'Direct', visitors: 156, percentage: 18 },
    { source: 'Instagram', visitors: 89, percentage: 11 },
    { source: 'Twitter', visitors: 62, percentage: 8 },
  ]

  const deviceBreakdown = [
    { device: 'Desktop', count: 421, percentage: 50 },
    { device: 'Mobile', count: 338, percentage: 40 },
    { device: 'Tablet', count: 88, percentage: 10 },
  ]

  const recentConversions = [
    { id: '1', location: 'San Francisco, CA', product: 'Trail Runner Pro', value: 129.99, time: '5s ago' },
    { id: '2', location: 'New York, NY', product: 'Ultra Comfort Socks', value: 24.99, time: '12s ago' },
    { id: '3', location: 'Austin, TX', product: 'Marathon Training Pack', value: 89.99, time: '28s ago' },
    { id: '4', location: 'Seattle, WA', product: 'Recovery Foam Roller', value: 34.99, time: '45s ago' },
    { id: '5', location: 'Boston, MA', product: 'GPS Running Watch', value: 249.99, time: '1m ago' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            Real-time Dashboard
            <Badge variant="default" className="bg-teal animate-pulse">LIVE</Badge>
          </h2>
          <p className="text-muted-foreground mt-1">Live activity and performance metrics</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              <metric.Icon size={20} className="text-primary" />
            </div>
            <div className="text-2xl font-bold">
              {metric.label.includes('Revenue') 
                ? `$${metric.value.toLocaleString()}`
                : metric.label.includes('Pages')
                ? metric.value.toFixed(1)
                : metric.value.toLocaleString()}
            </div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${metric.trend === 'up' ? 'text-teal' : 'text-destructive'}`}>
              {metric.trend === 'up' ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
              {Math.abs(metric.change)}% vs last hour
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Live Visitor Activity</h3>
          <p className="text-sm text-muted-foreground">Updates every 2 seconds</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--teal))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--teal))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={11}
              interval={4}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="visitors" 
              stroke="hsl(var(--primary))" 
              fillOpacity={1} 
              fill="url(#colorVisitors)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="pageviews" 
              stroke="hsl(var(--teal))" 
              fillOpacity={1} 
              fill="url(#colorPageviews)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Top Pages Right Now</h3>
            <p className="text-sm text-muted-foreground">Most visited pages in last 5 minutes</p>
          </div>

          <div className="space-y-3">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{page.page}</div>
                  <div className="text-xs text-muted-foreground">Avg. time: {page.avgTime}</div>
                </div>
                <Badge variant="secondary">{page.visitors} visitors</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Traffic Sources</h3>
            <p className="text-sm text-muted-foreground">Where visitors are coming from</p>
          </div>

          <div className="space-y-3">
            {topReferrers.map((referrer, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{referrer.source}</span>
                  <span className="text-muted-foreground">{referrer.visitors} visitors</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${referrer.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Device Breakdown</h3>
              <p className="text-sm text-muted-foreground">Current visitor devices</p>
            </div>
            <DeviceMobile size={20} className="text-primary" />
          </div>

          <div className="space-y-4">
            {deviceBreakdown.map((device, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{device.device}</span>
                  <Badge variant="outline">{device.percentage}%</Badge>
                </div>
                <div className="text-2xl font-bold">{device.count}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Recent Conversions</h3>
              <p className="text-sm text-muted-foreground">Latest purchases</p>
            </div>
            <Globe size={20} className="text-teal" />
          </div>

          <div className="space-y-3">
            {recentConversions.map((conversion) => (
              <div key={conversion.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{conversion.product}</div>
                    <div className="text-xs text-muted-foreground">{conversion.location}</div>
                  </div>
                  <Badge variant="default" className="bg-teal">${conversion.value}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{conversion.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
