import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ChartLine,
  TrendUp,
  Users,
  ShoppingCart,
  Eye
} from '@phosphor-icons/react'
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  AreaChart, 
  Area,
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
import { useState } from 'react'
import { RealtimeDashboard } from './analytics/RealtimeDashboard'
import { CustomerJourney } from './analytics/CustomerJourney'
import { FunnelAnalysis } from './analytics/FunnelAnalysis'
import { AttributionModeling } from './analytics/AttributionModeling'
import { ABTesting } from './analytics/ABTesting'
import { AnomalyDetection } from './analytics/AnomalyDetection'
import { AudienceSegmentation } from './analytics/AudienceSegmentation'
import { CustomReportBuilder } from './analytics/CustomReportBuilder'

const pageViewsData = [
  { date: 'Jan', views: 4200, users: 1200 },
  { date: 'Feb', views: 5100, users: 1500 },
  { date: 'Mar', views: 4800, users: 1400 },
  { date: 'Apr', views: 6300, users: 1900 },
  { date: 'May', views: 7200, users: 2200 },
  { date: 'Jun', views: 6800, users: 2000 },
]

const revenueData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 15600 },
  { month: 'Mar', revenue: 14200 },
  { month: 'Apr', revenue: 18900 },
  { month: 'May', revenue: 21300 },
  { month: 'Jun', revenue: 19800 },
]

const categoryData = [
  { name: 'Electronics', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Clothing', value: 25, color: 'hsl(var(--teal))' },
  { name: 'Home & Garden', value: 20, color: 'hsl(var(--accent))' },
  { name: 'Books', value: 12, color: 'hsl(var(--slate))' },
  { name: 'Other', value: 8, color: 'hsl(var(--muted-foreground))' },
]

const conversionData = [
  { page: 'Homepage', views: 12500, conversions: 450 },
  { page: 'Product Pages', views: 8900, conversions: 890 },
  { page: 'Blog', views: 6200, conversions: 180 },
  { page: 'Category Pages', views: 5400, conversions: 320 },
  { page: 'Landing Pages', views: 4100, conversions: 410 },
]

export function Analytics() {
  const [dateRange, setDateRange] = useState('6m')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights and performance metrics</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="realtime" className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-9 gap-1">
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="abtesting">A/B Tests</TabsTrigger>
          <TabsTrigger value="anomaly">Anomaly</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          <RealtimeDashboard />
        </TabsContent>

        <TabsContent value="journey" className="space-y-6">
          <CustomerJourney />
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <FunnelAnalysis />
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <AttributionModeling />
        </TabsContent>

        <TabsContent value="abtesting" className="space-y-6">
          <ABTesting />
        </TabsContent>

        <TabsContent value="anomaly" className="space-y-6">
          <AnomalyDetection />
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <AudienceSegmentation />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <CustomReportBuilder />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Page Views & Users</h3>
                  <p className="text-sm text-muted-foreground">Traffic trends over time</p>
                </div>
                <Eye size={20} className="text-primary" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={pageViewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--teal))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--teal))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                  <Area type="monotone" dataKey="users" stroke="hsl(var(--teal))" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Revenue</h3>
                  <p className="text-sm text-muted-foreground">Monthly revenue trends</p>
                </div>
                <TrendUp size={20} className="text-teal" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--teal))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Sales by Category</h3>
                  <p className="text-sm text-muted-foreground">Distribution across categories</p>
                </div>
                <ChartLine size={20} className="text-accent" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Top Performing Pages</h3>
                  <p className="text-sm text-muted-foreground">Conversion performance</p>
                </div>
                <Users size={20} className="text-slate" />
              </div>
              <div className="space-y-4">
                {conversionData.map((item, index) => {
                  const conversionRate = ((item.conversions / item.views) * 100).toFixed(1)
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.page}</span>
                        <span className="text-muted-foreground">{conversionRate}% conversion</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${conversionRate}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.views.toLocaleString()} views</span>
                        <span>{item.conversions} conversions</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Content Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={pageViewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={3} name="Page Views" />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--teal))" strokeWidth={3} name="Unique Users" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="commerce" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Revenue Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--teal))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--teal))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--teal))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
