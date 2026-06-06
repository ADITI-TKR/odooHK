import { Router } from 'express'
import PurchaseOrder from '../models/PurchaseOrder.js'
import Vendor from '../models/Vendor.js'
import RFQ from '../models/RFQ.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res) => {
  const [totalSpend, vendorCount, orders] = await Promise.all([
    PurchaseOrder.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    Vendor.countDocuments({ status: 'Active' }),
    PurchaseOrder.find().populate('vendor', 'name rating'),
  ])

  const monthly = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => ({
    month,
    spent: Math.round(30 + Math.random() * 40),
    budget: 60 + i * 2,
  }))

  const vendorPerf = await Vendor.find({ status: 'Active' })
    .sort('-rating')
    .limit(5)
    .select('name rating')

  res.json({
    totalSpend: totalSpend[0]?.total || 0,
    activeVendors: vendorCount,
    activeRfqs: await RFQ.countDocuments({ status: 'Open' }),
    monthly,
    vendorPerf: vendorPerf.map((v) => ({
      name: v.name,
      orders: Math.floor(Math.random() * 15) + 5,
      onTime: `${90 + Math.floor(Math.random() * 9)}%`,
      rating: v.rating,
    })),
    categories: [
      { name: 'IT Equipment', pct: 41 },
      { name: 'Office Supplies', pct: 17 },
      { name: 'Manufacturing', pct: 25 },
      { name: 'Facilities', pct: 17 },
    ],
  })
})

export default router
