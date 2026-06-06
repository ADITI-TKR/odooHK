import { Router } from 'express'
import RFQ from '../models/RFQ.js'
import Activity from '../models/Activity.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res) => {
  const rfqs = await RFQ.find()
    .populate('assignedVendors', 'name')
    .sort('-createdAt')
  res.json(rfqs)
})

router.get('/:id', protect, async (req, res) => {
  const rfq = await RFQ.findById(req.params.id).populate('assignedVendors', 'name email')
  if (!rfq) return res.status(404).json({ message: 'RFQ not found' })
  res.json(rfq)
})

router.post('/', protect, async (req, res) => {
  const rfq = await RFQ.create({ ...req.body, createdBy: req.user._id })
  await Activity.create({
    type: 'audit',
    title: 'RFQ Created',
    description: `${rfq.rfqNumber} — ${rfq.title}`,
    user: req.user._id,
  })
  res.status(201).json(rfq)
})

export default router
