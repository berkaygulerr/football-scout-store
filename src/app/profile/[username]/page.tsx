"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { type UserProfilePage } from "@/types/user.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Calendar, 
  Users, 
  Heart, 
  List, 
  ExternalLink, 
  Twitter, 
  Instagram,
  UserPlus,
  UserMinus,
  Edit,
  Plus,
  Globe,
  Lock,
  Trash2
} from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import { formatDate } from "@/utils/formatDate";
import { useFollow } from "@/hooks/useFollow";
import { toast } from "sonner";
import Link from "next/link";

export default function UserProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfilePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total_likes: 0, lists_count: 0 });
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<{ id: string; title: string } | null>(null);

  const username = params.username as string;
  
  // Takip sistemi
  const { followStatus, actionLoading, toggleFollow } = useFollow(profile?.user_id || '');

  // Liste silme fonksiyonu
  const handleDeleteList = (listId: string, listTitle: string) => {
    setListToDelete({ id: listId, title: listTitle });
    setDeleteModalOpen(true);
  };

  const confirmDeleteList = async () => {
    if (!listToDelete || !user) return;

    try {
      const supabase = createBrowserSupabaseClient();

      const { error } = await supabase
        .from('player_lists')
        .delete()
        .eq('id', listToDelete.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Delete list error:', error);
        toast.error("Liste silinirken hata oluştu");
        return;
      }

      toast.success("Liste başarıyla silindi");
      
      // Modal'ı kapat
      setDeleteModalOpen(false);
      setListToDelete(null);
      
      // State'i güncelle - silinen listeyi kaldır
      if (profile) {
        setProfile(prev => ({
          ...prev!,
          lists: prev!.lists?.filter(list => list.id !== listToDelete.id),
          stats: {
            ...prev!.stats,
            lists_count: prev!.stats.lists_count - 1
          }
        }));
      }
    } catch (error) {
      console.error('Delete list error:', error);
      toast.error("Bir hata oluştu");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        setLoading(true);
        const supabase = createBrowserSupabaseClient();

                 // Kullanıcı profil bilgilerini getir
         const { data: profileData, error: profileError } = await supabase
           .from('user_profile')
           .select('user_id, username, full_name, avatar_url, created_at, updated_at, bio, website, twitter, instagram')
           .eq('username', username)
           .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            setError("Kullanıcı bulunamadı");
          } else {
            setError("Profil yüklenirken hata oluştu");
          }
          return;
        }

                 // Listeleri al - kendi profilinde tüm listeler, başka profillerde sadece herkese açık
         const isOwnProfile = user?.id === profileData.user_id;
         const { data: listsData, count: listsCount, error: listsError } = await supabase
           .from('player_lists')
           .select(`
             *,
             list_items!list_items_list_id_fkey (
               id
             )
           `, { count: 'exact' })
           .eq('user_id', profileData.user_id)
           .order('created_at', { ascending: false });

         if (listsError) {
           console.error('Lists fetch error:', listsError);
         }

         // Liste öğe sayılarını ve beğeni sayılarını hesapla
         const listsWithCounts = await Promise.all(
           (listsData || []).map(async (list) => {
             // Beğeni sayısını al
             const { count: likeCount } = await supabase
               .from('list_likes')
               .select('*', { count: 'exact', head: true })
               .eq('list_id', list.id);

             return {
               ...list,
               items_count: list.list_items?.length || 0,
               like_count: likeCount || 0
             };
           })
         );

         // Filtreleme: kendi profilinde tüm listeler, başka profillerde sadece herkese açık
         const filteredLists = isOwnProfile 
           ? listsWithCounts 
           : listsWithCounts.filter(list => list.is_public);

         // İstatistikleri hesapla
         const profileStats = {
           lists_count: filteredLists.length, // Filtrelenmiş liste sayısı
           followers_count: 0, // Takip sistemi ile güncellenecek
           following_count: 0, // Takip sistemi ile güncellenecek
           total_likes: 0 // API'den güncellenecek
         };

         // Takip durumunu kontrol et (takip sistemi ile güncellenecek)
         const is_following = false;
         const is_own_profile = user?.id === profileData.user_id;

        setProfile({
          ...profileData,
          stats: profileStats,
          is_following,
          is_own_profile,
          lists: filteredLists // Filtrelenmiş listeler
        });

      } catch (err) {
        console.error("Profil yükleme hatası:", err);
        setError("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user]);

  // Stats API'sini çağır
  useEffect(() => {
    const fetchStats = async () => {
      if (!username) return;

      try {
        const response = await fetch(`/api/profile/${username}/stats`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.data);
          }
        }
      } catch (error) {
        console.error('Stats fetch error:', error);
      }
    };

    fetchStats();
  }, [username]);

  // Beğeni güncellemelerini dinle
  useEffect(() => {
    const handleLikeUpdate = (event: CustomEvent) => {
      const { username: updatedUsername, action } = event.detail;
      if (updatedUsername === username) {
        // Beğeni sayısını güncelle
        setStats(prev => ({
          ...prev,
          total_likes: action === 'like' ? prev.total_likes + 1 : prev.total_likes - 1
        }));
      }
    };

    window.addEventListener('likeUpdated', handleLikeUpdate as EventListener);
    
    return () => {
      window.removeEventListener('likeUpdated', handleLikeUpdate as EventListener);
    };
  }, [username]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg mb-6"></div>
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4">Kullanıcı Bulunamadı</h1>
              <p className="text-muted-foreground mb-6">
                {error || "Aradığınız kullanıcı bulunamadı."}
              </p>
              <Button asChild>
                <Link href="/">Ana Sayfaya Dön</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleFollow = async () => {
    if (!profile || profile.is_own_profile) return;
    
    try {

      await toggleFollow();
      toast.success(
        followStatus.is_following 
          ? `${profile.username} takibi bırakıldı` 
          : `${profile.username} takip edildi`
      );
    } catch (error) {
      console.error('Follow action error:', error);
      toast.error("Takip işlemi başarısız oldu");
    }
  };

  const handleEdit = () => {
    // Profil düzenleme sayfasına yönlendir
    window.location.href = `/profile/${profile.username}/edit`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profil Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} alt={profile.username} />
                  <AvatarFallback className="text-2xl">
                    {profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profil Bilgileri */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">
                      {profile.full_name || profile.username}
                    </h1>
                    <p className="text-muted-foreground mb-2">@{profile.username}</p>
                    
                    {profile.bio && (
                      <p className="text-sm mb-4">{profile.bio}</p>
                    )}

                                         {/* Sosyal Medya Linkleri */}
                     {(profile.website || profile.twitter || profile.instagram) && (
                       <div className="flex gap-4 mb-4">
                         {profile.website && (
                           <a 
                             href={profile.website} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                           >
                             <ExternalLink className="h-4 w-4" />
                             Website
                           </a>
                         )}
                         {profile.twitter && (
                           <a 
                             href={`https://twitter.com/${profile.twitter}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                           >
                             <Twitter className="h-4 w-4" />
                             @{profile.twitter}
                           </a>
                         )}
                         {profile.instagram && (
                           <a 
                             href={`https://instagram.com/${profile.instagram}`} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                           >
                             <Instagram className="h-4 w-4" />
                             @{profile.instagram}
                           </a>
                         )}
                       </div>
                     )}

                    {/* Katılım Tarihi */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(profile.created_at)} tarihinde katıldı
                    </div>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="flex gap-2">
                    {profile.is_own_profile ? (
                      <Button onClick={handleEdit} variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Profili Düzenle
                      </Button>
                                         ) : (
                       <Button 
                         onClick={handleFollow} 
                         variant={followStatus.is_following ? "outline" : "default"}
                         disabled={actionLoading}
                       >
                         {actionLoading ? (
                           "İşleniyor..."
                         ) : followStatus.is_following ? (
                           <>
                             <UserMinus className="h-4 w-4 mr-2" />
                             Takibi Bırak
                           </>
                         ) : (
                           <>
                             <UserPlus className="h-4 w-4 mr-2" />
                             Takip Et
                           </>
                         )}
                       </Button>
                     )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <List className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Listeler</span>
              </div>
              <p className="text-2xl font-bold">{profile.stats.lists_count}</p>
            </CardContent>
          </Card>
          
          <Link href={`/profile/${profile.username}/followers`}>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Takipçiler</span>
                </div>
                <p className="text-2xl font-bold">{followStatus.followers_count}</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href={`/profile/${profile.username}/following`}>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Takip Edilen</span>
                </div>
                <p className="text-2xl font-bold">{followStatus.following_count}</p>
              </CardContent>
            </Card>
          </Link>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Beğeniler</span>
              </div>
              <p className="text-2xl font-bold">{stats.total_likes}</p>
            </CardContent>
          </Card>
        </div>

        {/* Listeler */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Listeler ({profile.stats.lists_count})</CardTitle>
              {profile.is_own_profile && profile.stats.lists_count > 0 && (
                <Button size="sm" asChild>
                  <Link href="/lists/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Liste
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {profile.stats.lists_count === 0 ? (
              <div className="text-center py-8">
                <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {profile.is_own_profile 
                    ? "Henüz liste oluşturmadınız." 
                    : "Bu kullanıcı henüz liste oluşturmamış."
                  }
                </p>
                {profile.is_own_profile && (
                  <Button className="mt-4" asChild>
                    <Link href="/lists/create">İlk Listenizi Oluşturun</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {profile.lists?.map((list) => (
                  <Link key={list.id} href={`/lists/${list.id}`} className="block">
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{list.title}</h3>
                            {list.is_public ? (
                              <Badge variant="secondary" className="text-xs">
                                <Globe className="h-3 w-3 mr-1" />
                                Herkese açık
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                <Lock className="h-3 w-3 mr-1" />
                                Özel
                              </Badge>
                            )}
                          </div>
                          
                          {list.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {list.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {list.items_count || 0} oyuncu
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {list.like_count || 0} beğeni
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(list.created_at)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          {profile.is_own_profile && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                asChild
                              >
                                <Link href={`/lists/${list.id}/edit`}>
                                  <Edit className="h-3 w-3" />
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteList(list.id, list.title);
                                }}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Listeyi Sil</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">"{listToDelete?.title}"</span> listesini silmek istediğinizden emin misiniz?
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
              onClick={confirmDeleteList}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
