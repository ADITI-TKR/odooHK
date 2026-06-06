import { useEffect, useState } from 'react'
import { Bell, FileText } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { api, type ActivityItem } from '../lib/api'

const iconMap: Record<string, typeof Bell> = { notification: Bell, audit: FileText }

export default function Activity() {
  const [items, setItems] = useState<ActivityItem[]>([])

  useEffect(() => {
    api.getActivity().then(setItems).catch(() => {})
  }, [])

  const notifications = items.filter((i) => i.type === 'notification')
  const audits = items.filter((i) => i.type === 'audit')

  return (
    <div>
      <PageHeader title="Activity & Notifications" subtitle="Stay informed about procurement updates and audit logs." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold">Notifications</h2>
          <div className="mt-4 space-y-4">
            {notifications.map((n) => {
              const Icon = iconMap[n.type] || Bell
              return (
                <div key={n._id} className="flex gap-3 rounded-xl p-3 hover:bg-gray-50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-brand">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="text-xs text-muted">{n.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold">Audit Logs</h2>
          <div className="mt-4">
            {audits.map((l) => (
              <div key={l._id} className="relative border-l-2 border-gray-200 py-4 pl-6">
                <div className="absolute -left-[5px] top-5 h-2 w-2 rounded-full bg-brand" />
                <p className="text-sm font-semibold">{l.title}</p>
                <p className="text-xs text-muted">{l.description}</p>
                <p className="mt-1 text-xs text-muted">{l.user?.name} · {new Date(l.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
