export const fetchPlayers = async () => {
  const res = await fetch("/api/get-players", {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  const data = await res.json();
  return data;
};
