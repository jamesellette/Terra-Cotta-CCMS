import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { ShareNetwork, TrendUp, CurrencyDollar } from '@phosphor-icons/react'

const channelAttribution = [
  { channel: 'Organic Search', firstTouch: 35, lastTouch: 28, linear: 31, timeDecay: 30, positionBased: 32 },
  { channel: 'Paid Search', firstTouch: 25, lastTouch: 32, linear: 28, timeDecay: 29, positionBased: 28 },
  { channel: 'Email', firstTouch: 15, lastTouch: 18, linear: 16, timeDecay: 17, positionBased: 16 },
  { channel: 'Social Media', firstTouch: 20, lastTouch: 12, linear: 16, timeDecay: 15, positionBased: 16 },
  { channel: 'Direct', firstTouch: 5, lastTouch: 10, linear: 9, timeDecay: 9, positionBased: 8 },
]

const conversionPathData = [
  { path: 'Organic → Email → Paid Search', conversions: 1250, value: 68750, avgValue: 55 },
  { path: 'Social → Organic → Direct', conversions: 980, value: 52920, avgValue: 54 },
  { path: 'Paid Search → Email → Direct', conversions: 850, value: 48875, avgValue: 57.5 },
  { path: 'Organic → Social → Email', conversions: 720, value: 39600, avgValue: 55 },
  { path: 'Email → Paid Search → Direct', conversions: 650, value: 35750, avgValue: 55 },
]

const touchpointData = [
  { position: '1st Touch', value: 35, color: 'hsl(var(--primary))' },
  { position: '2nd Touch', value: 25, color: 'hsl(var(--teal))' },
  { position: '3rd Touch', value: 20, color: 'hsl(var(--accent))' },
  { position: '4th Touch', value: 12, color: 'hsl(var(--slate))' },
  { position: 'Final Touch', value: 8, color: 'hsl(var(--muted-foreground))' },
]

const roiByChannel = [
  { channel: 'Email', spend: 5000, revenue: 45000, roi: 900, roas: 9.0 },
  { channel: 'Organic Search', spend: 8000, revenue: 68000, roi: 850, roas: 8.5 },
  { channel: 'Paid Search', spend: 25000, revenue: 125000, roi: 500, roas: 5.0 },
  { channel: 'Social Media', spend: 12000, revenue: 48000, roi: 400, roas: 4.0 },
  { channel: 'Display Ads', spend: 15000, revenue: 37500, roi: 250, roas: 2.5 },
]

export function AttributionModeling() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Attribution Modeling</h2>
        <p className="text-muted-foreground mt-1">Multi-touch attribution and marketing ROI analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Avg. Touchpoints</div>
          <div className="text-2xl font-bold">3.7</div>
          <div className="text-xs text-teal mt-1">Before conversion</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Top Channel</div>
          <div className="text-2xl font-bold">Organic</div>
          <div className="text-xs text-muted-foreground mt-1">32% attribution</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Overall ROAS</div>
          <div className="text-2xl font-bold">5.2x</div>
          <div className="text-xs text-teal mt-1 flex items-center gap-1">
            <TrendUp size={12} weight="bold" />
            +0.8x vs last month
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Marketing Spend</div>
          <div className="text-2xl font-bold">$65K</div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Attribution Model Comparison</h3>
          <p className="text-sm text-muted-foreground">How different models distribute credit across channels</p>
        </div>

        <Tabs defaultValue="linear" className="space-y-6">
          <TabsList>
            <TabsTrigger value="linear">Linear</TabsTrigger>
            <TabsTrigger value="firstTouch">First Touch</TabsTrigger>
            <TabsTrigger value="lastTouch">Last Touch</TabsTrigger>
            <TabsTrigger value="timeDecay">Time Decay</TabsTrigger>
            <TabsTrigger value="positionBased">Position Based</TabsTrigger>
          </TabsList>

          <TabsContent value="linear" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Linear Attribution:</strong> Equal credit to all touchpoints in the conversion path.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelAttribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Bar dataKey="linear" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="firstTouch" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>First Touch Attribution:</strong> 100% credit to the first interaction that introduced the customer.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelAttribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Bar dataKey="firstTouch" fill="hsl(var(--teal))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="lastTouch" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Last Touch Attribution:</strong> 100% credit to the final interaction before conversion.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelAttribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Bar dataKey="lastTouch" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="timeDecay" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Time Decay Attribution:</strong> More credit to touchpoints closer to conversion, with exponential decay.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelAttribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Bar dataKey="timeDecay" fill="hsl(var(--slate))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="positionBased" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Position Based Attribution:</strong> 40% to first, 40% to last, 20% distributed among middle touchpoints.
              </p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelAttribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Bar dataKey="positionBased" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Touchpoint Distribution</h3>
              <p className="text-sm text-muted-foreground">Credit by position in journey</p>
            </div>
            <ShareNetwork size={20} className="text-primary" />
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={touchpointData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ position, value }) => `${position}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {touchpointData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">ROI by Channel</h3>
              <p className="text-sm text-muted-foreground">Return on advertising spend</p>
            </div>
            <CurrencyDollar size={20} className="text-teal" />
          </div>

          <div className="space-y-3">
            {roiByChannel.map((channel, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{channel.channel}</span>
                  <Badge variant="default" className="bg-teal">
                    {channel.roas}x ROAS
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Spend</div>
                    <div className="font-medium">${channel.spend.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Revenue</div>
                    <div className="font-medium">${channel.revenue.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Top Conversion Paths</h3>
            <p className="text-sm text-muted-foreground">Most common multi-touch journeys</p>
          </div>
          <Button variant="outline" size="sm">Export Paths</Button>
        </div>

        <div className="space-y-3">
          {conversionPathData.map((path, index) => (
            <div key={index} className="p-4 border rounded-lg hover:border-primary transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium font-mono text-sm">{path.path}</div>
                <Badge variant="outline">{path.conversions} conversions</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Value</div>
                  <div className="font-semibold text-teal">${path.value.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg. Value</div>
                  <div className="font-medium">${path.avgValue}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Contribution</div>
                  <div className="font-medium">{((path.conversions / 4450) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
