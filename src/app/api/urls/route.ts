import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { urls } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// POST - Create new URL
export async function POST(request: NextRequest) {
    try {
        const sp = request.nextUrl.searchParams;
        const userID = sp.get("userID");

        if (!userID) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const body = await request.json();
        const { originalUrl, urlType, expiresAt } = body;

        if (!originalUrl) {
            return NextResponse.json(
                { error: "Original URL is required" },
                { status: 400 }
            );
        }

        let shortUrl = urlType === "temp" ? nanoid(8) : nanoid(6);
        let attempts = 0;
        while (attempts < 10) {
            const existing = await db
                .select()
                .from(urls)
                .where(eq(urls.shortUrl, shortUrl))
                .limit(1);

            if (existing.length === 0) break;
            shortUrl = urlType === "temp" ? nanoid(8) : nanoid(6);
            attempts++;
        }

        const newUrl = await db
            .insert(urls)
            .values({
                originalUrl,
                shortUrl,
                urlType: urlType || "temp",
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                userId: userID,
            })
            .returning();

        return NextResponse.json(newUrl[0]);
    } catch (error) {
        console.error("Error creating URL:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}