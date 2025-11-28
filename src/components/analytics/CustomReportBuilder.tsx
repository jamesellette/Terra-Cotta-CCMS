import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { 
  Plus,
  FloppyDisk,
  Download,
  Table,
  ChartLine,
  Calendar
} from '@phosphor-icons/react'
import { useState } from 'react'

interface SavedReport {
  id: string
  name: string
  description: string
  metrics: string[]
  dimensions: string[]
  filters: string[]
  dateRange: string
  visualization: string
  schedule?: string
  lastRun: string
}

const mockSavedReports: SavedReport[] = [
  {
    id: '1',
    name: 'Weekly Revenue Report',
    description: 'Revenue breakdown by channel and product category',
    metrics: ['Revenue', 'Orders', 'AOV'],
    dimensions: ['Channel', 'Category'],
    filters: ['Country: US'],
    dateRange: 'Last 7 days',
    visualization: 'Bar Chart',
    schedule: 'Every Monday 9am',
    lastRun: '2 hours ago',
  },
  {
    id: '2',
    name: 'Customer Acquisition Analysis',
    description: 'New customer metrics and acquisition costs',
    metrics: ['New Customers', 'CAC', 'LTV'],
    dimensions: ['Source', 'Campaign'],
    filters: ['Status: New'],
    dateRange: 'Last 30 days',
    visualization: 'Line Chart',
    schedule: 'Daily 6am',
    lastRun: '8 hours ago',
  },
  {
    id: '3',
    name: 'Product Performance Dashboard',
    description: 'Top products by revenue and conversion',
    metrics: ['Revenue', 'Units Sold', 'Conversion Rate'],
    dimensions: ['Product', 'Category'],
    filters: [],
    dateRange: 'Last 90 days',
    visualization: 'Table',
    lastRun: '1 day ago',
  },
]

const availableMetrics = [
  'Revenue', 'Orders', 'Average Order Value', 'Conversion Rate',
  'Page Views', 'Sessions', 'Bounce Rate', 'Time on Site',
  'Cart Abandonment', 'Customer Lifetime Value', 'Cost per Acquisition',
  'Return on Ad Spend', 'Click-through Rate', 'Units Sold'
]

const availableDimensions = [
  'Date', 'Channel', 'Source', 'Campaign', 'Device Type',
  'Country', 'Region', 'City', 'Product', 'Category',
  'Customer Segment', 'Landing Page', 'Exit Page'
]

const exportFormats = [
  { value: 's3', label: 'Amazon S3', icon: '☁️' },
  { value: 'bigquery', label: 'Google BigQuery', icon: '📊' },
  { value: 'snowflake', label: 'Snowflake', icon: '❄️' },
  { value: 'csv', label: 'CSV Download', icon: '📄' },
  { value: 'excel', label: 'Excel Download', icon: '📈' },
  { value: 'pdf', label: 'PDF Report', icon: '📑' },
]

export function CustomReportBuilder() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    )
  }

  const toggleDimension = (dimension: string) => {
    setSelectedDimensions(prev => 
      prev.includes(dimension) 
        ? prev.filter(d => d !== dimension)
        : [...prev, dimension]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Custom Report Builder</h2>
          <p className="text-muted-foreground mt-1">Create and schedule custom analytics reports</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} weight="bold" />
              Build New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Build Custom Report</DialogTitle>
              <DialogDescription>
                Select metrics, dimensions, and export options for your report
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input id="report-name" placeholder="My Custom Report" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Input id="report-description" placeholder="Brief description of this report" />
              </div>

              <div className="space-y-3">
                <Label>Metrics</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-muted rounded-lg">
                  {availableMetrics.map((metric) => (
                    <div key={metric} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`metric-${metric}`}
                        checked={selectedMetrics.includes(metric)}
                        onCheckedChange={() => toggleMetric(metric)}
                      />
                      <label
                        htmlFor={`metric-${metric}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {metric}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedMetrics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedMetrics.map((metric) => (
                      <Badge key={metric} variant="secondary">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Dimensions (Group By)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-muted rounded-lg">
                  {availableDimensions.map((dimension) => (
                    <div key={dimension} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`dim-${dimension}`}
                        checked={selectedDimensions.includes(dimension)}
                        onCheckedChange={() => toggleDimension(dimension)}
                      />
                      <label
                        htmlFor={`dim-${dimension}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {dimension}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedDimensions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedDimensions.map((dimension) => (
                      <Badge key={dimension} variant="outline">
                        {dimension}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select defaultValue="30d">
                    <SelectTrigger id="date-range">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visualization">Visualization</Label>
                  <Select defaultValue="table">
                    <SelectTrigger id="visualization">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="table">Table</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule (Optional)</Label>
                <Select defaultValue="none">
                  <SelectTrigger id="schedule">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">One-time</SelectItem>
                    <SelectItem value="daily">Daily at 6am</SelectItem>
                    <SelectItem value="weekly">Weekly on Monday</SelectItem>
                    <SelectItem value="monthly">Monthly on 1st</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gap-2" onClick={() => setIsDialogOpen(false)}>
                <FloppyDisk size={18} weight="bold" />
                Save & Run Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Saved Reports</div>
          <div className="text-2xl font-bold">{mockSavedReports.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Across all users</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Scheduled Reports</div>
          <div className="text-2xl font-bold">2</div>
          <div className="text-xs text-teal mt-1">Running automatically</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Exports This Month</div>
          <div className="text-2xl font-bold">47</div>
          <div className="text-xs text-muted-foreground mt-1">To various destinations</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Saved Reports</h3>
          <p className="text-sm text-muted-foreground">Your custom analytics reports</p>
        </div>

        <div className="space-y-4">
          {mockSavedReports.map((report) => (
            <div key={report.id} className="p-5 border rounded-lg hover:border-primary transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-lg">{report.name}</h4>
                    {report.schedule && (
                      <Badge variant="default" className="bg-teal">
                        <Calendar size={14} className="mr-1" />
                        Scheduled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <ChartLine size={14} />
                      {report.visualization}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      • {report.dateRange}
                    </div>
                    {report.schedule && (
                      <div className="text-xs text-muted-foreground">
                        • {report.schedule}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Metrics:</span>
                      {report.metrics.map((metric, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">Dimensions:</span>
                      {report.dimensions.map((dimension, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {dimension}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Last run: {report.lastRun}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Table size={16} />
                    View
                  </Button>
                  <Button size="sm" variant="default" className="gap-2">
                    <Download size={16} />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Export Destinations</h3>
          <p className="text-sm text-muted-foreground">Configure data warehouse integrations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {exportFormats.map((format) => (
            <div 
              key={format.value}
              className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">{format.icon}</div>
                <div className="font-semibold">{format.label}</div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-2">
                Configure
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
