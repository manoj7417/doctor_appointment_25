import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    try {
        // Fetch all doctors with complete data, excluding only password
        const allDoctors = await doctorModel
            .find({})
            .select("-password")
            .lean(); // Use lean() for better performance with large datasets

        console.log("All doctors in database:", allDoctors.map(d => ({
            name: d.name,
            status: d.status,
            id: d._id,
            specialization: d.specialization,
            experience: d.experience,
            hospital: d.hospital,
            price: d.price,
            availability: d.availability,
            services: d.services,
            about: d.about,
            image: d.image
        })));

        // Sort by name
        const doctors = allDoctors.sort((a, b) => a.name.localeCompare(b.name));

        console.log("Fetched doctors for display:", doctors.map(d => ({
            name: d.name,
            status: d.status,
            id: d._id,
            specialization: d.specialization,
            experience: d.experience,
            hospital: d.hospital,
            price: d.price,
            availability: d.availability,
            services: d.services,
            about: d.about,
            image: d.image
        })));

        return NextResponse.json({
            success: true,
            doctors,
            totalCount: doctors.length,
            message: `Found ${doctors.length} doctors`
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching doctors", error: error.message },
            { status: 500 }
        );
    }
}
