import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Tag, Pencil, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { PriceBook } from '@/lib/types'

export function PricingManagement() {
  const [priceBooks, setPriceBooks] = useKV<PriceBook[]>('commerce-pricebooks', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPriceBook, setEditingPriceBook] = useState<PriceBook | null>(null)

  const handleSavePriceBook = (formData: Partial<PriceBook>) => {
    if (editingPriceBook) {
      setPriceBooks(current =>
        (current || []).map(pb =>
          pb.id === editingPriceBook.id
            ? { ...pb, ...formData }
            : pb
        )
      )
      toast.success('Price book updated successfully')
    } else {
      const newPriceBook: PriceBook = {
        id: `pb_${Date.now()}`,
        name: formData.name || 'Untitled Price Book',
        currency: formData.currency || 'USD',
        isDefault: formData.isDefault ?? false,
        customerGroupId: formData.customerGroupId,
        validFrom: formData.validFrom,
        validTo: formData.validTo,
        prices: formData.prices || [],
        createdAt: new Date().toISOString(),
      }
      setPriceBooks(current => [...(current || []), newPriceBook])
      toast.success('Price book created successfully')
    }
    setIsDialogOpen(false)
    setEditingPriceBook(null)
  }

  const handleDeletePriceBook = (id: string) => {
    setPriceBooks(current => (current || []).filter(pb => pb.id !== id))
    toast.success('Price book deleted')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Price Books</h2>
          <p className="text-sm text-muted-foreground">Manage flexible pricing strategies</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingPriceBook(null)}>
              <Plus size={20} weight="bold" />
              Add Price Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPriceBook ? 'Edit Price Book' : 'Create New Price Book'}</DialogTitle>
            </DialogHeader>
            <PriceBookForm
              priceBook={editingPriceBook}
              onSave={handleSavePriceBook}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingPriceBook(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {(priceBooks || []).length === 0 ? (
          <Card className="p-12 text-center">
            <Tag size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No price books yet</h3>
            <p className="text-muted-foreground mb-4">Create price books for different customer groups or markets</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={20} weight="bold" className="mr-2" />
              Add Price Book
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(priceBooks || []).map(priceBook => (
              <Card key={priceBook.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold">{priceBook.name}</h3>
                    {priceBook.isDefault && (
                      <Badge variant="default">Default</Badge>
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">Currency: <span className="text-foreground font-medium">{priceBook.currency}</span></p>
                    <p className="text-muted-foreground">Prices: <span className="text-foreground font-medium">{priceBook.prices.length}</span></p>
                    {priceBook.validFrom && (
                      <p className="text-muted-foreground">Valid from: <span className="text-foreground">{new Date(priceBook.validFrom).toLocaleDateString()}</span></p>
                    )}
                    {priceBook.validTo && (
                      <p className="text-muted-foreground">Valid until: <span className="text-foreground">{new Date(priceBook.validTo).toLocaleDateString()}</span></p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => {
                        setEditingPriceBook(priceBook)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePriceBook(priceBook.id)}
                      disabled={priceBook.isDefault}
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

function PriceBookForm({
  priceBook,
  onSave,
  onCancel
}: {
  priceBook: PriceBook | null
  onSave: (data: Partial<PriceBook>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<PriceBook>>(
    priceBook || {
      name: '',
      currency: 'USD',
      isDefault: false,
      validFrom: undefined,
      validTo: undefined,
      prices: [],
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Price Book Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter price book name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          >
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="validFrom">Valid From</Label>
          <Input
            id="validFrom"
            type="date"
            value={formData.validFrom?.split('T')[0] || ''}
            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          />
        </div>
        <div>
          <Label htmlFor="validTo">Valid To</Label>
          <Input
            id="validTo"
            type="date"
            value={formData.validTo?.split('T')[0] || ''}
            onChange={(e) => setFormData({ ...formData, validTo: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {priceBook ? 'Update Price Book' : 'Create Price Book'}
        </Button>
      </div>
    </form>
  )
}
