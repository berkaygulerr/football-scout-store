"use client";
import { useState, useEffect } from 'react';
import { BasePlayer } from '@/types/player.types';
import { PlayerService } from '@/services/player.service';

interface PlayerInputProps {
  onSelect: (playerId: number) => void;
  disabled?: boolean;
  className?: string;
}

const SEARCH_DEBOUNCE_MS = 300;
const MAX_RESULTS = 10;
const MIN_QUERY_LENGTH = 2;

export default function PlayerInput({ onSelect, disabled, className }: PlayerInputProps) {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<BasePlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchPlayers = async () => {
      if (query.length >= MIN_QUERY_LENGTH) {
        setIsLoading(true);
        try {
          const results = await PlayerService.searchPlayers(query);
          setPlayers(results);
          setShowResults(true);
        } catch (error) {
          setPlayers([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setPlayers([]);
        setShowResults(false);
      }
    };

    const debounceTimer = setTimeout(searchPlayers, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (player: BasePlayer) => {
    onSelect(player.player_id);
    setQuery('');
    setShowResults(false);
  };

  const hasResults = !isLoading && showResults && players.length > 0;
  const hasNoResults = !isLoading && showResults && players.length === 0 && query.length >= MIN_QUERY_LENGTH;

  return (
    <div className={`relative w-full ${className || ''}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Oyuncu adı girin..."
        disabled={disabled}
        className="w-full bg-input text-foreground placeholder-muted-foreground rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed border-0 shadow-none"
      />
      
      {isLoading && showResults && (
        <div className="absolute z-10 w-full bg-popover rounded mt-1 p-2 border-0 shadow-none">
          <p className="text-muted-foreground text-sm">Aranıyor...</p>
        </div>
      )}

      {hasResults && (
        <ul className="absolute z-10 w-full bg-popover rounded mt-1 max-h-80 overflow-y-auto border-0 shadow-none">
          {players.slice(0, MAX_RESULTS).map((player) => (
            <li
              key={player.player_id}
              className="px-4 py-2 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleSelect(player)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">{player.name}</span>
                <span className="text-muted-foreground text-sm">{player.team}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {hasNoResults && (
        <div className="absolute z-10 w-full bg-popover rounded mt-1 p-2 border-0 shadow-none">
          <p className="text-muted-foreground text-sm">Sonuç bulunamadı</p>
        </div>
      )}
    </div>
  );
}