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
const checkSlotAvailability = async (doctorId, appointmentDate, slot) => {
    const existingBooking = await bookingModel.findOne({
        doctorId,
        appointmentDate: {
            $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
            $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
        },
        slot,
        status: { $in: ['confirmed', 'pending'] }
    });

    return !existingBooking; // Return true if slot is available
};

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        const {
            patientName,
            patientPhone,
            patientEmail,
            doctorId,
            doctorName,
            specialization,
            appointmentDate,
            slot,
            price,
            paymentMethod,
            paymentDetails,
            paymentStatus,
            notes,
            token: authToken // JWT token from cookies
        } = body;

        // Verify authentication and get user info
        let userId = null;
        let bookingType = 'guest';
        let userEmail = null;

        if (authToken) {
            const decoded = verifyToken(authToken);
            if (decoded) {
                userId = decoded.userId;
                bookingType = 'authenticated';
                userEmail = patientEmail || decoded.email;
            }
        }

        // Check slot availability
        const isSlotAvailable = await checkSlotAvailability(doctorId, new Date(appointmentDate), slot);
        if (!isSlotAvailable) {
            return NextResponse.json(
                { success: false, message: 'Selected slot is not available' },
                { status: 400 }
            );
        }

        // Generate unique token
        let token = Math.floor(100 + Math.random() * 900);
        let existingBooking = await bookingModel.findOne({ token });
        while (existingBooking) {
            token = Math.floor(100 + Math.random() * 900);
            existingBooking = await bookingModel.findOne({ token });
        }

        // Create booking
        const booking = new bookingModel({
            userId,
            patientName,
            patientPhone,
            patientEmail: userEmail,
            doctorId,
            doctorName,
            specialization,
            appointmentDate: new Date(appointmentDate),
            slot,
            price,
            paymentMethod,
            paymentStatus,
            paymentDetails,
            token,
            bookingType,
            notes
        });

        await booking.save();

        // Send SMS confirmation
        const formattedDate = new Date(appointmentDate).toLocaleDateString('en-IN');
        const formattedTime = slot;

        try {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const twilioClient = require("twilio")(accountSid, authToken);

            const smsMessage = `Hi ${patientName}! Your appointment with Dr. ${doctorName} (${specialization}) on ${formattedDate} at ${formattedTime} is confirmed. Your token number is: ${token}. Please arrive 10 minutes before your appointment. Thank you!`;

            console.log('Sending SMS to:', `+91${patientPhone}`);
            console.log('SMS Message:', smsMessage);

            const smsResult = await twilioClient.messages.create({
                body: smsMessage,
                from: '+19204813393',
                to: `+91${patientPhone}`,
            });

            console.log('SMS sent successfully:', smsResult.sid);

        } catch (smsError) {
            console.error('SMS sending failed:', smsError);
            console.error('SMS Error details:', {
                message: smsError.message,
                code: smsError.code,
                status: smsError.status
            });
            // Don't fail the booking if SMS fails
        }

        return NextResponse.json({
            success: true,
            booking,
            message: 'Booking created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('Booking error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return NextResponse.json(
            { success: false, message: 'Error creating booking', error: error.message },
            { status: 500 }
        );
    }
}

// Get bookings for authenticated user
export async function GET(req) {
    await connectDB();

    try {
        const { searchParams } = new URL(req.url);
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

        const userId = decoded.userId;
        const bookings = await bookingModel.find({ userId })
            .populate('doctorId', 'name specialization hospital')
            .sort({ appointmentDate: -1 });

        return NextResponse.json({
            success: true,
            bookings
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { success: false, message: 'Error fetching bookings', error: error.message },
            { status: 500 }
        );
    }
} 