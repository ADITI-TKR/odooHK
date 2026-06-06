import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Star, Store } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { api, type CatalogProduct } from '../lib/api'
import { resolveProductImage } from '../lib/productImages'

export default function Marketplace() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (category) params.category = category
    api.getMarketplace(params).then(setProducts).catch(() => {})
  }, [search, category])

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  return (
    <div>
      <PageHeader
        title="Vendor Marketplace"
        subtitle="Internal procurement catalog — discover vendors and create RFQs from products."
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border bg-card px-4 py-2.5 text-sm outline-none">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <div key={p._id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="relative">
              <img src={resolveProductImage(p.images, `${p.category} ${p.productName}`)} alt={p.productName} className="h-44 w-full object-cover" />
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium shadow">
                {p.vendor?.companyName || p.vendor?.name}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-ink">{p.productName}</h3>
              <p className="mt-1 text-xs text-muted">{p.category}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xl font-bold text-brand">₹{p.price?.toLocaleString()}</p>
                <span className="flex items-center gap-0.5 text-sm text-brand">
                  <Star size={14} fill="currentColor" /> {p.vendor?.rating || 4.5}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">Stock: {p.stock} units · MOQ: {p.moq}</p>
              <Link
                to={`/app/rfqs/create?product=${encodeURIComponent(p.productName)}&vendor=${p.vendor?._id}&price=${p.price}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-brand"
              >
                <Plus size={16} /> Create RFQ
              </Link>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="flex flex-col items-center py-20 text-muted">
          <Store size={48} className="mb-4 opacity-30" />
          <p>No products in marketplace. Vendors need to upload products first.</p>
        </div>
      )}
    </div>
  )
}
