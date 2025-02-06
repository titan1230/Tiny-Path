import { NextRequest, NextResponse } from "next/server";

interface CountryClickData {
    country: string;
    clicks: number;
}

const clickData: CountryClickData[] = [
    { country: 'US', clicks: 120 },
    { country: 'IN', clicks: 85 },
    { country: 'DE', clicks: 40 },
    { country: 'FR', clicks: 25 },
    { country: 'JP', clicks: 70 },
];

export async function GET(req: NextRequest) {
    return NextResponse.json(clickData);
}
