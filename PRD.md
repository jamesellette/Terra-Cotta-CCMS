# Terra Cotta CCMS - Product Requirements Document

Terra Cotta CCMS is an enterprise-grade composable content and commerce management system that unifies powerful content management, e-commerce capabilities, analytics, and AI-driven features into a single, high-performance platform for digital experiences.

**Experience Qualities**:
1. **Professional** - Enterprise-ready interface that communicates reliability and sophistication through clear hierarchy and refined interactions
2. **Efficient** - Streamlined workflows that enable rapid content creation, management, and commerce operations with minimal friction
3. **Intelligent** - AI-powered features that feel natural and helpful, enhancing productivity without overwhelming the user

**Complexity Level**: Complex Application (advanced functionality, accounts)
This is a comprehensive enterprise platform requiring sophisticated state management, multiple interconnected features, user authentication, real-time analytics, AI integration, and advanced data visualization capabilities.

## Essential Features

### 1. Dashboard Overview
- **Functionality**: Central command center displaying key metrics, recent activity, and quick actions
- **Purpose**: Provides at-a-glance system health and enables rapid navigation to critical functions
- **Trigger**: Default landing page after authentication
- **Progression**: Login → Dashboard loads with animated metric cards → User scans KPIs → Clicks quick action or navigates via sidebar
- **Success criteria**: All metrics load within 1 second, navigation to any section completes in under 2 clicks

### 2. Content Management System (CMS)
- **Functionality**: Comprehensive CMS with pages, content fragments, media library, taxonomies, sites, and content models
- **Purpose**: Enables enterprise-grade content management with structured data, reusable components, and multisite support
- **Trigger**: Navigate to Content section via sidebar
- **Progression**: Select module tab (Pages/Fragments/Models/Media/Taxonomy/Sites) → Browse/search items → Create/edit → Configure settings → Save with versioning
- **Success criteria**: Block-based page editor works smoothly, versioning preserves history, media uploads organize properly, taxonomies enable content organization, content models define reusable schemas

### 3. Commerce Management
- **Functionality**: Product catalog management, pricing, inventory tracking, and order processing
- **Purpose**: Complete e-commerce operations from product creation to order fulfillment
- **Trigger**: Navigate to Commerce section
- **Progression**: Products view → Add/edit product → Configure pricing/inventory → Save → View orders → Process order → Update status
- **Success criteria**: Real-time inventory updates, order status changes reflect immediately, product images upload and display correctly

### 4. Analytics Dashboard
- **Functionality**: Visual data representation of content performance, commerce metrics, and user engagement
- **Purpose**: Data-driven insights for content optimization and business decisions
- **Trigger**: Navigate to Analytics section
- **Progression**: Analytics overview → Select metric category → Filter by date range → View detailed charts → Export data
- **Success criteria**: Charts render within 1 second, data updates reflect latest information, export generates complete dataset

### 5. AI Assistant
- **Functionality**: Contextual AI help for content generation, optimization suggestions, and predictive insights
- **Purpose**: Accelerates content creation and provides intelligent recommendations
- **Trigger**: Click AI assistant icon or use keyboard shortcut
- **Progression**: Open assistant panel → Enter prompt or select template → AI generates content → Review and edit → Accept or regenerate → Insert into content
- **Success criteria**: Response generation under 3 seconds, suggestions are contextually relevant, seamless integration into workflow

### 6. Media Library (Integrated in CMS)
- **Functionality**: Centralized asset management for images, videos, documents with organization and search
- **Purpose**: Efficient storage, retrieval, and reuse of digital assets across content and commerce
- **Trigger**: Access from Content → Media tab
- **Progression**: Browse media grid → Search/filter by type → Upload new assets → View details → Download or delete
- **Success criteria**: Grid layout displays assets clearly, filtering works instantly, upload creates properly sized entries

### 7. User & Permissions Management
- **Functionality**: Team member management with role-based access control and activity tracking
- **Purpose**: Security and workflow management through granular permission controls
- **Trigger**: Navigate to Settings → Users section (admin only)
- **Progression**: Users list → Invite new user → Assign role → Set permissions → User receives invitation → Logs in with assigned access
- **Success criteria**: Permissions enforce correctly, audit log tracks all changes, invitation email delivers within 1 minute

