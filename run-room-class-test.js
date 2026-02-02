#!/usr/bin/env node

/**
 * Simple Test Runner for Room Class Creation
 * 
 * This script runs the room class creation test and provides clear output.
 */

const { testRoomClassCreation } = require('./test-room-class-creation');

console.log('🏨 Hotel DCrescent - Room Class Creation Test');
console.log('============================================\n');

console.log('📝 Test Requirements:');
console.log('   • Node.js with axios installed');
console.log('   • Hotel management system running on http://localhost:3000');
console.log('   • Admin account with valid credentials');
console.log('   • MongoDB database connection\n');

console.log('🔧 Configuration:');
console.log('   • Edit test-room-class-creation.js to update:');
console.log('     - BASE_URL (if not localhost:3000)');
console.log('     - ADMIN_EMAIL (your admin email)');
console.log('     - ADMIN_PASSWORD (your admin password)\n');

console.log('🚀 Running Test...\n');

// Run the test
testRoomClassCreation().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});