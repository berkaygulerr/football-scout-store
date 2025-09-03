import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Kullanıcıyı kontrol et
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { target_user_id, action } = body;
    
    if (!target_user_id) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    if (!action || !['follow', 'unfollow'].includes(action)) {
      return NextResponse.json({ error: 'Action must be follow or unfollow' }, { status: 400 });
    }

    // Kendini takip etmeyi engelle
    if (user.id === target_user_id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    if (action === 'follow') {
      // Takip et
      console.log('Following user:', { follower_id: user.id, following_id: target_user_id });
      
      const { data, error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: user.id,
          following_id: target_user_id
        })
        .select()
        .single();

      if (error) {
        console.error('Follow error:', error);
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Already following this user' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('Follow success:', data);
      return NextResponse.json({ success: true, data });
    } else if (action === 'unfollow') {
      // Takibi bırak
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', target_user_id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

  } catch (error) {
    console.error('Follow/Unfollow error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


