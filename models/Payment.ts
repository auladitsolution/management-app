import mongoose, { Schema, Document } from 'mongoose'

export interface IPaymentRecord {
  amount: number
  date: Date
  method: 'বিকাশ' | 'নগদ' | 'রকেট' | 'ব্যাংক ট্রান্সফার' | 'নগদ অর্থ'
  transactionId?: string
  receiptImage?: string
  note?: string
}

export interface IPayment extends Document {
  clientId: mongoose.Types.ObjectId
  projectId: mongoose.Types.ObjectId
  totalAmount: number
  paidAmount: number
  dueAmount: number
  payments: IPaymentRecord[]
  isPaid: boolean
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

const PaymentRecordSchema = new Schema<IPaymentRecord>({
  amount:        { type: Number, required: true },
  date:          { type: Date, required: true, default: Date.now },
  method:        {
    type: String,
    enum: ['বিকাশ', 'নগদ', 'রকেট', 'ব্যাংক ট্রান্সফার', 'নগদ অর্থ'],
    required: true,
  },
  transactionId: { type: String },
  receiptImage:  { type: String },
  note:          { type: String },
})

const PaymentSchema = new Schema<IPayment>(
  {
    clientId:    { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    projectId:   { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    totalAmount: { type: Number, required: true },
    paidAmount:  { type: Number, default: 0 },
    dueAmount:   { type: Number, default: 0 },
    payments:    [PaymentRecordSchema],
    isPaid:      { type: Boolean, default: false },
    dueDate:     { type: Date },
  },
  { timestamps: true }
)

// Auto-calculate dueAmount before save
PaymentSchema.pre('save', function (next) {
  this.dueAmount = this.totalAmount - this.paidAmount
  this.isPaid    = this.dueAmount <= 0
  next()
})

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema)
