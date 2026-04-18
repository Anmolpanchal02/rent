import mongoose from 'mongoose'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anmolpanchal0207_db_user:2BnBz9gIkYjfq1tS@cluster0.uyna5gr.mongodb.net/rent?retryWrites=true&w=majority&appName=Cluster0'

async function clearDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get database
    const db = mongoose.connection.db
    
    if (!db) {
      throw new Error('Database connection not established')
    }

    // Get all collections
    const collections = await db.listCollections().toArray()
    
    console.log(`\n🗑️  Found ${collections.length} collections`)
    
    // Delete all documents from each collection
    for (const collection of collections) {
      const collectionName = collection.name
      console.log(`   Clearing ${collectionName}...`)
      await db.collection(collectionName).deleteMany({})
    }

    console.log('\n✅ All data cleared successfully!')
    console.log('📝 Database is now empty and ready for fresh data')

  } catch (error) {
    console.error('❌ Error clearing database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n👋 Disconnected from MongoDB')
    process.exit(0)
  }
}

clearDatabase()
