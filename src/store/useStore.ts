import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Player, CurrentPlayerData } from '@/types/player.types';
import { PlayerService } from '@/services/player.service';
import { handleApiError } from '@/lib/api-utils';

// Types
interface FilterOptions {
  searchQuery: string;
  teamFilter: string;
  ageRange: [number, number];
  marketValueRange: [number, number];
  showTransfers: boolean;
  sortBy: 'name' | 'age' | 'market_value' | 'team' | 'player_id' | 'created_at' | 'value_increase';
  sortOrder: 'asc' | 'desc';
}

// Store Interface
interface AppStore {
  // Players State
  players: Player[];
  currentPlayersData: Record<string, Player>;
  isLoading: boolean;
  error: string | null;

  // Filters State
  filters: FilterOptions;

  // Pagination State
  currentPage: number;
  pageSize: number;

  // Actions
  fetchPlayers: () => Promise<void>;
  fetchCurrentPlayersData: (ids: number[]) => Promise<void>;
  addPlayer: (player: Player) => Promise<void>;
  deletePlayer: (id: number) => Promise<void>;
  
  // Filter Actions
  setSearchQuery: (query: string) => void;
  setTeamFilter: (team: string) => void;
  setAgeRange: (range: [number, number]) => void;
  setMarketValueRange: (range: [number, number]) => void;
  setShowTransfers: (show: boolean) => void;
  setSorting: (sortBy: FilterOptions['sortBy'], sortOrder: FilterOptions['sortOrder']) => void;
  resetFilters: () => void;

  // Pagination Actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetPage: () => void;

  // Computed/Derived State
  getFilteredPlayers: () => Player[];
  getPaginatedPlayers: () => Player[];
  getTotalPages: () => number;
  getUniqueTeams: () => string[];
  getTeamsWithCount: () => { name: string; count: number }[];
}

// Default values
const defaultFilters: FilterOptions = {
  searchQuery: '',
  teamFilter: '',
  ageRange: [15, 50],
  marketValueRange: [0, Number.MAX_SAFE_INTEGER], // Sonsuz değer için MAX_SAFE_INTEGER kullanıldı
  showTransfers: false,
  sortBy: 'player_id',
  sortOrder: 'desc',
};

// Değer değişim yüzdesini hesapla
const calculateValueChange = (player: Player, currentData: Record<string, Player>): number => {
  const current = currentData[player.id];
  
  // Güncel veri yoksa değişim yok
  if (!current) return 0;
  
  // Başlangıç değeri 0 ise değişim hesaplanamaz
  if (player.market_value === 0) return 0;
  
  // Değer değişim yüzdesi
  return ((current.market_value - player.market_value) / player.market_value) * 100;
};

const getSortValue = (player: Player, currentData: Record<string, Player>, sortBy: FilterOptions['sortBy']): string | number => {
  switch (sortBy) {
    case 'name':
    case 'team':
      return player[sortBy]?.toLowerCase() || '';
    case 'age':
    case 'market_value':
      return player[sortBy] || 0;
    case 'player_id':
      return player.player_id || 0;
    case 'created_at':
      return player.created_at ? new Date(player.created_at).getTime() : 0;
    case 'value_increase':
      return calculateValueChange(player, currentData);
    default:
      return 0;
  }
};

