/**
 * Room Classes Seeding Script using Next.js Database Connection
 * 
 * This script uses the same database connection as your Next.js application
 * to ensure compatibility and proper configuration.
 */

// Import the database connection from your existing setup
import mongoose from 'mongoose';

async function seedRoomClasses() {
  console.log('🌱 Seeding Room Classes Collection');
  console.log('==================================\n');
  
  try {
    // Use the same database connection as your Next.js app
    console.log('🔗 Connecting using MongoDB connection...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hotelmanagement');
    console.log('✅ Connected successfully!\n');
    
    // Import the RoomClass model
    const RoomClass = mongoose.model('RoomClass');
    
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
        isDeleted: false,
        createdBy: null,
        lastModifiedBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
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
        isDeleted: false,
        createdBy: null,
        lastModifiedBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
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
        bedType: 'family',
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
        isDeleted: false,
        createdBy: null,
        lastModifiedBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
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
    console.log('   1. Make sure your Next.js database connection is working');
    console.log('   2. Check if the RoomClass model exists and is properly defined');
    console.log('   3. Verify your MongoDB Atlas connection settings');
    console.log('   4. Check if your IP is whitelisted in MongoDB Atlas');
  }
}

// Run the script
seedRoomClasses();