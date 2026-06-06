import { Router } from 'express'
import RFQ from '../models/RFQ.js'
import Approval from '../models/Approval.js'
import PurchaseOrder from '../models/PurchaseOrder.js'
import Invoice from '../models/Invoice.js'
import Activity from '../models/Activity.js'
import Vendor from '../models/Vendor.js'
import Company from '../models/Company.js'
import Quotation from '../models/Quotation.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/stats', protect, async (req, res) => {
  const role = req.user.role
  const vendorDoc = role === 'vendor' ? await Vendor.findOne({ user: req.user._id }) : null

  const [
    totalVendors, activeRfqs, quotationsReceived, pendingApprovals, totalPOs,
    totalProducts, recentRfqs, pendingList, recentActivity, notifications,
    spendByMonth, vendorLeaderboard,
  ] = await Promise.all([
    Vendor.countDocuments({ status: 'Active' }),
    RFQ.countDocuments({ status: { $in: ['Open', 'Pending'] } }),
    Quotation.countDocuments({ status: 'Received' }),
    Approval.countDocuments({ status: 'Pending' }),
    PurchaseOrder.countDocuments(),
    Product.countDocuments({ status: 'Active' }),
    RFQ.find().sort('-createdAt').limit(8).select('rfqNumber title category deadline status'),
    Approval.find({ status: 'Pending' }).populate('rfq', 'rfqNumber title').populate('vendor', 'name').limit(6),
    Activity.find().sort('-createdAt').limit(8),
    Activity.find({ type: 'notification' }).sort('-createdAt').limit(6),
    PurchaseOrder.aggregate([
      { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$total' } } },
      { $sort: { _id: 1 } },
    ]),
    buildVendorLeaderboard(),
  ])

  const [rfqCount, quoteCount, approvalPendingCount, poCount, invoiceCount] = await Promise.all([
    RFQ.countDocuments(),
    Quotation.countDocuments(),
    Approval.countDocuments({ status: 'Pending' }),
    PurchaseOrder.countDocuments(),
    Invoice.countDocuments(),
  ])

  const totalSpend = await PurchaseOrder.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }])

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const spendChart = months.slice(0, 7).map((m, i) => ({
    month: m,
    value: spendByMonth.find((s) => s._id === i + 1)?.total || Math.round(150000 + Math.random() * 200000),
  }))

  const pipeline = [
    { stage: 'RFQ Created', count: rfqCount, icon: 'rfq' },
    { stage: 'Quotation Received', count: quoteCount, icon: 'quote' },
    { stage: 'Approval Pending', count: approvalPendingCount, icon: 'approval' },
    { stage: 'Purchase Order', count: poCount, icon: 'po' },
    { stage: 'Invoice Generated', count: invoiceCount, icon: 'invoice' },
  ]

  let stats = {
    role,
    kpis: {
      totalVendors,
      activeRfqs,
      quotationsReceived,
      pendingApprovals,
      purchaseOrders: totalPOs,
      totalSpend: totalSpend[0]?.total || 0,
      totalProducts,
      totalUsers: role === 'admin' ? await User.countDocuments() : undefined,
    },
    pipeline,
    spendChart,
    vendorLeaderboard,
    recentRfqs: recentRfqs.map((r) => ({
      id: r.rfqNumber,
      title: r.title,
      category: r.category,
      deadline: new Date(r.deadline).toLocaleDateString(),
      status: r.status,
    })),
    pendingApprovalsList: pendingList.map((a) => ({
      id: a.approvalNumber,
      title: a.rfq?.title,
      rfq: a.rfq?.rfqNumber,
      vendor: a.vendor?.name,
      amount: a.amount,
    })),
    recentActivity: recentActivity.map((a) => ({
      title: a.title,
      description: a.description,
      time: formatRelative(a.createdAt),
      type: a.type,
    })),
    notifications: notifications.map((n) => ({
      title: n.title,
      description: n.description,
      time: formatRelative(n.createdAt),
    })),
  }

  if (role === 'vendor' && vendorDoc) {
    const myProducts = await Product.countDocuments({ vendor: vendorDoc._id })
    const myQuotes = await Quotation.countDocuments({ vendor: vendorDoc._id })
    stats.kpis = { myProducts, myQuotes, assignedRfqs: await RFQ.countDocuments({ assignedVendors: vendorDoc._id }) }
  }

  res.json(stats)
})

