import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, MagnifyingGlass, PencilSimple, Trash, ShieldCheck, EnvelopeSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  status: 'active' | 'inactive' | 'suspended'
  emailVerified: boolean
  mfaEnabled: boolean
  roles: string[]
  lastLogin?: string
  createdAt: string
}

const initialUsers: User[] = [
  {
    id: '1',
    email: 'admin@terracotta.io',
    firstName: 'Sarah',
    lastName: 'Anderson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'active',
    emailVerified: true,
    mfaEnabled: true,
    roles: ['Admin', 'Content Editor'],
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2023-01-15').toISOString()
  },
  {
    id: '2',
    email: 'editor@terracotta.io',
    firstName: 'Michael',
    lastName: 'Chen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    status: 'active',
    emailVerified: true,
    mfaEnabled: false,
    roles: ['Content Editor'],
    lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2023-03-22').toISOString()
  },
  {
    id: '3',
    email: 'developer@terracotta.io',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    status: 'active',
    emailVerified: true,
    mfaEnabled: true,
    roles: ['Developer'],
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2023-05-10').toISOString()
  },
  {
    id: '4',
    email: 'viewer@terracotta.io',
    firstName: 'James',
    lastName: 'Wilson',
    status: 'inactive',
    emailVerified: false,
    mfaEnabled: false,
    roles: ['Viewer'],
    createdAt: new Date('2024-01-08').toISOString()
  }
]

export function UsersManagement() {
  const [users, setUsers] = useKV<User[]>('auth-users', initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    status: 'active' as User['status'],
    mfaEnabled: false,
    roles: [] as string[]
  })

  const filteredUsers = (users || []).filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      status: 'active',
      mfaEnabled: false,
      roles: []
    })
    setDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      mfaEnabled: user.mfaEnabled,
      roles: user.roles
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields')
      return
    }

    setUsers((currentUsers) => {
      const updated = [...(currentUsers || [])]
      if (editingUser) {
        const index = updated.findIndex(u => u.id === editingUser.id)
        if (index !== -1) {
          updated[index] = { ...updated[index], ...formData }
        }
        toast.success('User updated successfully')
      } else {
        const newUser: User = {
          id: crypto.randomUUID(),
          ...formData,
          emailVerified: false,
          createdAt: new Date().toISOString()
        }
        updated.push(newUser)
        toast.success('User created successfully')
      }
      return updated
    })

    setDialogOpen(false)
  }

  const handleDelete = (userId: string) => {
    setUsers((currentUsers) => {
      const updated = (currentUsers || []).filter(u => u.id !== userId)
      toast.success('User deleted successfully')
      return updated
    })
  }

  const handleResendInvite = (user: User) => {
    toast.success(`Invitation email sent to ${user.email}`)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-700 border-red-200'
    }
  }

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'Never'
    const date = new Date(lastLogin)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} weight="bold" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                    >
                      <PencilSimple size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash size={18} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge variant="outline" className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                  
                  {user.mfaEnabled && (
                    <div className="flex items-center gap-1 text-teal">
                      <ShieldCheck size={16} weight="fill" />
                      <span>2FA Enabled</span>
                    </div>
                  )}
                  
                  {!user.emailVerified && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-primary"
                      onClick={() => handleResendInvite(user)}
                    >
                      <EnvelopeSimple size={16} className="mr-1" />
                      Resend Invite
                    </Button>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Last login: {formatLastLogin(user.lastLogin)} • Created: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user information and permissions.' : 'Create a new user account and assign roles.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: User['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="mfa">Require 2FA</Label>
              <Switch
                id="mfa"
                checked={formData.mfaEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, mfaEnabled: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
