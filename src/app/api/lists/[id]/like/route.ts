import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

// Request body validation schema
const likeSchema = z.object({
  action: z.enum(['like', 'unlike']),
});

export async function POST(
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

    // Request body'yi parse et
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse hatası:', parseError);
      return NextResponse.json(
        { error: "Geçersiz JSON formatı" },
        { status: 400 }
      );
    }

    const parsed = likeSchema.safeParse(body);

    if (!parsed.success) {
      console.error('Validation hatası:', parsed.error.errors);
      return NextResponse.json(
        { error: "Geçersiz veri formatı", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { action } = parsed.data;

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

    if (action === 'like') {
      // Beğeni ekle
      const { data: likeData, error: likeError } = await serverSupabase
        .from('list_likes')
        .insert([{
          list_id: listId,
          user_id: user.id
        }])
        .select()
        .single();

      if (likeError) {
        // Eğer zaten beğenilmişse, hata verme
        if (likeError.code === '23505') { // Unique constraint violation
          return NextResponse.json({
            success: true,
            action: 'already_liked',
            message: 'Liste zaten beğenilmiş'
          });
        }
        
        console.error('Beğeni ekleme hatası:', likeError);
        return NextResponse.json(
          { error: "Beğeni eklenirken hata oluştu" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: 'liked',
        data: likeData
      });

    } else if (action === 'unlike') {
      // Beğeniyi kaldır
      const { error: unlikeError } = await serverSupabase
        .from('list_likes')
        .delete()
        .eq('list_id', listId)
        .eq('user_id', user.id);

      if (unlikeError) {
        console.error('Beğeni kaldırma hatası:', unlikeError);
        return NextResponse.json(
          { error: "Beğeni kaldırılırken hata oluştu" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: 'unliked'
      });
    }

  } catch (error) {
    console.error('Like API error:', error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
