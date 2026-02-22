import { db } from "./src/db";
import { sessions } from "./src/db/schema";
import { sql } from "drizzle-orm";

async function test() {
    try {
        console.log("Testing DB connection...");
        const result = await db.execute(sql`SELECT 1`);
        console.log("Connection successful:", result);

        console.log("Checking session table...");
        const sessionCount = await db.select({ count: sql`count(*)` }).from(sessions);
        console.log("Sessions count:", sessionCount);
    } catch (error) {
        console.error("DB Test Failed:", error);
    }
}

test();
