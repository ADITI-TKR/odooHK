import { useEffect, useState } from 'react'
import { Edit, Package, Plus, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { api, type CatalogProduct } from '../lib/api'
import { PRODUCT_TYPES, getProductImage, resolveProductImage } from '../lib/productImages'

const empty = (): Partial<CatalogProduct> => ({
  productName: '', description: '', category: 'Laptop', price: 0, moq: 1, stock: 0,
  images: [getProductImage('Laptop')],
})

export default function MyProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(empty())

  const load = () => api.getMyProducts().then(setProducts).catch(() => {})
  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = { ...form, images: [getProductImage(form.category || form.productName || '')] }
    if (editing) await api.updateProduct(editing, body)
    else await api.createProduct(body)
    setShowForm(false); setEditing(null); setForm(empty()); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await api.deleteProduct(id); load()
  }

  const startEdit = (p: CatalogProduct) => { setForm(p); setEditing(p._id); setShowForm(true) }

  return (
    <div>
      <PageHeader title="My Products" subtitle="Manage your product catalog — pricing, stock & MOQ."
        action={<button onClick={() => { setShowForm(true); setEditing(null); setForm(empty()) }} className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"><Plus size={18} /> Add Product</button>} />
      {showForm && (
        <form onSubmit={handleSave} className="mb-6 rounded-2xl border border-gray-100 bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold">{editing ? 'Edit Product' : 'New Product'}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Product Name *" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-brand" required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, images: [getProductImage(e.target.value)] })} className="rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-brand" required>
              {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="sm:col-span-2"><img src={resolveProductImage(form.images, form.category || form.productName)} alt="Preview" className="h-32 w-full rounded-lg object-cover" /></div>
            <input type="number" placeholder="Price (₹) *" value={form.price || ''} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-brand" required />
            <input type="number" placeholder="Stock Quantity" value={form.stock || ''} onChange={(e) => setForm({ ...form, stock: +e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-brand" />
            <input type="number" placeholder="MOQ" value={form.moq || ''} onChange={(e) => setForm({ ...form, moq: +e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-brand" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-brand sm:col-span-2" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white">Save Product</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-6 py-2.5 text-sm">Cancel</button>
          </div>
        </form>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <div key={p._id} className="overflow-hidden rounded-2xl border border-gray-100 bg-card shadow-sm transition-shadow hover:shadow-md">
            <img src={resolveProductImage(p.images, `${p.category} ${p.productName}`)} alt={p.productName} className="h-40 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2"><h3 className="font-semibold">{p.productName}</h3><StatusBadge status={p.availability || 'Active'} /></div>
              <p className="mt-1 text-xs text-muted">{p.category}</p>
              <p className="mt-2 text-xl font-bold text-brand">₹{p.price?.toLocaleString()}</p>
              <p className="text-xs text-muted">MOQ: {p.moq} · Stock: {p.stock}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => startEdit(p)} className="flex flex-1 items-center justify-center gap-1 rounded-lg border py-2 text-xs font-medium hover:bg-gray-50"><Edit size={14} /> Edit</button>
                <button onClick={() => handleDelete(p._id)} className="flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-500 hover:bg-red-50"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="col-span-full flex flex-col items-center py-16 text-muted"><Package size={48} className="mb-4 opacity-30" /><p>No products yet. Add your first product to the catalog.</p></div>}
      </div>
    </div>
  )
}
