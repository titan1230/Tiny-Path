import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { urls } from "@/database/schema";
import { eq, and } from "drizzle-orm";

// DELETE - Delete URL
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const sp = request.nextUrl.searchParams;
        const userID = sp.get("userID");

        if (!userID) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const deletedUrl = await db
            .delete(urls)
            .where(and(eq(urls.id, params.id), eq(urls.userId, userID)))
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
