import { Router } from 'express'
import User from '../models/User.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password').populate('vendorProfile', 'companyName status').sort('-createdAt')
  res.json(users)
})

export default router
