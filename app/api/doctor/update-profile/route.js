// /app/api/doctor/update-profile/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function PUT(req) {
    try {
        const body = await req.json();
        const {
            specialization,
            experience,
            degree,
            hospital,
            about,
            price,
            services,
            availability,
            slots,
            hasWebsite,
            websiteUrl,
            virtualConsultation,
            inPersonConsultation
        } = body;

        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("doctorToken")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized: No token" }, { status: 401 });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
        }

        const doctorId = decoded?.doctorId;

        // Prepare the update object
        const updateData = {
            specialization,
            experience,
            degree,
            hospital,
            about,
            price,
            services,
            availability,
            slots,
            status: "approved",
            // Handle website information
            hasWebsite: hasWebsite === true || hasWebsite === "yes",
            websiteUrl: hasWebsite === true || hasWebsite === "yes" ? websiteUrl : null,
            // Handle consultation types
            virtualConsultation: virtualConsultation || false,
            inPersonConsultation: inPersonConsultation || false
        };

        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            updateData,
            { new: true }
        );

        if (!updatedDoctor) {
            return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            doctor: updatedDoctor
        });

    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}