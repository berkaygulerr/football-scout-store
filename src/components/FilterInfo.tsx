"use client";

import { useStore } from "@/store/useStore";
import { Badge } from "./ui/badge";
import { X, Filter, SlidersHorizontal, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { Button } from "./ui/button";
import { formatNumber } from "@/utils/formatNumber";

export default function FilterInfo() {
  const {
    filters,
    players,
    resetFilters,
    getFilteredPlayers,
    setSearchQuery,
    setTeamFilter,
    setAgeRange,
    setMarketValueRange,
    setSorting
  } = useStore();

  const filteredPlayers = getFilteredPlayers();
  const isFiltered = 
    filters.searchQuery !== '' || 
    filters.teamFilter !== '' || 
    filters.ageRange[0] !== 15 || 
    filters.ageRange[1] !== 50 || 
    filters.marketValueRange[0] !== 0 || 
    filters.marketValueRange[1] !== Number.MAX_SAFE_INTEGER; // Değiştirildi
  
  // Varsayılan sıralama dışında bir sıralama var mı?
  const isCustomSorting = filters.sortBy !== 'player_id' || filters.sortOrder !== 'desc';

  // Sıralama seçenekleri için etiketler
  const sortLabels: Record<string, string> = {
    player_id: 'Eklenme Sırası',
    name: 'İsim',
    age: 'Yaş',
    team: 'Takım',
    market_value: 'Piyasa Değeri',
    value_increase: 'Değer Değişimi'
  };

  // Sıralama yönü için özel etiketler
  const getSortOrderLabel = (sortBy: string, order: string): string => {
    const sortTypeSpecificLabels: Record<string, Record<string, string>> = {
      player_id: { asc: 'En Eski', desc: 'En Yeni' },
      name: { asc: 'A-Z', desc: 'Z-A' },
      age: { asc: 'Küçükten Büyüğe', desc: 'Büyükten Küçüğe' },
      team: { asc: 'A-Z', desc: 'Z-A' },
      market_value: { asc: 'Düşükten Yükseğe', desc: 'Yüksekten Düşüğe' },
      created_at: { asc: 'Eskiden Yeniye', desc: 'Yeniden Eskiye' },
      value_increase: { asc: 'Değeri Düşenlerden Artanlara', desc: 'Değeri Artanlardan Düşenlere' }
    };

    return sortTypeSpecificLabels[sortBy]?.[order] || (order === 'asc' ? 'Artan' : 'Azalan');
  };

  if (!players?.length) {
    return null;
  }

  // Hiçbir filtre aktif değilse ve varsayılan sıralama kullanılıyorsa bileşeni gösterme
  if (!isFiltered && !isCustomSorting) {
    return null;
  }

  const clearFilter = (type: string) => {
    switch (type) {
      case 'search':
        setSearchQuery('');
        break;
      case 'team':
        setTeamFilter('');
        break;
      case 'age':
        setAgeRange([15, 50]);
        break;
      case 'value':
        setMarketValueRange([0, Number.MAX_SAFE_INTEGER]); // Değiştirildi
        break;
      case 'sort':
        setSorting('player_id', 'desc');
        break;
      default:
        break;
    }
  };

  // Maksimum değer sonsuz ise "∞" göster
  const displayMaxValue = () => {
    const maxValue = filters.marketValueRange[1];
    if (maxValue === Number.MAX_SAFE_INTEGER) return "∞";
    return formatNumber(maxValue);
  };

  // Sıralama için özel ikon
  const SortIcon = filters.sortOrder === 'asc' ? ArrowUpAZ : ArrowDownAZ;

  return (
    <div className="bg-muted/20 rounded-lg p-3 mb-4 border border-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Aktif Filtreler</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {filteredPlayers.length} / {players.length} oyuncu
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {filters.searchQuery && (
          <Badge variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-1 text-xs">
            <span>Arama: {filters.searchQuery}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 rounded-full hover:bg-background ml-1" 
              onClick={() => clearFilter('search')}
            >
              <X className="h-2.5 w-2.5" />
              <span className="sr-only">Temizle</span>
            </Button>
          </Badge>
        )}
        
        {filters.teamFilter && filters.teamFilter !== 'all' && (
          <Badge variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-1 text-xs">
            <span>Takım: {filters.teamFilter}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 rounded-full hover:bg-background ml-1" 
              onClick={() => clearFilter('team')}
            >
              <X className="h-2.5 w-2.5" />
              <span className="sr-only">Temizle</span>
            </Button>
          </Badge>
        )}
        
        {(filters.ageRange[0] !== 15 || filters.ageRange[1] !== 50) && (
          <Badge variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-1 text-xs">
            <span>Yaş: {filters.ageRange[0]}-{filters.ageRange[1]}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 rounded-full hover:bg-background ml-1" 
              onClick={() => clearFilter('age')}
            >
              <X className="h-2.5 w-2.5" />
              <span className="sr-only">Temizle</span>
            </Button>
          </Badge>
        )}
        
        {(filters.marketValueRange[0] !== 0 || filters.marketValueRange[1] !== Number.MAX_SAFE_INTEGER) && (
          <Badge variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-1 text-xs">
            <span>Değer: €{formatNumber(filters.marketValueRange[0])}-€{displayMaxValue()}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 rounded-full hover:bg-background ml-1" 
              onClick={() => clearFilter('value')}
            >
              <X className="h-2.5 w-2.5" />
              <span className="sr-only">Temizle</span>
            </Button>
          </Badge>
        )}
        
        {/* Sıralama bilgisi - sadece varsayılan dışındaki sıralamalar için göster */}
        {isCustomSorting && (
          <Badge variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-1 text-xs bg-primary/5">
            <SortIcon className="h-3 w-3 text-primary mr-0.5" />
            <span>Sıralama: {sortLabels[filters.sortBy] || filters.sortBy} ({getSortOrderLabel(filters.sortBy, filters.sortOrder)})</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 rounded-full hover:bg-background ml-1" 
              onClick={() => clearFilter('sort')}
            >
              <X className="h-2.5 w-2.5" />
              <span className="sr-only">Temizle</span>
            </Button>
          </Badge>
        )}
        
        {(isFiltered || isCustomSorting) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-7 ml-auto" 
            onClick={resetFilters}
          >
            <SlidersHorizontal className="h-3 w-3 mr-1" />
            Tüm Filtreleri Temizle
          </Button>
        )}
      </div>
    </div>
  );
}