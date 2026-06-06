import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Plus, Trash2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { api, saveSession } from '../lib/api'

type Product = { name: string; description: string; category: string; unitPrice: string; unit: string }

const emptyProduct = (): Product => ({ name: '', description: '', category: '', unitPrice: '', unit: 'pcs' })

export default function VendorRegister() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([emptyProduct(), emptyProduct()])
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    companyName: '', companyDescription: '', website: '',
    category: '', gst: '', phone: '', address: '', city: '', country: 'India',
  })

  const updateProduct = (i: number, field: keyof Product, value: string) => {
    setProducts((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const validProducts = products
        .filter((p) => p.name.trim())
        .map((p) => ({ ...p, unitPrice: parseFloat(p.unitPrice) || 0 }))

      if (validProducts.length === 0) {
        setError('Please add at least one product')
        setLoading(false)
        return
      }

      const { token, user } = await api.registerVendor({ ...form, products: validProducts })
      saveSession(token, user)
      navigate('/app/my-products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Vendor Registration" subtitle="Register your company and list your products on VendorBridge.">
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-6 overflow-y-auto pr-2">
        <div>
          <h3 className="mb-3 font-serif text-lg font-bold">Account Details</h3>
          <div className="space-y-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contact Person Name" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand" required />
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand" required />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-brand" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-serif text-lg font-bold">Company Information</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Company Name *" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand sm:col-span-2" required />
            <input value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })} placeholder="GST Number *" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand" required />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand" required>
              <option value="">Category *</option>
              <option>IT Equipment</option>
              <option>Office Supplies</option>
              <option>Furniture</option>
              <option>Manufacturing</option>
              <option>Facilities</option>
              <option>Printing</option>
              <option>Construction</option>
              <option>Energy</option>
            </select>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand" />
            <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="Website" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand" />
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand" />
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand sm:col-span-2" />
            <textarea value={form.companyDescription} onChange={(e) => setForm({ ...form, companyDescription: e.target.value })} placeholder="Company Description" rows={2} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand sm:col-span-2" />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold">Products / Services</h3>
            <button type="button" onClick={() => setProducts([...products, emptyProduct()])} className="flex items-center gap-1 text-sm font-medium text-brand">
              <Plus size={16} /> Add Product
            </button>
          </div>
          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input value={p.name} onChange={(e) => updateProduct(i, 'name', e.target.value)} placeholder="Product Name *" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand sm:col-span-2" />
                  <input value={p.category} onChange={(e) => updateProduct(i, 'category', e.target.value)} placeholder="Category" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
                  <input type="number" value={p.unitPrice} onChange={(e) => updateProduct(i, 'unitPrice', e.target.value)} placeholder="Unit Price (₹)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
                  <input value={p.unit} onChange={(e) => updateProduct(i, 'unit', e.target.value)} placeholder="Unit (pcs, kg...)" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
                  <input value={p.description} onChange={(e) => updateProduct(i, 'description', e.target.value)} placeholder="Description" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand sm:col-span-2" />
                </div>
                {products.length > 1 && (
                  <button type="button" onClick={() => setProducts(products.filter((_, idx) => idx !== i))} className="mt-2 flex items-center gap-1 text-xs text-red-500">
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
          {loading ? 'Registering...' : 'Register as Vendor'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Already registered? <Link to="/login" className="font-semibold text-brand">Log in</Link>
        {' · '}
        <Link to="/register" className="font-semibold text-brand">Staff signup</Link>
      </p>
    </AuthLayout>
  )
}
