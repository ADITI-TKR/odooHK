import {
  Activity, BarChart3, CheckCircle, ClipboardList, FileCheck, FileText,
  LayoutDashboard, Package, Settings, ShoppingCart, Store, User, Users,
} from 'lucide-react'

export type NavItem = { to: string; icon: typeof LayoutDashboard; label: string; end?: boolean; roles: string[] }

export const allNavItems: NavItem[] = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true, roles: ['admin', 'procurement_officer', 'manager', 'vendor'] },
  { to: '/app/users', icon: User, label: 'Users', roles: ['admin'] },
  { to: '/app/vendors', icon: Users, label: 'Vendors', roles: ['admin', 'procurement_officer'] },
  { to: '/app/products', icon: Package, label: 'Products', roles: ['admin', 'procurement_officer'] },
  { to: '/app/marketplace', icon: Store, label: 'Marketplace', roles: ['admin', 'procurement_officer'] },
  { to: '/app/my-products', icon: Package, label: 'My Products', roles: ['vendor'] },
  { to: '/app/rfqs', icon: ClipboardList, label: 'RFQs', roles: ['admin', 'procurement_officer', 'vendor'] },
  { to: '/app/quotations', icon: FileCheck, label: 'Quotations', roles: ['admin', 'procurement_officer', 'vendor'] },
  { to: '/app/quotations/compare', icon: FileCheck, label: 'Comparison', roles: ['admin', 'procurement_officer'] },
  { to: '/app/approvals', icon: CheckCircle, label: 'Approvals', roles: ['admin', 'manager'] },
  { to: '/app/dashboard/orders', icon: ShoppingCart, label: 'Purchase Orders', roles: ['admin', 'procurement_officer', 'vendor'] },
  { to: '/app/invoices', icon: FileText, label: 'Invoices', roles: ['admin', 'procurement_officer'] },
  { to: '/app/activity', icon: Activity, label: 'Activity Logs', roles: ['admin'] },
  { to: '/app/reports', icon: BarChart3, label: 'Reports', roles: ['admin', 'manager', 'procurement_officer'] },
  { to: '/app/settings', icon: Settings, label: 'Settings', roles: ['admin', 'procurement_officer', 'manager', 'vendor'] },
]

export function getNavForRole(role: string) {
  return allNavItems.filter((item) => item.roles.includes(role))
}
