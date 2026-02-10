import connectDb from "../middleware/mongoose";
import Booking from "../../../models/Booking";

const handler = async (req, res) => {
  try {
    // Get all bookings with customer details, sorted by most recent first
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('roomClassId', 'name subcategory')
      .populate('roomInstanceId', 'roomNumber roomName')
      .limit(50); // Limit to last 50 bookings for performance

    // Format the data for the admin dashboard
    const customerDetails = bookings.map(booking => ({
      id: booking._id,
      bookingId: booking.bookingId,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      checkinDate: booking.checkinDate,
      checkoutDate: booking.checkoutDate,
      bookingStatus: booking.bookingStatus,
      duration: Math.ceil((new Date(booking.checkoutDate) - new Date(booking.checkinDate)) / (1000 * 60 * 60 * 24)),
      roomClass: booking.roomClassId ? `${booking.roomClassId.name} (${booking.roomClassId.subcategory})` : 'Not assigned',
      roomNumber: booking.roomInstanceId ? booking.roomInstanceId.roomNumber : 'Not assigned',
      roomName: booking.roomInstanceId ? booking.roomInstanceId.roomName : null
    }));

    res.status(200).json({
      success: true,
      data: customerDetails,
      total: bookings.length
    });
  } catch (error) {
    console.error("Error retrieving customer details:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal Server Error",
      message: error.message 
    });
  }
};

export default connectDb(handler);
