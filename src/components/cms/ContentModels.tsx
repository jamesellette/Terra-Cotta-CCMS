import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  FileDashed,
  Pencil,
  Trash,
  TextT,
  Hash,
  ToggleLeft,
  CalendarBlank,
  Image as ImageIcon
} from '@phosphor-icons/react'
import type { ContentModel, ContentModelField } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const FIELD_TYPES = [
  { type: 'text', icon: TextT, label: 'Text' },
  { type: 'richtext', icon: TextT, label: 'Rich Text' },
  { type: 'number', icon: Hash, label: 'Number' },
  { type: 'boolean', icon: ToggleLeft, label: 'Boolean' },
  { type: 'date', icon: CalendarBlank, label: 'Date' },
  { type: 'media', icon: ImageIcon, label: 'Media' },
]

export function ContentModels() {
  const [models, setModels] = useKV<ContentModel[]>('cms-models', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<ContentModel | null>(null)

  const handleSave = (formData: Partial<ContentModel>) => {
    if (editingModel) {
      setModels(current => 
        (current || []).map(item => 
          item.id === editingModel.id 
            ? { ...item, ...formData }
            : item
        )
      )
      toast.success('Content model updated')
    } else {
      const newModel: ContentModel = {
        id: Date.now().toString(),
        name: formData.name || 'Untitled Model',
        schema: formData.schema || [],
        description: formData.description,
        createdAt: new Date().toISOString()
      }
      setModels(current => [newModel, ...(current || [])])
      toast.success('Content model created')
    }
    setIsDialogOpen(false)
    setEditingModel(null)
  }

  const handleDelete = (id: string) => {
    setModels(current => (current || []).filter(item => item.id !== id))
    toast.success('Content model deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Models</h2>
          <p className="text-sm text-muted-foreground mt-1">Define structured content schemas</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingModel(null)}>
              <Plus size={20} weight="bold" />
              New Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingModel ? 'Edit Content Model' : 'Create New Content Model'}</DialogTitle>
            </DialogHeader>
            <ModelForm 
              model={editingModel}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingModel(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {(models || []).length === 0 ? (
        <Card className="p-12 text-center">
          <FileDashed size={48} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No content models</h3>
          <p className="text-muted-foreground mb-4">Create structured content schemas</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={20} weight="bold" className="mr-2" />
            Create Model
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {(models || []).map(model => (
            <Card key={model.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileDashed size={20} weight="fill" className="text-primary" />
                    <h3 className="text-lg font-semibold">{model.name}</h3>
                    <Badge variant="secondary">{model.schema.length} fields</Badge>
                  </div>
                  {model.description && (
                    <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {model.schema.map((field, idx) => {
                      const fieldType = FIELD_TYPES.find(t => t.type === field.type)
                      const Icon = fieldType?.icon || TextT
                      return (
                        <Badge key={idx} variant="outline" className="gap-1">
                          <Icon size={12} />
                          {field.name}
                          {field.required && <span className="text-destructive">*</span>}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setEditingModel(model)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(model.id)}
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ModelForm({ 
  model, 
  onSave, 
  onCancel 
}: { 
  model: ContentModel | null
  onSave: (data: Partial<ContentModel>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<ContentModel>>(
    model || {
      name: '',
      description: '',
      schema: [],
    }
  )

  const [isAddingField, setIsAddingField] = useState(false)
  const [newField, setNewField] = useState<ContentModelField>({
    name: '',
    type: 'text',
    required: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleAddField = () => {
    if (!newField.name) return
    setFormData({
      ...formData,
      schema: [...(formData.schema || []), newField]
    })
    setNewField({ name: '', type: 'text', required: false })
    setIsAddingField(false)
  }

  const handleDeleteField = (index: number) => {
    setFormData({
      ...formData,
      schema: (formData.schema || []).filter((_, idx) => idx !== index)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="model-name">Model Name</Label>
        <Input
          id="model-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Article, Product, etc."
          required
        />
      </div>

      <div>
        <Label htmlFor="model-description">Description</Label>
        <Textarea
          id="model-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this content model"
          rows={2}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Fields</Label>
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => setIsAddingField(!isAddingField)}
          >
            <Plus size={16} />
            Add Field
          </Button>
        </div>

        {isAddingField && (
          <Card className="p-4 space-y-3">
            <Input
              value={newField.name}
              onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              placeholder="Field name"
            />
            <Select 
              value={newField.type} 
              onValueChange={(value) => setNewField({ ...newField, type: value as ContentModelField['type'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map(({ type, label }) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="required"
                checked={newField.required}
                onCheckedChange={(checked) => setNewField({ ...newField, required: checked as boolean })}
              />
              <Label htmlFor="required" className="text-sm font-normal cursor-pointer">
                Required field
              </Label>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={handleAddField}>Add</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingField(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {formData.schema && formData.schema.length > 0 && (
          <div className="space-y-2">
            {formData.schema.map((field, idx) => {
              const fieldType = FIELD_TYPES.find(t => t.type === field.type)
              const Icon = fieldType?.icon || TextT
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded border bg-card">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-muted-foreground" />
                    <span className="font-medium text-sm">{field.name}</span>
                    <Badge variant="outline" className="text-xs">{field.type}</Badge>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDeleteField(idx)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {model ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
