"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { PlayerListWithItems } from "@/types/list.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Share2, Edit, Trash2, Users, Calendar, Eye, EyeOff, Heart } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { toast } from "sonner";
import Link from "next/link";
import PlayerCard from "@/components/PlayerCard";
import AddPlayerToList from "@/components/AddPlayerToList";
import { useStore } from "@/store/useStore";
import { LikeStatus } from "@/types/like.types";

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [list, setList] = useState<PlayerListWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<{ id: number; name: string } | null>(null);
  const [listDeleteModalOpen, setListDeleteModalOpen] = useState(false);
  const [likeStatus, setLikeStatus] = useState<LikeStatus>({ isLiked: false, likeCount: 0 });
  const [isLiking, setIsLiking] = useState(false);


  
  const { removePlayerFromList, fetchCurrentPlayersData, currentPlayersData: storeCurrentData } = useStore();
  const listId = params.id as string;

  // Tarayıcı geri butonu gibi davran
  const handleGoBack = () => {
    router.back();
  };

  const fetchListData = useCallback(async () => {
    if (!listId) return;

    try {
      setLoading(true);
      setError(null);
      const supabase = createBrowserSupabaseClient();



      // 1. Liste bilgilerini getir
      const { data: listData, error: listError } = await supabase
        .from('player_lists')
        .select('*')
        .eq('id', listId)
        .single();

      if (listError || !listData) {
          setError("Liste bulunamadı");
        return;
        }

      // 2. Özel liste kontrolü
      if (!listData.is_public && (!user || listData.user_id !== user.id)) {
        setError("Bu liste özel ve sadece liste sahibi tarafından görüntülenebilir");
        return;
      }

      // 3. Liste sahibinin profil bilgilerini al
      const { data: profileData } = await supabase
        .from('user_profile')
        .select('username, full_name, avatar_url')
        .eq('user_id', listData.user_id)
        .single();

      // 4. Liste öğelerini getir
      const { data: itemsData, error: itemsError } = await supabase
        .from('list_items')
        .select('*')
        .eq('list_id', listId)
        .order('added_at', { ascending: false });

      if (itemsError) {
        console.error('Liste öğeleri hatası:', itemsError);
        setError("Liste öğeleri yüklenirken hata oluştu");
        return;
      }

      // 5. Oyuncu verilerini getir
      let playersData: any[] = [];
      if (itemsData && itemsData.length > 0) {
        const playerIds = itemsData.map(item => item.player_id);
        const { data: players, error: playersError } = await supabase
          .from('players')
          .select('*')
          .in('id', playerIds);

        if (playersError) {
          console.error('Oyuncu verileri hatası:', playersError);
          setError("Oyuncu verileri yüklenirken hata oluştu");
          return;
        }

        playersData = players || [];
      }

      // 6. Verileri birleştir
      const listWithItems: PlayerListWithItems = {
        ...listData,
        user_profile: profileData,
        items: itemsData?.map(item => ({
          ...item,
          player: playersData.find(p => p.id === item.player_id)
        })) || []
      };

      setList(listWithItems);

    } catch (err) {
      console.error('Liste yükleme hatası:', err);
      setError("Liste yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [listId, user]);

  const handleRemovePlayer = (playerId: number) => {
    if (!list || !user || list.user_id !== user.id) {
      return;
    }

    // Silinecek oyuncuyu bul
    const playerToRemove = list.items.find(item => item.player?.player_id === playerId);
    if (!playerToRemove) return;

    // Modal'ı aç
    setPlayerToDelete({
      id: playerId,
      name: playerToRemove.player?.name || 'Oyuncu'
    });
    setDeleteModalOpen(true);
  };

  const confirmDeletePlayer = async () => {
    if (!playerToDelete || !list) return;

    const playerId = playerToDelete.id;
    const playerToRemove = list.items.find(item => item.player?.player_id === playerId);
    if (!playerToRemove) return;

    // Modal'ı kapat
    setDeleteModalOpen(false);
    setPlayerToDelete(null);

    // Önce UI'dan kaldır (optimistic update)
    const updatedItems = list.items.filter(item => item.player?.player_id !== playerId);
    setList({
      ...list,
      items: updatedItems
    });

    // Başarı mesajı
    toast.success("Oyuncu listeden silindi");

    // Arka planda silme işlemini yap
    try {
      await removePlayerFromList(list.id, playerId);
    } catch (error) {
      console.error('Oyuncu silme hatası:', error);
      
      // Hata durumunda oyuncuyu geri ekle
      setList({
        ...list,
        items: list.items
      });
      
      toast.error("Oyuncu silinirken hata oluştu");
    }
  };

  const handleDeleteList = () => {
    setListDeleteModalOpen(true);
  };

  const confirmDeleteList = async () => {
    if (!list || !user) return;

    try {
      const supabase = createBrowserSupabaseClient();

      // Listeyi sil
      const { error } = await supabase
        .from('player_lists')
        .delete()
        .eq('id', list.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Liste silme hatası:', error);
        toast.error("Liste silinirken hata oluştu");
        return;
      }

      toast.success("Liste başarıyla silindi");
      setListDeleteModalOpen(false);
      
      // Profil sayfasına yönlendir
      setTimeout(() => {
        if (list.user_profile) {
          router.push(`/profile/${list.user_profile.username}`);
        } else {
          router.push("/");
        }
      }, 100);

    } catch (error) {
      console.error('Liste silme hatası:', error);
      toast.error("Bir hata oluştu");
    }
  };

  const handleUpdateNotes = async (playerId: number, notes: string) => {
    if (!list) return;

    try {
      const response = await fetch(`/api/lists/${listId}/update-notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          notes: notes.trim() || null,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Not güncellenirken hata oluştu';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error response parse hatası:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Local state'i güncelle
      setList(prevList => {
        if (!prevList) return prevList;
        
        return {
          ...prevList,
          items: prevList.items.map(item => 
            item.player?.player_id === playerId 
              ? { ...item, notes: notes.trim() || null }
              : item
          )
        };
      });

      toast.success("Not başarıyla güncellendi");
    } catch (error) {
      console.error('Not güncelleme hatası:', error);
      toast.error(error instanceof Error ? error.message : "Not güncellenirken hata oluştu");
      throw error; // PlayerCard'ın error handling'i için
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
        await navigator.clipboard.writeText(url);
        toast.success("Liste linki kopyalandı");
    } catch (error) {
      toast.error("Link kopyalanamadı");
    }
  };

  const fetchLikeStatus = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/lists/${listId}/like-status`);
      if (response.ok) {
        const data = await response.json();
        setLikeStatus(data.data);
      }
    } catch (error) {
      console.error('Beğeni durumu hatası:', error);
    }
  }, [user, listId]);

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      const action = likeStatus.isLiked ? 'unlike' : 'like';
      const response = await fetch(`/api/lists/${listId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Optimistic update
        setLikeStatus(prev => ({
          isLiked: action === 'like',
          likeCount: action === 'like' ? prev.likeCount + 1 : prev.likeCount - 1
        }));

        // Beğeni durumunu yenile
        await fetchLikeStatus();
        
        // Profil sayfasındaki beğeni sayısını güncellemek için event dispatch et
        if (list?.user_profile?.username) {
          window.dispatchEvent(new CustomEvent('likeUpdated', {
            detail: { username: list.user_profile.username, action }
          }));
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Beğeni işlemi başarısız");
      }
    } catch (error) {
      console.error('Beğeni hatası:', error);
      toast.error("Beğeni işlemi başarısız");
    } finally {
      setIsLiking(false);
    }
  };

  useEffect(() => {
    fetchListData();
  }, [listId, fetchListData]);

  useEffect(() => {
    if (user && list) {
      fetchLikeStatus();
    }
  }, [user, list, fetchLikeStatus]);

  // Current data'yı sadece liste değiştiğinde fetch et
  useEffect(() => {
    if (list && list.items.length > 0) {
      const playerIds = list.items
        .map(item => item.player?.player_id)
        .filter((id): id is number => id !== undefined);

      if (playerIds.length > 0) {
        // Herkes store'dan current data alsın
        fetchCurrentPlayersData(playerIds).catch(error => {
          console.error('Store current data fetch hatası:', error);
        });
      }
    }
  }, [list, fetchCurrentPlayersData]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Liste yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive mb-2">Hata</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
                        <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
          </div>
          </Card>
        </div>
    );
  }

  if (!list) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Liste Bulunamadı</h3>
            <p className="text-muted-foreground mb-4">Aradığınız liste mevcut değil.</p>
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === list.user_id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="gap-2 p-2 h-auto hover:bg-muted/50 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold truncate">{list.title}</h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {/* Beğeni Butonu */}
            {user && !isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`gap-1 sm:gap-2 ${likeStatus.isLiked ? 'text-red-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/50' : ''}`}
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${likeStatus.isLiked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">
                  {likeStatus.isLiked ? 'Beğenildi' : 'Beğen'}
                </span>
              </Button>
            )}

            {/* Like sayısını herkese göster */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span>{likeStatus.likeCount}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1 sm:gap-2"
            >
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Paylaş</span>
            </Button>
            
            {isOwner && (
              <>
                <Button asChild variant="outline" size="sm" className="gap-1 sm:gap-2">
                  <Link href={`/lists/${listId}/edit`}>
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Düzenle</span>
            </Link>
          </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 sm:gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                  onClick={handleDeleteList}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Sil</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Liste Bilgileri */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
                     {/* Liste Sahibi */}
                     {list.user_profile && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {list.user_profile.username.charAt(0).toUpperCase()}
                         </span>
                       </div>
                  <Link 
                    href={`/profile/${list.user_profile.username}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {list.user_profile.username}
                  </Link>
                </div>
              )}
              
              {/* Liste Açıklaması */}
              {list.description && (
                <p className="text-muted-foreground">{list.description}</p>
              )}
              
              {/* Liste Bilgileri */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                
                <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                  <span>{list.items.length} oyuncu</span>
                      </div>
                
                <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                  <span>{formatDate(list.created_at)} tarihinde oluşturuldu</span>
                      </div>
                
                <div className="flex items-center gap-2">
                        {list.is_public ? (
                          <>
                      <Eye className="h-4 w-4" />
                      <span>Herkese açık</span>
                          </>
                        ) : (
                          <>
                      <EyeOff className="h-4 w-4" />
                      <span>Özel</span>
                          </>
                        )}
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>

        {/* Oyuncu Listesi */}
        {list.items.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Henüz Oyuncu Yok</h3>
                <p className="text-muted-foreground mb-4">
                Bu listeye henüz oyuncu eklenmemiş.
              </p>
              {isOwner && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Aşağıdaki &ldquo;Oyuncu Ekle&rdquo; butonunu kullanarak oyuncu ekleyebilirsiniz.
                  </p>
                  <AddPlayerToList 
                    listId={list.id} 
                    onPlayerAdded={(newPlayer) => {
                      // Optimistic update: Yeni oyuncuyu hemen listeye ekle
                      if (newPlayer && list) {
                        const newItem = {
                          id: `temp-${Date.now()}`, // Geçici ID
                          list_id: list.id,
                          player_id: newPlayer.player_id,
                          added_at: new Date().toISOString(),
                          notes: "",
                          player: newPlayer
                        };
                        
                        setList(prev => prev ? {
                          ...prev,
                          items: [newItem, ...prev.items]
                        } : null);
                        
                        toast.success("Oyuncu listeye eklendi");
                      }
                    }}
                    existingPlayerIds={[]}
                  />
                </div>
              )}
            </div>
            </Card>
          ) : (
          <div className="space-y-4">
            {/* Oyuncu Listesi Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Oyuncular ({list.items.length})</h2>
              {isOwner && (
                <AddPlayerToList 
                    listId={list.id} 
                    onPlayerAdded={(newPlayer) => {
                    // Optimistic update: Yeni oyuncuyu hemen listeye ekle
                    if (newPlayer && list) {
                      const newItem = {
                        id: `temp-${Date.now()}`, // Geçici ID
                        list_id: list.id,
                        player_id: newPlayer.player_id,
                        added_at: new Date().toISOString(),
                        notes: newPlayer.notes || null,
                        player: newPlayer
                      };
                      
                      setList(prevList => ({
                        ...prevList!,
                        items: [...prevList!.items, newItem]
                      }));
                    } else {
                      // Fallback: Listeyi yenile
                      fetchListData();
                    }
                                      }}
                    existingPlayerIds={list.items.map(item => item.player?.player_id).filter(Boolean) as number[]}
                  />
              )}
            </div>
            
            {/* Oyuncu Kartları */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {list.items.map((item) => {
                const playerId = item.player?.player_id;
                // Herkes store'dan current data alsın
                const currentData = playerId ? storeCurrentData[playerId] : undefined;
                


                
                return (
                  <div key={item.id} className="break-inside-avoid mb-4">
                  <PlayerCard
                    player={item.player!}
                    currentData={currentData}
                      onDelete={isOwner ? (id: number) => handleRemovePlayer(item.player?.player_id || id) : undefined}
                      notes={item.notes}
                      onUpdateNotes={isOwner ? handleUpdateNotes : undefined}
                      canEdit={isOwner}
                  />
                  </div>
                );
              })}
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Oyuncuyu Sil</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{playerToDelete?.name}</span> oyuncusunu listeden silmek istediğinizden emin misiniz?
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeletePlayer}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* List Delete Confirmation Modal */}
      <Dialog open={listDeleteModalOpen} onOpenChange={setListDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Listeyi Sil</DialogTitle>
            <DialogDescription>
              Bu listeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setListDeleteModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteList}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}