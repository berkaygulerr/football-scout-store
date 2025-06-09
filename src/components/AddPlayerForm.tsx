import { useState } from "react";
import { Player } from "@/types/player.types";
import { PlayerService } from "@/services/player.service";
import { formatNumber } from "@/utils/formatNumber";
import PlayerInput from "./PlayerInput";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";

interface AddPlayerFormProps {
  onPlayerAdded: () => void;
}

export default function AddPlayerForm({ onPlayerAdded }: AddPlayerFormProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player>({
    id: 0,
    name: "",
    team: "",
    age: 0,
    market_value: 0,
  });
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
      
      // Formu temizle
      setSelectedPlayer({
        id: 0,
        name: "",
        team: "",
        age: 0,
        market_value: 0,
      });
      
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
    setSelectedPlayer({
      id: 0,
      name: "",
      team: "",
      age: 0,
      market_value: 0,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        ➕ Oyuncu Ekle
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Oyuncu Ara
          </label>
          <PlayerInput
            onSelect={handlePlayerSelect}
            disabled={isSubmitting}
            className="w-full"
          />
        </div>

        {selectedPlayer && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  İsim
                </label>
                <input
                  type="text"
                  value={selectedPlayer.name}
                  disabled
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Takım
                </label>
                <input
                  type="text"
                  value={selectedPlayer.team}
                  disabled
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Yaş
                </label>
                <input
                  type="text"
                  value={selectedPlayer.age}
                  disabled
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Market Değeri
                </label>
                <input
                  type="text"
                  value={formatNumber(selectedPlayer.market_value)}
                  disabled
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            disabled={!selectedPlayer || isSubmitting}
            isLoading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Ekleniyor...' : 'Oyuncuyu Ekle'}
          </Button>
        </div>
      </form>
    </div>
  );
} 