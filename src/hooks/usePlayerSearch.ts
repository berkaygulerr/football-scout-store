import { useState, useEffect } from "react";
import { PlayerSearchResult } from "@/types/player.types";
import { PlayerService } from "@/services/player.service";
import { API_CONFIG } from "@/lib/constants";

/**
 * Player arama işlemlerini yöneten custom hook
 */
export function usePlayerSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  /**
   * Arama işlemi
   */
  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const data = await PlayerService.searchPlayers(searchQuery);
      setResults(data);
    } catch (error) {
      console.error("Arama hatası:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Debounced arama effect'i
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      search(query);
    }, API_CONFIG.SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  /**
   * Query değiştirir ve sonuç listesini gösterir
   */
  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
    setShowResults(true);
  };

  /**
   * Sonuç listesini gizler
   */
  const hideResults = () => {
    setShowResults(false);
  };

  /**
   * Arama sonuçlarını temizler
   */
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return {
    query,
    results,
    isSearching,
    showResults,
    updateQuery,
    hideResults,
    clearSearch,
    setQuery,
  };
} 