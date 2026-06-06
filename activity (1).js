import mongoose from 'mongoose'

const quotationSchema = new mongoose.Schema(
  {
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deliveryTimeline: { type: String },
    warranty: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['Pending', 'Received', 'Rejected'], default: 'Received' },
  },
  { timestamps: true },
)

export default mongoose.model('Quotation', quotationSchema)
