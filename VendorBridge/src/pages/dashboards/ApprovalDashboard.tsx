import { useEffect, useState } from 'react'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { api } from '../../lib/api'

export default function ApprovalDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getApprovalDashboard>> | null>(null)
  useEffect(() => { api.getApprovalDashboard().then(setData).catch(() => {}) }, [])

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-bold">Approval Dashboard</h1>
      <p className="mb-6 text-sm text-muted">Track procurement approval workflows.</p>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={data?.pending ?? '—'} highlight />
        <StatCard label="Approved" value={data?.approved ?? '—'} change="+4 this week" />
        <StatCard label="Rejected" value={data?.rejected ?? '—'} trend="down" />
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold">Recent Approvals</h2>
        <div className="mt-4 space-y-3">
          {(data?.recent ?? []).map((a) => (
            <div key={a._id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div>
                <p className="font-semibold">{a.rfq?.title}</p>
                <p className="text-xs text-muted">{a.vendor?.name} · ${a.amount?.toLocaleString()}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
