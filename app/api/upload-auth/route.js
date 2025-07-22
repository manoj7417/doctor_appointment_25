// app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
    try {
        // Validate environment variables
        if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_PUBLIC_KEY) {
            throw new Error("ImageKit environment variables not configured");
        }

        // Generate upload authentication parameters
        const { token, expire, signature } = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        });

        return Response.json({
            token,
            expire,
            signature,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        });
    } catch (error) {
        console.error("Upload auth error:", error);
        return Response.json(
            { error: "Failed to generate upload credentials" },
            { status: 500 }
        );
    }
}