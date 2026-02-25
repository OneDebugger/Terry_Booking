import connectDb from "../middleware/mongoose";
import Booking from "../../../models/Booking";
import RoomClass from "../../../models/RoomClass";
import RoomInstance from "../../../models/RoomInstance";
import User from "../../../models/User";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const {
        userId,
        roomClassId,
        checkinDate,
        checkoutDate,
        guestName,
        guestEmail,
        guestPhone,
        adults,
        children = 0,
        paymentMethod = 'cash',
        deposit = 0,
        notes = '',
        specialRequests = '',
        roomIds = []  // Accept the selected room IDs from frontend
      } = req.body;

      console.log('🏨 Creating new booking:', {
        userId, roomClassId, checkinDate, checkoutDate, guestName, guestEmail
      });

      // Validate required fields
      if (!roomClassId || !checkinDate || !checkoutDate || 
          !guestName || !guestEmail || !guestPhone || !adults) {
        return res.status(400).json({ 
          success: false, 
          error: "Missing required fields" 
        });
      }

      // Validate dates
      const checkin = new Date(checkinDate);
      const checkout = new Date(checkoutDate);
      
      console.log('📅 Date validation:', {
        checkinDate: checkinDate,
        checkoutDate: checkoutDate,
        checkinParsed: checkin,
        checkoutParsed: checkout,
        checkinValid: !isNaN(checkin.getTime()),
        checkoutValid: !isNaN(checkout.getTime()),
        checkoutAfterCheckin: checkout > checkin
      });
      
      if (isNaN(checkin.getTime()) || isNaN(checkout.getTime())) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid date format" 
        });
      }

      if (checkout <= checkin) {
        return res.status(400).json({ 
          success: false, 
          error: "Check-out date must be after check-in date" 
        });
      }

      // Only validate user if userId is provided
      if (userId) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ 
            success: false, 
            error: "User not found" 
          });
        }
      }

      // Validate room class exists
      const roomClass = await RoomClass.findById(roomClassId);
      if (!roomClass) {
        return res.status(404).json({ 
          success: false, 
          error: "Room class not found" 
        });
      }

      // Calculate nights
      const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
      const roomRate = roomClass.price || 0;
      const totalPrice = roomRate * nights;

      console.log('💰 Booking calculation:', { nights, roomRate, totalPrice });

      // Check room availability for the date range
      const conflictingBookings = await Booking.find({
        roomClassId: roomClassId,
        bookingStatus: { $in: ['confirmed', 'checked-in'] },
        $or: [
          {
            checkinDate: { $gte: checkin, $lte: checkout }
          },
          {
            checkoutDate: { $gte: checkin, $lte: checkout }
          },
          {
            checkinDate: { $lte: checkin },
            checkoutDate: { $gte: checkout }
          }
        ]
      }).populate('roomInstanceId');

      // Get all room instances for this room class
      const allRoomInstances = await RoomInstance.find({ 
        roomClass: roomClassId,
        status: 'available'
      });

      console.log('🏠 Available room instances:', allRoomInstances.length);
      console.log('⚠️ Conflicting bookings:', conflictingBookings.length);

      // Get booked room instance IDs
      const bookedRoomInstanceIds = conflictingBookings.map(booking => booking.roomInstanceId._id.toString());

      // Find available rooms
      const availableRooms = allRoomInstances.filter(room => 
        !bookedRoomInstanceIds.includes(room._id.toString())
      );

      console.log('✅ Available rooms for booking:', availableRooms.length);

      if (availableRooms.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: "No rooms available for the selected dates" 
        });
      }

      // Determine which room to use
      let selectedRoom;
      
      // If user selected a specific room, use it
      if (roomIds && roomIds.length > 0) {
        const userSelectedRoomId = roomIds[0]; // Get the first selected room
        console.log('🎯 User selected room ID:', userSelectedRoomId);
        
        // Find the selected room in available rooms
        selectedRoom = availableRooms.find(room => room._id.toString() === userSelectedRoomId);
        
        if (!selectedRoom) {
          return res.status(400).json({ 
            success: false, 
            error: "Selected room is not available for the specified dates. Please select a different room or dates.",
            availableRooms: availableRooms.map(room => ({
              id: room._id,
              roomNumber: room.roomNumber
            }))
          });
        }
        
        console.log('✅ Using user-selected room:', selectedRoom.roomNumber);
      } else {
        // Fallback to first available room if no specific selection
        selectedRoom = availableRooms[0];
        console.log('⚠️ No specific room selected, using first available room:', selectedRoom.roomNumber);
      }

      // Create new booking
      const booking = new Booking({
        userId: userId,
        roomClassId: roomClassId,
        roomInstanceId: selectedRoom._id,
        checkinDate: checkin,
        checkoutDate: checkout,
        nights: nights,
        guestName: guestName,
        guestEmail: guestEmail,
        guestPhone: guestPhone,
        adults: parseInt(adults),
        children: parseInt(children),
        roomRate: roomRate,
        totalPrice: totalPrice,
        deposit: parseFloat(deposit),
        paymentMethod: paymentMethod,
        paymentStatus: deposit > 0 ? 'paid' : 'pending',
        bookingStatus: 'confirmed',
        notes: notes,
        specialRequests: specialRequests
      });

      // Save booking
      const savedBooking = await booking.save();
      console.log('✅ Booking saved:', savedBooking.bookingId);

      // Update room instance status to 'booked'
      await RoomInstance.findByIdAndUpdate(selectedRoom._id, { 
        status: 'booked',
        lastUpdated: new Date()
      });

      console.log('✅ Room status updated to booked');

      // Prepare response
      const response = {
        success: true,
        bookingId: savedBooking.bookingId,
        booking: {
          id: savedBooking._id,
          bookingId: savedBooking.bookingId,
          guestName: savedBooking.guestName,
          guestEmail: savedBooking.guestEmail,
          checkinDate: savedBooking.checkinDate,
          checkoutDate: savedBooking.checkoutDate,
          nights: savedBooking.nights,
          roomRate: savedBooking.roomRate,
          totalPrice: savedBooking.totalPrice,
          deposit: savedBooking.deposit,
          paymentStatus: savedBooking.paymentStatus,
          bookingStatus: savedBooking.bookingStatus
        },
        room: {
          id: selectedRoom._id,
          roomNumber: selectedRoom.roomNumber,
          floor: selectedRoom.floor
        },
        roomClass: {
          id: roomClass._id,
          title: roomClass.title,
          description: roomClass.description
        },
        message: "Booking created successfully"
      };

      console.log('✅ Booking creation completed:', response.bookingId);

      res.status(201).json(response);

    } catch (error) {
      console.error('❌ Error creating booking:', error);
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