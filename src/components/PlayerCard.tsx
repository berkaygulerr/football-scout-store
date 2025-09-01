import Image from "next/image";
import { Player } from "@/types/player.types";
import { formatNumber } from "@/utils/formatNumber";
import { UI_MESSAGES } from "@/lib/constants";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trash2, TrendingUp, TrendingDown, ChevronRight, Calendar } from "lucide-react";
import { useState } from "react";
import { formatDate, formatShortDate } from "@/utils/formatDate";

interface PlayerCardProps {
  player: Player;
  currentData?: Player;
  onDelete: (id: number) => void;
}

const AVATAR_COLORS = [
  "from-amber-700 to-yellow-800 dark:from-amber-600 dark:to-yellow-700",
  "from-orange-700 to-amber-800 dark:from-orange-600 dark:to-amber-700",
  "from-yellow-700 to-amber-800 dark:from-yellow-600 dark:to-amber-700",
  "from-amber-800 to-orange-900 dark:from-amber-700 dark:to-orange-800",
  "from-yellow-800 to-amber-900 dark:from-yellow-700 dark:to-amber-800",
  "from-orange-800 to-amber-900 dark:from-orange-700 dark:to-amber-800",
  "from-amber-900 to-yellow-950 dark:from-amber-800 dark:to-yellow-900",
  "from-yellow-900 to-orange-950 dark:from-yellow-800 dark:to-orange-900",
];

export default function PlayerCard({
  player,
  currentData,
  onDelete,
}: PlayerCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    if (confirm("Bu oyuncuyu silmek istediğinizden emin misiniz?")) {
      onDelete(player.id);
    }
  };

  const hasChanges = currentData && (
    player.team !== currentData.team ||
    player.age !== currentData.age ||
    player.market_value !== currentData.market_value
  );

  const displayData = currentData || player;
  const valueChange = currentData ? currentData.market_value - player.market_value : 0;
  const valueChangePercent = player.market_value 
    ? Math.round((valueChange / player.market_value) * 100) 
    : 0;

  const randomColorClass = AVATAR_COLORS[player.name.length % AVATAR_COLORS.length];

  return (
    <Card className="flat-card overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div
              className={`flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-br ${randomColorClass}`}
            >
              <span className="text-white font-semibold text-lg">
                {player.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3
                className="font-semibold text-sm leading-tight"
                title={player.name}
              >
                {player.name}
              </h3>
              {player.created_at && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground flex items-center gap-0.5" title={formatDate(player.created_at)}>
                  <Calendar className="h-2.5 w-2.5" />
                  <span>{formatShortDate(player.created_at)}</span>
                </Badge>
              )}
            </div>

            {hasChanges && currentData && currentData.team !== player.team ? (
              <div className="flex flex-wrap items-center gap-1 mb-1">
                <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                  {player.team}
                </Badge>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs px-1.5 py-0 font-medium">
                  {currentData.team}
                </Badge>
              </div>
            ) : (
              <Badge variant="secondary" className="text-xs flat-button mb-1">
                {displayData.team}
              </Badge>
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
              {hasChanges && currentData && currentData.age !== player.age ? (
                <div className="flex items-center justify-end gap-1">
                  <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                    {player.age}
                  </Badge>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-semibold">{displayData.age}</span>
                </div>
              ) : (
                <span className="text-lg font-semibold">{displayData.age}</span>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-sm text-muted-foreground">Piyasa Değeri</span>
            <div className="text-right">
              {hasChanges &&
                currentData &&
                currentData.market_value !== player.market_value ? (
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                    €{formatNumber(player.market_value)}
                  </Badge>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-bold text-amber-700 dark:text-primary">
                    €{formatNumber(displayData.market_value)}
                  </span>
                </div>
              ) : (
                <div className="text-lg font-bold text-amber-700 dark:text-primary">
                  €{formatNumber(displayData.market_value)}
                </div>
              )}
              
              {hasChanges &&
                currentData &&
                currentData.market_value !== player.market_value && (
                  <div
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm font-medium mt-1 ${
                      valueChange > 0
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {valueChange > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>
                      {valueChange > 0 ? "+" : ""}€
                      {formatNumber(Math.abs(valueChange))} ({valueChangePercent}%)
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}