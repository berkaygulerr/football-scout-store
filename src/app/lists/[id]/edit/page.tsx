"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { updateListSchema, UpdateListSchema } from "@/types/list.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-provider";
import { toast } from "sonner";
import Link from "next/link";

export default function EditListPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateListSchema>({
    title: "",
    description: "",
    is_public: true
  });
  const [error, setError] = useState<string | null>(null);

  const listId = params.id as string;

  useEffect(() => {
    const fetchList = async () => {
      if (!listId || !user) return;

      try {
        setLoading(true);
        const supabase = createBrowserSupabaseClient();

        // Liste bilgilerini getir
        const { data: listData, error: listError } = await supabase
          .from('player_lists')
          .select('*')
          .eq('id', listId)
          .eq('user_id', user.id) // Sadece kendi listesini düzenleyebilir
          .single();

        if (listError) {
          if (listError.code === 'PGRST116') {
            setError("Liste bulunamadı veya düzenleme yetkiniz yok");
          } else {
            setError("Liste yüklenirken hata oluştu");
          }
          return;
        }

        setFormData({
          title: listData.title,
          description: listData.description || "",
          is_public: listData.is_public
        });

      } catch (err) {
        console.error("List fetch error:", err);
        setError("Bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [listId, user]);

  const handleInputChange = (field: keyof UpdateListSchema, value: string | boolean) => {
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
      setSaving(true);

      // Form validasyonu
      const validation = updateListSchema.safeParse(formData);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast.error(firstError.message);
        return;
      }

      const supabase = createBrowserSupabaseClient();

      // Aynı isimde başka liste var mı kontrol et (mevcut liste hariç)
      const { data: existingList, error: checkError } = await supabase
        .from('player_lists')
        .select('id')
        .eq('user_id', user.id)
        .eq('title', formData.title?.trim() || '')
        .neq('id', listId)
        .single();

      if (existingList) {
        toast.error("Bu isimde başka bir listeniz zaten mevcut");
        return;
      }

      // Liste güncelle
      const { error } = await supabase
        .from('player_lists')
        .update({
          title: formData.title?.trim() || '',
          description: formData.description?.trim() || null,
          is_public: formData.is_public
        })
        .eq('id', listId)
        .eq('user_id', user.id);

      if (error) {
        console.error('List update error:', error);
        toast.error("Liste güncellenirken hata oluştu");
        return;
      }

      toast.success("Liste başarıyla güncellendi");
      
      // Liste detay sayfasına yönlendir
      router.push(`/lists/${listId}`);

    } catch (error) {
      console.error('Update list error:', error);
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    if (!confirm("Bu listeyi silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      setSaving(true);
      const supabase = createBrowserSupabaseClient();

      const { error } = await supabase
        .from('player_lists')
        .delete()
        .eq('id', listId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Delete list error:', error);
        toast.error("Liste silinirken hata oluştu");
        return;
      }

      toast.success("Liste başarıyla silindi");
      router.push("/");

    } catch (error) {
      console.error('Delete list error:', error);
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
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4">Hata</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
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
            <Link href={`/lists/${listId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Liste Düzenle</h1>
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
                  disabled={saving}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.title?.length || 0}/100 karakter
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
                  disabled={saving}
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
                  disabled={saving}
                />
              </div>

              {/* Butonlar */}
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/lists/${listId}`}>İptal</Link>
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Listeyi Sil
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
