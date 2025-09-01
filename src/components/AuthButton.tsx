"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";

export default function AuthButton() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [loadingUsername, setLoadingUsername] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.id) {
        setLoadingUsername(true);
        try {
          const supabase = createBrowserSupabaseClient();
          const { data, error } = await supabase
            .from('user_profile')
            .select('username')
            .eq('user_id', user.id)
            .single();
          
          if (data && data.username) {
            setUsername(data.username);
          }
        } catch (error) {
          console.error("Kullanıcı adı getirme hatası:", error);
        } finally {
          setLoadingUsername(false);
        }
      }
    };

    if (user) {
      fetchUsername();
    }
  }, [user]);

  if (loading || loadingUsername) {
    return (
      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-md bg-muted animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Button asChild variant="default" size="sm" className="rounded-full text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4">
        <Link href="/login">Giriş Yap</Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
    router.refresh();
  };

  // Kullanıcı adı varsa onu, yoksa e-postanın ilk harfini göster
  const displayName = username || user.email || "";
  const userInitial = username ? username.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "?");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
          <span className="font-medium text-xs sm:text-sm">{userInitial}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{username}</span>
          </div>
          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive text-xs sm:text-sm">
          <LogOut className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>Çıkış Yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}