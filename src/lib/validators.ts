import { UI_MESSAGES, API_CONFIG } from "./constants";

/**
 * Arama sorgusunu doğrular
 */
export function validateSearchQuery(query: string | undefined | null): string | null {
  if (!query) return null;
  
  if (query.length < 2) {
    return "Arama sorgusu en az 2 karakter olmalıdır";
  }

  if (query.length > 50) {
    return "Arama sorgusu 50 karakterden uzun olamaz";
  }

  // Özel karakterleri kontrol et
  if (/[<>{}]/.test(query)) {
    return "Arama sorgusu geçersiz karakterler içeriyor";
  }

  return null;
}

/**
 * Yaş aralığını doğrular
 */
export function validateAgeRange(min: number, max: number): string | null {
  if (min < API_CONFIG.MIN_AGE || max > API_CONFIG.MAX_AGE) {
    return `Yaş aralığı ${API_CONFIG.MIN_AGE}-${API_CONFIG.MAX_AGE} arasında olmalıdır`;
  }

  if (min >= max) {
    return "Minimum yaş maksimum yaştan küçük olmalıdır";
  }

  return null;
}

/**
 * Market değeri aralığını doğrular
 */
export function validateMarketValueRange(min: number, max: number): string | null {
  if (min < API_CONFIG.MIN_MARKET_VALUE || max > API_CONFIG.MAX_MARKET_VALUE) {
    return `Market değeri ${API_CONFIG.MIN_MARKET_VALUE}-${API_CONFIG.MAX_MARKET_VALUE} arasında olmalıdır`;
  }

  if (min >= max) {
    return "Minimum değer maksimum değerden küçük olmalıdır";
  }

  return null;
}

/**
 * Oyuncu adını doğrular
 */
export function validatePlayerName(name: string): string | null {
  if (!name.trim()) {
    return "Oyuncu adı boş olamaz";
  }

  if (name.length < 2) {
    return "Oyuncu adı en az 2 karakter olmalıdır";
  }

  if (name.length > 100) {
    return "Oyuncu adı 100 karakterden uzun olamaz";
  }

  // Sadece harf, rakam, boşluk ve tire içerebilir
  if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ0-9\s-]+$/.test(name)) {
    return "Oyuncu adı geçersiz karakterler içeriyor";
  }

  return null;
}

/**
 * Takım adını doğrular
 */
export function validateTeamName(team: string): string | null {
  if (!team.trim()) {
    return "Takım adı boş olamaz";
  }

  if (team.length < 2) {
    return "Takım adı en az 2 karakter olmalıdır";
  }

  if (team.length > 100) {
    return "Takım adı 100 karakterden uzun olamaz";
  }

  // Sadece harf, rakam, boşluk ve tire içerebilir
  if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ0-9\s-]+$/.test(team)) {
    return "Takım adı geçersiz karakterler içeriyor";
  }

  return null;
} 