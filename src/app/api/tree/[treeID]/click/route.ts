import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { trees, links, tree_analytics } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

interface RouteParams {
    params: Promise<{
        treeID: string;
    }>;
}

// POST - Track link click
export async function POST(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { treeID } = await params;
        const body = await request.json();
        const { linkId } = body;

        if (!treeID || !linkId) {
            return NextResponse.json(
                { success: false, error: "Slug and linkId are required" },
                { status: 400 }
            );
        }

        // Verify the link belongs to the tree and is active
        const linkResult = await db
            .select({
                id: links.id,
                treeId: links.treeId,
                url: links.url,
                isActive: links.isActive,
            })
            .from(links)
            .innerJoin(trees, eq(trees.id, links.treeId))
            .where(
                and(
                    eq(trees.slug, treeID),
                    eq(links.id, linkId),
                    eq(links.isActive, true),
                    eq(trees.isPublic, true),
                    eq(trees.isActive, true)
                )
            )
            .limit(1);

        if (linkResult.length === 0) {
            return NextResponse.json(
                { success: false, error: "Link not found or inactive" },
                { status: 404 }
            );
        }

        const link = linkResult[0];

        // Track click
        await trackClick(request, link.treeId, linkId);

        return NextResponse.json({
            success: true,
            url: link.url,
        });

    } catch (error) {
        console.error("Error tracking click:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Helper function to track clicks
async function trackClick(request: NextRequest, treeId: string, linkId: string) {
    try {
        const headersList = await headers();
        const ipAddress = getClientIP(request, headersList);
        const userAgent = headersList.get("user-agent") || "";
        const referer = headersList.get("referer") || "";

        // Insert analytics record
        await db.insert(tree_analytics).values({
            treeId,
            linkId,
            eventType: "click",
            ipAddress,
            userAgent,
            referer,
        });

        // Increment click count for the link
        await db
            .update(links)
            .set({
                clickCount: db.$count(tree_analytics, and(
                    eq(tree_analytics.linkId, linkId),
                    eq(tree_analytics.eventType, "click")
                )),
                updatedAt: new Date(),
            })
            .where(eq(links.id, linkId));

    } catch (error) {
        console.error("Error tracking click:", error);
        // Don't throw error for analytics failure
    }
}

// Helper function to get client IP
function getClientIP(request: NextRequest, headersList: Headers): string {
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIP = headersList.get("x-real-ip");
    const cfConnectingIP = headersList.get("cf-connecting-ip");

    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    if (cfConnectingIP) {
        return cfConnectingIP;
    }

    return "unknown";
}
