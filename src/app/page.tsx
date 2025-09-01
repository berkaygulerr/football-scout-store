"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown, Calendar, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
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

export default function Home() {
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
  } = useStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !hasRequestedRef.current) {
      hasRequestedRef.current = true;
      fetchPlayers().catch(err => console.error("Fetch players error:", err));
    }
  }, [mounted, fetchPlayers]);

  useEffect(() => {
    if (players && players.length > 0) {
      const ids = players.map(p => p.id);
      fetchCurrentPlayersData(ids).catch(err => console.error("Fetch current data error:", err));
    }
  }, [players, fetchCurrentPlayersData]);

  // Keşfet kategorileri
  const categories: CategorySection[] = [
    {
      title: "En Değerli Oyuncular",
      description: "Piyasa değeri en yüksek olan oyuncular",
      icon: Star,
      color: "text-amber-600 dark:text-amber-400",
      href: "/players?sort=market_value&order=desc",
      getPlayers: (players, currentData) => {
        if (!players || !players.length) return [];
        try {
          return [...players].sort((a, b) => b.market_value - a.market_value).slice(0, 3);
        } catch (e) {
          console.error("Sorting error:", e);
          return [];
        }
      }
    },
    {
      title: "En Genç Yetenekler",
      description: "Geleceğin yıldız adayları",
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
      href: "/players?sort=age&order=asc",
      getPlayers: (players, currentData) => {
        if (!players || !players.length) return [];
        try {
          return [...players].sort((a, b) => a.age - b.age).slice(0, 3);
        } catch (e) {
          console.error("Age sorting error:", e);
          return [];
        }
      }
    },
    {
      title: "Değeri En Çok Artanlar",
      description: "Piyasa değeri yükselen oyuncular",
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      href: "/players?sort=value_increase&order=desc",
      getPlayers: (players, currentData) => {
        if (!players || !players.length || !currentData) return [];
        try {
          // Değer artışı olan oyuncuları bul ve yüzdesel artışa göre sırala
          const playersWithIncrease = players
            .filter(player => {
              const current = currentData[player.id];
              return current && current.market_value > player.market_value;
            })
            .map(player => {
              const current = currentData[player.id];
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
      title: "Değeri En Çok Düşenler",
      description: "Piyasa değeri düşen oyuncular",
      icon: TrendingDown,
      color: "text-red-600 dark:text-red-400",
      href: "/players?sort=value_increase&order=asc",
      getPlayers: (players, currentData) => {
        if (!players || !players.length || !currentData) return [];
        try {
          // Değer düşüşü olan oyuncuları bul ve yüzdesel düşüşe göre sırala
          const playersWithDecrease = players
            .filter(player => {
              const current = currentData[player.id];
              return current && current.market_value < player.market_value;
            })
            .map(player => {
              const current = currentData[player.id];
              const percentChange = ((current.market_value - player.market_value) / player.market_value) * 100;
              return { player, percentChange };
            })
            .sort((a, b) => a.percentChange - b.percentChange)
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
      description: "En son takip etmeye başladığınız oyuncular",
      icon: RefreshCw,
      color: "text-purple-600 dark:text-purple-400",
      href: "/players?sort=created_at&order=desc",
      getPlayers: (players, currentData) => {
        if (!players || !players.length) return [];
        try {
          // created_at varsa ona göre sırala, yoksa normal sıralama
          return [...players]
            .sort((a, b) => {
              if (a.created_at && b.created_at) {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
              }
              return 0;
            })
            .slice(0, 3);
        } catch (e) {
          console.error("Created date sorting error:", e);
          return [];
        }
      }
    }
  ];

  const handlePlayerDelete = async (id: number) => {
    try {
      await deletePlayer(id);
    } catch (e) {
      console.error("Delete player error:", e);
    }
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
            <div className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <h3 className="font-medium text-destructive">Hata Oluştu</h3>
                  <p className="text-sm mt-1 text-muted-foreground">{error}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  hasRequestedRef.current = false;
                  fetchPlayers();
                }}
                className="mt-3 flat-button"
              >
                Tekrar Dene
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Oyuncular yükleniyor...</p>
        </div>
      ) : !players || players.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="bg-primary/10 inline-flex rounded-full p-3 mb-4">
            <AlertCircle className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Henüz oyuncu eklenmemiş</h2>
          <p className="text-muted-foreground mb-6">
            Oyuncu ekleyerek takibinize başlayabilirsiniz.
          </p>
          <Button asChild className="flat-button">
            <Link href="/players">Oyuncu Ekle</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map(category => {
            let categoryPlayers: Player[] = [];
            
            try {
              categoryPlayers = category.getPlayers(players, currentPlayersData || {});
            } catch (e) {
              console.error(`Error in category ${category.title}:`, e);
            }
            
            return (
              <section key={category.title} className="border-b border-border pb-12 last:border-0">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="gap-1">
                    <Link href={category.href}>
                      <span>Tümünü Gör</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">{category.description}</p>
                
                {categoryPlayers && categoryPlayers.length > 0 ? (
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {categoryPlayers.map((player) => (
                      <div key={player.id} className="break-inside-avoid mb-6">
                        <PlayerCard
                          player={player}
                          currentData={currentPlayersData?.[player.id]}
                          onDelete={handlePlayerDelete}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">Bu kategoride oyuncu yok</p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}