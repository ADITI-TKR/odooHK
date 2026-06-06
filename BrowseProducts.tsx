const API = '/api'

function getToken() { return localStorage.getItem('vb_token') }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (body: { name: string; email: string; password: string; role: string }) =>
    request<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  registerVendor: (body: Record<string, unknown>) =>
    request<{ token: string; user: User; vendor: Vendor }>('/auth/register-vendor', { method: 'POST', body: JSON.stringify(body) }),

  getUsers: () => request<AdminUser[]>('/users'),
  getVendors: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<Vendor[]>(`/vendors${q}`)
  },
  getCompanies: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<Company[]>(`/companies${q}`)
  },

  getProducts: () => request<CatalogProduct[]>('/products'),
  getMarketplace: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<CatalogProduct[]>(`/products/marketplace${q}`)
  },
  getMyProducts: () => request<CatalogProduct[]>('/products/my'),
  createProduct: (body: Partial<CatalogProduct>) =>
    request<CatalogProduct>('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id: string, body: Partial<CatalogProduct>) =>
    request<CatalogProduct>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id: string) =>
    request<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),

  getRFQs: () => request<RFQ[]>('/rfqs'),
  getQuotations: (rfqId?: string) => request<Quotation[]>(`/quotations${rfqId ? `?rfq=${rfqId}` : ''}`),
  getApprovals: () => request<Approval[]>('/approvals'),
  updateApproval: (id: string, body: { status: string; remarks?: string }) =>
    request<Approval>(`/approvals/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getOrders: () => request<Order[]>('/invoices/orders'),
  sendInvoice: (id: string) => request<{ message: string }>(`/invoices/${id}/send`, { method: 'PATCH' }),
  getActivity: (type?: string) => request<ActivityItem[]>(`/activity${type ? `?type=${type}` : ''}`),

  getEnterpriseDashboard: () => request<EnterpriseDashboard>('/dashboard/stats'),
  getMainDashboard: () => request<EnterpriseDashboard>('/dashboard/stats'),
  getVendorDashboard: () => request<VendorDashboardStats>('/dashboard/vendors'),
  getRFQDashboard: () => request<RFQDashboardStats>('/dashboard/rfqs'),
  getQuotationDashboard: () => request<QuotationDashboardStats>('/dashboard/quotations'),
  getApprovalDashboard: () => request<ApprovalDashboardStats>('/dashboard/approvals'),
  getOrderDashboard: () => request<OrderDashboardStats>('/dashboard/orders'),
  getInvoiceDashboard: () => request<InvoiceDashboardStats>('/dashboard/invoices'),
  getActivityDashboard: () => request<ActivityDashboardStats>('/dashboard/activity'),
  getAnalyticsDashboard: () => request<AnalyticsDashboardStats>('/dashboard/analytics'),
  getReports: () => request<ReportData>('/reports'),
}

export type User = { id: string; name: string; email: string; role: string; vendorId?: string; vendorProfile?: Vendor }
export type AdminUser = { _id: string; name: string; email: string; role: string; vendorProfile?: { companyName: string; status: string }; createdAt: string }
export type CatalogProduct = {
  _id: string; productName: string; description?: string; category: string
  price: number; moq: number; stock: number; availability?: string
  images: string[]; status: string
  vendor?: { _id: string; name: string; companyName: string; rating: number; category: string }
}
export type Company = { _id: string; name: string; description?: string; industry: string; gst: string; email: string; phone?: string; city?: string; employeeCount?: number; status: string }
export type Vendor = { _id: string; name: string; companyName: string; companyDescription?: string; category: string; gst: string; contact: string; email: string; phone?: string; address?: string; city?: string; country?: string; products?: { name: string; unitPrice: number }[]; rating: number; status: string }
export type RFQ = { _id: string; rfqNumber: string; title: string; items: { name: string; quantity: number }[]; deadline: string; assignedVendors: { name: string }[]; status: string }
export type Quotation = { _id: string; vendor: { name: string; rating?: number }; rfq?: { rfqNumber: string; title: string }; totalPrice: number; deliveryTimeline?: string; warranty?: string; status: string }
export type Approval = { _id: string; approvalNumber: string; rfq: { rfqNumber: string; title: string }; vendor: { name: string }; amount: number; status: string; timeline: { step: string; status: string; date: string }[] }
export type Order = { _id: string; po: string; invoice: string | null; vendor: { name: string }; subtotal: number; tax: number; total: number; status: string; invoiceId?: string }
export type ActivityItem = { _id: string; type: string; title: string; description: string; createdAt: string; user?: { name: string } }
export type ReportData = { totalSpend: number; activeVendors: number; activeRfqs: number; monthly: { month: string; spent: number; budget: number }[]; vendorPerf: { name: string; orders: number; onTime: string; rating: number }[]; categories: { name: string; pct: number }[] }

export type EnterpriseDashboard = {
  role: string
  kpis: {
    totalVendors?: number; activeRfqs?: number; quotationsReceived?: number
    pendingApprovals?: number; purchaseOrders?: number; totalSpend?: number
    totalProducts?: number; totalUsers?: number
    myProducts?: number; myQuotes?: number; assignedRfqs?: number
  }
  pipeline: { stage: string; count: number; icon: string }[]
  spendChart: { month: string; value: number }[]
  vendorLeaderboard: { name: string; rating: number; totalOrders: number; successRate: number }[]
  recentRfqs: { id: string; title: string; category: string; deadline: string; status: string }[]
  pendingApprovalsList: { id: string; title: string; rfq: string; vendor: string; amount: number }[]
  recentActivity: { title: string; description: string; time: string; type: string }[]
  notifications: { title: string; description: string; time: string }[]
}

export type VendorDashboardStats = { total: number; active: number; pending: number; totalCompanies: number; topVendors: Vendor[]; recentCompanies: Company[]; categories: { _id: string; count: number }[] }
export type RFQDashboardStats = { open: number; pending: number; closed: number; total: number; recent: RFQ[] }
export type QuotationDashboardStats = { total: number; received: number; pending: number; avgPrice: number; recent: Quotation[] }
export type ApprovalDashboardStats = { pending: number; approved: number; rejected: number; recent: Approval[] }
export type OrderDashboardStats = { total: number; approved: number; draft: number; totalSpend: number; recent: { _id: string; poNumber: string; vendor: { name: string }; total: number; status: string }[] }
export type InvoiceDashboardStats = { total: number; sent: number; draft: number; totalRevenue: number; recent: { _id: string; invoiceNumber: string; vendor: { name: string }; total: number; status: string }[] }
export type ActivityDashboardStats = { total: number; notifications: ActivityItem[]; audits: ActivityItem[] }
export type AnalyticsDashboardStats = { totalSpend: number; activeVendors: number; activeRfqs: number; monthly: { month: string; spent: number; budget: number }[]; vendorPerf: { name: string; orders: number; onTime: string; rating: number }[]; categories: { name: string; pct: number }[] }

export function saveSession(token: string, user: User) {
  localStorage.setItem('vb_token', token)
  localStorage.setItem('vb_user', JSON.stringify(user))
}
export function getUser(): User | null {
  const raw = localStorage.getItem('vb_user')
  return raw ? JSON.parse(raw) : null
}
export function clearSession() {
  localStorage.removeItem('vb_token')
  localStorage.removeItem('vb_user')
}
