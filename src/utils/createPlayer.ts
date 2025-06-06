import { Player } from "@/types/player.types";

export async function createPlayer(player: Player) {
  const response = await fetch("/api/submit-player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Player creation failed");
  }

  return await response.json();
}
