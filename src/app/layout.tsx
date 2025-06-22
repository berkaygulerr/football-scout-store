import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import "./global.css"
import { ThemeProvider } from '@/contexts/theme-provider';

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
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
