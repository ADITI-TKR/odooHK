import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['notification', 'audit'], default: 'notification' },
    title: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
)

export default mongoose.model('Activity', activitySchema)
