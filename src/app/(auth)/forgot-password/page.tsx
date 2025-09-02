"use client";

import { useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-provider";
import { RefreshCw } from "lucide-react";

// Ana içerik bileşeni
function ForgotPasswordContent() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("E-posta adresinizi girin");
      return;
    }
    setIsLoading(true);
    const { error } = await resetPasswordForEmail(email);
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  };

  return (
    <Card className="flat-card w-full">
      <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-1">Şifremi Unuttum</h1>
          <p className="text-sm text-muted-foreground mb-6">
            E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {done && <p className="text-sm text-green-600 dark:text-green-400">Şifre sıfırlama bağlantısı gönderildi. Lütfen e-postanızı kontrol edin.</p>}

            <Button type="submit" className="w-full flat-button" disabled={isLoading}>
              {isLoading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
            </Button>
          </form>
      </CardContent>
    </Card>
  );
}

// Yükleme durumu için fallback bileşeni
function ForgotPasswordLoading() {
  return (
    <div className="text-center">
      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
      <p className="text-muted-foreground">Yükleniyor...</p>
    </div>
  );
}

// Ana sayfa bileşeni
export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordLoading />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}