import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  MagnifyingGlass, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle,
  Package,
  CreditCard,
  Eye
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Order, OrderItem } from '@/lib/types'

const orderStatusIcons = {
  pending: <Clock size={16} weight="fill" className="text-yellow-500" />,
  payment_pending: <CreditCard size={16} weight="fill" className="text-orange-500" />,
  processing: <Package size={16} weight="fill" className="text-blue-500" />,
  shipped: <Truck size={16} weight="fill" className="text-purple-500" />,
  delivered: <CheckCircle size={16} weight="fill" className="text-green-500" />,
  cancelled: <XCircle size={16} weight="fill" className="text-red-500" />,
  refunded: <XCircle size={16} weight="fill" className="text-gray-500" />,
}

export function OrderManagement() {
  const [orders, setOrders] = useKV<Order[]>('commerce-orders', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredOrders = (orders || []).filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(current =>
      (current || []).map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    )
    toast.success('Order status updated')
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const totalRevenue = (orders || [])
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.grandTotal, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Orders</div>
          <div className="text-2xl font-bold">{(orders || []).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {(orders || []).filter(o => o.status === 'pending' || o.status === 'payment_pending').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Processing</div>
          <div className="text-2xl font-bold text-blue-600">
            {(orders || []).filter(o => o.status === 'processing' || o.status === 'shipped').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search orders by number, customer..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="payment_pending">Payment Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingCart size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Orders will appear here once customers start purchasing'
              }
            </p>
          </Card>
        ) : (
          filteredOrders.map(order => (
            <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    {orderStatusIcons[order.status]}
                    <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                    <Badge variant="outline">{order.status.replace('_', ' ')}</Badge>
                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <p>Customer: <span className="text-foreground font-medium">{order.customerName}</span></p>
                    <p>Email: <span className="text-foreground">{order.customerEmail}</span></p>
                    <p>Items: <span className="text-foreground font-medium">{order.items.length}</span></p>
                    <p>Total: <span className="text-foreground font-bold text-primary">${order.grandTotal.toFixed(2)}</span></p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ordered: {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleUpdateOrderStatus(order.id, value as Order['status'])}
                  >
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="payment_pending">Payment Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye size={16} />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customerEmail}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Status</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Status:</span> <Badge>{selectedOrder.status}</Badge></p>
                    <p><span className="text-muted-foreground">Payment:</span> <Badge>{selectedOrder.paymentStatus}</Badge></p>
                    <p><span className="text-muted-foreground">Fulfillment:</span> <Badge>{selectedOrder.fulfillmentStatus}</Badge></p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.unitPrice.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${selectedOrder.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${selectedOrder.shippingTotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discountTotal > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${selectedOrder.discountTotal.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="text-primary">${selectedOrder.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                      {selectedOrder.shippingAddress.company && <p>{selectedOrder.shippingAddress.company}</p>}
                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                      {selectedOrder.shippingAddress.addressLine2 && <p>{selectedOrder.shippingAddress.addressLine2}</p>}
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                      {selectedOrder.shippingAddress.phone && <p>{selectedOrder.shippingAddress.phone}</p>}
                    </div>
                  </div>
                </>
              )}

              {selectedOrder.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Order Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
