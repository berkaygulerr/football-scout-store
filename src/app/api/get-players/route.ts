import { supabase } from "@/lib/supabase";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";

export const { dynamic, revalidate } = dynamicConfig;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
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
