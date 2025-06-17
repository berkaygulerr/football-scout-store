"use client";
import { useEffect } from 'react';
import { usePlayers } from "@/hooks/usePlayers";
import { useFilters } from "@/hooks/useFilters";
import { usePagination } from "@/hooks/usePagination";
import PlayerList from "@/components/PlayerList";
import SidePanel from "@/components/SidePanel";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

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

  // Reset to first page when filters actually change, not when items change
  useEffect(() => {
    // Only reset if we're not on the first page and filters actually changed
    if (currentPage > 1) {
      resetPage();
    }
  }, [
    filters.searchQuery, 
    filters.teamFilter, 
    filters.ageRange[0], 
    filters.ageRange[1], 
    filters.marketValueRange[0], 
    filters.marketValueRange[1], 
    filters.sortBy, 
    filters.sortOrder
  ]);

  const handlePlayerDeleted = async (id: number) => {
    try {
      await deletePlayer(id);
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  if (error) {
  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-6 py-4 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
    <div>
                <h3 className="font-medium">Hata Oluştu</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={loadPlayers}
              className="mt-3"
            >
              Tekrar Dene
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">⚽ Oyuncu Yönetimi</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={loadPlayers}
              isLoading={isLoading}
              size="sm"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Yenile
            </Button>
          </div>
        </div>
            </div>

      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sol Panel - Mobilde üstte */}
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

          {/* Sağ Panel - Ana içerik */}
          <div className="flex-1">
            <PlayerList
              isLoading={isLoading}
              paginatedItems={paginatedItems}
              currentPlayersData={currentPlayersData}
              onDelete={handlePlayerDeleted}
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
