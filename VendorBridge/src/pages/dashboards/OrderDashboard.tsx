import { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { api } from '../../lib/api'

export default function OrderDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getOrderDashboard>> | null>(null)
  useEffect(() => { api.getOrderDashboard().then(setData).catch(() => {}) }, [])

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-bold">Purchase Order Dashboard</h1>
      <p className="mb-6 text-sm text-muted">Monitor PO generation and fulfillment.</p>
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total POs" value={data?.total ?? '—'} />
        <StatCard label="Approved" value={data?.approved ?? '—'} highlight />
        <StatCard label="Draft" value={data?.draft ?? '—'} />
        <StatCard label="Total Spend" value={data ? `$${data.totalSpend.toLocaleString()}` : '—'} />
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold">Recent Orders</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted">
              <th className="pb-3">PO Number</th>
              <th className="pb-3">Vendor</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.recent ?? []).map((o) => (
              <tr key={o._id} className="border-b border-gray-50">
                <td className="py-3 font-mono font-medium">{o.poNumber}</td>
                <td className="py-3">{o.vendor?.name}</td>
                <td className="py-3 font-semibold text-green-600">${o.total?.toLocaleString()}</td>
                <td className="py-3"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
