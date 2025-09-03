import { API_ENDPOINTS, UI_MESSAGES } from "@/lib/constants";
import { apiRequest, handleApiError } from "@/lib/api-utils";
import { Player, PlayerSearchResult, CurrentPlayerData } from "@/types/player.types";

/**
 * Player verileri için service katmanı
 */
export class PlayerService {
  /**
   * Tüm oyuncuları getirir
   */
  static async getPlayers(): Promise<Player[]> {
    try {
      return await apiRequest<Player[]>(API_ENDPOINTS.GET_PLAYERS);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Oyuncu arar
   */
  static async searchPlayers(query: string): Promise<PlayerSearchResult[]> {
    try {
      if (!query.trim()) return [];
      
      const url = `${API_ENDPOINTS.PLAYERS}?search=${encodeURIComponent(query)}`;
      return await apiRequest<PlayerSearchResult[]>(url);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * ID ile oyuncu detayını getirir
   */
  static async getPlayerById(id: number): Promise<Player> {
    try {
      if (!id) throw new Error(UI_MESSAGES.INVALID_ID);
      
      const url = `${API_ENDPOINTS.SEARCH_PLAYER}?id=${id}`;

      console.log("PlayerService.getPlayerById çağrılıyor:", { id, url });
      return await apiRequest<Player>(url);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Yeni oyuncu ekler
   */
  static async createPlayer(player: Player): Promise<{ message: string }> {
    try {
      if (!player) throw new Error(UI_MESSAGES.INVALID_DATA);

      return await apiRequest<{ message: string }>(API_ENDPOINTS.SUBMIT_PLAYER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(player),
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Oyuncuyu siler
   */
  static async deletePlayer(id: number): Promise<{ message: string }> {
    try {
      if (!id) throw new Error(UI_MESSAGES.INVALID_ID);

      const url = `${API_ENDPOINTS.DELETE_PLAYER}?id=${id}`;
      return await apiRequest<{ message: string }>(url, {
        method: "DELETE",
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Mevcut oyuncu verilerini getirir
   */
  static async getCurrentPlayersData(ids: number[]): Promise<CurrentPlayerData[]> {
    try {
      if (!ids?.length) return [];

      return await apiRequest<CurrentPlayerData[]>(API_ENDPOINTS.CURRENT_PLAYERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
} 