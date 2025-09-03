import { z } from "zod";
import { API_CONFIG } from "@/lib/constants";

/**
 * Temel oyuncu bilgileri
 */
export interface BasePlayer {
  player_id: number;
  name: string;
  team: string;
}

/**
 * Detaylı oyuncu bilgileri
 */
export interface Player extends BasePlayer {
  id: number; // Primary key (eklenme sırası)
  age: number;
  market_value: number;
  created_at?: string;
  value_change?: number; // Değer değişimi (yüzde olarak)
}

/**
 * Arama sonucu oyuncu bilgileri
 */
export type PlayerSearchResult = BasePlayer;

/**
 * Güncel oyuncu verisi
 */
export interface CurrentPlayerData {
  id: string; // player_id (oyuncu ID)
  data: any | null; // Current data from Redis
}

/**
 * Oyuncu şeması (validasyon için)
 */
export const playerSchema = z.object({
  player_id: z.number(),
  name: z.string()
    .min(2, "İsim en az 2 karakter olmalıdır")
    .max(100, "İsim en fazla 100 karakter olabilir"),
  
  team: z.string()
    .min(2, "Takım adı en az 2 karakter olmalıdır")
    .max(100, "Takım adı en fazla 100 karakter olabilir"),
  
  age: z.number()
    .min(API_CONFIG.MIN_AGE, `Yaş en az ${API_CONFIG.MIN_AGE} olmalıdır`)
    .max(API_CONFIG.MAX_AGE, `Yaş en fazla ${API_CONFIG.MAX_AGE} olabilir`),
  
  market_value: z.number()
    .min(API_CONFIG.MIN_MARKET_VALUE, `Market değeri en az ${API_CONFIG.MIN_MARKET_VALUE} olmalıdır`)
    .max(API_CONFIG.MAX_MARKET_VALUE, `Market değeri en fazla ${API_CONFIG.MAX_MARKET_VALUE} olabilir`),
});

/**
 * Oyuncu tipi (şemadan türetilmiş)
 */
export type PlayerSchema = z.infer<typeof playerSchema>;