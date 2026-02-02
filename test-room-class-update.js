/**
 * Test Script for Room Class Update with Authentication
 */

const https = require('https');
const http = require('http');

// Test data for room class update
const testRoomClassUpdateData = {
  name: 'Updated Test Deluxe Suite',
  slug: 'test-deluxe-suite-auth',
  description: 'Updated test suite for form submission verification with authentication. This is a luxurious suite with premium amenities and excellent service.',
  category: 'room',
  subcategory: 'deluxe',
  capacity: {
    adults: 3,
    children: 1
  },
  basePrice: 17500,
  mrp: 20500,
  discountPercent: 14.63,
  amenities: ['Wi-Fi', 'Air Conditioning', 'Mini-bar', 'Bathtub', 'Balcony', 'Flat-screen TV', 'Coffee Maker', 'Room Service'],
  features: ['24/7 Room Service', 'Daily Housekeeping', 'Free Breakfast', 'Late Check-out', 'Gym Access'],
  bedType: 'king',
  roomSize: 45.5,
  view: 'Ocean View',
  totalInventory: 10,
  minStay: 1,
  maxStay: 30,
  checkInTime: '14:00',
  checkOutTime: '11:00',
  isActive: true
};

function testRoomClassUpdateWithAuth() {
  console.log('🧪 Testing Room Class Update (with Authentication)');
  console.log('====================================================\n');
  
  // Your Next.js host URL
  const NEXT_PUBLIC_HOST = 'http://localhost:3000';
  const roomClassId = '6980d4550d7619cc528b99b0'; // The ID from the created room class
  const apiUrl = `${NEXT_PUBLIC_HOST}/api/updateroomclass?id=${roomClassId}`;
  
  console.log('📝 Test Data:');
  console.log('-------------');
  console.log(`Name: ${testRoomClassUpdateData.name}`);
  console.log(`Price: ₹${testRoomClassUpdateData.basePrice} (MRP: ₹${testRoomClassUpdateData.mrp})`);
  console.log(`Capacity: ${testRoomClassUpdateData.capacity.adults} adults, ${testRoomClassUpdateData.capacity.children} children`);
  console.log(`Amenities: ${testRoomClassUpdateData.amenities.join(', ')}`);
  console.log(`Inventory: ${testRoomClassUpdateData.totalInventory} rooms\n`);
  
  try {
    console.log('🚀 Sending update data to API with admin authentication...');
    
    // Parse URL to determine protocol and host
    const url = new URL(apiUrl);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const data = JSON.stringify(testRoomClassUpdateData);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        // Simulate admin authentication with Bearer token
        'Authorization': 'Bearer test-admin-token'
      }
    };
    
    const req = client.request(options, (res) => {
      console.log(`📡 Response Status: ${res.statusCode} ${res.statusMessage}`);
      
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          
          console.log('\n📊 Response Data:');
          console.log('-----------------');
          console.log(JSON.stringify(result, null, 2));
          
          if (result.success) {
            console.log('\n✅ SUCCESS! Room class updated successfully!');
            console.log(`📝 Room Class Name: ${result.roomClass.name}`);
            console.log(`🏷️  Room Class Slug: ${result.roomClass.slug}`);
            console.log(`💰 Updated Price: ₹${result.roomClass.basePrice}`);
            console.log(`👥 Updated Capacity: ${result.roomClass.capacity.adults} adults, ${result.roomClass.capacity.children} children`);
            console.log(`🏨 Updated Inventory: ${result.roomClass.totalInventory} rooms`);
            
            // Verify the data was updated correctly
            console.log('\n🔍 Verification:');
            console.log('----------------');
            console.log(`✓ Name: ${result.roomClass.name === testRoomClassUpdateData.name ? '✅' : '❌'}`);
            console.log(`✓ Price: ${result.roomClass.basePrice === testRoomClassUpdateData.basePrice ? '✅' : '❌'}`);
            console.log(`✓ Capacity: ${JSON.stringify(result.roomClass.capacity) === JSON.stringify(testRoomClassUpdateData.capacity) ? '✅' : '❌'}`);
            console.log(`✓ Amenities: ${JSON.stringify(result.roomClass.amenities) === JSON.stringify(testRoomClassUpdateData.amenities) ? '✅' : '❌'}`);
            console.log(`✓ Inventory: ${result.roomClass.totalInventory === testRoomClassUpdateData.totalInventory ? '✅' : '❌'}`);
            
            console.log('\n🎉 ROOM CLASS UPDATE IS WORKING PERFECTLY!');
            console.log('💡 You can now use the admin form to edit room classes at /admin/roomclasses');
            
          } else {
            console.log('\n❌ FAILED! Room class update failed.');
            console.log(`Error: ${result.error}`);
          }
          
        } catch (parseError) {
          console.error('\n❌ Failed to parse response JSON:', parseError.message);
          console.log('\nRaw response:', responseData);
        }
      });
      
    });
    
    req.on('error', (error) => {
      console.error('\n❌ NETWORK ERROR:', error.message);
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Make sure your Next.js development server is running');
      console.log('   2. Check if the API endpoint exists at /api/updateroomclass');
      console.log('   3. Verify your NEXT_PUBLIC_HOST environment variable');
      console.log('   4. Ensure your MongoDB connection is working');
      console.log('   5. Check if you are authenticated as an admin');
    });
    
    // Send the request
    req.write(data);
    req.end();
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure your Next.js development server is running');
    console.log('   2. Check if the API endpoint exists at /api/updateroomclass');
    console.log('   3. Verify your NEXT_PUBLIC_HOST environment variable');
    console.log('   4. Ensure your MongoDB connection is working');
    console.log('   5. Check if you are authenticated as an admin');
  }
}

// Run the test
testRoomClassUpdateWithAuth();