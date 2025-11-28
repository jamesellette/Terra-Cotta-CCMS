import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Tag,
  Pencil,
  Trash,
  TreeStructure
} from '@phosphor-icons/react'
import type { Taxonomy, TaxonomyTerm } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function TaxonomyManager() {
  const [taxonomies, setTaxonomies] = useKV<Taxonomy[]>('cms-taxonomies', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTaxonomy, setEditingTaxonomy] = useState<Taxonomy | null>(null)
  const [selectedTaxonomy, setSelectedTaxonomy] = useState<string | null>(null)

  const handleSaveTaxonomy = (formData: Partial<Taxonomy>) => {
    if (editingTaxonomy) {
      setTaxonomies(current => 
        (current || []).map(item => 
          item.id === editingTaxonomy.id 
            ? { ...item, ...formData }
            : item
        )
      )
      toast.success('Taxonomy updated')
    } else {
      const newTaxonomy: Taxonomy = {
        id: Date.now().toString(),
        siteId: 'default-site',
        name: formData.name || 'Untitled',
        slug: formData.slug || 'untitled',
        type: formData.type || 'category',
        terms: []
      }
      setTaxonomies(current => [newTaxonomy, ...(current || [])])
      toast.success('Taxonomy created')
    }
    setIsDialogOpen(false)
    setEditingTaxonomy(null)
  }

  const handleDeleteTaxonomy = (id: string) => {
    setTaxonomies(current => (current || []).filter(item => item.id !== id))
    toast.success('Taxonomy deleted')
  }

  const handleAddTerm = (taxonomyId: string, term: TaxonomyTerm) => {
    setTaxonomies(current =>
      (current || []).map(taxonomy =>
        taxonomy.id === taxonomyId
          ? { ...taxonomy, terms: [...(taxonomy.terms || []), term] }
          : taxonomy
      )
    )
    toast.success('Term added')
  }

  const handleDeleteTerm = (taxonomyId: string, termId: string) => {
    setTaxonomies(current =>
      (current || []).map(taxonomy =>
        taxonomy.id === taxonomyId
          ? { ...taxonomy, terms: (taxonomy.terms || []).filter(t => t.id !== termId) }
          : taxonomy
      )
    )
    toast.success('Term deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Taxonomy Manager</h2>
          <p className="text-sm text-muted-foreground mt-1">Organize content with categories and tags</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingTaxonomy(null)}>
              <Plus size={20} weight="bold" />
              New Taxonomy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTaxonomy ? 'Edit Taxonomy' : 'Create New Taxonomy'}</DialogTitle>
            </DialogHeader>
            <TaxonomyForm 
              taxonomy={editingTaxonomy}
              onSave={handleSaveTaxonomy}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingTaxonomy(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {(taxonomies || []).length === 0 ? (
        <Card className="p-12 text-center">
          <Tag size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No taxonomies</h3>
          <p className="text-muted-foreground mb-4">Create your first taxonomy</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={20} weight="bold" className="mr-2" />
            Create Taxonomy
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {(taxonomies || []).map(taxonomy => (
            <Card key={taxonomy.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Tag size={20} weight="fill" className="text-primary" />
                    <h3 className="text-lg font-semibold">{taxonomy.name}</h3>
                    <Badge variant="secondary">{taxonomy.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">/{taxonomy.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setEditingTaxonomy(taxonomy)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteTaxonomy(taxonomy.id)}
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>
              
              <TermsManager 
                taxonomy={taxonomy}
                onAddTerm={(term) => handleAddTerm(taxonomy.id, term)}
                onDeleteTerm={(termId) => handleDeleteTerm(taxonomy.id, termId)}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function TaxonomyForm({ 
  taxonomy, 
  onSave, 
  onCancel 
}: { 
  taxonomy: Taxonomy | null
  onSave: (data: Partial<Taxonomy>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Taxonomy>>(
    taxonomy || {
      name: '',
      slug: '',
      type: 'category',
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="tax-name">Taxonomy Name</Label>
        <Input
          id="tax-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter taxonomy name"
          required
        />
      </div>

      <div>
        <Label htmlFor="tax-slug">Slug</Label>
        <Input
          id="tax-slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="taxonomy-slug"
          required
        />
      </div>

      <div>
        <Label htmlFor="tax-type">Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => setFormData({ ...formData, type: value as Taxonomy['type'] })}
        >
          <SelectTrigger id="tax-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="tag">Tag</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {taxonomy ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}

function TermsManager({
  taxonomy,
  onAddTerm,
  onDeleteTerm
}: {
  taxonomy: Taxonomy
  onAddTerm: (term: TaxonomyTerm) => void
  onDeleteTerm: (termId: string) => void
}) {
  const [isAddingTerm, setIsAddingTerm] = useState(false)
  const [termName, setTermName] = useState('')
  const [termSlug, setTermSlug] = useState('')
  const [termDescription, setTermDescription] = useState('')

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault()
    const newTerm: TaxonomyTerm = {
      id: Date.now().toString(),
      taxonomyId: taxonomy.id,
      name: termName,
      slug: termSlug,
      description: termDescription,
      metadata: {}
    }
    onAddTerm(newTerm)
    setTermName('')
    setTermSlug('')
    setTermDescription('')
    setIsAddingTerm(false)
  }

  return (
    <div className="space-y-3 mt-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Terms ({taxonomy.terms?.length || 0})</Label>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          onClick={() => setIsAddingTerm(!isAddingTerm)}
        >
          <Plus size={16} />
          Add Term
        </Button>
      </div>

      {isAddingTerm && (
        <form onSubmit={handleAddTerm} className="space-y-3 p-3 border rounded-lg bg-muted/50">
          <Input
            value={termName}
            onChange={(e) => setTermName(e.target.value)}
            placeholder="Term name"
            required
          />
          <Input
            value={termSlug}
            onChange={(e) => setTermSlug(e.target.value)}
            placeholder="term-slug"
            required
          />
          <Textarea
            value={termDescription}
            onChange={(e) => setTermDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">Add</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingTerm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {taxonomy.terms && taxonomy.terms.length > 0 && (
        <div className="space-y-2">
          {taxonomy.terms.map(term => (
            <div key={term.id} className="flex items-center justify-between p-2 rounded border bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{term.name}</span>
                  <Badge variant="outline" className="text-xs">{term.slug}</Badge>
                </div>
                {term.description && (
                  <p className="text-xs text-muted-foreground mt-1">{term.description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDeleteTerm(term.id)}
              >
                <Trash size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
