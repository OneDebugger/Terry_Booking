/**
 * Test Script to Check Room Classes in Database
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function checkRoomClasses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const RoomClass = mongoose.model('RoomClass', require('./models/RoomClass'));
    
    // Get all room classes
    const roomClasses = await RoomClass.find().lean();
    
    console.log(`📊 Found ${roomClasses.length} room classes in database:`);
    
    if (roomClasses.length === 0) {
      console.log('❌ No room classes found in database');
      console.log('💡 Try creating a room class first through the admin interface');
    } else {
      roomClasses.forEach((roomClass, index) => {
        console.log(`${index + 1}. ${roomClass.name} (${roomClass.slug})`);
        console.log(`   Price: ₹${roomClass.basePrice}`);
        console.log(`   Capacity: ${roomClass.capacity.adults} adults, ${roomClass.capacity.children} children`);
        console.log(`   Inventory: ${roomClass.totalInventory} rooms`);
        console.log(`   Status: ${roomClass.isActive ? 'Active' : 'Inactive'}`);
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
checkRoomClasses();