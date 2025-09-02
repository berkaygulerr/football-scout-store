export const metadata = {
  title: 'GoldenScout - Giriş',
  description: 'GoldenScout hesabınıza giriş yapın',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex flex-col">
      <div className="flex-1 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
