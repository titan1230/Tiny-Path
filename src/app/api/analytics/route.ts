import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { urls, analytics } from "@/database/schema";
import {
  and,
  count,
  eq,
  sum,
  sql,
} from "drizzle-orm";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const userID = sp.get("userID");

  if (!userID) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ totalClicks = 0 } = {}] = await db
    .select({ totalClicks: count(analytics.id) })
    .from(analytics)
    .innerJoin(urls, eq(urls.id, analytics.urlId))
    .where(eq(urls.userId, userID));

  const [{ oldClicks = 0 } = {}] = await db
    .select({ oldClicks: sum(urls.oldClicks).mapWith(Number) })
    .from(urls)
    .where(eq(urls.userId, userID));

  const [{ urlCount = 0 } = {}] = await db
    .select({ urlCount: count(urls.id) })
    .from(urls)
    .where(eq(urls.userId, userID));

  const [{ totalDailyVisitors = 0 } = {}] = await db
    .select({ totalDailyVisitors: sum(urls.dailyUniqueVisitors).mapWith(Number) })
    .from(urls)
    .where(eq(urls.userId, userID));

  const [{ oldDailyUniqueVisitors = 0 } = {}] = await db
    .select({ oldDailyUniqueVisitors: sum(urls.oldDailyUniqueVisitors).mapWith(Number) })
    .from(urls)
    .where(eq(urls.userId, userID));

  const [{ oldBounceRate = 0 } = {}] = await db
    .select({ oldBounceRate: sum(urls.oldBounceRate).mapWith(Number) })
    .from(urls)
    .where(eq(urls.userId, userID));

  const [{ bounces = 0 } = {}] = await db
    .select({ bounces: count(analytics.id) })
    .from(analytics)
    .innerJoin(urls, eq(urls.id, analytics.urlId))
    .where(and(eq(urls.userId, userID), eq(analytics.isBounce, true)));

  const recentClicksRaw = await db
    .select({
      day: sql`date_trunc('day', ${analytics.clickedAt})`.as("day"),
      clicks: count(analytics.id),
    })
    .from(analytics)
    .innerJoin(urls, eq(urls.id, analytics.urlId))
    .where(eq(urls.userId, userID))
    .groupBy(sql`date_trunc('day', ${analytics.clickedAt})`)
    .orderBy(sql`date_trunc('day', ${analytics.clickedAt}) DESC`)
    .limit(30);

  const recentClicks = recentClicksRaw.map((r: any) => {
    const d = new Date(r.day);
    const day = d.toISOString().slice(0, 10);
    return { day, clicks: Number(r.clicks ?? 0) };
  }).reverse();

  const deviceRaw = await db
    .select({
      device: analytics.device,
      count: count(analytics.id),
    })
    .from(analytics)
    .innerJoin(urls, eq(urls.id, analytics.urlId))
    .where(eq(urls.userId, userID))
    .groupBy(analytics.device)
    .orderBy(sql`count(analytics.id) DESC`)
    .limit(6);

  const deviceData = deviceRaw.map((r: any) => ({
    name: r.device ?? "Unknown",
    value: Number(r.count ?? 0),
  }));

  const locationRaw = await db
    .select({
      country: analytics.country,
      count: count(analytics.id),
    })
    .from(analytics)
    .innerJoin(urls, eq(urls.id, analytics.urlId))
    .where(eq(urls.userId, userID))
    .groupBy(analytics.country)
    .orderBy(sql`count(analytics.id) DESC`)
    .limit(6);

  const locationData = locationRaw.map((r: any) => ({
    name: r.country ?? "Unknown",
    value: Number(r.count ?? 0),
  }));

  const totalClicksNum = Number(totalClicks ?? 0);
  const bounceRate = totalClicksNum === 0 ? 0 : Math.round((Number(bounces) / totalClicksNum) * 100);

  const formatChange = (current: number, previous: number) => {
    if (!previous || previous === 0) return "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change.toFixed(1)}%`;
  };

  const payload = {
    totalClicks: Number(totalClicks ?? 0),
    oldClicks: Number(oldClicks ?? 0),
    bounceRate,
    oldBounceRate: Number(oldBounceRate ?? 0),
    totalDailyVisitors: Number(totalDailyVisitors ?? 0),
    oldDailyUniqueVisitors: Number(oldDailyUniqueVisitors ?? 0),
    click_change: formatChange(Number(totalClicks ?? 0), Number(oldClicks ?? 0)),
    bounce_change: formatChange(bounceRate, Number(oldBounceRate ?? 0)),
    visitor_change: formatChange(Number(totalDailyVisitors ?? 0), Number(oldDailyUniqueVisitors ?? 0)),
    urlCount: Number(urlCount ?? 0),
    recentClicks,
    deviceData,
    locationData,
    referrerData: [],
  };

  return NextResponse.json(payload, { status: 200 });
}