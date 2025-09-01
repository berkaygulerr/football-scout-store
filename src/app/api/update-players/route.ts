import { redis } from "@/lib/redis";
import { supabase } from "@/lib/supabase"; // Secret key ile oluşturulan istemci
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Route'u dinamik olarak işaretle

export async function GET() {
  try {
    // Secret key ile tüm oyuncuları getir
    const { data: players, error } = await supabase
      .from("players")
      .select("id");

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: "Supabase error" }, { status: 500 });
    }

    if (!players?.length) {
      return NextResponse.json({ error: "No players found" }, { status: 404 });
    }

    const results = [];
    
    for (const player of players) {
      try {
        // Next.js 13.4+ için önerilen fetch yapısı
        const response = await fetch(`https://scout.goldenfut.com/api/search-player?id=${player.id}`, {
          next: { revalidate: 0 }, // no-store yerine revalidate: 0 kullan
        });

        if (!response.ok) {
          console.error(`Failed to fetch player ${player.id}:`, response.statusText);
          results.push({ id: player.id, status: 'error', message: response.statusText });
          continue;
        }

        const data = await response.json();
        await redis.set(`player:${player.id}`, JSON.stringify(data));
        console.log(`Player ${player.id} data cached in Redis.`);
        results.push({ id: player.id, status: 'success' });
      } catch (err) {
        console.error(`Error fetching player ${player.id}:`, err);
        results.push({ id: player.id, status: 'error', message: err instanceof Error ? err.message : String(err) });
      }
    }

    return NextResponse.json({ 
      message: `Processed ${players.length} players.`,
      results
    }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}