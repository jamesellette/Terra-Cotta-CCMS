import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  MagnifyingGlass,
  Images,
  FileImage,
  FileVideo,
  File,
  Trash,
  Download
} from '@phosphor-icons/react'
import type { MediaAsset } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const typeIcons = {
  image: FileImage,
  video: FileVideo,
  document: File,
}

export function MediaLibrary() {
  const [assets, setAssets] = useKV<MediaAsset[]>('cms-media', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredAssets = (assets || []).filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || asset.type === filterType
    return matchesSearch && matchesType
  })

  const handleDelete = (id: string) => {
    setAssets(current => (current || []).filter(asset => asset.id !== id))
    toast.success('Media asset deleted')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage images, videos, and documents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={20} weight="bold" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
            </DialogHeader>
            <UploadForm 
              onSave={(asset) => {
                setAssets(current => [asset, ...(current || [])])
                setIsDialogOpen(false)
                toast.success('Media uploaded successfully')
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAssets.length === 0 ? (
        <Card className="p-12 text-center">
          <Images size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No media assets</h3>
          <p className="text-muted-foreground mb-4">Upload your first media file</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={20} weight="bold" className="mr-2" />
            Upload Media
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map(asset => {
            const Icon = typeIcons[asset.type]
            return (
              <Card key={asset.id} className="group overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  {asset.type === 'image' ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-teal/20 flex items-center justify-center">
                      <Icon size={48} weight="duotone" className="text-primary" />
                    </div>
                  ) : (
                    <Icon size={48} weight="duotone" className="text-muted-foreground" />
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate">{asset.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary" className="text-xs">{asset.type}</Badge>
                    <span className="text-xs text-muted-foreground">{formatFileSize(asset.size)}</span>
                  </div>
                </div>
                <div className="flex gap-1 p-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex-1 gap-1"
                  >
                    <Download size={14} />
                    <span className="text-xs">Download</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(asset.id)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function UploadForm({ 
  onSave, 
  onCancel 
}: { 
  onSave: (asset: MediaAsset) => void
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState<MediaAsset['type']>('image')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newAsset: MediaAsset = {
      id: Date.now().toString(),
      name: name || 'Untitled',
      type,
      url: url || '#',
      size: Math.floor(Math.random() * 1000000) + 50000,
      uploadedAt: new Date().toISOString(),
      tags: []
    }
    onSave(newAsset)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="media-name">Media Name</Label>
        <Input
          id="media-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter media name"
          required
        />
      </div>

      <div>
        <Label htmlFor="media-type">Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as MediaAsset['type'])}>
          <SelectTrigger id="media-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="document">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="media-url">URL</Label>
        <Input
          id="media-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter media URL"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Upload
        </Button>
      </div>
    </form>
  )
}
