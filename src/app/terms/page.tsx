"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="container max-w-4xl py-8 px-4 mx-auto">
      <Card className="flat-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Kullanım Koşulları</CardTitle>
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Anasayfaya dön
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          <p className="text-muted-foreground">
            Son güncellenme tarihi: {new Date().toLocaleDateString('tr-TR')}
          </p>
          
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">1. Giriş</h2>
            <p>
              GoldenScout platformuna ("Platform") hoş geldiniz. Bu Platform, GoldenScout ("biz", "bizim" veya "platformumuz") 
              tarafından işletilmektedir. Bu Kullanım Koşulları, Platform'u kullanımınızı düzenleyen yasal bir sözleşmedir.
            </p>
            <p>
              Platform'u kullanarak veya Platform'a erişerek, bu Kullanım Koşulları'nı ve <Link href="/privacy" className="text-primary hover:underline">Gizlilik Politikamızı</Link> okuduğunuzu, 
              anladığınızı ve bunlara uymayı kabul ettiğinizi beyan etmiş olursunuz. Eğer bu koşulları kabul etmiyorsanız, lütfen Platform'u kullanmayınız.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">2. Tanımlar</h2>
            <p>
              Bu Kullanım Koşulları'nda geçen:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>"Kullanıcı"</strong>, Platform'a erişen veya Platform'u kullanan herhangi bir gerçek veya tüzel kişiyi;</li>
              <li><strong>"İçerik"</strong>, Platform üzerinde bulunan veya Platform aracılığıyla erişilebilen her türlü bilgi, veri, metin, yazılım, grafik, fotoğraf, video, mesaj veya diğer materyalleri;</li>
              <li><strong>"Kullanıcı İçeriği"</strong>, Kullanıcıların Platform'a yüklediği, gönderdiği veya Platform üzerinden paylaştığı her türlü içeriği ifade eder.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">3. Hesap Oluşturma ve Güvenlik</h2>
            <p>
              Platform'un bazı özelliklerini kullanabilmek için bir hesap oluşturmanız gerekmektedir. Hesap oluştururken:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Doğru, güncel ve eksiksiz bilgiler sağlamayı;</li>
              <li>Hesap bilgilerinizi (şifreniz dahil) gizli tutmayı;</li>
              <li>Hesabınız altında gerçekleşen tüm faaliyetlerden sorumlu olmayı;</li>
              <li>Hesabınızla ilgili herhangi bir yetkisiz erişim veya güvenlik ihlali durumunda bizi derhal bilgilendirmeyi kabul edersiniz.</li>
            </ul>
            <p>
              GoldenScout, herhangi bir hesabı, kendi takdirine bağlı olarak ve herhangi bir sebep göstermeksizin askıya alma veya sonlandırma hakkını saklı tutar.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">4. Kullanım Kuralları</h2>
            <p>
              Platform'u kullanırken aşağıdaki kurallara uymayı kabul edersiniz:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Türkiye Cumhuriyeti kanunları ve yönetmeliklerine uymak;</li>
              <li>Başkalarının haklarına saygı göstermek (fikri mülkiyet hakları dahil);</li>
              <li>Platform'u yasa dışı, zararlı, tehdit edici, taciz edici, iftira niteliğinde, küfürlü, müstehcen, hakaret içeren veya başka bir şekilde sakıncalı amaçlarla kullanmamak;</li>
              <li>Virüs veya diğer kötü amaçlı kodlar yaymamak;</li>
              <li>Platform'un normal işleyişini bozmamak veya aşırı yük bindirmemek;</li>
              <li>Platform'un güvenlik özelliklerini devre dışı bırakmaya, atlatmaya veya müdahale etmeye çalışmamak;</li>
              <li>Platform'u otomatik yöntemlerle (botlar, kazıyıcılar vb.) kullanmamak;</li>
              <li>Diğer kullanıcıların kişisel verilerini izinsiz toplamak veya kullanmamak.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">5. Kullanıcı İçeriği</h2>
            <p>
              Platform'a içerik gönderdiğinizde veya yüklediğinizde:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Bu içeriğin sahibi olmaya devam edersiniz;</li>
              <li>GoldenScout'a, bu içeriği Platform'un işletilmesi ve geliştirilmesi amacıyla kullanma, değiştirme, uyarlama, çoğaltma, dağıtma ve görüntüleme hakkı verirsiniz;</li>
              <li>İçeriğin yasal olduğunu ve başkalarının haklarını ihlal etmediğini garanti edersiniz;</li>
              <li>İçerikle ilgili tüm yasal sorumluluğun size ait olduğunu kabul edersiniz.</li>
            </ul>
            <p>
              GoldenScout, kendi takdirine bağlı olarak, herhangi bir Kullanıcı İçeriğini inceleme, filtreleme, düzenleme veya kaldırma hakkını saklı tutar, 
              ancak bunu yapma yükümlülüğü yoktur.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">6. Fikri Mülkiyet Hakları</h2>
            <p>
              Platform ve içeriği (Kullanıcı İçeriği hariç), GoldenScout'a veya lisans verenlerine aittir ve telif hakkı, ticari marka ve diğer fikri mülkiyet 
              hakları ile korunmaktadır. Bu Kullanım Koşulları, size Platform'u kişisel ve ticari olmayan amaçlarla kullanma hakkı verir.
            </p>
            <p>
              GoldenScout'un önceden yazılı izni olmadan, Platform'un herhangi bir bölümünü kopyalayamaz, değiştiremez, dağıtamaz, satamaz, kiralayamaz veya 
              türev çalışmalar oluşturamazsınız.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">7. Üçüncü Taraf Bağlantıları ve Hizmetleri</h2>
            <p>
              Platform, üçüncü taraf web sitelerine veya hizmetlerine bağlantılar içerebilir. Bu bağlantılar sadece kolaylık sağlamak amacıyla verilmiştir 
              ve GoldenScout'un bu üçüncü taraf siteleri veya hizmetleri onayladığı anlamına gelmez.
            </p>
            <p>
              GoldenScout, üçüncü taraf web siteleri veya hizmetlerinin içeriği, gizlilik politikaları veya uygulamaları için hiçbir sorumluluk kabul etmez. 
              Bu siteleri veya hizmetleri kullanırken, kendi riskinizle hareket edersiniz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">8. Sorumluluk Sınırlaması</h2>
            <p>
              Platform "olduğu gibi" ve "mevcut olduğu şekilde" sunulmaktadır. GoldenScout, Platform'un kesintisiz, güvenli veya hatasız çalışacağına 
              dair hiçbir garanti vermemektedir.
            </p>
            <p>
              Yürürlükteki kanunların izin verdiği azami ölçüde, GoldenScout:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Platform'un kullanımından veya kullanılamamasından kaynaklanan doğrudan, dolaylı, arızi, özel, sonuç olarak ortaya çıkan veya cezai zararlardan;</li>
              <li>Herhangi bir içerik, mal veya hizmetin satın alınması veya elde edilmesinden;</li>
              <li>Yetkisiz erişim veya verilerin değiştirilmesinden;</li>
              <li>Üçüncü tarafların Platform üzerindeki beyanları veya davranışlarından;</li>
              <li>Platform ile ilgili diğer konulardan sorumlu değildir.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">9. Tazminat</h2>
            <p>
              Bu Kullanım Koşulları'nı ihlal etmeniz veya Platform'u kullanmanız sonucunda ortaya çıkabilecek her türlü talep, zarar, yükümlülük, maliyet ve 
              gidere karşı GoldenScout'u savunmayı, tazmin etmeyi ve zarar görmemesini sağlamayı kabul edersiniz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">10. Uygulanacak Hukuk ve Uyuşmazlık Çözümü</h2>
            <p>
              Bu Kullanım Koşulları, Türkiye Cumhuriyeti kanunlarına tabidir. Bu Kullanım Koşulları'ndan veya Platform'un kullanımından kaynaklanan 
              herhangi bir anlaşmazlık, Türkiye Cumhuriyeti mahkemelerinin yargı yetkisine tabi olacaktır.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">11. Değişiklikler</h2>
            <p>
              GoldenScout, bu Kullanım Koşulları'nı herhangi bir zamanda değiştirme hakkını saklı tutar. Değişiklikler, Platform üzerinde yayınlandıktan 
              sonra geçerli olacaktır. Değişikliklerden sonra Platform'u kullanmaya devam etmeniz, güncellenmiş Kullanım Koşulları'nı kabul ettiğiniz 
              anlamına gelir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">12. Fesih</h2>
            <p>
              GoldenScout, kendi takdirine bağlı olarak, herhangi bir zamanda ve herhangi bir sebep göstermeksizin, Platform'a erişiminizi askıya alabilir 
              veya sonlandırabilir.
            </p>
            <p>
              Siz de dilediğiniz zaman hesabınızı kapatarak veya Platform'u kullanmayı bırakarak bu sözleşmeyi feshedebilirsiniz.
            </p>
            <p>
              Fesih durumunda, bu Kullanım Koşulları'nın doğası gereği fesihten sonra da geçerli kalması gereken hükümleri (fikri mülkiyet hakları, 
              sorumluluk sınırlamaları, tazminat vb.) yürürlükte kalmaya devam edecektir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">13. Genel Hükümler</h2>
            <p>
              Bu Kullanım Koşulları, Platform'un kullanımına ilişkin sizinle GoldenScout arasındaki tam anlaşmayı temsil eder ve önceki tüm anlaşmaları geçersiz kılar.
            </p>
            <p>
              Bu Kullanım Koşulları'nın herhangi bir hükmünün geçersiz veya uygulanamaz olması durumunda, diğer hükümler tam olarak yürürlükte kalmaya devam edecektir.
            </p>
            <p>
              GoldenScout'un bu Kullanım Koşulları'ndaki herhangi bir hakkını veya hükmünü uygulamaması, bu haktan veya hükümden feragat ettiği anlamına gelmez.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">14. İletişim</h2>
            <p>
              Bu Kullanım Koşulları hakkında sorularınız veya yorumlarınız varsa, lütfen aşağıdaki iletişim bilgilerinden bize ulaşın:
            </p>
            <p>
              <strong>E-posta:</strong> goldenfut0@gmail.com
            </p>
          </section>

          <div className="pt-4 text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} GoldenScout. Tüm hakları saklıdır.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}