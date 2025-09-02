import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import { generateDoctorSlug } from "@/lib/utils";

export async function POST(req) {
    try {
        await connectDB();

        // Get all doctors
        const doctors = await doctorModel.find({});

        if (doctors.length === 0) {
            return NextResponse.json({
                message: "No doctors found to update"
            });
        }

        const updatedDoctors = [];

        // Update each doctor's slug
        for (const doctor of doctors) {
            const newSlug = generateDoctorSlug(doctor.name, doctor._id.toString());

            // Only update if the slug is different
            if (newSlug !== doctor.slug) {
                await doctorModel.findByIdAndUpdate(doctor._id, { slug: newSlug });
                updatedDoctors.push({
                    _id: doctor._id,
                    name: doctor.name,
                    oldSlug: doctor.slug,
                    newSlug: newSlug
                });
            }
        }

        return NextResponse.json({
            message: "Doctor slugs updated successfully",
            updatedCount: updatedDoctors.length,
            updatedDoctors: updatedDoctors
        });

    } catch (error) {
        console.error("Error updating doctor slugs:", error);
        return NextResponse.json({
            message: "Server error",
            error: error.message
        }, { status: 500 });
    }
}
