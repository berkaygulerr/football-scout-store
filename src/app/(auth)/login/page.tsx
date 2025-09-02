"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

// Ana içerik bileşeni
function LoginContent() {
  const router = useRouter();
  const { signInWithPassword, signInWithOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const { error } = await signInWithPassword(email, password);
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
  };

  const onOtpLogin = async () => {
    if (!email) {
      setError("E-posta adresinizi girin");
      return;
    }
    setError(null);
    setIsLoading(true);
    const { error } = await signInWithOtp(email);
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    alert("Giriş bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.");
  };

  return (
    <Card className="flat-card w-full">
      <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-1">Giriş Yap</h1>
          <p className="text-sm text-muted-foreground mb-6">Hesabınıza giriş yapın</p>

          <form onSubmit={onLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full flat-button" disabled={isLoading}>
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>

            <Button variant="outline" className="w-full flat-button" onClick={onOtpLogin} disabled={isLoading || !email}>
              {isLoading ? "Gönderiliyor..." : "Şifresiz Giriş Yap"}
            </Button>
          </form>

          <div className="flex justify-between mt-6 text-sm">
            <a className="underline" href="/register">Kayıt ol</a>
            <a className="underline" href="/forgot-password">Şifremi unuttum?</a>
          </div>
      </CardContent>
    </Card>
  );
}

// Yükleme durumu için fallback bileşeni
function LoginLoading() {
  return (
    <div className="text-center">
      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
      <p className="text-muted-foreground">Yükleniyor...</p>
    </div>
  );
}

// Ana sayfa bileşeni
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}