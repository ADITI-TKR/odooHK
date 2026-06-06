import { Router } from 'express'
import Quotation from '../models/Quotation.js'
import Activity from '../models/Activity.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res) => {
  const filter = req.query.rfq ? { rfq: req.query.rfq } : {}
  const quotations = await Quotation.find(filter)
    .populate('vendor', 'name rating')
    .populate('rfq', 'rfqNumber title')
    .sort('totalPrice')
  res.json(quotations)
})

router.post('/', protect, async (req, res) => {
  const quotation = await Quotation.create(req.body)
  const populated = await quotation.populate('vendor', 'name')
  await Activity.create({
    type: 'notification',
    title: 'New quotation received',
    description: `${populated.vendor.name} submitted a quote`,
    user: req.user._id,
    metadata: { quotationId: quotation._id },
  })
  res.status(201).json(quotation)
})

export default router
