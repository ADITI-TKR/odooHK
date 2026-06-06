import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    price: { type: Number, required: true },
    moq: { type: Number, default: 1 },
    stock: { type: Number, default: 0 },
    availability: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
    images: [{ type: String }],
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    status: { type: String, enum: ['Active', 'Inactive', 'Draft'], default: 'Active' },
  },
  { timestamps: true },
)

export default mongoose.model('Product', productSchema)
