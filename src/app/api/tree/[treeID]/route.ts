import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { trees, links, analytics, tree_analytics } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";

interface RouteParams {
    params: Promise<{
        treeID: string;
    }>;
}

// GET - Fetch public tree by slug
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { treeID } = await params;
        const { searchParams } = new URL(request.url);
        const userID = searchParams.get("userID");

        if (!treeID) {
            return NextResponse.json(
                { success: false, error: "Slug is required" },
                { status: 400 }
            );
        }

        // Build query conditions
        const conditions = [eq(trees.slug, treeID)];

        // If userID is provided, add it to conditions (for preview mode)
        if (userID) {
            conditions.push(eq(trees.userId, userID));
        } else {
            // For public access, only show public and active trees
            conditions.push(eq(trees.isPublic, true));
            conditions.push(eq(trees.isActive, true));
        }

        // Fetch tree
        const treeResult = await db
            .select({
                id: trees.id,
                userId: trees.userId,
                slug: trees.slug,
                name: trees.name,
                username: trees.username,
                avatar: trees.avatar,
                background: trees.background,
                title: trees.title,
                description: trees.description,
                isPublic: trees.isPublic,
                isActive: trees.isActive,
                viewCount: trees.viewCount,
                createdAt: trees.createdAt,
                updatedAt: trees.updatedAt,
            })
            .from(trees)
            .where(and(...conditions))
            .limit(1);

        if (treeResult.length === 0) {
            return NextResponse.json(
                { success: false, error: "Tree not found" },
                { status: 404 }
            );
        }

        const tree = treeResult[0];

        // Fetch active links for this tree, ordered by order field
        const treeLinks = await db
            .select({
                id: links.id,
                title: links.title,
                url: links.url,
                isActive: links.isActive,
                order: links.order,
                clickCount: links.clickCount,
                backgroundColor: links.backgroundColor,
                textColor: links.textColor,
                borderRadius: links.borderRadius,
            })
            .from(links)
            .where(
                and(
                    eq(links.treeId, tree.id),
                    userID ? undefined : eq(links.isActive, true) // Show all links if userID provided (preview), only active for public
                )
            )
            .orderBy(links.order);

        // Track view (only for public access, not preview)
        if (!userID) {
            await trackView(request, tree.id);
        }

        return NextResponse.json({
            success: true,
            tree: {
                ...tree,
                links: treeLinks,
            },
        });

    } catch (error) {
        console.error("Error fetching tree:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Helper function to track views
async function trackView(request: NextRequest, treeId: string) {
    try {
        const headersList = await headers();
        const ipAddress = getClientIP(request, headersList);
        const userAgent = headersList.get("user-agent") || "";
        const referer = headersList.get("referer") || "";

        // Insert analytics record
        await db.insert(tree_analytics).values({
            eventType: "view",
            ipAddress,
            userAgent,
            referer,
            treeId
        });

        // Increment view count
        await db
            .update(trees)
            .set({
                viewCount: db.$count(tree_analytics, eq(tree_analytics.treeId, treeId)),
                updatedAt: new Date(),
            })
            .where(eq(trees.id, treeId));

    } catch (error) {
        console.error("Error tracking view:", error);
        // Don't throw error for analytics failure
    }
}

// Helper function to get client IP
function getClientIP(request: NextRequest, headersList: Headers): string {
    // Check various headers for the real IP
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
