import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    const { data: players, error } = await supabase.from("players").select("id");

    if (error) {
      console.error("Supabase error:", error.message);
      return new Response(JSON.stringify({ error: "Supabase error" }), { status: 500 });
    }

    if (!players?.length) {
      return new Response(JSON.stringify({ error: "No players found" }), { status: 404 });
    }

    for (const player of players) {
      try {
        const response = await fetch(`https://scout.goldenfut.com/api/search-player?id=${player.id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          console.error(`Failed to fetch player ${player.id}:`, response.statusText);
          continue;
        }

        const data = await response.json();
        await redis.set(`player:${player.id}`, JSON.stringify(data));
        console.log(`Player ${player.id} data cached in Redis.`);
      } catch (err) {
        console.error(`Error fetching player ${player.id}:`, err);
      }
    }

    return new Response(JSON.stringify({ message: `Processed ${players.length} players.` }), {
      status: 200,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error" }), { status: 500 });
  }
}
