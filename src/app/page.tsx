"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import PlayerList from "@/components/PlayerList";
import SidePanel from "@/components/SidePanel";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, TrendingUp } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  const { 
    players,
    currentPlayersData,
    isLoading, 
    error,
    fetchPlayers,
    fetchCurrentPlayersData,
    deletePlayer,
    getFilteredPlayers,
    getPaginatedPlayers,
  } = useStore();

  const filteredPlayers = getFilteredPlayers();
  const paginatedPlayers = getPaginatedPlayers();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && players.length === 0 && !isLoading && !error) {
      fetchPlayers();
    }
  }, [mounted, players.length, isLoading, error, fetchPlayers]);

  useEffect(() => {
    if (players.length > 0) {
      const ids = players.map(p => p.id);
      fetchCurrentPlayersData(ids);
    }
  }, [players, fetchCurrentPlayersData]);

  const handlePlayerDelete = async (id: number) => {
    await deletePlayer(id);
  };

  const handlePlayerAdded = () => {
    fetchPlayers();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Uygulama yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="flat-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <h3 className="font-medium text-destructive">Hata Oluştu</h3>
                  <p className="text-sm mt-1 text-muted-foreground">{error}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={fetchPlayers}
                className="mt-3 flat-button"
              >
                Tekrar Dene
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold font-heading flex items-center gap-2">
                ⚽ Oyuncu Yönetimi
              </h1>
              <div className="sm:hidden">
                <Badge variant="secondary" className="text-xs flat-button">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {filteredPlayers.length}/{players.length}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <Badge variant="outline" className="text-sm flat-button">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {filteredPlayers.length} / {players.length} oyuncu
                </Badge>
              </div>

              <ThemeToggle />
              <Button
                variant="outline"
                onClick={fetchPlayers}
                disabled={isLoading}
                size="sm"
                className="flat-button"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Yenile</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <SidePanel onPlayerAdded={handlePlayerAdded} />
          <div className="flex-1">
            <PlayerList 
              players={paginatedPlayers}
              currentPlayersData={currentPlayersData}
              isLoading={isLoading}
              onDelete={handlePlayerDelete} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}
