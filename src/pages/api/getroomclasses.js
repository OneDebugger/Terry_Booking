import connectDb from "../middleware/mongoose";
import RoomClass from "../../../models/RoomClass";
import RoomInstance from "../../../models/RoomInstance";
import { checkAdminAuth } from "./utils/auth";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and is admin
    const authResult = checkAdminAuth(req);
    if (!authResult.isValid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Get query parameters for filtering and pagination
    const { page = 1, limit = 10, category, subcategory, isActive } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Get total count for pagination
    const totalCount = await RoomClass.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    // Get room classes with pagination
    const roomClasses = await RoomClass.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // Get available rooms count for each room class
    for (const roomClass of roomClasses) {
      const availableInstances = await RoomInstance.countDocuments({
        roomClass: roomClass._id,
        status: { $in: ['available', 'clean'] },
        isActive: true,
        isDeleted: false
      });
      
      roomClass._availableRooms = availableInstances;
    }

    res.status(200).json({
      success: true,
      data: roomClasses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching room classes:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}