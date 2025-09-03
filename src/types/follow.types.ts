/**
 * Takip ilişkisi
 */
export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

/**
 * Takip istatistikleri
 */
export interface FollowStats {
  followers_count: number;
  following_count: number;
}

/**
 * Takip durumu
 */
export interface FollowStatus {
  is_following: boolean;
  followers_count: number;
  following_count: number;
}
