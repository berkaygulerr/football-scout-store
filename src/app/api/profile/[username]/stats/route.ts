import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username;
    
    if (!username) {
      return NextResponse.json(
        { error: "Kullanıcı adı gerekli" },
        { status: 400 }
      );
    }

    // Supabase client oluştur
    const serverSupabase = createServerSupabase();

    // Kullanıcı profil bilgilerini getir
    const { data: profileData, error: profileError } = await serverSupabase
      .from('user_profile')
      .select('user_id')
      .eq('username', username)
      .single();

    if (profileError || !profileData) {
      console.error('Profil bulunamadı:', profileError);
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Kullanıcının listelerini al
    const { data: listsData, error: listsError } = await serverSupabase
      .from('player_lists')
      .select('id')
      .eq('user_id', profileData.user_id);

    if (listsError) {
      console.error('Listeler alınırken hata:', listsError);
      return NextResponse.json(
        { error: "Listeler alınırken hata oluştu" },
        { status: 500 }
      );
    }

    const listIds = listsData?.map(list => list.id) || [];

    // Toplam beğeni sayısını hesapla
    let totalLikes = 0;
    if (listIds.length > 0) {
      const { count: likesCount, error: likesError } = await serverSupabase
        .from('list_likes')
        .select('*', { count: 'exact', head: true })
        .in('list_id', listIds);

      if (likesError) {
        console.error('Beğeni sayısı hatası:', likesError);
        return NextResponse.json(
          { error: "Beğeni sayısı alınırken hata oluştu" },
          { status: 500 }
        );
      }

      totalLikes = likesCount || 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        total_likes: totalLikes,
        lists_count: listIds.length
      }
    });

  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
