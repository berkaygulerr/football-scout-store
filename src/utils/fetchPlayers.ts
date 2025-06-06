export const fetchPlayers = async () => {
  const res = await fetch("/api/get-players", { cache: "no-store" });
  const data = await res.json();
  return data;
};
