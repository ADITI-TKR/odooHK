import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['Draft', 'Approved', 'Sent'], default: 'Draft' },
  },
  { timestamps: true },
)

invoiceSchema.pre('save', async function () {
  if (this.invoiceNumber) return
  const count = await mongoose.model('Invoice').countDocuments()
  this.invoiceNumber = `INV-${5510 + count}`
})

export default mongoose.model('Invoice', invoiceSchema)
