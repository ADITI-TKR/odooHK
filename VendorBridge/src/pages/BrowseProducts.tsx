import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Store } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { api, type CatalogProduct } from '../lib/api'
import { resolveProductImage } from '../lib/productImages'

export default function BrowseProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([])

  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => {})
  }, [])

  return (
    <div>
      <PageHeader
        title="Product Catalog"
        subtitle="All vendor products across the procurement ecosystem."
        action={
          <Link to="/app/marketplace" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white">
            <Store size={18} /> Open Marketplace
          </Link>
        }
      />

      <div className="rounded-2xl border border-gray-100 bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted">
              <th className="p-4 font-medium">Product</th>
              <th className="p-4 font-medium">Vendor</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={resolveProductImage(p.images, `${p.category} ${p.productName}`)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium">{p.productName}</span>
                  </div>
                </td>
                <td className="p-4">{p.vendor?.companyName}</td>
                <td className="p-4 text-muted">{p.category}</td>
                <td className="p-4 font-semibold text-brand">₹{p.price?.toLocaleString()}</td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4"><StatusBadge status={p.availability || p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="flex flex-col items-center py-16 text-muted">
            <Package size={40} className="mb-3 opacity-30" />
            <p>No products found. Run seed or have vendors upload products.</p>
          </div>
        )}
      </div>
    </div>
  )
}
