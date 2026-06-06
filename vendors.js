import { Router } from 'express'
import PurchaseOrder from '../models/PurchaseOrder.js'
import Invoice from '../models/Invoice.js'
import Activity from '../models/Activity.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/orders', protect, async (req, res) => {
  const orders = await PurchaseOrder.find()
    .populate('vendor', 'name email')
    .sort('-createdAt')
  const invoices = await Invoice.find().populate('purchaseOrder')
  const result = orders.map((po) => {
    const inv = invoices.find((i) => i.purchaseOrder?._id?.equals(po._id))
    return {
      _id: po._id,
      po: po.poNumber,
      invoice: inv?.invoiceNumber || null,
      vendor: po.vendor,
      subtotal: po.subtotal,
      tax: po.tax,
      total: po.total,
      status: inv?.status || po.status,
      invoiceId: inv?._id,
    }
  })
  res.json(result)
})

router.post('/generate-po', protect, async (req, res) => {
  const { quotationId, vendorId, subtotal, taxRate = 0.06 } = req.body
  const tax = Math.round(subtotal * taxRate * 100) / 100
  const total = subtotal + tax
  const po = await PurchaseOrder.create({
    quotation: quotationId,
    vendor: vendorId,
    subtotal,
    tax,
    total,
    status: 'Approved',
  })
  const invoice = await Invoice.create({
    purchaseOrder: po._id,
    vendor: vendorId,
    subtotal,
    tax,
    total,
    status: 'Draft',
  })
  await Activity.create({
    type: 'audit',
    title: 'PO & Invoice generated',
    description: `${po.poNumber} / ${invoice.invoiceNumber}`,
    user: req.user._id,
  })
  res.status(201).json({ po, invoice })
})

router.patch('/:id/send', protect, async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    { status: 'Sent' },
    { new: true },
  ).populate('vendor', 'name email')
  await Activity.create({
    type: 'audit',
    title: 'Invoice emailed',
    description: `${invoice.invoiceNumber} sent to ${invoice.vendor.name}`,
    user: req.user._id,
  })
  res.json({ message: `Invoice sent to ${invoice.vendor.email}`, invoice })
})

export default router
