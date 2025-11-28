import { useState } from 'react'
import { 
  House, 
  Article, 
  ShoppingCart, 
  ChartLine, 
  Sparkle,
  List,
  X,
  Robot,
  Palette
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dashboard } from '@/components/Dashboard'
import { Content } from '@/components/Content'
import { Commerce } from '@/components/Commerce'
import { Analytics } from '@/components/Analytics'
import { AIAssistant } from '@/components/AIAssistant'
import { AIServices } from '@/components/AIServices'
import { ColorWheel } from '@/components/ColorWheel'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

type View = 'dashboard' | 'content' | 'commerce' | 'analytics' | 'ai-services' | 'color-wheel'

const navItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: House },
  { id: 'content' as View, label: 'Content', icon: Article },
  { id: 'commerce' as View, label: 'Commerce', icon: ShoppingCart },
  { id: 'analytics' as View, label: 'Analytics', icon: ChartLine },
  { id: 'ai-services' as View, label: 'AI Services', icon: Robot },
  { id: 'color-wheel' as View, label: 'Color Wheel', icon: Palette },
]

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [aiOpen, setAiOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'content':
        return <Content />
      case 'commerce':
        return <Commerce />
      case 'analytics':
        return <Analytics />
      case 'ai-services':
        return <AIServices />
      case 'color-wheel':
        return <ColorWheel />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-teal" />
          <span className="font-bold text-lg">Terra Cotta</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <List size={24} />}
        </Button>
      </div>

      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-slate text-slate-foreground z-50 transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-teal flex-shrink-0" />
            <div>
              <h1 className="font-bold text-lg leading-none">Terra Cotta</h1>
              <p className="text-xs text-slate-foreground/60 mt-1">CCMS Platform</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id)
                  setSidebarOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                  isActive
                    ? "bg-white/10 text-white font-medium"
                    : "text-slate-foreground/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} weight={isActive ? "fill" : "regular"} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Button
            onClick={() => setAiOpen(true)}
            className="w-full gap-2 bg-gradient-to-r from-primary to-teal hover:opacity-90"
            size="lg"
          >
            <Sparkle size={20} weight="fill" />
            AI Assistant
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6 lg:p-8">
          {renderView()}
        </div>
      </main>

      <Button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-primary to-teal hover:opacity-90 lg:hidden"
        size="icon"
      >
        <Sparkle size={24} weight="fill" />
      </Button>

      <AIAssistant open={aiOpen} onOpenChange={setAiOpen} />
      <Toaster />
    </div>
  )
}

export default App
