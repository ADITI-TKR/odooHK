export default function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/60">
      <div className="flex border-b border-gray-100 bg-gray-50 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
      </div>
      <div className="flex">
        <div className="hidden w-14 shrink-0 border-r border-gray-100 bg-white py-4 sm:block">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`mx-auto mb-3 h-7 w-7 rounded-lg ${i === 0 ? 'bg-orange-100' : 'bg-gray-100'}`} />
          ))}
        </div>
        <div className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-orange-100" />
              <div className="h-3 w-16 rounded bg-gray-200" />
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[
              { l: 'Vendors', v: '124', c: 'bg-blue-50 text-blue-600' },
              { l: 'RFQs', v: '28', c: 'bg-orange-50 text-brand' },
              { l: 'Approvals', v: '07', c: 'bg-yellow-50 text-yellow-600' },
              { l: 'POs', v: '42', c: 'bg-green-50 text-green-600' },
            ].map((k) => (
              <div key={k.l} className="rounded-xl border border-gray-100 p-3">
                <p className="text-[10px] text-muted">{k.l}</p>
                <p className={`text-lg font-bold ${k.c.split(' ')[1]}`}>{k.v}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-100 p-3 lg:col-span-2">
              <p className="mb-2 text-[10px] font-semibold">Procurement Spend</p>
              <div className="flex h-16 items-end gap-1">
                {[40, 55, 45, 70, 60, 75, 65].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand to-orange-300" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 p-3">
              <p className="mb-2 text-[10px] font-semibold">RFQ Status</p>
              <div className="mx-auto h-14 w-14 rounded-full border-[6px] border-brand border-r-blue-400 border-b-green-400 border-l-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
