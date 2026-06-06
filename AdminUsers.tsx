import { Outlet, NavLink } from 'react-router-dom'
import { Bell, ChevronDown, Rocket, Search } from 'lucide-react'
import { getNavForRole } from '../config/navigation'
import { clearSession, getUser } from '../lib/api'

export default function MainLayout() {
  const user = getUser()
  const navItems = getNavForRole(user?.role || 'procurement_officer')
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'VB'

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-card">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
            <Rocket size={18} className="text-white" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-ink">VendorBridge</span>
            <p className="text-[10px] uppercase tracking-wider text-muted">{user?.role?.replace('_', ' ') || 'ERP'}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-orange-100 text-brand' : 'text-gray-500 hover:bg-gray-50 hover:text-ink'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-card px-8 py-4">
          <div className="relative max-w-md flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input placeholder="Search vendors, products, RFQs..." className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-brand" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-700">
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand" />
            </button>
            <button
              onClick={() => { clearSession(); window.location.href = '/login' }}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 hover:bg-gray-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-brand">{initials}</div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-ink">{user?.name || 'Guest'}</p>
                <p className="text-xs capitalize text-muted">{user?.role?.replace('_', ' ') || ''}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
