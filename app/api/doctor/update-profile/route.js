// /app/api/doctor/update-profile/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import { generateDoctorSlug } from "@/lib/utils";

export async function PUT(request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            phone,
            address,
            specialization,
            experience,
            degree,
            hospital,
            price,
            about,
            services,
            availability,
            slots,
            hasWebsite,
            websiteUrl,
            virtualConsultation,
            inPersonConsultation,
            image,
        } = body;

        await connectDB();

        // Find the doctor by email (assuming email is unique)
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return NextResponse.json(
                { success: false, message: "Doctor not found" },
                { status: 404 }
            );
        }

        // Update the doctor profile
        const updateData = {
            name: name || doctor.name,
            email: email || doctor.email,
            phone: phone || doctor.phone,
            address: address || doctor.address,
            specialization: specialization || doctor.specialization,
            experience: experience || doctor.experience,
            degree: degree || doctor.degree,
            hospital: hospital || doctor.hospital,
            price: price || doctor.price,
            about: about || doctor.about,
            services: services || doctor.services,
            availability: availability || doctor.availability,
            slots: slots || doctor.slots,
            hasWebsite: hasWebsite !== undefined ? hasWebsite : doctor.hasWebsite,
            websiteUrl: hasWebsite ? websiteUrl : doctor.websiteUrl,
            virtualConsultation: virtualConsultation !== undefined ? virtualConsultation : doctor.virtualConsultation,
            inPersonConsultation: inPersonConsultation !== undefined ? inPersonConsultation : doctor.inPersonConsultation,
            image: image || doctor.image,
            status: "approved", // Mark as approved when profile is complete
        };

        // Generate slug if name changed
        if (name && name !== doctor.name) {
            updateData.slug = generateDoctorSlug(name, doctor._id.toString());
        }

        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctor._id,
            updateData,
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            doctor: updatedDoctor,
        });
    } catch (error) {
        console.error("Error updating doctor profile:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update profile" },
            { status: 500 }
        );
    }
}