import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('=== Twilio Environment Test ===');

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

        console.log('Environment variables:');
        console.log('Account SID:', accountSid ? 'Present' : 'Missing');
        console.log('Auth Token:', authToken ? 'Present' : 'Missing');
        console.log('Verify Service SID:', verifyServiceSid ? 'Present' : 'Missing');

        if (!accountSid || !authToken || !verifyServiceSid) {
            return NextResponse.json({
                success: false,
                message: 'Missing Twilio environment variables',
                details: {
                    accountSid: !!accountSid,
                    authToken: !!authToken,
                    verifyServiceSid: !!verifyServiceSid
                }
            }, { status: 500 });
        }

        // Test Twilio client initialization
        try {
            const twilioClient = require("twilio")(accountSid, authToken);
            console.log('Twilio client initialized successfully');

            return NextResponse.json({
                success: true,
                message: 'Twilio configuration is correct',
                details: {
                    accountSid: accountSid.substring(0, 10) + '...',
                    authToken: authToken.substring(0, 10) + '...',
                    verifyServiceSid: verifyServiceSid.substring(0, 10) + '...'
                }
            });
        } catch (twilioError) {
            console.error('Twilio client initialization failed:', twilioError);
            return NextResponse.json({
                success: false,
                message: 'Twilio client initialization failed',
                error: twilioError.message
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Test endpoint error:', error);
        return NextResponse.json({
            success: false,
            message: 'Test endpoint error',
            error: error.message
        }, { status: 500 });
    }
} 