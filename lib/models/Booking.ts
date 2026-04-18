import mongoose, { Schema, Document } from 'mongoose'
import { BookingStatus } from '@/types'

export interface IBooking extends Document {
  propertyId: mongoose.Types.ObjectId
  tenantId: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId
  status: BookingStatus
  startDate: Date
  endDate: Date
  totalAmount: number
  paymentId?: string
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'paid'],
      default: 'pending',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value > this.startDate
        },
        message: 'End date must be after start date',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be positive'],
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)
