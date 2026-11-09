# Kıvılcım · Zihin Oyunları

Kıvılcım, yetişkinler için hafıza, dikkat, işlem yeteneği ve strateji alanlarında 35 kısa oyun içeren Türkçe bir web uygulamasıdır. Tek bir oyun seçebilir, üç oyunluk günlük seansı oynayabilir veya favorilerinle kendi seansını oluşturabilirsin.

- **Hafıza** · Sipariş Hafızası, Mekân Hafızası ve antika hatırlama.
- **Dikkat** · Foto Safari, Dikkat Pisti ve çift radar görevleri.
- **İşlem yeteneği** · düşen işlemler, Eksik İşlem ve sayı hedefleri.
- **Strateji** · Çıkış Planı, Kavşak Kontrolü ve rota bulmacaları.

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
- `catalog.js` ile oyun modülleri oyun kataloğunu ve kurallarını içerir.
- `pwa.js`, `sw.js` ve `manifest.webmanifest` ana ekrana ekleme ve çevrimdışı açılışı yönetir.
