import { ReactNode } from 'react'
import Logo from './Logo'

type AuthLayoutProps = {
  children: ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-card shadow-xl">
        <div className="hidden w-1/2 flex-col justify-between bg-ink p-10 md:flex">
          <Logo light />
          <div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white">
              Simplify your procurement operations.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Centralize vendors, RFQs, quotations, approvals, purchase orders, and invoices in one
              powerful ERP platform.
            </p>
          </div>
          <p className="text-xs text-gray-500">© 2026 VendorBridge. All rights reserved.</p>
        </div>

        <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
          <div className="mb-8 md:hidden">
            <Logo />
          </div>
          <h2 className="font-serif text-3xl font-bold text-ink">{title}</h2>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
