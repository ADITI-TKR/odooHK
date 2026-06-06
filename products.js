import { Router } from 'express'
import Activity from '../models/Activity.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.get('/', protect, async (req, res) => {
  const { type } = req.query
  const filter = type ? { type } : {}
  const activities = await Activity.find(filter)
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(50)
  res.json(activities)
})

export default router
