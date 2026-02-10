import connectDb from "../middleware/mongoose";
import Booking from "../../../models/Booking";
import RoomInstance from "../../../models/RoomInstance";
import RoomClass from "../../../models/RoomClass";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { order } = req.body;

      console.log('💳 Processing booking completion for:', order.name);

      // Validate required order data
      if (!order || !order.amount) {
        return res.status(400).json({ 
          success: false, 
          error: "Invalid order data - missing amount" 
        });
      }

      // Generate booking ID if not provided
      const bookingId = order.orderID || 'BK' + Date.now() + Math.floor(Math.random() * 10000);

      // Check if booking already exists (prevent duplicates)
      const existingBooking = await Booking.findOne({ bookingId: bookingId });
      if (existingBooking) {
        return res.status(200).json({ 
          success: true, 
          booking: existingBooking,
          message: "Booking already processed"
        });
      }

      // Find room class if this is a room booking
      let roomClassId = null;
      if (order.checkin && order.checkout) {
        const roomClassName = Object.keys(order.products)[0];
        const roomClass = await RoomClass.findOne({ name: roomClassName });
        if (roomClass) {
          roomClassId = roomClass._id;
        }
      }

      // Calculate booking details
      const checkinDate = new Date(order.checkin);
      const checkoutDate = new Date(order.checkout);
      const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
      const roomRate = roomClassId ? (await RoomClass.findById(roomClassId)).basePrice || 0 : 0;
      const totalPrice = roomRate * nights;

      // Create new booking in database
      const newBooking = new Booking({
        guestName: order.name,
        guestEmail: order.email,
        guestPhone: order.phone,
        address: order.address,
        pincode: order.pincode,
        city: order.city,
        state: order.state,
        roomClassId: roomClassId,
        checkinDate: checkinDate,
        checkoutDate: checkoutDate,
        nights: nights,
        adults: 2, // Default value, could be extracted from order
        children: 0,
        roomRate: roomRate,
        totalPrice: totalPrice,
        deposit: 0,
        paymentMethod: 'cash',
        paymentStatus: 'paid',  // Mark as paid since payment is complete
        bookingStatus: 'confirmed',
        specialRequests: order.specialRequests || '',
        notes: 'Booking created via checkout'
      });

      // Save booking to database
      const savedBooking = await newBooking.save();
      console.log('✅ Booking saved to database:', savedBooking.bookingId);

      // If this is a room booking, update room status
      if (roomClassId) {
        try {
          // Find an available room instance
          const availableRoom = await RoomInstance.findOne({
            roomClassId: roomClassId,
            status: 'available'
          });

          if (availableRoom) {
            // Assign room to booking
            await savedBooking.assignRoom(availableRoom._id);
            console.log('🏠 Room', availableRoom.roomNumber, 'assigned to booking');
          } else {
            console.warn('⚠️ No available rooms found for booking:', bookingId);
          }
        } catch (roomError) {
          console.warn('⚠️ Room assignment failed:', roomError.message);
          // Don't fail the booking if room assignment fails
        }
      }

      res.status(200).json({
        success: true,
        booking: {
          _id: savedBooking._id,
          bookingId: savedBooking.bookingId,
          guestName: savedBooking.guestName,
          guestEmail: savedBooking.guestEmail,
          totalPrice: savedBooking.totalPrice,
          paymentStatus: savedBooking.paymentStatus,
          bookingStatus: savedBooking.bookingStatus,
          createdAt: savedBooking.createdAt
        },
        message: "Booking completed successfully"
      });

    } catch (error) {
      console.error('❌ Error processing booking:', error);
      res.status(500).json({ 
        success: false, 
        error: "Booking processing failed", 
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