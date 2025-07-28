# Gereksinimler Belgesi

## Giriş

Elmalı Market için müşteri odaklı, özgün tasarıma sahip modern bir e-ticaret platformu geliştirilecektir. Platform, Özdilek Teyim Market, CarrefourSA, Çağrı Market ve Tahtakale Spot gibi başarılı e-ticaret sitelerinden ilham alarak, ancak Elmalı Market'in kendine özgü kimliğini yansıtan bir tasarım sunacaktır. Sistem, kullanıcı deneyimini ön planda tutarak, sezgisel navigasyon, hızlı alışveriş süreci ve kişiselleştirilmiş öneriler sunacaktır.

## Gereksinimler

### Gereksinim 1

**Kullanıcı Hikayesi:** Müşteri olarak, Elmalı Market'in ürünlerini online görmek istiyorum, böylece evden rahatça alışveriş yapabileyim.

#### Kabul Kriterleri

1. WHEN kullanıcı ana sayfayı ziyaret ettiğinde THEN sistem ürün kategorilerini ve öne çıkan ürünleri gösterecektir
2. WHEN kullanıcı bir kategoriyi seçtiğinde THEN sistem o kategorideki tüm ürünleri listeleyecektir
3. WHEN kullanıcı bir ürüne tıkladığında THEN sistem ürün detay sayfasını açacaktır
4. IF ürün stokta yoksa THEN sistem "Stokta Yok" uyarısı gösterecektir

### Gereksinim 2

**Kullanıcı Hikayesi:** Müşteri olarak, ürünleri sepetime ekleyip sipariş vermek istiyorum, böylece satın alma işlemimi tamamlayabileyim.

#### Kabul Kriterleri

1. WHEN kullanıcı "Sepete Ekle" butonuna tıkladığında THEN sistem ürünü sepete ekleyecektir
2. WHEN kullanıcı sepetini görüntülediğinde THEN sistem sepetteki ürünleri ve toplam tutarı gösterecektir
3. WHEN kullanıcı sipariş verdiğinde THEN sistem müşteri bilgilerini ve teslimat adresini isteyecektir
4. WHEN sipariş tamamlandığında THEN sistem sipariş onay numarası verecektir

### Gereksinim 3

**Kullanıcı Hikayesi:** Market yöneticisi olarak, ürünleri yönetmek istiyorum, böylece stok ve fiyat güncellemelerini yapabileyim.

#### Kabul Kriterleri

1. WHEN yönetici admin paneline giriş yaptığında THEN sistem ürün yönetim arayüzünü gösterecektir
2. WHEN yönetici yeni ürün eklediğinde THEN sistem ürün bilgilerini kaydetecektir
3. WHEN yönetici ürün fiyatını güncellediğinde THEN sistem değişikliği anında yansıtacaktır
4. WHEN yönetici ürün stoğunu güncellediğinde THEN sistem stok durumunu güncelleyecektir

### Gereksinim 4

**Kullanıcı Hikayesi:** Müşteri olarak, platformu mobil cihazımda kullanmak istiyorum, böylece her yerden alışveriş yapabileyim.

#### Kabul Kriterleri

1. WHEN kullanıcı mobil cihazdan siteye girdiğinde THEN sistem responsive tasarımı gösterecektir
2. WHEN kullanıcı dokunmatik hareketler yaptığında THEN sistem dokunma etkileşimlerini destekleyecektir
3. WHEN sayfa yüklendiğinde THEN sistem 3 saniyeden kısa sürede yüklenecektir
4. IF internet bağlantısı yavaşsa THEN sistem optimize edilmiş içerik sunacaktır

### Gereksinim 5

**Kullanıcı Hikayesi:** Müşteri olarak, ödeme işlemlerimi güvenli şekilde yapmak istiyorum, böylece kart bilgilerim korunabilsin.

#### Kabul Kriterleri

1. WHEN kullanıcı ödeme sayfasına geldiğinde THEN sistem SSL sertifikası ile güvenli bağlantı sağlayacaktır
2. WHEN kullanıcı kart bilgilerini girdiğinde THEN sistem bilgileri şifreleyecektir
3. WHEN ödeme işlemi başlatıldığında THEN sistem güvenilir ödeme sağlayıcısı kullanacaktır
4. IF ödeme başarısızsa THEN sistem kullanıcıya açık hata mesajı verecektir

### Gereksinim 6

**Kullanıcı Hikayesi:** Market yöneticisi olarak, siparişleri takip etmek istiyorum, böylece teslimat süreçlerini yönetebileyim.

#### Kabul Kriterleri

1. WHEN yeni sipariş geldiğinde THEN sistem yöneticiye bildirim gönderecektir
2. WHEN yönetici sipariş durumunu güncellediğinde THEN sistem müşteriye bilgi verecektir
3. WHEN sipariş hazırlandığında THEN sistem teslimat bilgilerini güncelleyecektir
4. WHEN sipariş teslim edildiğinde THEN sistem sipariş durumunu "Tamamlandı" olarak işaretleyecektir

