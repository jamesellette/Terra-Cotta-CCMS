import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, PencilSimple, Trash, ShieldCheck, Lock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  userCount: number
  createdAt: string
}

const availablePermissions = [
  {
    category: 'Content',
    permissions: [
      { id: 'content.view', label: 'View Content', description: 'View pages, posts, and fragments' },
      { id: 'content.create', label: 'Create Content', description: 'Create new content items' },
      { id: 'content.edit', label: 'Edit Content', description: 'Edit existing content' },
      { id: 'content.delete', label: 'Delete Content', description: 'Delete content items' },
      { id: 'content.publish', label: 'Publish Content', description: 'Publish and unpublish content' },
    ]
  },
  {
    category: 'Commerce',
    permissions: [
      { id: 'commerce.view', label: 'View Commerce', description: 'View products, orders, customers' },
      { id: 'commerce.products', label: 'Manage Products', description: 'Create and edit products' },
      { id: 'commerce.orders', label: 'Manage Orders', description: 'Process and fulfill orders' },
      { id: 'commerce.customers', label: 'Manage Customers', description: 'Manage customer accounts' },
      { id: 'commerce.pricing', label: 'Manage Pricing', description: 'Set prices and promotions' },
    ]
  },
  {
    category: 'Analytics',
    permissions: [
      { id: 'analytics.view', label: 'View Analytics', description: 'View analytics dashboards' },
      { id: 'analytics.export', label: 'Export Data', description: 'Export analytics reports' },
      { id: 'analytics.configure', label: 'Configure Analytics', description: 'Set up tracking and goals' },
    ]
  },
  {
    category: 'Users & Security',
    permissions: [
      { id: 'users.view', label: 'View Users', description: 'View user accounts' },
      { id: 'users.manage', label: 'Manage Users', description: 'Create, edit, and delete users' },
      { id: 'roles.manage', label: 'Manage Roles', description: 'Create and edit roles' },
      { id: 'permissions.assign', label: 'Assign Permissions', description: 'Grant and revoke permissions' },
      { id: 'audit.view', label: 'View Audit Logs', description: 'Access audit log records' },
    ]
  },
  {
    category: 'System',
    permissions: [
      { id: 'settings.view', label: 'View Settings', description: 'View system settings' },
      { id: 'settings.manage', label: 'Manage Settings', description: 'Modify system configuration' },
      { id: 'api.access', label: 'API Access', description: 'Use API endpoints' },
    ]
  }
]

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access with all permissions',
    permissions: ['*'],
    isSystem: true,
    userCount: 5,
    createdAt: new Date('2023-01-01').toISOString()
  },
  {
    id: '2',
    name: 'Content Editor',
    description: 'Create and manage content across the platform',
    permissions: [
      'content.view',
      'content.create',
      'content.edit',
      'content.publish',
      'analytics.view'
    ],
    isSystem: false,
    userCount: 12,
    createdAt: new Date('2023-01-01').toISOString()
  },
  {
    id: '3',
    name: 'Commerce Manager',
    description: 'Manage products, orders, and customers',
    permissions: [
      'commerce.view',
      'commerce.products',
      'commerce.orders',
      'commerce.customers',
      'commerce.pricing',
      'analytics.view'
    ],
    isSystem: false,
    userCount: 8,
    createdAt: new Date('2023-02-15').toISOString()
  },
  {
    id: '4',
    name: 'Developer',
    description: 'Technical access for integrations and API usage',
    permissions: [
      'content.view',
      'commerce.view',
      'api.access',
      'settings.view'
    ],
    isSystem: false,
    userCount: 3,
    createdAt: new Date('2023-03-01').toISOString()
  },
  {
    id: '5',
    name: 'Viewer',
    description: 'Read-only access to content and analytics',
    permissions: [
      'content.view',
      'commerce.view',
      'analytics.view'
    ],
    isSystem: false,
    userCount: 15,
    createdAt: new Date('2023-01-10').toISOString()
  }
]

export function RolesManagement() {
  const [roles, setRoles] = useKV<Role[]>('auth-roles', initialRoles)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })

  const handleCreate = () => {
    setEditingRole(null)
    setFormData({
      name: '',
      description: '',
      permissions: []
    })
    setDialogOpen(true)
  }

  const handleEdit = (role: Role) => {
    if (role.isSystem) {
      toast.error('System roles cannot be edited')
      return
    }
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.permissions.length === 0) {
      toast.error('Please select at least one permission')
      return
    }

    setRoles((currentRoles) => {
      const updated = [...(currentRoles || [])]
      if (editingRole) {
        const index = updated.findIndex(r => r.id === editingRole.id)
        if (index !== -1) {
          updated[index] = { ...updated[index], ...formData }
        }
        toast.success('Role updated successfully')
      } else {
        const newRole: Role = {
          id: crypto.randomUUID(),
          ...formData,
          isSystem: false,
          userCount: 0,
          createdAt: new Date().toISOString()
        }
        updated.push(newRole)
        toast.success('Role created successfully')
      }
      return updated
    })

    setDialogOpen(false)
  }

  const handleDelete = (roleId: string) => {
    const role = (roles || []).find(r => r.id === roleId)
    if (role?.isSystem) {
      toast.error('System roles cannot be deleted')
      return
    }
    if (role && role.userCount > 0) {
      toast.error('Cannot delete role with assigned users')
      return
    }

    setRoles((currentRoles) => {
      const updated = (currentRoles || []).filter(r => r.id !== roleId)
      toast.success('Role deleted successfully')
      return updated
    })
  }

  const togglePermission = (permissionId: string) => {
    setFormData((current) => {
      const permissions = [...current.permissions]
      const index = permissions.indexOf(permissionId)
      if (index > -1) {
        permissions.splice(index, 1)
      } else {
        permissions.push(permissionId)
      }
      return { ...current, permissions }
    })
  }

  const isPermissionChecked = (permissionId: string) => {
    return formData.permissions.includes(permissionId)
  }

  const getPermissionCount = (permissions: string[]) => {
    if (permissions.includes('*')) return 'All Permissions'
    return `${permissions.length} permission${permissions.length !== 1 ? 's' : ''}`
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Manage roles and their associated permissions
        </p>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} weight="bold" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(roles || []).map((role) => (
          <Card key={role.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShieldCheck size={20} weight="fill" className="text-primary" />
                </div>
                {role.isSystem && (
                  <Badge variant="outline" className="gap-1">
                    <Lock size={12} />
                    System
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(role)}
                  disabled={role.isSystem}
                >
                  <PencilSimple size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(role.id)}
                  disabled={role.isSystem}
                >
                  <Trash size={18} />
                </Button>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2">{role.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{role.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Permissions:</span>
                <span className="font-medium">{getPermissionCount(role.permissions)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Users:</span>
                <span className="font-medium">{role.userCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{new Date(role.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            <DialogDescription>
              {editingRole ? 'Update role information and permissions.' : 'Define a new role with specific permissions.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Content Editor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this role can do..."
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Permissions *</Label>
              {availablePermissions.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h4 className="font-medium text-sm">{category.category}</h4>
                  <div className="space-y-2 pl-4">
                    {category.permissions.map((permission) => (
                      <div key={permission.id} className="flex items-start gap-3">
                        <Checkbox
                          id={permission.id}
                          checked={isPermissionChecked(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={permission.id}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {permission.label}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
