import { StatCard } from '@/components/StatCard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Article, ShoppingCart, Users, Eye, Plus, TrendUp } from '@phosphor-icons/react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const recentActivity = [
  { id: 1, action: 'New article published', user: 'Sarah Chen', time: '5 minutes ago', type: 'content' },
  { id: 2, action: 'Order #2847 processed', user: 'System', time: '12 minutes ago', type: 'order' },
  { id: 3, action: 'Product updated', user: 'Mike Johnson', time: '23 minutes ago', type: 'product' },
  { id: 4, action: 'New user registered', user: 'Emma Wilson', time: '1 hour ago', type: 'user' },
  { id: 5, action: 'Content reviewed', user: 'David Park', time: '2 hours ago', type: 'content' },
]

const chartData = [
  { date: 'Mon', views: 2400, orders: 140 },
  { date: 'Tue', views: 3200, orders: 180 },
  { date: 'Wed', views: 2800, orders: 160 },
  { date: 'Thu', views: 3800, orders: 220 },
  { date: 'Fri', views: 4200, orders: 250 },
  { date: 'Sat', views: 3600, orders: 190 },
  { date: 'Sun', views: 3100, orders: 170 },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} weight="bold" />
          Quick Create
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Content"
          value={1247}
          change={12}
          trend="up"
          icon={<Article size={48} weight="duotone" />}
          delay={0}
        />
        <StatCard
          label="Total Orders"
          value={892}
          change={8}
          trend="up"
          icon={<ShoppingCart size={48} weight="duotone" />}
          delay={0.1}
        />
        <StatCard
          label="Active Users"
          value={3456}
          change={-3}
          trend="down"
          icon={<Users size={48} weight="duotone" />}
          delay={0.2}
        />
        <StatCard
          label="Page Views"
          value={28941}
          change={15}
          trend="up"
          icon={<Eye size={48} weight="duotone" />}
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Page Views</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            <TrendUp size={20} className="text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
              <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            <ShoppingCart size={20} className="text-teal" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
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
              <Line type="monotone" dataKey="orders" stroke="hsl(var(--teal))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'content' ? 'bg-primary' :
                activity.type === 'order' ? 'bg-teal' :
                activity.type === 'product' ? 'bg-accent' :
                'bg-slate'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.user}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
