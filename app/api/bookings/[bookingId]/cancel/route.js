import { connectDB } from '@/lib/dbConfig';
import bookingModel from '@/models/bookingModel';
import { NextResponse } from 'next/server';


export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { bookingId } = params;
        const { reason } = await req.json();

        // Find the booking
        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return NextResponse.json(
                { success: false, message: 'Booking not found' },
                { status: 404 }
            );
        }

        // Check if booking can be cancelled (not already cancelled or completed)
        if (booking.status === 'cancelled') {
            return NextResponse.json(
                { success: false, message: 'Booking is already cancelled' },
                { status: 400 }
            );
        }

        if (booking.status === 'completed') {
            return NextResponse.json(
                { success: false, message: 'Cannot cancel completed booking' },
                { status: 400 }
            );
        }

        // Update booking status
        booking.status = 'cancelled';
        booking.cancellationReason = reason || 'Cancelled by user';
        booking.cancelledAt = new Date();

        await booking.save();

        return NextResponse.json({
            success: true,
            booking,
            message: 'Booking cancelled successfully'
        });

    } catch (error) {
        console.error('Error cancelling booking:', error);
        return NextResponse.json(
            { success: false, message: 'Error cancelling booking', error: error.message },
            { status: 500 }
        );
    }
} 