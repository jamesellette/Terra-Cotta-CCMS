import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, MagnifyingGlass, Package, Pencil, Trash, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Product, ProductVariant } from '@/lib/types'

export function ProductCatalog() {
  const [products, setProducts] = useKV<Product[]>('commerce-products', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(current =>
        (current || []).map(product =>
          product.id === editingProduct.id
            ? { ...product, ...formData, updatedAt: new Date().toISOString() }
            : product
        )
      )
      toast.success('Product updated successfully')
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: formData.name || 'Untitled Product',
        sku: formData.sku || `SKU-${Date.now()}`,
        slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-') || `product-${Date.now()}`,
        description: formData.description || '',
        type: formData.type || 'simple',
        status: formData.status || 'draft',
        visibility: formData.visibility || 'visible',
        basePrice: formData.basePrice || 0,
        compareAtPrice: formData.compareAtPrice,
        cost: formData.cost,
        categoryIds: formData.categoryIds || [],
        tags: formData.tags || [],
        attributes: formData.attributes || {},
        variants: formData.variants || [],
        images: formData.images || [],
        weight: formData.weight,
        dimensions: formData.dimensions,
        inventory: formData.inventory || 0,
        trackInventory: formData.trackInventory ?? true,
        allowBackorder: formData.allowBackorder ?? false,
        taxable: formData.taxable ?? true,
        metadata: formData.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setProducts(current => [newProduct, ...(current || [])])
      toast.success('Product created successfully')
    }
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(current => (current || []).filter(product => product.id !== id))
    toast.success('Product deleted')
  }

  const handleGenerateDescription = async (productName: string) => {
    try {
      const prompt = `Generate a compelling product description for an e-commerce product named "${productName}". Make it professional, engaging, and SEO-friendly. Include key features and benefits in 2-3 short paragraphs.`
      const description = await window.spark.llm(prompt, 'gpt-4o-mini')
      return description
    } catch (error) {
      toast.error('Failed to generate description')
      return ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingProduct(null)}>
              <Plus size={20} weight="bold" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSave={handleSaveProduct}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingProduct(null)
              }}
              onGenerateDescription={handleGenerateDescription}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <Package size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Add your first product to get started'
              }
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus size={20} weight="bold" className="mr-2" />
                Add Product
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <Card key={product.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold line-clamp-2">{product.name}</h3>
                    <Badge 
                      variant={product.status === 'active' ? 'default' : 'secondary'}
                      className="flex-shrink-0"
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      ${product.basePrice.toFixed(2)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.basePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Stock: <span className={product.inventory > 0 ? 'text-foreground font-medium' : 'text-destructive font-medium'}>{product.inventory}</span>
                    </span>
                    {product.variants && product.variants.length > 0 && (
                      <span className="text-muted-foreground">{product.variants.length} variants</span>
                    )}
                  </div>
                  {product.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {product.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      {product.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{product.tags.length - 3}</Badge>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => {
                        setEditingProduct(product)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
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

function ProductForm({
  product,
  onSave,
  onCancel,
  onGenerateDescription
}: {
  product: Product | null
  onSave: (data: Partial<Product>) => void
  onCancel: () => void
  onGenerateDescription: (name: string) => Promise<string>
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      sku: '',
      slug: '',
      description: '',
      type: 'simple',
      status: 'draft',
      visibility: 'visible',
      basePrice: 0,
      compareAtPrice: undefined,
      cost: undefined,
      categoryIds: [],
      tags: [],
      attributes: {},
      variants: [],
      images: [],
      weight: undefined,
      dimensions: undefined,
      inventory: 0,
      trackInventory: true,
      allowBackorder: false,
      taxable: true,
      metadata: {},
    }
  )
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleGenerateAIDescription = async () => {
    if (!formData.name) {
      toast.error('Please enter a product name first')
      return
    }
    setIsGenerating(true)
    const description = await onGenerateDescription(formData.name)
    if (description) {
      setFormData({ ...formData, description })
      toast.success('Description generated')
    }
    setIsGenerating(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Product SKU"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="product-url-slug"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateAIDescription}
                disabled={isGenerating}
                className="gap-2"
              >
                <Sparkle size={16} weight="fill" />
                {isGenerating ? 'Generating...' : 'AI Generate'}
              </Button>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description"
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Product Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="variant">With Variants</SelectItem>
                  <SelectItem value="bundle">Bundle</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags?.join(', ')}
              onChange={(e) => setFormData({ 
                ...formData, 
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
              })}
              placeholder="electronics, featured, new-arrival"
            />
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="basePrice">Price *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="compareAtPrice">Compare at Price</Label>
              <Input
                id="compareAtPrice"
                type="number"
                step="0.01"
                value={formData.compareAtPrice || ''}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || undefined })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="cost">Cost per Item</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost || ''}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || undefined })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inventory">Inventory Quantity *</Label>
              <Input
                id="inventory"
                type="number"
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) || 0 })}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-4 pt-7">
              <div className="flex items-center justify-between">
                <Label htmlFor="trackInventory">Track Inventory</Label>
                <Switch
                  id="trackInventory"
                  checked={formData.trackInventory}
                  onCheckedChange={(checked) => setFormData({ ...formData, trackInventory: checked })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowBackorder">Allow Backorder</Label>
              <p className="text-xs text-muted-foreground">Allow purchases when out of stock</p>
            </div>
            <Switch
              id="allowBackorder"
              checked={formData.allowBackorder}
              onCheckedChange={(checked) => setFormData({ ...formData, allowBackorder: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="taxable">Taxable</Label>
              <p className="text-xs text-muted-foreground">Charge tax on this product</p>
            </div>
            <Switch
              id="taxable"
              checked={formData.taxable}
              onCheckedChange={(checked) => setFormData({ ...formData, taxable: checked })}
            />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value: any) => setFormData({ ...formData, visibility: value })}
            >
              <SelectTrigger id="visibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">Visible (Catalog & Search)</SelectItem>
                <SelectItem value="catalog">Catalog Only</SelectItem>
                <SelectItem value="search">Search Only</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.001"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || undefined })}
                placeholder="0.000"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="length">Length (cm)</Label>
              <Input
                id="length"
                type="number"
                step="0.01"
                value={formData.dimensions?.length || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  dimensions: { ...formData.dimensions, length: parseFloat(e.target.value) || undefined } 
                })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="width">Width (cm)</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                value={formData.dimensions?.width || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  dimensions: { ...formData.dimensions, width: parseFloat(e.target.value) || undefined } 
                })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={formData.dimensions?.height || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  dimensions: { ...formData.dimensions, height: parseFloat(e.target.value) || undefined } 
                })}
                placeholder="0"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}
