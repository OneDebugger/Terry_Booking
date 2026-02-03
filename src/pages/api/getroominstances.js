import connectDb from "../middleware/mongoose";
import RoomInstance from "../../../models/RoomInstance";
import RoomClass from "../../../models/RoomClass";
import Order from "../../../models/Order";
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
    const { page = 1, limit = 20, roomClass, status, floor, building } = req.query;

    // Build filter object
    const filter = { isActive: true, isDeleted: false };
    if (roomClass) filter.roomClass = roomClass;
    if (status) filter.status = status;
    if (floor) filter.floor = parseInt(floor);
    if (building) filter.building = building;

    // Get total count for pagination
    const totalCount = await RoomInstance.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    // Get room instances with pagination and populate room class
    const roomInstances = await RoomInstance.find(filter)
      .populate('roomClass', 'name subcategory basePrice')
      .sort({ floor: 1, roomNumber: 1 })
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // Get booking status for each room instance
    for (const roomInstance of roomInstances) {
      const activeBooking = await Order.findOne({
        roomInstance: roomInstance._id,
        deliveryStatus: { $in: ['pending', 'confirmed', 'room allocated', 'checked in'] }
      }).sort({ createdAt: -1 });

      roomInstance._currentBooking = activeBooking;
    }

    res.status(200).json({
      success: true,
      data: roomInstances,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Error fetching room instances:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}