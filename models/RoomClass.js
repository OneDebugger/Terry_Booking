const mongoose = require('mongoose');

const RoomClassSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['room'] },
    subcategory: { type: String, required: true, enum: ['deluxe', 'executive', 'family', 'other'] },
    
    // Room specifications
    capacity: {
        adults: { type: Number, required: true, min: 1 },
        children: { type: Number, default: 0 }
    },
    
    // Pricing
    basePrice: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    
    // Amenities and features
    amenities: [{
        type: String
    }],
    features: [{
        type: String
    }],
    
    // Room specifications
    bedType: { type: String, enum: ['single', 'double', 'king', 'queen', 'twin'] },
    roomSize: { type: Number, min: 0 }, // Room size in square meters
    view: { type: String }, // e.g., "ocean view", "city view", "garden view"
    
    // Images
    images: [{
        url: { type: String, required: true },
        alt: { type: String }
    }],
    
    // Inventory management
    totalInventory: { type: Number, required: true, min: 1 },
    activeRooms: { type: Number, default: 0 }, // Number of physical rooms created
    
    // Booking rules
    minStay: { type: Number, default: 1 }, // Minimum nights required
    maxStay: { type: Number, default: 30 }, // Maximum nights allowed
    checkInTime: { type: String, default: "14:00" }, // HH:mm format
    checkOutTime: { type: String, default: "11:00" }, // HH:mm format
    
    // Status
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    
    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Virtual for current availability (calculated from room instances)
RoomClassSchema.virtual('availableRooms').get(function() {
    // This will be populated by querying RoomInstance model
    return this._availableRooms || 0;
});

// Index for better query performance
RoomClassSchema.index({ category: 1, subcategory: 1 });
RoomClassSchema.index({ slug: 1 });
RoomClassSchema.index({ isActive: 1, isDeleted: 1 });

// Static method to get available rooms for a date range
RoomClassSchema.statics.getAvailableRooms = async function(classId, checkIn, checkOut) {
    const RoomInstance = mongoose.model('RoomInstance');
    
    const availableInstances = await RoomInstance.find({
        roomClass: classId,
        status: { $in: ['available', 'clean'] },
        _id: {
            $nin: await this.getOccupiedRoomIds(checkIn, checkOut)
        }
    }).populate('roomClass', 'name basePrice amenities features');
    
    return availableInstances;
};

// Static method to get occupied room IDs for a date range
RoomClassSchema.statics.getOccupiedRoomIds = async function(checkIn, checkOut) {
    const Order = mongoose.model('Order');
    
    const occupiedOrders = await Order.find({
        $and: [
            { checkin: { $lt: checkOut } },
            { checkout: { $gt: checkIn } },
            { deliveryStatus: { $in: ['pending', 'confirmed', 'room allocated'] } }
        ]
    }).select('room_no');
    
    return occupiedOrders.map(order => order.room_no).filter(Boolean);
};

mongoose.models = {};
module.exports = mongoose.model('RoomClass', RoomClassSchema);