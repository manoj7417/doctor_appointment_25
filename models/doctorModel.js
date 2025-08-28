const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String,
            required: [true, "name is required"],
        },
        image: {
            type: String,
            default: "/doc1.png"
        },
        phone: {
            type: String,
            required: [true, "phone no is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        specialization: {
            type: String,
        },
        experience: {
            type: Number,
        },
        degree: {
            type: String,
        },
        hospital: {
            type: String,
        },
        availability: {
            type: [String], // Array of days like ["Mon", "Wed", "Fri"]
        },
        slots: {
            type: Object, // less strict but works
            default: {}
        },
        price: {
            type: Number,
        },
        about: {
            type: String,
        },
        services: {
            type: [String],
        },
        virtualConsultation: {
            type: Boolean,
        },
        inPersonConsultation: {
            type: Boolean,
        },
        hasWebsite: { type: Boolean, default: false },
        websiteUrl: { type: String, default: null },
        address: {
            type: String,
        },
        status: {
            type: String,
            default: "pending",
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    { timestamps: true }
);

const doctorModel = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);
module.exports = doctorModel;
