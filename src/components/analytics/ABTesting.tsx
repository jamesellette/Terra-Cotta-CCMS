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
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts'
import { Trophy, Target, TrendUp } from '@phosphor-icons/react'
import { useState } from 'react'

interface Experiment {
  id: string
  name: string
  status: 'running' | 'completed' | 'draft'
  metric: string
  variants: { id: string; name: string; traffic: number }[]
  startDate: string
  endDate?: string
}

const mockExperiments: Experiment[] = [
  {
    id: '1',
    name: 'Product Page CTA Button Color',
    status: 'running',
    metric: 'Add to Cart Rate',
    variants: [
      { id: 'control', name: 'Control (Blue)', traffic: 50 },
      { id: 'variant-a', name: 'Variant A (Green)', traffic: 50 },
    ],
    startDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Checkout Flow Optimization',
    status: 'running',
    metric: 'Conversion Rate',
    variants: [
      { id: 'control', name: 'Control (3 steps)', traffic: 33 },
      { id: 'variant-a', name: 'Variant A (2 steps)', traffic: 33 },
      { id: 'variant-b', name: 'Variant B (1 step)', traffic: 34 },
    ],
    startDate: '2024-01-10',
  },
  {
    id: '3',
    name: 'Homepage Hero Image',
    status: 'completed',
    metric: 'Click-through Rate',
    variants: [
      { id: 'control', name: 'Control (Lifestyle)', traffic: 50 },
      { id: 'variant-a', name: 'Variant A (Product)', traffic: 50 },
    ],
    startDate: '2023-12-01',
    endDate: '2024-01-05',
  },
]

const variantPerformance = [
  { variant: 'Control', conversions: 850, rate: 8.5, uplift: 0, visitors: 10000 },
  { variant: 'Variant A', conversions: 1020, rate: 10.2, uplift: 20, visitors: 10000 },
]

const timeSeriesComparison = [
  { date: 'Day 1', control: 8.2, variantA: 8.5 },
  { date: 'Day 2', control: 8.4, variantA: 9.1 },
  { date: 'Day 3', control: 8.3, variantA: 9.8 },
  { date: 'Day 4', control: 8.6, variantA: 10.0 },
  { date: 'Day 5', control: 8.5, variantA: 10.4 },
  { date: 'Day 6', control: 8.7, variantA: 10.1 },
  { date: 'Day 7', control: 8.5, variantA: 10.2 },
]

export function ABTesting() {
  const [selectedExperiment, setSelectedExperiment] = useState('1')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">A/B Testing & Experiments</h2>
          <p className="text-muted-foreground mt-1">Optimize conversion through data-driven testing</p>
        </div>
        <Button className="gap-2">
          <Target size={18} weight="bold" />
          Create Experiment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Active Tests</div>
          <div className="text-2xl font-bold">2</div>
          <div className="text-xs text-muted-foreground mt-1">3 drafts</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Completed Tests</div>
          <div className="text-2xl font-bold">18</div>
          <div className="text-xs text-teal mt-1">14 winners found</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Avg. Uplift</div>
          <div className="text-2xl font-bold">+15.3%</div>
          <div className="text-xs text-teal mt-1 flex items-center gap-1">
            <TrendUp size={12} weight="bold" />
            On winning variants
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Statistical Power</div>
          <div className="text-2xl font-bold">98.2%</div>
          <div className="text-xs text-muted-foreground mt-1">Sample size: 45K</div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Experiments</h3>
        <div className="space-y-3">
          {mockExperiments.map((exp) => (
            <div 
              key={exp.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold">{exp.name}</h4>
                  <Badge variant={exp.status === 'running' ? 'default' : exp.status === 'completed' ? 'secondary' : 'outline'}>
                    {exp.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Primary Metric: {exp.metric} • {exp.variants.length} variants • Started {exp.startDate}
                </div>
              </div>
              <Button variant="outline" size="sm">View Results</Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Variant Performance</h3>
              <p className="text-sm text-muted-foreground">Product Page CTA Button Color</p>
            </div>
            <Trophy size={20} className="text-teal" />
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={variantPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="variant" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'rate') return [`${value}%`, 'Conversion Rate']
                  if (name === 'conversions') return [value, 'Conversions']
                  return [value, name]
                }}
              />
              <Legend />
              <Bar dataKey="rate" name="Conversion Rate (%)" radius={[8, 8, 0, 0]}>
                {variantPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--teal))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {variantPerformance.map((variant, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">{variant.variant}</div>
                <div className="text-xl font-bold mb-1">{variant.rate}%</div>
                <div className="text-xs">
                  {variant.conversions} / {variant.visitors.toLocaleString()}
                </div>
                {variant.uplift > 0 && (
                  <Badge variant="default" className="mt-2 bg-teal">
                    +{variant.uplift}% uplift
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Conversion Trend</h3>
            <p className="text-sm text-muted-foreground">Daily conversion rate by variant</p>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={timeSeriesComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `${value}%`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="control" 
                name="Control" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="variantA" 
                name="Variant A" 
                stroke="hsl(var(--teal))" 
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 p-4 bg-teal/10 rounded-lg border border-teal/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={18} className="text-teal" weight="fill" />
              <span className="font-semibold text-teal">Statistical Significance Reached</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Variant A shows a statistically significant improvement with 99.2% confidence (p-value: 0.008)
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Completed Tests</h3>
        <div className="space-y-4">
          {[
            { name: 'Homepage Hero Image', winner: 'Variant A (Product)', improvement: '+18%', metric: 'Click-through Rate' },
            { name: 'Pricing Page Layout', winner: 'Variant B (Table)', improvement: '+12%', metric: 'Conversion Rate' },
            { name: 'Product Card Design', winner: 'Control', improvement: '0%', metric: 'Add to Cart Rate' },
            { name: 'Email Subject Lines', winner: 'Variant C (Emoji)', improvement: '+25%', metric: 'Open Rate' },
          ].map((test, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex-1">
                <div className="font-semibold mb-1">{test.name}</div>
                <div className="text-sm text-muted-foreground">
                  Winner: {test.winner} • Metric: {test.metric}
                </div>
              </div>
              <div className="text-right">
                <Badge variant={test.improvement === '0%' ? 'outline' : 'default'} className={test.improvement !== '0%' ? 'bg-teal' : ''}>
                  {test.improvement}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
