# Kıvılcım · Zihin Oyunları

Kıvılcım, yetişkinler için hafıza, dikkat, işlem yeteneği, strateji, sözel, uzamsal ve dinleme alanlarında 50 kısa oyun içeren Türkçe bir web uygulamasıdır.

**Oyna:** https://ysfdurak.github.io/kivilcim-zihin-oyunlari/

Telefon ve bilgisayar için **ayrı bir bağlantı gerekmez**: aynı adres iki cihazda da açılır, ekran boyutuna ve dokunmatik/klavye kullanımına göre kendini ayarlar. Telefonda ana ekrana, bilgisayarda uygulama olarak kurulabilir; yeni sürümler aynı adresten otomatik gelir.

Tek bir oyun seçebilir, üç oyunluk günlük seansı oynayabilir veya favorilerinle kendi seansını oluşturabilirsin.

- **Hafıza** · Sipariş Hafızası, Mekân Hafızası ve antika hatırlama.
- **Dikkat** · Foto Safari, Dikkat Pisti, çift radar görevleri ve Sıra Avı.
- **İşlem yeteneği** · düşen işlemler, Eksik İşlem ve sayı hedefleri.
- **Strateji** · Çıkış Planı, Kavşak Kontrolü, rota bulmacaları, Şifre Kırıcı, Işıkları Söndür ve Sayı Yerleştir (sudoku).
- **Sözel** · Kelime Avı, Hangisi Farklı? ve Anlam Eşi.
- **Uzamsal** · Zihinde Döndür ve Ayna Ustası.
- **Dinleme** · Ses Hafızası, Tiz mi Pes mi?, Ritim Ustası ve Kaç Ses? Sesle oynanır; sesler tarayıcıda üretilir, çevrimdışı da çalışır. Telefon sessizdeyse ses gelmeyebilir; oyun penceresindeki **Sesi dene** düğmesiyle kontrol edilir. Günün karışımına sesli oyun konmaz.

İşlem alanına Tahmin Ustası ve Kasa Başı eklendi. Süre baskısı olmayan oyunlar **☾ Sakin** filtresinde toplanır.

## Düzeyler ve yıldızlar

Üst düzeylerde kolay kalan oyunların zorluğu artırıldı: İşaret Avı’nda tek özellik farkı ve gizlenen örnek, Kural Değişti’de “VE / YA DA” ile birleşik kurallar, Eksik İşlem’de dört sayılı ifadeler, Ne Değişti?’de 6×6 alan ve 4 değişiklik, Seramik Vardiyası’nda 16 saniyeye inen sipariş süresi, Renk Çatışması’nda “kelimeye bak” görev değişimi.


Her oyunda 10 düzey vardır. Kısa turda %85 ve üzeri başarı bir sonraki düzeyi açar, %55’in altı bir düzey geri götürür. Akış modunda düzey, art arda iki iyi seriyle (en az %90 isabet) kendiliğinden yükselir. Her düzey için ★ %60, ★★ %85, ★★★ %95 başarıyla kazanılır. Her oyun kaydedilmeyen kısa bir **deneme turuyla** denenebilir.

## Yerelde çalıştırma

Depo klasöründe aşağıdaki komutu çalıştır. Node.js, paket kurulumu veya derleme adımı gerekmez.

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Tarayıcıda `http://localhost:8000` adresini aç.

## GitHub Pages

Depo ayarlarında **Pages → Build and deployment** bölümünde **Deploy from a branch** kaynağını, `main` dalını ve `/ (root)` klasörünü seç. Uygulama dosyaları kök dizindedir. PWA dosya yolları hem alan adı kökünde hem de depo alt yolunda çalışır.

## Tarayıcı ve telefon

Kıvılcım aynı adresten hem bilgisayar tarayıcısında hem telefonda çalışır; ekran genişliğine göre düzen değişir.

- **Telefon:** dokunmatik kontroller, alt gezinme çubuğu, ana ekrana ekleme (Android: Chrome → ⋮ → Uygulamayı yükle · iPhone: Safari → Paylaş → Ana Ekrana Ekle).
- **Bilgisayar:** fare ve klavye. Seçenekli oyunlarda 1–9 tuşları, Kelime Avı'nda harfleri yazma, Kasa Başı'nda rakam + Enter, her oyunda Esc ile ara verme. Chrome/Edge adres çubuğundaki yükle simgesiyle masaüstü uygulaması olarak da kurulabilir.
- **Bağlantılar:** `?oyun=anagram` bir oyunu doğrudan açar, `?gunluk=1` günün karışımını başlatır, `?sayfa=oyunlar` kütüphaneyi açar.
- Yeni sürüm yayınlandığında kurulu uygulamada “Yeni sürüm hazır · Şimdi güncelle” bildirimi çıkar.

## Telefon ve oyun kayıtları

HTTPS üzerinden ilk açılışta çevrimdışı dosyalar hazırlanır. Destekleyen tarayıcılarda **Telefona yükle** menüsünden Kıvılcım’ı ana ekrana ekleyebilirsin.

İlerleme, tercihler ve favoriler tarayıcıda saklanır. Sites adresinden GitHub Pages adresine geçerken eski adreste **Oyun tercihleri → İlerlemeyi yedekle** ile bir kopya al, yeni adreste **Yedek yükle** ile içe aktar. Oyun sonuçları uygulama içi performansı gösterir.

## Dosyalar

- `index.html`, `style.css` ve `app.js` uygulamanın arayüzünü ve oturum akışını oluşturur.
- `catalog.js` ile oyun modülleri oyun kataloğunu ve kurallarını içerir. Sonraki dosyalar önceki fonksiyonları sarmalayarak genişletir; yükleme sırası `index.html` içindeki sıradır.
- `content.js` oyuncuya görünen metinlerin tek kaynağıdır: oyun açıklamaları, “nasıl oynanır” adımları, düzey özetleri, yıldızlar, deneme turu ve ana sayfa. Bir oyunun metnini değiştirmek için önce buraya bak.
- `new-games.js` Sözel, Uzamsal ve yeni İşlem oyunlarını içerir.
- `more-games.js` Sıra Avı, Şifre Kırıcı, Işıkları Söndür ve Sayı Yerleştir oyunlarını içerir.
- `difficulty.js` üst düzey zorluk eğrilerini içerir.
- `listen-games.js` Dinleme kategorisini ve ses motorunu içerir.
- `platform.js` klavye kısayollarını, cihaza göre metinleri ve adres parametrelerini yönetir.
- `pwa.js`, `sw.js` ve `manifest.webmanifest` ana ekrana ekleme ve çevrimdışı açılışı yönetir.
