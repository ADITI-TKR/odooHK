import { Router } from 'express'
import Product from '../models/Product.js'
import Vendor from '../models/Vendor.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/marketplace', protect, authorize('admin', 'procurement_officer', 'manager'), async (req, res) => {
  const { search, category } = req.query
  const filter = { status: 'Active' }
  if (search) filter.productName = { $regex: search, $options: 'i' }
  if (category) filter.category = category
  const products = await Product.find(filter)
    .populate('vendor', 'name companyName rating category email')
    .sort('-createdAt')
  res.json(products)
})

router.get('/my', protect, authorize('vendor', 'admin'), async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id })
  if (!vendor && req.user.role !== 'admin') {
    return res.status(404).json({ message: 'Vendor profile not found' })
  }
  const filter = req.user.role === 'admin' && req.query.vendorId
    ? { vendor: req.query.vendorId }
    : { vendor: vendor?._id }
  const products = await Product.find(filter).populate('vendor', 'name companyName').sort('-createdAt')
  res.json(products)
})

router.get('/', protect, authorize('admin', 'procurement_officer'), async (req, res) => {
  const products = await Product.find()
    .populate('vendor', 'name companyName rating')
    .sort('-createdAt')
    .limit(200)
  res.json(products)
})

router.post('/', protect, authorize('vendor', 'admin'), async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id })
  if (!vendor && req.user.role !== 'admin') {
    return res.status(404).json({ message: 'Vendor profile not found' })
  }
  const product = await Product.create({
    ...req.body,
    vendor: req.body.vendorId || vendor._id,
    availability: req.body.stock > 10 ? 'In Stock' : req.body.stock > 0 ? 'Low Stock' : 'Out of Stock',
  })
  res.status(201).json(product)
})

router.put('/:id', protect, authorize('vendor', 'admin'), async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  if (req.user.role === 'vendor') {
    const vendor = await Vendor.findOne({ user: req.user._id })
    if (product.vendor.toString() !== vendor?._id.toString()) return res.status(403).json({ message: 'Forbidden' })
  }
  Object.assign(product, req.body)
  if (req.body.stock !== undefined) {
    product.availability = req.body.stock > 10 ? 'In Stock' : req.body.stock > 0 ? 'Low Stock' : 'Out of Stock'
  }
  await product.save()
  res.json(product)
})

router.delete('/:id', protect, authorize('vendor', 'admin'), async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  if (req.user.role === 'vendor') {
    const vendor = await Vendor.findOne({ user: req.user._id })
    if (product.vendor.toString() !== vendor?._id.toString()) return res.status(403).json({ message: 'Forbidden' })
  }
  await product.deleteOne()
  res.json({ message: 'Deleted' })
})

export default router
