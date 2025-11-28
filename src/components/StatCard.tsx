import { Card } from '@/components/ui/card'
import { ArrowUp, ArrowDown, Minus } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface StatCardProps {
  label: string
  value: number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  delay?: number
}

export function StatCard({ label, value, change, trend, icon, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {displayValue.toLocaleString()}
            </p>
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trendColor}`}>
              <TrendIcon size={16} weight="bold" />
              <span>{Math.abs(change)}%</span>
            </div>
          </div>
          <div className="text-primary/20">
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
