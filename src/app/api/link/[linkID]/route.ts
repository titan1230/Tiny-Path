import { NextRequest, NextResponse } from "next/server";
import DBClient from "@/lib/db"
import { ObjectId } from "mongodb";

interface paramInterface {
    linkID: string
}

export async function GET(req: NextRequest, { params }: { params: paramInterface }) {

    try {
        const db = DBClient.db("tinypath")
        const links = db.collection("links")

        const linkID = params.linkID

        let objectId;
        try {
            objectId = new ObjectId(linkID);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
        }

        const link = await links.findOne({ _id: objectId })
        
        if (!link) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        return NextResponse.json({ link }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: paramInterface }) {

    try {
        const db = DBClient.db("tinypath")
        const links = db.collection("links")

        const linkID = params.linkID

        let objectId;
        try {
            objectId = new ObjectId(linkID);
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
        }

        const link = await links.findOneAndDelete({ _id: objectId })
        
        return NextResponse.json({ message: "Link deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Error", { status: 500 });
    }
}