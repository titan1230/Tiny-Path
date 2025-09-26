import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { analytics, urls } from "@/database/schema";
import { sql } from "drizzle-orm";

export async function GET() {
    try {
        const uniqueVisitorCounts = await db.execute(sql`
            SELECT 
                url_id, 
                COUNT(DISTINCT ip) AS dailyUniqueVisitors
            FROM ${analytics}
            GROUP BY url_id
        `);

        for (const row of uniqueVisitorCounts.rows) {

            await db
                .update(urls)
                .set({ dailyUniqueVisitors: Number(row['dailyuniquevisitors']) })
                .where(sql`${urls.id} = ${row.url_id}`);
        }

        return NextResponse.json({ message: "Unique visitors updated successfully" });
    } catch (error) {
        console.error("Error updating unique visitors:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}