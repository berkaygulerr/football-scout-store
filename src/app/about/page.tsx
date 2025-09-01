"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-8 px-4 mx-auto">
      <Card className="flat-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Hakkımızda</CardTitle>
          <CardDescription>GoldenScout projesi ve ekibi hakkında bilgiler</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Projemiz</h2>
            <p>
              GoldenScout, futbol oyuncularının takibi ve yönetimi için tasarlanmış bir platformdur. 
              Kullanıcılar, oyuncuları ekleyebilir, düzenleyebilir, filtreleyebilir ve değer değişimlerini takip edebilir.
            </p>
            <p>
              Bu platform, futbol scout'larının, antrenörlerin ve futbol tutkunlarının oyuncu verilerini 
              organize bir şekilde yönetmesine olanak tanır. Kullanıcı dostu arayüzü ve güçlü filtreleme 
              özellikleriyle, oyuncu takibini kolaylaştırmayı amaçlıyoruz.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Özellikler</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Oyuncuları ekle, düzenle ve sil</li>
              <li>Oyuncuları yaş, takım, piyasa değeri ve daha fazla kritere göre filtrele</li>
              <li>Oyuncuların piyasa değeri değişimlerini takip et</li>
              <li>Özel kategorilere göre oyuncuları keşfet (En değerli, en genç, değeri en çok artan/düşen)</li>
              <li>Kişisel hesap yönetimi</li>
              <li>Koyu/açık tema desteği</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Teknolojiler</h2>
            <p>
              GoldenScout, modern web teknolojileri kullanılarak geliştirilmiştir:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Next.js 14 - React framework</li>
              <li>TypeScript - Tip güvenliği için</li>
              <li>Tailwind CSS - Stil ve tasarım için</li>
              <li>Shadcn/UI - Komponent kütüphanesi</li>
              <li>Supabase - Veritabanı ve kimlik doğrulama için</li>
              <li>Zustand - Durum yönetimi için</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">İletişim</h2>
            <p>
              Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz:
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link 
                href="mailto:goldenfut0@gmail.com" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                <span>goldenfut0@gmail.com</span>
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </Link>
            </div>
          </section>

          <div className="pt-4 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} GoldenScout. Tüm hakları saklıdır.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}