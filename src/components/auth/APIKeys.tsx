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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Plus, Copy, Trash, Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface APIKey {
  id: string
  userId: string
  userName: string
  name: string
  keyPrefix: string
  fullKey?: string
  scopes: string[]
  lastUsed?: string
  expiresAt?: string
  createdAt: string
}

const availableScopes = [
  { id: 'content:read', label: 'Read Content', category: 'Content' },
  { id: 'content:write', label: 'Write Content', category: 'Content' },
  { id: 'commerce:read', label: 'Read Commerce', category: 'Commerce' },
  { id: 'commerce:write', label: 'Write Commerce', category: 'Commerce' },
  { id: 'analytics:read', label: 'Read Analytics', category: 'Analytics' },
  { id: 'users:read', label: 'Read Users', category: 'Users' },
  { id: 'users:write', label: 'Write Users', category: 'Users' }
]

const initialKeys: APIKey[] = [
  {
    id: '1',
    userId: '3',
    userName: 'Emma Rodriguez',
    name: 'Production API Key',
    keyPrefix: 'tc_prod_',
    scopes: ['content:read', 'content:write', 'commerce:read'],
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    userId: '3',
    userName: 'Emma Rodriguez',
    name: 'Development Key',
    keyPrefix: 'tc_dev_',
    scopes: ['content:read', 'analytics:read'],
    lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    userId: '1',
    userName: 'Sarah Anderson',
    name: 'Admin Access Key',
    keyPrefix: 'tc_admin_',
    scopes: ['content:read', 'content:write', 'commerce:read', 'commerce:write', 'analytics:read', 'users:read'],
    lastUsed: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '4',
    userId: '2',
    userName: 'Michael Chen',
    name: 'Content Sync Key',
    keyPrefix: 'tc_sync_',
    scopes: ['content:read', 'content:write'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export function APIKeys() {
  const [apiKeys, setApiKeys] = useKV<APIKey[]>('auth-api-keys', initialKeys)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newKeyDialog, setNewKeyDialog] = useState(false)
  const [newKeyData, setNewKeyData] = useState<APIKey | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    scopes: [] as string[],
    expiresIn: '90'
  })
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const handleCreate = () => {
    setFormData({
      name: '',
      scopes: [],
      expiresIn: '90'
    })
    setDialogOpen(true)
  }

  const generateAPIKey = () => {
    const prefix = 'tc_' + Math.random().toString(36).substring(2, 8) + '_'
    const key = prefix + crypto.randomUUID().replace(/-/g, '')
    return { prefix, fullKey: key }
  }

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Please enter a key name')
      return
    }

    if (formData.scopes.length === 0) {
      toast.error('Please select at least one scope')
      return
    }

    const { prefix, fullKey } = generateAPIKey()
    const expiryDays = parseInt(formData.expiresIn)

    const user = await window.spark.user()

    const newKey: APIKey = {
      id: crypto.randomUUID(),
      userId: user?.id?.toString() || crypto.randomUUID(),
      userName: user?.login || 'Unknown User',
      name: formData.name,
      keyPrefix: prefix,
      fullKey: fullKey,
      scopes: formData.scopes,
      expiresAt: expiryDays > 0 ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString() : undefined,
      createdAt: new Date().toISOString()
    }

    setApiKeys((currentKeys) => {
      const updated = [...(currentKeys || []), newKey]
      return updated
    })

    setNewKeyData(newKey)
    setDialogOpen(false)
    setNewKeyDialog(true)
  }

  const handleDelete = (keyId: string) => {
    setApiKeys((currentKeys) => {
      const updated = (currentKeys || []).filter(k => k.id !== keyId)
      toast.success('API key deleted successfully')
      return updated
    })
  }

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((current) => {
      const updated = new Set(current)
      if (updated.has(keyId)) {
        updated.delete(keyId)
      } else {
        updated.add(keyId)
      }
      return updated
    })
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
  }

  const toggleScope = (scopeId: string) => {
    setFormData((current) => {
      const scopes = [...current.scopes]
      const index = scopes.indexOf(scopeId)
      if (index > -1) {
        scopes.splice(index, 1)
      } else {
        scopes.push(scopeId)
      }
      return { ...current, scopes }
    })
  }

  const isScopeChecked = (scopeId: string) => {
    return formData.scopes.includes(scopeId)
  }

  const formatLastUsed = (lastUsed?: string) => {
    if (!lastUsed) return 'Never'
    const date = new Date(lastUsed)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const formatExpiry = (expiresAt?: string) => {
    if (!expiresAt) return 'Never'
    const date = new Date(expiresAt)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMs < 0) return 'Expired'
    if (diffDays < 7) return `${diffDays}d remaining`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w remaining`
    return `${Math.floor(diffDays / 30)}mo remaining`
  }

  const maskKey = (prefix: string) => {
    return `${prefix}${'•'.repeat(32)}`
  }

  const scopesByCategory = availableScopes.reduce((acc, scope) => {
    if (!acc[scope.category]) {
      acc[scope.category] = []
    }
    acc[scope.category].push(scope)
    return acc
  }, {} as Record<string, typeof availableScopes>)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          API keys allow applications to access Terra Cotta programmatically
        </p>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} weight="bold" />
          Create API Key
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Scopes</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(apiKeys || []).map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{apiKey.name}</div>
                    <div className="text-sm text-muted-foreground">{apiKey.userName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">
                      {visibleKeys.has(apiKey.id) && apiKey.fullKey
                        ? apiKey.fullKey
                        : maskKey(apiKey.keyPrefix)}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {visibleKeys.has(apiKey.id) ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </Button>
                    {apiKey.fullKey && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => copyKey(apiKey.fullKey!)}
                      >
                        <Copy size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {apiKey.scopes.slice(0, 2).map((scope) => (
                      <Badge key={scope} variant="secondary" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                    {apiKey.scopes.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{apiKey.scopes.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatLastUsed(apiKey.lastUsed)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatExpiry(apiKey.expiresAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(apiKey.id)}
                  >
                    <Trash size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key with specific permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Key Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Production API Key"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires">Expires In</Label>
              <select
                id="expires"
                value={formData.expiresIn}
                onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
                <option value="0">Never</option>
              </select>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Scopes *</Label>
              {Object.entries(scopesByCategory).map(([category, scopes]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm">{category}</h4>
                  <div className="space-y-2 pl-4">
                    {scopes.map((scope) => (
                      <div key={scope.id} className="flex items-center gap-3">
                        <Checkbox
                          id={scope.id}
                          checked={isScopeChecked(scope.id)}
                          onCheckedChange={() => toggleScope(scope.id)}
                        />
                        <Label
                          htmlFor={scope.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {scope.label}
                        </Label>
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
            <Button onClick={handleSave}>Create Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newKeyDialog} onOpenChange={setNewKeyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle size={24} weight="fill" className="text-green-600" />
              API Key Created
            </DialogTitle>
            <DialogDescription>
              Save this key now. You won't be able to see it again.
            </DialogDescription>
          </DialogHeader>

          {newKeyData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    value={newKeyData.fullKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyKey(newKeyData.fullKey!)}
                    className="gap-2"
                  >
                    <Copy size={16} />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Store this key securely. For security reasons, it will only be shown once.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setNewKeyDialog(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
