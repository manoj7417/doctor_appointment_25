// app/api/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/dbConfig";
import userModel from "@/models/userModel";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const twilioClient = require("twilio")(accountSid, authToken);

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password, phone, isAdmin } = body;

        await connectDB();

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            phoneVerified: false,
            isAdmin: isAdmin || false,
        });

        // Trigger OTP SMS via Twilio
        const otpResult = await twilioClient.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: `+91${phone}`, channel: "sms" });

        // return NextResponse.json({
        //     message: "User registered successfully. OTP sent to phone.",
        //     userId: user._id,
        //     otpStatus: otpResult.status
        // }, { status: 201 });
        return NextResponse.json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                otpStatus: otpResult.status
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
