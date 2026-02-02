import connectDb from "../middleware/mongoose";
import RoomInstance from "../../../models/RoomInstance";
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
      return res.status(400).json({ success: false, error: 'Room instance ID is required' });
    }

    const {
      roomNumber,
      roomName,
      roomClass,
      floor,
      building,
      wing,
      status,
      statusNotes,
      specialFeatures,
      customPrice
    } = req.body;

    // Find the room instance
    const roomInstance = await RoomInstance.findById(id);
    if (!roomInstance) {
      return res.status(404).json({ success: false, error: 'Room instance not found' });
    }

    // Validation
    if (roomNumber && roomNumber !== roomInstance.roomNumber) {
      const existingRoom = await RoomInstance.findOne({ 
        roomNumber: roomNumber.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingRoom) {
        return res.status(400).json({ success: false, error: 'Room with this number already exists' });
      }
    }

    if (roomClass && roomClass !== roomInstance.roomClass.toString()) {
      const roomClassDoc = await RoomClass.findById(roomClass);
      if (!roomClassDoc) {
        return res.status(404).json({ success: false, error: 'Room class not found' });
      }
    }

    // Parse arrays if they're strings
    const parsedSpecialFeatures = Array.isArray(specialFeatures) ? specialFeatures : (specialFeatures ? specialFeatures.split(',').map(item => item.trim()).filter(item => item) : undefined);

    // Update room instance
    const updateData = {
      ...(roomNumber && { roomNumber: roomNumber.toUpperCase() }),
      ...(roomName !== undefined && { roomName }),
      ...(roomClass && { roomClass }),
      ...(floor !== undefined && { floor }),
      ...(building && { building }),
      ...(wing !== undefined && { wing }),
      ...(status && { status }),
      ...(statusNotes !== undefined && { statusNotes }),
      ...(parsedSpecialFeatures !== undefined && { specialFeatures: parsedSpecialFeatures }),
      ...(customPrice !== undefined && { customPrice: customPrice ? parseFloat(customPrice) : 0 }),
      lastModifiedBy: adminUser._id
    };

    const updatedRoomInstance = await RoomInstance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('roomClass', 'name subcategory');

    // Update room class inventory count if room class changed
    if (roomClass && roomClass !== roomInstance.roomClass.toString()) {
      // Update old room class count
      const oldRoomClass = await RoomClass.findById(roomInstance.roomClass);
      if (oldRoomClass) {
        oldRoomClass.activeRooms = await RoomInstance.countDocuments({ 
          roomClass: roomInstance.roomClass, 
          isActive: true, 
          isDeleted: false 
        });
        await oldRoomClass.save();
      }

      // Update new room class count
      const newRoomClass = await RoomClass.findById(roomClass);
      if (newRoomClass) {
        newRoomClass.activeRooms = await RoomInstance.countDocuments({ 
          roomClass: roomClass, 
          isActive: true, 
          isDeleted: false 
        });
        await newRoomClass.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Room instance updated successfully',
      roomInstance: updatedRoomInstance
    });

  } catch (error) {
    console.error('Error updating room instance:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}