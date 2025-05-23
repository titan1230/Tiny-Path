import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/database/drizzle";
import { urls } from "@/database/schema";

import createDefaultDict from "@/lib/utils/defaultDict";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams;

    const userID = query.get("userID");

    if (!userID) {
        return new Response("User ID is required", { status: 400 });
    }

    const links = await db
        .select()
        .from(urls)
        .where(eq(urls.userId, userID))
        .orderBy(desc(urls.createdAt))

    console.log(links);

    if (!links) {
        return { "0": [] };
    }

    const returnData = createDefaultDict(() => []);

    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        
        returnData[i%10].push({
            id: link.id,
            originalUrl: link.originalUrl,
            shortUrl: link.shortUrl,
            clicks: link.clicks,
            createdAt: link.createdAt,
            expiresAt: link.expiresAt,
            urlType: link.urlType,
            userId: link.userId,
        });
    }

    return NextResponse.json(returnData);
}