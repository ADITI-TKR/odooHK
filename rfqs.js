import { Router } from 'express'
import Company from '../models/Company.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res) => {
  const { search, industry, status } = req.query
  const filter = {}
  if (search) filter.name = { $regex: search, $options: 'i' }
  if (industry) filter.industry = industry
  if (status) filter.status = status
  const companies = await Company.find(filter).sort('-createdAt')
  res.json(companies)
})

router.get('/:id', protect, async (req, res) => {
  const company = await Company.findById(req.params.id)
  if (!company) return res.status(404).json({ message: 'Not found' })
  res.json(company)
})

export default router
