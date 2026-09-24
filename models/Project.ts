import mongoose, { Schema, Document } from 'mongoose'

export type ProjectStatus = 'উন্নয়নাধীন' | 'পরীক্ষামূলক' | 'হস্তান্তরিত' | 'রক্ষণাবেক্ষণ' | 'বাতিল'

export interface IProject extends Document {
  name: string
  projectType: string
  liveUrl?: string
  githubUrl?: string
  technologies: string[]
  status: ProjectStatus
  clientId: mongoose.Types.ObjectId
  deliveryDate?: Date
  warrantyMonths?: number
  description?: string
  thumbnail?: string
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    name:          { type: String, required: true },
    projectType:   { type: String, required: true },
    liveUrl:       { type: String },
    githubUrl:     { type: String },
    technologies:  [{ type: String }],
    status:        {
      type:    String,
      enum:    ['উন্নয়নাধীন', 'পরীক্ষামূলক', 'হস্তান্তরিত', 'রক্ষণাবেক্ষণ', 'বাতিল'],
      default: 'উন্নয়নাধীন',
    },
    clientId:      { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    deliveryDate:  { type: Date },
    warrantyMonths:{ type: Number, default: 3 },
    description:   { type: String },
    thumbnail:     { type: String },
    totalPrice:    { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
