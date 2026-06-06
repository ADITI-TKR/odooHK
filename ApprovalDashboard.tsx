import { useEffect, useState } from 'react'
import { Check, Clock, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { api, type Approval } from '../lib/api'

export default function Approvals() {
  const [approvals, setApprovals] = useState<Approval[]>([])

  const load = () => api.getApprovals().then(setApprovals).catch(() => {})
  useEffect(() => { load() }, [])

  const handleAction = async (id: string, status: string) => {
    await api.updateApproval(id, { status })
    load()
  }

  return (
    <div>
      <PageHeader title="Approval Workflow" subtitle="Review, approve, or reject procurement requests." />

      <div className="space-y-6">
        {approvals.map((a) => (
          <div key={a._id} className="rounded-2xl bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted">{a.approvalNumber}</span>
                  <StatusBadge status={a.status} />
                </div>
                <h3 className="mt-1 font-semibold">{a.rfq?.title}</h3>
                <p className="mt-1 text-sm text-muted">{a.vendor?.name} · ${a.amount.toLocaleString()}</p>
              </div>
              {a.status === 'Pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleAction(a._id, 'Approved')} className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                    <Check size={16} /> Approve
                  </button>
                  <button onClick={() => handleAction(a._id, 'Rejected')} className="flex items-center gap-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                    <X size={16} /> Reject
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              {a.timeline?.map((t, i) => (
                <div key={t.step} className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    t.status === 'done' ? 'bg-green-100 text-green-700' :
                    t.status === 'current' ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {t.status === 'done' ? <Check size={14} /> :
                     t.status === 'current' ? <Clock size={14} /> : i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{t.step}</p>
                    <p className="text-xs text-muted">{t.date || 'Pending'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
