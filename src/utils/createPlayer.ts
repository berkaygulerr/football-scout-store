export async function createPlayer(player: any) {
  const response = await fetch("/api/submit-player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });

  if (!response.ok) {
    throw new Error("Player creation failed");
  }

  return await response.json();
}
