import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Users, MagnifyingGlass, Pencil, Trash, User } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Customer, CustomerGroup, Company } from '@/lib/types'

export function CustomerManagement() {
  const [customers, setCustomers] = useKV<Customer[]>('commerce-customers', [])
  const [customerGroups, setCustomerGroups] = useKV<CustomerGroup[]>('commerce-customer-groups', [])
  const [companies, setCompanies] = useKV<Company[]>('commerce-companies', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const filteredCustomers = (customers || []).filter(customer =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSaveCustomer = (formData: Partial<Customer>) => {
    if (editingCustomer) {
      setCustomers(current =>
        (current || []).map(cust =>
          cust.id === editingCustomer.id
            ? { ...cust, ...formData, updatedAt: new Date().toISOString() }
            : cust
        )
      )
      toast.success('Customer updated successfully')
    } else {
      const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        email: formData.email || '',
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        phone: formData.phone,
        companyId: formData.companyId,
        customerGroupIds: formData.customerGroupIds || [],
        tags: formData.tags || [],
        totalSpent: 0,
        orderCount: 0,
        metadata: formData.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCustomers(current => [newCustomer, ...(current || [])])
      toast.success('Customer created successfully')
    }
    setIsDialogOpen(false)
    setEditingCustomer(null)
  }

  const handleDeleteCustomer = (id: string) => {
    setCustomers(current => (current || []).filter(cust => cust.id !== id))
    toast.success('Customer deleted')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Customers</div>
          <div className="text-2xl font-bold">{(customers || []).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Companies</div>
          <div className="text-2xl font-bold">{(companies || []).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Customer Groups</div>
          <div className="text-2xl font-bold">{(customerGroups || []).length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Avg Orders</div>
          <div className="text-2xl font-bold">
            {(customers || []).length > 0
              ? ((customers || []).reduce((sum, c) => sum + c.orderCount, 0) / (customers || []).length).toFixed(1)
              : 0
            }
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingCustomer(null)}>
              <Plus size={20} weight="bold" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            </DialogHeader>
            <CustomerForm
              customer={editingCustomer}
              companies={companies || []}
              onSave={handleSaveCustomer}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingCustomer(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredCustomers.length === 0 ? (
          <Card className="p-12 text-center">
            <Users size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No customers found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search' 
                : 'Add your first customer to get started'
              }
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus size={20} weight="bold" className="mr-2" />
                Add Customer
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map(customer => (
              <Card key={customer.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User size={20} weight="fill" className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold truncate">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                    </div>
                  </div>
                  {customer.phone && (
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Orders:</span>
                      <span className="ml-1 font-semibold">{customer.orderCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Spent:</span>
                      <span className="ml-1 font-semibold text-primary">${customer.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                  {customer.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {customer.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      {customer.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{customer.tags.length - 2}</Badge>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => {
                        setEditingCustomer(customer)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCustomer(customer.id)}
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

function CustomerForm({
  customer,
  companies,
  onSave,
  onCancel
}: {
  customer: Customer | null
  companies: Company[]
  onSave: (data: Partial<Customer>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Customer>>(
    customer || {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      companyId: undefined,
      customerGroupIds: [],
      tags: [],
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
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="John"
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john.doe@example.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
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
          placeholder="vip, wholesale, preferred"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {customer ? 'Update Customer' : 'Add Customer'}
        </Button>
      </div>
    </form>
  )
}
