import { useState, useMemo } from 'react';
import { Player } from '@/types/player.types';

export interface FilterOptions {
  searchQuery: string;
  teamFilter: string;
  ageRange: [number, number];
  marketValueRange: [number, number];
  sortBy: 'name' | 'age' | 'market_value' | 'team' | 'player_id';
  sortOrder: 'asc' | 'desc';
}

export interface TeamWithCount {
  name: string;
  count: number;
}

const defaultFilters: FilterOptions = {
  searchQuery: '',
  teamFilter: '',
  ageRange: [15, 50],
  marketValueRange: [0, 200000000], // 200M max
  sortBy: 'player_id',
  sortOrder: 'desc',
};

export function useFilters(players: Player[]) {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const filteredAndSortedPlayers = useMemo(() => {
    let filtered = players.filter(player => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          player.name.toLowerCase().includes(query) ||
          player.team.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Team filter
      if (filters.teamFilter && filters.teamFilter !== 'all') {
        if (player.team.toLowerCase() !== filters.teamFilter.toLowerCase()) {
          return false;
        }
      }

      // Age range filter
      if (player.age < filters.ageRange[0] || player.age > filters.ageRange[1]) {
        return false;
      }

      // Market value range filter
      if (player.market_value < filters.marketValueRange[0] || 
          player.market_value > filters.marketValueRange[1]) {
        return false;
      }

      return true;
    });

    // Sort players
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'age':
          aValue = a.age;
          bValue = b.age;
          break;
        case 'market_value':
          aValue = a.market_value;
          bValue = b.market_value;
          break;
        case 'team':
          aValue = a.team.toLowerCase();
          bValue = b.team.toLowerCase();
          break;
        case 'player_id':
          aValue = a.player_id || 0;
          bValue = b.player_id || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [players, filters]);

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const teamsWithCount = useMemo(() => {
    // Takımları ve her takımdaki oyuncu sayısını hesapla
    const teamCounts: Record<string, number> = {};
    
    players.forEach(player => {
      if (teamCounts[player.team]) {
        teamCounts[player.team]++;
      } else {
        teamCounts[player.team] = 1;
      }
    });
    
    // Takım adlarını ve sayılarını içeren dizi oluştur
    const result: TeamWithCount[] = Object.entries(teamCounts).map(([name, count]) => ({
      name,
      count
    }));
    
    // Takım adına göre alfabetik sırala
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [players]);

  // Eski uniqueTeams'i koruyalım uyumluluk için
  const uniqueTeams = useMemo(() => {
    return teamsWithCount.map(team => team.name);
  }, [teamsWithCount]);

  return {
    filters,
    filteredAndSortedPlayers,
    updateFilter,
    resetFilters,
    uniqueTeams,
    teamsWithCount,
    totalFilteredCount: filteredAndSortedPlayers.length,
    totalCount: players.length,
  };
} 