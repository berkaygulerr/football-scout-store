"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-provider";
import { RefreshCw } from "lucide-react";

// Ana içerik bileşeni
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUserPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Supabase magic link ile geldiğinde access_token ve type=recovery olur
  useEffect(() => {
    const type = searchParams.get("type");
    if (type !== "recovery") return;
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return;
    }
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor");
      return;
    }
    setIsLoading(true);
    const { error } = await updateUserPassword(password);
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="flat-card w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-1">Şifreyi Sıfırla</h1>
          <p className="text-sm text-muted-foreground mb-6">Yeni şifreni belirle</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Yeni Şifre</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Yeni Şifre (Tekrar)</Label>
              <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {done && <p className="text-sm text-green-600 dark:text-green-400">Şifre güncellendi, yönlendiriliyorsunuz...</p>}

            <Button type="submit" className="w-full flat-button" disabled={isLoading}>
              {isLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

// Yükleme durumu için fallback bileşeni
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    </div>
  );
}

// Ana sayfa bileşeni
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}