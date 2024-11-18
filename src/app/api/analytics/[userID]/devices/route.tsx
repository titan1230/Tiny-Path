import { NextResponse } from 'next/server';

export async function GET() {
  const userDevices = {
    mobile: 45,
    desktop: 35,
    tablet: 20,
  };

  return NextResponse.json({ userDevices });
}
