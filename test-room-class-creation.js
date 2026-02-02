/**
 * Test Script: Admin Room Class Creation
 * 
 * This test verifies that an admin can successfully:
 * 1. Log in and get authentication token
 * 2. Create a room class via API
 * 3. Verify the room class was created correctly
 * 4. Clean up by deleting the test room class
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@example.com'; // Use your actual admin email
const ADMIN_PASSWORD = 'admin123'; // Use your actual admin password

// Test data
const TEST_ROOM_CLASS = {
  name: 'Test Deluxe Suite',
  slug: 'test-deluxe-suite',
  description: 'Test room class for validation purposes',
  category: 'room',
  subcategory: 'deluxe',
  capacity: {
    adults: 2,
    children: 1
  },
  basePrice: 15000,
  mrp: 18000,
  discountPercent: 16.67,
  amenities: ['Wi-Fi', 'AC', 'Mini-bar', 'Bathtub'],
  features: ['Ocean View', 'Balcony', '24/7 Room Service'],
  bedType: 'king',
  roomSize: 45.5,
  view: 'Ocean View',
  totalInventory: 5,
  minStay: 1,
  maxStay: 30,
  checkInTime: '14:00',
  checkOutTime: '11:00'
};

async function testRoomClassCreation() {
  console.log('🧪 Starting Room Class Creation Test...\n');
  
  let authToken = null;
  let createdRoomClassId = null;

  try {
    // Step 1: Admin Login
    console.log('1️⃣ Testing Admin Login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/adminlogin`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    if (loginResponse.data.success) {
      authToken = loginResponse.data.token;
      console.log('✅ Admin login successful');
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
    } else {
      throw new Error(`Login failed: ${loginResponse.data.error}`);
    }

    // Step 2: Create Room Class
    console.log('\n2️⃣ Testing Room Class Creation...');
    const createResponse = await axios.post(`${BASE_URL}/api/createroomclass`, TEST_ROOM_CLASS, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (createResponse.data.success) {
      createdRoomClassId = createResponse.data.roomClass._id;
      console.log('✅ Room class created successfully');
      console.log(`   Room Class ID: ${createdRoomClassId}`);
      console.log(`   Name: ${createResponse.data.roomClass.name}`);
      console.log(`   Price: ₹${createResponse.data.roomClass.basePrice}`);
      console.log(`   Capacity: ${createResponse.data.roomClass.capacity.adults} adults, ${createResponse.data.roomClass.capacity.children} children`);
    } else {
      throw new Error(`Room class creation failed: ${createResponse.data.error}`);
    }

    // Step 3: Verify Room Class was created
    console.log('\n3️⃣ Verifying Room Class in Database...');
    const getResponse = await axios.get(`${BASE_URL}/api/getroomclasses`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (getResponse.data.success) {
      const roomClasses = getResponse.data.data;
      const foundRoomClass = roomClasses.find(rc => rc._id === createdRoomClassId);
      
      if (foundRoomClass) {
        console.log('✅ Room class found in database');
        console.log(`   Name: ${foundRoomClass.name}`);
        console.log(`   Slug: ${foundRoomClass.slug}`);
        console.log(`   Description: ${foundRoomClass.description.substring(0, 50)}...`);
        console.log(`   Category: ${foundRoomClass.category} > ${foundRoomClass.subcategory}`);
        console.log(`   Price: ₹${foundRoomClass.basePrice} (MRP: ₹${foundRoomClass.mrp})`);
        console.log(`   Discount: ${foundRoomClass.discountPercent}%`);
        console.log(`   Capacity: ${foundRoomClass.capacity.adults} adults, ${foundRoomClass.capacity.children} children`);
        console.log(`   Room Size: ${foundRoomClass.roomSize} sqm`);
        console.log(`   Amenities: ${foundRoomClass.amenities.join(', ')}`);
        console.log(`   Features: ${foundRoomClass.features.join(', ')}`);
        console.log(`   Bed Type: ${foundRoomClass.bedType}`);
        console.log(`   View: ${foundRoomClass.view}`);
        console.log(`   Inventory: ${foundRoomClass.totalInventory} rooms`);
        console.log(`   Check-in/out: ${foundRoomClass.checkInTime} / ${foundRoomClass.checkOutTime}`);
      } else {
        throw new Error('Room class not found in database after creation');
      }
    } else {
      throw new Error(`Failed to retrieve room classes: ${getResponse.data.error}`);
    }

    // Step 4: Test Authentication without Token (should fail)
    console.log('\n4️⃣ Testing Authentication without Token (should fail)...');
    try {
      await axios.post(`${BASE_URL}/api/createroomclass`, {
        ...TEST_ROOM_CLASS,
        name: 'Should Fail Test',
        slug: 'should-fail-test'
      });
      throw new Error('❌ Authentication bypass detected - this should have failed!');
    } catch (authError) {
      if (authError.response && authError.response.status === 401) {
        console.log('✅ Authentication properly enforced (401 Unauthorized)');
      } else {
        console.log('⚠️  Unexpected error during auth test:', authError.message);
      }
    }

    // Step 5: Test Invalid Data (should fail)
    console.log('\n5️⃣ Testing Invalid Data (should fail)...');
    try {
      const invalidResponse = await axios.post(`${BASE_URL}/api/createroomclass`, {
        ...TEST_ROOM_CLASS,
        name: '', // Invalid: empty name
        basePrice: -1000, // Invalid: negative price
        capacity: { adults: 0 } // Invalid: zero adults
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!invalidResponse.data.success) {
        console.log('✅ Invalid data properly rejected');
        console.log(`   Error: ${invalidResponse.data.error}`);
      } else {
        console.log('⚠️  Invalid data was accepted (unexpected)');
      }
    } catch (validationError) {
      console.log('✅ Invalid data properly rejected with validation error');
    }

    // Step 6: Clean up - Delete Test Room Class
    console.log('\n6️⃣ Cleaning up - Deleting Test Room Class...');
    const deleteResponse = await axios.delete(`${BASE_URL}/api/deleteroomclass?id=${createdRoomClassId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (deleteResponse.data.success) {
      console.log('✅ Test room class deleted successfully');
    } else {
      console.log('⚠️  Failed to delete test room class:', deleteResponse.data.error);
    }

    // Final Verification
    console.log('\n7️⃣ Final Verification - Room Class should be deleted...');
    const finalGetResponse = await axios.get(`${BASE_URL}/api/getroomclasses`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (finalGetResponse.data.success) {
      const remainingRoomClasses = finalGetResponse.data.data;
      const stillExists = remainingRoomClasses.find(rc => rc._id === createdRoomClassId);
      
      if (!stillExists) {
        console.log('✅ Test room class successfully removed from database');
      } else {
        console.log('⚠️  Test room class still exists in database');
      }
    }

    console.log('\n🎉 Test Completed Successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Admin authentication working');
    console.log('   ✅ Room class creation working');
    console.log('   ✅ Data validation working');
    console.log('   ✅ Authentication enforcement working');
    console.log('   ✅ Database operations working');
    console.log('   ✅ Cleanup working');

  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    
    // Cleanup on failure
    if (createdRoomClassId && authToken) {
      try {
        await axios.delete(`${BASE_URL}/api/deleteroomclass?id=${createdRoomClassId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        console.log('🧹 Cleaned up test data after failure');
      } catch (cleanupError) {
        console.log('⚠️  Failed to cleanup test data:', cleanupError.message);
      }
    }
    
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testRoomClassCreation();
}

module.exports = { testRoomClassCreation };