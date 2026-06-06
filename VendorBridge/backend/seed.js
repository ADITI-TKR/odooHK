import 'dotenv/config'
import { writeFileSync } from 'fs'
import { connectDB } from './config/db.js'
import User from './models/User.js'
import Company from './models/Company.js'
import Vendor from './models/Vendor.js'
import RFQ from './models/RFQ.js'
import Quotation from './models/Quotation.js'
import Approval from './models/Approval.js'
import PurchaseOrder from './models/PurchaseOrder.js'
import Invoice from './models/Invoice.js'
import Activity from './models/Activity.js'
import Product from './models/Product.js'

const productImages = {
  Laptop: '/products/laptop.svg',
  Monitor: '/products/monitor.svg',
  Chair: '/products/chair.svg',
  Desk: '/products/desk.svg',
  Printer: '/products/printer.svg',
  Server: '/products/server.svg',
  Switch: '/products/switch.svg',
  Cable: '/products/cable.svg',
  Paper: '/products/paper.svg',
  Toner: '/products/toner.svg',
  Cabinet: '/products/cabinet.svg',
  Whiteboard: '/products/whiteboard.svg',
  default: '/products/default.svg',
}

const industries = ['IT Equipment', 'Office Supplies', 'Furniture', 'Manufacturing', 'Facilities', 'Printing', 'Construction', 'Energy', 'Healthcare', 'Logistics']
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow']
const prefixes = ['Bharat', 'Hindustan', 'Shree', 'Lakshmi', 'Ganesh', 'Swadeshi', 'Arya', 'Nirman', 'Sagar', 'Vikas', 'Pragati', 'Krishna', 'Om', 'Mahalaxmi', 'Sanskruti']
const suffixes = ['Udyog', 'Enterprises', 'Traders', 'Suppliers', 'Bhavan', 'Kendra', 'Industries', 'Works', 'Mart', 'Solutions', 'Services', 'Limited', 'Corp', 'Sangh', 'Samuh']
const rfqTitles = [
  'Laptop Procurement', 'Office Chairs', 'Server Upgrade', 'Desk Purchase', 'Network Equipment',
  'Cleaning Services', 'Printing Supplies', 'Solar Installation', 'Steel Fabrication', 'Furniture Refresh',
]
const productTypes = ['Laptop', 'Monitor', 'Chair', 'Desk', 'Printer', 'Server', 'Switch', 'Cable', 'Paper', 'Toner', 'Cabinet', 'Whiteboard']
const statuses = ['Open', 'Open', 'Open', 'Pending', 'Closed', 'Draft']
const firstNames = ['Raj', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anita', 'Rahul', 'Kavita', 'Suresh', 'Meera']
const lastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Reddy', 'Gupta', 'Nair', 'Iyer', 'Das', 'Verma']

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function gst(i) { return `${rand(10, 36)}AABC${String(i).padStart(4, '0')}Z1${pick(['A', 'B', 'C', 'D'])}` }
function getProductImage(name) {
  const key = Object.keys(productImages).find((k) => k !== 'default' && name.includes(k))
  return productImages[key] || productImages.default
}

async function seed() {
  await connectDB()
  console.log('Clearing database...')
  await Promise.all([
    User.deleteMany(), Company.deleteMany(), Vendor.deleteMany(), Product.deleteMany(),
    RFQ.deleteMany(), Quotation.deleteMany(), Approval.deleteMany(),
    PurchaseOrder.deleteMany(), Invoice.deleteMany(), Activity.deleteMany(),
  ])

  const admin = await User.create({ name: 'Arvind Khanna', email: 'admin@vendorbridge.com', password: 'admin', role: 'admin' })
  const officer = await User.create({ name: 'Priya Sharma', email: 'priya@vendorbridge.com', password: 'priya', role: 'procurement_officer' })
  const manager = await User.create({ name: 'Sanjay Reddy', email: 'manager@vendorbridge.com', password: 'manager', role: 'manager' })

  const credentials = []

  console.log('Creating 100 companies with unique emails...')
  const companyDocs = Array.from({ length: 100 }, (_, i) => {
    const num = i + 1
    const name = `${pick(prefixes)}${pick(suffixes)} ${num}`
    const industry = pick(industries)
    const city = pick(cities)
    const companyEmail = `contact@company${String(num).padStart(3, '0')}.vendorbridge.com`
    return {
      name,
      description: `${name} is a leading provider of ${industry.toLowerCase()} solutions.`,
      industry,
      gst: gst(num),
      email: companyEmail,
      phone: `+91 ${rand(70000, 99999)} ${rand(10000, 99999)}`,
      address: `${rand(1, 200)} Business Park, ${city}`,
      city,
      country: 'India',
      website: `https://company${String(num).padStart(3, '0')}.vendorbridge.com`,
      employeeCount: rand(20, 5000),
      status: pick(['Active', 'Active', 'Active', 'Pending', 'Inactive']),
    }
  })
  const companies = await Company.insertMany(companyDocs)

  console.log('Creating 100 vendors with products...')
  const vendorDocs = companies.map((co, i) => {
    const num = i + 1
    const contact = `${pick(firstNames)} ${pick(lastNames)}`
    const productCount = rand(2, 4)
    const vendorProducts = Array.from({ length: productCount }, () => {
      const type = pick(productTypes)
      return {
        name: `${type} Model ${rand(100, 999)}`,
        description: `Enterprise-grade ${type.toLowerCase()} for business procurement`,
        category: co.industry,
        unitPrice: rand(500, 65000),
        unit: pick(['pcs', 'kg', 'set', 'month', 'meter']),
        image: getProductImage(type),
      }
    })
    return {
      company: co._id,
      name: co.name,
      companyName: co.name,
      companyDescription: co.description,
      website: co.website,
      category: co.industry,
      gst: co.gst,
      contact,
      email: co.email,
      phone: co.phone,
      address: co.address,
      city: co.city,
      country: co.country,
      products: vendorProducts,
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      status: co.status === 'Inactive' ? 'Inactive' : pick(['Active', 'Active', 'Pending']),
    }
  })
  const vendors = await Vendor.insertMany(vendorDocs)

  console.log('Creating product catalog with photos...')
  const productDocs = []
  for (const v of vendors) {
    for (const p of v.products || []) {
      productDocs.push({
        productName: p.name,
        description: p.description,
        category: p.category || v.category,
        price: p.unitPrice,
        moq: rand(1, 10),
        stock: rand(50, 500),
        availability: 'In Stock',
        images: [p.image || getProductImage(p.name)],
        vendor: v._id,
        status: 'Active',
      })
    }
  }
  await Product.insertMany(productDocs)

  console.log('Creating 100 vendor user accounts...')
  for (let i = 0; i < vendors.length; i++) {
    const num = i + 1
    const vendorLoginEmail = `vendor${String(num).padStart(3, '0')}@vendorbridge.com`
    const vendorPassword = `Vendor@${1000 + num}`

    const user = await User.create({
      name: vendors[i].contact,
      email: vendorLoginEmail,
      password: vendorPassword,
      role: 'vendor',
      vendorProfile: vendors[i]._id,
    })
    vendors[i].user = user._id
    await vendors[i].save()

    credentials.push({
      vendor: vendors[i].companyName,
      companyEmail: vendors[i].email,
      loginEmail: vendorLoginEmail,
      password: vendorPassword,
      products: vendors[i].products.length,
    })
  }

  console.log('Creating 100 RFQ requests...')
  const rfqDocs = Array.from({ length: 100 }, (_, i) => {
    const assigned = [vendors[rand(0, 99)]._id, vendors[rand(0, 99)]._id, vendors[rand(0, 99)]._id]
    const itemName = pick(productTypes)
    return {
      rfqNumber: `RFQ-${1001 + i}`,
      title: `${pick(rfqTitles)} Q${rand(1, 4)} — #${i + 1}`,
      category: pick(industries),
      deadline: new Date(Date.now() + rand(5, 60) * 86400000),
      items: [{ name: itemName, quantity: rand(10, 500), specifications: `Standard enterprise ${itemName.toLowerCase()}` }],
      assignedVendors: [...new Set(assigned.map(String))]
        .map((id) => vendors.find((v) => v._id.toString() === id)?._id)
        .filter(Boolean),
      status: pick(statuses),
      createdBy: pick([admin._id, officer._id]),
    }
  })
  const rfqs = await RFQ.insertMany(rfqDocs)

  console.log('Creating quotations, approvals, orders...')
  const quotations = []
  for (let i = 0; i < 80; i++) {
    const rfq = rfqs[i]
    const vendor = vendors[rand(0, 99)]
    const qty = rfq.items[0]?.quantity || 50
    const unitPrice = rand(100, 3000)
    quotations.push({
      rfq: rfq._id, vendor: vendor._id, unitPrice, totalPrice: unitPrice * qty,
      deliveryTimeline: `${rand(5, 30)} days`, warranty: `${rand(1, 5)} years`,
      status: pick(['Received', 'Received', 'Pending']),
    })
  }
  const savedQuotes = await Quotation.insertMany(quotations)

  const approvals = []
  for (let i = 0; i < 40; i++) {
    const q = savedQuotes[i]
    approvals.push({
      approvalNumber: `APR-${400 + i}`, rfq: q.rfq, quotation: q._id, vendor: q.vendor,
      amount: q.totalPrice, status: pick(['Pending', 'Pending', 'Approved', 'Rejected']),
      createdBy: officer._id,
      timeline: [
        { step: 'Procurement Officer', status: 'done', date: 'Jun 1, 2026' },
        { step: 'Department Manager', status: 'current', date: 'Awaiting' },
        { step: 'Finance Head', status: 'upcoming', date: '' },
      ],
    })
  }
  await Approval.insertMany(approvals)

  const pos = []
  for (let i = 0; i < 30; i++) {
    const q = savedQuotes[i + 40] || savedQuotes[i]
    const subtotal = Math.round(q.totalPrice * 0.94)
    pos.push({
      poNumber: `PO-${9000 + i}`, rfq: q.rfq, quotation: q._id, vendor: q.vendor,
      subtotal, tax: q.totalPrice - subtotal, total: q.totalPrice,
      status: pick(['Approved', 'Approved', 'Draft', 'Sent']),
    })
  }
  const savedPOs = await PurchaseOrder.insertMany(pos)

  await Invoice.insertMany(
    savedPOs.slice(0, 25).map((po, i) => ({
      invoiceNumber: `INV-${6000 + i}`, purchaseOrder: po._id, vendor: po.vendor,
      subtotal: po.subtotal, tax: po.tax, total: po.total,
      status: pick(['Sent', 'Approved', 'Draft']),
    })),
  )

  await Activity.insertMany([
    { type: 'notification', title: 'RFQ Created', description: 'Office Chairs Procurement — new request', user: officer._id },
    { type: 'notification', title: 'Quotation Submitted', description: 'By vendor catalog', user: admin._id },
    { type: 'audit', title: 'Database Seeded', description: '100 companies, 100 vendors, 100 RFQs with product photos', user: admin._id },
  ])

  writeFileSync('vendor-credentials.json', JSON.stringify(credentials, null, 2))

  console.log('\n✅ Seed complete!')
  console.log(`   ${productDocs.length} products with local images`)
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
