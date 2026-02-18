
import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";
import { auth } from "@/lib/auth"; // Assuming better-auth setup
import { headers } from "next/headers";
import { db } from "@/db"; // Assuming database setup
import { eq } from "drizzle-orm";
// import { users } from "@/db/schema"; 

// Initialize Cashfree
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Switch to PRODUCTION for live

export async function POST(req: Request) {
    try {
        // 1. Get User Session
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const userEmail = session.user.email;
        const userPhone = "9999999999"; // In a real app, you'd want to get this from the user profile or ask for it. Cashfree requires phone number.

        // 2. Create Order Request
        const orderId = `order_${userId}_${Date.now()}`;
        const request = {
            order_amount: 499.00,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: userId,
                customer_email: userEmail,
                customer_phone: userPhone,
                customer_name: session.user.name || "Focus User",
            },
            order_meta: {
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify?order_id={order_id}`,
                notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
            },
            order_note: "FocusForage Pro Subscription",
        };

        // 3. Call Cashfree API
        const response = await Cashfree.PGCreateOrder("2023-08-01", request);

        // Log response for debugging (remove in production)
        // console.log("Cashfree Order Response:", response.data);

        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error("Cashfree Error:", error.response?.data?.message || error.message);
        return NextResponse.json(
            { error: error.response?.data?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
