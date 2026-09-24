import mongoose, { Schema, Document } from 'mongoose'

export interface IRepresentative extends Document {
  name: string
  phone: string
  email?: string
  address: string
  district: string
  upazila: string
  profileImage?: string
  telegramChatId?: string
  telegramUsername?: string
  commissionRate: number  // percentage
  status: 'সক্রিয়' | 'নিষ্ক্রিয়'
  joinDate: Date
  nidNumber?: string
  bankAccount?: string
  totalSales: number
  totalCommission: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const RepresentativeSchema = new Schema<IRepresentative>(
  {
    name:              { type: String, required: true },
    phone:             { type: String, required: true },
    email:             { type: String },
    address:           { type: String, required: true },
    district:          { type: String, required: true },
    upazila:           { type: String, required: true },
    profileImage:      { type: String },
    telegramChatId:    { type: String },
    telegramUsername:  { type: String },
    commissionRate:    { type: Number, default: 10 },
    status:            { type: String, enum: ['সক্রিয়', 'নিষ্ক্রিয়'], default: 'সক্রিয়' },
    joinDate:          { type: Date, default: Date.now },
    nidNumber:         { type: String },
    bankAccount:       { type: String },
    totalSales:        { type: Number, default: 0 },
    totalCommission:   { type: Number, default: 0 },
    notes:             { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Representative || mongoose.model<IRepresentative>('Representative', RepresentativeSchema)
