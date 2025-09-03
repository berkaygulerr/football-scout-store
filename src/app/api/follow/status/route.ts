import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Kullanıcıyı kontrol et
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const target_user_id = searchParams.get('user_id');
    
    if (!target_user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

         // Takip durumunu kontrol et
     const { data: followData, error: followError } = await supabase
       .from('user_follows')
       .select('id')
       .eq('follower_id', user.id)
       .eq('following_id', target_user_id)
       .maybeSingle();

    // Takipçi sayısını al
    const { count: followersCount, error: followersError } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', target_user_id);

    // Takip edilen sayısını al
    const { count: followingCount, error: followingError } = await supabase
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', target_user_id);

         if (followersError || followingError) {

       return NextResponse.json({ error: 'Failed to get follow stats' }, { status: 500 });
     }

     const is_following = followData !== null;


    return NextResponse.json({
      is_following,
      followers_count: followersCount || 0,
      following_count: followingCount || 0
    });

  } catch (error) {
    console.error('Follow status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
