// File: app/api/prescriptions/route.js (for App Router)
// OR: pages/api/prescriptions.js (for Pages Router)

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConfig';
import prescriptionModel from '@/models/prescriptionModel';
import bookingModel from '@/models/bookingModel';

// ✅ POST: Add prescription with complete prescription data
export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        const {
            bookingId,
            doctorId,
            prescriptionData,
            medicines,
            fileUrl
        } = body;

        // Validate required fields
        if (!bookingId || !doctorId) {
            return NextResponse.json({
                error: "bookingId and doctorId are required"
            }, { status: 400 });
        }

        // Check if prescription data or fileUrl is provided
        if (!prescriptionData && !fileUrl) {
            return NextResponse.json({
                error: "Either prescriptionData or fileUrl must be provided"
            }, { status: 400 });
        }

        // Verify booking exists
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return NextResponse.json({
                error: "Booking not found"
            }, { status: 404 });
        }

        // Check for existing prescription to avoid duplicates
        const existingPrescription = await prescriptionModel.findOne({ bookingId });
        if (existingPrescription) {
            return NextResponse.json({
                error: "Prescription already exists for this booking"
            }, { status: 409 });
        }

        // Create new prescription
        const prescription = await prescriptionModel.create({
            bookingId,
            doctorId,
            prescriptionData: prescriptionData || null,
            medicines: medicines || [],
            fileUrl: fileUrl || null,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Update booking with prescription reference
        booking.prescriptionId = prescription._id;
        await booking.save();

        return NextResponse.json({
            message: "Prescription created successfully",
            prescription
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating prescription:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}

// ✅ GET: Get prescription by bookingId
export async function GET(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("bookingId");
    const prescriptionId = searchParams.get("prescriptionId");

    if (!bookingId && !prescriptionId) {
        return NextResponse.json({
            error: "Either bookingId or prescriptionId query parameter is required"
        }, { status: 400 });
    }

    try {
        let prescription;

        if (bookingId) {
            prescription = await prescriptionModel.findOne({ bookingId })
                .populate('doctorId', 'name qualification registrationNumber')
                .populate('bookingId', 'patientId appointmentDate');
        } else {
            prescription = await prescriptionModel.findById(prescriptionId)
                .populate('doctorId', 'name qualification registrationNumber')
                .populate('bookingId', 'patientId appointmentDate');
        }

        if (!prescription) {
            return NextResponse.json({
                error: "Prescription not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            prescription
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching prescription:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}

// ✅ PUT: Update existing prescription
export async function PUT(req) {
    await connectDB();

    try {
        const body = await req.json();
        const {
            prescriptionId,
            bookingId,
            prescriptionData,
            medicines,
            fileUrl
        } = body;

        if (!prescriptionId && !bookingId) {
            return NextResponse.json({
                error: "Either prescriptionId or bookingId is required"
            }, { status: 400 });
        }

        // Find prescription
        let prescription;
        if (prescriptionId) {
            prescription = await prescriptionModel.findById(prescriptionId);
        } else {
            prescription = await prescriptionModel.findOne({ bookingId });
        }

        if (!prescription) {
            return NextResponse.json({
                error: "Prescription not found"
            }, { status: 404 });
        }

        // Update prescription fields
        const updateData = {
            updatedAt: new Date()
        };

        if (prescriptionData) updateData.prescriptionData = prescriptionData;
        if (medicines) updateData.medicines = medicines;
        if (fileUrl) updateData.fileUrl = fileUrl;

        const updatedPrescription = await prescriptionModel.findByIdAndUpdate(
            prescription._id,
            updateData,
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            message: "Prescription updated successfully",
            prescription: updatedPrescription
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating prescription:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}

// ✅ DELETE: Delete prescription
export async function DELETE(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const prescriptionId = searchParams.get("prescriptionId");
    const bookingId = searchParams.get("bookingId");

    if (!prescriptionId && !bookingId) {
        return NextResponse.json({
            error: "Either prescriptionId or bookingId query parameter is required"
        }, { status: 400 });
    }

    try {
        let prescription;

        if (prescriptionId) {
            prescription = await prescriptionModel.findById(prescriptionId);
        } else {
            prescription = await prescriptionModel.findOne({ bookingId });
        }

        if (!prescription) {
            return NextResponse.json({
                error: "Prescription not found"
            }, { status: 404 });
        }

        // Remove prescription reference from booking
        if (prescription.bookingId) {
            await bookingModel.findByIdAndUpdate(
                prescription.bookingId,
                { $unset: { prescriptionId: 1 } }
            );
        }

        // Delete prescription
        await prescriptionModel.findByIdAndDelete(prescription._id);

        return NextResponse.json({
            message: "Prescription deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error deleting prescription:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}