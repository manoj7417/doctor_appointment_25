import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";

export async function GET(req) {
    try {
        await connectDB();
        
        // Get all doctors with their domain information
        const doctors = await doctorModel.find({}).select('name email domain hasWebsite websiteUrl status');
        
        return NextResponse.json({
            message: "Doctors retrieved successfully",
            count: doctors.length,
            doctors: doctors
        });
        
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json({ 
            message: "Server error" 
        }, { status: 500 });
    }
}
