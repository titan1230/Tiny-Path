import { NextResponse } from 'next/server';

let users = 120;

export async function GET() {

    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({ value: users });
}

export async function POST(req: Request) {
    const { value } = await req.json();
    users = value;
    return NextResponse.json({ success: true });
}
