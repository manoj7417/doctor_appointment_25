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
        const doctorId = decoded.doctorId;

        // Get all bookings for this patient with this doctor
        const bookings = await bookingModel.find({
            doctorId,
            $or: [
                { _id: id },
                { patientPhone: id } // If id is phone number
            ]
        }).sort({ appointmentDate: -1 });

        if (bookings.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Patient not found' },
                { status: 404 }
            );
        }

        // Get the latest booking for patient info
        const latestBooking = bookings[0];

        // Calculate patient statistics
        const totalAppointments = bookings.length;
        const completedAppointments = bookings.filter(b => b.status === 'completed').length;
        const cancelledAppointments = bookings.filter(b => b.status === 'cancelled').length;
        const totalSpent = bookings
            .filter(b => b.paymentStatus === 'completed')
            .reduce((sum, b) => sum + b.price, 0);

        const firstVisit = bookings[bookings.length - 1].appointmentDate;
        const lastVisit = latestBooking.appointmentDate;

        // Format booking history
        const bookingHistory = bookings.map(booking => ({
            id: booking._id,
            appointmentDate: new Date(booking.appointmentDate).toLocaleDateString('en-IN'),
            appointmentTime: new Date(booking.appointmentDate).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            price: booking.price,
            token: booking.token,
            notes: booking.notes,
            cancellationReason: booking.cancellationReason,
            cancelledAt: booking.cancelledAt ? new Date(booking.cancelledAt).toLocaleDateString('en-IN') : null
        }));

        // Patient details
        const patientDetails = {
            id: latestBooking._id,
            patientName: latestBooking.patientName,
            patientPhone: latestBooking.patientPhone,
            patientEmail: latestBooking.patientEmail,
            totalAppointments,
            completedAppointments,
            cancelledAppointments,
            totalSpent,
            firstVisit: new Date(firstVisit).toLocaleDateString('en-IN'),
            lastVisit: new Date(lastVisit).toLocaleDateString('en-IN'),
            averageSpentPerVisit: totalAppointments > 0 ? (totalSpent / totalAppointments).toFixed(2) : 0,
            bookingHistory
        };

        return NextResponse.json({
            success: true,
            data: patientDetails
        });

    } catch (error) {
        console.error('Get patient details error:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching patient details', error: error.message },
            { status: 500 }
        );
    }
} 