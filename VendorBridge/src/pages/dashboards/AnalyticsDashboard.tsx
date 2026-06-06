import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import StatCard from '../../components/StatCard'
import { api } from '../../lib/api'

export default function AnalyticsDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getAnalyticsDashboard>> | null>(null)
  useEffect(() => { api.getAnalyticsDashboard().then(setData).catch(() => {}) }, [])

  const maxVal = data ? Math.max(...data.monthly.map((d) => Math.max(d.spent, d.budget)), 1) : 1

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-bold">Analytics Dashboard</h1>
      <p className="mb-6 text-sm text-muted">Procurement insights, trends, and vendor performance.</p>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Spend" value={data ? `$${data.totalSpend.toLocaleString()}` : '—'} highlight />
        <StatCard label="Active Vendors" value={data?.activeVendors ?? '—'} />
        <StatCard label="Open RFQs" value={data?.activeRfqs ?? '—'} />
      </div>
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 shadow-sm lg:col-span-2">
          <h2 className="font-serif text-xl font-bold">Monthly Trends</h2>
          <div className="mt-6 flex items-end gap-2" style={{ height: 160 }}>
            {(data?.monthly ?? []).map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 130 }}>
                  <div className="w-3 rounded-t bg-brand" style={{ height: `${(d.spent / maxVal) * 100}%` }} />
                  <div className="w-3 rounded-t bg-gray-200" style={{ height: `${(d.budget / maxVal) * 100}%` }} />
                </div>
                <span className="text-xs text-muted">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-brand to-orange-600 p-6 text-white shadow-sm">
          <p className="text-sm text-orange-100">Budget Utilization</p>
          <p className="mt-2 text-5xl font-bold">78%</p>
          <div className="mt-4 h-2 rounded-full bg-white/30">
            <div className="h-2 w-[78%] rounded-full bg-white" />
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs text-orange-100">
            <TrendingUp size={14} /> On track for Q2
          </p>
        </div>
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold">Vendor Performance</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted">
              <th className="pb-3">Vendor</th>
              <th className="pb-3">Orders</th>
              <th className="pb-3">On-Time</th>
              <th className="pb-3">Rating</th>
            </tr>
          </thead>
          <tbody>
            {(data?.vendorPerf ?? []).map((v) => (
              <tr key={v.name} className="border-b border-gray-50">
                <td className="py-3 font-medium">{v.name}</td>
                <td className="py-3">{v.orders}</td>
                <td className="py-3 text-green-600">{v.onTime}</td>
                <td className="py-3 text-brand">{v.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
