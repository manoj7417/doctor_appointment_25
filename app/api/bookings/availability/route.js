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

        // Parse the date correctly
        const appointmentDate = new Date(date);
        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Build query based on whether slot is provided
        let query = {
            doctorId,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: { $in: ['confirmed', 'pending'] }
        };

        // If specific slot is provided, check for that slot
        if (slot) {
            query.slot = slot;
        }

        // Check if slot is available
        const existingBooking = await bookingModel.findOne(query);

        const available = !existingBooking;

        return NextResponse.json({
            success: true,
            available,
            message: available ? 'Slot is available' : 'Slot is not available',
            debug: {
                doctorId,
                date: appointmentDate.toISOString(),
                slot,
                startOfDay: startOfDay.toISOString(),
                endOfDay: endOfDay.toISOString(),
                existingBooking: existingBooking ? {
                    id: existingBooking._id,
                    slot: existingBooking.slot,
                    status: existingBooking.status
                } : null
            }
        });

    } catch (error) {
        console.error('Error checking availability:', error);
        return NextResponse.json(
            { success: false, message: 'Error checking availability', error: error.message },
            { status: 500 }
        );
    }
} 