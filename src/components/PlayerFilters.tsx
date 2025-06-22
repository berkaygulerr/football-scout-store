"use client";
import { FilterOptions, TeamWithCount } from '@/hooks/useFilters';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Filter } from 'lucide-react';

interface PlayerFiltersProps {
  filters: FilterOptions;
  updateFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  resetFilters: () => void;
  uniqueTeams: string[];
  teamsWithCount: TeamWithCount[];
  totalCount: number;
  filteredCount: number;
}

const handleAgeRangeChange = (
  type: 'min' | 'max',
  value: string,
  currentRange: [number, number],
  updateFilter: (key: 'ageRange', value: [number, number]) => void
) => {
  const numValue = Number(value);
  if (type === 'min') {
    const newMin = Math.max(15, Math.min(numValue, currentRange[1] - 1));
    updateFilter('ageRange', [newMin, currentRange[1]]);
  } else {
    const newMax = Math.min(50, Math.max(numValue, currentRange[0] + 1));
    updateFilter('ageRange', [currentRange[0], newMax]);
  }
};

const handleMarketValueChange = (
  type: 'min' | 'max',
  value: string,
  currentRange: [number, number],
  updateFilter: (key: 'marketValueRange', value: [number, number]) => void
) => {
  const numValue = Number(value);
  if (type === 'min') {
    const newMinM = Math.max(0, Math.min(numValue, currentRange[1] / 1000000 - 1));
    updateFilter('marketValueRange', [newMinM * 1000000, currentRange[1]]);
  } else {
    const newMaxM = Math.min(200, Math.max(numValue, currentRange[0] / 1000000 + 1));
    updateFilter('marketValueRange', [currentRange[0], newMaxM * 1000000]);
  }
};

export default function PlayerFilters({
  filters,
  updateFilter,
  resetFilters,
  uniqueTeams,
  teamsWithCount,
  totalCount,
  filteredCount,
}: PlayerFiltersProps) {
  return (
    <Card className="flat-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
          <Badge variant="outline" className="text-sm font-medium flat-button">
            {filteredCount}/{totalCount}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Oyuncu Ara
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Oyuncu adı, takım..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="flat-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team" className="text-sm font-medium">
            Takım
          </Label>
          <Select 
            value={filters.teamFilter || 'all'} 
            onValueChange={(value) => updateFilter('teamFilter', value === 'all' ? '' : value)}
          >
            <SelectTrigger className="flat-input">
              <SelectValue placeholder="Tüm takımlar" />
            </SelectTrigger>
            <SelectContent className="flat-card">
              <SelectItem value="all">Tüm takımlar</SelectItem>
              {teamsWithCount.map(({ name, count }) => (
                <SelectItem key={name} value={name}>
                  <div className="flex items-center justify-between w-full">
                    <span>{name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs flat-button">
                      {count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Yaş Aralığı
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="minAge" className="text-xs text-muted-foreground">
                Min
              </Label>
              <Input
                id="minAge"
                type="number"
                placeholder="Min yaş"
                value={filters.ageRange[0]}
                onChange={(e) => handleAgeRangeChange('min', e.target.value, filters.ageRange, updateFilter)}
                className="flat-input"
              />
            </div>
            <div>
              <Label htmlFor="maxAge" className="text-xs text-muted-foreground">
                Max
              </Label>
              <Input
                id="maxAge"
                type="number"
                placeholder="Max yaş"
                value={filters.ageRange[1]}
                onChange={(e) => handleAgeRangeChange('max', e.target.value, filters.ageRange, updateFilter)}
                className="flat-input"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Market Değeri Aralığı (M€)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="minValue" className="text-xs text-muted-foreground">
                Min
              </Label>
              <Input
                id="minValue"
                type="number"
                placeholder="Min değer"
                value={Math.round(filters.marketValueRange[0] / 1000000)}
                onChange={(e) => handleMarketValueChange('min', e.target.value, filters.marketValueRange, updateFilter)}
                className="flat-input"
              />
            </div>
            <div>
              <Label htmlFor="maxValue" className="text-xs text-muted-foreground">
                Max
              </Label>
              <Input
                id="maxValue"
                type="number"
                placeholder="Max değer"
                value={Math.round(filters.marketValueRange[1] / 1000000)}
                onChange={(e) => handleMarketValueChange('max', e.target.value, filters.marketValueRange, updateFilter)}
                className="flat-input"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Sıralama
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sortBy" className="text-xs text-muted-foreground">
                Sırala
              </Label>
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => updateFilter('sortBy', value as FilterOptions['sortBy'])}
              >
                <SelectTrigger className="flat-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="flat-card">
                  <SelectItem value="player_id">Eklenme Sırası</SelectItem>
                  <SelectItem value="name">İsim</SelectItem>
                  <SelectItem value="age">Yaş</SelectItem>
                  <SelectItem value="market_value">Market Değeri</SelectItem>
                  <SelectItem value="team">Takım</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sortOrder" className="text-xs text-muted-foreground">
                Yön
              </Label>
              <Select 
                value={filters.sortOrder} 
                onValueChange={(value) => updateFilter('sortOrder', value as FilterOptions['sortOrder'])}
              >
                <SelectTrigger className="flat-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="flat-card">
                  {filters.sortBy === 'player_id' ? (
                    <>
                      <SelectItem value="desc">En Yeni</SelectItem>
                      <SelectItem value="asc">En Eski</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="asc">Artan (A-Z, 0-9)</SelectItem>
                      <SelectItem value="desc">Azalan (Z-A, 9-0)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full flat-button"
        >
          Filtreleri Sıfırla
        </Button>
      </CardContent>
    </Card>
  );
} 