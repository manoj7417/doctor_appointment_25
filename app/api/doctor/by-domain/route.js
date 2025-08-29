import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ 
            message: "Domain parameter is required" 
        }, { status: 400 });
    }

    try {
        await connectDB();
        console.log('🔍 Searching for doctor with domain:', domain);

        // Find doctor by domain field
        const doctor = await doctorModel.findOne({ 
            domain: domain,
            status: { $ne: "rejected" } // Exclude rejected doctors
        }).select('-password'); // Exclude password from response

        if (!doctor) {
            console.log('❌ No doctor found for domain:', domain);
            return NextResponse.json({ 
                message: "Doctor not found for this domain" 
            }, { status: 404 });
        }

        console.log('✅ Doctor found:', doctor.name);
        
        return NextResponse.json({
            message: "Doctor found successfully",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                address: doctor.address,
                image: doctor.image,
                specialization: doctor.specialization,
                experience: doctor.experience,
                degree: doctor.degree,
                hospital: doctor.hospital,
                about: doctor.about,
                price: doctor.price,
                services: doctor.services,
                availability: doctor.availability,
                slots: doctor.slots,
                status: doctor.status,
                hasWebsite: doctor.hasWebsite,
                websiteUrl: doctor.websiteUrl,
                domain: doctor.domain,
                virtualConsultation: doctor.virtualConsultation,
                inPersonConsultation: doctor.inPersonConsultation,
                slug: doctor.slug,
            }
        });

    } catch (error) {
        console.error("Error fetching doctor by domain:", error);
        return NextResponse.json({ 
            message: "Server error" 
        }, { status: 500 });
    }
}
