// API Endpoints
export const API_ENDPOINTS = {
  PLAYERS: "/api/players",
  GET_PLAYERS: "/api/get-players",
  SUBMIT_PLAYER: "/api/submit-player",
  DELETE_PLAYER: "/api/delete-player",
  SEARCH_PLAYER: "/api/search-player",
  CURRENT_PLAYERS: "/api/current-players",
} as const;

// Cache Headers
export const CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
} as const;

// API Configuration
export const API_CONFIG = {
  MIN_AGE: 15,
  MAX_AGE: 50,
  MIN_MARKET_VALUE: 0,
  MAX_MARKET_VALUE: 500_000_000,
  DEFAULT_PAGE_SIZE: 12,
  DEFAULT_DEBOUNCE_MS: 300,
  MAX_SEARCH_RESULTS: 20,
} as const;

// UI Messages
export const UI_MESSAGES = {
  // Success Messages
  ADD_SUCCESS: "Oyuncu başarıyla eklendi",
  DELETE_SUCCESS: "Oyuncu başarıyla silindi",

  // Error Messages
  GENERAL_ERROR: "Bir hata oluştu",
  LOAD_ERROR: "Oyuncular yüklenemedi",
  ADD_ERROR: "Oyuncu eklenemedi",
  DELETE_ERROR: "Oyuncu silinemedi",
  SEARCH_ERROR: "Arama sırasında bir hata oluştu",
  API_ERROR: "API hatası",
  INVALID_ID: "Geçersiz ID",
  INVALID_DATA: "Geçersiz veri",
  SERVER_ERROR: "Sunucu hatası",

  // Info Messages
  NO_RESULTS: "Sonuç bulunamadı",
  LOADING: "Yükleniyor...",
  NO_TEAM: "Bilinmeyen Takım",
} as const;

// Default Values
export const DEFAULT_VALUES = {
  FILTERS: {
    searchQuery: "",
    teamFilter: "",
    ageRange: [API_CONFIG.MIN_AGE, API_CONFIG.MAX_AGE],
    marketValueRange: [
      API_CONFIG.MIN_MARKET_VALUE,
      API_CONFIG.MAX_MARKET_VALUE,
    ],
    sortBy: "player_id" as const,
    sortOrder: "desc" as const,
  },
  PAGINATION: {
    PAGE_SIZE: 12,
    FIRST_PAGE: 1,
  },
} as const;
