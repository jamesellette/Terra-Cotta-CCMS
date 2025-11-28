import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Warehouse, Package, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { InventoryItem, Warehouse as WarehouseType } from '@/lib/types'

export function InventoryManagement() {
  const [inventory, setInventory] = useKV<InventoryItem[]>('commerce-inventory', [])
  const [warehouses, setWarehouses] = useKV<WarehouseType[]>('commerce-warehouses', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all')

  const filteredInventory = (inventory || []).filter(item => {
    const matchesSearch = item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterWarehouse === 'all' || item.warehouseId === filterWarehouse
    return matchesSearch && matchesFilter
  })

  const lowStockItems = (inventory || []).filter(item => 
    item.reorderPoint && item.available <= item.reorderPoint
  )

  const totalValue = (inventory || []).reduce((sum, item) => sum + (item.quantity * 0), 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Items</div>
          <div className="text-2xl font-bold">{(inventory || []).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Low Stock</div>
          <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Warehouses</div>
          <div className="text-2xl font-bold">{(warehouses || []).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Units</div>
          <div className="text-2xl font-bold">
            {(inventory || []).reduce((sum, item) => sum + item.quantity, 0)}
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search by SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            {(warehouses || []).map(wh => (
              <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <Warning size={20} weight="fill" />
            <span className="font-semibold">{lowStockItems.length} items are low on stock</span>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredInventory.length === 0 ? (
          <Card className="p-12 text-center">
            <Warehouse size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No inventory items found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterWarehouse !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Inventory items will appear here'
              }
            </p>
          </Card>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">SKU</th>
                  <th className="text-left p-4 font-semibold">Warehouse</th>
                  <th className="text-right p-4 font-semibold">Quantity</th>
                  <th className="text-right p-4 font-semibold">Reserved</th>
                  <th className="text-right p-4 font-semibold">Available</th>
                  <th className="text-right p-4 font-semibold">Reorder Point</th>
                  <th className="text-right p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const warehouse = (warehouses || []).find(w => w.id === item.warehouseId)
                  const isLowStock = item.reorderPoint && item.available <= item.reorderPoint
                  
                  return (
                    <tr key={item.id} className="border-t hover:bg-muted/30">
                      <td className="p-4 font-mono text-sm">{item.sku}</td>
                      <td className="p-4">{warehouse?.name || 'Unknown'}</td>
                      <td className="p-4 text-right font-semibold">{item.quantity}</td>
                      <td className="p-4 text-right text-muted-foreground">{item.reserved}</td>
                      <td className="p-4 text-right font-semibold">{item.available}</td>
                      <td className="p-4 text-right text-muted-foreground">{item.reorderPoint || '-'}</td>
                      <td className="p-4 text-right">
                        {isLowStock ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : item.available === 0 ? (
                          <Badge variant="secondary">Out of Stock</Badge>
                        ) : (
                          <Badge variant="default">In Stock</Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
