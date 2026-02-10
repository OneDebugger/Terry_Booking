const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    // Basic booking info
    bookingId: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => 'BK' + Date.now() + Math.floor(Math.random() * 10000)
    },
    
    // Customer details
    guestName: { type: String, required: true },
    guestEmail: { type: String, required: true },
    guestPhone: { type: String, required: true },
    address: { type: String },
    pincode: { type: String },
    city: { type: String },
    state: { type: String },
    
    // Room booking details
    roomClassId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomClass',
        required: true 
    },
    roomInstanceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomInstance' 
    },
    
    // Booking dates
    checkinDate: { type: Date, required: true },
    checkoutDate: { type: Date, required: true },
    nights: { type: Number, required: true },
    
    // Guest details
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    
    // Pricing
    roomRate: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    
    // Payment details
    paymentMethod: { 
        type: String, 
        enum: ['cash', 'card', 'online'],
        default: 'cash'
    },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'partial', 'failed'],
        default: 'pending'
    },
    
    // Booking status
    bookingStatus: { 
        type: String, 
        enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
        default: 'pending'
    },
    
    // Special requests
    specialRequests: { type: String },
    notes: { type: String },
    
    // Check-in/out tracking
    actualCheckIn: { type: Date },
    actualCheckOut: { type: Date },
    
    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Audit trail
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notes: String
    }]
}, { timestamps: true });

// Index for efficient queries
BookingSchema.index({ guestEmail: 1 });
BookingSchema.index({ bookingId: 1 });
BookingSchema.index({ roomClassId: 1, checkinDate: 1, checkoutDate: 1 });
BookingSchema.index({ bookingStatus: 1, checkinDate: 1 });

// Pre-save middleware to update status history
BookingSchema.pre('save', function(next) {
    if (this.isModified('bookingStatus')) {
        this.statusHistory.push({
            status: this.bookingStatus,
            updatedBy: this.updatedBy || this.createdBy,
            notes: `Status updated to ${this.bookingStatus}`
        });
    }
    next();
});

// Static method to get bookings for a date range
BookingSchema.statics.getBookingsForDateRange = function(checkIn, checkOut) {
    return this.find({
        $and: [
            { checkinDate: { $lt: checkOut } },
            { checkoutDate: { $gt: checkIn } },
            { bookingStatus: { $in: ['pending', 'confirmed', 'checked-in'] } }
        ]
    }).populate('roomClassId roomInstanceId');
};

// Static method to get available rooms for booking
BookingSchema.statics.getAvailableRooms = async function(roomClassId, checkIn, checkOut, requiredRooms = 1) {
    const RoomInstance = mongoose.model('RoomInstance');
    
    // Get occupied room instance IDs
    const occupiedBookings = await this.find({
        $and: [
            { checkinDate: { $lt: checkOut } },
            { checkoutDate: { $gt: checkIn } },
            { bookingStatus: { $in: ['pending', 'confirmed', 'checked-in'] } }
        ]
    }).select('roomInstanceId');
    
    const occupiedRoomIds = occupiedBookings
        .map(booking => booking.roomInstanceId)
        .filter(Boolean);
    
    // Get available room instances
    const availableInstances = await RoomInstance.find({
        roomClassId: roomClassId,
        status: { $in: ['available', 'clean'] },
        isActive: true,
        isDeleted: false,
        _id: { $nin: occupiedRoomIds }
    }).populate('roomClassId', 'name basePrice amenities features');
    
    return availableInstances.slice(0, requiredRooms);
};

// Instance method to assign room
BookingSchema.methods.assignRoom = async function(roomInstanceId) {
    const RoomInstance = mongoose.model('RoomInstance');
    
    // Check if room is available
    const room = await RoomInstance.findById(roomInstanceId);
    if (!room) {
        throw new Error('Room instance not found');
    }
    
    if (!(await room.isAvailableForDates(this.checkinDate, this.checkoutDate))) {
        throw new Error(`Room ${room.roomNumber} is not available for the selected dates`);
    }
    
    // Assign room and update status
    this.roomInstanceId = roomInstanceId;
    this.bookingStatus = 'confirmed';
    
    // Mark room as occupied
    await room.assignToBooking();
    
    return await this.save();
};

// Instance method to check in
BookingSchema.methods.checkIn = async function() {
    if (this.bookingStatus !== 'confirmed') {
        throw new Error('Cannot check in: booking not confirmed');
    }
    
    this.bookingStatus = 'checked-in';
    this.actualCheckIn = new Date();
    
    return await this.save();
};

// Instance method to check out
BookingSchema.methods.checkOut = async function() {
    if (this.bookingStatus !== 'checked-in') {
        throw new Error('Cannot check out: guest not checked in');
    }
    
    this.bookingStatus = 'checked-out';
    this.actualCheckOut = new Date();
    
    // Mark room as dirty for cleaning
    if (this.roomInstanceId) {
        const RoomInstance = mongoose.model('RoomInstance');
        await RoomInstance.markAsDirty(this.roomInstanceId, 'Guest checked out');
    }
    
    return await this.save();
};

mongoose.models = {};
module.exports = mongoose.model('Booking', BookingSchema);