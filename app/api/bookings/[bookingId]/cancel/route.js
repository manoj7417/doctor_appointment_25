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

export async function PUT(req, { params }) {
    await connectDB();

    try {
        const { bookingId } = params;
        const { reason } = await req.json();
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
                { success: false, message: 'Unauthorized to cancel this booking' },
                { status: 403 }
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