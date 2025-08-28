import { NextResponse } from 'next/server';
import bulkSmsService from '@/lib/bulkSmsService';

export async function POST(req) {
    try {
        const { phone, message } = await req.json();

        if (!phone) {
            return NextResponse.json(
                { success: false, message: 'Phone number is required' },
                { status: 400 }
            );
        }

        if (!message) {
            return NextResponse.json(
                { success: false, message: 'Message is required' },
                { status: 400 }
            );
        }

        console.log('🧪 Testing SMS sending to:', phone);
        console.log('🧪 Message:', message);

        // Test SMS sending
        const result = await bulkSmsService.sendSms(phone, message);

        console.log('🧪 SMS Test Result:', result);

        return NextResponse.json({
            success: true,
            result: result,
            config: {
                apiId: process.env.BULKSMS_API_ID ? 'Set' : 'Not Set',
                apiPassword: process.env.BULKSMS_API_PASSWORD ? 'Set' : 'Not Set',
                senderId: process.env.BULKSMS_SENDER_ID || 'MEDICAL',
                nodeEnv: process.env.NODE_ENV
            }
        });

    } catch (error) {
        console.error('🧪 SMS Test Error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error.message,
                config: {
                    apiId: process.env.BULKSMS_API_ID ? 'Set' : 'Not Set',
                    apiPassword: process.env.BULKSMS_API_PASSWORD ? 'Set' : 'Not Set',
                    senderId: process.env.BULKSMS_SENDER_ID || 'MEDICAL',
                    nodeEnv: process.env.NODE_ENV
                }
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return configuration status (without sensitive data)
    return NextResponse.json({
        success: true,
        config: {
            apiId: process.env.BULKSMS_API_ID ? 'Set' : 'Not Set',
            apiPassword: process.env.BULKSMS_API_PASSWORD ? 'Set' : 'Not Set',
            senderId: process.env.BULKSMS_SENDER_ID || 'MEDICAL',
            nodeEnv: process.env.NODE_ENV,
            baseUrl: 'https://www.bulksmsplans.com'
        }
    });
}
