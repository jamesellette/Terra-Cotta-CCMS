# Terra Cotta CCMS - Developer Quick Reference

## 🚀 Common Commands

```bash
npm run dev          # Start dev server (port 5000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm list --depth=0   # Check installed packages
```

## 📁 File Organization

```
src/
├── components/       # All React components
│   ├── ui/          # shadcn components (DON'T EDIT)
│   ├── auth/        # Auth & security features
│   ├── analytics/   # Analytics features
│   ├── cms/         # CMS features
│   └── commerce/    # Commerce features
├── hooks/           # Custom hooks (useKV, use-mobile, etc.)
├── lib/             # Utilities (cn helper, etc.)
├── types/           # TypeScript interfaces
└── styles/          # CSS files
```

## 🎯 Path Aliases

```typescript
import { Button } from '@/components/ui/button'
import { useKV } from '@github/spark/hooks'
import { User } from '@/types'
import { cn } from '@/lib/utils'
```

## 💾 Data Persistence

### Use `useKV` for persistent data

```typescript
import { useKV } from '@github/spark/hooks'

// Initialize with default value
const [users, setUsers] = useKV<User[]>("users", [])

// ✅ ALWAYS use functional updates
setUsers((current) => [...current, newUser])
setUsers((current) => current.filter(u => u.id !== userId))
setUsers((current) => current.map(u => 
  u.id === userId ? { ...u, ...updates } : u
))

// ❌ NEVER reference stale closure
setUsers([...users, newUser]) // WRONG!
```

### Use `useState` for temporary state

```typescript
import { useState } from 'react'

// UI state that doesn't need persistence
const [isOpen, setIsOpen] = useState(false)
const [inputValue, setInputValue] = useState("")
const [selectedTab, setSelectedTab] = useState("overview")
```

## 🤖 AI Integration

```typescript
// Create prompt (REQUIRED pattern)
const prompt = spark.llmPrompt`Generate content about: ${topic}`

// Basic LLM call
const response = await spark.llm(prompt)

// With model selection
const response = await spark.llm(prompt, "gpt-4o-mini")

// JSON mode (returns string-encoded JSON)
const json = await spark.llm(prompt, "gpt-4o", true)
const data = JSON.parse(json)

// For arrays in JSON mode, use object wrapper:
const prompt = spark.llmPrompt`Return JSON object with "items" array property`
```

## 👤 User Context

```typescript
const user = await spark.user()
// { id, login, email, avatarUrl, isOwner }

if (user.isOwner) {
  // Show admin features
}
```

## 🎨 Styling

### Tailwind Classes

```typescript
// Layout
<div className="flex items-center gap-4 p-6">
<div className="grid grid-cols-3 gap-6">

// Spacing (use gap, not margins between children)
<div className="flex gap-2">      // 8px
<div className="flex gap-4">      // 16px
<div className="p-4">             // padding 16px
<div className="p-6">             // padding 24px

// Colors (use theme variables)
className="bg-primary text-primary-foreground"
className="bg-card text-card-foreground"
className="bg-accent text-accent-foreground"
className="text-teal" // custom color

// Typography
className="text-lg font-semibold"
className="text-sm text-muted-foreground"

// Borders and Radius
className="border rounded-lg"
className="border-border"
className="rounded-md"
```

### Custom Theme Colors

```css
/* Available in index.css */
--primary: oklch(0.61 0.12 35)
--accent: oklch(0.72 0.15 25)
--teal: oklch(0.65 0.13 195)
--slate: oklch(0.28 0.02 240)
```

## 🧩 shadcn Components

### Import Pattern

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
```

### Common Components

```typescript
// Buttons
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Cards
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>

// Forms
<Input type="text" placeholder="Enter text" />
<Textarea placeholder="Enter description" />
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
<Checkbox />
<Switch />

// Overlays
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>

<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>

// Tabs
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>

// Toasts
import { toast } from 'sonner'
toast.success("Success message")
toast.error("Error message")
toast.info("Info message")
```

## 🎭 Icons

### Phosphor Icons (Primary)

```typescript
import { 
  Plus, Pencil, Trash, Check, X, 
  MagnifyingGlass, User, Gear, House,
  Article, ShoppingCart, ChartLine,
  Sparkle, Robot, Palette, Shield
} from '@phosphor-icons/react'

<Plus size={20} />
<Pencil size={20} weight="fill" />
<User size={24} weight="bold" />
```

### Lucide React (Alternative)

```typescript
import { ChevronRight, MoreVertical, Filter } from 'lucide-react'
```

## 📊 TypeScript Types

```typescript
import { User, Role, Permission } from '@/types/auth'
import { Product, Order, Customer } from '@/types/commerce'
import { Page, ContentBlock, MediaAsset } from '@/types/content'
import { AnalyticsMetric, ABTest } from '@/types/analytics'
import { AIContentRequest } from '@/types/ai'
```

## 🔧 Custom Hooks

```typescript
// Responsive breakpoint
import { useIsMobile } from '@/hooks/use-mobile'
const isMobile = useIsMobile() // true if < 768px

// Create custom hooks in src/hooks/
export function useDebounce<T>(value: T, delay: number): T {
  // implementation
}
```

## 🛠️ Utilities

```typescript
import { cn } from '@/lib/utils'

// Merge Tailwind classes
const buttonClasses = cn(
  "px-4 py-2 rounded-lg",
  isActive && "bg-primary",
  isDisabled && "opacity-50 cursor-not-allowed"
)
```

## 📝 Component Template

```typescript
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [items, setItems] = useKV<User[]>("my-items", [])
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = () => {
    setItems((current) => [...current, newItem])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Button onClick={handleAdd} size="sm">
            <Plus size={16} />
            Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  )
}
```

## 🚫 Common Mistakes

### ❌ DON'T

```typescript
// Don't use localStorage
localStorage.setItem('key', value)

// Don't reference stale closure with useKV
const [items, setItems] = useKV("items", [])
setItems([...items, newItem]) // WRONG!

// Don't modify Vite config or main.tsx
// Don't edit files in src/components/ui/

// Don't install Node-only packages
npm install fs-extra  // WRONG - not browser compatible
```

### ✅ DO

```typescript
// Use useKV for persistence
const [items, setItems] = useKV("items", [])
setItems((current) => [...current, newItem]) // CORRECT!

// Use useState for temporary state
const [isOpen, setIsOpen] = useState(false)

// Install browser-compatible packages only
npm install date-fns  // CORRECT - isomorphic
```

## 📚 Resources

- **PRD:** See PRD.md for design system and feature specs
- **Foundation:** See FOUNDATION.md for architecture details
- **shadcn docs:** https://ui.shadcn.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Phosphor Icons:** https://phosphoricons.com/

## 🎯 Development Checklist

- [ ] Check `npm list` before installing packages
- [ ] Use `useKV` for persistent data
- [ ] Use functional updates with `useKV`
- [ ] Import types from `@/types`
- [ ] Use shadcn components from `@/components/ui`
- [ ] Use Phosphor icons
- [ ] Style with Tailwind utilities
- [ ] Follow theme color variables
- [ ] Test on mobile (< 768px)
- [ ] Run `npm run lint` before committing

---

**Keep this file open while developing!**
