import { NextRequest } from "next/server";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";
import { formatAge } from "@/utils/formatNumber";

export const { dynamic, revalidate } = dynamicConfig;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return createApiError("ID parametresi gerekli", 400);
    }

    // Next.js 13.4+ için önerilen fetch yapısı
    const response = await fetch(`${process.env.API_URL}/player/${id}`, {
      next: { revalidate: 0 }, // cache: "no-store" yerine revalidate: 0 kullan
    });

    if (!response.ok) {
      return createApiError("Dış API isteği başarısız", response.status);
    }

    const { player } = await response.json();

    const formattedData = {
      id: player.id,
      name: player.name,
      age: formatAge(player.dateOfBirthTimestamp),
      team: player.team?.name ?? "Takım bilgisi yok",
      market_value: player.proposedMarketValue ?? 0,
    };

    return createApiResponse(formattedData);
  } catch (error) {
    console.error("Search player error:", error);
    return createApiError("Sunucu hatası", 500);
  }
}