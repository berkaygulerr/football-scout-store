"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="container max-w-4xl py-8 px-4 mx-auto">
      <Card className="flat-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Gizlilik Politikası</CardTitle>
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
              GoldenScout (&ldquo;biz&rdquo;, &ldquo;bizim&rdquo; veya &ldquo;platformumuz&rdquo;) olarak, web sitemizi ve hizmetlerimizi kullanırken gizliliğinize önem veriyoruz. 
              Bu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) kapsamında kişisel verilerinizin nasıl toplandığını, 
              kullanıldığını, paylaşıldığını ve korunduğunu açıklamaktadır.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">2. Veri Sorumlusu</h2>
            <p>
              KVKK uyarınca, kişisel verileriniz; veri sorumlusu olarak GoldenScout tarafından aşağıda açıklanan kapsamda işlenebilecektir.
            </p>
            <p>
              <strong>Veri Sorumlusu:</strong> GoldenScout<br />
              <strong>E-posta:</strong> goldenfut0@gmail.com
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">3. Toplanan Kişisel Veriler</h2>
            <p>
              Platformumuz üzerinden aşağıdaki kişisel verilerinizi toplamaktayız:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, kullanıcı adı</li>
              <li><strong>İletişim Bilgileri:</strong> E-posta adresi</li>
              <li><strong>Hesap Bilgileri:</strong> Şifre (şifrelenmiş formatta), hesap oluşturma tarihi</li>
              <li><strong>Kullanım Verileri:</strong> Platformumuzu nasıl kullandığınız, etkileşimde bulunduğunuz özellikler</li>
              <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgileri, oturum bilgileri, çerezler</li>
              <li><strong>Konum Bilgileri:</strong> Ülke ve şehir düzeyinde genel konum bilgileri</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">4. Kişisel Verilerin İşlenme Amaçları</h2>
            <p>
              Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Hesabınızı oluşturmak, yönetmek ve güvenliğini sağlamak</li>
              <li>Size platformumuzun hizmetlerini sunmak ve bu hizmetleri iyileştirmek</li>
              <li>Kullanıcı deneyiminizi kişiselleştirmek</li>
              <li>Teknik sorunları tespit etmek ve çözmek</li>
              <li>Platformun güvenliğini sağlamak, dolandırıcılık ve kötüye kullanımı önlemek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
              <li>Açık rızanız olması halinde, size pazarlama iletişimleri göndermek</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">5. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
            <p>
              Kişisel verilerinizi işlememizin hukuki dayanakları şunlardır:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Açık rızanızın bulunması (KVKK m.5/1)</li>
              <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (KVKK m.5/2-c)</li>
              <li>Hukuki yükümlülüklerimizi yerine getirmek için zorunlu olması (KVKK m.5/2-ç)</li>
              <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için zorunlu olması (KVKK m.5/2-f)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">6. Kişisel Verilerin Aktarılması</h2>
            <p>
              Kişisel verileriniz, aşağıdaki alıcı gruplarına belirtilen amaçlarla aktarılabilir:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Hizmet Sağlayıcılar:</strong> Sunucu, veritabanı, e-posta ve diğer teknik hizmetleri sağlayan tedarikçilerimiz</li>
              <li><strong>İş Ortaklarımız:</strong> Size daha iyi hizmet sunabilmek için işbirliği yaptığımız şirketler</li>
              <li><strong>Yasal Otoriteler:</strong> Yasal bir yükümlülüğümüzü yerine getirmek için kamu kurumları veya yargı mercileri</li>
            </ul>
            <p>
              Kişisel verileriniz, açık rızanız olmaksızın yurt dışına aktarılmamaktadır. Ancak, hizmet sağlayıcılarımızın yurt dışında bulunması 
              durumunda, KVKK&apos;nın 9. maddesi uyarınca gerekli güvenlik önlemleri alınarak ve Kişisel Verileri Koruma Kurulu&apos;nun izni alınarak 
              verileriniz yurt dışına aktarılabilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">7. Kişisel Verilerin Saklama Süresi</h2>
            <p>
              Kişisel verileriniz, işlenme amaçlarının gerektirdiği süreler boyunca saklanacaktır. Bu süreler:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Hesabınızın aktif olduğu süre boyunca</li>
              <li>Yasal saklama yükümlülüklerimiz kapsamında (genellikle 10 yıla kadar)</li>
              <li>Olası hukuki uyuşmazlıklarda delil teşkil etmesi açısından zamanaşımı süresinin sonuna kadar (genellikle 10 yıla kadar)</li>
            </ul>
            <p>
              Bu sürelerin sonunda, kişisel verileriniz silinecek, yok edilecek veya anonim hale getirilecektir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">8. Çerezler ve Benzer Teknolojiler</h2>
            <p>
              Platformumuz, kullanıcı deneyimini iyileştirmek ve hizmetlerimizi geliştirmek için çerezler ve benzer teknolojiler kullanmaktadır.
              Çerezler, tarayıcınız tarafından cihazınıza yerleştirilen küçük metin dosyalarıdır.
            </p>
            <p>
              Kullandığımız çerez türleri şunlardır:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Zorunlu Çerezler:</strong> Platformun temel işlevlerini sağlamak için gerekli olan çerezler</li>
              <li><strong>Performans Çerezleri:</strong> Platformun performansını ve kullanımını analiz etmek için kullanılan çerezler</li>
              <li><strong>İşlevsellik Çerezleri:</strong> Size daha gelişmiş ve kişiselleştirilmiş bir deneyim sunmak için kullanılan çerezler</li>
              <li><strong>Hedefleme/Reklam Çerezleri:</strong> Size ilgi alanlarınıza yönelik reklamlar sunmak için kullanılan çerezler (yalnızca izin vermeniz halinde)</li>
            </ul>
            <p>
              Çerezleri tarayıcı ayarlarınızdan yönetebilir veya devre dışı bırakabilirsiniz. Ancak, bazı çerezleri devre dışı bırakmanız durumunda 
              platformumuzun bazı özellikleri düzgün çalışmayabilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">9. Veri Güvenliği</h2>
            <p>
              Kişisel verilerinizin güvenliğini sağlamak için uygun teknik ve idari önlemleri almaktayız. Bu önlemler arasında:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Şifreleme teknolojileri kullanılması</li>
              <li>Erişim kontrollerinin uygulanması</li>
              <li>Düzenli güvenlik değerlendirmeleri yapılması</li>
              <li>Personelimizin veri gizliliği konusunda eğitilmesi</li>
            </ul>
            <p>
              Ancak, internet üzerinden veri iletiminin veya elektronik depolamanın %100 güvenli olmadığını hatırlatmak isteriz.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">10. KVKK Kapsamındaki Haklarınız</h2>
            <p>
              KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
              <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
              <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
              <li>Düzeltme, silme ve yok edilme taleplerinizin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
              <li>İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
              <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">11. Haklarınızı Nasıl Kullanabilirsiniz?</h2>
            <p>
              KVKK kapsamındaki haklarınızı kullanmak için:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>goldenfut0@gmail.com adresine e-posta gönderebilirsiniz</li>
              <li>Başvurunuzda; adınız, soyadınız, e-posta adresiniz, talep konunuzu ve kimliğinizi doğrulayacak bilgileri belirtmeniz gerekmektedir</li>
            </ul>
            <p>
              Başvurunuzu, talebin niteliğine göre en kısa sürede ve en geç 30 gün içinde ücretsiz olarak sonuçlandıracağız. 
              İşlemin ayrıca bir maliyet gerektirmesi hâlinde, Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifeye göre ücret talep edilebilir.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">12. Gizlilik Politikasında Değişiklikler</h2>
            <p>
              Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Politikada yapılan değişiklikler, platformumuzda yayınlandığı 
              tarihten itibaren geçerli olacaktır. Önemli değişiklikler olması durumunda, size e-posta yoluyla veya platformumuz 
              üzerinden bildirim yapacağız.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold">13. İletişim</h2>
            <p>
              Bu Gizlilik Politikası hakkında sorularınız veya talepleriniz için aşağıdaki iletişim bilgilerinden bize ulaşabilirsiniz:
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