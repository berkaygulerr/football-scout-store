import { useState } from "react";
import { Player } from "@/types/player.types";
import { PlayerService } from "@/services/player.service";
import { formatNumber } from "@/utils/formatNumber";
import PlayerInput from "./PlayerInput";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { UserPlus } from "lucide-react";

interface AddPlayerFormProps {
  onPlayerAdded: () => void;
}

const INITIAL_PLAYER: Player = {
  id: 0,
  name: "",
  team: "",
  age: 0,
  market_value: 0,
};

export default function AddPlayerForm({ onPlayerAdded }: AddPlayerFormProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(INITIAL_PLAYER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedPlayer.id) {
      alert("Lütfen bir oyuncu seçin");
      return;
    }

    try {
      setIsSubmitting(true);
      await PlayerService.createPlayer(selectedPlayer);
      setSelectedPlayer(INITIAL_PLAYER);
      onPlayerAdded();
    } catch (error) {
      console.error("Oyuncu eklenirken hata:", error);
      alert("Oyuncu eklenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayerSelect = async (playerId: number) => {
    try {
      const player = await PlayerService.getPlayerById(playerId);
      setSelectedPlayer(player);
    } catch (error) {
      console.error("Oyuncu detayları alınırken hata:", error);
      alert("Oyuncu detayları alınamadı");
    }
  };

  const resetForm = () => {
    setSelectedPlayer(INITIAL_PLAYER);
  };

  return (
    <Card className="flat-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Oyuncu Ekle
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="player-search">
              Oyuncu Ara
            </Label>
            <PlayerInput
              onSelect={handlePlayerSelect}
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          {selectedPlayer.id > 0 && (
            <div className="space-y-4 p-4 bg-muted rounded">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label>İsim</Label>
                  <Input
                    value={selectedPlayer.name}
                    disabled
                    className="flat-input"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Takım</Label>
                  <div className="flex items-center h-9 px-3 rounded bg-input">
                    <Badge variant="secondary" className="flat-button">
                      {selectedPlayer.team}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label>Yaş</Label>
                  <Input
                    value={selectedPlayer.age}
                    disabled
                    className="flat-input"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Market Değeri</Label>
                  <Input
                    value={`€${formatNumber(selectedPlayer.market_value)}`}
                    disabled
                    className="flat-input font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!selectedPlayer.id || isSubmitting}
              className="flex-1 flat-button"
            >
              {isSubmitting ? 'Ekleniyor...' : 'Oyuncuyu Ekle'}
            </Button>
            
            {selectedPlayer.id > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="flat-button"
              >
                Temizle
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 