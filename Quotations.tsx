import { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { api } from '../../lib/api'

export default function QuotationDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getQuotationDashboard>> | null>(null)
  useEffect(() => { api.getQuotationDashboard().then(setData).catch(() => {}) }, [])

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-bold">Quotation Dashboard</h1>
      <p className="mb-6 text-sm text-muted">Monitor vendor quotation submissions and pricing.</p>
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Quotes" value={data?.total ?? '—'} />
        <StatCard label="Received" value={data?.received ?? '—'} highlight />
        <StatCard label="Pending" value={data?.pending ?? '—'} />
        <StatCard label="Avg. Price" value={data ? `$${Math.round(data.avgPrice).toLocaleString()}` : '—'} />
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold">Recent Quotations</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted">
              <th className="pb-3">Vendor</th>
              <th className="pb-3">RFQ</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.recent ?? []).map((q) => (
              <tr key={q._id} className="border-b border-gray-50">
                <td className="py-3 font-medium">{q.vendor?.name}</td>
                <td className="py-3 text-muted">{q.rfq?.rfqNumber}</td>
                <td className="py-3 font-semibold text-green-600">${q.totalPrice?.toLocaleString()}</td>
                <td className="py-3"><StatusBadge status={q.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
