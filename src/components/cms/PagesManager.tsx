import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Plus, 
  MagnifyingGlass, 
  Pencil, 
  Trash, 
  Eye,
  CheckCircle,
  Clock,
  Archive,
  Article,
  CalendarBlank,
  TreeStructure
} from '@phosphor-icons/react'
import type { Page } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { PageEditor } from './PageEditor'

const statusConfig = {
  draft: { icon: Clock, color: 'text-yellow-600', label: 'Draft' },
  published: { icon: CheckCircle, color: 'text-green-600', label: 'Published' },
  scheduled: { icon: CalendarBlank, color: 'text-blue-600', label: 'Scheduled' },
  archived: { icon: Archive, color: 'text-gray-500', label: 'Archived' },
}

export function PagesManager() {
  const [pages, setPages] = useKV<Page[]>('cms-pages', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)

  const filteredPages = (pages || []).filter(page => {
    const matchesSearch = page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    setPages(current => (current || []).filter(page => page.id !== id))
    toast.success('Page deleted')
  }

  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingPage(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pages</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your pages and page hierarchy</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingPage(null)}>
              <Plus size={20} weight="bold" />
              New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPage ? 'Edit Page' : 'Create New Page'}</DialogTitle>
            </DialogHeader>
            <PageEditor 
              page={editingPage}
              onClose={handleClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search pages by slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPages.length === 0 ? (
        <Card className="p-12 text-center">
          <Article size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No pages found</h3>
          <p className="text-muted-foreground mb-4">Create your first page to get started</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={20} weight="bold" className="mr-2" />
            Create Page
          </Button>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Versions</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map(page => {
                const StatusIcon = statusConfig[page.status].icon
                return (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {page.parentId && <TreeStructure size={16} className="text-muted-foreground" />}
                        /{page.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{page.template}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon size={16} weight="fill" className={statusConfig[page.status].color} />
                        <span className="text-sm">{statusConfig[page.status].label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{page.versions?.length || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(page)}
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(page.id)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
