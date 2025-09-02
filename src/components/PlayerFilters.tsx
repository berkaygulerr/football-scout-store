"use client";
import { useStore } from "@/store/useStore";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Filter } from 'lucide-react';


const getSortLabel = (sortBy: string, sortOrder: 'asc' | 'desc'): string => {
  const labels = {
    player_id: { asc: 'En Eski', desc: 'En Yeni' },
    name: { asc: 'A-Z', desc: 'Z-A' },
    age: { asc: 'Küçükten Büyüğe', desc: 'Büyükten Küçüğe' },
    team: { asc: 'A-Z', desc: 'Z-A' },
    market_value: { asc: 'Düşükten Yükseğe', desc: 'Yüksekten Düşüğe' },
    created_at: { asc: 'Eskiden Yeniye', desc: 'Yeniden Eskiye' },
    value_increase: { asc: 'Değeri Düşenlerden Artanlara', desc: 'Değeri Artanlardan Düşenlere' }
  };

  return labels[sortBy as keyof typeof labels]?.[sortOrder] || (sortOrder === 'asc' ? 'Artan' : 'Azalan');
};

export default function PlayerFilters() {
  const {
    filters,
    players,
    setSearchQuery,
    setTeamFilter,
    setAgeRange,
    setMarketValueRange,
    setShowTransfers,
    setSorting,
    resetFilters,
    getFilteredPlayers,
    getTeamsWithCount,
    currentPlayersData,
  } = useStore();

  const filteredPlayers = getFilteredPlayers();
  const teamsWithCount = getTeamsWithCount();





  const handleAgeRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    
    if (type === 'min') {
      const newMin = Math.max(15, Math.min(numValue, filters.ageRange[1] - 1));
      setAgeRange([newMin, filters.ageRange[1]]);
    } else {
      const newMax = Math.min(50, Math.max(numValue, filters.ageRange[0] + 1));
      setAgeRange([filters.ageRange[0], newMax]);
    }
  };

  const handleMarketValueChange = (type: 'min' | 'max', value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    
    if (type === 'min') {
      // Minimum değer için maksimum değer sınırı yok (sonsuz olabilir)
      const newMinM = Math.max(0, numValue);
      setMarketValueRange([newMinM * 1000000, filters.marketValueRange[1]]);
    } else {
      // Maksimum değer için sınır yok, sadece minimum değerden büyük olmalı
      const newMaxM = Math.max(numValue, filters.marketValueRange[0] / 1000000 + 1);
      setMarketValueRange([filters.marketValueRange[0], newMaxM * 1000000]);
    }
  };

  // Maksimum değer sonsuz ise "∞" göster, değilse sayısal değeri göster
  const displayMaxValue = () => {
    const maxValue = filters.marketValueRange[1];
    if (maxValue === Number.MAX_SAFE_INTEGER) return "∞";
    return Math.round(maxValue / 1000000);
  };

  return (
    <Card className="flat-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtreler
          </CardTitle>
          <Badge variant="outline" className="text-sm font-medium flat-button">
            {filteredPlayers.length}/{players?.length || 0}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flat-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="team" className="text-sm font-medium">
            Takım
          </Label>
          <Select 
            value={filters.teamFilter || 'all'} 
            onValueChange={(value) => setTeamFilter(value === 'all' ? '' : value)}
          >
            <SelectTrigger className="flat-input">
              <SelectValue placeholder="Tüm takımlar" />
            </SelectTrigger>
            <SelectContent className="flat-card max-h-[300px] overflow-y-auto">
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
                onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                className="flat-input"
                min={15}
                max={49}
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
                onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                className="flat-input"
                min={16}
                max={50}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Piyasa Değeri Aralığı (M€)
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
                onChange={(e) => handleMarketValueChange('min', e.target.value)}
                className="flat-input"
                min={0}
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
                value={displayMaxValue()}
                onChange={(e) => handleMarketValueChange('max', e.target.value)}
                className="flat-input"
                min={1}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-transfers" className="text-sm font-medium cursor-pointer">
              Sadece Transfer Olanlar
            </Label>
            <Switch
              id="show-transfers"
              checked={filters.showTransfers}
              onCheckedChange={setShowTransfers}
            />
          </div>
          
          {filters.showTransfers && (
            <div className="rounded-md bg-purple-50 dark:bg-purple-900/20 p-2 text-xs text-purple-700 dark:text-purple-300">
              <p>Takımı değişen {players?.filter(p => {
                const current = currentPlayersData?.[p.id];
                return current && current.team !== p.team;
              }).length || 0} oyuncu görüntüleniyor.</p>
            </div>
          )}
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
                onValueChange={(value) => setSorting(value as any, filters.sortOrder)}
              >
                <SelectTrigger className="flat-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="flat-card max-h-[200px] overflow-y-auto">
                  <SelectItem value="player_id">Eklenme Sırası</SelectItem>
                  <SelectItem value="name">İsim</SelectItem>
                  <SelectItem value="age">Yaş</SelectItem>
                  <SelectItem value="team">Takım</SelectItem>
                  <SelectItem value="market_value">Piyasa Değeri</SelectItem>
                  <SelectItem value="value_increase">Değer Değişimi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sortOrder" className="text-xs text-muted-foreground">
                Düzen
              </Label>
              <Select 
                value={filters.sortOrder} 
                onValueChange={(value) => setSorting(filters.sortBy, value as any)}
              >
                <SelectTrigger className="flat-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="flat-card max-h-[200px] overflow-y-auto">
                  <SelectItem value="asc">
                    {getSortLabel(filters.sortBy, 'asc')}
                  </SelectItem>
                  <SelectItem value="desc">
                    {getSortLabel(filters.sortBy, 'desc')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full"
        >
          Filtreleri Temizle
        </Button>
      </CardContent>
    </Card>
  );
}