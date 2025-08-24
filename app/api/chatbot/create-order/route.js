// File: app/api/razorpay/create-order/route.js
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
    try {
        console.log('=== Razorpay Order Creation Started ===');
        
        // Parse the request body
        const body = await request.json();
        console.log('Request body:', body);

        // Validate required fields
        if (!body.amount || !body.currency || !body.receipt) {
            console.log('Missing required fields:', { amount: !!body.amount, currency: !!body.currency, receipt: !!body.receipt });
            return NextResponse.json(
                { message: "Missing required fields: amount, currency, receipt" },
                { status: 400 }
            );
        }

        // Check environment variables
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_SECRET;

        console.log('Environment check:');
        console.log('Key ID:', keyId ? `${keyId.substring(0, 10)}...` : 'Missing');
        console.log('Key Secret:', keySecret ? `${keySecret.substring(0, 10)}...` : 'Missing');

        if (!keyId || !keySecret) {
            console.error('Razorpay credentials missing');
            return NextResponse.json(
                { message: "Razorpay credentials not configured" },
                { status: 500 }
            );
        }

        // Initialize Razorpay instance with your key ID and secret
        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        console.log('Razorpay client initialized');

        // Create options for order creation
        const options = {
            amount: body.amount, // amount in smallest currency unit (paise for INR)
            currency: body.currency,
            receipt: body.receipt,
            payment_capture: 1, // Auto-capture enabled
            notes: body.notes || {},
        };

        console.log('Order options:', options);

        // Create order
        const order = await razorpay.orders.create(options);
        console.log('Order created successfully:', order.id);

        // Return successful response with order details
        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        console.error("Error details:", {
            message: error.message,
            code: error.error?.code,
            description: error.error?.description,
            source: error.error?.source,
            step: error.error?.step,
            reason: error.error?.reason,
            metadata: error.error?.metadata
        });

        // Return detailed error response
        return NextResponse.json(
            { 
                message: error.message || "Failed to create order",
                error: {
                    code: error.error?.code,
                    description: error.error?.description,
                    source: error.error?.source,
                    step: error.error?.step,
                    reason: error.error?.reason
                }
            },
            { status: 500 }
        );
    }
}