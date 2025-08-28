import { connectDB } from '@/lib/dbConfig';
import bookingModel from '@/models/bookingModel';
import { NextResponse } from 'next/server';


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

        // Find the booking
        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return NextResponse.json(
                { success: false, message: 'Booking not found' },
                { status: 404 }
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