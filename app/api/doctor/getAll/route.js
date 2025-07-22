import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    try {
        // Fetch all doctors, you can add sorting or filtering here
        const doctors = await doctorModel.find().sort({ name: 1 }); // sort by name asc

        return NextResponse.json({ success: true, doctors }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error fetching doctors", error: error.message },
            { status: 500 }
        );
    }
}
