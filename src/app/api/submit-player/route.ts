import { NextRequest } from "next/server";
import { playerSchema } from "@/types/player.types";
import { createServerSupabase } from "@/lib/supabase-server";
import { redis } from "@/lib/redis";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";
import { UI_MESSAGES } from "@/lib/constants";

export const { dynamic, revalidate } = dynamicConfig;

export async function POST(request: NextRequest) {
  try {
    const serverSupabase = createServerSupabase();
    const { data: { session } } = await serverSupabase.auth.getSession();
    if (!session?.user) {
      return createApiError("Yetkisiz", 401);
    }
    const body = await request.json();
    const parsed = playerSchema.safeParse(body);

    if (!parsed.success) {
      return createApiError(
        `Geçersiz veri: ${parsed.error.issues.map(i => i.message).join(", ")}`,
        400
      );
    }

    const { error } = await serverSupabase
      .from("players")
      .insert([{ 
        player_id: parsed.data.player_id,
        name: parsed.data.name,
        team: parsed.data.team,
        age: parsed.data.age,
        market_value: parsed.data.market_value,
        user_id: session.user.id 
      }]);

    if (error) {
      console.error("Supabase error:", error);
      return createApiError("Veritabanı hatası", 500);
    }

    // Redis'e de kaydet
    await redis.set(`player:${parsed.data.player_id}`, JSON.stringify(parsed.data));

    return createApiResponse({ message: UI_MESSAGES.ADD_SUCCESS });
  } catch (err) {
    console.error("Submit player error:", err);
    return createApiError("Sunucu hatası", 500);
  }
}
