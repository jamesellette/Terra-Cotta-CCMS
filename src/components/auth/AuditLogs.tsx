import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MagnifyingGlass, FileText, User, ShoppingCart, Tag, Key, Shield } from '@phosphor-icons/react'

interface AuditLog {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  resourceType: 'user' | 'role' | 'content' | 'product' | 'order' | 'session' | 'api_key' | 'settings'
  resourceId?: string
  resourceName?: string
  changes?: Record<string, { old: any; new: any }>
  ipAddress: string
  userAgent: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  createdAt: string
}

const initialLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Sarah Anderson',
    userEmail: 'admin@terracotta.io',
    action: 'user.created',
    resourceType: 'user',
    resourceId: '4',
    resourceName: 'James Wilson',
    changes: {
      email: { old: null, new: 'viewer@terracotta.io' },
      role: { old: null, new: 'Viewer' }
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0',
    severity: 'info',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    userId: '2',
    userName: 'Michael Chen',
    userEmail: 'editor@terracotta.io',
    action: 'content.published',
    resourceType: 'content',
    resourceId: '123',
    resourceName: 'Summer Campaign Landing Page',
    ipAddress: '10.0.0.45',
    userAgent: 'Firefox 121.0',
    severity: 'info',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    userId: '1',
    userName: 'Sarah Anderson',
    userEmail: 'admin@terracotta.io',
    action: 'role.permissions_updated',
    resourceType: 'role',
    resourceId: '2',
    resourceName: 'Content Editor',
    changes: {
      permissions: {
        old: ['content.view', 'content.create'],
        new: ['content.view', 'content.create', 'content.publish']
      }
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0',
    severity: 'warning',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    userId: '3',
    userName: 'Emma Rodriguez',
    userEmail: 'developer@terracotta.io',
    action: 'api_key.created',
    resourceType: 'api_key',
    resourceId: 'key_123',
    resourceName: 'Production API Key',
    ipAddress: '172.16.0.20',
    userAgent: 'Chrome 120.0',
    severity: 'warning',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    userId: '1',
    userName: 'Sarah Anderson',
    userEmail: 'admin@terracotta.io',
    action: 'session.revoked',
    resourceType: 'session',
    resourceId: 'sess_456',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0',
    severity: 'warning',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    userId: '1',
    userName: 'Sarah Anderson',
    userEmail: 'admin@terracotta.io',
    action: 'settings.updated',
    resourceType: 'settings',
    resourceName: 'Password Policy',
    changes: {
      minLength: { old: 8, new: 12 },
      requireSpecialChar: { old: false, new: true }
    },
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0',
    severity: 'warning',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '7',
    userId: '2',
    userName: 'Michael Chen',
    userEmail: 'editor@terracotta.io',
    action: 'order.status_changed',
    resourceType: 'order',
    resourceId: 'order_789',
    resourceName: 'Order #789',
    changes: {
      status: { old: 'pending', new: 'shipped' }
    },
    ipAddress: '10.0.0.45',
    userAgent: 'Firefox 121.0',
    severity: 'info',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    userId: '2',
    userName: 'Michael Chen',
    userEmail: 'editor@terracotta.io',
    action: 'product.price_updated',
    resourceType: 'product',
    resourceId: 'prod_456',
    resourceName: 'Premium Widget',
    changes: {
      price: { old: 99.99, new: 89.99 }
    },
    ipAddress: '10.0.0.45',
    userAgent: 'Firefox 121.0',
    severity: 'info',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  }
]

export function AuditLogs() {
  const [logs] = useKV<AuditLog[]>('auth-audit-logs', initialLogs)
  const [searchQuery, setSearchQuery] = useState('')
  const [resourceFilter, setResourceFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')

  const filteredLogs = (logs || []).filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ''

    const matchesResource = resourceFilter === 'all' || log.resourceType === resourceFilter
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter

    return matchesSearch && matchesResource && matchesSeverity
  })

  const getResourceIcon = (resourceType: AuditLog['resourceType']) => {
    switch (resourceType) {
      case 'user':
        return <User size={16} weight="fill" className="text-primary" />
      case 'role':
        return <Shield size={16} weight="fill" className="text-primary" />
      case 'content':
        return <FileText size={16} weight="fill" className="text-primary" />
      case 'product':
      case 'order':
        return <ShoppingCart size={16} weight="fill" className="text-primary" />
      case 'api_key':
      case 'session':
        return <Key size={16} weight="fill" className="text-primary" />
      default:
        return <Tag size={16} weight="fill" className="text-primary" />
    }
  }

  const getSeverityColor = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'error':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const formatAction = (action: string) => {
    return action
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search audit logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={resourceFilter} onValueChange={setResourceFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Resources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="role">Roles</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="product">Products</SelectItem>
            <SelectItem value="order">Orders</SelectItem>
            <SelectItem value="session">Sessions</SelectItem>
            <SelectItem value="api_key">API Keys</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {formatTime(log.createdAt)}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{log.userName}</div>
                    <div className="text-sm text-muted-foreground">{log.userEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatAction(log.action)}</div>
                  {log.changes && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {Object.entries(log.changes).map(([key, value]) => (
                        <div key={key}>
                          {key}: {JSON.stringify(value.old)} → {JSON.stringify(value.new)}
                        </div>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getResourceIcon(log.resourceType)}
                    <div>
                      <div className="font-medium capitalize">{log.resourceType}</div>
                      {log.resourceName && (
                        <div className="text-sm text-muted-foreground">{log.resourceName}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium font-mono text-sm">{log.ipAddress}</div>
                    <div className="text-xs text-muted-foreground">{log.userAgent}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getSeverityColor(log.severity)}>
                    {log.severity}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredLogs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No audit logs found matching your filters
        </div>
      )}
    </div>
  )
}
