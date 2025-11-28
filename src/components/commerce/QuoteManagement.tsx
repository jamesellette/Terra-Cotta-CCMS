import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, FileText, MagnifyingGlass, Eye, Pencil } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Quote, Customer } from '@/lib/types'

export function QuoteManagement() {
  const [quotes, setQuotes] = useKV<Quote[]>('commerce-quotes', [])
  const [customers] = useKV<Customer[]>('commerce-customers', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredQuotes = (quotes || []).filter(quote => {
    const matchesSearch = quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || quote.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleUpdateQuoteStatus = (quoteId: string, newStatus: Quote['status']) => {
    setQuotes(current =>
      (current || []).map(quote =>
        quote.id === quoteId
          ? { ...quote, status: newStatus, updatedAt: new Date().toISOString() }
          : quote
      )
    )
    toast.success('Quote status updated')
  }

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Quotes</div>
          <div className="text-2xl font-bold">{(quotes || []).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Sent</div>
          <div className="text-2xl font-bold text-blue-600">
            {(quotes || []).filter(q => q.status === 'sent').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Accepted</div>
          <div className="text-2xl font-bold text-green-600">
            {(quotes || []).filter(q => q.status === 'accepted').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Converted</div>
          <div className="text-2xl font-bold text-primary">
            {(quotes || []).filter(q => q.status === 'converted').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Value</div>
          <div className="text-2xl font-bold">
            ${(quotes || []).reduce((sum, q) => sum + q.grandTotal, 0).toFixed(2)}
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search quotes by number..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredQuotes.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quotes found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Quotes for B2B customers will appear here'
              }
            </p>
          </Card>
        ) : (
          filteredQuotes.map(quote => {
            const customer = (customers || []).find(c => c.id === quote.customerId)
            const isExpired = new Date(quote.expiresAt) < new Date()
            
            return (
              <Card key={quote.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold">{quote.quoteNumber}</h3>
                      <Badge variant={
                        quote.status === 'accepted' ? 'default' :
                        quote.status === 'converted' ? 'default' :
                        quote.status === 'declined' || isExpired ? 'destructive' :
                        'secondary'
                      }>
                        {isExpired && quote.status === 'sent' ? 'expired' : quote.status}
                      </Badge>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p>Customer: <span className="text-foreground font-medium">
                        {customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'}
                      </span></p>
                      <p>Items: <span className="text-foreground font-medium">{quote.items.length}</span></p>
                      <p>Total: <span className="text-foreground font-bold text-primary">${quote.grandTotal.toFixed(2)}</span></p>
                      <p>Expires: <span className={isExpired ? 'text-destructive font-medium' : 'text-foreground'}>
                        {new Date(quote.expiresAt).toLocaleDateString()}
                      </span></p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Select
                      value={quote.status}
                      onValueChange={(value) => handleUpdateQuoteStatus(quote.id, value as Quote['status'])}
                    >
                      <SelectTrigger className="w-full lg:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleViewDetails(quote)}
                    >
                      <Eye size={16} />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quote Details - {selectedQuote?.quoteNumber}</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="text-sm space-y-1">
                    {(() => {
                      const customer = (customers || []).find(c => c.id === selectedQuote.customerId)
                      return customer ? (
                        <>
                          <p><span className="text-muted-foreground">Name:</span> {customer.firstName} {customer.lastName}</p>
                          <p><span className="text-muted-foreground">Email:</span> {customer.email}</p>
                        </>
                      ) : <p className="text-muted-foreground">Customer not found</p>
                    })()}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quote Status</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Status:</span> <Badge>{selectedQuote.status}</Badge></p>
                    <p><span className="text-muted-foreground">Expires:</span> {new Date(selectedQuote.expiresAt).toLocaleDateString()}</p>
                    <p><span className="text-muted-foreground">Created:</span> {new Date(selectedQuote.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Quote Items</h4>
                <div className="space-y-2">
                  {selectedQuote.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        {item.discountPercentage && (
                          <p className="text-sm text-green-600">Discount: {item.discountPercentage}%</p>
                        )}
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
                  <span>${selectedQuote.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${selectedQuote.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${selectedQuote.shippingTotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="text-primary">${selectedQuote.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {selectedQuote.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedQuote.notes}</p>
                  </div>
                </>
              )}

              {selectedQuote.terms && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Terms & Conditions</h4>
                    <p className="text-sm text-muted-foreground">{selectedQuote.terms}</p>
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
