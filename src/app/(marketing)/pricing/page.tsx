"use client";

import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { PricingCard } from "@/components/marketing/PricingCard";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function PricingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            // 0. Check for auth (Frontend check, backend also checks)
            // But we need to know if user is logged in to redirect.
            // Ideally we check session on mount or simple fetch.
            // For now, let's rely on the API 401 response to redirect.

            // 1. Create Order
            const response = await fetch("/api/payment/create-order", {
                method: "POST",
            });

            if (response.status === 401) {
                router.push("/signin?redirect=/pricing"); // Add redirect param if desired
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create order");
            }

            // 2. Load Cashfree SDK
            const cashfree = await load({
                mode: "sandbox", // Switch to "production" for live
            });

            // 3. Initiate Checkout
            const checkoutOptions = {
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_self" as const, // Or "_blank" or "_modal"? Using _self for full page redirect is standard for some flows, but sticking to basics. 
                // Actually, for redirect flow, returnUrl in createOrder handles the redirect.
                // For popup, we might use "drop" or simple checkout. 
                // With redirectTarget: "_self", it will redirect to payment page.
            };

            cashfree.checkout(checkoutOptions);

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Payment initiation failed. Please try again. (Make sure API keys are set)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans pt-20 pb-20">
            <BackgroundBeams className="opacity-20" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Invest in your <span className="text-primary">Focus</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Simple pricing for powerful productivity. Upgrade to unlock the full potential of your brain.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <PricingCard
                        title="Free"
                        price="₹0"
                        description="Perfect for getting started with mindful productivity."
                        features={[
                            "3 Focus Sessions per day",
                            "Basic Focus Timer",
                            "Limited AI suggestions",
                            "Daily tasks overview",
                            "Standard themes"
                        ]}
                    />
                    <PricingCard
                        title="Pro"
                        price="₹499"
                        description="For serious deep workers who want to master their flow."
                        features={[
                            "Unlimited Focus Sessions",
                            "Advanced AI Behavior Analysis",
                            "Weekly Productivity Reports",
                            "Smart AI Scheduling",
                            "Emotional Adaptation Engine",
                            "Priority Support"
                        ]}
                        isPro={true}
                        onSelect={handleCheckout}
                        isLoading={loading}
                    />
                </div>

                <div className="mt-16 text-center text-muted-foreground text-sm">
                    <p>Secured by Cashfree Payments. Cancel anytime.</p>
                </div>
            </div>
        </div>
    );
}
