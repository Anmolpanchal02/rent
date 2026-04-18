import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anmolpanchal0207_db_user:2BnBz9gIkYjfq1tS@cluster0.uyna5gr.mongodb.net/rent?retryWrites=true&w=majority&appName=Cluster0'

// Define schemas inline
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  phone: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const PropertySchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  price: Number,
  address: String,
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  amenities: [String],
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'available' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const BookingSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: Date,
  endDate: Date,
  status: String,
  totalAmount: Number,
  paymentId: String,
  paymentStatus: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  content: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get or create models
    const User = mongoose.models.User || mongoose.model('User', UserSchema)
    const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema)
    const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema)
    const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema)

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await User.deleteMany({})
    await Property.deleteMany({})
    await Booking.deleteMany({})
    await Message.deleteMany({})
    console.log('✅ Data cleared')

    // Create users
    console.log('👥 Creating users...')
    const hashedPassword = await bcrypt.hash('password123', 10)

    const admin = await User.create({
      email: 'admin@smartrental.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      phone: '+91-9876543210'
    })

    const owner1 = await User.create({
      email: 'rajesh@example.com',
      password: hashedPassword,
      name: 'Rajesh Kumar',
      role: 'owner',
      phone: '+91-9876543211'
    })

    const owner2 = await User.create({
      email: 'priya@example.com',
      password: hashedPassword,
      name: 'Priya Sharma',
      role: 'owner',
      phone: '+91-9876543212'
    })

    const tenant1 = await User.create({
      email: 'amit@example.com',
      password: hashedPassword,
      name: 'Amit Patel',
      role: 'tenant',
      phone: '+91-9876543213'
    })

    const tenant2 = await User.create({
      email: 'neha@example.com',
      password: hashedPassword,
      name: 'Neha Mehta',
      role: 'tenant',
      phone: '+91-9876543214'
    })

    console.log('✅ Users created')

    // Create properties
    console.log('🏠 Creating properties...')
    const properties = await Property.insertMany([
      {
        title: 'Luxe 2BHK Near Metro',
        description: 'Beautiful 2BHK apartment near metro station with modern amenities',
        type: 'apartment',
        price: 14500,
        address: 'Koramangala, Bangalore',
        location: {
          address: 'Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560034'
        },
        bedrooms: 2,
        bathrooms: 2,
        area: 950,
        amenities: ['WiFi', 'Parking', 'AC', 'Gym'],
        owner: owner1._id,
        status: 'available'
      },
      {
        title: 'Independent 3BHK with Garden',
        description: 'Spacious independent house with beautiful garden',
        type: 'house',
        price: 22000,
        address: 'Jubilee Hills, Hyderabad',
        location: {
          address: 'Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          zipCode: '500033'
        },
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        amenities: ['Garden', 'Parking', 'WiFi', 'Security'],
        owner: owner1._id,
        status: 'available'
      },
      {
        title: 'AC Single Room, Furnished',
        description: 'Cozy furnished room with AC, perfect for students',
        type: 'room',
        price: 6500,
        address: 'Anna Nagar, Chennai',
        location: {
          address: 'Anna Nagar',
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
          zipCode: '600040'
        },
        bedrooms: 1,
        bathrooms: 1,
        area: 400,
        amenities: ['WiFi', 'AC', 'Furnished'],
        owner: owner2._id,
        status: 'available'
      },
      {
        title: 'Modern 2BHK Furnished',
        description: 'Fully furnished modern apartment in prime location',
        type: 'flat',
        price: 18000,
        address: 'Bandra West, Mumbai',
        location: {
          address: 'Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '400050'
        },
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        amenities: ['WiFi', 'Gym', 'Pool', 'Security'],
        owner: owner2._id,
        status: 'available'
      },
      {
        title: 'Spacious 3BHK with Balcony',
        description: 'Large apartment with balcony and city view',
        type: 'apartment',
        price: 25000,
        address: 'Whitefield, Bangalore',
        location: {
          address: 'Whitefield',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560066'
        },
        bedrooms: 3,
        bathrooms: 3,
        area: 1600,
        amenities: ['Balcony', 'Parking', 'Security', 'Gym'],
        owner: owner1._id,
        status: 'available'
      },
      {
        title: 'Villa with Private Pool',
        description: 'Luxury villa with private pool and garden',
        type: 'house',
        price: 45000,
        address: 'Gachibowli, Hyderabad',
        location: {
          address: 'Gachibowli',
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India',
          zipCode: '500032'
        },
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        amenities: ['Pool', 'Garden', 'Gym', 'Parking'],
        owner: owner2._id,
        status: 'available'
      }
    ])

    console.log('✅ Properties created')

    // Create some bookings
    console.log('📅 Creating bookings...')
    await Booking.insertMany([
      {
        property: properties[0]._id,
        tenant: tenant1._id,
        owner: owner1._id,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-01'),
        status: 'pending',
        totalAmount: 14500
      },
      {
        property: properties[2]._id,
        tenant: tenant2._id,
        owner: owner2._id,
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-03-15'),
        status: 'accepted',
        totalAmount: 6500
      }
    ])

    console.log('✅ Bookings created')

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📝 Test Credentials:')
    console.log('Admin: admin@smartrental.com / password123')
    console.log('Owner 1: rajesh@example.com / password123')
    console.log('Owner 2: priya@example.com / password123')
    console.log('Tenant 1: amit@example.com / password123')
    console.log('Tenant 2: neha@example.com / password123')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n👋 Disconnected from MongoDB')
    process.exit(0)
  }
}

seedDatabase()
