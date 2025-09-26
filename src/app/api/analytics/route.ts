import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { urls, analytics } from "@/database/schema";
import { and, count, eq, sum } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const userID = sp.get("userID");


  if (!userID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ totalClicks }] = await db
    .select({ totalClicks: count(analytics.id) })
    .from(analytics)
    .innerJoin(urls, eq(urls.id, analytics.urlId))
    .where(eq(urls.userId, userID));

  const [{ oldClicks }] = await db
    .select({ oldClicks: urls.oldClicks })
    .from(urls)
    .where(eq(urls.userId, userID));

  const [{ urlCount }] = await db
    .select({ urlCount: count(urls.id) })
    .from(urls)
    .where(eq(urls.userId, userID));

  const [{ bounceRate }] = await db
    .select({ bounceRate: sum(urls.bounceRate).mapWith(Number) })
    .from(analytics)
    .innerJoin(urls, eq(analytics.urlId, urls.id))
    .where(and(eq(urls.userId, userID), eq(analytics.isBounce, true)));

  const [{ oldBounceRate }] = await db
    .select({ oldBounceRate: sum(urls.oldBounceRate).mapWith(Number) })
    .from(urls)
    .where(eq(urls.userId, userID));

  const recentClicks = await db
    .select({
      day: analytics.clickedAt,
      clicks: count(analytics.id),
    })
    .from(analytics)
    .innerJoin(urls, eq(urls.id, analytics.urlId))
    .where(eq(urls.userId, userID))
    .groupBy(analytics.clickedAt);

  const [{ totalDailyVisitors }] = await db
    .select({ totalDailyVisitors: sum(urls.dailyUniqueVisitors).mapWith(Number) })
    .from(urls)
    .where(eq(urls.userId, userID));

  const [{ oldDailyUniqueVisitors }] = await db
    .select({ oldDailyUniqueVisitors: sum(urls.oldDailyUniqueVisitors).mapWith(Number) })
    .from(urls)
    .where(eq(urls.userId, userID));

  return NextResponse.json({
    totalClicks,
    oldClicks,
    bounceRate,
    oldBounceRate,
    totalDailyVisitors,
    oldDailyUniqueVisitors,
    click_change: oldClicks === 0 ? "0%" : `${((totalClicks - oldClicks) / oldClicks) * 100}%`,
    bounce_change: oldBounceRate === 0 ? "0%" : `${((bounceRate - oldBounceRate) / oldBounceRate) * 100}%`,
    visitor_change: oldDailyUniqueVisitors === 0 ? "0%" : `${((totalDailyVisitors - oldDailyUniqueVisitors) / oldDailyUniqueVisitors) * 100}%`,
    urlCount,
    recentClicks,
  });
}