"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Loader2, Info, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "@/hooks/useDebounce";

// Ana içerik bileşeni
function RegisterContent() {
  const router = useRouter();
  const { signUpWithPassword, signInWithPassword, checkUsernameExists } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  const debouncedUsername = useDebounce(username, 500);

  const validateUsername = useCallback(async (currentUsername: string) => {
    if (!currentUsername) {
      setUsernameError("Kullanıcı adı boş bırakılamaz.");
      return false;
    }
    if (currentUsername.length < 3) {
      setUsernameError("Kullanıcı adı en az 3 karakter olmalıdır.");
      return false;
    }
    if (!/^[a-z0-9_]+$/.test(currentUsername)) {
      setUsernameError("Sadece küçük harfler, rakamlar ve alt çizgi (_) kullanabilirsiniz.");
      return false;
    }

    setIsCheckingUsername(true);
    const exists = await checkUsernameExists(currentUsername.toLowerCase());
    setIsCheckingUsername(false);

    if (exists) {
      setUsernameError("Bu kullanıcı adı zaten alınmış.");
      return false;
    }

    setUsernameError(null);
    return true;
  }, [checkUsernameExists]);

  useEffect(() => {
    if (debouncedUsername) {
      validateUsername(debouncedUsername);
    } else {
      setUsernameError(null);
    }
  }, [debouncedUsername, validateUsername]);

  const handleUsernameChange = (value: string) => {
    setUsername(value.toLowerCase());
    setUsernameError(null); // Clear error on change
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isUsernameValid = await validateUsername(username);
    if (!isUsernameValid) {
      return;
    }

    if (!acceptTerms || !acceptPrivacy) {
      setError("Kullanım Koşulları ve Gizlilik Politikası'nı kabul etmelisiniz.");
      return;
    }

    setIsLoading(true);
    
    // Kayıt işlemi
    const { error: signUpError } = await signUpWithPassword(email, password, username, fullName);
    
    if (signUpError) {
      setIsLoading(false);
      if (signUpError.message.includes("username")) {
        setUsernameError("Bu kullanıcı adı zaten alınmış.");
      } else {
        setError(signUpError.message);
      }
      return;
    }
    
    // Kayıt başarılıysa, otomatik giriş yap
    const { error: signInError } = await signInWithPassword(email, password);
    
    setIsLoading(false);
    
    if (signInError) {
      // Giriş başarısız olursa, login sayfasına yönlendir
      alert("Kayıt başarılı! Ancak otomatik giriş yapılamadı. Lütfen giriş yapın.");
      router.push("/login");
      return;
    }
    
    // Giriş başarılıysa, ana sayfaya yönlendir
    router.push("/");
  };

  const isFormValid = email && password && username && !usernameError && !isCheckingUsername && acceptTerms && acceptPrivacy;

  return (
    <Card className="flat-card w-full">
      <CardContent className="p-6">
          <h1 className="text-xl font-semibold mb-1">Kayıt Ol</h1>
          <p className="text-sm text-muted-foreground mb-6">Yeni hesap oluşturun</p>

          <form onSubmit={onRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="ornek@mail.com"
                required 
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                Kullanıcı Adı
                {isCheckingUsername && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </Label>
              <Input 
                id="username" 
                type="text" 
                value={username} 
                onChange={(e) => handleUsernameChange(e.target.value)} 
                placeholder="kullanici_adi"
                required 
                disabled={isLoading}
                className={usernameError ? "border-destructive" : ""}
              />
              {usernameError ? (
                <p className="text-xs text-destructive">{usernameError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Sadece küçük harfler, rakamlar ve alt çizgi (_) kullanabilirsiniz</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Ad Soyad (İsteğe Bağlı)</Label>
              <Input 
                id="fullName" 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="Ad Soyad"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <PasswordInput 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Güçlü bir şifre oluşturun"
                required 
                disabled={isLoading}
              />
            </div>

            <div className="bg-muted/20 border border-border rounded-md p-3 text-sm flex items-start gap-3">
              <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground text-xs">
                Kişisel verileriniz, platform hizmetlerini sunmak, hesabınızı yönetmek ve yasal yükümlülükleri yerine getirmek amacıyla işlenmektedir. Detaylı bilgi için Gizlilik Politikamızı inceleyebilirsiniz.
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  disabled={isLoading}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="text-xs">
                      <Link href="/terms" className="text-primary hover:underline" target="_blank">Kullanım Koşullarını</Link> okudum ve kabul ediyorum.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="privacy" 
                  checked={acceptPrivacy}
                  onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
                  disabled={isLoading}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="privacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="text-xs">
                      <Link href="/privacy" className="text-primary hover:underline" target="_blank">Gizlilik Politikasını</Link> okudum ve kabul ediyorum.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="marketing" 
                  checked={acceptMarketing}
                  onCheckedChange={(checked) => setAcceptMarketing(checked === true)}
                  disabled={isLoading}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="marketing"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <span className="text-xs text-muted-foreground">
                      Pazarlama ve tanıtım e-postaları almak istiyorum.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-destructive mt-4">{error}</p>}

            <Button type="submit" className="w-full flat-button" disabled={isLoading || !isFormValid}>
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Zaten hesabınız var mı? <Link href="/login" className="text-primary hover:underline">Giriş yap</Link>
          </p>
      </CardContent>
    </Card>
  );
}

// Yükleme durumu için fallback bileşeni
function RegisterLoading() {
  return (
    <div className="text-center">
      <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
      <p className="text-muted-foreground">Yükleniyor...</p>
    </div>
  );
}

// Ana sayfa bileşeni
export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterContent />
    </Suspense>
  );
}