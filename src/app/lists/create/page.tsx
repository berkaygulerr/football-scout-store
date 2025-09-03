"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { createListSchema, CreateListSchema } from "@/types/list.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateListSchema>({
    title: "",
    description: "",
    is_public: true
  });

  const handleInputChange = (field: keyof CreateListSchema, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Giriş yapmanız gerekiyor");
      return;
    }

    try {
      setLoading(true);

      // Form validasyonu
      const validation = createListSchema.safeParse(formData);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast.error(firstError.message);
        return;
      }

      const supabase = createBrowserSupabaseClient();

      // Aynı isimde liste var mı kontrol et
      const { data: existingList, error: checkError } = await supabase
        .from('player_lists')
        .select('id')
        .eq('user_id', user.id)
        .eq('title', formData.title.trim())
        .single();

      if (existingList) {
        toast.error("Bu isimde bir listeniz zaten mevcut");
        return;
      }

      // Liste oluştur
      const { data, error } = await supabase
        .from('player_lists')
        .insert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description?.trim() || null,
          is_public: formData.is_public
        })
        .select()
        .single();

      if (error) {
        console.error('List creation error:', error);
        toast.error("Liste oluşturulurken hata oluştu");
        return;
      }

      toast.success("Liste başarıyla oluşturuldu");
      
      // Liste detay sayfasına yönlendir
      router.replace(`/lists/${data.id}`);

    } catch (error) {
      console.error('Create list error:', error);
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4">Giriş Gerekli</h1>
              <p className="text-muted-foreground mb-6">
                Liste oluşturmak için giriş yapmanız gerekiyor.
              </p>
              <Button asChild>
                <Link href="/login">Giriş Yap</Link>
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
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Yeni Liste Oluştur</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Başlık */}
              <div className="space-y-2">
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Liste başlığını girin"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.title.length}/100 karakter
                </p>
              </div>

              {/* Açıklama */}
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Liste hakkında kısa bir açıklama yazın..."
                  rows={3}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description?.length || 0}/500 karakter
                </p>
              </div>

              {/* Gizlilik */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_public">Herkese Açık</Label>
                  <p className="text-sm text-muted-foreground">
                    Herkese açık listeler diğer kullanıcılar tarafından görülebilir
                  </p>
                </div>
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => handleInputChange('is_public', checked)}
                  disabled={loading}
                />
              </div>

              {/* Butonlar */}
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? "Oluşturuluyor..." : "Liste Oluştur"}
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                  İptal
                </Button>
              </div>


            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
