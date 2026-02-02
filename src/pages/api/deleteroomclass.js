import connectDb from "../middleware/mongoose";
import RoomClass from "../../../models/RoomClass";
import RoomInstance from "../../../models/RoomInstance";
import Order from "../../../models/Order";
import User from "../../../models/User";
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

    // Find the room class
    const roomClass = await RoomClass.findById(id);
    if (!roomClass) {
      return res.status(404).json({ success: false, error: 'Room class not found' });
    }

    // Check if there are any active bookings for this room class
    const activeBookings = await Order.countDocuments({
      roomClass: id,
      deliveryStatus: { $in: ['pending', 'confirmed', 'room allocated', 'checked in'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot delete room class with ${activeBookings} active bookings. Please cancel bookings first.` 
      });
    }

    // Get all room instances for this room class
    const roomInstances = await RoomInstance.find({ roomClass: id });

    // Soft delete the room class (mark as deleted instead of hard delete)
    roomClass.isDeleted = true;
    roomClass.isActive = false;
    roomClass.lastModifiedBy = adminUser._id;
    await roomClass.save();

    // Soft delete all associated room instances
    await RoomInstance.updateMany(
      { roomClass: id },
      { 
        isDeleted: true, 
        isActive: false,
        lastModifiedBy: adminUser._id 
      }
    );

    res.status(200).json({
      success: true,
      message: 'Room class and associated room instances marked as deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting room class:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}