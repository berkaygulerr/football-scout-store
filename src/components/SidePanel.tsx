"use client";
import { useState } from "react";
import { FilterOptions, TeamWithCount } from "@/hooks/useFilters";
import AddPlayerForm from "@/components/AddPlayerForm";
import PlayerFilters from "@/components/PlayerFilters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserPlus, Filter } from "lucide-react";

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
  return (
    <div className="w-full lg:w-80">
      {/* Mobil Görünüm - Sheet ile Çekmece */}
      <div className="lg:hidden">
        <div className="flex gap-2 mb-4">
          {/* Oyuncu Ekleme Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 flat-button">
                <UserPlus className="h-4 w-4 mr-2" />
                Oyuncu Ekle
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] flat-card overflow-y-auto">
              <SheetHeader className="pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Oyuncu Ekle
                </SheetTitle>
                <SheetDescription>
                  Sisteme yeni oyuncu ekleyin
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto pb-6">
                <AddPlayerForm onPlayerAdded={onPlayerAdded} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Filtreler Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 relative flat-button">
                <Filter className="h-4 w-4 mr-2" />
                Filtreler
                <Badge variant="secondary" className="ml-2 text-xs flat-button">
                  {filteredCount}/{totalCount}
                </Badge>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] flat-card overflow-y-auto">
              <SheetHeader className="pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtreler
                </SheetTitle>
                <SheetDescription>
                  Oyuncuları filtreleyin ve sıralayın
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto pb-6">
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
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Görünüm - Normal Statik */}
      <div className="hidden lg:block space-y-6">
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