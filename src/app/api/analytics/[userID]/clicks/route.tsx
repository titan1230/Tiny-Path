import { NextResponse } from 'next/server';

export async function GET() {
  const dailyClicks = {
    '01/10': 1194,
    '02/10': 98,
    '03/10': 150,
  };

  return NextResponse.json({ dailyClicks });
}
