import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkında | Oyuncu Yönetimi',
  description: 'Futbol oyuncuları yönetim sistemi hakkında bilgiler',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hakkında</h1>
        <p className="text-lg text-gray-600">
          Futbol oyuncuları yönetim sistemi
        </p>
      </header>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Proje Hakkında</h2>
          <p className="text-gray-700 leading-relaxed">
            Bu uygulama, futbol oyuncularını kolayca yönetmek için geliştirilmiş modern bir web uygulamasıdır. 
            Next.js 14, TypeScript, Tailwind CSS ve Supabase teknolojileri kullanılarak geliştirilmiştir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Özellikler</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Oyuncu arama ve ekleme</li>
            <li>Güncel oyuncu bilgilerini görüntüleme</li>
            <li>Market değeri takibi</li>
            <li>Responsive tasarım</li>
            <li>Gerçek zamanlı veri senkronizasyonu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Teknolojiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Frontend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Next.js 14</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>React Hooks</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Backend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Next.js API Routes</li>
                <li>Supabase</li>
                <li>Redis (Upstash)</li>
                <li>Zod Validation</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
