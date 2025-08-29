import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import bcrypt from "bcryptjs";
import { generateDoctorSlug } from "@/lib/utils";

export async function POST(req) {
    try {
        await connectDB();

        // Use a unique domain to avoid conflicts
        const testDomain = "drjane-test.com";
        const testEmail = "drjane@test.com";

        // Check if test doctor already exists by email or domain
        const existingDoctor = await doctorModel.findOne({
            $or: [
                { email: testEmail },
                { domain: testDomain }
            ]
        });

        if (existingDoctor) {
            return NextResponse.json({
                message: "Test doctor already exists",
                doctor: {
                    _id: existingDoctor._id,
                    name: existingDoctor.name,
                    email: existingDoctor.email,
                    domain: existingDoctor.domain,
                    slug: existingDoctor.slug
                }
            });
        }

        const hashedPassword = await bcrypt.hash("test123", 10);

        // Create test doctor with custom domain
        const doctor = await doctorModel.create({
            name: "Dr. Jane Wilson",
            email: testEmail,
            phone: "+91-9876543211",
            address: "456 Medical Center, Delhi, India",
            password: hashedPassword,
            image: "/doc2.png",
            specialization: "Dermatology",
            experience: 12,
            degree: "MBBS, MD (Dermatology)",
            hospital: "Skin Care Hospital",
            about: "Dr. Jane Wilson is a renowned dermatologist with over 12 years of experience in treating various skin conditions. She specializes in cosmetic dermatology, skin cancer treatment, and general dermatological care. Dr. Wilson is known for her gentle approach and commitment to patient care.",
            price: 1200,
            services: [
                "Skin Consultation",
                "Acne Treatment",
                "Skin Cancer Screening",
                "Cosmetic Procedures",
                "Allergy Testing",
                "Hair Loss Treatment"
            ],
            availability: ["Tue", "Thu", "Fri", "Sat"],
            slots: {
                "Tue": ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
                "Thu": ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
                "Fri": ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
                "Sat": ["10:00", "11:00", "12:00"]
            },
            hasWebsite: true,
            websiteUrl: `https://${testDomain}`,
            domain: testDomain,
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

        // Handle duplicate key error specifically
        if (error.code === 11000) {
            return NextResponse.json({
                message: "Test doctor already exists (duplicate domain or email)",
                error: "Duplicate key error - doctor with this domain or email already exists"
            }, { status: 409 });
        }

        return NextResponse.json({
            message: "Error creating test doctor",
            error: error.message
        }, { status: 500 });
    }
}
