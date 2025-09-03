import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";
import { addListItemSchema } from "@/types/list.types";

export const { dynamic, revalidate } = dynamicConfig;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serverSupabase = createServerSupabase();
    const { data: { session } } = await serverSupabase.auth.getSession();
    
    if (!session?.user) {
      return createApiError("Yetkisiz", 401);
    }

    const listId = params.id;
    const body = await request.json();
    const parsed = addListItemSchema.safeParse(body);

    if (!parsed.success) {
      return createApiError(
        `Geçersiz veri: ${parsed.error.issues.map(i => i.message).join(", ")}`,
        400
      );
    }

    // Liste sahibi kontrolü
    const { data: listData, error: listError } = await serverSupabase
      .from('player_lists')
      .select('user_id')
      .eq('id', listId)
      .single();

    if (listError || !listData) {
      return createApiError("Liste bulunamadı", 404);
    }

    if (listData.user_id !== session.user.id) {
      return createApiError("Bu listeye oyuncu ekleme yetkiniz yok", 403);
    }

    // Oyuncunun var olup olmadığını kontrol et
    const { data: playerData, error: playerError } = await serverSupabase
      .from('players')
      .select('id')
      .eq('player_id', parsed.data.player_id)
      .single();

    if (playerError || !playerData) {
      return createApiError("Oyuncu bulunamadı", 404);
    }

    // Oyuncunun zaten listede olup olmadığını kontrol et
    const { data: existingItem, error: existingError } = await serverSupabase
      .from('list_items')
      .select('id')
      .eq('list_id', listId)
      .eq('player_id', playerData.id)
      .single();

    if (existingItem) {
      return createApiError("Bu oyuncu zaten listede mevcut", 409);
    }

    // Oyuncuyu listeye ekle
    const { data: newItem, error: insertError } = await serverSupabase
      .from('list_items')
      .insert([{
        list_id: listId,
        player_id: playerData.id,
        notes: parsed.data.notes || null
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return createApiError("Oyuncu eklenirken hata oluştu", 500);
    }

    return createApiResponse({
      message: "Oyuncu başarıyla listeye eklendi",
      item: newItem
    });

  } catch (err) {
    console.error("Add player to list error:", err);
    return createApiError("Sunucu hatası", 500);
  }
}
