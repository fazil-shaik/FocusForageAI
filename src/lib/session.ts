import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Robustly fetch the current session with retry logic to handle transient 
 * database connection issues (e.g., ECONNRESET, fetch failed).
 */
export async function getSession() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        return session;
    } catch (e) {
        console.error("Auth session fetch failed, retrying in 100ms...", e);
        // Wait 100ms and retry once
        await new Promise((resolve) => setTimeout(resolve, 100));
        try {
            const session = await auth.api.getSession({
                headers: await headers(),
            });
            return session;
        } catch (retryError) {
            console.error("Auth session fetch failed after retry:", retryError);
            throw retryError;
        }
    }
}
