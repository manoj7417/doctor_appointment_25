import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import bcrypt from "bcryptjs";
import { generateDoctorSlug } from "@/lib/utils";

export async function POST(req) {
    try {
        await connectDB();

        // Use the shankarpolyclinic.com domain
        const testDomain = "www.shankarpolyclinic.com";
        const testEmail = "dr.shankar@shankarpolyclinic.com";

        // Check if test doctor already exists by email or domain
        const existingDoctor = await doctorModel.findOne({
            $or: [
                { email: testEmail },
                { domain: testDomain }
            ]
        });

        if (existingDoctor) {
            return NextResponse.json({
                message: "Shankar doctor already exists",
                doctor: {
                    _id: existingDoctor._id,
                    name: existingDoctor.name,
                    email: existingDoctor.email,
                    domain: existingDoctor.domain,
                    slug: existingDoctor.slug,
                    status: existingDoctor.status
                }
            });
        }

        const hashedPassword = await bcrypt.hash("shankar123", 10);

        // Create test doctor with shankarpolyclinic.com domain
        const doctor = await doctorModel.create({
            name: "Dr. Shankar",
            email: testEmail,
            phone: "+91-9876543210",
            address: "Shankar Polyclinic, Main Street, City, India",
            password: hashedPassword,
            image: "/doc1.png",
            specialization: "General Medicine",
            experience: 15,
            degree: "MBBS, MD (General Medicine)",
            hospital: "Shankar Polyclinic",
            about: "Dr. Shankar is a highly experienced general physician with over 15 years of practice. He specializes in preventive care, chronic disease management, and general health consultations. Dr. Shankar is known for his patient-centered approach and commitment to providing quality healthcare.",
            price: 800,
            services: [
                "General Consultation",
                "Health Checkup",
                "Chronic Disease Management",
                "Preventive Care",
                "Vaccination",
                "Health Counseling"
            ],
            availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            slots: {
                "Mon": ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
                "Tue": ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
                "Wed": ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
                "Thu": ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
                "Fri": ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
                "Sat": ["09:00", "10:00", "11:00", "12:00"]
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
            message: "Shankar doctor created successfully",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                domain: doctor.domain,
                slug: slug,
                status: doctor.status
            }
        });

    } catch (error) {
        console.error("Error creating Shankar doctor:", error);
        return NextResponse.json({
            message: "Error creating doctor",
            error: error.message
        }, { status: 500 });
    }
}
