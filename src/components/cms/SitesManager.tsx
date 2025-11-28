import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  GlobeHemisphereWest,
  Pencil,
  Trash,
  Translate
} from '@phosphor-icons/react'
import type { Site } from '@/lib/types'
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

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
]

export function SitesManager() {
  const [sites, setSites] = useKV<Site[]>('cms-sites', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  const handleSave = (formData: Partial<Site>) => {
    if (editingSite) {
      setSites(current => 
        (current || []).map(item => 
          item.id === editingSite.id 
            ? { ...item, ...formData, updatedAt: new Date().toISOString() }
            : item
        )
      )
      toast.success('Site updated')
    } else {
      const newSite: Site = {
        id: Date.now().toString(),
        name: formData.name || 'Untitled Site',
        domain: formData.domain || 'example.com',
        defaultLocale: formData.defaultLocale || 'en',
        settings: formData.settings || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setSites(current => [newSite, ...(current || [])])
      toast.success('Site created')
    }
    setIsDialogOpen(false)
    setEditingSite(null)
  }

  const handleDelete = (id: string) => {
    setSites(current => (current || []).filter(item => item.id !== id))
    toast.success('Site deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sites</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage multisite configuration</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingSite(null)}>
              <Plus size={20} weight="bold" />
              New Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSite ? 'Edit Site' : 'Create New Site'}</DialogTitle>
            </DialogHeader>
            <SiteForm 
              site={editingSite}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingSite(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {(sites || []).length === 0 ? (
        <Card className="p-12 text-center">
          <GlobeHemisphereWest size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No sites configured</h3>
          <p className="text-muted-foreground mb-4">Create your first site</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={20} weight="bold" className="mr-2" />
            Create Site
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(sites || []).map(site => (
            <Card key={site.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <GlobeHemisphereWest size={20} weight="fill" className="text-primary" />
                    <h3 className="text-lg font-semibold">{site.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{site.domain}</p>
                  <div className="flex items-center gap-2">
                    <Translate size={16} className="text-muted-foreground" />
                    <Badge variant="secondary">{site.defaultLocale.toUpperCase()}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Created {new Date(site.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setEditingSite(site)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(site.id)}
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

function SiteForm({ 
  site, 
  onSave, 
  onCancel 
}: { 
  site: Site | null
  onSave: (data: Partial<Site>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Site>>(
    site || {
      name: '',
      domain: '',
      defaultLocale: 'en',
      settings: {},
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="site-name">Site Name</Label>
        <Input
          id="site-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="My Website"
          required
        />
      </div>

      <div>
        <Label htmlFor="site-domain">Domain</Label>
        <Input
          id="site-domain"
          value={formData.domain}
          onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
          placeholder="example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="site-locale">Default Language</Label>
        <Select 
          value={formData.defaultLocale} 
          onValueChange={(value) => setFormData({ ...formData, defaultLocale: value })}
        >
          <SelectTrigger id="site-locale">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name} ({lang.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {site ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
