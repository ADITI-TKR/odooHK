import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  specifications: String,
})

const rfqSchema = new mongoose.Schema(
  {
    rfqNumber: { type: String, unique: true },
    title: { type: String, required: true },
    category: { type: String },
    deadline: { type: Date, required: true },
    items: [itemSchema],
    assignedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
    status: { type: String, enum: ['Open', 'Pending', 'Closed', 'Draft'], default: 'Open' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

rfqSchema.pre('save', async function () {
  if (this.rfqNumber) return
  const count = await mongoose.model('RFQ').countDocuments()
  this.rfqNumber = `RFQ-${1040 + count}`
})

export default mongoose.model('RFQ', rfqSchema)
