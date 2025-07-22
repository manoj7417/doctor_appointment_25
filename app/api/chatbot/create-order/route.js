// File: app/api/razorpay/create-order/route.js
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
    try {
        // Parse the request body
        const body = await request.json();

        // Validate required fields
        if (!body.amount || !body.currency || !body.receipt) {
            return NextResponse.json(
                { message: "Missing required fields: amount, currency, receipt" },
                { status: 400 }
            );
        }

        // Initialize Razorpay instance with your key ID and secret
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        // Create options for order creation
        const options = {
            amount: body.amount, // amount in smallest currency unit (paise for INR)
            currency: body.currency,
            receipt: body.receipt,
            payment_capture: 1, // Auto-capture enabled
            notes: body.notes || {},
        };

        // Create order
        const order = await razorpay.orders.create(options);

        // Return successful response with order details
        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);

        // Return error response
        return NextResponse.json(
            { message: error.message || "Failed to create order" },
            { status: 500 }
        );
    }
}