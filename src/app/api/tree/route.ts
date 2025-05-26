import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { trees, links } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { generateSlug } from "@/lib/utils/slugHelper";
import auth from "@/auth";

// GET - Fetch user's tree
export async function GET(request: NextRequest) {

    try {
        const sp = request.nextUrl.searchParams;
        const userID = sp.get("userID");

        if (!userID) {
            return NextResponse.json(
                { success: false, error: "Invalid user ID" },
                { status: 400 }
            );
        }

        // Fetch tree with links
        const userTree = await db
            .select()
            .from(trees)
            .where(eq(trees.userId, userID))
            .limit(1);

        if (userTree.length === 0) {
            return NextResponse.json({
                success: true,
                tree: null,
                message: "No tree found"
            });
        }

        const tree = userTree[0];

        // Fetch links for this tree
        const treeLinks = await db
            .select()
            .from(links)
            .where(eq(links.treeId, tree.id))
            .orderBy(links.order);

        return NextResponse.json({
            success: true,
            tree: {
                ...tree,
                links: treeLinks
            }
        });

    } catch (error) {
        console.error("Error fetching tree:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Create new tree
export async function POST(request: NextRequest) {
    try {

        const body = await request.json();
        const { userID, name, username, slug, title, description, background, isPublic, avatar } = body;

        if (!userID) {
            return NextResponse.json(
                { success: false, error: "Invalid user ID" },
                { status: 400 }
            );
        }

        // Check if user already has a tree
        const existingTree = await db
            .select()
            .from(trees)
            .where(eq(trees.userId, userID))
            .limit(1);

        if (existingTree.length > 0) {
            return NextResponse.json(
                { success: false, error: "User already has a tree" },
                { status: 400 }
            );
        }

        // Check if slug is available
        const slugExists = await db
            .select()
            .from(trees)
            .where(eq(trees.slug, slug))
            .limit(1);

        if (slugExists.length > 0) {
            return NextResponse.json(
                { success: false, error: "URL is already taken" },
                { status: 400 }
            );
        }

        // Create new tree
        const newTree = await db
            .insert(trees)
            .values({
                userId: userID,
                name,
                username,
                slug,
                title,
                description,
                background,
                isPublic,
                avatar,
            })
            .returning();

        return NextResponse.json({
            success: true,
            tree: newTree[0]
        });
    } catch (error) {
        console.error("Error creating tree:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT - Update tree and links
export async function PUT(request: NextRequest) {
    try {

        const sp = request.nextUrl.searchParams;
        const userID = sp.get("userID");

        if (!userID) {
            return NextResponse.json(
                { success: false, error: "Invalid user ID" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { treeID, profile, links: updatedLinks } = body;

        // Verify tree ownership
        const tree = await db
            .select()
            .from(trees)
            .where(and(eq(trees.id, treeID), eq(trees.userId, userID)))
            .limit(1);

        if (tree.length === 0) {
            return NextResponse.json(
                { success: false, error: "Tree not found or unauthorized" },
                { status: 404 }
            );
        }

        // If slug is being changed, check availability
        if (profile.slug !== tree[0].slug) {
            const slugExists = await db
                .select()
                .from(trees)
                .where(eq(trees.slug, profile.slug))
                .limit(1);

            if (slugExists.length > 0) {
                return NextResponse.json(
                    { success: false, error: "URL is already taken" },
                    { status: 400 }
                );
            }
        }

        // Update tree
        await db
            .update(trees)
            .set({
                name: profile.name,
                username: profile.username,
                slug: profile.slug,
                title: profile.title,
                description: profile.description,
                background: profile.background,
                isPublic: profile.isPublic,
                avatar: profile.avatar,
                updatedAt: new Date(),
            })
            .where(eq(trees.id, treeID));

        // Delete existing links
        await db.delete(links).where(eq(links.treeId, treeID));

        // Insert updated links
        if (updatedLinks.length > 0) {
            await db.insert(links).values(
                updatedLinks.map((link: any) => ({
                    treeId: treeID,
                    title: link.title,
                    url: link.url,
                    isActive: link.isActive,
                    order: link.order,
                }))
            );
        }

        return NextResponse.json({
            success: true,
            message: "Tree updated successfully"
        });

    } catch (error) {
        console.error("Error updating tree:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}