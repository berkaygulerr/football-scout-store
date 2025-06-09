import { useState, useEffect, useCallback } from "react";
import { Player, CurrentPlayerData } from "@/types/player.types";
import { PlayerService } from "@/services/player.service";
import { UI_MESSAGES } from "@/lib/constants";
import { handleApiError } from "@/lib/api-utils";

interface PlayersState {
  players: Player[];
  currentPlayersData: Record<string, Player>;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlayersState = {
  players: [],
  currentPlayersData: {},
  isLoading: false,
  error: null,
};

/**
 * Player verilerini yöneten custom hook
 */
export function usePlayers() {
  const [state, setState] = useState<PlayersState>(initialState);

  /**
   * State güncelleme yardımcı fonksiyonu
   */
  const updateState = useCallback((updates: Partial<PlayersState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Oyuncuları yükler
   */
  const loadPlayers = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });
      const data = await PlayerService.getPlayers();
      updateState({ players: data });
    } catch (err) {
      updateState({ error: handleApiError(err) });
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState]);

  /**
   * Güncel oyuncu verilerini yükler
   */
  const loadCurrentPlayersData = useCallback(async (playerIds: number[]) => {
    if (!playerIds.length) return;

    try {
      const data = await PlayerService.getCurrentPlayersData(playerIds);
      const dataMap: Record<string, Player> = {};
      
      data.forEach(({ id, data: playerData }) => {
        if (playerData) dataMap[id] = playerData;
      });

      updateState({ currentPlayersData: dataMap });
    } catch (err) {
      console.error(UI_MESSAGES.LOAD_ERROR, err);
    }
  }, [updateState]);

  /**
   * Yeni oyuncu ekler
   */
  const addPlayer = useCallback(async (player: Player) => {
    try {
      updateState({ error: null });
      await PlayerService.createPlayer(player);
      await loadPlayers();
    } catch (err) {
      const errorMessage = handleApiError(err);
      updateState({ error: errorMessage });
      throw new Error(errorMessage);
    }
  }, [loadPlayers, updateState]);

  /**
   * Oyuncuyu siler
   */
  const deletePlayer = useCallback(async (id: number) => {
    try {
      updateState({ error: null });
      await PlayerService.deletePlayer(id);
      await loadPlayers();
    } catch (err) {
      const errorMessage = handleApiError(err);
      updateState({ error: errorMessage });
      throw new Error(errorMessage);
    }
  }, [loadPlayers, updateState]);

  // İlk yükleme
  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  // Güncel veriler için oyuncu listesi değiştiğinde yükle
  useEffect(() => {
    if (state.players.length > 0) {
      const ids = state.players.map(p => p.id);
      loadCurrentPlayersData(ids);
    }
  }, [state.players, loadCurrentPlayersData]);

  return {
    ...state,
    loadPlayers,
    addPlayer,
    deletePlayer,
  };
} 