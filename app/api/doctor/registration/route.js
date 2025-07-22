// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/dbConfig";
// import doctorModel from "@/models/doctorModel";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//     try {
//         const body = await req.json();
//         const { firstName, lastName, email, phone, address, password } = body;

//         if (!firstName || !lastName || !email || !phone || !address || !password) {
//             return NextResponse.json({ message: "All fields are required" }, { status: 400 });
//         }

//         await connectDB();

//         // Check if doctor already exists
//         const existingDoctor = await doctorModel.findOne({ email });
//         if (existingDoctor) {
//             return NextResponse.json({ message: "Doctor already exists" }, { status: 400 });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create Doctor Profile
//         const doctor = await doctorModel.create({
//             firstName,
//             lastName,
//             email,
//             phone,
//             address,
//             password: hashedPassword,
//             status: "pending",
//         });


//         return NextResponse.json({ message: "Doctor registered successfully", doctor }, { status: 201 });
//     } catch (error) {
//         console.error("Doctor registration error:", error);
//         return NextResponse.json({ message: "Server error" }, { status: 500 });
//     }
// }





//Second approach


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConfig";
import doctorModel from "@/models/doctorModel";
import bcrypt from "bcryptjs";

export async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return NextResponse.json({ message: "Invalid JSON format" }, { status: 400 });
    }

    const { name, email, phone, address, password, image, virtualConsultation, inPersonConsultation } = body;

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
            virtualConsultation: virtualConsultation || false,
            inPersonConsultation: inPersonConsultation || false,
            status: "pending",
        });

        return NextResponse.json({
            message: "Doctor registered successfully",
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                address: doctor.address,
                image: doctor.image,
                status: doctor.status,
                virtualConsultation: doctor.virtualConsultation,
                inPersonConsultation: doctor.inPersonConsultation,
            }
        }, { status: 201 });
    } catch (error) {
        console.error("Doctor registration error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
