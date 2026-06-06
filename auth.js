import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import vendorRoutes from './routes/vendors.js'
import companyRoutes from './routes/companies.js'
import rfqRoutes from './routes/rfqs.js'
import quotationRoutes from './routes/quotations.js'
import approvalRoutes from './routes/approvals.js'
import invoiceRoutes from './routes/invoices.js'
import activityRoutes from './routes/activity.js'
import dashboardRoutes from './routes/dashboard.js'
import reportRoutes from './routes/reports.js'
import productRoutes from './routes/products.js'
import userRoutes from './routes/users.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/vendors', vendorRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/rfqs', rfqRoutes)
app.use('/api/quotations', quotationRoutes)
app.use('/api/approvals', approvalRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message)
    process.exit(1)
  })
