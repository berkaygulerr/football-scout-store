"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Loader2, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Player } from "@/types/player.types";
import { formatNumber } from "@/utils/formatNumber";

interface AddPlayerToListProps {
  listId: string;
  onPlayerAdded?: (newPlayer?: Player & { notes?: string }) => void;
  existingPlayerIds?: number[]; // Zaten listedeki oyuncu ID'leri
}

export default function AddPlayerToList({ listId, onPlayerAdded, existingPlayerIds = [] }: AddPlayerToListProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { addPlayerToList, searchPlayers, players, fetchPlayers, currentPlayersData, fetchCurrentPlayersData } = useStore();

  // Oyuncuları yükle
  useEffect(() => {
    if (players.length === 0) {
      fetchPlayers();
    }
  }, [players.length, fetchPlayers]);

  // Current data'yı yükle
  useEffect(() => {
    if (players.length > 0) {
      const playerIds = players.map(p => p.player_id);
      fetchCurrentPlayersData(playerIds);
    }
  }, [players, fetchCurrentPlayersData]);



  const handleAddPlayer = async () => {
    if (!selectedPlayer) return;

    setIsAdding(true);
    
    // Modal'ı kapat ve form'u temizle
    setOpen(false);
    setSelectedPlayer(null);
    setSearchQuery("");
    setSearchResults([]);
    setNotes("");

    // Önce callback'i çağır (optimistic update için)
    if (onPlayerAdded) {
      onPlayerAdded({
        ...selectedPlayer,
        notes: notes.trim() || undefined
      });
    }

    // Başarı mesajı
    toast.success("Oyuncu listeye eklendi");

    // Arka planda ekleme işlemini yap
    try {
      await addPlayerToList(listId, {
        player_id: selectedPlayer.player_id,
        notes: notes.trim() || undefined
      });
    } catch (error) {
      console.error('Add player error:', error);
      
      // Hata durumunda listeyi yenile
      if (onPlayerAdded) {
        onPlayerAdded();
      }
      
      toast.error("Oyuncu eklenirken hata oluştu");
    } finally {
      setIsAdding(false);
    }
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlayer(null);
    setSearchQuery("");
    setSearchResults([]);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Oyuncu Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Listeye Oyuncu Ekle</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedPlayer ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Oyuncu Ara</Label>
                <Input
                  id="search"
                  placeholder="Oyuncu adı veya takım adı girin..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // Otomatik arama
                    if (e.target.value.trim()) {
                      const results = searchPlayers(e.target.value);
                      // Zaten listedeki oyuncuları filtrele
                      const filteredResults = results.filter(player => 
                        !existingPlayerIds.includes(player.player_id)
                      );
                      setSearchResults(filteredResults);
                    } else {
                      setSearchResults([]);
                    }
                  }}
                />
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <Label>Arama Sonuçları</Label>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {searchResults.map((player) => {
                      const currentData = currentPlayersData[player.player_id];
                      const hasChanges = currentData && (
                        player.team !== currentData.team ||
                        player.age !== currentData.age ||
                        player.market_value !== currentData.market_value
                      );
                      
                      const displayData = currentData || player;
                      const valueChange = currentData ? currentData.market_value - player.market_value : 0;
                      const isNewValue = player.market_value === 0 && valueChange > 0;
                      const valueChangePercent = isNewValue
                        ? "Yeni"
                        : player.market_value > 0
                          ? Math.abs(Math.round((valueChange / player.market_value) * 100))
                          : 0;

                      // Avatar renkleri
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
                      const randomColorClass = AVATAR_COLORS[player.name.length % AVATAR_COLORS.length];

                      return (
                        <Card 
                          key={player.id} 
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handlePlayerSelect(player)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className="flex-shrink-0">
                                <div
                                  className={`flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br ${randomColorClass} shadow-sm`}
                                >
                                  <span className="text-white font-bold text-sm">
                                    {player.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>

                              {/* Oyuncu Bilgileri */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-sm leading-tight">
                                    {player.name}
                                  </h4>
                                </div>

                                {/* Takım */}
                                {hasChanges && currentData && currentData.team !== player.team ? (
                                  <div className="flex items-center gap-1 mb-2">
                                    <Badge variant="outline" className="text-xs text-muted-foreground">
                                      {player.team}
                                    </Badge>
                                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                    <Badge variant="secondary" className="text-xs">
                                      {currentData.team}
                                    </Badge>
                                  </div>
                                ) : (
                                  <Badge variant="secondary" className="text-xs mb-2">
                                    {displayData.team}
                                  </Badge>
                                )}

                                {/* Yaş ve Değer - PlayerCard yapısına göre */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">Yaş</span>
                                    <div className="text-right">
                                      {hasChanges && currentData && currentData.age !== player.age ? (
                                        <div className="flex items-center justify-end gap-1">
                                          <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                                            {player.age}
                                          </Badge>
                                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                          <span className="text-sm font-semibold tabular-nums">{displayData.age}</span>
                                        </div>
                                      ) : (
                                        <span className="text-sm font-semibold tabular-nums">{displayData.age}</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-start justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">Değer</span>
                                    <div className="text-right">
                                      {hasChanges && currentData && currentData.market_value !== player.market_value ? (
                                        <div className="flex items-center justify-end gap-1.5 mt-1">
                                          <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                                            €{formatNumber(player.market_value)}
                                          </Badge>
                                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                          <span className="text-sm font-bold text-amber-700 dark:text-primary tabular-nums">
                                            €{formatNumber(displayData.market_value)}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="text-sm font-bold text-amber-700 dark:text-primary tabular-nums">
                                          €{formatNumber(displayData.market_value)}
                                        </div>
                                      )}
                                      
                                      {hasChanges && currentData && currentData.market_value !== player.market_value && (
                                        <div
                                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-medium mt-2 ${
                                            valueChange > 0
                                              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                          }`}
                                        >
                                          <span className="text-xs font-bold tabular-nums">
                                            {valueChange > 0 ? "+" : "-"}€{formatNumber(Math.abs(valueChange))}
                                          </span>
                                          <span className={`${valueChange > 0 ? "text-green-600/40 dark:text-green-400/40" : "text-red-600/40 dark:text-red-400/40"}`}>|</span>
                                          {typeof valueChangePercent === "string" ? (
                                            <span className="text-xs font-medium tabular-nums">
                                              {valueChangePercent}
                                            </span>
                                          ) : (
                                            <span className="text-xs font-medium tabular-nums">
                                              {valueChangePercent}%
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Arama kriterlerinize uygun oyuncu bulunamadı.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Seçilen Oyuncu</Label>
                <Card>
                  <CardContent className="p-4">
                    {(() => {
                      const currentData = currentPlayersData[selectedPlayer.player_id];
                      const hasChanges = currentData && (
                        selectedPlayer.team !== currentData.team ||
                        selectedPlayer.age !== currentData.age ||
                        selectedPlayer.market_value !== currentData.market_value
                      );
                      
                      const displayData = currentData || selectedPlayer;
                      const valueChange = currentData ? currentData.market_value - selectedPlayer.market_value : 0;
                      const isNewValue = selectedPlayer.market_value === 0 && valueChange > 0;
                      const valueChangePercent = isNewValue
                        ? "Yeni"
                        : selectedPlayer.market_value > 0
                          ? Math.abs(Math.round((valueChange / selectedPlayer.market_value) * 100))
                          : 0;

                      // Avatar renkleri
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
                      const randomColorClass = AVATAR_COLORS[selectedPlayer.name.length % AVATAR_COLORS.length];

                      return (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div
                                className={`flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br ${randomColorClass} shadow-sm`}
                              >
                                <span className="text-white font-bold text-lg">
                                  {selectedPlayer.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>

                            {/* Oyuncu Bilgileri */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base leading-tight mb-1">
                                {selectedPlayer.name}
                              </h4>

                              {/* Takım */}
                              {hasChanges && currentData && currentData.team !== selectedPlayer.team ? (
                                <div className="flex items-center gap-1 mb-2">
                                  <Badge variant="outline" className="text-xs text-muted-foreground">
                                    {selectedPlayer.team}
                                  </Badge>
                                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                  <Badge variant="secondary" className="text-xs">
                                    {currentData.team}
                                  </Badge>
                                </div>
                              ) : (
                                <Badge variant="secondary" className="text-xs mb-2">
                                  {displayData.team}
                                </Badge>
                              )}

                              {/* Yaş ve Değer - PlayerCard yapısına göre */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-muted-foreground">Yaş</span>
                                  <div className="text-right">
                                    {hasChanges && currentData && currentData.age !== selectedPlayer.age ? (
                                      <div className="flex items-center justify-end gap-1">
                                        <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                                          {selectedPlayer.age}
                                        </Badge>
                                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm font-semibold tabular-nums">{displayData.age}</span>
                                      </div>
                                    ) : (
                                      <span className="text-sm font-semibold tabular-nums">{displayData.age}</span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-start justify-between">
                                  <span className="text-sm font-medium text-muted-foreground">Piyasa Değeri</span>
                                  <div className="text-right">
                                    {hasChanges && currentData && currentData.market_value !== selectedPlayer.market_value ? (
                                      <div className="flex items-center justify-end gap-1.5 mt-1">
                                        <Badge variant="outline" className="text-xs px-1.5 py-0 text-muted-foreground">
                                          €{formatNumber(selectedPlayer.market_value)}
                                        </Badge>
                                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm font-bold text-amber-700 dark:text-primary tabular-nums">
                                          €{formatNumber(displayData.market_value)}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="text-sm font-bold text-amber-700 dark:text-primary tabular-nums">
                                        €{formatNumber(displayData.market_value)}
                                      </div>
                                    )}
                                    
                                    {hasChanges && currentData && currentData.market_value !== selectedPlayer.market_value && (
                                      <div
                                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-medium mt-2 ${
                                          valueChange > 0
                                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                        }`}
                                      >
                                        <span className="text-xs font-bold tabular-nums">
                                          {valueChange > 0 ? "+" : "-"}€{formatNumber(Math.abs(valueChange))}
                                        </span>
                                        <span className={`${valueChange > 0 ? "text-green-600/40 dark:text-green-400/40" : "text-red-600/40 dark:text-red-400/40"}`}>|</span>
                                        {typeof valueChangePercent === "string" ? (
                                          <span className="text-xs font-medium tabular-nums">
                                            {valueChangePercent}
                                          </span>
                                        ) : (
                                          <span className="text-xs font-medium tabular-nums">
                                            {valueChangePercent}%
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notlar (İsteğe bağlı)</Label>
                <Textarea
                  id="notes"
                  placeholder="Bu oyuncu hakkında notlarınızı yazın..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose}>
                  İptal
                </Button>
                <Button onClick={handleAddPlayer} disabled={isAdding}>
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Ekleniyor...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Listeye Ekle
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
