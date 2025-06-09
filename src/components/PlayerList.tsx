"use client";
import { Player } from "@/types/player.types";
import PlayerCard from "@/components/PlayerCard";
import Pagination from "@/components/Pagination";

interface PlayerListProps {
  isLoading: boolean;
  paginatedItems: Player[];
  currentPlayersData: Record<string, Player>;
  onDelete: (id: number) => void;
  // Pagination props
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  getPageNumbers: () => number[];
}

export default function PlayerList({
  isLoading,
  paginatedItems,
  currentPlayersData,
  onDelete,
  // Pagination props
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startIndex,
  endIndex,
  hasNextPage,
  hasPrevPage,
  goToPage,
  nextPage,
  prevPage,
  setPageSize,
  getPageNumbers,
}: PlayerListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Oyuncular yükleniyor...</p>
      </div>
    );
  }

  if (paginatedItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Sonuç bulunamadı
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Filtreleri değiştirerek farklı sonuçlar deneyebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {paginatedItems.map((player) => (
          <div key={player.id} className="break-inside-avoid mb-6">
            <PlayerCard
              player={player}
              currentData={currentPlayersData[player.id]}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
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
    </>
  );
} 