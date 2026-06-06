import { Router } from 'express'
import User from '../models/User.js'
import Vendor from '../models/Vendor.js'
import Company from '../models/Company.js'
import Product from '../models/Product.js'
import Activity from '../models/Activity.js'
import { getProductImage } from '../lib/productImages.js'
import { protect, signToken } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })
    const user = await User.create({ name, email, password, role })
    const token = signToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/register-vendor', async (req, res) => {
  try {
    const {
      name, email, password,
      companyName, companyDescription, website,
      category, gst, phone, address, city, country,
      products,
    } = req.body

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({ name, email, password, role: 'vendor' })

    const company = await Company.create({
      name: companyName,
      description: companyDescription,
      industry: category,
      gst,
      email,
      phone,
      address,
      city,
      country,
      website,
      status: 'Pending',
    })

    const vendor = await Vendor.create({
      user: user._id,
      company: company._id,
      name: companyName,
      companyName,
      companyDescription,
      website,
      category,
      gst,
      contact: name,
      email,
      phone,
      address,
      city,
      country,
      products: products || [],
      status: 'Pending',
    })

    user.vendorProfile = vendor._id
    await user.save()

    if (products?.length) {
      await Product.insertMany(products.map((p) => ({
        productName: p.name,
        description: p.description,
        category: p.category || category,
        price: p.unitPrice || p.price || 0,
        moq: p.moq || 1,
        stock: p.stock || 100,
        images: [getProductImage(p.name || p.category || '')],
        vendor: vendor._id,
        status: 'Active',
        availability: 'In Stock',
      })))
    }

    await Activity.create({
      type: 'notification',
      title: 'New vendor registered',
      description: `${companyName} registered with ${products?.length || 0} products`,
      user: user._id,
    })

    const token = signToken(user)
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, vendorId: vendor._id },
      vendor,
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).populate('vendorProfile')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const token = signToken(user)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorId: user.vendorProfile?._id || user.vendorProfile,
        vendorProfile: user.vendorProfile,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/me', protect, (req, res) => {
  res.json({ user: req.user })
})

export default router
