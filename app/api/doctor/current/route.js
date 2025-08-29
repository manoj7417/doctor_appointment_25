import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import doctorModel from "@/models/doctorModel";
import { connectDB } from "@/lib/dbConfig";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
    try {
        await connectDB();

        // Get doctor ID from cookies
        const token = req.cookies.get('doctorToken')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required' },
                { status: 401 }
            );
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        const doctorId = decoded?.doctorId;

        if (!doctorId) {
            return NextResponse.json(
                { success: false, message: 'Doctor ID not found in token' },
                { status: 401 }
            );
        }

        // Fetch doctor data
        const doctor = await doctorModel.findById(doctorId);

        if (!doctor) {
            return NextResponse.json(
                { success: false, message: 'Doctor not found' },
                { status: 404 }
            );
        }

        // Return doctor data without password
        const doctorData = {
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
            domain: doctor.domain,
        };

        return NextResponse.json({
            success: true,
            doctor: doctorData
        });

    } catch (error) {
        console.error("Get current doctor error:", error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
} 