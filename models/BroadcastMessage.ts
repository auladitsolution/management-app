import mongoose, { Schema, Document } from 'mongoose'

export interface IBroadcastResult {
  representativeId: mongoose.Types.ObjectId
  name: string
  chatId: string
  success: boolean
}

export interface IBroadcastMessage extends Document {
  title: string
  message: string
  imageUrl?: string
  targetDistrict?: string  // null means all
  recipientCount: number
  successCount: number
  failedCount: number
  results: IBroadcastResult[]
  sentAt: Date
  sentBy: string
  createdAt: Date
}

const BroadcastResultSchema = new Schema<IBroadcastResult>({
  representativeId: { type: Schema.Types.ObjectId, ref: 'Representative' },
  name:             { type: String },
  chatId:           { type: String },
  success:          { type: Boolean },
})

const BroadcastMessageSchema = new Schema<IBroadcastMessage>(
  {
    title:          { type: String, required: true },
    message:        { type: String, required: true },
    imageUrl:       { type: String },
    targetDistrict: { type: String },  // undefined = সবাইকে
    recipientCount: { type: Number, default: 0 },
    successCount:   { type: Number, default: 0 },
    failedCount:    { type: Number, default: 0 },
    results:        [BroadcastResultSchema],
    sentAt:         { type: Date, default: Date.now },
    sentBy:         { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.BroadcastMessage || mongoose.model<IBroadcastMessage>('BroadcastMessage', BroadcastMessageSchema)
