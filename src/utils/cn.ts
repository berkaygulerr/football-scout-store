/**
 * Class name'leri birleştiren utility fonksiyonu
 */
export function cn(...classes: (string | undefined | null | false | 0 | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
} 