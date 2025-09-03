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

interface FollowingUser {
  user_id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  followed_at: string;
  is_following?: boolean;
}

export default function UserFollowingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followingLoading, setFollowingLoading] = useState<string | null>(null);
  const [unfollowing, setUnfollowing] = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // User henüz yüklenmemişse bekle
      if (user === null) {
        return;
      }
      
      // User yüklendi ama giriş yapmamışsa login'e yönlendir
      if (!user) {
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
        
        // Takip edilenleri getir
        const response = await fetch(`/api/follow/following?user_id=${profileData.profile.user_id}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
    
            setFollowing(data.data);
          } else {
            setError("Takip edilenler yüklenirken hata oluştu");
          }
        } else {
          setError("Takip edilenler yüklenirken hata oluştu");
        }
      } catch (err) {
        console.error('Following fetch error:', err);
        setError("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router, username]);

  const handleFollow = async (userId: string, username: string) => {
    try {
      setFollowingLoading(userId);
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
          // Takip edilenler listesini güncelle
          setFollowing(prev => prev.map(user => 
            user.user_id === userId 
              ? { ...user, is_following: true }
              : user
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
      setFollowingLoading(null);
    }
  };

  const handleUnfollow = async (userId: string, username: string) => {
    try {
      setUnfollowing(userId);
      console.log('Attempting to unfollow:', { userId, username });
      
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

      console.log('Unfollow response status:', response.status);
      const data = await response.json();
      console.log('Unfollow response data:', data);

      if (response.ok) {
        if (data.success) {
          toast.success(`${username} kullanıcısının takibini bıraktınız`);
          // Takip edilenler listesini güncelle
          setFollowing(prev => prev.filter(user => user.user_id !== userId));
        } else {
          toast.error(data.error || "Takibi bırakma işlemi başarısız");
        }
      } else {
        toast.error(data.error || "Takibi bırakma işlemi başarısız");
      }
    } catch (err) {
      console.error('Unfollow error:', err);
      toast.error("Bir hata oluştu");
    } finally {
      setUnfollowing(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Takip edilenler yükleniyor...</p>
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
            {profileUser?.full_name || profileUser?.username} Takip Ediyor
          </h1>
          <p className="text-muted-foreground">
            {following.length} kullanıcı
          </p>
        </div>
      </div>

      {/* Following List */}
      {following.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz kimseyi takip etmiyor</h3>
            <p className="text-muted-foreground">
              Bu kullanıcı henüz kimseyi takip etmiyor.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {following.map((followedUser) => (
            <Card key={followedUser.user_id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={followedUser.avatar_url} alt={followedUser.username} />
                      <AvatarFallback>
                        {followedUser.full_name?.charAt(0) || followedUser.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/profile/${followedUser.username}`} className="hover:underline">
                          <h3 className="font-semibold">{followedUser.full_name || followedUser.username}</h3>
                        </Link>
                        <Badge variant="secondary" className="text-xs">
                          @{followedUser.username}
                        </Badge>
                      </div>
                      {followedUser.bio && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {followedUser.bio}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(followedUser.followed_at), { 
                            addSuffix: true, 
                            locale: tr 
                          })} takip etmeye başladı
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {user && user.id !== followedUser.user_id && (
                    <div className="flex gap-2">
                      {followedUser.is_following ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnfollow(followedUser.user_id, followedUser.username)}
                          disabled={unfollowing === followedUser.user_id}
                          className="gap-2"
                        >
                          <UserMinus className="h-4 w-4" />
                          {unfollowing === followedUser.user_id ? "İşleniyor..." : "Takibi Bırak"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleFollow(followedUser.user_id, followedUser.username)}
                          disabled={followingLoading === followedUser.user_id}
                          className="gap-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          {followingLoading === followedUser.user_id ? "İşleniyor..." : "Takip Et"}
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
