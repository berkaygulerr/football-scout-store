import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Kullanıcıyı kontrol et
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // URL'den user_id parametresini al
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('user_id') || user.id;

    // Takip edilen kullanıcıları getir
    const { data: followingData, error: followingError } = await supabase
      .from('user_follows')
      .select('following_id, created_at')
      .eq('follower_id', targetUserId)
      .order('created_at', { ascending: false });

    if (followingError) {
      console.error('Following fetch error:', followingError);
      return NextResponse.json({ error: 'Failed to fetch following list' }, { status: 500 });
    }

    if (!followingData || followingData.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Takip edilen kullanıcıların profil bilgilerini getir
    const followingIds = followingData.map(item => item.following_id);
    const { data: profileData, error: profileError } = await supabase
      .from('user_profile')
      .select('user_id, username, full_name, avatar_url, bio')
      .in('user_id', followingIds);

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }

    // Veriyi birleştir
    const following = followingData.map(item => {
      const profile = profileData?.find(p => p.user_id === item.following_id);
      return {
        user_id: item.following_id,
        username: profile?.username || '',
        full_name: profile?.full_name || '',
        avatar_url: profile?.avatar_url || '',
        bio: profile?.bio || '',
        followed_at: item.created_at
      };
    });

    return NextResponse.json({
      success: true,
      data: following
    });

  } catch (error) {
    console.error('Following API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
