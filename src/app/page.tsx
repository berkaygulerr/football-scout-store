"use client";
import { useEffect } from "react";
import { usePlayers } from "@/hooks/usePlayers";
import { useFilters } from "@/hooks/useFilters";
import { usePagination } from "@/hooks/usePagination";
import PlayerList from "@/components/PlayerList";
import SidePanel from "@/components/SidePanel";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle, TrendingUp } from "lucide-react";

export default function Home() {
  const {
    players,
    currentPlayersData,
    isLoading,
    error,
    loadPlayers,
    deletePlayer,
  } = usePlayers();

  const {
    filters,
    filteredAndSortedPlayers,
    updateFilter,
    resetFilters,
    uniqueTeams,
    teamsWithCount,
    totalFilteredCount,
    totalCount,
  } = useFilters(players);

  const {
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPrevPage,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    resetPage,
    getPageNumbers,
    startIndex,
    endIndex,
  } = usePagination(filteredAndSortedPlayers, 12);

  useEffect(() => {
    if (currentPage > 1) resetPage();
  }, [
    filters.searchQuery,
    filters.teamFilter,
    filters.ageRange[0],
    filters.ageRange[1],
    filters.marketValueRange[0],
    filters.marketValueRange[1],
    filters.sortBy,
    filters.sortOrder,
  ]);

  const handlePlayerDelete = async (id: number) => {
    try {
      await deletePlayer(id);
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

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
              <Button variant="outline" onClick={loadPlayers} className="mt-3 flat-button">
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
                  {totalFilteredCount}/{totalCount}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <Badge variant="outline" className="text-sm flat-button">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {totalFilteredCount} / {totalCount} oyuncu
                </Badge>
              </div>
              
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={loadPlayers}
                disabled={isLoading}
                size="sm"
                className="flat-button"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Yenile</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <SidePanel
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            uniqueTeams={uniqueTeams}
            teamsWithCount={teamsWithCount}
            totalCount={totalCount}
            filteredCount={totalFilteredCount}
            onPlayerAdded={loadPlayers}
          />

          <div className="flex-1">
            <PlayerList
              isLoading={isLoading}
              paginatedItems={paginatedItems}
              currentPlayersData={currentPlayersData}
              onDelete={handlePlayerDelete}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalFilteredCount}
              startIndex={startIndex}
              endIndex={endIndex}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              goToPage={goToPage}
              nextPage={nextPage}
              prevPage={prevPage}
              setPageSize={setPageSize}
              getPageNumbers={getPageNumbers}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
