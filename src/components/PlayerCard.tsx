import Image from "next/image";
import { Player } from "@/types/player.types";
import { formatNumber } from "@/utils/formatNumber";
import { UI_MESSAGES } from "@/lib/constants";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { useState } from "react";

interface PlayerCardProps {
  player: Player;
  currentData?: Player;
  onDelete: (id: number) => void;
}

export default function PlayerCard({ player, currentData, onDelete }: PlayerCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    if (confirm("Bu oyuncuyu silmek istediğinizden emin misiniz?")) {
      onDelete(player.id);
    }
  };

  const hasChanges = currentData && (
    currentData.age !== player.age ||
    currentData.team !== player.team ||
    currentData.market_value !== player.market_value
  );

  // Güncel veri varsa onu, yoksa kayıtlı veriyi ana olarak göster
  const displayData = currentData || player;
  const isDataCurrent = !!currentData;

  // Avatar için renk paleti
  const avatarColors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600', 
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-yellow-400 to-yellow-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-orange-400 to-orange-600',
  ];
  
  // ID'ye göre renk seçimi
  const colorIndex = player.id % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  // İsim ve soyisimden baş harfler
  const initials = player.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow duration-200 min-h-[11rem] flex flex-col">
      {/* Header with Photo */}
      <div className="flex items-start gap-3 p-3">
        {/* Player Photo/Avatar */}
        <div className="flex-shrink-0 relative w-12 h-12">
          {!imageError ? (
            <div className="w-12 h-12 rounded-full overflow-hidden relative">
              <Image
                src={`https://img.sofascore.com/api/v1/player/${player.id}/image`}
                alt={player.name}
                width={48}
                height={48}
                className="object-cover object-center"
                onError={() => setImageError(true)}
                loading="lazy"
                quality={75}
              />
            </div>
          ) : (
            <div 
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-lg`}
            >
              <span className="text-white font-bold text-sm">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight mb-1" title={player.name}>
            {player.name}
          </h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium" title={displayData.team}>
            {displayData.team}
          </p>
          {hasChanges && currentData.team !== player.team && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" title={`Önceki: ${player.team}`}>
              Önceki: {player.team}
            </p>
          )}
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 flex-shrink-0"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 pb-3">
        {/* Current/Display Data */}
        <div className="space-y-3">
          {/* Age */}
          <div className="flex items-start justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Yaş</span>
            <div className="text-right flex-shrink-0">
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100 block">
                {displayData.age}
              </span>
              {hasChanges && currentData.age !== player.age && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Eklenen: {player.age}
                </div>
              )}
            </div>
          </div>

          {/* Market Value */}
          <div className="flex items-start justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Market Değeri</span>
            <div className="text-right flex-shrink-0 min-w-0">
              <div className="text-base font-bold text-green-600 dark:text-green-400">
                €{formatNumber(displayData.market_value)}
              </div>
              {hasChanges && currentData.market_value !== player.market_value && (
                <div className="text-xs mt-1 space-y-0.5">
                  <div className="text-gray-500 dark:text-gray-400">
                    Eklenen: €{formatNumber(player.market_value)}
                  </div>
                  <div className={`font-medium ${
                    currentData.market_value > player.market_value 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {currentData.market_value > player.market_value ? '+' : '-'}
                    €{formatNumber(Math.abs(currentData.market_value - player.market_value))}
                    {' '}
                    ({((Math.abs(currentData.market_value - player.market_value) / player.market_value) * 100).toFixed(1)}%)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 