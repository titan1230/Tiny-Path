import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { nanoid } from "nanoid";

import { db } from "@/database/drizzle";
import { urls } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import { anonRatelimit, ratelimit } from "@/lib/ratelimit";


// POST - Create new URL
export async function POST(request: NextRequest) {
    try {
        const sp = request.nextUrl.searchParams;
        const userID = sp.get("userID");

        const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";

        const { success } = userID ? await ratelimit.limit(ip) : await anonRatelimit.limit(ip);

        if (!success) return NextResponse.json(
            { error: "Rate limit exceeded" },
            { status: 429 }
        );

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
                userId: userID || null,
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