import PageHeader from '../components/PageHeader'
import { getUser } from '../lib/api'

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  procurement_officer: 'Procurement Officer',
  manager: 'Manager / Approver',
  vendor: 'Vendor',
}

export default function Settings() {
  const user = getUser()
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'VB'

  return (
    <div>
      <PageHeader title="Account Settings" subtitle="Manage your profile, security, and preferences." />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          {['Profile', 'Security', 'Notifications', 'Preferences'].map((item, i) => (
            <button key={item} className={`mb-1 w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium ${i === 0 ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-card p-8 shadow-sm lg:col-span-3">
          <h3 className="font-serif text-xl font-bold">Profile Details</h3>
          <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-brand">{initials}</div>
              <div>
                <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white">Upload new photo</button>
                <button type="button" className="ml-2 text-sm text-red-500">Delete</button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                <input defaultValue={user?.name || ''} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input defaultValue={user?.email || ''} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Phone</label>
                <input defaultValue="+91 98765 43210" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Role</label>
                <input defaultValue={roleLabels[user?.role || ''] || user?.role || ''} disabled className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium">Cancel</button>
              <button type="submit" className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
