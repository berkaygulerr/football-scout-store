export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.toLowerCase();

    const res = await fetch(`${process.env.API_URL}/player/${id}`);

    if (!res.ok) {
      return NextResponse.json(
        { error: "API request failed" },
        { status: res.status }
      );
    }

    const { player } = await res.json();

    const formattedData = {
      id: player.id,
      name: player.name,
      age: Math.floor(
        (Date.now() - player.dateOfBirthTimestamp * 1000) /
          (1000 * 60 * 60 * 24 * 365.25)
      ),
      team: player.team?.name ?? null,
      market_value: player.proposedMarketValue ?? null,
    };

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
