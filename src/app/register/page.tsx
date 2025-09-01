"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const { error } = await signUpWithPassword(email, password);
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    alert("Kayıt başarılı! E-postanıza doğrulama bağlantısı gönderilmiş olabilir.");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="flat-card w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-1">Kayıt Ol</h1>
          <p className="text-sm text-muted-foreground mb-6">Yeni hesap oluşturun</p>

          <form onSubmit={onRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full flat-button" disabled={isLoading}>
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Zaten hesabınız var mı? <a className="underline" href="/login">Giriş yap</a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}


