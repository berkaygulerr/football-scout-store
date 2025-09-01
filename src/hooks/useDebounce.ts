import { useState, useEffect } from 'react';

/**
 * Gecikme (debounce) ile değer döndüren hook.
 * Örneğin, kullanıcı bir input'a yazarken, her tuş vuruşunda değil, 
 * kullanıcı yazmayı bıraktıktan belirli bir süre sonra işlem yapmak için kullanılır.
 * 
 * @param value Geciktirilecek değer
 * @param delay Gecikme süresi (ms cinsinden)
 * @returns Geciktirilmiş değer
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Gecikme süresi sonunda değeri güncelle
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Temizleme fonksiyonu: yeni bir değer gelirse önceki zamanlayıcıyı temizle
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
