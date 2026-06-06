import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    industry: { type: String, required: true },
    gst: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    country: { type: String, default: 'India' },
    website: String,
    employeeCount: { type: Number, default: 50 },
    status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Active' },
  },
  { timestamps: true },
)

export default mongoose.model('Company', companySchema)
