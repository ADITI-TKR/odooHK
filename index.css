import { TrendingDown, TrendingUp } from 'lucide-react'

type StatCardProps = {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  highlight?: boolean
}

export default function StatCard({ label, value, change, trend = 'up', highlight }: StatCardProps) {
  if (highlight) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-brand to-orange-600 p-6 text-white shadow-sm">
        <p className="text-sm text-orange-100">{label}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        {change && (
          <p className="mt-2 flex items-center gap-1 text-xs text-orange-100">
            <TrendingUp size={14} /> {change}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
      {change && (
        <p className={`mt-2 flex items-center gap-1 text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {change}
        </p>
      )}
    </div>
  )
}
