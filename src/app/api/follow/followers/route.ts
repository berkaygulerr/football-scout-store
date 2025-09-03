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

    // Takipçileri getir
    const { data: followersData, error: followersError } = await supabase
      .from('user_follows')
      .select('follower_id, created_at')
      .eq('following_id', targetUserId)
      .order('created_at', { ascending: false });

    if (followersError) {
      console.error('Followers fetch error:', followersError);
      return NextResponse.json({ error: 'Failed to fetch followers list' }, { status: 500 });
    }

    if (!followersData || followersData.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Takipçilerin profil bilgilerini getir
    const followerIds = followersData.map(item => item.follower_id);
    const { data: profileData, error: profileError } = await supabase
      .from('user_profile')
      .select('user_id, username, full_name, avatar_url, bio')
      .in('user_id', followerIds);

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }

    // Veriyi birleştir
    const followers = followersData.map(item => {
      const profile = profileData?.find(p => p.user_id === item.follower_id);
      return {
        user_id: item.follower_id,
        username: profile?.username || '',
        full_name: profile?.full_name || '',
        avatar_url: profile?.avatar_url || '',
        bio: profile?.bio || '',
        followed_at: item.created_at
      };
    });

    return NextResponse.json({
      success: true,
      data: followers
    });

  } catch (error) {
    console.error('Followers API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
