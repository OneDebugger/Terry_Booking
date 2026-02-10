/**
 * Test script to verify the available rooms functionality
 * This script tests the new API endpoint and available rooms page
 */

const testAvailableRooms = async () => {
  console.log('🧪 Testing Available Rooms Functionality...\n');

  // Test 1: Check if the API endpoint exists
  console.log('1. Testing API endpoint...');
  try {
    const response = await fetch('http://localhost:3001/api/getavailablerooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkin: '2024-03-01',
        checkout: '2024-03-05',
        adults: 2,
        child: 1,
        room: 1
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API endpoint is working');
      console.log('   Response:', data.success ? 'Success' : 'Error');
      if (data.availableRooms) {
        console.log(`   Available room classes: ${data.availableRooms.length}`);
      }
    } else {
      console.log('❌ API endpoint returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ API endpoint test failed:', error.message);
  }

  // Test 2: Check if the available rooms page exists
  console.log('\n2. Testing Available Rooms page...');
  try {
    const response = await fetch('http://localhost:3001/availablerooms');
    if (response.ok) {
      console.log('✅ Available Rooms page is accessible');
    } else {
      console.log('❌ Available Rooms page returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Available Rooms page test failed:', error.message);
  }

  // Test 3: Check if booking page redirects properly
  console.log('\n3. Testing Booking page...');
  try {
    const response = await fetch('http://localhost:3001/booking');
    if (response.ok) {
      console.log('✅ Booking page is accessible');
    } else {
      console.log('❌ Booking page returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Booking page test failed:', error.message);
  }

  console.log('\n🎉 Test completed! Check the results above.');
  console.log('\n📝 To manually test:');
  console.log('   1. Visit http://localhost:3001/booking');
  console.log('   2. Fill in booking details and click "Check Availability"');
  console.log('   3. You should be redirected to http://localhost:3001/availablerooms');
  console.log('   4. Select rooms and proceed to checkout');
};

// Run the test
testAvailableRooms().catch(console.error);