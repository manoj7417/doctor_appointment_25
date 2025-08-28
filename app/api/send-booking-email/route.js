import { NextResponse } from 'next/server';
import emailService from '@/lib/emailService';

export async function POST(req) {
    try {
        const body = await req.json();
        const { bookingDetails, recipientEmail } = body;

        if (!bookingDetails) {
            return NextResponse.json(
                { success: false, message: 'Booking details are required' },
                { status: 400 }
            );
        }

        if (!recipientEmail) {
            return NextResponse.json(
                { success: false, message: 'Recipient email is required' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipientEmail)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Send booking confirmation email
        const result = await emailService.sendBookingConfirmation(bookingDetails, recipientEmail);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
                messageId: result.messageId,
                demoMode: result.demoMode || false
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: result.message || 'Failed to send email'
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('❌ Email sending error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to send email. Please try again.',
                error: error.message
            },
            { status: 500 }
        );
    }
}
