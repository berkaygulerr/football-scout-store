"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithPassword, checkUsernameExists } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  
  // KVKK onayları için state'ler
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  // Kullanıcı adı değiştiğinde kontrol et
  const handleUsernameChange = async (value: string) => {
    const lowerValue = value.toLowerCase();
    setUsername(lowerValue);
    
    // Temel doğrulama
    if (lowerValue.length === 0) {
      setUsernameError(null);
      return;
    }
    
    if (lowerValue.length < 3) {
      setUsernameError("Kullanıcı adı en az 3 karakter olmalıdır");
      return;
    }
    
    if (!/^[a-z0-9_]+$/.test(lowerValue)) {
      setUsernameError("Kullanıcı adı sadece küçük harfler, rakamlar ve alt çizgi içerebilir");
      return;
    }
    
    // Kullanıcı adı uygunsa ve en az 3 karakter ise, veritabanında kontrol et
    if (lowerValue.length >= 3) {
      setIsCheckingUsername(true);
      setUsernameError(null);
      
      try {
        const exists = await checkUsernameExists(lowerValue);
        if (exists) {
          setUsernameError("Bu kullanıcı adı zaten kullanılıyor");
        }
      } catch (error) {
        console.error("Kullanıcı adı kontrolü hatası:", error);
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    if (username.length < 3) {
      setError("Kullanıcı adı en az 3 karakter olmalıdır");
      return;
    }
    
    if (!/^[a-z0-9_]+$/.test(username)) {
      setError("Kullanıcı adı sadece küçük harfler, rakamlar ve alt çizgi içerebilir");
      return;
    }
    
    if (usernameError) {
      setError(usernameError);
      return;
    }
    
    // KVKK kontrolleri
    if (!acceptTerms || !acceptPrivacy) {
      setError("Kullanım koşulları ve gizlilik politikasını kabul etmelisiniz");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Kullanıcı adını son kez kontrol et
      const exists = await checkUsernameExists(username);
      if (exists) {
        setError("Bu kullanıcı adı zaten kullanılıyor");
        setIsLoading(false);
        return;
      }
      
      // Kayıt işlemini gerçekleştir
      const { error } = await signUpWithPassword(email, password, username, fullName || undefined);
      
      if (error) {
        if (error.message.includes("username")) {
          setError("Bu kullanıcı adı zaten kullanılıyor");
        } else {
          setError(error.message);
        }
        return;
      }
      
      alert("Kayıt başarılı! E-postanıza doğrulama bağlantısı gönderilmiş olabilir.");
      router.push("/login");
    } catch (err) {
      setError("Kayıt sırasında bir hata oluştu");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={isLoading}
              />
            </div>

            {/* KVKK Aydınlatma Metni */}
            <div className="bg-muted/40 p-3 rounded-md text-xs text-muted-foreground space-y-2 mt-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p>
                  Kişisel verileriniz, hesabınızı oluşturmak, hizmetlerimizi sunmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla işlenmektedir. 
                  Verileriniz, hizmet sağlayıcılarımız dışında üçüncü taraflarla paylaşılmamaktadır.
                </p>
              </div>
            </div>

            {/* KVKK Onay Kutuları */}
            <div className="space-y-3 pt-2">
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
                    <span className="text-xs">
                      Tanıtım ve pazarlama amaçlı e-posta almayı kabul ediyorum. (İsteğe bağlı)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button 
              type="submit" 
              className="w-full flat-button" 
              disabled={isLoading || !!usernameError || isCheckingUsername || !acceptTerms || !acceptPrivacy}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Kayıt yapılıyor...
                </>
              ) : (
                "Kayıt Ol"
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Zaten hesabınız var mı? <Link href="/login" className="text-primary hover:underline">Giriş yap</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}