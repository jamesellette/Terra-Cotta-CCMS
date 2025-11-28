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
import { Plus, Percent, Pencil, Trash, Tag } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Promotion } from '@/lib/types'

export function PromotionsManagement() {
  const [promotions, setPromotions] = useKV<Promotion[]>('commerce-promotions', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

  const handleSavePromotion = (formData: Partial<Promotion>) => {
    if (editingPromotion) {
      setPromotions(current =>
        (current || []).map(promo =>
          promo.id === editingPromotion.id
            ? { ...promo, ...formData }
            : promo
        )
      )
      toast.success('Promotion updated successfully')
    } else {
      const newPromotion: Promotion = {
        id: `promo_${Date.now()}`,
        name: formData.name || 'Untitled Promotion',
        code: formData.code,
        type: formData.type || 'percentage',
        value: formData.value || 0,
        conditions: formData.conditions || {},
        usageLimit: formData.usageLimit,
        usageCount: 0,
        startsAt: formData.startsAt,
        endsAt: formData.endsAt,
        isActive: formData.isActive ?? true,
        createdAt: new Date().toISOString(),
      }
      setPromotions(current => [newPromotion, ...(current || [])])
      toast.success('Promotion created successfully')
    }
    setIsDialogOpen(false)
    setEditingPromotion(null)
  }

  const handleDeletePromotion = (id: string) => {
    setPromotions(current => (current || []).filter(promo => promo.id !== id))
    toast.success('Promotion deleted')
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    setPromotions(current =>
      (current || []).map(promo =>
        promo.id === id ? { ...promo, isActive } : promo
      )
    )
    toast.success(`Promotion ${isActive ? 'activated' : 'deactivated'}`)
  }

  const activePromotions = (promotions || []).filter(p => p.isActive)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Promotions</div>
          <div className="text-2xl font-bold">{(promotions || []).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Active</div>
          <div className="text-2xl font-bold text-green-600">{activePromotions.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Usage</div>
          <div className="text-2xl font-bold">
            {(promotions || []).reduce((sum, p) => sum + p.usageCount, 0)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">With Codes</div>
          <div className="text-2xl font-bold">
            {(promotions || []).filter(p => p.code).length}
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Promotions & Coupons</h2>
          <p className="text-sm text-muted-foreground">Create and manage promotional offers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingPromotion(null)}>
              <Plus size={20} weight="bold" />
              Add Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}</DialogTitle>
            </DialogHeader>
            <PromotionForm
              promotion={editingPromotion}
              onSave={handleSavePromotion}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingPromotion(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {(promotions || []).length === 0 ? (
          <Card className="p-12 text-center">
            <Percent size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No promotions yet</h3>
            <p className="text-muted-foreground mb-4">Create promotional offers and coupon codes</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={20} weight="bold" className="mr-2" />
              Add Promotion
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(promotions || []).map(promotion => {
              const isExpired = promotion.endsAt && new Date(promotion.endsAt) < new Date()
              const isScheduled = promotion.startsAt && new Date(promotion.startsAt) > new Date()
              
              return (
                <Card key={promotion.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold line-clamp-1">{promotion.name}</h3>
                      <Badge variant={promotion.isActive && !isExpired ? 'default' : 'secondary'}>
                        {isExpired ? 'Expired' : isScheduled ? 'Scheduled' : promotion.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {promotion.code && (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded font-mono text-sm">
                        <Tag size={16} />
                        <span className="font-semibold">{promotion.code}</span>
                      </div>
                    )}
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        Type: <span className="text-foreground font-medium capitalize">{promotion.type.replace('_', ' ')}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Value: <span className="text-foreground font-bold text-primary">
                          {promotion.type === 'percentage' ? `${promotion.value}%` : `$${promotion.value.toFixed(2)}`}
                        </span>
                      </p>
                      <p className="text-muted-foreground">
                        Usage: <span className="text-foreground font-medium">{promotion.usageCount}</span>
                        {promotion.usageLimit && <span> / {promotion.usageLimit}</span>}
                      </p>
                    </div>
                    {(promotion.startsAt || promotion.endsAt) && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        {promotion.startsAt && (
                          <p>Starts: {new Date(promotion.startsAt).toLocaleDateString()}</p>
                        )}
                        {promotion.endsAt && (
                          <p>Ends: {new Date(promotion.endsAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => {
                          setEditingPromotion(promotion)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(promotion.id, !promotion.isActive)}
                      >
                        {promotion.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePromotion(promotion.id)}
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function PromotionForm({
  promotion,
  onSave,
  onCancel
}: {
  promotion: Promotion | null
  onSave: (data: Partial<Promotion>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Promotion>>(
    promotion || {
      name: '',
      code: '',
      type: 'percentage',
      value: 0,
      conditions: {},
      usageLimit: undefined,
      startsAt: undefined,
      endsAt: undefined,
      isActive: true,
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Promotion Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter promotion name"
          required
        />
      </div>

      <div>
        <Label htmlFor="code">Coupon Code (optional)</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          placeholder="SAVE20"
        />
        <p className="text-xs text-muted-foreground mt-1">Leave empty for automatic promotions</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Discount Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: any) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage Off</SelectItem>
              <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
              <SelectItem value="free_shipping">Free Shipping</SelectItem>
              <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="value">Discount Value</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
            placeholder={formData.type === 'percentage' ? '10' : '10.00'}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startsAt">Start Date</Label>
          <Input
            id="startsAt"
            type="datetime-local"
            value={formData.startsAt ? new Date(formData.startsAt).toISOString().slice(0, 16) : ''}
            onChange={(e) => setFormData({ ...formData, startsAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          />
        </div>
        <div>
          <Label htmlFor="endsAt">End Date</Label>
          <Input
            id="endsAt"
            type="datetime-local"
            value={formData.endsAt ? new Date(formData.endsAt).toISOString().slice(0, 16) : ''}
            onChange={(e) => setFormData({ ...formData, endsAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="usageLimit">Usage Limit (optional)</Label>
        <Input
          id="usageLimit"
          type="number"
          value={formData.usageLimit || ''}
          onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || undefined })}
          placeholder="Unlimited"
        />
      </div>

      <div>
        <Label htmlFor="minAmount">Minimum Purchase Amount</Label>
        <Input
          id="minAmount"
          type="number"
          step="0.01"
          value={formData.conditions?.minPurchaseAmount || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            conditions: { ...formData.conditions, minPurchaseAmount: parseFloat(e.target.value) || undefined }
          })}
          placeholder="0.00"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="isActive">Active</Label>
          <p className="text-xs text-muted-foreground">Enable this promotion</p>
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
          {promotion ? 'Update Promotion' : 'Create Promotion'}
        </Button>
      </div>
    </form>
  )
}
