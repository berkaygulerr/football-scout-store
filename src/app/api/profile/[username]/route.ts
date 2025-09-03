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
      .select('*')
      .eq('username', username)
      .single();

    if (profileError || !profileData) {
      console.error('Profil bulunamadı:', profileError);
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: profileData
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
