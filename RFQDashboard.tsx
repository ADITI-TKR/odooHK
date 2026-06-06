import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Bell, CheckCircle, ClipboardList, DollarSign, FileCheck,
  FileText, Package, Plus, ShoppingCart, TrendingUp, Users,
} from 'lucide-react'
import KpiCard from '../components/KpiCard'
import StatusBadge from '../components/StatusBadge'
import { api, getUser, type EnterpriseDashboard } from '../lib/api'

const pipelineIcons: Record<string, typeof ClipboardList> = {
  rfq: ClipboardList, quote: FileCheck, approval: CheckCircle, po: ShoppingCart, invoice: FileText,
}

export default function Dashboard() {
  const [data, setData] = useState<EnterpriseDashboard | null>(null)
  const user = getUser()

  useEffect(() => {
    api.getEnterpriseDashboard().then(setData).catch(() => {})
  }, [])

  const k = data?.kpis
  const isVendor = user?.role === 'vendor'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">
            {isVendor ? 'Vendor Dashboard' : 'Procurement Overview'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Welcome back, {user?.name}. Real-time enterprise procurement intelligence.
          </p>
        </div>
        {!isVendor && (
          <div className="flex flex-wrap gap-2">
            <Link to="/app/rfqs/create" className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200/50 hover:bg-brand-dark">
              <Plus size={16} /> Create RFQ
            </Link>
            <Link to="/register/vendor" className="flex items-center gap-2 rounded-xl border border-gray-200 bg-card px-4 py-2.5 text-sm font-semibold hover:bg-gray-50">
              <Users size={16} /> Register Vendor
            </Link>
            <Link to="/app/invoices" className="flex items-center gap-2 rounded-xl border border-gray-200 bg-card px-4 py-2.5 text-sm font-semibold hover:bg-gray-50">
              <FileText size={16} /> Generate Invoice
            </Link>
            <Link to="/app/reports" className="flex items-center gap-2 rounded-xl border border-gray-200 bg-card px-4 py-2.5 text-sm font-semibold hover:bg-gray-50">
              <TrendingUp size={16} /> View Reports
            </Link>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {isVendor ? (
          <>
            <KpiCard label="My Products" value={k?.myProducts ?? '—'} icon={Package} accent />
            <KpiCard label="Assigned RFQs" value={k?.assignedRfqs ?? '—'} icon={ClipboardList} />
            <KpiCard label="Quotations Sent" value={k?.myQuotes ?? '—'} icon={FileCheck} />
          </>
        ) : (
          <>
            <KpiCard label="Total Vendors" value={k?.totalVendors ?? '—'} icon={Users} change="+12% MoM" />
            <KpiCard label="Active RFQs" value={k?.activeRfqs ?? '—'} icon={ClipboardList} change="+8% MoM" accent />
            <KpiCard label="Quotations Received" value={k?.quotationsReceived ?? '—'} icon={FileCheck} change="+15% MoM" />
            <KpiCard label="Pending Approvals" value={k?.pendingApprovals ?? '—'} icon={CheckCircle} change="-3% MoM" trend="down" />
            <KpiCard label="Purchase Orders" value={k?.purchaseOrders ?? '—'} icon={ShoppingCart} change="+10% MoM" />
            <KpiCard label="Total Spend" value={k ? `₹${(k.totalSpend / 100000).toFixed(1)}L` : '—'} icon={DollarSign} change="+5% MoM" />
          </>
        )}
      </div>

      {!isVendor && (
        <>
          {/* Pipeline */}
          <div className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold">Procurement Pipeline</h2>
            <p className="mt-1 text-sm text-muted">End-to-end workflow stage counts</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
              {(data?.pipeline ?? []).map((stage, i) => {
                const Icon = pipelineIcons[stage.icon] || ClipboardList
                return (
                  <div key={stage.stage} className="flex items-center gap-2">
                    <div className="min-w-[120px] rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-brand">
                        <Icon size={18} />
                      </div>
                      <p className="text-2xl font-bold text-ink">{stage.count}</p>
                      <p className="mt-1 text-xs text-muted">{stage.stage}</p>
                    </div>
                    {i < (data?.pipeline.length ?? 0) - 1 && (
                      <ArrowRight size={20} className="hidden text-gray-300 lg:block" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {/* Spend Chart */}
            <div className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold">Monthly Procurement Spend</h2>
                  <p className="text-sm text-muted">Spend trend across fiscal year</p>
                </div>
                <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none">
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
              <div className="mt-6 flex items-end gap-3" style={{ height: 200 }}>
                {(data?.spendChart ?? []).map((d) => {
                  const max = Math.max(...(data?.spendChart.map((s) => s.value) ?? [1]))
                  return (
                    <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-brand">₹{(d.value / 1000).toFixed(0)}K</span>
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-brand to-orange-300" style={{ height: `${(d.value / max) * 160}px` }} />
                      <span className="text-xs text-muted">{d.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold">
                <Bell size={20} className="text-brand" /> Notifications
              </h2>
              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                {(data?.notifications ?? []).map((n, i) => (
                  <div key={i} className="rounded-xl bg-orange-50/50 p-3">
                    <p className="text-sm font-semibold text-ink">{n.title}</p>
                    <p className="text-xs text-muted">{n.description}</p>
                    <p className="mt-1 text-xs text-brand">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Vendor Leaderboard */}
            <div className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold">Vendor Performance Leaderboard</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted">
                      <th className="pb-3 font-medium">Vendor</th>
                      <th className="pb-3 font-medium">Rating</th>
                      <th className="pb-3 font-medium">Orders</th>
                      <th className="pb-3 font-medium">Success</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.vendorLeaderboard ?? []).map((v, i) => (
                      <tr key={v.name} className="border-b border-gray-50">
                        <td className="py-3">
                          <span className="mr-2 text-xs text-muted">#{i + 1}</span>
                          <span className="font-medium">{v.name}</span>
                        </td>
                        <td className="py-3 text-brand">⭐ {v.rating}</td>
                        <td className="py-3">{v.totalOrders}</td>
                        <td className="py-3">
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{v.successRate}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold">Pending Approvals</h2>
                <Link to="/app/approvals" className="text-sm font-medium text-brand">View All</Link>
              </div>
              <div className="mt-4 space-y-3">
                {(data?.pendingApprovalsList ?? []).map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                    <div>
                      <p className="font-semibold">{a.title}</p>
                      <p className="text-xs text-muted">{a.rfq} · {a.vendor}</p>
                    </div>
                    <span className="font-bold text-brand">₹{a.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent RFQs */}
          <div className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold">Recent RFQs</h2>
              <Link to="/app/rfqs" className="text-sm font-medium text-brand">View All</Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted">
                    <th className="pb-3 font-medium">RFQ ID</th>
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Deadline</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentRfqs ?? []).map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-mono text-xs">{r.id}</td>
                      <td className="py-3 font-medium">{r.title}</td>
                      <td className="py-3 text-muted">{r.category}</td>
                      <td className="py-3 text-muted">{r.deadline}</td>
                      <td className="py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold">Recent Activities</h2>
            <div className="mt-4 space-y-0">
              {(data?.recentActivity ?? []).map((a, i) => (
                <div key={i} className="relative border-l-2 border-orange-200 py-4 pl-6">
                  <div className="absolute -left-[5px] top-5 h-2.5 w-2.5 rounded-full bg-brand" />
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-muted">{a.description}</p>
                  <p className="mt-1 text-xs text-brand">{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {isVendor && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/app/my-products" className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm hover:shadow-md">
            <Package className="text-brand" size={28} />
            <h3 className="mt-3 font-semibold">Manage My Products</h3>
            <p className="text-sm text-muted">Add, edit, and upload product catalogs</p>
          </Link>
          <Link to="/app/rfqs" className="rounded-2xl border border-gray-100 bg-card p-6 shadow-sm hover:shadow-md">
            <ClipboardList className="text-brand" size={28} />
            <h3 className="mt-3 font-semibold">Assigned RFQs</h3>
            <p className="text-sm text-muted">View and respond to procurement requests</p>
          </Link>
        </div>
      )}
    </div>
  )
}
