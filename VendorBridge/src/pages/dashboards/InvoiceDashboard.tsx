import { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { api } from '../../lib/api'

export default function InvoiceDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getInvoiceDashboard>> | null>(null)
  useEffect(() => { api.getInvoiceDashboard().then(setData).catch(() => {}) }, [])

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-bold">Invoice Dashboard</h1>
      <p className="mb-6 text-sm text-muted">Track invoice generation, sending, and revenue.</p>
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Invoices" value={data?.total ?? '—'} />
        <StatCard label="Sent" value={data?.sent ?? '—'} highlight />
        <StatCard label="Draft" value={data?.draft ?? '—'} />
        <StatCard label="Revenue" value={data ? `$${data.totalRevenue.toLocaleString()}` : '—'} />
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold">Recent Invoices</h2>
        <div className="mt-4 space-y-3">
          {(data?.recent ?? []).map((inv) => (
            <div key={inv._id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div>
                <p className="font-mono font-semibold">{inv.invoiceNumber}</p>
                <p className="text-xs text-muted">{inv.vendor?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-brand">${inv.total?.toLocaleString()}</span>
                <StatusBadge status={inv.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
