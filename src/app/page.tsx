"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown, Calendar, Star, ChevronRight, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Player } from "@/types/player.types";
import PlayerCard from "@/components/PlayerCard";

// Kategori bölümleri için tip tanımı
type CategorySection = {
  title: string;
  description: string;
  icon: React.ElementType;
  getPlayers: (players: Player[], currentData: Record<string, Player>) => Player[];
  color: string;
  href: string;
};

// Ana içerik bileşeni
function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const hasRequestedRef = useRef(false);
  const router = useRouter();
  
  const { 
    players,
    currentPlayersData,
    isLoading, 
    error,
    fetchPlayers,
    fetchCurrentPlayersData,
    deletePlayer,
    setSorting,
    setShowTransfers,
    resetFilters,
  } = useStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Kategori butonları için filtreleme fonksiyonu
  const handleCategoryClick = (section: CategorySection) => {
    // Önce filtreleri temizle
    resetFilters();
    
    // Kategoriye göre filtreleme yap
    if (section.title === "Değeri En Çok Artanlar") {
      setSorting('value_increase', 'desc');
    } else if (section.title === "Transfer Olanlar") {
      setShowTransfers(true);
    } else if (section.title === "En Değerli Oyuncular") {
      setSorting('market_value', 'desc');
    } else if (section.title === "En Genç Yetenekler") {
      setSorting('age', 'asc');
    } else if (section.title === "Değeri En Çok Düşenler") {
      setSorting('value_increase', 'asc');
    } else if (section.title === "Son Eklenenler") {
      setSorting('player_id', 'desc');
    }
    
    // Players sayfasına yönlendir
    router.push('/players');
  };

  // Kategori bölümleri tanımları
  const categorySections: CategorySection[] = [
    {
      title: "Değeri En Çok Artanlar",
      description: "Piyasa değeri yükselen oyuncular",
      icon: TrendingUp,
      color: "text-green-500",
      href: "/players",
      getPlayers: (players, currentData) => {
        if (!players || !players.length || !currentData) return [];
        try {
          const playersWithIncrease = players
            .filter(player => {
              const current = currentData[player.player_id];
              return current && current.market_value > player.market_value;
            })
            .map(player => {
              const current = currentData[player.player_id];
              const percentChange = ((current.market_value - player.market_value) / player.market_value) * 100;
              return { player, percentChange };
            })
            .sort((a, b) => b.percentChange - a.percentChange)
            .map(item => item.player);
          
          return playersWithIncrease.slice(0, 3);
        } catch (e) {
          console.error("Value increase sorting error:", e);
          return [];
        }
      }
    },
    {
      title: "Transfer Olanlar",
      description: "Takımı değişen oyuncular",
      icon: ArrowRightLeft,
      color: "text-purple-500",
      href: "/players",
      getPlayers: (players, currentData) => {
        if (!players || !players.length || !currentData) return [];
        try {
          const transferredPlayers = players
            .filter(player => {
              const current = currentData[player.player_id];
              return current && current.team !== player.team;
            })
            .sort((a, b) => {
              // En son transfer olanlar önce
              const aId = a.id || 0;
              const bId = b.id || 0;
              return bId - aId;
            });
          
          return transferredPlayers.slice(0, 3);
        } catch (e) {
          console.error("Transferred players sorting error:", e);
          return [];
        }
      }
    },
    {
      title: "En Değerli Oyuncular",
      description: "En yüksek piyasa değerine sahip oyuncular",
      icon: Star,
      color: "text-amber-500",
      href: "/players",
      getPlayers: (players) => {
        if (!players || !players.length) return [];
        try {
          return [...players]
            .sort((a, b) => b.market_value - a.market_value)
            .slice(0, 3);
        } catch (e) {
          console.error("Most valuable sorting error:", e);
          return [];
        }
      }
    },
    {
      title: "En Genç Yetenekler",
      description: "Gelecek vadeden genç oyuncular",
      icon: Star,
      color: "text-emerald-500",
      href: "/players",
      getPlayers: (players) => {
        if (!players || !players.length) return [];
        try {
          return [...players]
            .sort((a, b) => a.age - b.age)
            .slice(0, 3);
        } catch (e) {
          console.error("Youngest sorting error:", e);
          return [];
        }
      }
    },
    {
      title: "Değeri En Çok Düşenler",
      description: "Piyasa değeri düşen oyuncular",
      icon: TrendingDown,
      color: "text-red-600 dark:text-red-400",
      href: "/players",
      getPlayers: (players, currentData) => {
        if (!players || !players.length || !currentData) return [];
        try {
          const playersWithDecrease = players
            .filter(player => {
              const current = currentData[player.player_id];
              return current && current.market_value < player.market_value;
            })
            .map(player => {
              const current = currentData[player.player_id];
              const percentChange = ((player.market_value - current.market_value) / player.market_value) * 100;
              return { player, percentChange };
            })
            .sort((a, b) => b.percentChange - a.percentChange)
            .map(item => item.player);
          
          return playersWithDecrease.slice(0, 3);
        } catch (e) {
          console.error("Value decrease sorting error:", e);
          return [];
        }
      }
    },
    {
      title: "Son Eklenenler",
      description: "En son eklenen oyuncular",
      icon: Calendar,
      color: "text-blue-500",
      href: "/players",
      getPlayers: (players) => {
        if (!players || !players.length) return [];
        try {
          return [...players]
            .sort((a, b) => {
              const aId = a.id || 0;
              const bId = b.id || 0;
              return bId - aId;
            })
            .slice(0, 3);
        } catch (e) {
          console.error("Recent sorting error:", e);
          return [];
        }
      }
    },
  ];

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
      <div className="container mx-auto p-4 lg:p-8">
        <Card className="p-6">
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
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/20 rounded-lg p-6 border border-border">
            <h1 className="text-2xl font-bold mb-2">Oyuncu Keşfi</h1>
            <p className="text-muted-foreground mb-4">
              Futbol dünyasının yıldızlarını takip edin ve değer değişimlerini izleyin.
            </p>
            <Button asChild className="flat-button">
              <Link href="/players">
                Tüm Oyuncuları Gör
              </Link>
            </Button>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-6 border border-border flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Oyuncu İstatistikleri</h2>
              <Button
                variant="outline"
                onClick={fetchPlayers}
                disabled={isLoading}
                size="sm"
                className="flat-button"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Yenile</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="bg-background/50 rounded p-3 flex flex-col">
                <span className="text-muted-foreground text-xs mb-1">Toplam Oyuncu</span>
                <span className="text-2xl font-bold">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-primary inline" />
                  ) : (
                    players?.length || 0
                  )}
                </span>
              </div>
              <div className="bg-background/50 rounded p-3 flex flex-col">
                <span className="text-muted-foreground text-xs mb-1">Değeri Artan</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-primary inline" />
                  ) : (
                    players?.filter(p => {
                      const current = currentPlayersData?.[p.player_id];
                      return current && current.market_value > p.market_value;
                    }).length || 0
                  )}
                </span>
              </div>
              <div className="bg-background/50 rounded p-3 flex flex-col">
                <span className="text-muted-foreground text-xs mb-1">Değeri Düşen</span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-primary inline" />
                  ) : (
                    players?.filter(p => {
                      const current = currentPlayersData?.[p.player_id];
                      return current && current.market_value < p.market_value;
                    }).length || 0
                  )}
                </span>
              </div>
              <div className="bg-background/50 rounded p-3 flex flex-col">
                <span className="text-muted-foreground text-xs mb-1">Değişmeyen</span>
                <span className="text-2xl font-bold">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-primary inline" />
                  ) : (
                    players?.filter(p => {
                      const current = currentPlayersData?.[p.player_id];
                      return current && current.market_value === p.market_value;
                    }).length || 0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : players && players.length > 0 ? (
          <>
            {categorySections.map((section, index) => {
              const sectionPlayers = section.getPlayers(players, currentPlayersData || {});
              
              if (sectionPlayers.length === 0) return null;
              
              return (
                <div key={index} className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <section.icon className={`h-5 w-5 ${section.color}`} />
                      <h2 className="text-lg font-semibold">{section.title}</h2>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleCategoryClick(section)}
                    >
                      <span className="text-xs">Tümünü Gör</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                  
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {sectionPlayers.map((player) => (
                      <PlayerCard 
                        key={player.id} 
                        player={player}
                        currentData={currentPlayersData?.[player.player_id]}
                        onDelete={deletePlayer}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-center py-16 bg-muted/20 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Henüz Oyuncu Yok</h3>
            <p className="text-muted-foreground mb-4">Oyuncu listenize henüz oyuncu eklenmemiş.</p>
            <p className="text-sm mb-4">Oyuncuları &ldquo;Tüm Oyuncular&rdquo; sayfasından ekleyebilirsiniz.</p>
            <Button asChild className="flat-button">
              <Link href="/players">
                Oyuncu Ekle
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Yükleme durumu için fallback bileşeni
function HomeLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    </div>
  );
}

// Ana sayfa bileşeni
export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}