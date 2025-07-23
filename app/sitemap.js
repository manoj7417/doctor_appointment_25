import doctorModel from "@/models/doctorModel";
import { connectDB } from "@/lib/dbConfig";
import { generateDoctorSlug } from "@/lib/utils";

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/find-doctor`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/doctor-homepage`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
    ];

    try {
        await connectDB();

        // Fetch all doctors
        const doctors = await doctorModel.find({ status: "approved" }).select("name _id updatedAt");

        // Generate doctor pages
        const doctorPages = doctors.map((doctor) => ({
            url: `${baseUrl}/doctors/${generateDoctorSlug(doctor.name, doctor._id.toString())}`,
            lastModified: doctor.updatedAt || new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        }));

        return [...staticPages, ...doctorPages];
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return staticPages;
    }
} 