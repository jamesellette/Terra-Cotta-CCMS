import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeviceMobile, Desktop, X, CheckCircle, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Session {
  id: string
  userId: string
  userEmail: string
  userName: string
  device: 'desktop' | 'mobile' | 'tablet'
  browser: string
  ipAddress: string
  location: string
  isActive: boolean
  isCurrent: boolean
  lastActivity: string
  createdAt: string
  expiresAt: string
}

const initialSessions: Session[] = [
  {
    id: '1',
    userId: '1',
    userEmail: 'admin@terracotta.io',
    userName: 'Sarah Anderson',
    device: 'desktop',
    browser: 'Chrome 120.0',
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    isActive: true,
    isCurrent: true,
    lastActivity: new Date().toISOString(),
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    userId: '1',
    userEmail: 'admin@terracotta.io',
    userName: 'Sarah Anderson',
    device: 'mobile',
    browser: 'Safari Mobile 17.2',
    ipAddress: '192.168.1.105',
    location: 'San Francisco, CA',
    isActive: true,
    isCurrent: false,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    userId: '2',
    userEmail: 'editor@terracotta.io',
    userName: 'Michael Chen',
    device: 'desktop',
    browser: 'Firefox 121.0',
    ipAddress: '10.0.0.45',
    location: 'New York, NY',
    isActive: true,
    isCurrent: false,
    lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    userId: '3',
    userEmail: 'developer@terracotta.io',
    userName: 'Emma Rodriguez',
    device: 'desktop',
    browser: 'Chrome 120.0',
    ipAddress: '172.16.0.20',
    location: 'Austin, TX',
    isActive: false,
    isCurrent: false,
    lastActivity: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    userId: '2',
    userEmail: 'editor@terracotta.io',
    userName: 'Michael Chen',
    device: 'tablet',
    browser: 'Safari 17.1',
    ipAddress: '10.0.0.48',
    location: 'New York, NY',
    isActive: true,
    isCurrent: false,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString()
  }
]

export function SessionsManagement() {
  const [sessions, setSessions] = useKV<Session[]>('auth-sessions', initialSessions)
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all')

  const filteredSessions = (sessions || []).filter((session) => {
    if (filter === 'active') return session.isActive
    if (filter === 'expired') return !session.isActive
    return true
  })

  const activeSessions = (sessions || []).filter(s => s.isActive).length
  const expiredSessions = (sessions || []).filter(s => !s.isActive).length

  const handleRevokeSession = (sessionId: string) => {
    setSessions((currentSessions) => {
      const updated = (currentSessions || []).map((session) =>
        session.id === sessionId ? { ...session, isActive: false } : session
      )
      toast.success('Session revoked successfully')
      return updated
    })
  }

  const handleRevokeAllSessions = () => {
    setSessions((currentSessions) => {
      const updated = (currentSessions || []).map((session) =>
        session.isCurrent ? session : { ...session, isActive: false }
      )
      toast.success('All other sessions have been revoked')
      return updated
    })
  }

  const getDeviceIcon = (device: Session['device']) => {
    switch (device) {
      case 'mobile':
        return <DeviceMobile size={20} weight="fill" className="text-primary" />
      case 'tablet':
        return <DeviceMobile size={20} weight="fill" className="text-primary" />
      default:
        return <Desktop size={20} weight="fill" className="text-primary" />
    }
  }

  const formatLastActivity = (lastActivity: string) => {
    const date = new Date(lastActivity)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const formatExpiry = (expiresAt: string) => {
    const date = new Date(expiresAt)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffMs < 0) return 'Expired'
    if (diffHours < 1) return 'Expires soon'
    if (diffHours < 24) return `${diffHours}h remaining`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d remaining`
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 cursor-pointer" onClick={() => setFilter('all')}>
            <div className="text-2xl font-bold">{(sessions || []).length}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </Card>
          <Card className="p-4 cursor-pointer" onClick={() => setFilter('active')}>
            <div className="text-2xl font-bold text-green-600">{activeSessions}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </Card>
          <Card className="p-4 cursor-pointer" onClick={() => setFilter('expired')}>
            <div className="text-2xl font-bold text-gray-600">{expiredSessions}</div>
            <div className="text-sm text-muted-foreground">Expired</div>
          </Card>
        </div>
        <Button
          variant="destructive"
          onClick={handleRevokeAllSessions}
          className="gap-2 self-start"
        >
          <X size={18} weight="bold" />
          Revoke All Sessions
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Device & Browser</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{session.userName}</div>
                    <div className="text-sm text-muted-foreground">{session.userEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(session.device)}
                    <div>
                      <div className="font-medium capitalize">{session.device}</div>
                      <div className="text-sm text-muted-foreground">{session.browser}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{session.ipAddress}</div>
                    <div className="text-sm text-muted-foreground">{session.location}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{formatLastActivity(session.lastActivity)}</div>
                    <div className="text-sm text-muted-foreground">{formatExpiry(session.expiresAt)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {session.isActive ? (
                      <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200 w-fit">
                        <CheckCircle size={14} weight="fill" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 bg-gray-50 text-gray-700 border-gray-200 w-fit">
                        <Clock size={14} />
                        Expired
                      </Badge>
                    )}
                    {session.isCurrent && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit">
                        Current
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {!session.isCurrent && session.isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                      className="gap-2"
                    >
                      <X size={16} />
                      Revoke
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
