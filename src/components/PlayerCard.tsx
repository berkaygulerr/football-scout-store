import Image from "next/image";
import { Player } from "@/types/player.types";
import { formatNumber } from "@/utils/formatNumber";
import { UI_MESSAGES } from "@/lib/constants";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trash2, TrendingUp, TrendingDown, ChevronRight, Calendar, Edit3, Check, X } from "lucide-react";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { formatDate, formatShortDate } from "@/utils/formatDate";

interface PlayerCardProps {
  player: Player;
  currentData?: any;
  onDelete?: (id: number) => void;
  notes?: string | null;
  onUpdateNotes?: (playerId: number, notes: string) => Promise<void>;
  canEdit?: boolean;
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
  notes,
  onUpdateNotes,
  canEdit = false,
}: PlayerCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes || "");
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(player.player_id);
    }
  };

  const handleEditNotes = () => {
    setIsEditingNotes(true);
    setEditedNotes(notes || "");
  };

  const handleCancelEdit = () => {
    setIsEditingNotes(false);
    setEditedNotes(notes || "");
  };

  const handleSaveNotes = async () => {
    if (!onUpdateNotes) return;
    
    setIsUpdatingNotes(true);
    try {
      await onUpdateNotes(player.player_id, editedNotes);
      setIsEditingNotes(false);
    } catch (error) {
      console.error('Not güncelleme hatası:', error);
      // Hata durumunda düzenleme modunu kapatma, kullanıcı tekrar deneyebilsin
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  const hasChanges = currentData && (
    player.team !== currentData.team ||
    player.age !== currentData.age ||
    player.market_value !== currentData.market_value
  );

  // Player null kontrolü
  if (!player) {
    return (
      <Card className="flat-card overflow-hidden mb-4 w-full">
        <CardContent className="p-5">
          <div className="text-center text-muted-foreground">
            Oyuncu bilgileri yükleniyor...
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayData = currentData || player;
  const valueChange = currentData ? currentData.market_value - player.market_value : 0;
  // Değer değişimi bilgileri
  const isNewValue = player.market_value === 0 && valueChange > 0;
  const valueChangePercent = isNewValue
    ? "Yeni" // Başlangıç değeri 0 ise ve değişim varsa "Yeni" göster
    : player.market_value > 0
      ? Math.abs(Math.round((valueChange / player.market_value) * 100))
      : 0;

  const randomColorClass = AVATAR_COLORS[player.name.length % AVATAR_COLORS.length];

  return (
    <Card className="flat-card overflow-hidden mb-4 w-full">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div
              className={`flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br ${randomColorClass} shadow-sm`}
            >
              <span className="text-white font-bold text-xl">
                {player.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3
                className="font-semibold text-base leading-tight font-heading"
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
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {player.team}
                </Badge>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs font-medium">
                  {currentData.team}
                </Badge>
              </div>
            ) : (
              <Badge variant="secondary" className="text-xs flat-button mb-1 px-2 py-0.5">
                {displayData.team}
              </Badge>
            )}
          </div>

          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="flat-button text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground font-display">Yaş</span>
            <div className="text-right">
              {hasChanges && currentData && currentData.age !== player.age ? (
                <div className="flex items-center justify-end gap-1">
                  <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                    {player.age}
                  </Badge>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-semibold tabular-nums">{displayData.age}</span>
                </div>
              ) : (
                <span className="text-lg font-semibold tabular-nums">{displayData.age}</span>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-sm font-medium text-muted-foreground font-display">Piyasa Değeri</span>
            <div className="text-right">
              {hasChanges &&
                currentData &&
                currentData.market_value !== player.market_value ? (
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                    €{formatNumber(player.market_value)}
                  </Badge>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-bold text-amber-700 dark:text-primary tabular-nums">
                    €{formatNumber(displayData.market_value)}
                  </span>
                </div>
              ) : (
                <div className="text-lg font-bold text-amber-700 dark:text-primary tabular-nums">
                  €{formatNumber(displayData.market_value)}
                </div>
              )}
              
              {hasChanges &&
                currentData &&
                currentData.market_value !== player.market_value && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-medium mt-2 ${
                      valueChange > 0
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    <span className="text-sm font-bold tabular-nums">
                      {valueChange > 0 ? "+" : "-"}€{formatNumber(Math.abs(valueChange))}
                    </span>
                    <span className={`${valueChange > 0 ? "text-green-600/40 dark:text-green-400/40" : "text-red-600/40 dark:text-red-400/40"}`}>|</span>
                    {typeof valueChangePercent === "string" ? (
                      <span className="text-sm font-medium tabular-nums">
                        {valueChangePercent}
                      </span>
                    ) : (
                      <span className="text-sm font-medium tabular-nums">
                        {valueChangePercent}%
                      </span>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Notlar */}
          {(notes || canEdit) && (
            <div className="mt-3 pt-3 border-t border-muted">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-muted-foreground">Notlar:</div>
                {canEdit && !isEditingNotes && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditNotes}
                    className="h-6 w-6 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {isEditingNotes ? (
                <div className="space-y-2">
                  <Textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Notlarınızı buraya yazın..."
                    className="min-h-[60px] text-sm"
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {editedNotes.length}/500 karakter
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={isUpdatingNotes}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveNotes}
                        disabled={isUpdatingNotes}
                        className="h-6 w-6 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                notes && (
                  <p className="text-sm text-foreground leading-relaxed">
                    {notes}
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}