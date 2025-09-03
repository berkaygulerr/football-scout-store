import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listId = params.id;
    
    if (!listId) {
      return NextResponse.json(
        { error: "Liste ID gerekli" },
        { status: 400 }
      );
    }

    // Supabase client oluştur
    const serverSupabase = createServerSupabase();

    // Kullanıcıyı kontrol et
    const { data: { user }, error: userError } = await serverSupabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User auth hatası:', userError);
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      );
    }

    // Liste varlığını kontrol et
    const { data: listData, error: listError } = await serverSupabase
      .from('player_lists')
      .select('id')
      .eq('id', listId)
      .single();

    if (listError || !listData) {
      console.error('Liste bulunamadı:', listError);
      return NextResponse.json(
        { error: "Liste bulunamadı" },
        { status: 404 }
      );
    }

    // Kullanıcının bu listeyi beğenip beğenmediğini kontrol et
    const { data: likeData, error: likeError } = await serverSupabase
      .from('list_likes')
      .select('id')
      .eq('list_id', listId)
      .eq('user_id', user.id)
      .single();

    if (likeError && likeError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Beğeni durumu kontrol hatası:', likeError);
      return NextResponse.json(
        { error: "Beğeni durumu kontrol edilirken hata oluştu" },
        { status: 500 }
      );
    }

    // Toplam beğeni sayısını al
    const { count: likeCount, error: countError } = await serverSupabase
      .from('list_likes')
      .select('*', { count: 'exact', head: true })
      .eq('list_id', listId);

    if (countError) {
      console.error('Beğeni sayısı hatası:', countError);
      return NextResponse.json(
        { error: "Beğeni sayısı alınırken hata oluştu" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isLiked: !!likeData,
        likeCount: likeCount || 0
      }
    });

  } catch (error) {
    console.error('Like status API error:', error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
