export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("search")?.toLowerCase();

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const externalRes = await fetch(
      `${process.env.API_URL}/search/player-team-persons?q=${encodeURIComponent(
        query
      )}`
    );
    const data = await externalRes.json();

    const players = data.results
      .filter((item: any) => item.entity.team?.sport?.name === "Football")
      .map((item: any) => ({
        id: item.entity.id,
        name: item.entity.name,
        team: item.entity.team?.name ?? "No team",
      }));

    return NextResponse.json(players);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
