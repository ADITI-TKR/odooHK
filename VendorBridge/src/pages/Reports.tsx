import { Download, TrendingUp } from 'lucide-react'
import PageHeader from '../components/PageHeader'

const monthlyData = [
  { month: 'Jan', spent: 45, budget: 60 },
  { month: 'Feb', spent: 52, budget: 60 },
  { month: 'Mar', spent: 38, budget: 55 },
  { month: 'Apr', spent: 65, budget: 70 },
  { month: 'May', spent: 48, budget: 65 },
  { month: 'Jun', spent: 55, budget: 70 },
]

const categories = [
  { name: 'IT Equipment', amount: '$58,200', pct: 41, color: 'bg-brand' },
  { name: 'Office Supplies', amount: '$24,800', pct: 17, color: 'bg-blue-500' },
  { name: 'Manufacturing', amount: '$35,500', pct: 25, color: 'bg-purple-500' },
  { name: 'Facilities', amount: '$24,000', pct: 17, color: 'bg-green-500' },
]

const vendorPerf = [
  { name: 'TechSupply Co.', orders: 12, onTime: '98%', rating: 4.8 },
  { name: 'GlobalParts Inc.', orders: 8, onTime: '95%', rating: 4.6 },
  { name: 'OfficeMart Ltd.', orders: 15, onTime: '92%', rating: 4.2 },
]

export default function Reports() {
  const maxVal = Math.max(...monthlyData.map((d) => Math.max(d.spent, d.budget)))

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Procurement insights, spending trends, and vendor performance."
        action={
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-card px-5 py-2.5 text-sm font-semibold hover:bg-gray-50">
            <Download size={18} /> Export Report
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: 'Total Spend (YTD)', value: '$142,500', change: '+5%' },
          { label: 'Active Vendors', value: '24', change: '+3' },
          { label: 'Avg. Approval Time', value: '2.4 days', change: '-12%' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-6 shadow-sm">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-2 text-3xl font-bold">{s.value}</p>
            <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp size={14} /> {s.change} vs last period
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl bg-card p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">Monthly Procurement Trends</h2>
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-xs">
              <button className="rounded-md bg-card px-3 py-1 font-medium shadow-sm">Monthly</button>
              <button className="rounded-md px-3 py-1 text-muted">Yearly</button>
            </div>
          </div>
          <div className="mt-6 flex items-end gap-3" style={{ height: 200 }}>
            {monthlyData.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center gap-1" style={{ height: 160 }}>
                  <div className="w-3 rounded-t bg-brand" style={{ height: `${(d.spent / maxVal) * 100}%` }} />
                  <div className="w-3 rounded-t bg-gray-200" style={{ height: `${(d.budget / maxVal) * 100}%` }} />
                </div>
                <span className="text-xs text-muted">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-brand" /> Spent</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-gray-200" /> Budget</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-brand to-orange-600 p-6 text-white shadow-sm lg:col-span-2">
          <p className="text-sm text-orange-100">Budget Utilization</p>
          <p className="mt-2 text-5xl font-bold">78%</p>
          <div className="mt-4 h-2 rounded-full bg-white/30">
            <div className="h-2 w-[78%] rounded-full bg-white" />
          </div>
          <p className="mt-2 text-xs text-orange-100">$142,500 of $182,000 annual budget</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold">Spending by Category</h2>
          <div className="mt-4 space-y-4">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted">{c.amount}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-gray-100">
                  <div className={`h-2 rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold">Vendor Performance</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-muted">
                <th className="pb-3 font-medium">Vendor</th>
                <th className="pb-3 font-medium">Orders</th>
                <th className="pb-3 font-medium">On-Time</th>
                <th className="pb-3 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {vendorPerf.map((v) => (
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
    </div>
  )
}
