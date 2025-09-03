"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { UserProfile, userProfileSchema } from "@/types/user.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Save, Upload, Lock } from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import Link from "next/link";
import { toast } from "sonner";

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    website: "",
    twitter: "",
    instagram: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const username = params.username as string;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username || !user) return;

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
          setError("Profil bulunamadı");
          return;
        }

        // Kendi profilini düzenleyip düzenlemediğini kontrol et
        if (profileData.user_id !== user.id) {
          setError("Bu profili düzenleme yetkiniz yok");
          return;
        }

        setProfile(profileData);
        setFormData({
          username: profileData.username || "",
          full_name: profileData.full_name || "",
          bio: profileData.bio || "",
          website: profileData.website || "",
          twitter: profileData.twitter || "",
          instagram: profileData.instagram || ""
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    try {
      setSaving(true);

      // Form validasyonu
      const validation = userProfileSchema.safeParse(formData);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast.error(firstError.message);
        return;
      }

      const supabase = createBrowserSupabaseClient();

             // Profil güncelle (sadece mevcut alanlar)
       const updateData: any = {
         username: formData.username,
         full_name: formData.full_name || null,
         updated_at: new Date().toISOString()
       };

       // Yeni alanları kontrol et ve ekle (eğer varsa)
       if (formData.bio !== undefined) updateData.bio = formData.bio || null;
       if (formData.website !== undefined) updateData.website = formData.website || null;
       if (formData.twitter !== undefined) updateData.twitter = formData.twitter || null;
       if (formData.instagram !== undefined) updateData.instagram = formData.instagram || null;

       const { error: updateError } = await supabase
         .from('user_profile')
         .update(updateData)
         .eq('user_id', user.id);

             if (updateError) {
         console.error("Profil güncelleme hatası:", updateError);
         if (updateError.code === '23505') {
           toast.error("Bu kullanıcı adı zaten kullanımda");
         } else if (updateError.code === '42703') {
           toast.error("Profil alanları henüz eklenmemiş. Lütfen database migration'ını çalıştırın.");
         } else {
           toast.error(`Profil güncellenirken hata oluştu: ${updateError.message}`);
         }
         return;
       }

      toast.success("Profil başarıyla güncellendi");
      
      // Profil sayfasına yönlendir
      router.push(`/profile/${formData.username}`);

    } catch (err) {
      console.error("Profil güncelleme hatası:", err);
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    // Validation
    if (!passwordData.currentPassword) {
      toast.error("Mevcut şifrenizi girin");
      return;
    }
    if (!passwordData.newPassword) {
      toast.error("Yeni şifrenizi girin");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Yeni şifre en az 6 karakter olmalıdır");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }

    try {
      setSaving(true);
      const supabase = createBrowserSupabaseClient();

      // Mevcut şifreyi doğrula
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: passwordData.currentPassword
      });

      if (signInError) {
        toast.error("Mevcut şifre yanlış");
        return;
      }

      // Şifreyi güncelle
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) {
        toast.error(`Şifre güncellenirken hata oluştu: ${updateError.message}`);
        return;
      }

      toast.success("Şifre başarıyla güncellendi");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setShowPasswordSection(false);

    } catch (err) {
      console.error("Şifre güncelleme hatası:", err);
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="h-32 bg-muted rounded-lg mb-6"></div>
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
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4">Hata</h1>
              <p className="text-muted-foreground mb-6">
                {error || "Profil bulunamadı."}
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/profile/${username}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Profili Düzenle</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url} alt={profile.username} />
                <AvatarFallback className="text-xl">
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" disabled>
                  <Upload className="h-4 w-4 mr-2" />
                  Avatar Değiştir
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Avatar değiştirme yakında gelecek
                </p>
              </div>
            </div>

            {/* Kullanıcı Adı */}
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                placeholder="kullanici_adi"
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                Sadece küçük harfler, rakamlar ve alt çizgi (_) kullanabilirsiniz
              </p>
            </div>

            {/* Ad Soyad */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Ad Soyad</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Ad Soyad"
                disabled={saving}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                rows={3}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/500 karakter
              </p>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
                disabled={saving}
              />
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value.replace('@', ''))}
                placeholder="kullanici_adi"
                disabled={saving}
              />
            </div>

            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value.replace('@', ''))}
                placeholder="kullanici_adi"
                disabled={saving}
              />
            </div>

            {/* Kaydet Butonu */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/profile/${username}`}>İptal</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Şifre Değiştirme */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Şifre Değiştir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showPasswordSection ? (
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordSection(true)}
                disabled={saving}
              >
                <Lock className="h-4 w-4 mr-2" />
                Şifremi Değiştir
              </Button>
            ) : (
              <div className="space-y-4">
                {/* Mevcut Şifre */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                  <PasswordInput
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                    placeholder="Mevcut şifrenizi girin"
                    disabled={saving}
                  />
                </div>

                {/* Yeni Şifre */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <PasswordInput
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                    placeholder="Yeni şifrenizi girin"
                    disabled={saving}
                  />
                  <p className="text-xs text-muted-foreground">
                    En az 6 karakter olmalıdır
                  </p>
                </div>

                {/* Şifre Onayı */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                  <PasswordInput
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                    placeholder="Yeni şifrenizi tekrar girin"
                    disabled={saving}
                  />
                </div>

                {/* Butonlar */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handlePasswordChange} disabled={saving}>
                    <Lock className="h-4 w-4 mr-2" />
                    {saving ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPasswordSection(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                    }}
                    disabled={saving}
                  >
                    İptal
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
