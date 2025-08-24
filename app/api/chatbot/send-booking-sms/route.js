import { NextResponse } from 'next/server';
import bulkSmsService from '@/lib/bulkSmsService';

export async function POST(req) {
    try {
        console.log('=== Booking SMS Send Request Started ===');

        const {
            phone,
            patientName,
            doctorName,
            appointmentDate,
            slot,
            bookingId,
            hospital
        } = await req.json();

        console.log('Received booking details:', {
            phone,
            patientName,
            doctorName,
            appointmentDate,
            slot,
            bookingId,
            hospital
        });

        // Validate required fields
        if (!phone || !patientName || !doctorName || !appointmentDate || !slot || !bookingId) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing required booking details'
                },
                { status: 400 }
            );
        }

        // Send booking confirmation SMS
        console.log('Sending booking confirmation via BulkSMS to:', phone);

        const bookingDetails = {
            patientName,
            doctorName,
            appointmentDate,
            slot,
            bookingId,
            hospital
        };

        const smsResult = await bulkSmsService.sendBookingConfirmation(phone, bookingDetails);

        console.log('BulkSMS Booking Result:', smsResult);

        if (smsResult.success) {
            return NextResponse.json({
                success: true,
                message: smsResult.demoMode ? 'Booking confirmation sent! (Demo Mode)' : 'Booking confirmation sent successfully!',
                demoMode: smsResult.demoMode,
                messageId: smsResult.messageId,
                balance: smsResult.balance,
                cost: smsResult.cost
            });
        } else {
            throw new Error(smsResult.message || 'Failed to send booking confirmation');
        }

    } catch (error) {
        console.error('Booking SMS send error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            status: error.status,
            stack: error.stack,
            name: error.name
        });

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to send booking confirmation. Please try again.'
            },
            { status: 500 }
        );
    }
}
