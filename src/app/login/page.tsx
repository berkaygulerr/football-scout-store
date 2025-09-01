"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithPassword, signInWithOtp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const { error } = await signInWithPassword(email, password);
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
  };

  const onOtpLogin = async () => {
    setIsLoading(true);
    setError(null);
    const { error } = await signInWithOtp(email);
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    alert("Giriş bağlantısı e-postanıza gönderildi");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="flat-card w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-1">Giriş Yap</h1>
          <p className="text-sm text-muted-foreground mb-6">Hesabınıza erişin</p>

          <form onSubmit={onPasswordLogin} className="space-y-4">
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
          </form>

          <div className="mt-6">
            <Button variant="outline" className="w-full flat-button" onClick={onOtpLogin} disabled={isLoading || !email}>
              E-postayla Giriş Bağlantısı Gönder
            </Button>
          </div>

          <div className="mt-6 text-xs text-muted-foreground text-center space-x-4">
            <a className="underline" href="/register">Kayıt ol</a>
            <a className="underline" href="/forgot-password">Şifremi unuttum?</a>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


