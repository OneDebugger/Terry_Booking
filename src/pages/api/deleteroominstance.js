import connectDb from "../middleware/mongoose";
import RoomInstance from "../../../models/RoomInstance";
import RoomClass from "../../../models/RoomClass";
import Order from "../../../models/Order";
import { checkAdminAuth } from "./utils/auth";

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and is admin
    const authResult = checkAdminAuth(req);
    if (!authResult.isValid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = authResult.user;

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Room instance ID is required' });
    }

    // Find the room instance
    const roomInstance = await RoomInstance.findById(id);
    if (!roomInstance) {
      return res.status(404).json({ success: false, error: 'Room instance not found' });
    }

    // Check if there are any active bookings for this room
    const activeBookings = await Order.countDocuments({
      roomInstance: id,
      deliveryStatus: { $in: ['pending', 'confirmed', 'room allocated', 'checked in'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot delete room instance with ${activeBookings} active bookings. Please cancel bookings first.` 
      });
    }

    // Soft delete the room instance (mark as deleted instead of hard delete)
    roomInstance.isDeleted = true;
    roomInstance.isActive = false;
    roomInstance.lastModifiedBy = user.email;
    await roomInstance.save();

    // Update room class inventory count
    const roomClass = await RoomClass.findById(roomInstance.roomClass);
    if (roomClass) {
      roomClass.activeRooms = await RoomInstance.countDocuments({ 
        roomClass: roomInstance.roomClass, 
        isActive: true, 
        isDeleted: false 
      });
      await roomClass.save();
    }

    res.status(200).json({
      success: true,
      message: 'Room instance marked as deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting room instance:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}