async function buildVendorLeaderboard() {
  const vendors = await Vendor.find({ status: 'Active' }).sort('-rating').limit(10)
  const leaderboard = []
  for (const v of vendors) {
    const orders = await PurchaseOrder.countDocuments({ vendor: v._id })
    const quotes = await Quotation.countDocuments({ vendor: v._id })
    const successRate = quotes > 0 ? Math.round((orders / quotes) * 100) : Math.round(70 + v.rating * 5)
    leaderboard.push({
      name: v.companyName || v.name,
      rating: v.rating,
      totalOrders: orders,
      successRate: Math.min(successRate, 99),
    })
  }
  return leaderboard.sort((a, b) => b.rating - a.rating)
}

router.get('/vendors', protect, async (req, res) => {
  const [total, active, pending, totalCompanies, topVendors, recentCompanies] = await Promise.all([
    Vendor.countDocuments(), Vendor.countDocuments({ status: 'Active' }),
    Vendor.countDocuments({ status: 'Pending' }), Company.countDocuments(),
    Vendor.find({ status: 'Active' }).sort('-rating').limit(8),
    Company.find().sort('-createdAt').limit(8),
  ])
  const categories = await Vendor.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])
  res.json({ total, active, pending, totalCompanies, topVendors, recentCompanies, categories })
})

router.get('/rfqs', protect, async (req, res) => {
  const [open, pending, closed, recent] = await Promise.all([
    RFQ.countDocuments({ status: 'Open' }), RFQ.countDocuments({ status: 'Pending' }),
    RFQ.countDocuments({ status: 'Closed' }),
    RFQ.find().sort('-createdAt').limit(15).populate('assignedVendors', 'name'),
  ])
  res.json({ open, pending, closed, total: open + pending + closed, recent })
})

router.get('/quotations', protect, async (req, res) => {
  const [total, received, pending, recent] = await Promise.all([
    Quotation.countDocuments(), Quotation.countDocuments({ status: 'Received' }),
    Quotation.countDocuments({ status: 'Pending' }),
    Quotation.find().populate('vendor', 'name').populate('rfq', 'rfqNumber title').sort('-createdAt').limit(5),
  ])
  const avgPrice = await Quotation.aggregate([{ $group: { _id: null, avg: { $avg: '$totalPrice' } } }])
  res.json({ total, received, pending, avgPrice: avgPrice[0]?.avg || 0, recent })
})

router.get('/approvals', protect, async (req, res) => {
  const [pending, approved, rejected, recent] = await Promise.all([
    Approval.countDocuments({ status: 'Pending' }), Approval.countDocuments({ status: 'Approved' }),
    Approval.countDocuments({ status: 'Rejected' }),
    Approval.find().populate('rfq', 'title').populate('vendor', 'name').sort('-createdAt').limit(5),
  ])
  res.json({ pending, approved, rejected, recent })
})

router.get('/orders', protect, async (req, res) => {
  const [total, approved, draft, recent, spend] = await Promise.all([
    PurchaseOrder.countDocuments(), PurchaseOrder.countDocuments({ status: 'Approved' }),
    PurchaseOrder.countDocuments({ status: 'Draft' }),
    PurchaseOrder.find().populate('vendor', 'name').sort('-createdAt').limit(5),
    PurchaseOrder.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
  ])
  res.json({ total, approved, draft, totalSpend: spend[0]?.total || 0, recent })
})

router.get('/invoices', protect, async (req, res) => {
  const [total, sent, draft, recent, revenue] = await Promise.all([
    Invoice.countDocuments(), Invoice.countDocuments({ status: 'Sent' }),
    Invoice.countDocuments({ status: 'Draft' }),
    Invoice.find().populate('vendor', 'name').sort('-createdAt').limit(5),
    Invoice.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
  ])
  res.json({ total, sent, draft, totalRevenue: revenue[0]?.total || 0, recent })
})

router.get('/activity', protect, async (req, res) => {
  const [notifications, audits] = await Promise.all([
    Activity.find({ type: 'notification' }).sort('-createdAt').limit(10),
    Activity.find({ type: 'audit' }).sort('-createdAt').limit(10),
  ])
  res.json({ notifications, audits, total: notifications.length + audits.length })
})

router.get('/analytics', protect, async (req, res) => {
  const [spend, vendors, rfqs, categories] = await Promise.all([
    PurchaseOrder.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    Vendor.countDocuments({ status: 'Active' }), RFQ.countDocuments({ status: 'Open' }),
    Vendor.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ])
  const monthly = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => ({
    month: m, spent: Math.round(30 + i * 5 + Math.random() * 20), budget: 60 + i * 2,
  }))
  const vendorPerf = await buildVendorLeaderboard()
  res.json({
    totalSpend: spend[0]?.total || 0, activeVendors: vendors, activeRfqs: rfqs,
    monthly, categories: categories.map((c) => ({ name: c._id, pct: c.count * 10 })),
    vendorPerf,
  })
})

function formatRelative(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins || 1} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default router
