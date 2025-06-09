import type { Metadata } from 'next';
import "./global.css"
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'Oyuncu Yönetimi',
  description: 'Futbol oyuncuları yönetim sistemi - Oyuncuları ekleyin, görüntüleyin ve yönetin',
  keywords: ['futbol', 'oyuncu', 'yönetim', 'football', 'player management'],
  authors: [{ name: 'Oyuncu Yönetimi' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <ThemeProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
