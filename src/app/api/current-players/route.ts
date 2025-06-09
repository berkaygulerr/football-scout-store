import { redis } from "@/lib/redis";
import { createApiResponse, createApiError, dynamicConfig } from "@/lib/api-utils";

export const { dynamic, revalidate } = dynamicConfig;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids: string[] = body.ids;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return createApiError("Geçersiz veya eksik ID'ler", 400);
    }

    // Redis'ten toplu verileri al
    const pipeline = redis.multi();
    ids.forEach((id) => {
      pipeline.get(`player:${id}`);
    });

    const results = await pipeline.exec();

    // Player verilerini eşle
    const responseData = ids.map((id, index) => ({
      id,
      data: results?.[index] ?? null,
    }));

    return createApiResponse(responseData);
  } catch (error) {
    console.error("Current players error:", error);
    return createApiError("Sunucu hatası", 500);
  }
}
