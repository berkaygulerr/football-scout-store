import { NextRequest } from "next/server";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";
import { API_CONFIG, UI_MESSAGES } from "@/lib/constants";
import { validateSearchQuery } from "@/lib/validators";

export const { dynamic, revalidate } = dynamicConfig;

/**
 * Oyuncu arama endpoint'i
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("search")?.toLowerCase().trim();

    // Validate query
    const validationError = validateSearchQuery(query);
    if (validationError) {
      return createApiError(validationError, 400);
    }

    if (!query) {
      return createApiResponse([]);
    }

    // External API call
    const externalResponse = await fetch(
      `${process.env.API_URL}/search/player-team-persons?q=${encodeURIComponent(query)}`
    );

    if (!externalResponse.ok) {
      console.error("External API Error:", await externalResponse.text());
      return createApiError(UI_MESSAGES.API_ERROR, externalResponse.status);
    }

    const data = await externalResponse.json();

    // Process and filter results
    const players = data.results
      ?.filter((item: any) => item.entity.team?.sport?.name === "Football")
      .slice(0, API_CONFIG.MAX_SEARCH_RESULTS)
      .map((item: any) => ({
        player_id: item.entity.id,
        name: item.entity.name,
        team: item.entity.team?.name ?? UI_MESSAGES.NO_TEAM,
      })) || [];

    return createApiResponse(players);
  } catch (error) {
    console.error("Players search error:", error);
    return createApiError(UI_MESSAGES.SEARCH_ERROR);
  }
}
