import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { api } from '../lib/api'

type AdminUser = {
  _id: string; name: string; email: string; role: string
  vendorProfile?: { companyName: string; status: string }
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])

  useEffect(() => {
    api.getUsers().then(setUsers).catch(() => {})
  }, [])

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    procurement_officer: 'bg-blue-100 text-blue-700',
    manager: 'bg-yellow-100 text-yellow-700',
    vendor: 'bg-green-100 text-green-700',
  }

  return (
    <div>
      <PageHeader title="User Management" subtitle="Admin view — all system users and roles." />

      <div className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Company</th>
              <th className="pb-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3.5 font-medium">{u.name}</td>
                <td className="py-3.5 text-muted">{u.email}</td>
                <td className="py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${roleColors[u.role] || ''}`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5">
                  {u.vendorProfile ? (
                    <div className="flex items-center gap-2">
                      <span>{u.vendorProfile.companyName}</span>
                      <StatusBadge status={u.vendorProfile.status} />
                    </div>
                  ) : '—'}
                </td>
                <td className="py-3.5 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
