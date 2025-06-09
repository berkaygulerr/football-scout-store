"use client";
import { usePlayerSearch } from "@/hooks/usePlayerSearch";
import { PlayerService } from "@/services/player.service";

interface PlayerInputProps {
  onSelect: (playerId: number) => void;
  disabled?: boolean;
  className?: string;
}

export default function PlayerInput({ onSelect, disabled, className }: PlayerInputProps) {
  const {
    query,
    results,
    isSearching,
    showResults,
    updateQuery,
    hideResults,
    setQuery,
  } = usePlayerSearch();

  const handlePlayerSelect = async (playerId: number, playerName: string) => {
    setQuery(playerName);
    hideResults();
    onSelect(playerId);
  };

  return (
    <div className={`relative w-full ${className || ''}`}>
      <input
        type="text"
        placeholder="Futbolcu Adı"
        value={query}
        onChange={(e) => updateQuery(e.target.value)}
        disabled={disabled}
        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
      />
      
      {isSearching && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 shadow-lg p-2">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Aranıyor...</p>
        </div>
      )}
      
      {showResults && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 shadow-lg max-h-80 overflow-y-auto">
          {results.map((player) => (
            <li
              key={player.id}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-colors"
              onClick={() => handlePlayerSelect(player.id, player.name)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">{player.name}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{player.team}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {showResults && results.length === 0 && query.trim() && !isSearching && (
        <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mt-1 shadow-lg p-2">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sonuç bulunamadı</p>
        </div>
      )}
    </div>
  );
}
