/**
 * Test Script for Room Class Form Submission
 * 
 * This script simulates the room class form submission to test the API endpoint
 * and verify that the form is working correctly.
 */

// Use built-in fetch (Node.js 18+) or require node-fetch if needed
let fetch;
try {
  // Try to use built-in fetch first (Node.js 18+)
  fetch = global.fetch;
  if (!fetch) throw new Error('Built-in fetch not available');
} catch (error) {
  // Fall back to node-fetch if built-in fetch is not available
  fetch = require('node-fetch');
}

// Test data for room class creation
const testRoomClassData = {
  name: 'Test Deluxe Suite',
  slug: 'test-deluxe-suite',
  description: 'Test suite for form submission verification. This is a luxurious suite with premium amenities and excellent service.',
  category: 'room',
  subcategory: 'deluxe',
  capacity: {
    adults: 2,
    children: 1
  },
  basePrice: 16000,
  mrp: 19000,
  discountPercent: 15.79,
  amenities: ['Wi-Fi', 'Air Conditioning', 'Mini-bar', 'Bathtub', 'Balcony', 'Flat-screen TV'],
  features: ['24/7 Room Service', 'Daily Housekeeping', 'Free Breakfast'],
  bedType: 'king',
  roomSize: 42.5,
  view: 'City View',
  totalInventory: 10,
  minStay: 1,
  maxStay: 30,
  checkInTime: '14:00',
  checkOutTime: '11:00'
};

async function testRoomClassFormSubmission() {
  console.log('🧪 Testing Room Class Form Submission');
  console.log('=====================================\n');
  
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
    console.log('🚀 Sending form data to API...');
    
    // Simulate the exact request that the frontend form sends
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRoomClassData)
    });
    
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    const result = await response.json();
    
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
        console.log('   - You need to be logged in as an admin to create room classes');
        console.log('   - Make sure you are authenticated before testing');
      } else if (result.error.includes('Method not allowed')) {
        console.log('\n💡 Troubleshooting:');
        console.log('   - The API endpoint only accepts POST requests');
        console.log('   - Make sure you are using the correct HTTP method');
      }
    }
    
  } catch (error) {
    console.error('\n❌ NETWORK ERROR:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure your Next.js development server is running');
    console.log('   2. Check if the API endpoint exists at /api/createroomclass');
    console.log('   3. Verify your NEXT_PUBLIC_HOST environment variable');
    console.log('   4. Ensure your MongoDB connection is working');
    console.log('   5. Check if you are authenticated as an admin');
  }
}

// Run the test
testRoomClassFormSubmission();