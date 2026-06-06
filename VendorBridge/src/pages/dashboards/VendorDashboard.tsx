import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Star } from 'lucide-react'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import { api } from '../../lib/api'

export default function VendorDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.getVendorDashboard>> | null>(null)
  useEffect(() => { api.getVendorDashboard().then(setData).catch(() => {}) }, [])

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-sm text-muted">100 vendors, companies, and product catalogs.</p>
        </div>
        <Link to="/app/vendors" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">
          View All Vendors
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Vendors" value={data?.total ?? '—'} />
        <StatCard label="Companies" value={data?.totalCompanies ?? '—'} highlight />
        <StatCard label="Active" value={data?.active ?? '—'} change="+5 this month" />
        <StatCard label="Pending Review" value={data?.pending ?? '—'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold">Top Vendors</h2>
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
            {(data?.topVendors ?? []).map((v) => (
              <div key={v._id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                <div>
                  <p className="font-semibold">{v.companyName || v.name}</p>
                  <p className="text-xs text-muted">{v.category} · {v.products?.length ?? 0} products</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-brand"><Star size={14} fill="currentColor" /> {v.rating}</span>
                  <StatusBadge status={v.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold">
            <Building2 size={20} className="text-brand" /> Companies
          </h2>
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto">
            {(data?.recentCompanies ?? []).map((c) => (
              <div key={c._id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{c.name}</p>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-1 text-xs text-muted">{c.industry} · {c.city}</p>
                <p className="mt-1 text-xs text-muted">{c.employeeCount} employees</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
