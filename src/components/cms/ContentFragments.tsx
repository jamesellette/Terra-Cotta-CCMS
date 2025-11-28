import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Plus, 
  MagnifyingGlass, 
  Pencil, 
  Trash,
  Cube
} from '@phosphor-icons/react'
import type { ContentFragment, ContentModel } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function ContentFragments() {
  const [fragments, setFragments] = useKV<ContentFragment[]>('cms-fragments', [])
  const [models] = useKV<ContentModel[]>('cms-models', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFragment, setEditingFragment] = useState<ContentFragment | null>(null)

  const filteredFragments = (fragments || []).filter(fragment => {
    const matchesSearch = fragment.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || fragment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleSave = (formData: Partial<ContentFragment>) => {
    if (editingFragment) {
      setFragments(current => 
        (current || []).map(item => 
          item.id === editingFragment.id 
            ? { ...item, ...formData, updatedAt: new Date().toISOString() }
            : item
        )
      )
      toast.success('Content fragment updated')
    } else {
      const newFragment: ContentFragment = {
        id: Date.now().toString(),
        siteId: 'default-site',
        name: formData.name || 'Untitled Fragment',
        modelId: formData.modelId || 'default',
        data: formData.data || {},
        status: formData.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setFragments(current => [newFragment, ...(current || [])])
      toast.success('Content fragment created')
    }
    setIsDialogOpen(false)
    setEditingFragment(null)
  }

  const handleDelete = (id: string) => {
    setFragments(current => (current || []).filter(item => item.id !== id))
    toast.success('Content fragment deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Fragments</h2>
          <p className="text-sm text-muted-foreground mt-1">Reusable content blocks</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingFragment(null)}>
              <Plus size={20} weight="bold" />
              New Fragment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingFragment ? 'Edit Fragment' : 'Create New Fragment'}</DialogTitle>
            </DialogHeader>
            <FragmentForm 
              fragment={editingFragment}
              models={models || []}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingFragment(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search fragments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredFragments.length === 0 ? (
        <Card className="p-12 text-center">
          <Cube size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No content fragments</h3>
          <p className="text-muted-foreground mb-4">Create reusable content blocks</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={20} weight="bold" className="mr-2" />
            Create Fragment
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFragments.map(fragment => (
            <Card key={fragment.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Cube size={20} weight="fill" className="text-primary" />
                    <h3 className="text-lg font-semibold">{fragment.name}</h3>
                    <Badge variant="outline">{fragment.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>Updated {new Date(fragment.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setEditingFragment(fragment)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(fragment.id)}
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function FragmentForm({ 
  fragment, 
  models,
  onSave, 
  onCancel 
}: { 
  fragment: ContentFragment | null
  models: ContentModel[]
  onSave: (data: Partial<ContentFragment>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<ContentFragment>>(
    fragment || {
      name: '',
      modelId: models[0]?.id || 'default',
      status: 'draft',
      data: {},
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Fragment Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter fragment name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="model">Content Model</Label>
          <Select 
            value={formData.modelId} 
            onValueChange={(value) => setFormData({ ...formData, modelId: value })}
          >
            <SelectTrigger id="model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.length > 0 ? (
                models.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="default">Default</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData({ ...formData, status: value as ContentFragment['status'] })}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="data">Fragment Data (JSON)</Label>
        <Textarea
          id="data"
          value={JSON.stringify(formData.data, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              setFormData({ ...formData, data: parsed })
            } catch {
            }
          }}
          placeholder='{"key": "value"}'
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {fragment ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
