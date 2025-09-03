import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";

export const { dynamic, revalidate } = dynamicConfig;

export async function DELETE(
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
    const { searchParams } = new URL(request.url);
    const playerIdParam = searchParams.get('player_id');

    if (!playerIdParam) {
      return createApiError("Oyuncu ID gereklidir", 400);
    }

    const playerId = parseInt(playerIdParam);
    if (isNaN(playerId)) {
      return createApiError("Geçersiz oyuncu ID", 400);
    }

    // Liste sahibi kontrolü
    const { data: listData, error: listError } = await serverSupabase
      .from('player_lists')
      .select('user_id')
      .eq('id', listId)
      .maybeSingle();

    if (listError) {
      console.error("Liste kontrolü hatası:", listError);
      return createApiError("Liste kontrolü sırasında hata oluştu", 500);
    }

    if (!listData) {
      return createApiError("Liste bulunamadı", 404);
    }

    if (listData.user_id !== session.user.id) {
      return createApiError("Bu listeden oyuncu silme yetkiniz yok", 403);
    }

    // player_id'den players.id'yi bul
    const { data: playerData, error: playerError } = await serverSupabase
      .from('players')
      .select('id')
      .eq('player_id', playerId)
      .maybeSingle();

    if (playerError) {
      console.error("Oyuncu kontrolü hatası:", playerError);
      return createApiError("Oyuncu kontrolü sırasında hata oluştu", 500);
    }

    if (!playerData) {
      return createApiError("Oyuncu bulunamadı", 404);
    }

    // Oyuncuyu listeden sil (players.id kullanarak)
    const { error: deleteError } = await serverSupabase
      .from('list_items')
      .delete()
      .eq('list_id', listId)
      .eq('player_id', playerData.id);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return createApiError("Oyuncu silinirken hata oluştu", 500);
    }

    return createApiResponse({
      message: "Oyuncu başarıyla listeden silindi"
    });

  } catch (err) {
    console.error("Remove player from list error:", err);
    return createApiError("Sunucu hatası", 500);
  }
}
