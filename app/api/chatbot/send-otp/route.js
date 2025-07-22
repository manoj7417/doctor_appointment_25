import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        console.log('=== OTP Send Request Started ===');

        // Log the request details
        console.log('Request method:', req.method);
        console.log('Request headers:', Object.fromEntries(req.headers.entries()));

        const { phone } = await req.json();
        console.log('Received phone:', phone);

        if (!phone) {
            console.log('Phone number is required');
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
                { status: 400 }
            );
        }

        // Initialize Twilio client inside the function
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

        console.log('Environment variables check:');
        console.log('Account SID:', accountSid ? 'Present' : 'Missing');
        console.log('Auth Token:', authToken ? 'Present' : 'Missing');
        console.log('Verify Service SID:', verifyServiceSid ? 'Present' : 'Missing');

        if (!accountSid || !authToken || !verifyServiceSid) {
            console.error('Missing Twilio environment variables');
            console.error('Account SID length:', accountSid?.length || 0);
            console.error('Auth Token length:', authToken?.length || 0);
            console.error('Verify Service SID length:', verifyServiceSid?.length || 0);
            return NextResponse.json(
                { success: false, message: 'SMS service configuration error' },
                { status: 500 }
            );
        }

        console.log('Initializing Twilio client...');
        const twilioClient = require("twilio")(accountSid, authToken);
        console.log('Twilio client initialized successfully');
        console.log('Sending OTP to:', `+91${phone}`);

        // Generate a simple 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000);
        console.log('Generated OTP:', otpCode);

        // DEMO MODE: Simulate SMS sending (Twilio account suspended)
        console.log('DEMO MODE: Simulating SMS sending...');
        console.log('DEMO MODE: OTP Code:', otpCode);
        console.log('DEMO MODE: Would send to:', `+91${phone}`);

        // Simulate a delay like real SMS
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('DEMO MODE: SMS simulation completed');

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully! (Demo Mode)',
            otpCode: otpCode, // For testing purposes only
            demoMode: true
        });

    } catch (error) {
        console.error('OTP send error:', error);
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
                message: 'Failed to send OTP. Please try again.'
            },
            { status: 500 }
        );
    }
}
