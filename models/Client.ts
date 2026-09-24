import mongoose, { Schema, Document } from 'mongoose'

export interface ICredentials {
  gmailEmail?: string
  gmailPassword?: string
  mongodbUri?: string
  mongodbUsername?: string
  mongodbPassword?: string
  mongodbCluster?: string
  firebaseProjectId?: string
  firebaseApiKey?: string
  firebaseAuthDomain?: string
  cloudinaryCloudName?: string
  cloudinaryApiKey?: string
  cloudinaryApiSecret?: string
  cloudinaryUploadPreset?: string
  vercelProjectUrl?: string
  vercelProjectId?: string
  vercelToken?: string
}

export interface IClient extends Document {
  name: string
  businessName?: string
  businessType: string
  phone: string
  email?: string
  address: string
  district: string
  upazila: string
  profileImage?: string
  status: 'সক্রিয়' | 'নিষ্ক্রিয়' | 'অপেক্ষমান'
  credentials: ICredentials
  notes?: string
  representativeId?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CredentialsSchema = new Schema<ICredentials>({
  gmailEmail:              { type: String },
  gmailPassword:           { type: String },
  mongodbUri:              { type: String },
  mongodbUsername:         { type: String },
  mongodbPassword:         { type: String },
  mongodbCluster:          { type: String },
  firebaseProjectId:       { type: String },
  firebaseApiKey:          { type: String },
  firebaseAuthDomain:      { type: String },
  cloudinaryCloudName:     { type: String },
  cloudinaryApiKey:        { type: String },
  cloudinaryApiSecret:     { type: String },
  cloudinaryUploadPreset:  { type: String },
  vercelProjectUrl:        { type: String },
  vercelProjectId:         { type: String },
  vercelToken:             { type: String },
}, { _id: false })

const ClientSchema = new Schema<IClient>(
  {
    name:             { type: String, required: true },
    businessName:     { type: String },
    businessType:     { type: String, required: true },
    phone:            { type: String, required: true },
    email:            { type: String },
    address:          { type: String, required: true },
    district:         { type: String, required: true },
    upazila:          { type: String, required: true },
    profileImage:     { type: String },
    status:           { type: String, enum: ['সক্রিয়', 'নিষ্ক্রিয়', 'অপেক্ষমান'], default: 'অপেক্ষমান' },
    credentials:      { type: CredentialsSchema, default: {} },
    notes:            { type: String },
    representativeId: { type: Schema.Types.ObjectId, ref: 'Representative' },
  },
  { timestamps: true }
)

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema)
