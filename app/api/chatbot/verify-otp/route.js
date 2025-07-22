import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        console.log('=== OTP Verification Started ===');

        const { phone, code } = await req.json();
        console.log('Received phone:', phone);
        console.log('Received code:', code);

        if (!phone || !code) {
            console.log('Missing phone or code');
            return NextResponse.json(
                { success: false, message: 'Phone number and OTP code are required' },
                { status: 400 }
            );
        }

        console.log('Verifying OTP for:', `+91${phone}`);

        // DEMO MODE: Accept any 6-digit code for testing
        if (code && code.length === 6 && /^\d{6}$/.test(code)) {
            console.log('DEMO MODE: OTP verification successful');
            return NextResponse.json({
                success: true,
                message: 'OTP verified successfully! (Demo Mode)'
            });
        }

        console.log('DEMO MODE: OTP verification failed - invalid code');
        return NextResponse.json(
            { success: false, message: 'Invalid OTP code' },
            { status: 400 }
        );

    } catch (error) {
        console.error('OTP verification error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            status: error.status
        });

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to verify OTP. Please try again.'
            },
            { status: 500 }
        );
    }
}
