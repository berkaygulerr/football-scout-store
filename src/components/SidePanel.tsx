"use client";
import { useState } from "react";
import { FilterOptions, TeamWithCount } from "@/hooks/useFilters";
import AddPlayerForm from "@/components/AddPlayerForm";
import PlayerFilters from "@/components/PlayerFilters";
import { Button } from "@/components/ui/Button";

interface SidePanelProps {
  filters: FilterOptions;
  updateFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  resetFilters: () => void;
  uniqueTeams: string[];
  teamsWithCount: TeamWithCount[];
  totalCount: number;
  filteredCount: number;
  onPlayerAdded: () => void;
}

export default function SidePanel({
  filters,
  updateFilter,
  resetFilters,
  uniqueTeams,
  teamsWithCount,
  totalCount,
  filteredCount,
  onPlayerAdded,
}: SidePanelProps) {
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="w-full lg:w-80 space-y-4 md:space-y-0">
      {/* Mobil Görünüm - Oyuncu Ekleme */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsAddPlayerOpen(!isAddPlayerOpen)}
          className="w-full flex items-center justify-between"
        >
          <span>➕ Oyuncu Ekle</span>
          <svg
            className={`h-4 w-4 transition-transform ${isAddPlayerOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        <div className={`
          mt-2
          overflow-hidden
          transition-all duration-200 ease-in-out
          ${isAddPlayerOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <AddPlayerForm onPlayerAdded={onPlayerAdded} />
        </div>
      </div>

      {/* Mobil Görünüm - Filtreler */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="w-full flex items-center justify-between"
        >
          <span>🔍 Filtreler</span>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
              {filteredCount}/{totalCount}
            </span>
            <svg
              className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </Button>
        <div className={`
          mt-2
          overflow-hidden
          transition-all duration-200 ease-in-out
          ${isFiltersOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <PlayerFilters
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            uniqueTeams={uniqueTeams}
            teamsWithCount={teamsWithCount}
            totalCount={totalCount}
            filteredCount={filteredCount}
          />
        </div>
      </div>

      {/* Desktop Görünüm */}
      <div className="hidden lg:space-y-6 lg:block">
        <AddPlayerForm onPlayerAdded={onPlayerAdded} />
        <PlayerFilters
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          uniqueTeams={uniqueTeams}
          teamsWithCount={teamsWithCount}
          totalCount={totalCount}
          filteredCount={filteredCount}
        />
      </div>
    </div>
  );
} 