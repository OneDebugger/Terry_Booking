#!/usr/bin/env node

/**
 * Comprehensive Test Script for Admin Signup Functionality
 * Tests all admin signup scenarios with detailed logging
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';

console.log('🚀 Admin Signup Test Script');
console.log('==========================');
console.log(`Testing against: ${BASE_URL}`);
console.log('');

// Test 1: Successful Admin Signup
async function testSuccessfulSignup() {
  console.log('📝 Test 1: Successful Admin Signup');
  console.log('----------------------------------');
  
  const testAdmin = {
    name: 'Test Admin User',
    email: 'test.admin@example.com',
    password: 'securepassword123',
    npassword: 'securepassword123'
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/adminsignup`, testAdmin);
    
    console.log('✅ Admin Signup Response:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.success) {
      console.log('✅ Signup successful!');
      console.log('Message:', response.data.message);
      console.log('User Data:', JSON.stringify(response.data.user, null, 2));
      return true;
    } else {
      console.log('❌ Signup failed!');
      console.log('Error:', response.data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Admin Signup Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
    return false;
  }
}

// Test 2: Signup with Missing Fields
async function testMissingFields() {
  console.log('');
  console.log('📝 Test 2: Signup with Missing Fields');
  console.log('-------------------------------------');
  
  const testAdmin = {
    name: 'Incomplete User',
    email: 'incomplete@example.com',
    // Missing password and npassword
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/adminsignup`, testAdmin);
    
    console.log('✅ Missing Fields Response:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (!response.data.success) {
      console.log('✅ Correctly rejected missing fields!');
      console.log('Error:', response.data.error);
      return true;
    } else {
      console.log('❌ Should have rejected missing fields!');
      return false;
    }
  } catch (error) {
    console.log('❌ Missing Fields Test Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
    return false;
  }
}

// Test 3: Signup with Password Mismatch
async function testPasswordMismatch() {
  console.log('');
  console.log('📝 Test 3: Signup with Password Mismatch');
  console.log('----------------------------------------');
  
  const testAdmin = {
    name: 'Mismatch User',
    email: 'mismatch@example.com',
    password: 'password123',
    npassword: 'differentpassword456'
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/adminsignup`, testAdmin);
    
    console.log('✅ Password Mismatch Response:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (!response.data.success) {
      console.log('✅ Correctly rejected password mismatch!');
      console.log('Error:', response.data.error);
      return true;
    } else {
      console.log('❌ Should have rejected password mismatch!');
      return false;
    }
  } catch (error) {
    console.log('❌ Password Mismatch Test Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
    return false;
  }
}

// Test 4: Signup with Existing User
async function testExistingUser() {
  console.log('');
  console.log('📝 Test 4: Signup with Existing User');
  console.log('------------------------------------');
  
  const testAdmin = {
    name: 'Test Admin User', // Same name as Test 1
    email: 'test.admin@example.com', // Same email as Test 1
    password: 'anotherpassword456',
    npassword: 'anotherpassword456'
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/adminsignup`, testAdmin);
    
    console.log('✅ Existing User Response:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (!response.data.success) {
      console.log('✅ Correctly rejected existing user!');
      console.log('Error:', response.data.error);
      return true;
    } else {
      console.log('❌ Should have rejected existing user!');
      return false;
    }
  } catch (error) {
    console.log('❌ Existing User Test Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
    return false;
  }
}

// Test 5: Invalid HTTP Method
async function testInvalidMethod() {
  console.log('');
  console.log('📝 Test 5: Invalid HTTP Method');
  console.log('------------------------------');
  
  try {
    // Try GET instead of POST
    const response = await axios.get(`${BASE_URL}/api/adminsignup`);
    
    console.log('✅ Invalid Method Response:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (!response.data.success) {
      console.log('✅ Correctly rejected invalid method!');
      console.log('Error:', response.data.error);
      return true;
    } else {
      console.log('❌ Should have rejected invalid method!');
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid Method Test Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
    return false;
  }
}

// Test 6: Edge Case - Empty Fields
async function testEmptyFields() {
  console.log('');
  console.log('📝 Test 6: Edge Case - Empty Fields');
  console.log('-----------------------------------');
  
  const testAdmin = {
    name: '',
    email: '',
    password: '',
    npassword: ''
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/adminsignup`, testAdmin);
    
    console.log('✅ Empty Fields Response:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (!response.data.success) {
      console.log('✅ Correctly rejected empty fields!');
      console.log('Error:', response.data.error);
      return true;
    } else {
      console.log('❌ Should have rejected empty fields!');
      return false;
    }
  } catch (error) {
    console.log('❌ Empty Fields Test Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
    return false;
  }
}

// Main Test Function
async function runTests() {
  console.log('Starting Comprehensive Admin Signup Tests...\n');
  
  // Run all tests
  const test1 = await testSuccessfulSignup();
  const test2 = await testMissingFields();
  const test3 = await testPasswordMismatch();
  const test4 = await testExistingUser();
  const test5 = await testInvalidMethod();
  const test6 = await testEmptyFields();
  
  // Summary
  console.log('');
  console.log('📊 Test Summary');
  console.log('==============');
  console.log(`Successful Signup: ${test1 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Missing Fields: ${test2 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Password Mismatch: ${test3 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Existing User: ${test4 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Invalid Method: ${test5 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Empty Fields: ${test6 ? '✅ PASS' : '❌ FAIL'}`);
  
  const totalTests = 6;
  const passedTests = [test1, test2, test3, test4, test5, test6].filter(Boolean).length;
  
  console.log('');
  console.log(`🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Admin signup logging is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above for details.');
  }
  
  console.log('');
  console.log('📋 Expected Server Logs:');
  console.log('========================');
  console.log('1. Admin Signup Attempt - Method: POST, IP: ...');
  console.log('2. Admin Signup Request - Name: ..., Email: ...');
  console.log('3. Admin Password Encrypted for email: ...');
  console.log('4. Admin Signup Successful - Name: ..., Email: ..., Role: admin');
  console.log('5. Admin Signup Failed - Missing required fields for email: ...');
  console.log('6. Admin Signup Failed - Passwords do not match for email: ...');
  console.log('7. Admin Signup Failed - User already exists for email: ...');
  console.log('8. Admin Signup Failed - Invalid method: GET');
  console.log('9. Admin Signup Error - [error details]');
}

// Check if axios is available
try {
  require.resolve('axios');
} catch (error) {
  console.log('❌ Error: axios package not found');
  console.log('Please install axios: npm install axios');
  process.exit(1);
}

// Run the tests
runTests().catch(console.error);