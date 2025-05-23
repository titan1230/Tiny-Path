import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { urls, analytics } from "@/database/schema";
import { eq } from "drizzle-orm";

interface IPInfoResponse {
    ip: string,
    asn: string,
    as_name: string,
    as_domain: string,
    country_code: string,
    country: string,
    continent_code: string,
    continent: string,
}
export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams;

    const slug = query.get("slug");
    const ip = query.get("ip");
    const source = query.get("source");
    const browser = query.get("browser");
    const device = query.get("device");
    const userId = query.get("userId");

    if (!slug) {
        return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    if (!ip) {
        return NextResponse.json({ error: "IP is required" }, { status: 400 });
    }
    if (!source) {
        return NextResponse.json({ error: "Source is required" }, { status: 400 });
    }
    if (!browser) {
        return NextResponse.json({ error: "Browser is required" }, { status: 400 });
    }
    if (!device) {
        return NextResponse.json({ error: "Device is required" }, { status: 400 });
    }

    const url = await db
        .select()
        .from(urls)
        .where(eq(urls.shortUrl, slug))
        .limit(1)
        .then((r) => r[0]);
    if (!url) {
        return NextResponse.json({ error: "URL not found" });
    }

    if (url.urlType === "temp" && url.expiresAt && url.expiresAt < new Date()) {
        await db.delete(urls).where(eq(urls.id, url.id));
        return NextResponse.json({ error: "URL expired" });
    }

    const fetchIpInfo = await fetch(
        `https://api.ipinfo.io/lite/${ip}?token=${process.env.IPINFO_TOKEN}`
    );
    const IPInfo: IPInfoResponse = await fetchIpInfo.json();

    await db.insert(analytics).values({
        urlId: url.id,
        userId: userId || null,
        ip,
        country: IPInfo.country_code || null,
        device,
        browser,
        isBounce: true,
    });

    await db
        .update(urls)
        .set({ clicks: (url.clicks || 0) + 1 })
        .where(eq(urls.id, url.id));

    return NextResponse.json(
        { url: `${url.originalUrl}?rel=tinypath` },
        { status: 200 }
    );
}