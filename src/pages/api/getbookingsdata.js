import connectDb from "../middleware/mongoose";
import Booking from "../../../models/Booking";

const handler = async (req, res) => {
  // Get current year for dynamic date ranges
  const currentYear = new Date().getFullYear();
  
  // Create date ranges for current year
  const dateRanges = [
    { month: 'jan', start: new Date(currentYear, 0, 1), end: new Date(currentYear, 1, 1) },
    { month: 'feb', start: new Date(currentYear, 1, 1), end: new Date(currentYear, 2, 1) },
    { month: 'mar', start: new Date(currentYear, 2, 1), end: new Date(currentYear, 3, 1) },
    { month: 'apr', start: new Date(currentYear, 3, 1), end: new Date(currentYear, 4, 1) },
    { month: 'may', start: new Date(currentYear, 4, 1), end: new Date(currentYear, 5, 1) },
    { month: 'jun', start: new Date(currentYear, 5, 1), end: new Date(currentYear, 6, 1) },
    { month: 'jul', start: new Date(currentYear, 6, 1), end: new Date(currentYear, 7, 1) },
    { month: 'aug', start: new Date(currentYear, 7, 1), end: new Date(currentYear, 8, 1) },
    { month: 'sept', start: new Date(currentYear, 8, 1), end: new Date(currentYear, 9, 1) },
    { month: 'oct', start: new Date(currentYear, 9, 1), end: new Date(currentYear, 10, 1) },
    { month: 'nov', start: new Date(currentYear, 10, 1), end: new Date(currentYear, 11, 1) },
    { month: 'dec', start: new Date(currentYear, 11, 1), end: new Date(currentYear + 1, 0, 1) }
  ];

  try {
    const bookingsData = {};
    
    for (const range of dateRanges) {
      // Get bookings by checkin date (actual booking date)
      const bookings = await Booking.find({
        checkinDate: { $gte: range.start, $lt: range.end }
      });
      
      // Get confirmed bookings
      const confirmedBookings = await Booking.find({
        checkinDate: { $gte: range.start, $lt: range.end },
        bookingStatus: { $in: ['confirmed', 'checked-in'] }
      });
      
      // Get checked-in bookings
      const checkedInBookings = await Booking.find({
        checkinDate: { $gte: range.start, $lt: range.end },
        bookingStatus: 'checked-in'
      });

      bookingsData[range.month] = {
        total: bookings.length,
        confirmed: confirmedBookings.length,
        checkedIn: checkedInBookings.length
      };
    }

    res.status(200).json(bookingsData);
  } catch (error) {
    console.error("Error retrieving bookings data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler);
