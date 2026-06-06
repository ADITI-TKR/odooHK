import mongoose from 'mongoose'

const timelineSchema = new mongoose.Schema({
  step: String,
  status: { type: String, enum: ['done', 'current', 'upcoming'] },
  date: String,
})

const approvalSchema = new mongoose.Schema(
  {
    approvalNumber: { type: String, unique: true },
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    timeline: [timelineSchema],
    remarks: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

approvalSchema.pre('save', async function () {
  if (this.approvalNumber) return
  const count = await mongoose.model('Approval').countDocuments()
  this.approvalNumber = `APR-${300 + count}`
})

export default mongoose.model('Approval', approvalSchema)
