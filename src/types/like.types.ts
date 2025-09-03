import { z } from "zod";

/**
 * Liste beğenisi
 */
export interface ListLike {
  id: string;
  list_id: string;
  user_id: string;
  created_at: string;
}

/**
 * Beğeni durumu
 */
export interface LikeStatus {
  isLiked: boolean;
  likeCount: number;
}

/**
 * Beğeni API response
 */
export interface LikeResponse {
  success: boolean;
  action: 'liked' | 'unliked' | 'already_liked';
  message?: string;
  data?: ListLike;
}

/**
 * Beğeni durumu API response
 */
export interface LikeStatusResponse {
  success: boolean;
  data: LikeStatus;
}

/**
 * Beğeni action şeması
 */
export const likeActionSchema = z.object({
  action: z.enum(['like', 'unlike']),
});

/**
 * Şema tipleri
 */
export type LikeActionSchema = z.infer<typeof likeActionSchema>;
