// Oyun öncesi ekranı sadeleştirir: ilk bakışta yalnızca ne yapılacağı ve "Oyuna başla" görünür.
// Düzey seçimi, düzey kuralları ve mod seçimi "Oyunu özelleştir" altında toplanır (kapalı açılır).
// Önerilen başlangıç düzeyi ve son seçilen mod olduğu gibi kalır; oyuncu hiçbir şey seçmeden başlayabilir.
// Diğer dosyalardaki openGame sarmalayıcılarından sonra yüklenmeli (index.html'de listen-games.js'ten sonra).
const sadeOpen = openGame;
openGame = function (id, fromSession = false) {
  sadeOpen(id, fromSession);
  const box = $('modalContent');
  if (!box || box.querySelector('details.customize')) return;
  const parcalar = ['#difficultyNote', '.levelPickTitle', '#levelPath', '.levelPathLegend', '.modePicker', '#modeDescription']
    .map((s) => box.querySelector(s)).filter(Boolean);
  if (!parcalar.length) return;
  const actions = box.querySelector('.actions');
  const ozet = () => {
    const mod = box.querySelector('.modePicker .active, .modePicker [aria-pressed="true"]');
    const modAd = mod ? (mod.querySelector('b,strong')?.textContent || mod.firstChild?.textContent || '').trim() : '';
    const not = box.querySelector('#difficultyNote')?.textContent.trim();
    return [`Düzey ${typeof setupLevel !== 'undefined' ? setupLevel : 1}`, modAd, not].filter(Boolean).join(' · ');
  };
  const d = document.createElement('details');
  d.className = 'customize';
  d.innerHTML = '<summary>Oyunu özelleştir <span></span></summary>';
  const yaz = () => { d.querySelector('summary span').textContent = ozet(); };
  d.addEventListener('click', (e) => { if (e.target.closest('summary')) return; setTimeout(yaz, 30); });
  parcalar.forEach((p) => d.appendChild(p));
  if (actions) actions.after(d); else box.appendChild(d);
  yaz();
};
