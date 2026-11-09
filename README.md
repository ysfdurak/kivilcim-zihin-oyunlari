# Kıvılcım · Zihin Oyunları

Kıvılcım, yetişkinler için hafıza, dikkat, işlem yeteneği, strateji, sözel ve uzamsal düşünme alanlarında 42 kısa oyun içeren Türkçe bir web uygulamasıdır. Tek bir oyun seçebilir, üç oyunluk günlük seansı oynayabilir veya favorilerinle kendi seansını oluşturabilirsin.

- **Hafıza** · Sipariş Hafızası, Mekân Hafızası ve antika hatırlama.
- **Dikkat** · Foto Safari, Dikkat Pisti ve çift radar görevleri.
- **İşlem yeteneği** · düşen işlemler, Eksik İşlem ve sayı hedefleri.
- **Strateji** · Çıkış Planı, Kavşak Kontrolü ve rota bulmacaları.
- **Sözel** · Kelime Avı, Hangisi Farklı? ve Anlam Eşi.
- **Uzamsal** · Zihinde Döndür ve Ayna Ustası.

İşlem alanına Tahmin Ustası ve Kasa Başı eklendi. Süre baskısı olmayan oyunlar **☾ Sakin** filtresinde toplanır.

## Düzeyler ve yıldızlar

Her oyunda 10 düzey vardır. Kısa turda %85 ve üzeri başarı bir sonraki düzeyi açar, %55’in altı bir düzey geri götürür. Akış modunda düzey, art arda iki iyi seriyle (en az %90 isabet) kendiliğinden yükselir. Her düzey için ★ %60, ★★ %85, ★★★ %95 başarıyla kazanılır. Her oyun kaydedilmeyen kısa bir **deneme turuyla** denenebilir.

## Yerelde çalıştırma

Depo klasöründe aşağıdaki komutu çalıştır. Node.js, paket kurulumu veya derleme adımı gerekmez.

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Tarayıcıda `http://localhost:8000` adresini aç.

## GitHub Pages

Depo ayarlarında **Pages → Build and deployment** bölümünde **Deploy from a branch** kaynağını, `main` dalını ve `/ (root)` klasörünü seç. Uygulama dosyaları kök dizindedir. PWA dosya yolları hem alan adı kökünde hem de depo alt yolunda çalışır.

## Telefon ve oyun kayıtları

HTTPS üzerinden ilk açılışta çevrimdışı dosyalar hazırlanır. Destekleyen tarayıcılarda **Telefona yükle** menüsünden Kıvılcım’ı ana ekrana ekleyebilirsin.

İlerleme, tercihler ve favoriler tarayıcıda saklanır. Sites adresinden GitHub Pages adresine geçerken eski adreste **Oyun tercihleri → İlerlemeyi yedekle** ile bir kopya al, yeni adreste **Yedek yükle** ile içe aktar. Oyun sonuçları uygulama içi performansı gösterir.

## Dosyalar

- `index.html`, `style.css` ve `app.js` uygulamanın arayüzünü ve oturum akışını oluşturur.
- `catalog.js` ile oyun modülleri oyun kataloğunu ve kurallarını içerir. Sonraki dosyalar önceki fonksiyonları sarmalayarak genişletir; yükleme sırası `index.html` içindeki sıradır.
- `content.js` oyuncuya görünen metinlerin tek kaynağıdır: oyun açıklamaları, “nasıl oynanır” adımları, düzey özetleri, yıldızlar, deneme turu ve ana sayfa. Bir oyunun metnini değiştirmek için önce buraya bak.
- `new-games.js` Sözel, Uzamsal ve yeni İşlem oyunlarını içerir.
- `pwa.js`, `sw.js` ve `manifest.webmanifest` ana ekrana ekleme ve çevrimdışı açılışı yönetir.
