import Image from "next/image";
import { Player } from "@/types/player.types";
import { formatNumber } from "@/utils/formatNumber";
import { UI_MESSAGES } from "@/lib/constants";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

interface PlayerCardProps {
  player: Player;
  currentData?: Player;
  onDelete: (id: number) => void;
}

const AVATAR_COLORS = [
  'from-amber-700 to-yellow-800 dark:from-amber-600 dark:to-yellow-700',
  'from-orange-700 to-amber-800 dark:from-orange-600 dark:to-amber-700', 
  'from-yellow-700 to-amber-800 dark:from-yellow-600 dark:to-amber-700',
  'from-amber-800 to-orange-900 dark:from-amber-700 dark:to-orange-800',
  'from-yellow-800 to-amber-900 dark:from-yellow-700 dark:to-amber-800',
  'from-orange-800 to-amber-900 dark:from-orange-700 dark:to-amber-800',
  'from-amber-900 to-yellow-950 dark:from-amber-800 dark:to-yellow-900',
  'from-yellow-900 to-orange-950 dark:from-yellow-800 dark:to-orange-900',
];

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

  const displayData = currentData || player;
  const colorIndex = player.id % AVATAR_COLORS.length;
  const avatarColor = AVATAR_COLORS[colorIndex];

  const initials = player.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const valueChange = hasChanges && currentData.market_value !== player.market_value 
    ? ((currentData.market_value - player.market_value) / player.market_value) * 100
    : 0;

  return (
    <Card className="flat-card overflow-hidden hover:bg-accent/50 transition-colors duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 relative w-12 h-12">
            {!imageError ? (
              <div className="w-12 h-12 rounded overflow-hidden relative">
                <Image
                  src={`https://img.sofascore.com/api/v1/player/${player.id}/image`}
                  alt={player.name}
                  width={48}
                  height={48}
                  className="object-cover object-center"
                  onError={() => setImageError(true)}
                  loading="lazy"
                  quality={75}
                  unoptimized={true}
                />
              </div>
            ) : (
              <div 
                className={`w-12 h-12 rounded bg-gradient-to-br ${avatarColor} flex items-center justify-center`}
              >
                <span className="text-white font-bold text-sm">
                  {initials}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight mb-1" title={player.name}>
              {player.name}
            </h3>
            <Badge variant="secondary" className="text-xs flat-button">
              {displayData.team}
            </Badge>
            {hasChanges && currentData.team !== player.team && (
              <p className="text-xs text-muted-foreground mt-1" title={`Önceki: ${player.team}`}>
                Önceki: {player.team}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="flat-button text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Yaş</span>
            <div className="text-right">
              <span className="text-lg font-semibold">
                {displayData.age}
              </span>
              {hasChanges && currentData.age !== player.age && (
                <div className="text-xs text-muted-foreground">
                  Eklenen: {player.age}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-sm text-muted-foreground">Market Değeri</span>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                €{formatNumber(displayData.market_value)}
              </div>
              {hasChanges && currentData.market_value !== player.market_value && (
                <div className="text-xs mt-1 space-y-1">
                  <div className="text-muted-foreground">
                    Eklenen: €{formatNumber(player.market_value)}
                  </div>
                  <div className={`flex items-center gap-1 font-medium ${
                    valueChange > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {valueChange > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>
                      {valueChange > 0 ? '+' : ''}
                      €{formatNumber(Math.abs(currentData.market_value - player.market_value))}
                      {' '}
                      ({Math.abs(valueChange).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 