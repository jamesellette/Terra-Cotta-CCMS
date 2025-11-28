import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Plus, SquaresFour, Pencil, Trash, Folder } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Category } from '@/lib/types'

export function CategoryManagement() {
  const [categories, setCategories] = useKV<Category[]>('commerce-categories', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleSaveCategory = (formData: Partial<Category>) => {
    if (editingCategory) {
      setCategories(current =>
        (current || []).map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, ...formData }
            : cat
        )
      )
      toast.success('Category updated successfully')
    } else {
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name: formData.name || 'Untitled Category',
        slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-') || `category-${Date.now()}`,
        description: formData.description,
        imageUrl: formData.imageUrl,
        position: formData.position || 0,
        isActive: formData.isActive ?? true,
        parentId: formData.parentId,
        metadata: formData.metadata || {},
        createdAt: new Date().toISOString(),
      }
      setCategories(current => [...(current || []), newCategory])
      toast.success('Category created successfully')
    }
    setIsDialogOpen(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(current => (current || []).filter(cat => cat.id !== id))
    toast.success('Category deleted')
  }

  const sortedCategories = [...(categories || [])].sort((a, b) => a.position - b.position)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Category Management</h2>
          <p className="text-sm text-muted-foreground">Organize products into categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingCategory(null)}>
              <Plus size={20} weight="bold" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              categories={categories || []}
              onSave={handleSaveCategory}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingCategory(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sortedCategories.length === 0 ? (
          <Card className="p-12 text-center">
            <Folder size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
            <p className="text-muted-foreground mb-4">Create categories to organize your products</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={20} weight="bold" className="mr-2" />
              Add Category
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCategories.map(category => (
              <Card key={category.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <SquaresFour size={20} weight="duotone" className="text-primary" />
                      <h3 className="text-base font-semibold">{category.name}</h3>
                    </div>
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">/{category.slug}</p>
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Position: {category.position}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => {
                        setEditingCategory(category)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CategoryForm({
  category,
  categories,
  onSave,
  onCancel
}: {
  category: Category | null
  categories: Category[]
  onSave: (data: Partial<Category>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Category>>(
    category || {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      position: 0,
      isActive: true,
      parentId: undefined,
      metadata: {},
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter category name"
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="category-slug"
            required
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            type="number"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Category description"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="isActive">Active</Label>
          <p className="text-xs text-muted-foreground">Make this category visible</p>
        </div>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}
