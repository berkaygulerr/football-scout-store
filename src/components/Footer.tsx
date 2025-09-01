"use client";

import Link from "next/link";
import { Github, Mail, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo ve Telif Hakkı */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold font-heading">
                <span className="text-amber-700 dark:text-primary">Golden</span>
                <span className="text-amber-600">Scout</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {currentYear} GoldenScout. Tüm hakları saklıdır.
            </p>
          </div>
          
          {/* Bağlantılar */}
          <div className="flex flex-col items-center md:items-end gap-4">
            {/* Sayfalar */}
            <div className="flex gap-4 text-sm">
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                Hakkımızda
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Kullanım Koşulları
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Gizlilik Politikası
              </Link>
            </div>
            
            {/* Sosyal Medya */}
            <div className="flex gap-3">
              <Link 
                href="mailto:goldenfut0@gmail.com" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="E-posta"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
