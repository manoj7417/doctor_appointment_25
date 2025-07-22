import { connectDB } from '@/lib/dbConfig';
import bookingModel from '@/models/bookingModel';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
        const doctorId = searchParams.get('doctorId');
        const date = searchParams.get('date');
        const slot = searchParams.get('slot');

        if (!doctorId || !date) {
            return NextResponse.json(
                { success: false, message: 'Doctor ID and date are required' },
                { status: 400 }
            );
        }

        // Parse the date
        const appointmentDate = new Date(date);
        const startOfDay = new Date(appointmentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(appointmentDate.setHours(23, 59, 59, 999));

        // Check if slot is available
        const existingBooking = await bookingModel.findOne({
            doctorId,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            slot: slot || { $exists: true }, // If slot is provided, check specific slot
            status: { $in: ['confirmed', 'pending'] }
        });

        const available = !existingBooking;

        return NextResponse.json({
            success: true,
            available,
            message: available ? 'Slot is available' : 'Slot is not available'
        });

    } catch (error) {
        console.error('Error checking availability:', error);
        return NextResponse.json(
            { success: false, message: 'Error checking availability', error: error.message },
            { status: 500 }
        );
    }
} 