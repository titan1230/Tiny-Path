import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const data = request.nextUrl.searchParams.get("data");

    if (!data) {
        return new Response("Missing 'data' query parameter", { status: 400 });
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;

    const res = await fetch(qrUrl);

    if (!res.ok) {
        return new Response("Failed to fetch QR code", { status: 500 });
    }

    const blob = await res.arrayBuffer();

    return new Response(blob, {
        status: 200,
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=86400"
        }
    });
}