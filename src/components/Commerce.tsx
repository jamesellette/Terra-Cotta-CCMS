import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Package,
  ShoppingCart,
  CheckCircle,
  Clock,
  Truck,
  XCircle
} from '@phosphor-icons/react'
import type { Product, Order } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const orderStatusIcons = {
  pending: <Clock size={16} weight="fill" className="text-yellow-500" />,
  processing: <Package size={16} weight="fill" className="text-blue-500" />,
  shipped: <Truck size={16} weight="fill" className="text-purple-500" />,
  delivered: <CheckCircle size={16} weight="fill" className="text-green-500" />,
  cancelled: <XCircle size={16} weight="fill" className="text-red-500" />,
}

export function Commerce() {
  const [products, setProducts] = useKV<Product[]>('products', [])
  const [orders, setOrders] = useKV<Order[]>('orders', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = (products || []).filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(current =>
        (current || []).map(product =>
          product.id === editingProduct.id
            ? { ...product, ...formData }
            : product
        )
      )
      toast.success('Product updated successfully')
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name || 'Untitled Product',
        sku: formData.sku || `SKU-${Date.now()}`,
        price: formData.price || 0,
        inventory: formData.inventory || 0,
        status: (formData.status as Product['status']) || 'active',
        category: formData.category || 'Uncategorized',
        description: formData.description || '',
        createdAt: new Date().toISOString(),
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

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(current =>
      (current || []).map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    )
    toast.success('Order status updated')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commerce</h1>
          <p className="text-muted-foreground mt-1">Manage products, inventory, and orders</p>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products" className="gap-2">
            <Package size={18} />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingCart size={18} />
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={() => setEditingProduct(null)}>
                  <Plus size={20} weight="bold" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <ProductForm
                  product={editingProduct}
                  onSave={handleSaveProduct}
                  onCancel={() => {
                    setIsDialogOpen(false)
                    setEditingProduct(null)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <Package size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Add your first product to get started</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus size={20} weight="bold" className="mr-2" />
                  Add Product
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Stock: {product.inventory}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingProduct(product)
                            setIsDialogOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4">
            {(orders || []).length === 0 ? (
              <Card className="p-12 text-center">
                <ShoppingCart size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">Orders will appear here once customers start purchasing</p>
              </Card>
            ) : (
              (orders || []).map(order => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {orderStatusIcons[order.status]}
                        <h3 className="text-lg font-semibold">Order {order.orderNumber}</h3>
                        <Badge variant="outline">{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Customer: {order.customer} • {order.items} items • ${order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleUpdateOrderStatus(order.id, value as Order['status'])}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProductForm({
  product,
  onSave,
  onCancel
}: {
  product: Product | null
  onSave: (data: Partial<Product>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      sku: '',
      price: 0,
      inventory: 0,
      status: 'active',
      category: '',
      description: '',
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
            required
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Product SKU"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <Label htmlFor="inventory">Inventory</Label>
          <Input
            id="inventory"
            type="number"
            value={formData.inventory}
            onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) || 0 })}
            placeholder="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as Product['status'] })}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Product category"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product description"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
