"use client";

import { useEffect, useRef, useState, Suspense } from "react";

import { useStore } from "@/store/useStore";
import PlayerList from "@/components/PlayerList";
import SidePanel from "@/components/SidePanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import FilterInfo from "@/components/FilterInfo";

// SearchParams kullanımı için ayrı bir bileşen
function PlayersContent() {
  const [mounted, setMounted] = useState(false);
  const hasRequestedRef = useRef(false);
  
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
    setSearchQuery,
    setTeamFilter,
    setSorting,
    setAgeRange,
    resetFilters,

  } = useStore();

  const filteredPlayers = getFilteredPlayers();
  const paginatedPlayers = getPaginatedPlayers();
  
  useEffect(() => {
    setMounted(true);
    // Sayfa yüklendiğinde sadece arama ve takım filtrelerini sıfırla
    // showTransfers filtresini koru
    setSearchQuery('');
    setTeamFilter('');
  }, [setSearchQuery, setTeamFilter]);

  // URL parametreleri kaldırıldı - sadece manuel filtreleme

  useEffect(() => {
    if (!mounted) return;

    if (!hasRequestedRef.current) {
      hasRequestedRef.current = true;
      fetchPlayers().catch(err => console.error("Fetch players error:", err));
    }
  }, [mounted, fetchPlayers]);

  useEffect(() => {
    if (players && players.length > 0) {
      const ids = players.map(p => p.player_id);
      fetchCurrentPlayersData(ids).catch(err => console.error("Fetch current data error:", err));
    }
  }, [players, fetchCurrentPlayersData]);

  const handlePlayerDelete = async (id: number) => {
    try {
      await deletePlayer(id);
    } catch (e) {
      console.error("Delete player error:", e);
    }
  };

  const handlePlayerAdded = () => {
    // Oyuncu eklendiğinde verileri yenile
    fetchPlayers().catch(err => console.error("Fetch players error:", err));
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Uygulama yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
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
    <div className="flex-1">
      <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-card/50 lg:hidden">
        <Badge variant="outline" className="text-sm flat-button">
          <TrendingUp className="h-3 w-3 mr-1" />
          {filteredPlayers.length} / {players?.length || 0} oyuncu
        </Badge>
        
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

      <div className="container mx-auto p-4 lg:p-8 max-w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          <SidePanel onPlayerAdded={handlePlayerAdded} />
          <div className="flex-1">
            <FilterInfo />
            
            {isLoading ? (
              <div className="flex justify-center py-16">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : players && players.length > 0 ? (
              <PlayerList 
                players={paginatedPlayers}
                currentPlayersData={currentPlayersData}
                isLoading={isLoading}
                onDelete={handlePlayerDelete} 
              />
            ) : (
              <div className="text-center py-16 bg-muted/20 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Henüz Oyuncu Yok</h3>
                <p className="text-muted-foreground mb-4">Oyuncu listenize henüz oyuncu eklenmemiş.</p>
                <p className="text-sm mb-4">Yan paneldeki arama kutusunu kullanarak oyuncu ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback bileşeni
function PlayersLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    </div>
  );
}

export default function PlayersPage() {
  return (
    <Suspense fallback={<PlayersLoading />}>
      <PlayersContent />
    </Suspense>
  );
}