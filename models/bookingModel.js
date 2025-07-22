const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    // User information (if authenticated)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // Optional for guest bookings
    },
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    patientPhone: {
        type: String,
        required: true,
        trim: true
    },
    patientEmail: {
        type: String,
        required: false,
        trim: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    doctorName: {
        type: String,
        required: false
    },
    specialization: {
        type: String,
        required: false
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    slot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed', 'pending', 'checked'],
        default: 'confirmed'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'paypal', 'upi', 'razorpay'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    price: {
        type: Number,
        required: true
    },
    paymentDetails: {
        type: Object,
        required: false
    },
    checked: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        unique: true,
    },
    // Additional fields for better tracking
    bookingType: {
        type: String,
        enum: ['authenticated', 'guest'],
        default: 'guest'
    },
    notes: {
        type: String,
        required: false
    },
    cancellationReason: {
        type: String,
        required: false
    },
    cancelledAt: {
        type: Date,
        required: false
    }
}, { timestamps: true });

// Index for better query performance
bookingSchema.index({ doctorId: 1, appointmentDate: 1, slot: 1 });
bookingSchema.index({ userId: 1, appointmentDate: 1 });
bookingSchema.index({ patientPhone: 1 });

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
