// app/api/verify-otp/route.js
import { connectDB } from '@/lib/dbConfig';
import userModel from '@/models/userModel';
import twilio from 'twilio';


const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export async function POST(request) {
    try {
        const body = await request.json();
        const { phone, code } = body;

        if (!phone || !code) {
            return new Response(JSON.stringify({ message: "Phone and code are required" }), { status: 400 });
        }

        const verificationCheck = await client.verify.v2
            .services(verifyServiceSid)
            .verificationChecks.create({
                to: `+91${phone}`,
                code,
            });

        if (verificationCheck.status === 'approved') {
            await connectDB(); // ensure DB connection
            const user = await userModel.findOne({ phone });
            if (user) {
                user.phoneVerified = true;
                await user.save();
            }
            return new Response(JSON.stringify({ message: 'Phone number verified' }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: 'Invalid or expired OTP' }), { status: 400 });
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
        return new Response(JSON.stringify({ message: 'Failed to verify OTP' }), { status: 500 });
    }
}
