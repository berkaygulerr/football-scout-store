"use client";
import { FilterOptions } from '@/hooks/useFilters';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useState } from 'react';

interface PlayerFiltersProps {
  filters: FilterOptions;
  updateFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  resetFilters: () => void;
  uniqueTeams: string[];
  totalCount: number;
  filteredCount: number;
}

export default function PlayerFilters({
  filters,
  updateFilter,
  resetFilters,
  uniqueTeams,
  totalCount,
  filteredCount,
}: PlayerFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {/* Header - Desktop Only */}
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          🔍 Filtreler
        </h2>
        <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
          {filteredCount}/{totalCount} sonuç
        </span>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            🔍 Ara
          </label>
          <Input
            placeholder="Oyuncu, takım..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="text-sm"
          />
        </div>

        {/* Team Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            🏆 Takım
          </label>
          <select
            value={filters.teamFilter}
            onChange={(e) => updateFilter('teamFilter', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm takımlar</option>
            {uniqueTeams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            📊 Sıralama
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as FilterOptions['sortBy'])}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="player_id">Eklenme Sırası</option>
              <option value="name">İsim</option>
              <option value="age">Yaş</option>
              <option value="market_value">Market Değeri</option>
              <option value="team">Takım</option>
            </select>
            <select
              value={filters.sortOrder}
              onChange={(e) => updateFilter('sortOrder', e.target.value as FilterOptions['sortOrder'])}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filters.sortBy === 'player_id' ? (
                <>
                  <option value="desc">En Yeni</option>
                  <option value="asc">En Eski</option>
                </>
              ) : (
                <>
                  <option value="asc">Artan (A-Z, 0-9)</option>
                  <option value="desc">Azalan (Z-A, 9-0)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Range Filters */}
        <div className="space-y-4">
          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🎂 Yaş Aralığı
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min</div>
                <input
                  type="number"
                  min="15"
                  max="50"
                  value={filters.ageRange[0]}
                  onChange={(e) => {
                    const newMin = Math.max(15, Math.min(Number(e.target.value), filters.ageRange[1] - 1));
                    updateFilter('ageRange', [newMin, filters.ageRange[1]]);
                  }}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max</div>
                <input
                  type="number"
                  min="15"
                  max="50"
                  value={filters.ageRange[1]}
                  onChange={(e) => {
                    const newMax = Math.min(50, Math.max(Number(e.target.value), filters.ageRange[0] + 1));
                    updateFilter('ageRange', [filters.ageRange[0], newMax]);
                  }}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Market Value Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              💰 Market Değeri (M€)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min</div>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={Math.round(filters.marketValueRange[0] / 1000000)}
                  onChange={(e) => {
                    const newMinM = Math.max(0, Math.min(Number(e.target.value), filters.marketValueRange[1] / 1000000 - 1));
                    updateFilter('marketValueRange', [newMinM * 1000000, filters.marketValueRange[1]]);
                  }}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max</div>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={Math.round(filters.marketValueRange[1] / 1000000)}
                  onChange={(e) => {
                    const newMaxM = Math.min(200, Math.max(Number(e.target.value), filters.marketValueRange[0] / 1000000 + 1));
                    updateFilter('marketValueRange', [filters.marketValueRange[0], newMaxM * 1000000]);
                  }}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full text-sm"
          >
            Filtreleri Sıfırla
          </Button>
        </div>
      </div>
    </div>
  );
} 