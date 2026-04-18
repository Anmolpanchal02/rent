export type UserRole = 'tenant' | 'owner' | 'admin'

export interface User {
  _id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface Property {
  _id: string
  title: string
  description: string
  price: number
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  images: string[]
  amenities: string[]
  propertyType: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'paid'

export interface Booking {
  _id: string
  propertyId: string
  tenantId: string
  ownerId: string
  status: BookingStatus
  startDate: Date
  endDate: Date
  totalAmount: number
  paymentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  _id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: Date
}
