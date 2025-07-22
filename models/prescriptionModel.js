const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true, // One prescription per booking
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    text: {
        type: String,
        trim: true,
    },
    fileUrl: {
        type: String,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

// Only allow either text or fileUrl
prescriptionSchema.pre('validate', function (next) {
    if ((this.text && this.fileUrl) || (!this.text && !this.fileUrl)) {
        return next(new Error('Prescription must have either text or fileUrl, but not both or neither.'));
    }
    next();
});

module.exports = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
