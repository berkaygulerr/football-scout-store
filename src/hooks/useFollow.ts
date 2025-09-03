import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { FollowStatus } from '@/types/follow.types';

export function useFollow(targetUserId: string) {
  const [followStatus, setFollowStatus] = useState<FollowStatus>({
    is_following: false,
    followers_count: 0,
    following_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!targetUserId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/follow/status?user_id=${targetUserId}`);
        
               if (response.ok) {
         const data = await response.json();
         setFollowStatus(data);
       } else {
         const errorData = await response.json();
         console.error('Failed to fetch follow status:', errorData);
       }
      } catch (error) {
        console.error('Error fetching follow status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowStatus();
  }, [targetUserId]);

  const follow = async () => {
    if (!targetUserId || actionLoading) return;

    try {
      setActionLoading(true);
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          target_user_id: targetUserId,
          action: 'follow'
        }),
      });

      if (response.ok) {
        setFollowStatus(prev => ({
          ...prev,
          is_following: true,
          followers_count: prev.followers_count + 1
        }));
             } else {
         const error = await response.json();
         console.error('Follow error response:', error);
         throw new Error(error.error || 'Failed to follow');
       }
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const unfollow = async () => {
    if (!targetUserId || actionLoading) return;

    try {
      setActionLoading(true);
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          target_user_id: targetUserId,
          action: 'unfollow'
        }),
      });

      if (response.ok) {
        setFollowStatus(prev => ({
          ...prev,
          is_following: false,
          followers_count: Math.max(0, prev.followers_count - 1)
        }));
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to unfollow');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const toggleFollow = async () => {
    if (followStatus.is_following) {
      await unfollow();
    } else {
      await follow();
    }
  };

  return {
    followStatus,
    loading,
    actionLoading,
    follow,
    unfollow,
    toggleFollow
  };
}
