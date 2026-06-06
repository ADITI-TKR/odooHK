import { useEffect, useState } from 'react'
import { Star, Trophy } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { api, type Quotation } from '../lib/api'

export default function CompareQuotations() {
  const [quotes, setQuotes] = useState<Quotation[]>([])
  const lowest = quotes.length ? Math.min(...quotes.map((q) => q.totalPrice)) : 0

  useEffect(() => {
    api.getQuotations().then(setQuotes).catch(() => {})
  }, [])

  return (
    <div>
      <PageHeader title="Quotation Comparison" subtitle="Side-by-side vendor analysis with lowest price highlighting" />

      <div className="overflow-x-auto rounded-2xl bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="p-4 font-medium text-muted">Criteria</th>
              {quotes.map((q) => (
                <th key={q._id} className={`p-4 font-medium ${q.totalPrice === lowest ? 'bg-orange-50' : ''}`}>
                  <div className="flex items-center gap-2">
                    {q.vendor?.name}
                    {q.totalPrice === lowest && <Trophy size={14} className="text-brand" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50">
              <td className="p-4 text-muted">Total Price</td>
              {quotes.map((q) => (
                <td key={q._id} className={`p-4 font-semibold ${q.totalPrice === lowest ? 'bg-orange-50 text-brand' : ''}`}>
                  ${q.totalPrice.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-50">
              <td className="p-4 text-muted">Delivery</td>
              {quotes.map((q) => (
                <td key={q._id} className={`p-4 ${q.totalPrice === lowest ? 'bg-orange-50' : ''}`}>{q.deliveryTimeline}</td>
              ))}
            </tr>
            <tr className="border-b border-gray-50">
              <td className="p-4 text-muted">Rating</td>
              {quotes.map((q) => (
                <td key={q._id} className={`p-4 ${q.totalPrice === lowest ? 'bg-orange-50' : ''}`}>
                  <span className="flex items-center gap-1 text-brand"><Star size={14} fill="currentColor" /> {q.vendor?.rating}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-muted">Status</td>
              {quotes.map((q) => (
                <td key={q._id} className={`p-4 ${q.totalPrice === lowest ? 'bg-orange-50' : ''}`}>
                  <StatusBadge status={q.status} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
