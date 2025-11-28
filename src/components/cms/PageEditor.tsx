import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Trash, 
  TextT, 
  TextHOne, 
  Image as ImageIcon, 
  Video,
  Code,
  Quotes,
  ListBullets
} from '@phosphor-icons/react'
import type { Page, PageVersion, BlockContent } from '@/lib/types'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const blockTypes = [
  { type: 'text', icon: TextT, label: 'Text' },
  { type: 'heading', icon: TextHOne, label: 'Heading' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'code', icon: Code, label: 'Code' },
  { type: 'quote', icon: Quotes, label: 'Quote' },
  { type: 'list', icon: ListBullets, label: 'List' },
]

export function PageEditor({ page, onClose }: { page: Page | null; onClose: () => void }) {
  const [pages, setPages] = useKV<Page[]>('cms-pages', [])
  const [slug, setSlug] = useState(page?.slug || '')
  const [template, setTemplate] = useState(page?.template || 'default')
  const [status, setStatus] = useState(page?.status || 'draft')
  const [title, setTitle] = useState('')
  const [blocks, setBlocks] = useState<BlockContent[]>([])
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  useEffect(() => {
    if (page?.versions && page.versions.length > 0) {
      const latestVersion = page.versions[page.versions.length - 1]
      setTitle(latestVersion.title)
      setBlocks(latestVersion.content || [])
      setMetaTitle(latestVersion.meta?.metaTitle || '')
      setMetaDescription(latestVersion.meta?.metaDescription || '')
    }
  }, [page])

  const addBlock = (type: string) => {
    const newBlock: BlockContent = {
      id: Date.now().toString(),
      type: type as BlockContent['type'],
      content: '',
      settings: {}
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  const handleSave = () => {
    const newVersion: PageVersion = {
      id: Date.now().toString(),
      pageId: page?.id || Date.now().toString(),
      version: page?.versions ? page.versions.length + 1 : 1,
      title,
      content: blocks,
      meta: {
        metaTitle,
        metaDescription,
      },
      locale: 'en',
      createdBy: 'current-user',
      createdAt: new Date().toISOString()
    }

    if (page) {
      setPages(current => 
        (current || []).map(p => 
          p.id === page.id 
            ? { 
                ...p, 
                slug,
                template,
                status,
                versions: [...(p.versions || []), newVersion],
                updatedAt: new Date().toISOString()
              }
            : p
        )
      )
      toast.success('Page updated successfully')
    } else {
      const newPage: Page = {
        id: Date.now().toString(),
        siteId: 'default-site',
        slug,
        template,
        status,
        versions: [newVersion],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setPages(current => [newPage, ...(current || [])])
      toast.success('Page created successfully')
    }
    onClose()
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Content Blocks</Label>
              <Select onValueChange={addBlock}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Add block" />
                </SelectTrigger>
                <SelectContent>
                  {blockTypes.map(({ type, icon: Icon, label }) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Icon size={16} />
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {blocks.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No content blocks yet. Add your first block above.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {blocks.map((block) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    onUpdate={updateBlock}
                    onDelete={deleteBlock}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="slug">Page Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="page-slug"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">URL: /{slug}</p>
          </div>

          <div>
            <Label htmlFor="template">Template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger id="template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="landing">Landing Page</SelectItem>
                <SelectItem value="blog">Blog Post</SelectItem>
                <SelectItem value="product">Product Page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Page['status'])}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {page && (
            <div>
              <Label>Version History</Label>
              <div className="mt-2 space-y-2">
                {page.versions?.map((version, idx) => (
                  <Card key={version.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline">v{version.version}</Badge>
                        <span className="ml-2 text-sm">{version.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(version.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="meta" className="space-y-4 mt-6">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO optimized title"
            />
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Brief description for search engines"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metaDescription.length}/160 characters
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {page ? 'Update Page' : 'Create Page'}
        </Button>
      </div>
    </div>
  )
}

function BlockEditor({ 
  block, 
  onUpdate, 
  onDelete 
}: { 
  block: BlockContent
  onUpdate: (id: string, content: any) => void
  onDelete: (id: string) => void
}) {
  const BlockIcon = blockTypes.find(b => b.type === block.type)?.icon || TextT

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BlockIcon size={18} className="text-primary" />
            <Badge variant="secondary">{block.type}</Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(block.id)}
          >
            <Trash size={18} />
          </Button>
        </div>

        {block.type === 'heading' && (
          <Input
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="Enter heading text"
          />
        )}

        {block.type === 'text' && (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="Enter paragraph text"
            rows={4}
            className="font-content"
          />
        )}

        {block.type === 'quote' && (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="Enter quote text"
            rows={3}
            className="font-content italic"
          />
        )}

        {block.type === 'code' && (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="Enter code"
            rows={6}
            className="font-mono text-sm"
          />
        )}

        {(block.type === 'image' || block.type === 'video') && (
          <Input
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder={`Enter ${block.type} URL`}
          />
        )}

        {block.type === 'list' && (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="Enter list items (one per line)"
            rows={5}
          />
        )}
      </div>
    </Card>
  )
}
