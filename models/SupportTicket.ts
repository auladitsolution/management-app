import mongoose, { Schema, Document } from 'mongoose'

export type TicketStatus = 'খোলা' | 'চলমান' | 'সমাধান হয়েছে'
export type TicketPriority = 'কম' | 'মাঝারি' | 'জরুরি'

export interface ITicketUpdate {
  message: string
  date: Date
  updatedBy: string
}

export interface ISupportTicket extends Document {
  title: string
  description: string
  clientId: mongoose.Types.ObjectId
  projectId?: mongoose.Types.ObjectId
  status: TicketStatus
  priority: TicketPriority
  resolution?: string
  timeTakenHours?: number
  updates: ITicketUpdate[]
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TicketUpdateSchema = new Schema<ITicketUpdate>({
  message:   { type: String, required: true },
  date:      { type: Date, default: Date.now },
  updatedBy: { type: String, required: true },
})

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    title:           { type: String, required: true },
    description:     { type: String, required: true },
    clientId:        { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    projectId:       { type: Schema.Types.ObjectId, ref: 'Project' },
    status:          { type: String, enum: ['খোলা', 'চলমান', 'সমাধান হয়েছে'], default: 'খোলা' },
    priority:        { type: String, enum: ['কম', 'মাঝারি', 'জরুরি'], default: 'মাঝারি' },
    resolution:      { type: String },
    timeTakenHours:  { type: Number },
    updates:         [TicketUpdateSchema],
    resolvedAt:      { type: Date },
  },
  { timestamps: true }
)

export default mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema)
