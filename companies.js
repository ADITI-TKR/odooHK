import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  unitPrice: { type: Number, default: 0 },
  unit: { type: String, default: 'pcs' },
})

const vendorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    companyDescription: String,
    website: String,
    category: { type: String, required: true },
    gst: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city: String,
    country: String,
    products: [productSchema],
    rating: { type: Number, default: 4.0 },
    status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Pending' },
  },
  { timestamps: true },
)

export default mongoose.model('Vendor', vendorSchema)
