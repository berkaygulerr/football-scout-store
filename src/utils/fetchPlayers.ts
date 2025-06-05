export const fetchPlayers = async () => {
  const res = await fetch("/api/get-players");
  const data = await res.json();
  return data;
};
