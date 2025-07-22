// File: app/api/razorpay/verify-payment/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
    try {
        // Parse the request body
        const body = await request.json();

        // Validate required fields
        if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
            return NextResponse.json(
                { message: "Missing required payment verification parameters" },
                { status: 400 }
            );
        }

        // Create the string to be hashed for verification
        const text = `${body.razorpay_order_id}|${body.razorpay_payment_id}`;

        // Create HMAC SHA256 hash using the Razorpay secret key
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(text)
            .digest("hex");

        // Verify if the signatures match
        const isSignatureValid = generatedSignature === body.razorpay_signature;

        if (!isSignatureValid) {
            return NextResponse.json(
                { message: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // If signature is valid, payment is verified
        // Here you could update your database to mark the payment as successful

        // Return successful response
        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
            orderId: body.razorpay_order_id,
            paymentId: body.razorpay_payment_id,
        });
    } catch (error) {
        console.error("Error verifying Razorpay payment:", error);

        // Return error response
        return NextResponse.json(
            { message: error.message || "Failed to verify payment" },
            { status: 500 }
        );
    }
}