import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react'

type KpiCardProps = {
  label: string
  value: string | number
  icon: LucideIcon
  change?: string
  trend?: 'up' | 'down'
  accent?: boolean
}

export default function KpiCard({ label, value, icon: Icon, change, trend = 'up', accent }: KpiCardProps) {
  if (accent) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-orange-600 p-5 text-white shadow-lg shadow-orange-200/50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-orange-100">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            {change && <p className="mt-2 flex items-center gap-1 text-xs text-orange-100"><TrendingUp size={12} /> {change}</p>}
          </div>
          <div className="rounded-xl bg-white/20 p-2.5"><Icon size={22} /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{value}</p>
          {change && (
            <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {change}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-orange-50 p-2.5 text-brand"><Icon size={22} /></div>
      </div>
    </div>
  )
}
