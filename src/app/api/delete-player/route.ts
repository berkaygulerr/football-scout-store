import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";
import { UI_MESSAGES } from "@/lib/constants";

export const { dynamic, revalidate } = dynamicConfig;

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return createApiError("Geçersiz ID", 400);
    }

    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return createApiError(error.message, 500);
    }

    // Redis'ten de sil
    await redis.del(`player:${id}`);

    return createApiResponse({ message: UI_MESSAGES.DELETE_SUCCESS });
  } catch (err) {
    console.error("Delete player error:", err);
    return createApiError("Sunucu hatası", 500);
  }
}
