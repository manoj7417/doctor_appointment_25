import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        console.log('=== SMS Test Started ===');

        const { phone } = await req.json();
        console.log('Test phone:', phone);

        if (!phone) {
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
                { status: 400 }
            );
        }

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        console.log('Environment check:');
        console.log('Account SID:', accountSid ? 'Present' : 'Missing');
        console.log('Auth Token:', authToken ? 'Present' : 'Missing');

        if (!accountSid || !authToken) {
            return NextResponse.json(
                { success: false, message: 'Twilio credentials missing' },
                { status: 500 }
            );
        }

        const twilioClient = require("twilio")(accountSid, authToken);

        console.log('Sending test SMS to:', `+91${phone}`);

        const testMessage = await twilioClient.messages.create({
            body: 'This is a test SMS from your medical booking app. If you receive this, SMS is working!',
            from: '+19204813393',
            to: `+91${phone}`,
        });

        console.log('Test SMS sent successfully:', testMessage.sid);

        return NextResponse.json({
            success: true,
            message: 'Test SMS sent successfully!',
            sid: testMessage.sid
        });

    } catch (error) {
        console.error('SMS test error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            status: error.status
        });

        return NextResponse.json(
            {
                success: false,
                message: 'SMS test failed: ' + error.message
            },
            { status: 500 }
        );
    }
} 