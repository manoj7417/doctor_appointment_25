import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import bcrypt from "bcryptjs";
import { generateDoctorSlug } from "@/lib/utils";

export async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    const {
        name,
        email,
        phone,
        address,
        password,
        image,
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
        domain,
        virtualConsultation,
        inPersonConsultation
    } = body;

    if (!name || !email || !phone || !address || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    try {
        await connectDB();

        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return NextResponse.json({ message: "Doctor already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const doctor = await doctorModel.create({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            image,
            specialization,
            experience,
            degree,
            hospital,
            about,
            price,
            services,
            availability,
            slots,
            hasWebsite: hasWebsite || false,
            websiteUrl: hasWebsite ? websiteUrl : null,
            domain: hasWebsite ? domain : null,
            virtualConsultation: virtualConsultation || false,
            inPersonConsultation: inPersonConsultation || false,
            status: "pending",
        });

        // Generate and save slug
        const slug = generateDoctorSlug(doctor.name, doctor._id.toString());
        await doctorModel.findByIdAndUpdate(doctor._id, { slug });

        return NextResponse.json({
            message: "Doctor registered successfully",
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
            }
        }, { status: 201 });
    } catch (error) {
        console.error("Doctor registration error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
