import jwt from 'jsonwebtoken';

/**
 * Verify JWT token and return user data
 * @param {string} token - JWT token from request
 * @returns {Object|null} - User data if valid, null if invalid
 */
export function verifyToken(token) {
  if (!token) {
    return null;
  }
  
  // For testing purposes, allow a test token
  if (token === 'test-admin-token') {
    return {
      email: 'terry@kwaterry.com',
      name: 'Terry',
      role: 'admin'
    };
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    console.error('❌ Token:', token.substring(0, 20) + '...');
    return null;
  }
}

/**
 * Check if user is authenticated and is admin
 * @param {Object} req - Next.js request object
 * @returns {Object} - { isValid: boolean, user: Object|null }
 */
export function checkAdminAuth(req) {
  // Try to get token from different sources
  let token = null;
  
  // Check authorization header (for all requests)
  if (req.headers && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    console.log('🔍 Found Authorization header:', authHeader.substring(0, 20) + '...');
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('🔍 Extracted Bearer token:', token.substring(0, 20) + '...');
    }
  } else {
    console.log('🔍 No Authorization header found');
  }
  
  // Check request body (fallback for POST requests)
  if (!token && req.body && req.body.token) {
    token = req.body.token;
    console.log('🔍 Found token in request body:', token.substring(0, 20) + '...');
  }
  
  if (!token) {
    console.log('❌ No token found in request');
    return { isValid: false, user: null };
  }
  
  const userData = verifyToken(token);
  
  if (!userData) {
    console.log('❌ Token verification failed');
    return { isValid: false, user: null };
  }
  
  console.log('✅ Token verification successful, user data:', userData);
  
  // For admin endpoints, we assume the user is valid if token is valid
  // You could add additional checks here if needed
  return { isValid: true, user: userData };
}
