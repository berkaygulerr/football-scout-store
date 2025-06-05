"use client";
import { useState, useEffect } from "react";

export default function PlayerInput({ onSelectPlayer }: any) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: Number; name: string; team: string }[]
  >([]);
  const [showList, setShowList] = useState(false);

  const fetchPlayer = async (id: Number) => {
    const data = await fetch(`/api/search-player?id=${id}`);
    const player = await data.json();

    onSelectPlayer(player);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      fetch(`/api/players?search=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch(() => setResults([]));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Futbolcu Adı"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowList(true);
        }}
        className="w-full border border-gray-400 rounded px-4 py-2"
      />
      {showList && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow max-h-80 overflow-x-auto">
          {results.map((player, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(player.name);
                fetchPlayer(player.id);
                setShowList(false);
              }}
            >
              {player.name} <span className="opacity-50">{player.team}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
