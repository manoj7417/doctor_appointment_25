import { NextResponse } from "next/server";
import doctorModel from "@/models/doctorModel";
import { connectDB } from "@/lib/dbConfig";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { doctorId } = await params;

        if (!doctorId) {
            return NextResponse.json(
                { success: false, message: "Doctor ID is required" },
                { status: 400 }
            );
        }

        const doctor = await doctorModel.findById(doctorId).select("-password");

        if (!doctor) {
            return NextResponse.json(
                { success: false, message: "Doctor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            doctor,
        });
    } catch (error) {
        console.error("Error fetching doctor:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
} 