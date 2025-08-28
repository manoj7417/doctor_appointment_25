import { NextResponse } from 'next/server';
import bulkSmsService from '@/lib/bulkSmsService';
import otpStore from '@/lib/otpStore';

export async function POST(req) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
                { status: 400 }
            );
        }

        // Generate a simple 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000);

        // Send OTP using BulkSMS (phone already has +91 from frontend)
        const smsResult = await bulkSmsService.sendOtp(phone, otpCode.toString());

        if (smsResult.success) {
            // Store OTP for verification (use clean phone without +91 for storage)
            const cleanPhone = phone.replace(/^\+91/, '');
            otpStore.set(cleanPhone, {
                code: otpCode.toString(),
                timestamp: Date.now()
            });

            return NextResponse.json({
                success: true,
                message: 'OTP sent successfully!',
                messageId: smsResult.data?.message_id
            });
        } else {
            throw new Error(smsResult.message || 'Failed to send OTP');
        }

    } catch (error) {
        console.error('OTP send error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to send OTP. Please try again.'
            },
            { status: 500 }
        );
    }
}
