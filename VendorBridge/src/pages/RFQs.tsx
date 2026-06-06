import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { api, type RFQ } from '../lib/api'

export default function RFQs() {
  const [rfqs, setRfqs] = useState<RFQ[]>([])

  useEffect(() => {
    api.getRFQs().then(setRfqs).catch(() => {})
  }, [])

  return (
    <div>
      <PageHeader
        title="Request for Quotations"
        subtitle="Create and manage procurement RFQs with vendor assignments."
        action={
          <Link to="/app/rfqs/create" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            <Plus size={18} /> Create RFQ
          </Link>
        }
      />

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input placeholder="Search RFQs..." className="w-full rounded-xl border border-gray-200 bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand" />
        </div>
      </div>

      <div className="grid gap-4">
        {rfqs.map((r) => (
          <div key={r._id} className="flex items-center justify-between rounded-2xl bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted">{r.rfqNumber}</span>
                <StatusBadge status={r.status} />
              </div>
              <h3 className="mt-1 font-semibold text-ink">{r.title}</h3>
              <p className="mt-1 text-xs text-muted">
                {r.items?.length ?? 0} items · {r.assignedVendors?.length ?? 0} vendors · Deadline: {new Date(r.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/app/quotations" className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">View Quotes</Link>
              <Link to="/app/quotations/compare" className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">Compare</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
