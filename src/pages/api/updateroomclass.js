import connectDb from "../middleware/mongoose";
import RoomClass from "../../../models/RoomClass";
import User from "../../../models/User";
import { checkAdminAuth } from "./utils/auth";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and is admin
    const authResult = checkAdminAuth(req);
    if (!authResult.isValid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const userData = authResult.user;

    // Find the admin user in the database to get their ObjectId
    const adminUser = await User.findOne({ email: userData.email, role: 'admin' });
    if (!adminUser) {
      return res.status(401).json({ success: false, error: 'Admin user not found' });
    }

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Room class ID is required' });
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
      checkOutTime,
      isActive
    } = req.body;

    // Find the room class
    const roomClass = await RoomClass.findById(id);
    if (!roomClass) {
      return res.status(404).json({ success: false, error: 'Room class not found' });
    }

    // Validation
    if (basePrice !== undefined && basePrice < 0) {
      return res.status(400).json({ success: false, error: 'Base price cannot be negative' });
    }

    if (mrp !== undefined && mrp < 0) {
      return res.status(400).json({ success: false, error: 'MRP cannot be negative' });
    }

    if (discountPercent !== undefined && (discountPercent < 0 || discountPercent > 100)) {
      return res.status(400).json({ success: false, error: 'Discount percentage must be between 0 and 100' });
    }

    if (totalInventory !== undefined && totalInventory < 1) {
      return res.status(400).json({ success: false, error: 'Total inventory must be at least 1' });
    }

    // Check if slug already exists (excluding current room class)
    if (slug && slug !== roomClass.slug) {
      const existingClass = await RoomClass.findOne({ slug, _id: { $ne: id } });
      if (existingClass) {
        return res.status(400).json({ success: false, error: 'Room class with this slug already exists' });
      }
    }

    // Parse arrays if they're strings
    const parsedAmenities = Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map(item => item.trim()).filter(item => item) : undefined);
    const parsedFeatures = Array.isArray(features) ? features : (features ? features.split(',').map(item => item.trim()).filter(item => item) : undefined);
    const parsedCapacity = typeof capacity === 'string' ? JSON.parse(capacity) : capacity;

    // Update room class
    const updateData = {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description && { description }),
      ...(category && { category }),
      ...(subcategory && { subcategory }),
      ...(parsedCapacity && { capacity: parsedCapacity }),
      ...(basePrice !== undefined && { basePrice }),
      ...(mrp !== undefined && { mrp }),
      ...(discountPercent !== undefined && { discountPercent }),
      ...(parsedAmenities !== undefined && { amenities: parsedAmenities }),
      ...(parsedFeatures !== undefined && { features: parsedFeatures }),
      ...(bedType && { bedType }),
      ...(roomSize && { roomSize }),
      ...(view && { view }),
      ...(totalInventory !== undefined && { totalInventory }),
      ...(minStay !== undefined && { minStay }),
      ...(maxStay !== undefined && { maxStay }),
      ...(checkInTime && { checkInTime }),
      ...(checkOutTime && { checkOutTime }),
      ...(isActive !== undefined && { isActive }),
      lastModifiedBy: adminUser._id
    };

    const updatedRoomClass = await RoomClass.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Room class updated successfully',
      roomClass: updatedRoomClass
    });

  } catch (error) {
    console.error('Error updating room class:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}