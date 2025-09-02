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

        // Check if we're in demo mode (no API credentials or force demo mode)
        const forceDemoMode = process.env.FORCE_DEMO_MODE === 'true';
        const isDemoMode = forceDemoMode || !process.env.BULKSMS_API_ID;

        let smsResult;

        if (isDemoMode) {
            // Demo mode - simulate successful SMS
            console.log('📱 DEMO MODE: Simulating SMS for phone:', phone);
            smsResult = {
                success: true,
                message: 'Demo mode - OTP sent successfully',
                data: { message_id: 'demo_' + Date.now() }
            };
        } else {
            console.log('📱 PRODUCTION MODE: Sending real SMS via BulkSMS for phone:', phone);
            // Send OTP using BulkSMS (phone already has +91 from frontend)
            smsResult = await bulkSmsService.sendOtp(phone, otpCode.toString());
        }

        if (smsResult.success) {
            // Store OTP for verification (use clean phone without +91 for storage)
            const cleanPhone = phone.replace(/^\+91/, '');
            otpStore.set(cleanPhone, {
                code: otpCode.toString(),
                timestamp: Date.now()
            });

            // Also store with the original phone format as a backup
            otpStore.set(phone, {
                code: otpCode.toString(),
                timestamp: Date.now()
            });

            return NextResponse.json({
                success: true,
                message: 'OTP sent successfully!',
                messageId: smsResult.data?.message_id,
                demoMode: isDemoMode,
                otpCode: isDemoMode ? otpCode.toString() : undefined
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
