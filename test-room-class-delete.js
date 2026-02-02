/**
 * Test Script for Room Class Delete with Authentication
 */

const https = require('https');
const http = require('http');

function testRoomClassDeleteWithAuth() {
  console.log('🧪 Testing Room Class Delete (with Authentication)');
  console.log('====================================================\n');
  
  // Your Next.js host URL
  const NEXT_PUBLIC_HOST = 'http://localhost:3000';
  const roomClassId = '6980d4550d7619cc528b99b0'; // The ID from the created room class
  const apiUrl = `${NEXT_PUBLIC_HOST}/api/deleteroomclass?id=${roomClassId}`;
  
  console.log('📝 Test Data:');
  console.log('-------------');
  console.log(`Room Class ID: ${roomClassId}\n`);
  
  try {
    console.log('🚀 Sending delete request to API with admin authentication...');
    
    // Parse URL to determine protocol and host
    const url = new URL(apiUrl);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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
            console.log('\n✅ SUCCESS! Room class deleted successfully!');
            console.log(`📝 Room Class ID: ${roomClassId}`);
            console.log(`🏷️  Message: ${result.message}`);
            
            console.log('\n🎉 ROOM CLASS DELETE IS WORKING PERFECTLY!');
            console.log('💡 You can now use the admin form to delete room classes at /admin/roomclasses');
            
          } else {
            console.log('\n❌ FAILED! Room class delete failed.');
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
      console.log('   2. Check if the API endpoint exists at /api/deleteroomclass');
      console.log('   3. Verify your NEXT_PUBLIC_HOST environment variable');
      console.log('   4. Ensure your MongoDB connection is working');
      console.log('   5. Check if you are authenticated as an admin');
    });
    
    // Send the request
    req.end();
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure your Next.js development server is running');
    console.log('   2. Check if the API endpoint exists at /api/deleteroomclass');
    console.log('   3. Verify your NEXT_PUBLIC_HOST environment variable');
    console.log('   4. Ensure your MongoDB connection is working');
    console.log('   5. Check if you are authenticated as an admin');
  }
}

// Run the test
testRoomClassDeleteWithAuth();