import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { urls } from "@/database/schema";
import { eq, and } from "drizzle-orm";

// GET - Fetch URL by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const url = await db
            .select()
            .from(urls)
            .where(eq(urls.shortUrl, id))
            .limit(1);

        if (url.length === 0) {
            return NextResponse.json({ error: "URL not found" }, { status: 404 });
        }

        return NextResponse.json(url[0]);
    } catch (error) {
        console.error("Error fetching URL:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete URL
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sp = request.nextUrl.searchParams;
        const userID = sp.get("userID");

        const { id } = await params;

        if (!userID) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const deletedUrl = await db
            .delete(urls)
            .where(and(eq(urls.id, id), eq(urls.userId, userID)))
            .returning();

        if (deletedUrl.length === 0) {
            return NextResponse.json({ error: "URL not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "URL deleted successfully" });
    } catch (error) {
        console.error("Error deleting URL:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}