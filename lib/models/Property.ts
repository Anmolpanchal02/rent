import mongoose, { Schema, Document } from 'mongoose'

export interface IProperty extends Document {
  title: string
  description: string
  price: number
  type: string
  location: {
    address: string
    city: string
    state: string
    pincode: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  images: string[]
  amenities: string[]
  bedrooms: number
  bathrooms: number
  area: number
  status: string
  owner: mongoose.Types.ObjectId
  views: number
  bookings: number
  createdAt: Date
  updatedAt: Date
}

const PropertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['apartment', 'house', 'villa', 'studio', 'commercial'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms must be positive'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms must be positive'],
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [0, 'Area must be positive'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    bookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema)
