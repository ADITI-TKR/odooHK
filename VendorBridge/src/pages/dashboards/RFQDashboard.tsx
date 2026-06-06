import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { api } from '../../lib/api'

export default function RFQDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getRFQDashboard>> | null>(null)
  useEffect(() => { api.getRFQDashboard().then(setData).catch(() => {}) }, [])

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">RFQ Dashboard</h1>
          <p className="text-sm text-muted">Track all RFQ requests — 100+ in database.</p>
        </div>
        <Link to="/app/rfqs/create" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white">
          <Plus size={18} /> Create RFQ
        </Link>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Open" value={data?.open ?? '—'} highlight />
        <StatCard label="Pending" value={data?.pending ?? '—'} />
        <StatCard label="Closed" value={data?.closed ?? '—'} />
        <StatCard label="Total" value={data?.total ?? '—'} />
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold">Recent RFQs</h2>
        <div className="mt-4 space-y-3">
          {(data?.recent ?? []).map((r) => (
            <div key={r._id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted">{r.rfqNumber}</span>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 font-semibold">{r.title}</p>
              </div>
              <span className="text-xs text-muted">{r.assignedVendors?.length ?? 0} vendors</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
