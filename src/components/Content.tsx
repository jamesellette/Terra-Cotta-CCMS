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
  Eye,
  CheckCircle,
  Clock,
  Archive,
  Article
} from '@phosphor-icons/react'
import type { ContentItem } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const statusIcons = {
  draft: <Clock size={16} weight="fill" className="text-yellow-500" />,
  published: <CheckCircle size={16} weight="fill" className="text-green-500" />,
  archived: <Archive size={16} weight="fill" className="text-gray-500" />,
}

export function Content() {
  const [content, setContent] = useKV<ContentItem[]>('content-items', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)

  const filteredContent = (content || []).filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleSave = (formData: Partial<ContentItem>) => {
    if (editingItem) {
      setContent(current => 
        (current || []).map(item => 
          item.id === editingItem.id 
            ? { ...item, ...formData, updatedAt: new Date().toISOString() }
            : item
        )
      )
      toast.success('Content updated successfully')
    } else {
      const newItem: ContentItem = {
        id: Date.now().toString(),
        title: formData.title || 'Untitled',
        type: (formData.type as ContentItem['type']) || 'article',
        status: (formData.status as ContentItem['status']) || 'draft',
        author: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: formData.content || '',
        excerpt: formData.excerpt || '',
        views: 0,
        tags: formData.tags || []
      }
      setContent(current => [newItem, ...(current || [])])
      toast.success('Content created successfully')
    }
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  const handleDelete = (id: string) => {
    setContent(current => (current || []).filter(item => item.id !== id))
    toast.success('Content deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground mt-1">Manage your content across all channels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingItem(null)}>
              <Plus size={20} weight="bold" />
              New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Content' : 'Create New Content'}</DialogTitle>
            </DialogHeader>
            <ContentForm 
              item={editingItem} 
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingItem(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search content..."
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

      <div className="grid gap-4">
        {filteredContent.length === 0 ? (
          <Card className="p-12 text-center">
            <Article size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first piece of content</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={20} weight="bold" className="mr-2" />
              Create Content
            </Button>
          </Card>
        ) : (
          filteredContent.map(item => (
            <Card key={item.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {statusIcons[item.status]}
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <Badge variant="secondary">{item.type}</Badge>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                  {item.excerpt && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>By {item.author}</span>
                    <span>•</span>
                    <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                    {item.views !== undefined && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {item.views}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setEditingItem(item)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function ContentForm({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item: ContentItem | null
  onSave: (data: Partial<ContentItem>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<ContentItem>>(
    item || {
      title: '',
      type: 'article',
      status: 'draft',
      content: '',
      excerpt: '',
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter content title"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData({ ...formData, type: value as ContentItem['type'] })}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="page">Page</SelectItem>
              <SelectItem value="blog">Blog Post</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData({ ...formData, status: value as ContentItem['status'] })}
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
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          placeholder="Brief description or excerpt"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your content here..."
          rows={8}
          className="font-content"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {item ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
