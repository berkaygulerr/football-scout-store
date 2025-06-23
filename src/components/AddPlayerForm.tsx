"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { UserPlus, Plus, AlertCircle } from "lucide-react";
import { Player } from "@/types/player.types";
import { PlayerService } from "@/services/player.service";
import PlayerInput from "./PlayerInput";

interface AddPlayerFormProps {
  onPlayerAdded?: () => void;
}

export default function AddPlayerForm({ onPlayerAdded }: AddPlayerFormProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [selectedPlayerData, setSelectedPlayerData] = useState<Player | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>("");

  const { addPlayer, error } = useStore();

  const handlePlayerSelect = async (playerId: number) => {
    try {
      const player = await PlayerService.getPlayerById(playerId);
      setSelectedPlayerId(playerId);
      setSelectedPlayerData(player);
      setFormError("");
    } catch (error) {
      setFormError("Oyuncu detayları alınamadı");
    }
  };

  const resetForm = () => {
    setSelectedPlayerId(null);
    setSelectedPlayerData(null);
    setFormError("");
  };

  const validateForm = (): string | null => {
    if (!selectedPlayerId) {
      return "Lütfen bir oyuncu seçin";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!selectedPlayerData) {
      setFormError("Oyuncu bilgileri eksik");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const playerData: Player = {
        id: selectedPlayerData.id,
        name: selectedPlayerData.name,
        team: selectedPlayerData.team,
        age: selectedPlayerData.age,
        market_value: selectedPlayerData.market_value,
        player_id: selectedPlayerData.player_id,
      };

      await addPlayer(playerData);
      resetForm();
      onPlayerAdded?.();
    } catch (err) {
      // Error is handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = formError || error;

  return (
    <Card className="flat-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Oyuncu Ara ve Ekle
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {displayError && (
          <Alert className="mb-4 flat-card border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {displayError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Oyuncu Ara
            </Label>
            <PlayerInput
              onSelect={handlePlayerSelect}
              disabled={isSubmitting}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Oyuncu adı yazarak arama yapabilirsiniz
            </p>
          </div>

          {selectedPlayerData && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20">
              <p className="text-sm font-medium text-foreground">
                Seçilen Oyuncu:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">İsim:</span>
                  <div className="font-medium">{selectedPlayerData.name}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Takım:</span>
                  <div className="font-medium">{selectedPlayerData.team}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Yaş:</span>
                  <div className="font-medium">{selectedPlayerData.age}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Market Değeri:</span>
                  <div className="font-medium">€{(selectedPlayerData.market_value / 1000000).toFixed(1)}M</div>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || !selectedPlayerId}
            className="w-full flat-button"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Ekleniyor...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Oyuncu Ekle
              </div>
            )}
          </Button>

          {selectedPlayerData && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
              className="w-full flat-button"
            >
              Temizle
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 