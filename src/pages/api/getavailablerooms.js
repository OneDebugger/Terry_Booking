import Product from "../../../models/Product";
import RoomInstance from "../../../models/RoomInstance";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const { checkin, checkout, adults, child, room } = req.body;

    // Validate required fields
    if (!checkin || !checkout || !adults || !child || !room) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Convert to Date objects
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    // Validate dates
    if (checkinDate >= checkoutDate) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" });
    }

    // Get all room instances
    const roomInstances = await RoomInstance.find({ status: "available" })
      .populate("roomClass", "title price capacity maxOccupancy amenities images")
      .lean();

    // Filter available rooms based on booking conflicts
    const availableRooms = [];
    
    for (const instance of roomInstances) {
      // Check if this room instance has any bookings that overlap with the requested dates
      const hasConflict = instance.bookings.some(booking => {
        const bookingCheckin = new Date(booking.checkin);
        const bookingCheckout = new Date(booking.checkout);
        
        // Check for date overlap
        return (
          (checkinDate >= bookingCheckin && checkinDate < bookingCheckout) ||
          (checkoutDate > bookingCheckin && checkoutDate <= bookingCheckout) ||
          (checkinDate <= bookingCheckin && checkoutDate >= bookingCheckout)
        );
      });

      if (!hasConflict) {
        availableRooms.push(instance);
      }
    }

    // Group by room class and calculate availability
    const roomClasses = {};
    availableRooms.forEach(instance => {
      const classId = instance.roomClass._id.toString();
      if (!roomClasses[classId]) {
        roomClasses[classId] = {
          ...instance.roomClass,
          availableInstances: [],
          totalAvailable: 0
        };
      }
      roomClasses[classId].availableInstances.push(instance);
      roomClasses[classId].totalAvailable++;
    });

    // Convert to array and sort by price
    const availableRoomClasses = Object.values(roomClasses).sort((a, b) => a.price - b.price);

    res.status(200).json({
      success: true,
      availableRooms: availableRoomClasses,
      bookingDetails: {
        checkin: checkinDate,
        checkout: checkoutDate,
        adults: parseInt(adults),
        children: parseInt(child),
        roomsRequested: parseInt(room)
      }
    });

  } catch (error) {
    console.error("Error fetching available rooms:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch available rooms",
      details: error.message 
    });
  }
}