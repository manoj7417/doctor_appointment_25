import { NextResponse } from 'next/server';
import otpStore from '@/lib/otpStore';

export async function POST(req) {
    try {
        const { phone, code } = await req.json();

        if (!phone || !code) {
            return NextResponse.json(
                { success: false, message: 'Phone number and OTP code are required' },
                { status: 400 }
            );
        }

        // Clean phone number (remove +91 if present)
        const cleanPhone = phone.replace(/^\+91/, '');
        const storedOtp = otpStore.get(cleanPhone);

        if (!storedOtp) {
            return NextResponse.json(
                { success: false, message: 'OTP expired or not found. Please request a new OTP.' },
                { status: 400 }
            );
        }

        // Check if OTP is expired (10 minutes)
        const now = Date.now();
        if (now - storedOtp.timestamp > 10 * 60 * 1000) {
            otpStore.delete(cleanPhone);
            return NextResponse.json(
                { success: false, message: 'OTP expired. Please request a new OTP.' },
                { status: 400 }
            );
        }

        // Check if OTP matches
        if (storedOtp.code === code) {
            // Remove OTP after successful verification
            otpStore.delete(cleanPhone);
            return NextResponse.json({
                success: true,
                message: 'OTP verified successfully!'
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid OTP code' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('OTP verification error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to verify OTP. Please try again.'
            },
            { status: 500 }
        );
    }
}
