import { Link, useSearchParams } from 'react-router-dom'
import { Paperclip, Plus, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function CreateRFQ() {
  const [params] = useSearchParams()
  const prefilledProduct = params.get('product') || ''
  const prefilledVendor = params.get('vendor') || ''
  return (
    <div>
      <PageHeader title="Create RFQ" subtitle="Initiate a new procurement request for vendor quotations." />

      <form className="rounded-2xl bg-card p-8 shadow-sm" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">RFQ Title</label>
            <input placeholder="e.g. Laptop Procurement Q2" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Deadline</label>
            <input type="date" className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand" required />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <select className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand">
              <option>IT Equipment</option>
              <option>Office Supplies</option>
              <option>Manufacturing</option>
              <option>Facilities</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold">Product / Service Details</h3>
            <button type="button" className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark">
              <Plus size={16} /> Add Item
            </button>
          </div>
          <div className="space-y-3">
            {[prefilledProduct || 'Dell Latitude 5540', 'Docking Station'].filter((v, i, a) => i === 0 || !prefilledProduct).map((item, i) => (
              <div key={i} className="grid gap-3 rounded-xl border border-gray-100 p-4 md:grid-cols-4">
                <input defaultValue={item} placeholder="Item name" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
                <input type="number" defaultValue={i === 0 ? 50 : 50} placeholder="Qty" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
                <input placeholder="Specifications" className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand" />
                <button type="button" className="flex items-center justify-center gap-1 text-sm text-red-500 hover:text-red-700">
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <label className="mb-1.5 block text-sm font-medium">Assign Vendors</label>
          <div className="flex flex-wrap gap-2">
            {prefilledVendor && (
              <input type="hidden" name="vendorId" value={prefilledVendor} />
            )}
            {['TechSupply Co.', 'OfficeMart Ltd.', 'GlobalParts Inc.'].map((v) => (
              <label key={v} className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm">
                <input type="checkbox" defaultChecked={!!prefilledVendor || undefined} className="accent-brand" /> {v}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium">Attachments</label>
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-8 text-sm text-muted hover:border-brand hover:text-brand">
            <Paperclip size={16} className="mr-2" /> Drop files here or click to upload
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Link to="/app/rfqs" className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium hover:bg-gray-50">Cancel</Link>
          <button type="submit" className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Publish RFQ</button>
        </div>
      </form>
    </div>
  )
}
