/**
 * Test Script for Room Class Form Submission with Authentication
 * 
 * This script tests the room class form submission with admin authentication
 * to verify that the form works when properly authenticated.
 */

const https = require('https');
const http = require('http');

// Test data for room class creation
const testRoomClassData = {
  name: 'Test Deluxe Suite',
  slug: 'test-deluxe-suite-auth',
  description: 'Test suite for form submission verification with authentication. This is a luxurious suite with premium amenities and excellent service.',
  category: 'room',
  subcategory: 'deluxe',
  capacity: {
    adults: 2,
    children: 1
  },
  basePrice: 16500,
  mrp: 19500,
  discountPercent: 15.38,
  amenities: ['Wi-Fi', 'Air Conditioning', 'Mini-bar', 'Bathtub', 'Balcony', 'Flat-screen TV', 'Coffee Maker'],
  features: ['24/7 Room Service', 'Daily Housekeeping', 'Free Breakfast', 'Late Check-out'],
  bedType: 'king',
  roomSize: 43.2,
  view: 'Ocean View',
  totalInventory: 8,
  minStay: 1,
  maxStay: 30,
  checkInTime: '14:00',
  checkOutTime: '11:00'
};

function testRoomClassFormSubmissionWithAuth() {
  console.log('🧪 Testing Room Class Form Submission (with Authentication)');
  console.log('============================================================\n');
  
  // Your Next.js host URL
  const NEXT_PUBLIC_HOST = 'http://localhost:3000';
  const apiUrl = `${NEXT_PUBLIC_HOST}/api/createroomclass`;
  
  console.log('📝 Test Data:');
  console.log('-------------');
  console.log(`Name: ${testRoomClassData.name}`);
  console.log(`Slug: ${testRoomClassData.slug}`);
  console.log(`Price: ₹${testRoomClassData.basePrice} (MRP: ₹${testRoomClassData.mrp})`);
  console.log(`Capacity: ${testRoomClassData.capacity.adults} adults, ${testRoomClassData.capacity.children} children`);
  console.log(`Amenities: ${testRoomClassData.amenities.join(', ')}`);
  console.log(`Inventory: ${testRoomClassData.totalInventory} rooms\n`);
  
  try {
    console.log('🚀 Sending form data to API with admin authentication...');
    
    // Parse URL to determine protocol and host
    const url = new URL(apiUrl);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const data = JSON.stringify(testRoomClassData);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        // Simulate admin authentication with Bearer token
        // This simulates what happens when you're logged in as an admin
        'Authorization': 'Bearer test-admin-token'  // This is what the auth middleware checks for
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
            console.log('\n✅ SUCCESS! Room class created successfully!');
            console.log(`🆔 Room Class ID: ${result.roomClass._id}`);
            console.log(`📝 Room Class Name: ${result.roomClass.name}`);
            console.log(`🏷️  Room Class Slug: ${result.roomClass.slug}`);
            
            // Verify the data was saved correctly
            console.log('\n🔍 Verification:');
            console.log('----------------');
            console.log(`✓ Name: ${result.roomClass.name === testRoomClassData.name ? '✅' : '❌'}`);
            console.log(`✓ Slug: ${result.roomClass.slug === testRoomClassData.slug ? '✅' : '❌'}`);
            console.log(`✓ Price: ${result.roomClass.basePrice === testRoomClassData.basePrice ? '✅' : '❌'}`);
            console.log(`✓ Capacity: ${JSON.stringify(result.roomClass.capacity) === JSON.stringify(testRoomClassData.capacity) ? '✅' : '❌'}`);
            console.log(`✓ Amenities: ${JSON.stringify(result.roomClass.amenities) === JSON.stringify(testRoomClassData.amenities) ? '✅' : '❌'}`);
            console.log(`✓ Inventory: ${result.roomClass.totalInventory === testRoomClassData.totalInventory ? '✅' : '❌'}`);
            
            console.log('\n🎉 FORM SUBMISSION IS WORKING PERFECTLY!');
            console.log('💡 You can now use the admin form at /admin/roomclasses');
            
          } else {
            console.log('\n❌ FAILED! Room class creation failed.');
            console.log(`Error: ${result.error}`);
            
            // Check for common issues
            if (result.error.includes('Missing required fields')) {
              console.log('\n💡 Troubleshooting:');
              console.log('   - Check if all required fields are provided');
              console.log('   - Verify the form data structure matches the API expectations');
            } else if (result.error.includes('Room class with this slug already exists')) {
              console.log('\n💡 Troubleshooting:');
              console.log('   - The slug already exists in the database');
              console.log('   - Try changing the slug to something unique');
            } else if (result.error.includes('Invalid pricing values')) {
              console.log('\n💡 Troubleshooting:');
              console.log('   - Check that basePrice, mrp, and discountPercent are valid numbers');
              console.log('   - Ensure discountPercent is between 0 and 100');
            } else if (result.error.includes('Unauthorized')) {
              console.log('\n💡 Troubleshooting:');
              console.log('   - Make sure you are logged in as an admin');
              console.log('   - Check if your admin session is still active');
              console.log('   - Try logging in again at /admin/adminlogin');
            } else if (result.error.includes('Method not allowed')) {
              console.log('\n💡 Troubleshooting:');
              console.log('   - The API endpoint only accepts POST requests');
              console.log('   - Make sure you are using the correct HTTP method');
            }
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
      console.log('   2. Check if the API endpoint exists at /api/createroomclass');
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
    console.log('   2. Check if the API endpoint exists at /api/createroomclass');
    console.log('   3. Verify your NEXT_PUBLIC_HOST environment variable');
    console.log('   4. Ensure your MongoDB connection is working');
    console.log('   5. Check if you are authenticated as an admin');
  }
}

// Run the test
testRoomClassFormSubmissionWithAuth();