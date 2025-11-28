import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from 'recharts'
import { 
  Warning, 
  TrendUp, 
  TrendDown, 
  CheckCircle,
  Sparkle
} from '@phosphor-icons/react'

interface Anomaly {
  id: string
  metric: string
  type: 'spike' | 'drop' | 'unusual_pattern'
  severity: 'critical' | 'warning' | 'info'
  detectedAt: string
  value: number
  expected: number
  deviation: number
  description: string
  status: 'investigating' | 'resolved' | 'false_positive'
}

const mockAnomalies: Anomaly[] = [
  {
    id: '1',
    metric: 'Conversion Rate',
    type: 'drop',
    severity: 'critical',
    detectedAt: '2024-01-20 14:23',
    value: 2.1,
    expected: 8.5,
    deviation: -75,
    description: 'Conversion rate dropped 75% below expected range. Checkout page may be experiencing issues.',
    status: 'investigating',
  },
  {
    id: '2',
    metric: 'Page Load Time',
    type: 'spike',
    severity: 'warning',
    detectedAt: '2024-01-20 12:15',
    value: 4.2,
    expected: 1.8,
    deviation: 133,
    description: 'Average page load time increased by 133%. Server performance degradation detected.',
    status: 'investigating',
  },
  {
    id: '3',
    metric: 'Cart Abandonment',
    type: 'spike',
    severity: 'warning',
    detectedAt: '2024-01-20 09:45',
    value: 82,
    expected: 68,
    deviation: 21,
    description: 'Cart abandonment rate 21% higher than normal. Payment gateway issues suspected.',
    status: 'resolved',
  },
  {
    id: '4',
    metric: 'Mobile Traffic',
    type: 'unusual_pattern',
    severity: 'info',
    detectedAt: '2024-01-20 08:00',
    value: 65,
    expected: 52,
    deviation: 25,
    description: 'Unusual surge in mobile traffic. Possible viral content or external referral spike.',
    status: 'false_positive',
  },
]

