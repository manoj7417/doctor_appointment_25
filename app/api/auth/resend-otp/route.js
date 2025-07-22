// app/api/resend-otp/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import userModel from "@/models/userModel";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const twilioClient = require("twilio")(accountSid, authToken);

export async function POST(req) {
    try {
        const { phone } = await req.json();

        await connectDB();

        const user = await userModel.findOne({ phone });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.phoneVerified) {
            return NextResponse.json({ message: "Phone already verified" }, { status: 400 });
        }

        const otpResult = await twilioClient.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: `+91${phone}`, channel: "sms" });

        return NextResponse.json({ message: "OTP resent", otpStatus: otpResult.status });

    } catch (error) {
        console.error("Resend OTP error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
