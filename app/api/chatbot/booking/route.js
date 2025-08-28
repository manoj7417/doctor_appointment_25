// import { connectDB } from '@/lib/dbConfig';
// import bookingModel from '@/models/bookingModel';
// import { NextResponse } from 'next/server';
// import twilio from 'twilio';
// import { v4 as uuidv4 } from 'uuid';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// export async function POST(req) {
//     await connectDB();

//     try {
//         const body = await req.json();
//         const token = uuidv4();
//         const {
//             patientName,
//             patientPhone,
//             doctorId,
//             doctorName,
//             specialization,
//             appointmentDate,
//             slot,
//             price,
//             paymentMethod,
//             paymentDetails,
//             paymentStatus,
//         } = body;

//         const booking = new bookingModel({
//             patientName,
//             patientPhone,
//             doctorId,
//             doctorName,
//             specialization,
//             appointmentDate: new Date(appointmentDate),
//             slot,
//             price,
//             paymentMethod,
//             paymentStatus,
//             paymentDetails,
//             token,
//         });

//         await booking.save();

//         // ✅ Send SMS confirmation
//         const formattedDate = new Date(appointmentDate).toLocaleDateString('en-IN');
//         const formattedTime = slot;

//         await client.messages.create({
//             body: `Hi! Your appointment with Dr. ${doctorName} (${specialization}) on ${formattedDate} at ${formattedTime} is confirmed.  Your token is: ${token} Thank you!`,
//             from: '+19204813393',
//             to: `+91${patientPhone}`,
//         });

//         return NextResponse.json({ success: true, booking }, { status: 201 });

//     } catch (error) {
//         return NextResponse.json(
//             { success: false, message: 'Error creating booking', error: error.message },
//             { status: 500 }
//         );
//     }
// }




// export async function GET() {
//     await connectDB();

//     try {
//         const bookings = await bookingModel.find().sort({ appointmentDate: -1 }); // recent first
//         return NextResponse.json({ success: true, bookings }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json(
//             { success: false, message: 'Error fetching bookings', error: error.message },
//             { status: 500 }
//         );
//     }
// }






import { connectDB } from '@/lib/dbConfig';
import bookingModel from '@/models/bookingModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await connectDB();

    try {
        const body = await req.json();
        let token = Math.floor(100 + Math.random() * 900); // 3-digit token

        // Ensure token is unique (very low chance of collision)
        const existingBooking = await bookingModel.findOne({ token });
        if (existingBooking) {
            token = Math.floor(100 + Math.random() * 900); // Regenerate if exists
        }

        const {
            patientName,
            patientPhone,
            doctorId,
            doctorName,
            specialization,
            appointmentDate,
            slot,
            price,
            paymentMethod,
            paymentDetails,
            paymentStatus,
        } = body;

        // Check slot availability before creating booking
        const appointmentDateObj = new Date(appointmentDate);
        const startOfDay = new Date(appointmentDateObj);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(appointmentDateObj);
        endOfDay.setHours(23, 59, 59, 999);

        const existingSlotBooking = await bookingModel.findOne({
            doctorId,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            slot: slot,
            status: { $in: ['confirmed', 'pending'] }
        });

        if (existingSlotBooking) {
            return NextResponse.json(
                { success: false, message: 'Selected slot is not available. Please choose another slot.' },
                { status: 409 }
            );
        }

        const booking = new bookingModel({
            patientName,
            patientPhone,
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
        });

        await booking.save();

        // Send SMS confirmation
        const formattedDate = new Date(appointmentDate).toLocaleDateString('en-IN');
        const formattedTime = slot;

        try {
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const twilioClient = require("twilio")(accountSid, authToken);

            const smsMessage = `Hi! Your appointment with Dr. ${doctorName} (${specialization}) on ${formattedDate} at ${formattedTime} is confirmed. Your token number is: ${token}. Please arrive 10 minutes before your appointment. Thank you!`;

            const smsResult = await twilioClient.messages.create({
                body: smsMessage,
                from: '+19204813393',
                to: `+91${patientPhone}`,
            });

        } catch (smsError) {
            console.error('SMS sending failed:', smsError);
            console.error('SMS Error details:', {
                message: smsError.message,
                code: smsError.code,
                status: smsError.status
            });
            // Don't fail the booking if SMS fails
        }

        return NextResponse.json({ success: true, booking }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error creating booking', error: error.message },
            { status: 500 }
        );
    }
}

// GET remains the same
export async function GET() {
    await connectDB();
    try {
        const bookings = await bookingModel.find().sort({ appointmentDate: -1 });
        return NextResponse.json({ success: true, bookings }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error fetching bookings', error: error.message },
            { status: 500 }
        );
    }
}