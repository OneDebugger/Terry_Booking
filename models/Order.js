const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true },
    orderID: { type: String, required: true, unique: true },
    payment_id: { type: String, default: '' },
    payment_signature: { type: String, default: '' },
    
    // Room booking details (updated for Room Instance system)
    roomClass: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomClass',
        required: true 
    },
    roomInstance: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomInstance' 
    },
    
    // Products for food orders (keeping existing functionality)
    products: { type: Object, required: true },
    
    // Customer details
    address: { type: String },
    pincode: { type: String },
    city: { type: String },
    state: { type: String },
    phone: { type: String },
    
    // Booking dates
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    
    // Pricing
    amount: { type: Number, required: true },
    basePrice: { type: Number }, // Room class base price
    totalPrice: { type: Number }, // Final price after calculations
    
    // Booking status
    status: { 
        type: String, 
        default: "initiated", 
        enum: ['initiated', 'pending', 'paid', 'failed', 'cancelled'],
        required: true 
    },
    
    // Room status (housekeeping)
    deliveryStatus: { 
        type: String, 
        default: "pending", 
        enum: [
            'pending',           // Booking created, room not assigned
            'confirmed',         // Payment confirmed, waiting for room
            'room allocated',    // Room assigned, ready for check-in
            'checked in',        // Guest has checked in
            'checked out',       // Guest has checked out
            'cancelled'          // Booking cancelled
        ],
        required: true 
    },
    
    // Booking metadata
    bookingSource: { 
        type: String, 
        enum: ['direct', 'online', 'phone', 'travel_agent'],
        default: 'online' 
    },
    bookingChannel: { type: String }, // e.g., 'website', 'mobile_app', 'call_center'
    
    // Special requests
    specialRequests: { type: String },
    notes: { type: String },
    
    // Check-in/out tracking
    actualCheckIn: { type: Date },
    actualCheckOut: { type: Date },
    
    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Staff member handling booking
    
    // Audit trail
    statusHistory: [{
        status: String,
        deliveryStatus: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notes: String
    }]
}, { timestamps: true });

// Index for efficient queries
OrderSchema.index({ email: 1 });
OrderSchema.index({ orderID: 1 });
OrderSchema.index({ roomClass: 1, checkin: 1, checkout: 1 });
OrderSchema.index({ deliveryStatus: 1, checkin: 1 });
OrderSchema.index({ status: 1, deliveryStatus: 1 });

// Pre-save middleware to update status history
OrderSchema.pre('save', function(next) {
    if (this.isModified('deliveryStatus') || this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            deliveryStatus: this.deliveryStatus,
            updatedBy: this.updatedBy || this.createdBy,
            notes: `Status updated to ${this.status}/${this.deliveryStatus}`
        });
    }
    next();
});

// Static method to get bookings for a date range
OrderSchema.statics.getBookingsForDateRange = function(checkIn, checkOut) {
    return this.find({
        $and: [
            { checkin: { $lt: checkOut } },
            { checkout: { $gt: checkIn } },
            { deliveryStatus: { $in: ['pending', 'confirmed', 'room allocated', 'checked in'] } }
        ]
    }).populate('roomClass roomInstance');
};

// Static method to get available rooms for booking
OrderSchema.statics.getAvailableRooms = async function(roomClassId, checkIn, checkOut, requiredRooms = 1) {
    const RoomInstance = mongoose.model('RoomInstance');
    
    // Get occupied room instance IDs
    const occupiedOrders = await this.find({
        $and: [
            { checkin: { $lt: checkOut } },
            { checkout: { $gt: checkIn } },
            { deliveryStatus: { $in: ['pending', 'confirmed', 'room allocated', 'checked in'] } }
        ]
    }).select('roomInstance');
    
    const occupiedRoomIds = occupiedOrders
        .map(order => order.roomInstance)
        .filter(Boolean);
    
    // Get available room instances
    const availableInstances = await RoomInstance.find({
        roomClass: roomClassId,
        status: { $in: ['available', 'clean'] },
        isActive: true,
        isDeleted: false,
        _id: { $nin: occupiedRoomIds }
    }).populate('roomClass', 'name basePrice amenities features');
    
    return availableInstances.slice(0, requiredRooms);
};

// Instance method to assign room
OrderSchema.methods.assignRoom = async function(roomInstanceId) {
    const RoomInstance = mongoose.model('RoomInstance');
    
    // Check if room is available
    const room = await RoomInstance.findById(roomInstanceId);
    if (!room) {
        throw new Error('Room instance not found');
    }
    
    if (!(await room.isAvailableForDates(this.checkin, this.checkout))) {
        throw new Error(`Room ${room.roomNumber} is not available for the selected dates`);
    }
    
    // Assign room and update status
    this.roomInstance = roomInstanceId;
    this.deliveryStatus = 'room allocated';
    
    // Mark room as occupied
    await room.assignToBooking();
    
    return await this.save();
};

// Instance method to check in
OrderSchema.methods.checkIn = async function() {
    if (this.deliveryStatus !== 'room allocated') {
        throw new Error('Cannot check in: room not allocated');
    }
    
    this.deliveryStatus = 'checked in';
    this.actualCheckIn = new Date();
    
    return await this.save();
};

// Instance method to check out
OrderSchema.methods.checkOut = async function() {
    if (this.deliveryStatus !== 'checked in') {
        throw new Error('Cannot check out: guest not checked in');
    }
    
    this.deliveryStatus = 'checked out';
    this.actualCheckOut = new Date();
    
    // Mark room as dirty for cleaning
    if (this.roomInstance) {
        const RoomInstance = mongoose.model('RoomInstance');
        await RoomInstance.markAsDirty(this.roomInstance, 'Guest checked out');
    }
    
    return await this.save();
};

mongoose.models = {};
module.exports = mongoose.model('Order', OrderSchema);
