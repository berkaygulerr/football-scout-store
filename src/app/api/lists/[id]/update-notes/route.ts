import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

// Request body validation schema
const updateNotesSchema = z.object({
  playerId: z.number().int().positive(),
  notes: z.string().nullable().optional(),
});

async function handleUpdateNotes(
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

    const parsed = updateNotesSchema.safeParse(body);

    if (!parsed.success) {
      console.error('Validation hatası:', parsed.error.errors);
      return NextResponse.json(
        { error: "Geçersiz veri formatı", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { playerId, notes } = parsed.data;

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

    // Liste sahipliğini kontrol et
    const { data: listData, error: listError } = await serverSupabase
      .from('player_lists')
      .select('id, user_id')
      .eq('id', listId)
      .single();

    if (listError || !listData) {
      console.error('Liste bulunamadı:', listError);
      return NextResponse.json(
        { error: "Liste bulunamadı" },
        { status: 404 }
      );
    }

    if (listData.user_id !== user.id) {
      console.error('Yetki hatası:', { listUserId: listData.user_id, currentUserId: user.id });
      return NextResponse.json(
        { error: "Bu listeyi düzenleme yetkiniz yok" },
        { status: 403 }
      );
    }

    // Önce player_id'den players.id'yi bul
    const { data: playerData, error: playerError } = await serverSupabase
      .from('players')
      .select('id')
      .eq('player_id', playerId)
      .single();

    if (playerError || !playerData) {
      console.error('Oyuncu bulunamadı:', playerError);
      return NextResponse.json(
        { error: "Oyuncu bulunamadı" },
        { status: 404 }
      );
    }

    // Oyuncunun listede olup olmadığını kontrol et (players.id kullanarak)
    const { data: listItemData, error: listItemError } = await serverSupabase
      .from('list_items')
      .select('id')
      .eq('list_id', listId)
      .eq('player_id', playerData.id)
      .single();

    if (listItemError || !listItemData) {
      console.error('Liste öğesi bulunamadı:', listItemError);
      return NextResponse.json(
        { error: "Oyuncu bu listede bulunamadı" },
        { status: 404 }
      );
    }

    // Notları güncelle
    const { data: updatedItem, error: updateError } = await serverSupabase
      .from('list_items')
      .update({ 
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', listItemData.id)
      .select()
      .single();

    if (updateError) {
      console.error('Not güncelleme hatası:', updateError);
      return NextResponse.json(
        { error: "Not güncellenirken hata oluştu" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedItem
    });

  } catch (error) {
    console.error('Update notes API error:', error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

// PATCH method
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleUpdateNotes(request, { params });
}

// PUT method (alternatif)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleUpdateNotes(request, { params });
}
