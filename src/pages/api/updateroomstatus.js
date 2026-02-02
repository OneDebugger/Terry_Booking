import connectDb from "../middleware/mongoose";
import RoomInstance from "../../../models/RoomInstance";
import { checkAdminAuth } from "./utils/auth";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and is admin
    const authResult = checkAdminAuth(req);
    if (!authResult.isValid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = authResult.user;

    const { roomId, newStatus, notes } = req.body;

    if (!roomId || !newStatus) {
      return res.status(400).json({ success: false, error: 'Room ID and new status are required' });
    }

    // Validate status
    const validStatuses = ['available', 'occupied', 'clean', 'dirty', 'maintenance', 'out_of_order'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    // Find the room instance
    const roomInstance = await RoomInstance.findById(roomId);
    if (!roomInstance) {
      return res.status(404).json({ success: false, error: 'Room instance not found' });
    }

    // Update room status
    const updateData = {
      status: newStatus,
      statusNotes: notes || '',
      lastModifiedBy: user.email
    };

    // Additional updates based on status
    if (newStatus === 'clean') {
      updateData.lastCleaned = new Date();
    }

    if (newStatus === 'maintenance') {
      updateData.nextMaintenanceDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    }

    const updatedRoomInstance = await RoomInstance.findByIdAndUpdate(
      roomId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Room status updated to ${newStatus}`,
      roomInstance: updatedRoomInstance
    });

  } catch (error) {
    console.error('Error updating room status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}