### Gereksinim 7

**Kullanıcı Hikayesi:** Müşteri olarak, ürünleri arayabilmek istiyorum, böylece istediğim ürünü hızlıca bulabileyim.

#### Kabul Kriterleri

1. WHEN kullanıcı arama kutusuna yazdığında THEN sistem otomatik tamamlama önerileri gösterecektir
2. WHEN kullanıcı arama yaptığında THEN sistem ilgili ürünleri listeleyecektir
3. WHEN arama sonucu bulunamadığında THEN sistem "Ürün bulunamadı" mesajı gösterecektir
4. WHEN kullanıcı filtreleme yaptığında THEN sistem sonuçları filtreleyecektir

### Gereksinim 8

**Kullanıcı Hikayesi:** Müşteri olarak, kişiselleştirilmiş alışveriş deneyimi yaşamak istiyorum, böylece ilgimi çekebilecek ürünleri kolayca keşfedebileyim.

#### Kabul Kriterleri

1. WHEN kullanıcı siteyi ziyaret ettiğinde THEN sistem önceki alışveriş geçmişine göre öneriler sunacaktır
2. WHEN kullanıcı bir ürünü görüntülediğinde THEN sistem benzer ürünleri gösterecektir
3. WHEN kullanıcı sepetine ürün eklediğinde THEN sistem tamamlayıcı ürün önerileri sunacaktır
4. WHEN kullanıcı favori kategorileri belirlediğinde THEN sistem ana sayfada bu kategorileri öne çıkaracaktır

### Gereksinim 9

**Kullanıcı Hikayesi:** Müşteri olarak, sosyal kanıt ve güven unsurları görmek istiyorum, böylece güvenle alışveriş yapabileyim.

#### Kabul Kriterleri

1. WHEN kullanıcı ürün detayına baktığında THEN sistem müşteri yorumlarını ve puanlamaları gösterecektir
2. WHEN kullanıcı ödeme sayfasında olduğunda THEN sistem güvenlik sertifikalarını ve ödeme güvencelerini gösterecektir
3. WHEN kullanıcı ana sayfayı ziyaret ettiğinde THEN sistem müşteri memnuniyet göstergelerini sunacaktır
4. WHEN kullanıcı bir ürünü incelediğinde THEN sistem "Son 24 saatte X kişi satın aldı" gibi sosyal kanıt mesajları gösterecektir

### Gereksinim 10

**Kullanıcı Hikayesi:** Müşteri olarak, hızlı ve kolay checkout süreci yaşamak istiyorum, böylece alışverişimi minimum adımda tamamlayabileyim.

#### Kabul Kriterleri

1. WHEN kullanıcı sepetinden ödemeye geçtiğinde THEN sistem tek sayfa checkout deneyimi sunacaktır
2. WHEN kullanıcı daha önce alışveriş yaptıysa THEN sistem kayıtlı adres ve ödeme bilgilerini otomatik dolduracaktır
3. WHEN kullanıcı misafir olarak alışveriş yapmak istediğinde THEN sistem kayıt olmadan sipariş verme imkanı sunacaktır
4. WHEN kullanıcı ödeme işlemini tamamladığında THEN sistem 3 saniye içinde onay sayfasını gösterecektir

### Gereksinim 11

**Kullanıcı Hikayesi:** Müşteri olarak, kampanya ve fırsatlardan haberdar olmak istiyorum, böylece avantajlı alışveriş yapabileyim.

#### Kabul Kriterleri

1. WHEN kullanıcı ana sayfayı ziyaret ettiğinde THEN sistem aktif kampanyaları ve indirimleri öne çıkaracaktır
2. WHEN kullanıcı sepetine ürün eklediğinde THEN sistem geçerli kupon kodlarını önerecektir
3. WHEN kullanıcı belirli bir tutarın altında alışveriş yaptığında THEN sistem ücretsiz kargo için gereken tutarı gösterecektir
4. WHEN kullanıcı e-posta listesine kayıt olduğunda THEN sistem özel indirim kodu gönderecektir

### Gereksinim 12

**Kullanıcı Hikayesi:** Müşteri olarak, siparişimin durumunu takip etmek istiyorum, böylece teslimat sürecinden haberdar olabileyim.

#### Kabul Kriterleri

1. WHEN kullanıcı sipariş verdiğinde THEN sistem gerçek zamanlı sipariş takip numarası verecektir
2. WHEN sipariş durumu değiştiğinde THEN sistem kullanıcıya SMS ve e-posta bildirimi gönderecektir
3. WHEN kullanıcı sipariş takip sayfasını ziyaret ettiğinde THEN sistem detaylı durum bilgisi ve tahmini teslimat zamanı gösterecektir
4. WHEN sipariş kargoya verildiğinde THEN sistem kargo takip numarasını paylaşacaktır