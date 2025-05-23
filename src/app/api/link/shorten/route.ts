import { db } from '@/database/drizzle';
import { urls } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

import isValidUrl from '@/lib/utils/urlChecker'

export async function POST(req: Request) {
    let { originalUrl, userId, customSlug, urlType, expiresAt } = await req.json();

    if (!isValidUrl(originalUrl)) {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    if (!expiresAt) {
        expiresAt = urlType == 'temp' ? new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    let shortUrl;
    if (customSlug) {
        shortUrl = customSlug;
    } else {
        shortUrl = urlType == 'temp' ? nanoid(6) : nanoid(8);
    }

    const exists = await db.select().from(urls).where(eq(urls.shortUrl, shortUrl)).limit(1).then(r => r[0]);
    if (exists) {
        return NextResponse.json({ error: 'Slug already taken' }, { status: 409 });
    }

    const newUrl = await db.insert(urls).values({
        originalUrl,
        shortUrl,
        urlType: urlType || 'temp',
        expiresAt,
    }).returning();

    return NextResponse.json({
        original: newUrl[0].originalUrl,
        short: newUrl[0].shortUrl,
        expiresAt: newUrl[0].expiresAt,
    });
}