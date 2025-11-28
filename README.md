# Terra Cotta CCMS

An enterprise-grade composable content and commerce management system built on GitHub Spark, unifying powerful content management, e-commerce capabilities, analytics, and AI-driven features into a single, high-performance platform for digital experiences.

## 🚀 Quick Start

```bash
# Start development server
npm run dev

# Access at http://localhost:5000

# Run linting
npm run lint

# Build for production
npm run build
```

## 📦 Project Structure

```
/workspaces/spark-template/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # 40+ shadcn components
│   │   ├── auth/           # Authentication & authorization
│   │   ├── analytics/      # Analytics components
│   │   ├── cms/            # CMS components
│   │   └── commerce/       # Commerce components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── types/              # Shared TypeScript interfaces
│   ├── styles/             # CSS files
│   ├── App.tsx             # Main application
│   └── index.css           # Theme and styles
├── .devcontainer/          # Dev container configuration
├── packages/               # Workspace packages
├── PRD.md                  # Product requirements
├── FOUNDATION.md           # Infrastructure documentation
└── README.md               # This file
```

## 🏗️ Foundation Architecture

Terra Cotta CCMS is built on the **GitHub Spark** runtime - a specialized React/TypeScript environment optimized for browser-based applications with server-side persistence.

### Key Technologies

- **Frontend:** React 19 + TypeScript 5.7
- **Styling:** Tailwind CSS v4 + shadcn/ui v4
- **Build Tool:** Vite 6.4
- **State Management:** React hooks + Spark KV
- **Runtime:** GitHub Spark SDK
- **UI Components:** 40+ production-ready shadcn components
- **Icons:** Phosphor Icons + Lucide React

### Why Not Traditional Infrastructure?

This project uses the Spark runtime, which provides:
- ✅ Built-in data persistence via `spark.kv`
- ✅ AI capabilities via `spark.llm`
- ✅ User context via `spark.user()`
- ✅ No backend server needed
- ✅ No database containers
- ✅ No object storage setup

For detailed architecture decisions, see [FOUNDATION.md](./FOUNDATION.md).

## 🎨 Key Features

### Authentication & Authorization
- User, role, and permission management
- Session tracking with device details
- API key management with scopes
- Comprehensive audit logging
- Password policies and 2FA configuration

### Content Management System
- Block-based page editor
- Content fragments and models
- Media library with organization
- Taxonomies for content organization
- Multi-site support

### Commerce Platform
- Product catalog (supports millions of SKUs)
- Category management
- Flexible pricing (tiered, B2B, promotional)
- Inventory tracking across warehouses
- Order management and fulfillment
- Customer and company management
- Quote management for B2B
- Promotions and subscriptions

### Analytics Platform
- Real-time dashboard
- Customer journey tracking
- Funnel analysis
- Attribution modeling
- A/B testing
- AI-powered anomaly detection
- Audience segmentation
- Custom report builder

### AI Services
- Content generation and summarization
- Translation services
- Product description generation
- Image analysis and alt text
- Semantic search
- Anomaly detection
- Propensity scoring
- Natural language queries
- Accessibility checking

### Color Tools
- Palette generation with color harmony
- Image color extraction
- Gradient builder
- Multi-format export (HEX, RGB, HSL, etc.)

## 🔧 Development

### Adding Dependencies

```bash
# Check installed packages first
npm list --depth=0

# Install new package (browser-compatible only!)
npm install <package-name>
```

**Important:** Only install isomorphic or browser-compatible packages. Node-only packages will break the application.

### Data Persistence

Always use the `useKV` hook for persistent data:

```typescript
import { useKV } from '@github/spark/hooks'

// ✅ CORRECT - Persistent data
const [todos, setTodos] = useKV("user-todos", [])

// Update with functional form to avoid stale closures
setTodos((current) => [...current, newTodo])

// ❌ WRONG - Don't use localStorage
localStorage.setItem('todos', JSON.stringify(todos))
```

Use regular `useState` for temporary UI state:

```typescript
import { useState } from 'react'

// ✅ CORRECT - Temporary state
const [isOpen, setIsOpen] = useState(false)
const [inputValue, setInputValue] = useState("")
```

### Using AI Features

```typescript
// Create prompts with spark.llmPrompt
const prompt = spark.llmPrompt`Generate a summary of: ${content}`

// Execute LLM calls
const result = await spark.llm(prompt, "gpt-4o")

// JSON mode for structured output
const jsonResult = await spark.llm(prompt, "gpt-4o", true)
```

### Shared Types

All TypeScript interfaces are in `src/types/`:

```typescript
import { User, Product, Order } from '@/types'
import { AIContentRequest, AIContentResponse } from '@/types/ai'
```

## 🎯 Development Workflow

1. **Create components** in `src/components/`
2. **Use shadcn components** from `@/components/ui/`
3. **Add icons** from `@phosphor-icons/react`
4. **Style with Tailwind** utility classes
5. **Persist data** with `useKV` hook
6. **Add types** in `src/types/`
7. **Create hooks** in `src/hooks/`
8. **Utilities** in `src/lib/`

## 📚 Documentation

- [FOUNDATION.md](./FOUNDATION.md) - Complete infrastructure documentation
- [PRD.md](./PRD.md) - Product requirements and design system
- [SECURITY.md](./SECURITY.md) - Security guidelines

## 🧪 Code Quality

```bash
# Run ESLint
npm run lint

# Type checking is automatic via TypeScript
```

## 🌟 Design System

Terra Cotta uses a triadic color scheme with nature-inspired palette:

- **Primary:** Terracotta (oklch(0.61 0.12 35))
- **Secondary:** Deep slate (oklch(0.28 0.02 240))
- **Accent:** Vibrant teal (oklch(0.65 0.13 195))

**Typography:**
- Interface: Inter (400, 500, 600, 700)
- Content: Literata (400, 600)
- Code: JetBrains Mono (400)

**Component Library:** shadcn/ui v4 with Radix UI primitives

## 🔒 Security

- Role-based access control (RBAC)
- Session management with device tracking
- API key scoping and expiration
- Audit logging for all actions
- Password policies with complexity requirements
- 2FA support (authenticator, SMS, email)

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🤝 Contributing

This is an enterprise application built with GitHub Spark. Follow the established patterns in the codebase and maintain the design system consistency.

---

**Built with ❤️ using GitHub Spark**
