import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { api, saveSession } from '../lib/api'

const roles = [
  { value: 'procurement_officer', label: 'Procurement Officer' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'manager', label: 'Manager / Approver' },
  { value: 'admin', label: 'Admin' },
]

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token, user } = await api.register(form)
      saveSession(token, user)
      navigate('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create Account" subtitle="Let's get you started with VendorBridge.">
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Rahul Verma"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="rahul@vendorbridge.com"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            required
          >
            <option value="">Select your role</option>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create a strong password"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-11 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-ink py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <Link to="/login" className="font-semibold text-brand">Log in</Link>
        {' · '}
        <Link to="/register/vendor" className="font-semibold text-brand">Vendor signup</Link>
      </p>
    </AuthLayout>
  )
}
