// app/api/chatbot/booking/[bookingId]/route.js
import { connectDB } from '@/lib/dbConfig';
import bookingModel from '@/models/bookingModel';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
    await connectDB();

    try {
        const { bookingId } = params; // Get bookingId from route params
        const { checked, token } = await request.json();

        const updatedBooking = await bookingModel.findByIdAndUpdate(
            bookingId,
            { checked },
            { new: true }
        );

        if (!updatedBooking) {
            return NextResponse.json(
                { success: false, message: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, booking: updatedBooking },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error updating booking status', error: error.message },
            { status: 500 }
        );
    }
}