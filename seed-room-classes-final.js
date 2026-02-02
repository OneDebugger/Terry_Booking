/**
 * Final Room Classes Seeding Script
 * 
 * This script uses your MongoDB Atlas connection string directly
 * to insert test data into the roomclasses collection.
 */

import mongoose from 'mongoose';

async function seedRoomClasses() {
  console.log('🌱 Seeding Room Classes Collection');
  console.log('==================================\n');
  
  // Your MongoDB Atlas connection string
  const MONGO_URI = 'mongodb+srv://oneAdmin:1234@cluster0.et8aqdt.mongodb.net/hotelmanagement?retryWrites=true&w=majority';
  
  try {
    // Connect to MongoDB Atlas
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected successfully!\n');
    
    // Define the RoomClass schema (same as your model)
    const roomClassSchema = new mongoose.Schema({
      name: { type: String, required: true, unique: true },
      slug: { type: String, required: true, unique: true },
      description: { type: String, required: true },
      category: { type: String, required: true, enum: ['room'] },
      subcategory: { type: String, required: true, enum: ['deluxe', 'executive', 'family', 'other'] },
      
      // Room specifications
      capacity: {
        adults: { type: Number, required: true, min: 1 },
        children: { type: Number, default: 0 }
      },
      
      // Pricing
      basePrice: { type: Number, required: true, min: 0 },
      mrp: { type: Number, required: true, min: 0 },
      discountPercent: { type: Number, default: 0, min: 0, max: 100 },
      
      // Amenities and features
      amenities: [{
        type: String
      }],
      features: [{
        type: String
      }],
      
      // Room specifications
      bedType: { type: String, enum: ['single', 'double', 'king', 'queen', 'twin'] },
      roomSize: { type: Number, min: 0 }, // Room size in square meters
      view: { type: String }, // e.g., "ocean view", "city view", "garden view"
      
      // Images
      images: [{
        url: { type: String, required: true },
        alt: { type: String }
      }],
      
      // Inventory management
      totalInventory: { type: Number, required: true, min: 1 },
      activeRooms: { type: Number, default: 0 }, // Number of physical rooms created
      
      // Booking rules
      minStay: { type: Number, default: 1 }, // Minimum nights required
      maxStay: { type: Number, default: 30 }, // Maximum nights allowed
      checkInTime: { type: String, default: "14:00" }, // HH:mm format
      checkOutTime: { type: String, default: "11:00" }, // HH:mm format
      
      // Status
      isActive: { type: Boolean, default: true },
      isDeleted: { type: Boolean, default: false },
      
      // Metadata
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }, { timestamps: true });
    
    // Create the model
    const RoomClass = mongoose.model('RoomClass', roomClassSchema);
    
    // Test room class data
    const testRoomClasses = [
      {
        name: 'Deluxe King Suite',
        slug: 'deluxe-king-suite',
        description: 'Luxurious suite featuring a king-size bed, panoramic ocean views, and premium amenities including Wi-Fi, air conditioning, mini-bar, and private balcony.',
        category: 'room',
        subcategory: 'deluxe',
        capacity: {
          adults: 2,
          children: 1
        },
        basePrice: 15000,
        mrp: 18000,
        discountPercent: 16.67,
        amenities: ['Wi-Fi', 'Air Conditioning', 'Mini-bar', 'Bathtub', 'Balcony', 'Flat-screen TV', 'Coffee Maker'],
        features: ['24/7 Room Service', 'Daily Housekeeping', 'Free Breakfast', 'Late Check-out (subject to availability)'],
        bedType: 'king',
        roomSize: 45.5,
        view: 'Ocean View',
        images: [
          {
            url: 'https://example.com/images/deluxe-king-suite-1.jpg',
            alt: 'Deluxe King Suite - Living Area'
          },
          {
            url: 'https://example.com/images/deluxe-king-suite-2.jpg',
            alt: 'Deluxe King Suite - Bedroom'
          }
        ],
        totalInventory: 20,
        activeRooms: 15,
        minStay: 1,
        maxStay: 30,
        checkInTime: '14:00',
        checkOutTime: '11:00',
        isActive: true,
        isDeleted: false
      },
      {
        name: 'Executive Double Room',
        slug: 'executive-double-room',
        description: 'Spacious double room with twin beds, city view, and business-friendly amenities including work desk, high-speed internet, and comfortable seating area.',
        category: 'room',
        subcategory: 'executive',
        capacity: {
          adults: 2,
          children: 0
        },
        basePrice: 12000,
        mrp: 15000,
        discountPercent: 20,
        amenities: ['Wi-Fi', 'Air Conditioning', 'Work Desk', 'LED TV', 'Tea/Coffee Maker', 'Safe Deposit Box'],
        features: ['Business Center Access', 'Daily Newspaper', 'Express Check-in/Check-out'],
        bedType: 'twin',
        roomSize: 35.2,
        view: 'City View',
        images: [
          {
            url: 'https://example.com/images/executive-double-1.jpg',
            alt: 'Executive Double Room - Work Area'
          }
        ],
        totalInventory: 15,
        activeRooms: 12,
        minStay: 1,
        maxStay: 45,
        checkInTime: '14:00',
        checkOutTime: '11:00',
        isActive: true,
        isDeleted: false
      },
      {
        name: 'Family Suite',
        slug: 'family-suite',
        description: 'Ideal for families with connecting rooms, featuring one king bed and two twin beds, plus extra space for children to play and relax.',
        category: 'room',
        subcategory: 'family',
        capacity: {
          adults: 4,
          children: 3
        },
        basePrice: 18000,
        mrp: 22000,
        discountPercent: 18.18,
        amenities: ['Wi-Fi', 'Air Conditioning', 'Multiple TVs', 'Game Console', 'Mini Fridge', 'Crib Available'],
        features: ['Family Welcome Kit', 'Childrens Menu', 'Baby Sitting Services', 'Family Activities'],
        bedType: 'king',
        roomSize: 65.8,
        view: 'Garden View',
        images: [
          {
            url: 'https://example.com/images/family-suite-1.jpg',
            alt: 'Family Suite - Living Area'
          },
          {
            url: 'https://example.com/images/family-suite-2.jpg',
            alt: 'Family Suite - Bedroom'
          }
        ],
        totalInventory: 8,
        activeRooms: 6,
        minStay: 2,
        maxStay: 21,
        checkInTime: '14:00',
        checkOutTime: '11:00',
        isActive: true,
        isDeleted: false
      }
    ];
    
    console.log('📝 Inserting test room classes...');
    
    // Insert the test data using the Mongoose model
    const result = await RoomClass.insertMany(testRoomClasses);
    
    console.log(`✅ Successfully inserted ${result.length} room classes`);
    console.log('📋 Room Class IDs created:');
    result.forEach((roomClass, index) => {
      console.log(`   ${index + 1}. ${roomClass._id}`);
    });
    
    // Verify the data was inserted
    console.log('\n🔍 Verifying insertion...');
    const count = await RoomClass.countDocuments();
    console.log(`📊 Total room classes in collection: ${count}`);
    
    // Show one example
    const sampleRoomClass = await RoomClass.findOne();
    console.log('\n🏨 Sample Room Class:');
    console.log(`   Name: ${sampleRoomClass.name}`);
    console.log(`   Slug: ${sampleRoomClass.slug}`);
    console.log(`   Price: ₹${sampleRoomClass.basePrice} (MRP: ₹${sampleRoomClass.mrp})`);
    console.log(`   Capacity: ${sampleRoomClass.capacity.adults} adults, ${sampleRoomClass.capacity.children} children`);
    console.log(`   Room Size: ${sampleRoomClass.roomSize} sqm`);
    console.log(`   Amenities: ${sampleRoomClass.amenities.join(', ')}`);
    console.log(`   Inventory: ${sampleRoomClass.totalInventory} rooms`);
    
    console.log('\n🎉 Room classes successfully added to database!');
    console.log('💡 You can now run "node check-database.js" to see the data');
    
  } catch (error) {
    console.error('❌ Failed to seed room classes:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure MongoDB Atlas is accessible from your network');
    console.log('   2. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('   3. Verify your MongoDB Atlas credentials are correct');
    console.log('   4. Ensure the hotelmanagement database exists');
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
seedRoomClasses();