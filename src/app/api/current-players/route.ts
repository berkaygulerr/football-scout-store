import { redis } from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ids: string[] = body.ids;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid or missing ids" }), { status: 400 });
    }

    // Redis'ten toplu verileri al
    const pipeline = redis.multi();
    ids.forEach((id) => {
      pipeline.get(`player:${id}`);
    });

    const results = await pipeline.exec();

    // player verilerini eşle
    const responseData = ids.map((id, index) => ({
      id,
      data: results?.[index] ?? null,
    }));

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Redis error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
