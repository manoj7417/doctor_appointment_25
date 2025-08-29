import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import bcrypt from "bcryptjs";
import { generateDoctorSlug } from "@/lib/utils";

export async function POST(req) {
    try {
        await connectDB();

        // Check if test doctor already exists
        const existingDoctor = await doctorModel.findOne({ email: "drjohn@test.com" });
        if (existingDoctor) {
            return NextResponse.json({
                message: "Test doctor already exists",
                doctor: existingDoctor
            });
        }

        const hashedPassword = await bcrypt.hash("test123", 10);

        // Create test doctor with custom domain
        const doctor = await doctorModel.create({
            name: "Dr. John Smith",
            email: "drjohn@test.com",
            phone: "+91-9876543210",
            address: "123 Medical Center, Mumbai, Maharashtra",
            password: hashedPassword,
            image: "/doc1.png",
            specialization: "Cardiology",
            experience: 15,
            degree: "MBBS, MD (Cardiology)",
            hospital: "City Heart Hospital",
            about: "Dr. John Smith is a highly experienced cardiologist with over 15 years of practice. He specializes in interventional cardiology and has performed thousands of successful procedures. Dr. Smith is known for his compassionate care and commitment to patient well-being.",
            price: 1500,
            services: [
                "ECG",
                "Echocardiography",
                "Stress Test",
                "Angioplasty",
                "Cardiac Consultation",
                "Heart Disease Treatment"
            ],
            availability: ["Mon", "Wed", "Fri", "Sat"],
            slots: {
                "Mon": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
                "Wed": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
                "Fri": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
                "Sat": ["09:00", "10:00", "11:00"]
            },
            hasWebsite: true,
            websiteUrl: "https://drjohn.com",
            domain: "drjohn.com",
            virtualConsultation: true,
            inPersonConsultation: true,
            status: "approved",
        });

        // Generate and save slug
        const slug = generateDoctorSlug(doctor.name, doctor._id.toString());
        await doctorModel.findByIdAndUpdate(doctor._id, { slug });

        return NextResponse.json({
            message: "Test doctor created successfully",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                domain: doctor.domain,
                slug: slug
            }
        });

    } catch (error) {
        console.error("Error creating test doctor:", error);
        return NextResponse.json({
            message: "Error creating test doctor",
            error: error.message
        }, { status: 500 });
    }
}
