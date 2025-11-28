import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { 
  Users, 
  TrendUp, 
  ShoppingCart, 
  Sparkle,
  Target
} from '@phosphor-icons/react'

interface Segment {
  id: string
  name: string
  description: string
  size: number
  percentage: number
  avgOrderValue: number
  conversionRate: number
  lifetimeValue: number
  color: string
  criteria: string[]
}

const mockSegments: Segment[] = [
  {
    id: '1',
    name: 'High-Value Customers',
    description: 'Frequent buyers with high lifetime value',
    size: 3450,
    percentage: 12,
    avgOrderValue: 285,
    conversionRate: 18.5,
    lifetimeValue: 2840,
    color: 'hsl(var(--teal))',
    criteria: ['Orders > 5', 'LTV > $1000', 'Last purchase < 30 days'],
  },
  {
    id: '2',
    name: 'At-Risk Customers',
    description: 'Previous buyers who haven\'t purchased recently',
    size: 5680,
    percentage: 20,
    avgOrderValue: 142,
    conversionRate: 3.2,
    lifetimeValue: 580,
    color: 'hsl(var(--accent))',
    criteria: ['Orders > 2', 'Last purchase > 90 days', 'Email engagement low'],
  },
  {
    id: '3',
    name: 'Window Shoppers',
    description: 'High browsing activity but low purchase intent',
    size: 12450,
    percentage: 43,
    avgOrderValue: 0,
    conversionRate: 0.8,
    lifetimeValue: 12,
    color: 'hsl(var(--muted-foreground))',
    criteria: ['Sessions > 5', 'Orders = 0', 'Avg. session > 5min'],
  },
  {
    id: '4',
    name: 'New Customers',
    description: 'First-time buyers in last 30 days',
    size: 2890,
    percentage: 10,
    avgOrderValue: 98,
    conversionRate: 12.0,
    lifetimeValue: 98,
    color: 'hsl(var(--primary))',
    criteria: ['Orders = 1', 'First purchase < 30 days'],
  },
  {
    id: '5',
    name: 'Loyal Advocates',
    description: 'Brand advocates with high engagement',
    size: 1850,
    percentage: 6,
    avgOrderValue: 195,
    conversionRate: 22.0,
    lifetimeValue: 3250,
    color: 'hsl(var(--slate))',
    criteria: ['Orders > 10', 'Reviews > 3', 'Referrals > 1'],
  },
  {
    id: '6',
    name: 'Discount Seekers',
    description: 'Only buy during promotions',
    size: 2580,
    percentage: 9,
    avgOrderValue: 78,
    conversionRate: 8.5,
    lifetimeValue: 312,
    color: 'hsl(var(--primary) / 0.6)',
    criteria: ['Coupon usage > 80%', 'Avg. discount > 20%'],
  },
]

const segmentSizeData = mockSegments.map(s => ({
  name: s.name,
  value: s.size,
  color: s.color,
}))

const segmentValueData = mockSegments.map(s => ({
  name: s.name,
  ltv: s.lifetimeValue,
  aov: s.avgOrderValue,
})).sort((a, b) => b.ltv - a.ltv)

export function AudienceSegmentation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkle size={28} weight="fill" className="text-primary" />
            AI Audience Segmentation
          </h2>
          <p className="text-muted-foreground mt-1">Automatic customer segmentation based on behavior</p>
        </div>
        <Button className="gap-2">
          <Target size={18} weight="bold" />
          Create Custom Segment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Segments</div>
          <div className="text-2xl font-bold">{mockSegments.length}</div>
          <div className="text-xs text-teal mt-1">4 high-value groups</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Users</div>
          <div className="text-2xl font-bold">{mockSegments.reduce((sum, s) => sum + s.size, 0).toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Across all segments</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Highest LTV Segment</div>
          <div className="text-2xl font-bold">Loyal</div>
          <div className="text-xs text-teal mt-1">$3,250 avg. LTV</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">ML Accuracy</div>
          <div className="text-2xl font-bold">96.8%</div>
          <div className="text-xs text-muted-foreground mt-1">Segmentation confidence</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Segment Distribution</h3>
              <p className="text-sm text-muted-foreground">User count by segment</p>
            </div>
            <Users size={20} className="text-primary" />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentSizeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {segmentSizeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Segment Value</h3>
              <p className="text-sm text-muted-foreground">Lifetime value by segment</p>
            </div>
            <TrendUp size={20} className="text-teal" />
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={segmentValueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="ltv" name="Lifetime Value" fill="hsl(var(--teal))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Segment Details</h3>
            <p className="text-sm text-muted-foreground">Performance metrics and criteria</p>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="high-value">High Value</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
              <SelectItem value="new">New Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {mockSegments.map((segment) => (
            <div 
              key={segment.id}
              className="p-5 border rounded-lg hover:border-primary transition-colors"
              style={{ borderLeftWidth: '4px', borderLeftColor: segment.color }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg">{segment.name}</h4>
                    <Badge variant="outline">{segment.size.toLocaleString()} users</Badge>
                    <Badge variant="secondary">{segment.percentage}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{segment.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {segment.criteria.map((criterion, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {criterion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Avg. Order Value</div>
                  <div className="text-xl font-bold">
                    ${segment.avgOrderValue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Conversion Rate</div>
                  <div className="text-xl font-bold">
                    {segment.conversionRate}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Lifetime Value</div>
                  <div className="text-xl font-bold text-teal">
                    ${segment.lifetimeValue.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="gap-2">
                  <ShoppingCart size={16} />
                  Target Campaign
                </Button>
                <Button size="sm" variant="outline">View Users</Button>
                <Button size="sm" variant="outline">Export</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Segment Insights & Recommendations</h3>
          <p className="text-sm text-muted-foreground">AI-powered actionable insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 bg-teal/10 border border-teal/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkle size={18} className="text-teal" weight="fill" />
              <span className="font-semibold">High-Value Opportunity</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Your "At-Risk Customers" segment (5,680 users) has high historical LTV but low recent engagement. 
              A re-engagement campaign could recover ~$1.2M in potential revenue.
            </p>
            <Button size="sm" className="bg-teal">Create Win-Back Campaign</Button>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkle size={18} className="text-primary" weight="fill" />
              <span className="font-semibold">Upsell Opportunity</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              "New Customers" (2,890 users) show strong early engagement. Cross-sell campaigns within 60 days 
              could increase their LTV by 40% based on historical patterns.
            </p>
            <Button size="sm" className="bg-primary">Set Up Upsell Flow</Button>
          </div>

          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkle size={18} className="text-accent" weight="fill" />
              <span className="font-semibold">Loyalty Program</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              "Loyal Advocates" (1,850 users) have the highest LTV ($3,250) but represent only 6% of your base. 
              A referral program could help grow this valuable segment.
            </p>
            <Button size="sm" className="bg-accent">Launch Referral Program</Button>
          </div>

          <div className="p-4 bg-slate/10 border border-slate/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkle size={18} className="text-slate" weight="fill" />
              <span className="font-semibold">Conversion Optimization</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              "Window Shoppers" (12,450 users) have high engagement but 0.8% conversion. Exit-intent offers or 
              limited-time discounts could convert 5-10% of this segment.
            </p>
            <Button size="sm" className="bg-slate">Create Exit-Intent Campaign</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
