import connectDb from "../../middleware/mongoose";
import Booking from "../../../../models/Booking";
import RoomClass from "../../../../models/RoomClass";
import RoomInstance from "../../../../models/RoomInstance";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { checkin, checkout, roomClassId, roomCount = 1 } = req.body;

      console.log('🔍 Checking room availability:', {
        checkin, checkout, roomClassId, roomCount
      });

      // Validate required fields
      if (!checkin || !checkout || !roomClassId) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required fields: checkin, checkout, roomClassId" 
        });
      }

      // Validate dates
      const checkinDateObj = new Date(checkin);
      const checkoutDateObj = new Date(checkout);
      
      console.log('📅 Availability check - Date validation:', {
        checkinDate: checkin,
        checkoutDate: checkout,
        checkinParsed: checkinDateObj,
        checkoutParsed: checkoutDateObj,
        checkinValid: !isNaN(checkinDateObj.getTime()),
        checkoutValid: !isNaN(checkoutDateObj.getTime()),
        checkoutAfterCheckin: checkoutDateObj > checkinDateObj
      });
      
      if (isNaN(checkinDateObj.getTime()) || isNaN(checkoutDateObj.getTime())) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid date format" 
        });
      }

      if (checkoutDateObj <= checkinDateObj) {
        return res.status(400).json({ 
          success: false, 
          error: "Check-out date must be after check-in date" 
        });
      }

      // Calculate nights
      const nights = Math.ceil((checkoutDateObj - checkinDateObj) / (1000 * 60 * 60 * 24));
      console.log('📅 Calculated nights:', nights);

      // Get room class details
      const roomClass = await RoomClass.findById(roomClassId);
      if (!roomClass || !roomClass.isActive) {
        return res.status(404).json({ 
          success: false, 
          error: "Room class not found or inactive" 
        });
      }

      console.log('🏨 Room class found:', roomClass.title);

      // Get all room instances for this room class
      const allRoomInstances = await RoomInstance.find({ 
        roomClass: roomClassId,
        status: { $in: ['available', 'clean'] }, // Only consider available or clean rooms
        isActive: true,
        isDeleted: false
      });

      console.log('🏠 Total room instances found:', allRoomInstances.length);

      if (allRoomInstances.length === 0) {
        return res.status(200).json({
          success: true,
          availableCount: 0,
          availableRooms: [],
          roomClass: roomClass,
          nights: nights,
          totalPrice: 0,
          message: "No rooms available for this room class"
        });
      }

      // Find conflicting bookings for the date range
      const conflictingBookings = await Booking.find({
        roomClassId: roomClassId,
        bookingStatus: { $in: ['confirmed', 'checked-in'] },
        $or: [
          {
            checkinDate: { $gte: checkinDateObj, $lte: checkoutDateObj }
          },
          {
            checkoutDate: { $gte: checkinDateObj, $lte: checkoutDateObj }
          },
          {
            checkinDate: { $lte: checkinDateObj },
            checkoutDate: { $gte: checkoutDateObj }
          }
        ]
      }).populate('roomInstanceId');

      console.log('⚠️ Conflicting bookings found:', conflictingBookings.length);

      // Get booked room instance IDs
      const bookedRoomInstanceIds = conflictingBookings.map(booking => booking.roomInstanceId._id.toString());

      // Find available rooms (not in conflicting bookings)
      const availableRooms = allRoomInstances.filter(room => 
        !bookedRoomInstanceIds.includes(room._id.toString())
      );

      console.log('✅ Available rooms:', availableRooms.length);

      // Calculate pricing
      const roomRate = roomClass.price || 0;
      const totalPrice = roomRate * nights * Math.min(roomCount, availableRooms.length);

      // Prepare response
      const response = {
        success: true,
        availableCount: availableRooms.length,
        requestedCount: parseInt(roomCount),
        roomClass: {
          id: roomClass._id,
          title: roomClass.title,
          description: roomClass.description,
          price: roomRate,
          images: roomClass.images || [],
          amenities: roomClass.amenities || []
        },
        nights: nights,
        checkinDate: checkin,
        checkoutDate: checkout,
        totalPrice: totalPrice,
        availableRooms: availableRooms.map(room => ({
          id: room._id,
          roomNumber: room.roomNumber,
          status: room.status,
          floor: room.floor
        }))
      };

      console.log('✅ Availability check completed:', {
        availableCount: response.availableCount,
        totalPrice: response.totalPrice
      });

      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Error checking room availability:', error);
      res.status(500).json({ 
        success: false, 
        error: "Internal server error", 
        details: error.message 
      });
    }
  } else {
    res.status(405).json({ 
      success: false, 
      error: "Method not allowed" 
    });
  }
};

export default connectDb(handler);