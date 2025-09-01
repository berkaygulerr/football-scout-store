import { createServerSupabase } from "@/lib/supabase-server";
import { redis } from "@/lib/redis";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";
import { UI_MESSAGES } from "@/lib/constants";

export const { dynamic, revalidate } = dynamicConfig;

export async function DELETE(request: Request) {
  try {
    const serverSupabase = createServerSupabase();
    const { data: { session } } = await serverSupabase.auth.getSession();
    if (!session?.user) {
      return createApiError("Yetkisiz", 401);
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return createApiError("Geçersiz ID", 400);
    }

    const { error } = await serverSupabase
      .from("players")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

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
