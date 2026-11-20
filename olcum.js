// Anonim kullanım ölçümü ve geri bildirim düğmesi (ortak servis: olcum.ysfdurak.com; kaynak: ysfdurak.com → sunucu/olcum).
// Yalnız resmî adreste (ysfdurak.github.io/kivilcim-zihin-oyunlari) yüklenir; başka kopyalar dışarıya istek atmaz.
// Gönderilenler: ekran adı (Bugün, Oyun kütüphanesi…), aktif süre, cihaz türü, dil. Skor, oyun içeriği, ad, IP yok; çerez yok; DNT/GPC'ye uyar.
(function () {
  if (location.hostname !== 'ysfdurak.github.io' || !/^\/kivilcim-zihin-oyunlari\//.test(location.pathname)) return;
  var k = (window.olcumKuyruk = window.olcumKuyruk || []);
  k.push(['ekran', 'home']);
  // Ekranlar adres değiştirmeden navigate() ile açılır; her geçiş ölçüme ekran olarak bildirilir.
  var gercek = window.navigate;
  if (typeof gercek === 'function') {
    window.navigate = function (p) {
      var r = gercek.apply(this, arguments);
      if (typeof p === 'string') (window.olcumKuyruk = window.olcumKuyruk || []).push(['ekran', p]);
      return r;
    };
  }
  var s = document.createElement('script');
  s.src = 'https://olcum.ysfdurak.com/olcum.js';
  s.defer = true;
  s.dataset.proje = 'kivilcim';
  s.dataset.renk = '#c2410c';
  document.head.appendChild(s);
})();
