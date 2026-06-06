import { Link } from 'react-router-dom'
import {
  ArrowRight, BarChart3, Check, CheckCircle, ChevronDown, ClipboardList,
  FileText, Play, Rocket, Shield, ShoppingCart, Users, Zap,
} from 'lucide-react'
import DashboardPreview from '../components/landing/DashboardPreview'

const steps = [
  { icon: ClipboardList, color: 'bg-orange-100 text-brand', title: 'Create RFQ', desc: 'Procurement officers create structured RFQs and assign vendors.' },
  { icon: FileText, color: 'bg-blue-100 text-blue-600', title: 'Receive Quotations', desc: 'Vendors submit competitive pricing, timelines, and terms.' },
  { icon: BarChart3, color: 'bg-green-100 text-green-600', title: 'Compare & Select', desc: 'Side-by-side comparison with ratings and lowest-price highlights.' },
  { icon: CheckCircle, color: 'bg-yellow-100 text-yellow-600', title: 'Approve', desc: 'Managers review and approve through structured workflows.' },
  { icon: ShoppingCart, color: 'bg-purple-100 text-purple-600', title: 'Purchase & Invoice', desc: 'Auto-generate POs, invoices, print and email delivery.' },
]

const capabilities = [
  { icon: Users, color: 'text-brand bg-orange-50', title: 'Vendor Management', desc: 'Register vendors, track GST, categories, ratings and product catalogs.' },
  { icon: ClipboardList, color: 'text-blue-600 bg-blue-50', title: 'RFQ Management', desc: 'Create RFQs with items, deadlines, attachments and vendor assignments.' },
  { icon: FileText, color: 'text-green-600 bg-green-50', title: 'Quotation Comparison', desc: 'Compare vendor quotes by price, delivery, warranty and performance.' },
  { icon: CheckCircle, color: 'text-yellow-600 bg-yellow-50', title: 'Approval Workflow', desc: 'Multi-step approvals with remarks, timeline and status tracking.' },
  { icon: ShoppingCart, color: 'text-purple-600 bg-purple-50', title: 'PO & Invoicing', desc: 'Generate purchase orders, tax calculations, PDF export and email.' },
]

const whyPoints = [
  'Real-time visibility across procurement pipeline',
  'Automated workflows from RFQ to invoice',
  'Secure data with role-based access control',
  'Smart notifications and activity audit logs',
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-ink">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
              <Rocket size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">VendorBridge</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 lg:flex">
            <a href="#home" className="hover:text-brand">Home</a>
            <a href="#features" className="hover:text-brand">Features</a>
            <a href="#how-it-works" className="hover:text-brand">How It Works</a>
            <a href="#pricing" className="hover:text-brand">Pricing</a>
            <button className="flex items-center gap-1 hover:text-brand">Resources <ChevronDown size={14} /></button>
            <a href="#about" className="hover:text-brand">About Us</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-medium text-gray-700 hover:text-brand sm:block">Log In</Link>
            <Link to="/register" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200/50 hover:bg-brand-dark">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-semibold text-brand">
              #1 Procurement Management ERP
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight lg:text-5xl xl:text-6xl">
              Smarter Procurement.{' '}
              <span className="text-brand">Stronger Partnerships.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              VendorBridge is a centralized ERP platform to manage vendors, RFQs, quotations,
              approvals, purchase orders, and invoices — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-orange-200/50 hover:bg-brand-dark">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold hover:bg-gray-50">
                <Play size={18} className="text-brand" /> Book a Demo
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted">
              {['Easy to Use', 'Secure & Reliable', 'Built for Teams'].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <Check size={16} className="text-brand" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-orange-100/50 to-transparent blur-2xl" />
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold lg:text-4xl">A simple and efficient procurement process</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">From RFQ creation to invoice delivery — streamlined for every role.</p>

          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-8 hidden h-0.5 border-t-2 border-dashed border-gray-300 lg:block" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((s, i) => (
                <div key={s.title} className="relative flex flex-col items-center text-center">
                  <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl ${s.color} shadow-sm`}>
                    <s.icon size={28} />
                  </div>
                  <span className="mt-2 text-xs font-bold text-brand">Step {i + 1}</span>
                  <h3 className="mt-2 font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Capabilities */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Key Capabilities</h2>
            <p className="mt-3 text-muted">Everything you need to digitize procurement operations</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {capabilities.map((c) => (
              <div key={c.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className={`mb-4 inline-flex rounded-xl p-3 ${c.color}`}>
                  <c.icon size={24} />
                </div>
                <h3 className="font-bold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why VendorBridge */}
      <section id="about" className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Why VendorBridge?</span>
            <h2 className="mt-4 text-3xl font-bold lg:text-4xl">Designed to simplify procurement for everyone</h2>
            <ul className="mt-8 space-y-4">
              {whyPoints.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100">
                    <Check size={14} className="text-brand" />
                  </div>
                  <span className="text-gray-700">{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-6">
              <div className="flex items-center gap-2 text-sm text-muted">
                <Shield size={18} className="text-brand" /> Enterprise Security
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Zap size={18} className="text-brand" /> Real-time Analytics
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              <DashboardPreview />
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
              <p className="text-xs font-semibold text-brand">PO Generated</p>
              <p className="text-sm font-bold">PO-2024-0123</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-brand to-orange-600 px-8 py-16 text-center text-white shadow-2xl shadow-orange-200/40">
          <h2 className="text-3xl font-bold lg:text-4xl">Ready to streamline your procurement?</h2>
          <p className="mx-auto mt-4 max-w-xl text-orange-100">
            Join organizations using VendorBridge to reduce manual inefficiencies and build stronger vendor partnerships.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-brand hover:bg-orange-50">
              Get Started Free
            </Link>
            <button className="rounded-xl border-2 border-white/40 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
                <Rocket size={16} className="text-white" />
              </div>
              <span className="font-bold">VendorBridge</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Enterprise procurement ERP for vendor management, RFQs, approvals, and invoicing.
            </p>
            <p className="mt-6 text-xs text-muted">© 2026 VendorBridge. All rights reserved.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Marketplace', 'Integrations'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Blog'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="hover:text-brand">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="font-semibold">Stay updated</h4>
            <div className="mt-4 flex">
              <input placeholder="Email address" className="flex-1 rounded-l-lg border border-gray-200 px-4 py-2.5 text-sm outline-none" />
              <button className="rounded-r-lg bg-brand px-4 text-white hover:bg-brand-dark">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
