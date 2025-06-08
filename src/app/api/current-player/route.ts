import { redis } from "@/lib/redis";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
  }

  try {
    const cachedData: string | null = await redis.get(`player:${id}`);

    if (!cachedData) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    return new Response(cachedData, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Redis error" }), { status: 500 });
  }
}
