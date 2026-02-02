import connectDb from "../middleware/mongoose";
import RoomInstance from "../../../models/RoomInstance";
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
    if (!authResult.isValid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const userData = authResult.user;
    
    // Find the admin user in the database to get their ObjectId
    const adminUser = await User.findOne({ email: userData.email, role: 'admin' });
    if (!adminUser) {
      return res.status(401).json({ success: false, error: 'Admin user not found' });
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

    // Validation
    if (!roomNumber || !roomClass) {
      return res.status(400).json({ success: false, error: 'Room number and room class are required' });
    }

    // Check if room class exists
    const roomClassDoc = await RoomClass.findById(roomClass);
    if (!roomClassDoc) {
      return res.status(404).json({ success: false, error: 'Room class not found' });
    }

    // Check if room number already exists
    const existingRoom = await RoomInstance.findOne({ roomNumber: roomNumber.toUpperCase() });
    if (existingRoom) {
      return res.status(400).json({ success: false, error: 'Room with this number already exists' });
    }

    // Parse arrays if they're strings
    const parsedSpecialFeatures = Array.isArray(specialFeatures) ? specialFeatures : (specialFeatures ? specialFeatures.split(',').map(item => item.trim()).filter(item => item) : []);

    // Create room instance
    const roomInstance = new RoomInstance({
      roomNumber: roomNumber.toUpperCase(),
      roomName,
      roomClass,
      floor: floor || 1,
      building: building || 'Main Building',
      wing,
      status: status || 'available',
      statusNotes,
      specialFeatures: parsedSpecialFeatures,
      customPrice: customPrice ? parseFloat(customPrice) : 0,
      createdBy: adminUser._id,
      lastModifiedBy: adminUser._id
    });

    await roomInstance.save();

    // Update room class inventory count
    roomClassDoc.activeRooms = await RoomInstance.countDocuments({ 
      roomClass: roomClass, 
      isActive: true, 
      isDeleted: false 
    });
    await roomClassDoc.save();

    res.status(201).json({
      success: true,
      message: 'Room instance created successfully',
      roomInstance
    });

  } catch (error) {
    console.error('Error creating room instance:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}