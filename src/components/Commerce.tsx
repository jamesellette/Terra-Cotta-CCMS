import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package,
  ShoppingCart,
  Tag,
  Users,
  Warehouse,
  FileText,
  ChartLine,
  SquaresFour
} from '@phosphor-icons/react'
import { ProductCatalog } from '@/components/commerce/ProductCatalog'
import { OrderManagement } from '@/components/commerce/OrderManagement'
import { CategoryManagement } from '@/components/commerce/CategoryManagement'
import { PricingManagement } from '@/components/commerce/PricingManagement'
import { InventoryManagement } from '@/components/commerce/InventoryManagement'
import { CustomerManagement } from '@/components/commerce/CustomerManagement'
import { PromotionsManagement } from '@/components/commerce/PromotionsManagement'
import { QuoteManagement } from '@/components/commerce/QuoteManagement'

export function Commerce() {
  const [activeTab, setActiveTab] = useState('products')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commerce Engine</h1>
          <p className="text-muted-foreground mt-1">Manage products, orders, inventory, and customers</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
          <TabsTrigger value="products" className="gap-2 py-3">
            <Package size={18} />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 py-3">
            <SquaresFour size={18} />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2 py-3">
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2 py-3">
            <Warehouse size={18} />
            <span className="hidden sm:inline">Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="gap-2 py-3">
            <Tag size={18} />
            <span className="hidden sm:inline">Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="gap-2 py-3">
            <Users size={18} />
            <span className="hidden sm:inline">Customers</span>
          </TabsTrigger>
          <TabsTrigger value="promotions" className="gap-2 py-3">
            <ChartLine size={18} />
            <span className="hidden sm:inline">Promos</span>
          </TabsTrigger>
          <TabsTrigger value="quotes" className="gap-2 py-3">
            <FileText size={18} />
            <span className="hidden sm:inline">Quotes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <ProductCatalog />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <PricingManagement />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <CustomerManagement />
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <PromotionsManagement />
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          <QuoteManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
