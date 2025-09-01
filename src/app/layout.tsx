import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import "./global.css"
import { ThemeProvider } from '@/contexts/theme-provider';
import { AuthProvider } from '@/contexts/auth-provider';
import Header from '@/components/Header';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'ScoutGFUT',
  description: 'Futbol oyuncuları yönetim sistemi - Oyuncuları ekleyin, görüntüleyin ve yönetin',
  keywords: ['futbol', 'oyuncu', 'yönetim', 'football', 'player management', 'scout'],
  authors: [{ name: 'ScoutGFUT' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <div className="flex-1">
                {children}
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}