const timeSeriesWithAnomaly = [
  { time: '00:00', value: 8.4, expected: 8.5 },
  { time: '02:00', value: 8.6, expected: 8.5 },
  { time: '04:00', value: 8.3, expected: 8.5 },
  { time: '06:00', value: 8.7, expected: 8.5 },
  { time: '08:00', value: 8.5, expected: 8.5 },
  { time: '10:00', value: 8.4, expected: 8.5 },
  { time: '12:00', value: 8.6, expected: 8.5 },
  { time: '14:00', value: 2.1, expected: 8.5, isAnomaly: true },
  { time: '16:00', value: 2.3, expected: 8.5, isAnomaly: true },
  { time: '18:00', value: 7.8, expected: 8.5 },
  { time: '20:00', value: 8.4, expected: 8.5 },
  { time: '22:00', value: 8.6, expected: 8.5 },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-destructive text-destructive-foreground'
    case 'warning':
      return 'bg-accent text-accent-foreground'
    case 'info':
      return 'bg-teal text-teal-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'investigating':
      return <Badge variant="outline" className="border-accent text-accent">Investigating</Badge>
    case 'resolved':
      return <Badge variant="outline" className="border-teal text-teal">Resolved</Badge>
    case 'false_positive':
      return <Badge variant="outline">False Positive</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function AnomalyDetection() {
  const criticalCount = mockAnomalies.filter(a => a.severity === 'critical' && a.status === 'investigating').length
  const warningCount = mockAnomalies.filter(a => a.severity === 'warning' && a.status === 'investigating').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkle size={28} weight="fill" className="text-primary" />
            AI-Powered Anomaly Detection
          </h2>
          <p className="text-muted-foreground mt-1">Automatically detect and alert on unusual patterns</p>
        </div>
        <Button variant="outline" size="sm">Configure Alerts</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-destructive">
          <div className="text-sm text-muted-foreground mb-1">Critical Alerts</div>
          <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Require immediate action</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-accent">
          <div className="text-sm text-muted-foreground mb-1">Warnings</div>
          <div className="text-2xl font-bold text-accent">{warningCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Should be investigated</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Resolved Today</div>
          <div className="text-2xl font-bold">3</div>
          <div className="text-xs text-teal mt-1">Avg. resolution: 45min</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Detection Accuracy</div>
          <div className="text-2xl font-bold">94.2%</div>
          <div className="text-xs text-muted-foreground mt-1">ML model confidence</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Active Anomalies</h3>
            <p className="text-sm text-muted-foreground">Detected issues requiring attention</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockAnomalies.map((anomaly) => (
            <div 
              key={anomaly.id}
              className="p-4 border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${getSeverityColor(anomaly.severity)} flex items-center justify-center flex-shrink-0`}>
                    {anomaly.type === 'drop' && <TrendDown size={20} weight="bold" />}
                    {anomaly.type === 'spike' && <TrendUp size={20} weight="bold" />}
                    {anomaly.type === 'unusual_pattern' && <Warning size={20} weight="bold" />}
                  </div>
                  <div>
                    <div className="font-semibold mb-1">{anomaly.metric}</div>
                    <div className="text-sm text-muted-foreground">
                      Detected at {anomaly.detectedAt}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(anomaly.status)}
                  <Badge variant={anomaly.deviation < 0 ? 'default' : 'outline'} className={anomaly.deviation < 0 ? 'bg-destructive' : 'bg-accent'}>
                    {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}%
                  </Badge>
                </div>
              </div>

              <p className="text-sm mb-3">{anomaly.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current: </span>
                    <span className="font-semibold">{anomaly.value}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expected: </span>
                    <span className="font-semibold">{anomaly.expected}</span>
                  </div>
                </div>
                {anomaly.status === 'investigating' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Mark False Positive</Button>
                    <Button size="sm" variant="default">Investigate</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Conversion Rate - Real-time Monitoring</h3>
          <p className="text-sm text-muted-foreground">AI-detected anomaly in red zone</p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={timeSeriesWithAnomaly}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 10]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'value') return [`${value}%`, 'Actual']
                if (name === 'expected') return [`${value}%`, 'Expected']
                return [value, name]
              }}
            />
            <ReferenceLine y={8.5} stroke="hsl(var(--teal))" strokeDasharray="3 3" label="Expected" />
            <ReferenceArea x1="14:00" x2="16:00" fill="hsl(var(--destructive))" fillOpacity={0.1} />
            <Line 
              type="monotone" 
              dataKey="expected" 
              stroke="hsl(var(--teal))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={(props: any) => {
                if (props.payload.isAnomaly) {
                  return (
                    <circle 
                      cx={props.cx} 
                      cy={props.cy} 
                      r={6} 
                      fill="hsl(var(--destructive))"
                      stroke="white"
                      strokeWidth={2}
                    />
                  )
                }
                return <circle cx={props.cx} cy={props.cy} r={3} fill="hsl(var(--primary))" />
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">ML Model Insights</h3>
            <p className="text-sm text-muted-foreground">How our AI detects anomalies</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} weight="fill" className="text-teal" />
                <span className="font-semibold">Statistical Analysis</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Uses standard deviation and z-score to identify outliers beyond 3σ threshold
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} weight="fill" className="text-teal" />
                <span className="font-semibold">Time Series Forecasting</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ARIMA models predict expected values based on historical patterns and seasonality
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} weight="fill" className="text-teal" />
                <span className="font-semibold">Pattern Recognition</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Deep learning identifies unusual patterns that don't match historical behavior
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Historical Anomalies</h3>
            <p className="text-sm text-muted-foreground">Past 30 days summary</p>
          </div>

          <div className="space-y-3">
            {[
              { date: 'Jan 15', metric: 'Revenue', type: 'spike', deviation: '+45%', resolved: true },
              { date: 'Jan 12', metric: 'Bounce Rate', type: 'spike', deviation: '+32%', resolved: true },
              { date: 'Jan 08', metric: 'API Response Time', type: 'spike', deviation: '+120%', resolved: true },
              { date: 'Jan 05', metric: 'Mobile Conversions', type: 'drop', deviation: '-38%', resolved: true },
              { date: 'Jan 02', metric: 'Email Open Rate', type: 'drop', deviation: '-25%', resolved: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <div className="font-medium mb-1">{item.metric}</div>
                  <div className="text-sm text-muted-foreground">{item.date} • {item.deviation}</div>
                </div>
                <Badge variant={item.resolved ? 'outline' : 'default'} className={item.resolved ? 'border-teal text-teal' : ''}>
                  {item.resolved ? 'Resolved' : 'Open'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
