import { NextResponse } from "next/server";
import { CACHE_HEADERS, UI_MESSAGES } from "./constants";

/**
 * API yanıtları için tutarlı response oluşturucu
 */
export function createApiResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: CACHE_HEADERS,
  });
}

/**
 * API hatası için tutarlı error response oluşturucu
 */
export function createApiError(message: string = UI_MESSAGES.SERVER_ERROR, status: number = 500) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: CACHE_HEADERS,
    }
  );
}

/**
 * API istekleri için genel fetch wrapper
 */
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw error instanceof Error ? error : new Error('API Error');
  }
}

/**
 * Route config için ortak ayarlar
 */
export const dynamicConfig = {
  dynamic: "force-dynamic" as const,
  revalidate: 0,
} as const;

/**
 * Hata mesajlarını işlemek için yardımcı fonksiyon
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return UI_MESSAGES.SERVER_ERROR;
} 