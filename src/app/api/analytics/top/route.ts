import { db } from "@/database/drizzle";
import { urls } from "@/database/schema";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const sp = req.nextUrl.searchParams;
    const userID = sp.get("userID");

    if (!userID) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await db
        .select({ clicks: urls.clicks, unique: urls.dailyUniqueVisitors, short: urls.shortUrl, original: urls.originalUrl, bounce: urls.bounceRate })
        .from(urls).orderBy(sql`urls.clicks DESC`).limit(5);

    return NextResponse.json(data);
}