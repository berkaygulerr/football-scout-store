"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ArrowLeft, 
  UserPlus, 
  UserMinus,
  Calendar
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

interface FollowerUser {
  user_id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  followed_at: string;
  is_following?: boolean;
}

export default function UserFollowersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // User henüz yüklenmemişse bekle
      if (user === null) {
        return;
      }
      
      // User yüklendi ama giriş yapmamışsa login'e yönlendir
      if (user === false) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Önce kullanıcı bilgilerini al
        const profileResponse = await fetch(`/api/profile/${username}`);
        if (!profileResponse.ok) {
          setError("Kullanıcı bulunamadı");
          return;
        }
        const profileData = await profileResponse.json();
        setProfileUser(profileData.profile);
        
        // Takipçileri getir
        const response = await fetch(`/api/follow/followers?user_id=${profileData.profile.user_id}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
    
            setFollowers(data.data);
          } else {
            setError("Takipçiler yüklenirken hata oluştu");
          }
        } else {
          setError("Takipçiler yüklenirken hata oluştu");
        }
      } catch (err) {
        console.error('Followers fetch error:', err);
        setError("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router, username]);

  const handleFollow = async (userId: string, username: string) => {
    try {
      setFollowing(userId);
      console.log('Attempting to follow:', { userId, username });
      
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_user_id: userId,
          action: 'follow'
        }),
      });

      console.log('Follow response status:', response.status);
      const data = await response.json();
      console.log('Follow response data:', data);

      if (response.ok) {
        if (data.success) {
          toast.success(`${username} kullanıcısını takip etmeye başladınız`);
          // Takipçi listesini güncelle
          setFollowers(prev => prev.map(follower => 
            follower.user_id === userId 
              ? { ...follower, is_following: true }
              : follower
          ));
        } else {
          toast.error(data.error || "Takip işlemi başarısız");
        }
      } else {
        toast.error(data.error || "Takip işlemi başarısız");
      }
    } catch (err) {
      console.error('Follow error:', err);
      toast.error("Bir hata oluştu");
    } finally {
      setFollowing(null);
    }
  };

  const handleUnfollow = async (userId: string, username: string) => {
    try {
      setFollowing(userId);
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_user_id: userId,
          action: 'unfollow'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(`${username} kullanıcısının takibini bıraktınız`);
          // Takipçi listesini güncelle
          setFollowers(prev => prev.map(follower => 
            follower.user_id === userId 
              ? { ...follower, is_following: false }
              : follower
          ));
        } else {
          toast.error(data.error || "Takibi bırakma işlemi başarısız");
        }
      } else {
        toast.error("Takibi bırakma işlemi başarısız");
      }
    } catch (err) {
      console.error('Unfollow error:', err);
      toast.error("Bir hata oluştu");
    } finally {
      setFollowing(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Takipçiler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="gap-2 p-2 h-auto hover:bg-muted/50"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
                         {profileUser?.full_name || profileUser?.username}&apos;in Takipçileri
          </h1>
          <p className="text-muted-foreground">
            {followers.length} takipçi
          </p>
        </div>
      </div>

      {/* Followers List */}
      {followers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz takipçi yok</h3>
            <p className="text-muted-foreground">
              Bu kullanıcının henüz takipçisi bulunmuyor.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {followers.map((follower) => (
            <Card key={follower.user_id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={follower.avatar_url} alt={follower.username} />
                      <AvatarFallback>
                        {follower.full_name?.charAt(0) || follower.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/profile/${follower.username}`} className="hover:underline">
                          <h3 className="font-semibold">{follower.full_name || follower.username}</h3>
                        </Link>
                        <Badge variant="secondary" className="text-xs">
                          @{follower.username}
                        </Badge>
                      </div>
                      {follower.bio && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {follower.bio}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(follower.followed_at), { 
                            addSuffix: true, 
                            locale: tr 
                          })} takip etmeye başladı
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {user && follower.user_id !== user.id && (
                    <div className="flex gap-2">

                      {follower.is_following ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnfollow(follower.user_id, follower.username)}
                          disabled={following === follower.user_id}
                          className="gap-2"
                        >
                          <UserMinus className="h-4 w-4" />
                          {following === follower.user_id ? "İşleniyor..." : "Takibi Bırak"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleFollow(follower.user_id, follower.username)}
                          disabled={following === follower.user_id}
                          className="gap-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          {following === follower.user_id ? "İşleniyor..." : "Takip Et"}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
