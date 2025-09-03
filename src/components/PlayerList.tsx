"use client";
import { Player } from "@/types/player.types";
import PlayerCard from "@/components/PlayerCard";
import Pagination from "@/components/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";

interface PlayerListProps {
  players: Player[];
  currentPlayersData: Record<string, any>;
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export default function PlayerList({ 
  players, 
  currentPlayersData, 
  isLoading, 
  onDelete 
}: PlayerListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Oyuncular yükleniyor...</p>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-16">
        <Card className="max-w-md mx-auto flat-card">
          <CardContent className="p-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Sonuç bulunamadı
            </h3>
            <p className="text-muted-foreground text-sm">
              Filtreleri değiştirerek farklı sonuçlar deneyebilirsiniz.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {players.map((player: Player) => (
          <div key={player.id} className="break-inside-avoid mb-4">
            <PlayerCard
              player={player}
              currentData={currentPlayersData[player.player_id]}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Pagination />
      </div>
    </>
  );
} 