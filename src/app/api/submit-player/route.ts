export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { playerSchema } from "@/utils/playerSchema";
import { supabase } from "@/lib/supabase";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = playerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("players")
      .insert([parsed.data]);

    await redis.set(`player:${parsed.data.id}`, JSON.stringify(parsed.data));

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Veritabanı hatası" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Oyuncu eklendi" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
