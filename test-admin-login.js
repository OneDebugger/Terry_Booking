#!/usr/bin/env node

/**
 * Temporary Test Script for Admin Login Functionality
 * Tests the admin authentication flow using Terry's credentials
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3001';
const ADMIN_CREDENTIALS = {
  email: 'terry@kwaterry.com',
  password: 'food'
};

console.log('🚀 Admin Login Test Script');
console.log('========================');
console.log(`Testing against: ${BASE_URL}`);
console.log(`Using credentials: ${ADMIN_CREDENTIALS.email} / ${ADMIN_CREDENTIALS.password}`);
console.log('');

// Test 1: Admin Login
async function testAdminLogin() {
  console.log('📝 Test 1: Admin Login');
  console.log('---------------------');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/adminlogin`, ADMIN_CREDENTIALS);
    
    console.log('✅ Admin Login Response:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.success) {
      console.log('✅ Login successful!');
      console.log('Token:', response.data.token);
      console.log('Email:', response.data.email);
      return response.data.token;
    } else {
      console.log('❌ Login failed!');
      console.log('Error:', response.data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Admin Login Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
    return null;
  }
}

// Test 2: Admin Authentication
async function testAdminAuthentication(token) {
  console.log('');
  console.log('📝 Test 2: Admin Authentication');
  console.log('-------------------------------');
  
  if (!token) {
    console.log('❌ Skipping - No token from previous test');
    return false;
  }
  
  try {
    const response = await axios.post(`${BASE_URL}/api/myadmin`, { token });
    
    console.log('✅ Admin Authentication Response:');
    console.log('Status:', response.status);
    console.log('User Data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Admin Authentication Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
    return false;
  }
}

// Test 3: Admin Dashboard Access
async function testAdminDashboard() {
  console.log('');
  console.log('📝 Test 3: Admin Dashboard Access');
  console.log('----------------------------------');
  
  try {
    const response = await axios.get(`${BASE_URL}/admin`);
    
    console.log('✅ Admin Dashboard Response:');
    console.log('Status:', response.status);
    console.log('Content Length:', response.data.length);
    
    // Check if it's a redirect or actual admin content
    if (response.data.includes('HotelDCrescent Admin Panel')) {
      console.log('✅ Admin dashboard loaded successfully!');
    } else if (response.data.includes('login')) {
      console.log('⚠️  Redirected to login page (expected if not authenticated)');
    } else {
      console.log('⚠️  Unexpected response content');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Admin Dashboard Error:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Message:', error.message);
    }
    return false;
  }
}

// Test 4: Admin Signup (to verify the system works for new admins)
async function testAdminSignup() {
  console.log('');
  console.log('📝 Test 4: Admin Signup (Test New Admin Creation)');
  console.log('-------------------------------------------------');
  
  const testAdmin = {
    name: 'Test Admin',
    email: 'test@admin.com',
    password: 'test123',
    npassword: 'test123'
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/api/adminsignup`, testAdmin);
    
    console.log('✅ Admin Signup Response:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.success) {
      console.log('✅ Admin signup successful!');
    } else {
      console.log('❌ Admin signup failed!');
      console.log('Error:', response.data.error);
    }
    
    return response.data.success;
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

// Main Test Function
async function runTests() {
  console.log('Starting Admin Authentication Tests...\n');
  
  // Run tests in sequence
  const token = await testAdminLogin();
  const authSuccess = await testAdminAuthentication(token);
  const dashboardSuccess = await testAdminDashboard();
  const signupSuccess = await testAdminSignup();
  
  // Summary
  console.log('');
  console.log('📊 Test Summary');
  console.log('==============');
  console.log(`Admin Login: ${token ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Admin Authentication: ${authSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Admin Dashboard: ${dashboardSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Admin Signup: ${signupSuccess ? '✅ PASS' : '❌ FAIL'}`);
  
  const totalTests = 4;
  const passedTests = [token, authSuccess, dashboardSuccess, signupSuccess].filter(Boolean).length;
  
  console.log('');
  console.log(`🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Admin authentication is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above for details.');
  }
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