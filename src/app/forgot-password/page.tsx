"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-provider";

export default function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);
    const { error } = await resetPasswordForEmail(email);
    setIsLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage("Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="flat-card w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-1">Şifremi Unuttum</h1>
          <p className="text-sm text-muted-foreground mb-6">E-postanı gir, sana bir sıfırlama bağlantısı gönderelim.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}

            <Button type="submit" className="w-full flat-button" disabled={isLoading}>
              {isLoading ? "Gönderiliyor..." : "Bağlantı Gönder"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}


