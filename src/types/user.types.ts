import { z } from "zod";

/**
 * Kullanıcı profil bilgileri
 */
export interface UserProfile {
  user_id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Kullanıcı profil şeması (validasyon için)
 */
export const userProfileSchema = z.object({
  username: z.string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalıdır")
    .max(30, "Kullanıcı adı en fazla 30 karakter olabilir")
    .regex(/^[a-z0-9_]+$/, "Sadece küçük harfler, rakamlar ve alt çizgi (_) kullanabilirsiniz"),
  
  full_name: z.string()
    .min(2, "Ad soyad en az 2 karakter olmalıdır")
    .max(100, "Ad soyad en fazla 100 karakter olabilir")
    .optional(),
  
  bio: z.string()
    .max(500, "Bio en fazla 500 karakter olabilir")
    .optional(),
  
  website: z.string()
    .url("Geçerli bir URL girin")
    .optional()
    .or(z.literal("")),
  
  twitter: z.string()
    .max(50, "Twitter kullanıcı adı en fazla 50 karakter olabilir")
    .optional()
    .or(z.literal("")),
  
  instagram: z.string()
    .max(50, "Instagram kullanıcı adı en fazla 50 karakter olabilir")
    .optional()
    .or(z.literal("")),
});

/**
 * Kullanıcı profil tipi (şemadan türetilmiş)
 */
export type UserProfileSchema = z.infer<typeof userProfileSchema>;

/**
 * Kullanıcı istatistikleri
 */
export interface UserStats {
  lists_count: number;
  followers_count: number;
  following_count: number;
  total_likes: number;
}

/**
 * Kullanıcı profil sayfası için genişletilmiş tip
 */
export interface UserProfilePage extends UserProfile {
  stats: UserStats;
  is_following?: boolean;
  is_own_profile?: boolean;
  lists?: Array<{
    id: string;
    title: string;
    description?: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    items_count: number;
    like_count: number;
  }>;
}
