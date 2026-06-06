import { useEffect, useState } from 'react'
import { Download, Mail, Plus, Printer } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { api, type Order } from '../lib/api'

export default function Invoices() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    api.getOrders().then(setOrders).catch(() => {})
  }, [])

  const handleSend = async (id: string) => {
    const res = await api.sendInvoice(id)
    alert(res.message)
    api.getOrders().then(setOrders)
  }

  return (
    <div>
      <PageHeader
        title="Purchase Orders & Invoices"
        subtitle="Generate POs, create invoices, and manage tax calculations."
        action={
          <button className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            <Plus size={18} /> Generate PO
          </button>
        }
      />

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="rounded-2xl bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold">{o.po}</span>
                  {o.invoice && <><span className="text-muted">→</span><span className="font-mono text-sm text-muted">{o.invoice}</span></>}
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 text-sm text-muted">{o.vendor?.name}</p>
              </div>
              <p className="text-2xl font-bold">${o.total.toLocaleString()}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 rounded-xl bg-gray-50 p-4 text-sm">
              <div><span className="text-muted">Subtotal</span><p className="font-medium">${o.subtotal.toLocaleString()}</p></div>
              <div><span className="text-muted">Tax</span><p className="font-medium">${o.tax.toLocaleString()}</p></div>
              <div><span className="text-muted">Total</span><p className="font-bold text-brand">${o.total.toLocaleString()}</p></div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                <Download size={16} /> Download PDF
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                <Printer size={16} /> Print
              </button>
              {o.invoiceId && (
                <button onClick={() => handleSend(o.invoiceId!)} className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                  <Mail size={16} /> Send Email
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
