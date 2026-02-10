import connectDb from "../../middleware/mongoose";
import RoomClass from "../../../../models/RoomClass";
import RoomInstance from "../../../../models/RoomInstance";

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get all active room classes (no authentication required for public access)
    const roomClasses = await RoomClass.find({ isActive: true })
      .sort({ createdAt: -1 })
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
      data: roomClasses
    });

  } catch (error) {
    console.error('Error fetching room classes:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

export default connectDb(handler);
