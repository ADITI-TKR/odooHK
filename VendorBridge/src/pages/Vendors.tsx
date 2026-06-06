import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Plus, Search, Star } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { api, type Vendor } from '../lib/api'

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    api.getVendors(search ? { search } : undefined).then(setVendors).catch(() => {})
  }, [search])

  return (
    <div>
      <PageHeader
        title="Vendor Management"
        subtitle="Companies, contact details, GST, and product catalogs."
        action={
          <Link to="/register/vendor" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            <Plus size={18} /> Register Vendor
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendors or companies..." className="w-full rounded-xl border border-gray-200 bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand" />
        </div>
      </div>

      <div className="space-y-4">
        {vendors.map((v) => (
          <div key={v._id} className="rounded-2xl bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold">{v.companyName || v.name}</h3>
                  <StatusBadge status={v.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{v.companyDescription || v.category}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
                  <span>GST: {v.gst}</span>
                  <span>{v.email}</span>
                  {v.city && <span>{v.city}, {v.country}</span>}
                  <span className="flex items-center gap-1 text-brand"><Star size={12} fill="currentColor" /> {v.rating}</span>
                </div>
              </div>
              <button
                onClick={() => setExpanded(expanded === v._id ? null : v._id)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                {v.products?.length ?? 0} Products
                {expanded === v._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expanded === v._id && v.products && v.products.length > 0 && (
              <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-muted">
                      <th className="p-3 font-medium">Product</th>
                      <th className="p-3 font-medium">Category</th>
                      <th className="p-3 font-medium">Unit Price</th>
                      <th className="p-3 font-medium">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {v.products.map((p, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="p-3">
                          <p className="font-medium">{p.name}</p>
                          {p.description && <p className="text-xs text-muted">{p.description}</p>}
                        </td>
                        <td className="p-3 text-muted">{p.category}</td>
                        <td className="p-3 font-semibold text-green-600">${p.unitPrice?.toLocaleString()}</td>
                        <td className="p-3 text-muted">{p.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