## Edge Case Handling

- **Network Interruption**: Auto-save drafts locally, queue actions for retry, display clear connectivity status with retry options
- **Concurrent Editing**: Detect conflicts, show who's editing, merge changes intelligently, prompt user to resolve conflicts
- **Large Dataset Loading**: Implement virtualization, paginate results, show progressive loading states, never freeze UI
- **Invalid Data Input**: Inline validation with helpful error messages, prevent submission until resolved, suggest corrections
- **Asset Upload Failures**: Show upload progress, retry failed uploads automatically, support resume for large files
- **Permission Denial**: Display friendly access-denied state with instructions, redirect to appropriate view
- **Empty States**: Guide users toward first actions with illustrations and clear CTAs rather than blank screens
- **AI Service Unavailable**: Graceful degradation, cache recent responses, provide manual alternatives

## Design Direction

The design should evoke confidence and capability—a professional tool that feels powerful yet approachable. It should communicate enterprise-grade reliability while remaining human-centered. The interface should feel cutting-edge but timeless, with a clean aesthetic that emphasizes content over chrome. A minimal interface serves best, allowing content and data to take center stage while providing powerful tools exactly when needed through progressive disclosure.

## Color Selection

**Triadic** color scheme with a nature-inspired palette that honors the "Terra Cotta" name while maintaining professional credibility. The terracotta earth tones ground the interface in warmth and approachability, while teal and slate provide technological sophistication and data clarity.

- **Primary Color**: Rich terracotta (oklch(0.61 0.12 35)) - Communicates warmth, earth, craftsmanship, and organic creativity; used for primary actions and brand elements
- **Secondary Colors**: 
  - Deep slate (oklch(0.28 0.02 240)) - Professional, technical, trustworthy; used for navigation, headers, and structural elements
  - Vibrant teal (oklch(0.65 0.13 195)) - Fresh, intelligent, data-focused; used for accent elements, AI features, and data visualization
