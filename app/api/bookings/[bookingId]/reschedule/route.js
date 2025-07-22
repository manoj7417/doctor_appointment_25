import { connectDB } from '@/lib/dbConfig';
import bookingModel from '@/models/bookingModel';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Helper function to check slot availability
const checkSlotAvailability = async (doctorId, appointmentDate, slot, excludeBookingId = null) => {
    const query = {
        doctorId,
        appointmentDate: {
            $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
            $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
        },
        slot,
        status: { $in: ['confirmed', 'pending'] }
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const existingBooking = await bookingModel.findOne(query);
    return !existingBooking;
};

export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { bookingId } = params;
        const { appointmentDate, slot } = await req.json();
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        // Find the booking
        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return NextResponse.json(
                { success: false, message: 'Booking not found' },
                { status: 404 }
            );
        }

        // Check if user owns this booking or is admin
        if (booking.userId && booking.userId.toString() !== decoded.userId && !decoded.isAdmin) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized to reschedule this booking' },
                { status: 403 }
            );
        }

        // Check if booking can be rescheduled
        if (booking.status === 'cancelled') {
            return NextResponse.json(
                { success: false, message: 'Cannot reschedule cancelled booking' },
                { status: 400 }
            );
        }

        if (booking.status === 'completed') {
            return NextResponse.json(
                { success: false, message: 'Cannot reschedule completed booking' },
                { status: 400 }
            );
        }

        // Check if new slot is available
        const isSlotAvailable = await checkSlotAvailability(
            booking.doctorId,
            new Date(appointmentDate),
            slot,
            bookingId
        );

        if (!isSlotAvailable) {
            return NextResponse.json(
                { success: false, message: 'Selected slot is not available' },
                { status: 400 }
            );
        }

        // Update booking
        booking.appointmentDate = new Date(appointmentDate);
        booking.slot = slot;

        await booking.save();

        return NextResponse.json({
            success: true,
            booking,
            message: 'Booking rescheduled successfully'
        });

    } catch (error) {
        console.error('Error rescheduling booking:', error);
        return NextResponse.json(
            { success: false, message: 'Error rescheduling booking', error: error.message },
            { status: 500 }
        );
    }
} 