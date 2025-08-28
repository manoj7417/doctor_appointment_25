import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    try {
        // Fetch ALL doctors (including pending, approved, etc.)
        const allDoctors = await doctorModel
            .find({})
            .select("-password")
            .lean();

        console.log("DEBUG: All doctors in database:", allDoctors);

        return NextResponse.json({
            success: true,
            doctors: allDoctors,
            totalCount: allDoctors.length,
            statusBreakdown: {
                approved: allDoctors.filter(d => d.status === "approved").length,
                pending: allDoctors.filter(d => d.status === "pending").length,
                other: allDoctors.filter(d => !["approved", "pending"].includes(d.status)).length
            },
            message: `Found ${allDoctors.length} total doctors in database`
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching doctors", error: error.message },
            { status: 500 }
        );
    }
}
