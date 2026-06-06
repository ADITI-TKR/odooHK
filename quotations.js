import { Router } from 'express'
import Approval from '../models/Approval.js'
import Activity from '../models/Activity.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res) => {
  const approvals = await Approval.find()
    .populate('rfq', 'rfqNumber title')
    .populate('vendor', 'name')
    .sort('-createdAt')
  res.json(approvals)
})

router.post('/', protect, async (req, res) => {
  const approval = await Approval.create({
    ...req.body,
    createdBy: req.user._id,
    timeline: [
      { step: 'Procurement Officer', status: 'done', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
      { step: 'Department Manager', status: 'current', date: 'Awaiting' },
      { step: 'Finance Head', status: 'upcoming', date: '' },
    ],
  })
  res.status(201).json(approval)
})

router.patch('/:id', protect, async (req, res) => {
  const { status, remarks } = req.body
  const approval = await Approval.findById(req.params.id)
  if (!approval) return res.status(404).json({ message: 'Not found' })

  approval.status = status
  if (remarks) approval.remarks = remarks
  if (status === 'Approved') {
    approval.timeline = approval.timeline.map((t, i) => ({
      ...t.toObject(),
      status: 'done',
      date: t.date === 'Awaiting' || !t.date
        ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : t.date,
    }))
  }
  await approval.save()

  await Activity.create({
    type: 'notification',
    title: `Approval ${status.toLowerCase()}`,
    description: `${approval.approvalNumber} ${status.toLowerCase()}`,
    user: req.user._id,
  })

  res.json(approval)
})

export default router
