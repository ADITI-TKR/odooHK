import { Router } from 'express'
import Vendor from '../models/Vendor.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res) => {
  const { search, category, status } = req.query
  const filter = {}
  if (search) filter.name = { $regex: search, $options: 'i' }
  if (category) filter.category = category
  if (status) filter.status = status
  const vendors = await Vendor.find(filter).sort('-createdAt')
  res.json(vendors)
})

router.get('/:id', protect, async (req, res) => {
  const vendor = await Vendor.findById(req.params.id)
  if (!vendor) return res.status(404).json({ message: 'Not found' })
  res.json(vendor)
})

router.post('/', protect, async (req, res) => {
  const vendor = await Vendor.create(req.body)
  res.status(201).json(vendor)
})

router.put('/:id', protect, async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(vendor)
})

export default router
