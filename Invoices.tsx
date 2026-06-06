import { useEffect, useState } from 'react'
import { Bell, FileText } from 'lucide-react'
import StatCard from '../../components/StatCard'
import { api } from '../../lib/api'

export default function ActivityDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getActivityDashboard>> | null>(null)
  useEffect(() => { api.getActivityDashboard().then(setData).catch(() => {}) }, [])

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-bold">Activity Dashboard</h1>
      <p className="mb-6 text-sm text-muted">Notifications and audit trail overview.</p>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Events" value={data?.total ?? '—'} highlight />
        <StatCard label="Notifications" value={data?.notifications?.length ?? '—'} />
        <StatCard label="Audit Logs" value={data?.audits?.length ?? '—'} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold">
            <Bell size={20} className="text-brand" /> Notifications
          </h2>
          <div className="mt-4 space-y-3">
            {(data?.notifications ?? []).slice(0, 6).map((n) => (
              <div key={n._id} className="rounded-xl border border-gray-100 p-3">
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-muted">{n.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold">
            <FileText size={20} className="text-brand" /> Audit Logs
          </h2>
          <div className="mt-4">
            {(data?.audits ?? []).slice(0, 6).map((l) => (
              <div key={l._id} className="relative border-l-2 border-gray-200 py-3 pl-5">
                <div className="absolute -left-[5px] top-4 h-2 w-2 rounded-full bg-brand" />
                <p className="text-sm font-semibold">{l.title}</p>
                <p className="text-xs text-muted">{l.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
