import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { ArrowDown, TrendUp } from '@phosphor-icons/react'

const funnelData = [
  { stage: 'Product View', visitors: 15000, conversion: 100, dropOff: 0 },
  { stage: 'Add to Cart', visitors: 6750, conversion: 45, dropOff: 55 },
  { stage: 'Checkout Start', visitors: 4050, conversion: 27, dropOff: 18 },
  { stage: 'Shipping Info', visitors: 2835, conversion: 18.9, dropOff: 8.1 },
  { stage: 'Payment Info', visitors: 2268, conversion: 15.1, dropOff: 3.8 },
  { stage: 'Purchase', visitors: 1800, conversion: 12, dropOff: 3.1 },
]

const timeSeriesData = [
  { date: 'Mon', visitors: 2400, conversions: 288, rate: 12 },
  { date: 'Tue', visitors: 2600, conversions: 312, rate: 12 },
  { date: 'Wed', visitors: 2800, conversions: 336, rate: 12 },
  { date: 'Thu', visitors: 2200, conversions: 242, rate: 11 },
  { date: 'Fri', visitors: 2900, conversions: 377, rate: 13 },
  { date: 'Sat', visitors: 3100, conversions: 372, rate: 12 },
  { date: 'Sun', visitors: 2900, conversions: 348, rate: 12 },
]

const cohortData = [
  { month: 'Jan', week1: 100, week2: 45, week3: 32, week4: 28 },
  { month: 'Feb', week1: 100, week2: 48, week3: 35, week4: 30 },
  { month: 'Mar', week1: 100, week2: 52, week3: 38, week4: 32 },
  { month: 'Apr', week1: 100, week2: 50, week3: 36, week4: 31 },
  { month: 'May', week1: 100, week2: 54, week3: 40, week4: 35 },
  { month: 'Jun', week1: 100, week2: 56, week3: 42, week4: 37 },
]

export function FunnelAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Funnel & Cohort Analysis</h2>
        <p className="text-muted-foreground mt-1">Conversion optimization and retention metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Overall Conversion</div>
          <div className="text-2xl font-bold">12.0%</div>
          <div className="text-xs text-teal mt-1 flex items-center gap-1">
            <TrendUp size={12} weight="bold" />
            +1.2% vs last period
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Biggest Drop-off</div>
          <div className="text-2xl font-bold">Product → Cart</div>
          <div className="text-xs text-destructive mt-1 flex items-center gap-1">
            <ArrowDown size={12} weight="bold" />
            55% exit rate
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Avg. Time to Convert</div>
          <div className="text-2xl font-bold">18m 32s</div>
          <div className="text-xs text-teal mt-1">-3m vs last week</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Cart Abandonment</div>
          <div className="text-2xl font-bold">73.3%</div>
          <div className="text-xs text-destructive mt-1">+2% vs last week</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Conversion Funnel</h3>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
          <Button variant="outline" size="sm">Export Data</Button>
        </div>

        <div className="space-y-1">
          {funnelData.map((stage, index) => {
            const widthPercent = stage.conversion
            const isLastStage = index === funnelData.length - 1
            
            return (
              <div key={index} className="relative">
                <div 
                  className="relative bg-gradient-to-r from-primary to-teal text-primary-foreground p-6 rounded-lg transition-all hover:shadow-md"
                  style={{ width: `${widthPercent}%`, minWidth: '300px' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg mb-1">{stage.stage}</div>
                      <div className="text-sm opacity-90">
                        {stage.visitors.toLocaleString()} visitors
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{stage.conversion}%</div>
                      {!isLastStage && (
                        <Badge variant="secondary" className="mt-1">
                          -{stage.dropOff}% drop
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Conversion Trend</h3>
          <p className="text-sm text-muted-foreground">Daily conversion rates and volume</p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--teal))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--teal))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="visitors" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="conversions" 
              stroke="hsl(var(--teal))" 
              fillOpacity={1} 
              fill="url(#colorConversions)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Cohort Retention Analysis</h3>
          <p className="text-sm text-muted-foreground">User retention by signup cohort (weekly retention %)</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Cohort</th>
                <th className="text-center py-3 px-4 font-semibold">Week 1</th>
                <th className="text-center py-3 px-4 font-semibold">Week 2</th>
                <th className="text-center py-3 px-4 font-semibold">Week 3</th>
                <th className="text-center py-3 px-4 font-semibold">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((cohort, index) => (
                <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium">{cohort.month}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <div 
                        className="w-full h-10 rounded flex items-center justify-center font-medium"
                        style={{ 
                          backgroundColor: `hsl(var(--teal) / ${cohort.week1 / 100})`,
                          color: cohort.week1 > 50 ? 'white' : 'hsl(var(--foreground))'
                        }}
                      >
                        {cohort.week1}%
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <div 
                        className="w-full h-10 rounded flex items-center justify-center font-medium"
                        style={{ 
                          backgroundColor: `hsl(var(--teal) / ${cohort.week2 / 100})`,
                          color: cohort.week2 > 50 ? 'white' : 'hsl(var(--foreground))'
                        }}
                      >
                        {cohort.week2}%
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <div 
                        className="w-full h-10 rounded flex items-center justify-center font-medium"
                        style={{ 
                          backgroundColor: `hsl(var(--teal) / ${cohort.week3 / 100})`,
                          color: cohort.week3 > 50 ? 'white' : 'hsl(var(--foreground))'
                        }}
                      >
                        {cohort.week3}%
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <div 
                        className="w-full h-10 rounded flex items-center justify-center font-medium"
                        style={{ 
                          backgroundColor: `hsl(var(--teal) / ${cohort.week4 / 100})`,
                          color: cohort.week4 > 50 ? 'white' : 'hsl(var(--foreground))'
                        }}
                      >
                        {cohort.week4}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--teal))' }} />
            <span className="text-muted-foreground">High retention (100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--teal) / 0.5)' }} />
            <span className="text-muted-foreground">Medium retention (50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--teal) / 0.2)' }} />
            <span className="text-muted-foreground">Low retention (20%)</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
