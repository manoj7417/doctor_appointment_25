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

// GET - Get specific appointment details
export async function GET(req, { params }) {
    try {
        await connectDB();

        const token = req.cookies.get('doctorToken')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.doctorId) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        const { id } = params;
        const appointment = await bookingModel.findById(id);

        if (!appointment) {
            return NextResponse.json(
                { success: false, message: 'Appointment not found' },
                { status: 404 }
            );
        }

        // Verify the appointment belongs to this doctor
        if (appointment.doctorId.toString() !== decoded.doctorId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized access' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            appointment
        });

    } catch (error) {
        console.error('Get appointment error:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching appointment', error: error.message },
            { status: 500 }
        );
    }
}

// PUT - Update appointment status
export async function PUT(req, { params }) {
    try {
        await connectDB();

        const token = req.cookies.get('doctorToken')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.doctorId) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        const { id } = params;
        const { status, notes, cancellationReason } = await req.json();

        const appointment = await bookingModel.findById(id);

        if (!appointment) {
            return NextResponse.json(
                { success: false, message: 'Appointment not found' },
                { status: 404 }
            );
        }

        // Verify the appointment belongs to this doctor
        if (appointment.doctorId.toString() !== decoded.doctorId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized access' },
                { status: 403 }
            );
        }

        // Update appointment
        const updateData = { status };

        if (notes) {
            updateData.notes = notes;
        }

        if (status === 'cancelled' && cancellationReason) {
            updateData.cancellationReason = cancellationReason;
            updateData.cancelledAt = new Date();
        }

        // If marking as checked/completed, add checked timestamp
        if (status === 'checked' || status === 'completed') {
            updateData.checkedAt = new Date();
        }

        const updatedAppointment = await bookingModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Appointment updated successfully',
            appointment: updatedAppointment
        });

    } catch (error) {
        console.error('Update appointment error:', error);
        return NextResponse.json(
            { success: false, message: 'Error updating appointment', error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Cancel appointment
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const token = req.cookies.get('doctorToken')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.doctorId) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        const { id } = params;
        const appointment = await bookingModel.findById(id);

        if (!appointment) {
            return NextResponse.json(
                { success: false, message: 'Appointment not found' },
                { status: 404 }
            );
        }

        // Verify the appointment belongs to this doctor
        if (appointment.doctorId.toString() !== decoded.doctorId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized access' },
                { status: 403 }
            );
        }

        // Cancel appointment
        const cancelledAppointment = await bookingModel.findByIdAndUpdate(
            id,
            {
                status: 'cancelled',
                cancelledAt: new Date()
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Appointment cancelled successfully',
            appointment: cancelledAppointment
        });

    } catch (error) {
        console.error('Cancel appointment error:', error);
        return NextResponse.json(
            { success: false, message: 'Error cancelling appointment', error: error.message },
            { status: 500 }
        );
    }
} 