"""Service worker güncelleme testi (gerçek Chrome ile).

Senaryo: Kullanıcı uygulamayı açar, kaydı oluşur. Yeni yayında bir oyun dosyası
değişir ve `node tools/sw-surum.mjs` çalıştırılır. Kullanıcı sayfayı yeniden açınca:
  1) "Yeni sürüm hazır" bildirimi görünmeli,
  2) "Şimdi güncelle" sonrası yeni kod yüklenmeli,
  3) localStorage'daki kayıt (geçmiş, favoriler) korunmalı.
Karşılaştırma için aynı senaryo sabit önbellek adıyla (eski "v4" davranışı) da
çalıştırılır; orada yeni kodun ulaşmadığı gösterilir.

Çalıştırma: python3 tests/sw_guncelleme_test.py [chrome-yolu]
Gerekenler: pip install playwright; Chrome (varsayılan /usr/bin/google-chrome)
"""
import functools, http.server, json, os, re, shutil, socketserver, subprocess, sys, tempfile, threading
from playwright.sync_api import sync_playwright

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = sys.argv[1] if len(sys.argv) > 1 else '/usr/bin/google-chrome'
KAYIT = {"history": [{"game": "test", "score": 42}], "favorites": ["x"], "levels": {}, "relaxed": False, "custom": []}


def senaryo(surum_guncellenir: bool):
    site = tempfile.mkdtemp(prefix='kivilcim-sw-')
    shutil.copytree(REPO, site, dirs_exist_ok=True, ignore=shutil.ignore_patterns('.git', 'tests'))
    if not surum_guncellenir:
        sw = open(f'{site}/sw.js').read()
        sw = re.sub(r"const cacheName = `\$\{cachePrefix\}[^`]*`;", "const cacheName = `${cachePrefix}v4`;", sw)
        open(f'{site}/sw.js', 'w').write(sw)

    class Sessiz(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Sessiz, directory=site))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = f'http://127.0.0.1:{srv.server_address[1]}/'
    try:
        with sync_playwright() as p:
            tarayici = p.chromium.launch(executable_path=CHROME, args=['--no-sandbox'])
            # Playwright'ın wait_for_function'ı dizeyi eval ile çalıştırır; sayfanın CSP'si (unsafe-eval yok) bunu engeller.
            sayfa = tarayici.new_context(bypass_csp=True).new_page()
            sayfa.goto(url)
            sayfa.wait_for_function('navigator.serviceWorker.controller!==null', timeout=20000)
            sayfa.wait_for_function('typeof offlineReady!=="undefined" && offlineReady===true', timeout=20000)
            sayfa.evaluate("k=>localStorage.setItem('kivilcim-v1',JSON.stringify(k))", KAYIT)

            with open(f'{site}/games.js', 'a') as f:
                f.write("\nwindow.__SURUM='yeni';\n")
            if surum_guncellenir:
                subprocess.run(['node', f'{site}/tools/sw-surum.mjs'], check=True, capture_output=True)

            sayfa.reload()
            try:
                sayfa.wait_for_selector('#updateBanner', timeout=20000)
                bildirim = True
            except Exception:
                bildirim = False
            if bildirim:
                with sayfa.expect_navigation():
                    sayfa.click('#updateBanner button:has-text("Şimdi güncelle")')
            else:
                sayfa.reload()
            sayfa.wait_for_timeout(1500)
            yeni_kod = sayfa.evaluate("window.__SURUM==='yeni'")
            kayit = json.loads(sayfa.evaluate("localStorage.getItem('kivilcim-v1')"))
            tarayici.close()
    finally:
        srv.shutdown()
        srv.server_close()
        shutil.rmtree(site, ignore_errors=True)
    korundu = kayit.get('history') == KAYIT['history'] and kayit.get('favorites') == KAYIT['favorites']
    return bildirim, yeni_kod, korundu


eski = senaryo(False)
print(f'Sabit sürüm (eski davranış): bildirim={eski[0]} yeni kod={eski[1]} kayıt korundu={eski[2]}')
yeni = senaryo(True)
print(f'İçerikten sürüm:             bildirim={yeni[0]} yeni kod={yeni[1]} kayıt korundu={yeni[2]}')

hatalar = []
if not all(yeni):
    hatalar.append('içerikten üretilen sürümle güncelleme akışı çalışmadı')
if eski[1]:
    hatalar.append('karşılaştırma senaryosu beklenmedik şekilde yeni kodu yükledi; test artık sorunu ayırt etmiyor')
if hatalar:
    sys.exit('HATA: ' + '; '.join(hatalar))
print('Tamam: yeni sürüm kullanıcıya ulaşıyor ve kayıtlar korunuyor.')
