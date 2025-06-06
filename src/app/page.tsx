"use client";
import { useEffect, useState } from "react";
import { fetchPlayers } from "@/utils/fetchPlayers";
import PlayerInput from "@/components/PlayerInput";
import { formatNumber } from "@/utils/formatNumber";
import { Player } from "@/types/player.types";

export default function PlayersList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>({
    id: 0,
    name: "",
    team: "",
    age: 0,
    market_value: 0,
  });
  const [currentDatas, setCurrentDatas] = useState<Player[]>([]);

  const getData = async () => {
    const data = await fetchPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    async function fetchCurrentDatas() {
      const results = await Promise.all(
        players.map(async (player: Player) => {
          const res = await fetch(`/api/search-player?id=${player.id}`, {
            cache: "no-store",
            next: { revalidate: 0 },
          });
          const data = await res.json();
          return { id: player.id, data };
        })
      );

      // Obje haline getir
      const dataMap: any = {};
      results.forEach(({ id, data }) => {
        dataMap[id] = data;
      });

      setCurrentDatas(dataMap);
    }

    if (players?.length) {
      fetchCurrentDatas();
    }
  }, [players]);

  useEffect(() => {
    getData();
  }, []);

  const selectPlayer = async (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/submit-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPlayer),
        cache: "no-store",
        next: { revalidate: 0 },
      });

      if (!res.ok) throw new Error("İstek başarısız");

      getData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlayer = async (id: number) => {
    try {
      const res = await fetch(`/api/delete-player?id=${id}`, {
        method: "DELETE",
        cache: "no-store",
        next: { revalidate: 0 },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Silme başarısız");
      }

      getData(); // Listeyi yenile
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Player List</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <li className="bg-white rounded-2xl shadow-md p-4 border hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4">Yeni Oyuncu Gir</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <PlayerInput onSelectPlayer={selectPlayer} />
              <ul>
                <li>Id: {selectedPlayer.id}</li>
                <li>Team: {selectedPlayer.team}</li>
                <li>Age: {selectedPlayer.age}</li>
                <li>
                  Market Value: €
                  {selectedPlayer.market_value
                    ? formatNumber(selectedPlayer.market_value)
                    : ""}
                </li>
              </ul>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded w-full"
              >
                Ekle
              </button>
            </div>
          </form>
        </li>
        {players?.map((player) => (
          <li
            key={player.id}
            className="bg-white rounded-2xl shadow-md p-4 border hover:shadow-lg transition"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-2">{player.name}</h2>
              <button
                type="button"
                className="py-1 px-3 bg-red-500 rounded-md text-white"
                onClick={() => handleDeletePlayer(player.id)}
              >
                Sil
              </button>
            </div>

            <p className="text-gray-600">Age: {player.age}</p>
            <p className="text-gray-600">Team: {player.team}</p>
            <p className="text-gray-800 font-medium mt-2">
              Market Value: €{formatNumber(player.market_value)}
            </p>
            <br />
            <h2 className="text-xl font-semibold mb-2">Güncel</h2>
            <p className="text-gray-600">
              Age: {currentDatas[player.id]?.age ?? "Yükleniyor..."}
            </p>
            <p className="text-gray-600">
              Team: {currentDatas[player.id]?.team ?? "Yükleniyor..."}
            </p>
            <p className="text-gray-800 font-medium mt-2">
              Market Value: €
              {currentDatas[player.id]?.market_value
                ? formatNumber(currentDatas[player.id]?.market_value)
                : "Yükleniyor..."}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
