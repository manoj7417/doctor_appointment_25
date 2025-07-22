import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import doctorModel from "@/models/doctorModel";
import { connectDB } from "@/lib/dbConfig";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        await connectDB();

        // Find doctor by email
        const doctor = await doctorModel.findOne({ email }).select('+password');

        if (!doctor) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        // Make sure password field exists
        if (!doctor.password) {
            return NextResponse.json({ message: "Doctor password not set" }, { status: 400 });
        }

        // Check password match
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        // Create JWT token with doctor id and status
        const token = jwt.sign(
            { doctorId: doctor._id, status: doctor.status },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Set HTTP-only cookie with the token
        const response = NextResponse.json({
            message: "Doctor login successful",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                address: doctor.address,
                image: doctor.image,
                status: doctor.status,
                specialization: doctor.specialization,
                experience: doctor.experience,
                degree: doctor.degree,
                hospital: doctor.hospital,
                price: doctor.price,
                about: doctor.about,
                services: doctor.services,
                availability: doctor.availability,
                slots: doctor.slots,
                virtualConsultation: doctor.virtualConsultation,
                inPersonConsultation: doctor.inPersonConsultation,
                hasWebsite: doctor.hasWebsite,
                websiteUrl: doctor.websiteUrl,
            },
        });

        response.cookies.set({
            name: "doctorToken",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Doctor login error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
