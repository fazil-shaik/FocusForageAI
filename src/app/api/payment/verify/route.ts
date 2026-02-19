// @ts-nocheck

import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Initialize Cashfree (Should be in a shared config file ideally)
// Initialize Cashfree (Should be in a shared config file ideally)
try {
    (Cashfree as any).XClientId = process.env.CASHFREE_APP_ID;
    (Cashfree as any).XClientSecret = process.env.CASHFREE_SECRET_KEY;
    (Cashfree as any).XEnvironment = 1; // SANDBOX = 1
} catch (e) {
    console.warn("Cashfree initialization failed:", e);
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=missing_order_id`);
    }

    try {
        // 1. Fetch Order Status from Cashfree
        const cashfree = new Cashfree();
        const response = await cashfree.PGFetchOrder("2023-08-01", orderId);
        const order = response.data;

        // 2. Check Payment Status
        if (order.order_status === "PAID") {
            // 3. Update User Plan in Database
            const userId = order.customer_details?.customer_id;

            if (userId) {
                await db.update(users)
                    .set({ plan: "pro" })
                    .where(eq(users.id, userId));
            }

            // 4. Redirect to Success Page
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`);
        } else {
            // Payment Failed or Pending
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=payment_failed`);
        }

    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=verification_error`);
    }
}
