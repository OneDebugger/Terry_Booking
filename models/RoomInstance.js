const mongoose = require('mongoose');

const RoomInstanceSchema = new mongoose.Schema({
    roomNumber: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true 
    },
    roomName: { type: String }, // Optional: e.g., "Hemingway Suite"
    
    // Link to Room Class (Template)
    roomClass: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoomClass', 
        required: true 
    },
    
    // Physical location
    floor: { type: Number, min: 1 },
    building: { type: String },
    wing: { type: String },
    
    // Room status (Housekeeping states)
    status: {
        type: String,
        enum: [
            'available',      // Ready for booking
            'occupied',       // Currently occupied
            'clean',          // Clean but not yet available
            'dirty',          // Needs cleaning
            'maintenance',    // Under maintenance
            'out_of_order'    // Out of service
        ],
        default: 'available'
    },
    
    // Status details
    statusNotes: { type: String }, // e.g., "Deep cleaning required"
    lastCleaned: { type: Date },
    nextCleaningDue: { type: Date },
    
    // Special features (overrides room class defaults)
    specialFeatures: [{
        type: String
    }],
    
    // Pricing overrides (for special rooms)
    customPrice: { type: Number }, // If different from room class base price
    
    // Availability
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    
    // Maintenance tracking
    lastMaintenance: { type: Date },
    nextMaintenanceDue: { type: Date },
    
    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Compound index for efficient queries
RoomInstanceSchema.index({ roomClass: 1, status: 1, isActive: 1 });
RoomInstanceSchema.index({ roomNumber: 1 });
RoomInstanceSchema.index({ floor: 1, roomNumber: 1 });

// Virtual for current booking status
RoomInstanceSchema.virtual('currentBooking').get(function() {
    return this._currentBooking || null;
});

// Static method to get available room instances for a room class
RoomInstanceSchema.statics.getAvailableInstances = async function(roomClassId, checkIn, checkOut) {
    const occupiedRoomIds = await mongoose.model('RoomClass').getOccupiedRoomIds(checkIn, checkOut);
    
    return await this.find({
        roomClass: roomClassId,
        status: { $in: ['available', 'clean'] },
        isActive: true,
        isDeleted: false,
        _id: { $nin: occupiedRoomIds }
    }).populate('roomClass', 'name basePrice amenities features');
};

// Static method to update room status
RoomInstanceSchema.statics.updateRoomStatus = async function(roomInstanceId, newStatus, notes = '') {
    return await this.findByIdAndUpdate(roomInstanceId, {
        status: newStatus,
        statusNotes: notes,
        ...(newStatus === 'clean' && { lastCleaned: new Date() })
    }, { new: true });
};

// Instance method to check if room is available for dates
RoomInstanceSchema.methods.isAvailableForDates = async function(checkIn, checkOut) {
    if (this.status !== 'available' && this.status !== 'clean') {
        return false;
    }
    
    if (this.isActive === false || this.isDeleted === true) {
        return false;
    }
    
    const occupiedRoomIds = await mongoose.model('RoomClass').getOccupiedRoomIds(checkIn, checkOut);
    
    return !occupiedRoomIds.includes(this._id.toString());
};

// Instance method to assign to booking
RoomInstanceSchema.methods.assignToBooking = async function() {
    if (this.status !== 'available' && this.status !== 'clean') {
        throw new Error(`Room ${this.roomNumber} is not available for booking (${this.status})`);
    }
    
    return await this.updateOne({ status: 'occupied' });
};

// Instance method to mark as cleaned
RoomInstanceSchema.methods.markAsClean = async function() {
    return await this.updateOne({ 
        status: 'clean',
        lastCleaned: new Date(),
        statusNotes: ''
    });
};

// Instance method to mark as dirty
RoomInstanceSchema.methods.markAsDirty = async function(notes = '') {
    return await this.updateOne({ 
        status: 'dirty',
        statusNotes: notes
    });
};

// Instance method to put under maintenance
RoomInstanceSchema.methods.putUnderMaintenance = async function(notes = '') {
    return await this.updateOne({ 
        status: 'maintenance',
        statusNotes: notes,
        nextMaintenanceDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
};

mongoose.models = {};
module.exports = mongoose.model('RoomInstance', RoomInstanceSchema, 'roominstances');
