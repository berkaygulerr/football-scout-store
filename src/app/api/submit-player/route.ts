import { NextRequest } from "next/server";
import { playerSchema } from "@/types/player.types";
import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";
import { UI_MESSAGES } from "@/lib/constants";

export const { dynamic, revalidate } = dynamicConfig;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = playerSchema.safeParse(body);

    if (!parsed.success) {
      return createApiError(
        `Geçersiz veri: ${parsed.error.issues.map(i => i.message).join(", ")}`,
        400
      );
    }

    const { error } = await supabase
      .from("players")
      .insert([parsed.data]);

    if (error) {
      console.error("Supabase error:", error);
      return createApiError("Veritabanı hatası", 500);
    }

    // Redis'e de kaydet
    await redis.set(`player:${parsed.data.id}`, JSON.stringify(parsed.data));

    return createApiResponse({ message: UI_MESSAGES.ADD_SUCCESS });
  } catch (err) {
    console.error("Submit player error:", err);
    return createApiError("Sunucu hatası", 500);
  }
}