// Zustand Store
export const useStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      players: [],
      currentPlayersData: {},
      isLoading: false,
      error: null,
      filters: defaultFilters,
      currentPage: 1,
      pageSize: 12,

      // Player Actions
      fetchPlayers: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await PlayerService.getPlayers();
          set({ players: data, isLoading: false });
        } catch (error) {
          set({ error: handleApiError(error), isLoading: false });
        }
      },

      fetchCurrentPlayersData: async (ids: number[]) => {
        try {
          const data = await PlayerService.getCurrentPlayersData(ids);
          const dataMap: Record<string, Player> = {};
          
          data.forEach(item => {
            if (item.data && item.id) {
              dataMap[item.id] = item.data;
            }
          });
          
          set({ currentPlayersData: dataMap });
        } catch (error) {
          console.error('Error fetching current players data:', error);
        }
      },

      addPlayer: async (player: Player) => {
        set({ isLoading: true, error: null });
        try {
          await PlayerService.createPlayer(player);
          // Yeni oyuncu eklendikten sonra listeyi güncelle
          const data = await PlayerService.getPlayers();
          set({ players: data, isLoading: false });
        } catch (error) {
          set({ error: handleApiError(error), isLoading: false });
        }
      },

      deletePlayer: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
          await PlayerService.deletePlayer(id);
          // Oyuncu silindikten sonra listeyi güncelle
          const data = await PlayerService.getPlayers();
          set({ players: data, isLoading: false });
        } catch (error) {
          set({ error: handleApiError(error), isLoading: false });
        }
      },

      // Filter Actions
      setSearchQuery: (query: string) => {
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
          currentPage: 1,
        }));
      },

      setTeamFilter: (team: string) => {
        set((state) => ({
          filters: { ...state.filters, teamFilter: team },
          currentPage: 1,
        }));
      },

      setAgeRange: (range: [number, number]) => {
        set((state) => ({
          filters: { ...state.filters, ageRange: range },
          currentPage: 1,
        }));
      },

      setMarketValueRange: (range: [number, number]) => {
        set((state) => ({
          filters: { ...state.filters, marketValueRange: range },
          currentPage: 1,
        }));
      },

      setShowTransfers: (show: boolean) => {
        set((state) => ({
          filters: { ...state.filters, showTransfers: show },
          currentPage: 1,
        }));
      },

      setSorting: (sortBy: FilterOptions['sortBy'], sortOrder: FilterOptions['sortOrder']) => {
        set((state) => ({
          filters: { ...state.filters, sortBy, sortOrder }
        }));
      },

      resetFilters: () => {
        set({ filters: {...defaultFilters}, currentPage: 1 });
      },

      // Pagination Actions
      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },

      setPageSize: (size: number) => {
        set({ pageSize: size, currentPage: 1 });
      },

      resetPage: () => {
        set({ currentPage: 1 });
      },

      // Computed State
      getFilteredPlayers: () => {
        const { players, filters, currentPlayersData } = get();
        
        if (!players || players.length === 0) return [];
        
        // Transfer olanlar kategorisi için özel filtre
        if (filters.showTransfers) {
          return players.filter(player => {
            const current = currentPlayersData[player.id];
            return current && current.team !== player.team;
          }).sort((a, b) => {
            // En son transfer olanlar önce
            const aId = a.player_id || 0;
            const bId = b.player_id || 0;
            return bId - aId;
          });
        }
        
        const filtered = players.filter(player => {
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            const matches = player.name?.toLowerCase().includes(query) ||
                          player.team?.toLowerCase().includes(query);
            if (!matches) return false;
          }

          if (filters.teamFilter && filters.teamFilter !== 'all') {
            if (player.team?.toLowerCase() !== filters.teamFilter.toLowerCase()) {
              return false;
            }
          }

          if (player.age < filters.ageRange[0] || player.age > filters.ageRange[1]) {
            return false;
          }

          if (player.market_value < filters.marketValueRange[0] || 
              player.market_value > filters.marketValueRange[1]) {
            return false;
          }

          return true;
        });

        // Sıralama mantığı
        return filtered.sort((a, b) => {
          const aValue = getSortValue(a, currentPlayersData, filters.sortBy);
          const bValue = getSortValue(b, currentPlayersData, filters.sortBy);

          if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      },

      getPaginatedPlayers: () => {
        const { currentPage, pageSize } = get();
        const filtered = get().getFilteredPlayers();
        const startIndex = (currentPage - 1) * pageSize;
        return filtered.slice(startIndex, startIndex + pageSize);
      },

      getTotalPages: () => {
        const { pageSize } = get();
        const filtered = get().getFilteredPlayers();
        return Math.ceil(filtered.length / pageSize);
      },

      getUniqueTeams: () => {
        const { players } = get();
        if (!players || players.length === 0) return [];
        const teams = Array.from(new Set(players.filter(p => p.team).map(player => player.team)));
        return teams.sort();
      },

      getTeamsWithCount: () => {
        const { players } = get();
        if (!players || players.length === 0) return [];
        
        const teamCounts: Record<string, number> = {};
        
        players.forEach(player => {
          if (player.team) {
            teamCounts[player.team] = (teamCounts[player.team] || 0) + 1;
          }
        });
        
        return Object.entries(teamCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => a.name.localeCompare(b.name));
      },
    }),
    { name: 'app-store' }
  )
);