import { Send } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'

export default function Quotations() {
  return (
    <div>
      <PageHeader
        title="Quotation Submission"
        subtitle="RFQ #1042 — Laptop Procurement Q2"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="font-serif text-lg font-bold">Submit Your Quotation</h3>
          <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Unit Price ($)</label>
                <input type="number" placeholder="1240.00" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Total Price ($)</label>
                <input type="number" placeholder="62000.00" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Delivery Timeline</label>
                <input placeholder="14 business days" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Warranty Period</label>
                <input placeholder="3 years" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Notes / Comments</label>
              <textarea rows={4} placeholder="Include any additional terms or conditions..." className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" />
            </div>
            <button type="submit" className="flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
              <Send size={16} /> Submit Quotation
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold">RFQ Details</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-muted">Items</dt><dd className="font-medium">50 × Dell Latitude 5540</dd></div>
            <div><dt className="text-muted">Deadline</dt><dd className="font-medium">Jun 15, 2026</dd></div>
            <div><dt className="text-muted">Status</dt><dd><StatusBadge status="Open" /></dd></div>
          </dl>
          <h4 className="mt-6 text-sm font-semibold">Submitted Quotations</h4>
          <div className="mt-3 space-y-2 text-sm">
            {[
              { vendor: 'TechSupply Co.', price: '$62,000', status: 'Received' },
              { vendor: 'OfficeMart Ltd.', price: '$64,500', status: 'Pending' },
            ].map((q) => (
              <div key={q.vendor} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span>{q.vendor}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{q.price}</span>
                  <StatusBadge status={q.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
