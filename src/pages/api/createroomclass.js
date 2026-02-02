import connectDb from "../middleware/mongoose";
import RoomClass from "../../../models/RoomClass";
import User from "../../../models/User";
import { checkAdminAuth } from "./utils/auth";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and is admin
    const authResult = checkAdminAuth(req);
    console.log('🔍 Auth result:', authResult);
    
    if (!authResult.isValid) {
      console.log('❌ Authentication failed - invalid auth result');
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const userData = authResult.user;
    console.log('👤 Authenticated user data:', userData);

    // Find the admin user in the database to get their ObjectId
    const adminUser = await User.findOne({ email: userData.email, role: 'admin' });
    if (!adminUser) {
      return res.status(401).json({ success: false, error: 'Admin user not found' });
    }

    // Handle both JSON and FormData
    let body;
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      // FormData handling
      body = {};
      for (const [key, value] of Object.entries(req.body)) {
        if (key === 'images') {
          // Skip file uploads for now, we'll handle them separately
          continue;
        }
        body[key] = value;
      }
    } else {
      // JSON handling
      body = req.body;
    }

    const {
      name,
      slug,
      description,
      category,
      subcategory,
      capacity,
      basePrice,
      mrp,
      discountPercent,
      amenities,
      features,
      bedType,
      roomSize,
      view,
      totalInventory,
      minStay,
      maxStay,
      checkInTime,
      checkOutTime
    } = body;

    // Validation
    if (!name || !slug || !description || !category || !subcategory) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (basePrice < 0 || mrp < 0 || discountPercent < 0 || discountPercent > 100) {
      return res.status(400).json({ success: false, error: 'Invalid pricing values' });
    }

    if (totalInventory < 1) {
      return res.status(400).json({ success: false, error: 'Total inventory must be at least 1' });
    }

    // Check if slug already exists
    const existingClass = await RoomClass.findOne({ slug });
    if (existingClass) {
      return res.status(400).json({ success: false, error: 'Room class with this slug already exists' });
    }

    // Parse arrays if they're strings
    const parsedAmenities = Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map(item => item.trim()).filter(item => item) : []);
    const parsedFeatures = Array.isArray(features) ? features : (features ? features.split(',').map(item => item.trim()).filter(item => item) : []);
    const parsedCapacity = typeof capacity === 'string' ? JSON.parse(capacity) : capacity;

    // Create room class
    const roomClass = new RoomClass({
      name,
      slug,
      description,
      category,
      subcategory,
      capacity: parsedCapacity,
      basePrice,
      mrp,
      discountPercent,
      amenities: parsedAmenities,
      features: parsedFeatures,
      bedType,
      roomSize,
      view,
      totalInventory,
      minStay,
      maxStay,
      checkInTime,
      checkOutTime,
      createdBy: adminUser._id, // Use admin's ObjectId
      lastModifiedBy: adminUser._id // Use admin's ObjectId
    });

    await roomClass.save();

    res.status(201).json({
      success: true,
      message: 'Room class created successfully',
      roomClass
    });

  } catch (error) {
    console.error('Error creating room class:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
