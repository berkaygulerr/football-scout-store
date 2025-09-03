import { z } from "zod";
import { Player } from "./player.types";

/**
 * Oyuncu listesi
 */
export interface PlayerList {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Liste öğesi
 */
export interface ListItem {
  id: string;
  list_id: string;
  player_id: number;
  added_at: string;
  notes?: string | null;
  player?: Player; // Join ile gelecek
}

/**
 * Liste detayları (oyuncular ile birlikte)
 */
export interface PlayerListWithItems extends PlayerList {
  items: ListItem[];
  items_count: number;
  user_profile?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

/**
 * Liste oluşturma şeması
 */
export const createListSchema = z.object({
  title: z.string()
    .min(1, "Başlık gereklidir")
    .max(100, "Başlık en fazla 100 karakter olabilir"),
  
  description: z.string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional()
    .or(z.literal("")),
  
  is_public: z.boolean().default(true)
});

/**
 * Liste güncelleme şeması
 */
export const updateListSchema = z.object({
  title: z.string()
    .min(1, "Başlık gereklidir")
    .max(100, "Başlık en fazla 100 karakter olabilir")
    .optional(),
  
  description: z.string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional()
    .or(z.literal("")),
  
  is_public: z.boolean().optional()
});

/**
 * Liste öğesi ekleme şeması
 */
export const addListItemSchema = z.object({
  player_id: z.number().positive("Geçerli bir oyuncu seçin"),
  notes: z.string()
    .max(200, "Not en fazla 200 karakter olabilir")
    .optional()
    .or(z.literal(""))
});

/**
 * Liste öğesi güncelleme şeması
 */
export const updateListItemSchema = z.object({
  notes: z.string()
    .max(200, "Not en fazla 200 karakter olabilir")
    .optional()
    .or(z.literal(""))
});

/**
 * Şema tipleri
 */
export type CreateListSchema = z.infer<typeof createListSchema>;
export type UpdateListSchema = z.infer<typeof updateListSchema>;
export type AddListItemSchema = z.infer<typeof addListItemSchema>;
export type UpdateListItemSchema = z.infer<typeof updateListItemSchema>;

/**
 * Liste istatistikleri
 */
export interface ListStats {
  total_lists: number;
  public_lists: number;
  private_lists: number;
  total_items: number;
}