- **Accent Color**: Bright coral (oklch(0.72 0.15 25)) - Energetic and attention-grabbing; used for notifications, CTAs, and important alerts
- **Foreground/Background Pairings**:
  - Background (Warm white oklch(0.98 0.01 35)): Dark slate text (oklch(0.22 0.02 240)) - Ratio 14.8:1 ✓
  - Card (Pure white oklch(1 0 0)): Dark slate text (oklch(0.22 0.02 240)) - Ratio 16.2:1 ✓
  - Primary (Terracotta oklch(0.61 0.12 35)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Secondary (Light slate oklch(0.94 0.01 240)): Dark slate text (oklch(0.22 0.02 240)) - Ratio 14.1:1 ✓
  - Accent (Coral oklch(0.72 0.15 25)): Dark slate text (oklch(0.22 0.02 240)) - Ratio 6.8:1 ✓
  - Muted (Soft terracotta oklch(0.95 0.02 35)): Medium slate text (oklch(0.50 0.02 240)) - Ratio 5.2:1 ✓

## Font Selection

Typography should convey modern professionalism with excellent readability for extended use, balancing data density with content creation comfort. Inter for interface elements provides geometric precision and technical credibility, while Literata for content areas offers editorial warmth and reading comfort.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold / 32px / -0.02em letter spacing / 1.2 line height
  - H2 (Section Header): Inter Semibold / 24px / -0.01em letter spacing / 1.3 line height  
  - H3 (Subsection): Inter Semibold / 18px / normal letter spacing / 1.4 line height
  - Body (Interface Text): Inter Regular / 14px / normal letter spacing / 1.5 line height
  - Body Large (Content): Literata Regular / 16px / normal letter spacing / 1.6 line height
  - Label (Form Fields): Inter Medium / 12px / 0.01em letter spacing / 1.4 line height
  - Caption (Metadata): Inter Regular / 12px / normal letter spacing / 1.4 line height
  - Code (Technical): JetBrains Mono / 13px / normal letter spacing / 1.5 line height

## Animations

Animations should feel responsive and purposeful—never decorative. Motion communicates relationships between elements, provides feedback for actions, and guides attention to important changes. The animation style should feel refined and precise with a slight ease-out curve that suggests both intelligence and responsiveness, appropriate for an enterprise tool where efficiency matters.

- **Purposeful Meaning**: Smooth page transitions communicate spatial relationships; loading animations reassure users during processing; success confirmations provide emotional satisfaction; data visualization animations help users understand changing metrics
- **Hierarchy of Movement**: Primary actions (saving, publishing) get subtle scale feedback; navigation transitions use smooth slides; metric changes animate values counting up; AI responses type in progressively; secondary actions use simple fades

## Component Selection

- **Components**:
  - **Sidebar**: Persistent navigation with collapsible sections, icons + labels, active state highlighting
  - **Card**: Metric cards, content previews, product tiles - use shadow-sm for subtle elevation
  - **Button**: Primary (terracotta fill), Secondary (slate outline), Ghost (icon-only actions) - variants for all contexts
  - **Table**: Sortable columns, row selection, pagination for content and product lists
  - **Dialog**: Modal overlays for forms, confirmations, detailed views - use for focused tasks
  - **Sheet**: Slide-in panels for AI assistant, quick edit, filters - contextual side panels
  - **Tabs**: Content organization, settings sections, multi-view data displays
  - **Form Components**: Input, Textarea, Select, Checkbox, Switch with clear validation states
  - **Badge**: Status indicators (published, draft, active), category tags, notification counts
  - **Avatar**: User profile indicators, activity logs, team member lists
  - **Tooltip**: Contextual help, icon explanations, keyboard shortcuts - use sparingly
  - **Dropdown Menu**: Action menus, filters, user menu - triggered from button or context
  - **Progress**: Upload status, processing indicators, goal tracking
  - **Calendar**: Date selection for scheduling, analytics date ranges
  - **Popover**: Non-modal info displays, quick actions, color pickers
  - **Scroll Area**: Long lists, content previews, sidebar navigation
  - **Separator**: Visual section breaks without heaviness

- **Customizations**:
  - **Stat Card**: Custom component combining Card with animated number displays and trend indicators
  - **Rich Text Editor**: Custom toolbar with formatting options, media insertion, AI suggestions
  - **Chart Widgets**: Recharts-based custom visualizations for analytics (line, bar, pie, area charts)
  - **AI Chat Interface**: Custom panel with message history, prompt suggestions, regeneration controls
  - **Media Grid**: Custom responsive grid with hover previews, drag-drop upload zones
  - **Status Timeline**: Custom vertical timeline for order processing and content workflow

- **States**:
  - Buttons: Default with subtle shadow → Hover lifts slightly → Active scales down → Disabled at 50% opacity
  - Inputs: Border changes to primary color on focus, inline error state shows red border + message
  - Cards: Subtle hover lift for interactive cards, selected state with primary border
  - Lists: Row hover background, selected rows with checkbox, loading state shows skeleton

- **Icon Selection**:
  - Navigation: House (dashboard), Article (content), ShoppingCart (commerce), ChartLine (analytics)
  - Actions: Plus (create), Pencil (edit), Trash (delete), Check (save), X (cancel), MagnifyingGlass (search)
  - Content: Image, Video, File, Link, Code, TextT (formatting)
  - Status: CheckCircle (success), Warning (alert), Info, Clock (pending)
  - AI: Sparkle (AI assistant), Robot, Brain, MagicWand (suggestions)
  - User: User, Users (team), Gear (settings), SignOut
  - Commerce: Package (orders), Tag (pricing), Barcode (inventory), CreditCard (payments)

- **Spacing**:
  - Component padding: p-4 (16px) for cards, p-6 (24px) for major sections
  - Element gaps: gap-2 (8px) for related items, gap-4 (16px) for component groups, gap-8 (32px) for sections
  - Form fields: mb-4 between fields, mb-6 between field groups
  - Page margins: px-6 py-4 for content areas, px-4 for mobile

- **Mobile**:
  - Sidebar collapses to bottom navigation bar with icons only
  - Data tables switch to card layout with key information visible
  - Forms stack vertically with full-width inputs
  - Charts resize and simplify, hiding secondary data on small screens
  - Sheet panels take full screen on mobile
  - Touch targets minimum 44px, increased spacing between interactive elements
  - Metric cards stack vertically instead of grid layout
  - AI assistant becomes full-screen modal instead of side panel
