import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";
import { createServerSupabase } from "@/lib/supabase-server";

export const { dynamic, revalidate } = dynamicConfig;

export async function GET() {
  try {
    const serverSupabase = createServerSupabase();
    const {
      data: { session },
    } = await serverSupabase.auth.getSession();

    if (!session?.user) {
      return createApiError("Yetkisiz", 401);
    }

    const { data, error } = await serverSupabase
      .from("players")
      .select("*")
      .eq("user_id", session.user.id)
      .order("player_id", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return createApiError(error.message, 500);
    }

    return createApiResponse(data || []);
  } catch (err) {
    console.error("Get players error:", err);
    return createApiError("Sunucu hatası", 500);
  }
}
