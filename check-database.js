/**
 * Database Inspection Script
 * 
 * This script connects to your MongoDB database and shows the contents
 * of the roomclasses collection directly.
 */

const mongoose = require('mongoose');

// Configuration - uses your existing .env.local settings
require('dotenv').config();

async function checkDatabase() {
  console.log('🗄️  Database Inspection Tool');
  console.log('============================\n');
  
  try {
    // Connect to MongoDB using your existing connection string
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully!\n');
    
    // Access the roomclasses collection directly
    const db = mongoose.connection.db;
    const roomClassesCollection = db.collection('roomclasses');
    
    // Check if collection exists and get count
    const count = await roomClassesCollection.countDocuments();
    console.log(`📊 Room Classes Collection: ${count} documents found\n`);
    
    if (count === 0) {
      console.log('📭 No room classes found in database.');
      console.log('📝 Room classes will be stored here once created via admin interface.\n');
    } else {
      console.log('📋 Room Classes Found:');
      console.log('=====================\n');
      
      // Get all room classes with formatted output
      const roomClasses = await roomClassesCollection.find().toArray();
      
      roomClasses.forEach((roomClass, index) => {
        console.log(`🏨 Room Class #${index + 1}`);
        console.log(`   ID: ${roomClass._id}`);
        console.log(`   Name: ${roomClass.name}`);
        console.log(`   Slug: ${roomClass.slug}`);
        console.log(`   Description: ${roomClass.description.substring(0, 60)}...`);
        console.log(`   Category: ${roomClass.category} > ${roomClass.subcategory}`);
        console.log(`   Price: ₹${roomClass.basePrice} (MRP: ₹${roomClass.mrp})`);
        console.log(`   Discount: ${roomClass.discountPercent}%`);
        console.log(`   Capacity: ${roomClass.capacity.adults} adults, ${roomClass.capacity.children} children`);
        console.log(`   Room Size: ${roomClass.roomSize} sqm`);
        console.log(`   Bed Type: ${roomClass.bedType}`);
        console.log(`   View: ${roomClass.view}`);
        console.log(`   Amenities: ${roomClass.amenities.join(', ')}`);
        console.log(`   Features: ${roomClass.features.join(', ')}`);
        console.log(`   Inventory: ${roomClass.totalInventory} rooms`);
        console.log(`   Check-in/out: ${roomClass.checkInTime} / ${roomClass.checkOutTime}`);
        console.log(`   Status: ${roomClass.isActive ? 'Active' : 'Inactive'}`);
        console.log(`   Created: ${new Date(roomClass.createdAt).toLocaleString()}`);
        console.log(`   Updated: ${new Date(roomClass.updatedAt).toLocaleString()}`);
        console.log('');
      });
    }
    
    // Also check room instances collection
    const roomInstancesCollection = db.collection('roominstances');
    const instancesCount = await roomInstancesCollection.countDocuments();
    console.log(`📊 Room Instances Collection: ${instancesCount} documents found\n`);
    
    if (instancesCount > 0) {
      console.log('🏠 Room Instances Found:');
      console.log('=======================\n');
      
      const roomInstances = await roomInstancesCollection.find().limit(5).toArray();
      
      roomInstances.forEach((instance, index) => {
        console.log(`🚪 Room Instance #${index + 1}`);
        console.log(`   ID: ${instance._id}`);
        console.log(`   Room Number: ${instance.roomNumber}`);
        console.log(`   Room Class ID: ${instance.roomClass}`);
        console.log(`   Status: ${instance.status}`);
        console.log(`   Floor: ${instance.floor}`);
        console.log(`   Created: ${new Date(instance.createdAt).toLocaleString()}`);
        console.log('');
      });
    }
    
    // Show database info
    console.log('🔧 Database Information:');
    console.log('=======================');
    console.log(`   Database Name: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port}`);
    console.log(`   Collections: ${await db.listCollections().toArray().then(collections => collections.map(c => c.name).join(', '))}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Check your MONGO_URI in .env.local');
    console.log('   3. Verify the database name is correct');
    console.log('   4. Ensure you have proper permissions');
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  checkDatabase();
}

module.exports = { checkDatabase };