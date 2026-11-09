/* content.js — oyuncuya görünen metinlerin tek kaynağı ve arayüz katmanı.
   Önceki dosyalardaki açıklama ve düzey özetleri burada son haline getirilir:
   - Her oyun için kısa "nasıl oynanır" adımları (GUIDE)
   - Gerçek oyun parametreleriyle uyumlu düzey özetleri (difficultySummary)
   - Sade oyun açılış penceresi, deneme turu, yıldızlar ve kişisel rekor
   - Kısa ana sayfa, seri göstergesi, "Sakin" filtresi, titreşim
   Yeni oyunlar new-games.js içindedir ve bu dosyadan sonra yüklenir. */

/* ---------- 1. Metinler: tek kural, kısa adımlar, düzeltilmiş açıklamalar ---------- */
const LEVEL_RULE='Kısa turda %85 ve üzeri başarı bir sonraki düzeyi açar; %55’in altı bir düzey geri götürür. Akışta düzey kendiliğinden yükselir: art arda iki iyi seri (en az %90 isabet) yeter.';
const STAR_RULE='★ %60 · ★★ %85 · ★★★ %95 başarı. Akışta geçtiğin her düzey en az ★★ sayılır.';

const GUIDE={
ordermemory:['Kişilerin siparişlerini, malzemeleri ve adetleriyle incele.','Liste gizlenince sorulan kişinin çantasını hazırla; her dokunuş adedi 0–3 arasında değiştirir.','5 canın var; kısa tur 90 saniye.'],
scenememory:['Kim nerede, elinde ne var, birlikte incele.','Sahne gizlenince kişi–eşya–yer sorularını yanıtla.','İleri düzeylerde eşyalar yer değiştirir; değişikliği aklındaki sahneye uygula.'],
safari:['Hedef kuşun rengine ve kanat desenine bak.','Hareketli kuşlar arasından yalnız hedef türü fotoğrafla.','4. düzeyden sonra hedef kartı gizlenir; 5 canın var.'],
vitrine:['Vitrinden bu koleksiyonda daha önce seçmediğin bir nesne seç.','Her seçimden sonra vitrin karışır; seçtiklerini aklında tut.','Aynı nesneyi ikinci kez seçmek bir can götürür; 3 canın var.'],
ceramics:['Bir sipariş al, doğru şekil ve sır rengini seçip pişir.','Ürün pişince teslim et; sipariş süresi dolmadan yetiştir.','4. düzeyden sonra tarif gizlenir; 5 canın var.'],
lightlab:['Aynaların yerini ve yönünü incele.','Aynalar gizlenince ışığın yolunu zihninde izle, çıkış kapısını seç.','/ ve \\ aynaları ışığı 90° çevirir; 5 canın var.'],
search:['Üstteki örnek işareti incele.','Alanda örneğin tıpatıp aynısını bul ve dokun.','Yanlış seçenekler bazı özellikleri paylaşır; hepsini birlikte kontrol et.'],
route:['Bütün numaralı duraklara teslimat yapıp depoya dön.','Yoldaki sayılar dakikadır; ok tek yön, × kapalı yol demektir.','Amaç toplam süreyi en aza indirmek; sonunda en kısa rotayla karşılaştırılırsın.'],
racer:['Sol/sağ düğmeleriyle şerit değiştir.','Engellerden kaç, altın halkaları topla.','Fren enerji harcar ve kısa süre yavaşlatır.'],
ringdodge:['Sol veya sağı basılı tutarak gemiyi döndür.','Küçülen çemberin açıklığına hizalan.','Üst düzeylerde açıklık daralır ve döner.'],
junction:['Kuyruk başındaki işarete göre (↑ düz, ↶ sola) doğru faza yeşil ver.','Kuyrukların taşmasına izin verme.','İleri düzeylerde acil araçlar ve yayalar gelir; 5 canın var.'],
stacktiming:['Hareket eden bloğu alttakinin üstüne hizala, Yerleştir’e bas.','Taşan kısım kesilir; tam isabet genişlik kazandırır.','3 canın var; hedef kata ulaş.'],
associations:['Sembol–nesne çiftlerini incele.','Çiftler gizlenince sorulan nesnenin sembolünü seç.','Düzey yükseldikçe çift sayısı artar.'],
radar:['Her radarın üstünde aradığı renk ve şekil yazar.','İşaret kurala uyuyorsa ONAY’a bas, uymuyorsa geçmesini bekle.','4. düzeyden itibaren iki radar aynı anda çalışır.'],
targetmath:['İki sayı ve bir işlem seçerek onları birleştir.','Bütün başlangıç sayılarını tam bir kez kullanıp hedefe ulaş.','Bölme yalnız kalansız yapılır; geri alabilirsin.'],
chainmath:['Başlangıç sayısını aklında tut.','Gelen her işlemi bir önceki sonuca uygula.','Sonda ulaştığın sayıyı yaz.'],
parking:['Bir aracı seç, yön düğmesiyle kaydır.','Kırmızı aracı sağdaki çıkışa ulaştır.','Araçlar yalnız kendi doğrultusunda gider; geri alabilirsin.'],
power:['Bir parçaya dokunarak saat yönünde çevir.','Sol üstteki kaynaktan bütün parçaları birbirine bağla.','Dışarı açılan uç kalmamalı; enerji alan parça yeşile döner.'],
trains:['Makaslara dokunarak rayın yönünü değiştir.','Her treni harfi ve rengi aynı istasyona ulaştır.','Tren makası geçtikten sonra yapılan değişiklik onu etkilemez.'],
fallmath:['Düşen işlemin sonucunu tuş takımından yaz ve onayla.','İşlem alt çizgiye ulaşırsa bir can gider.','Aynı sonuca uyan birden çok işlem varsa en alttaki çözülür.'],
orbit:['Vurgulanan hedefleri aklında tut.','Hepsi aynı renge dönünce hareket eden hedefleri gözünle takip et.','Durduklarında başlangıçtaki hedeflere dokun.'],
pathmemory:['Haritada sırayla yanan durakları izle.','Gösterim bitince aynı güzergâhı aynı sırayla çiz.','Düzey yükseldikçe harita büyür, yol uzar, gösterim hızlanır.'],
crew:['Ekipte kimin hangi istasyonda olduğunu aklında tut.','Moladaki yer değişikliklerini sırayla takip et.','Sonunda her istasyona doğru kişiyi yerleştir.'],
flow:['Her turda en fazla iki hat seç; seçilen her hattan bir paket çıkar.','Gelecek dalgaları izleyerek hatların 3 paketlik kapasitesini aşma.','Taşan paketler kaybolur; amaç en çok teslimat.'],
market:['Tezgahtaki eşyaların değerlerini incele.','Pazarda değerler gizlenir; fiyat ve çanta yerine göre al ya da geç.','Değerlere yeniden bakmak 1 jeton harcar.'],
grid:['Yanan kareleri aklında tut.','Işıklar sönünce aynı karelere dokun.','Yanlış kareye dokunursan tur biter.'],
sequence:['Renklerin yanma sırasını izle.','Gösteri bitince aynı sırayla dokun.','Turlar ilerledikçe dizi uzar.'],
nback:['Şekiller tek tek gelir; ilk birkaçı hazırlıktır.','Her yeni şekli N adım önceki şekille karşılaştır (N ekranda yazar).','Aynı ya da Farklı’ya dokun.'],
change:['Şekillerin yerlerini incele.','Ekran kapanıp açılınca değişen konumları bul.','Düzey yükseldikçe alan büyür, değişiklik sayısı artar.'],
stroop:['Kelimenin anlamına değil, yazının rengine bak.','Mürekkebin rengini seç.','Örnek: yeşil yazılmış KIRMIZI → YEŞİL.'],
switch:['Önce üstteki kuralı oku.','Sayıyı o kurala göre sınıflandır.','Kural her turda değişebilir.'],
operator:['Eşitliği doğru yapan işlem işaretini seç.','4. düzeyden itibaren işlem önceliği önemlidir (× ve ÷ önce yapılır).','Birden çok işaret doğruysa hepsi kabul edilir.'],
pattern:['Sayı dizisinin kuralını bul.','Sıradaki sayıyı seç.','Kural artış, çarpma ya da iç içe iki dizi olabilir.'],
hanoi:['Bütün diskleri soldaki kuleden sağdakine taşı.','Önce kaynak kuleye, sonra hedef kuleye dokun.','Büyük disk küçüğün üstüne konamaz.'],
slide:['Boşluğun yanındaki taşa dokunarak kaydır.','Sayıları sıraya diz; boşluk sağ altta kalsın.','Düzeye göre alan 3×3, 4×4 ya da 5×5’tir.']
};

// Açıklaması gerçek oyunla çelişen oyunlar.
const TEXT_FIX={
grid:{instruction:'Yanan kareleri hatırla; ışıklar söndüğünde aynı karelere dokun. Düzey yükseldikçe alan büyür (3×3’ten başlar; büyük ekranda 8×8’e, telefonda 6×6’ya kadar) ve hedef sayısı artar. Hedef çoğaldıkça inceleme süresi de biraz uzar. Yanlış kareye dokunursan tur biter.'},
associations:{instruction:'Gösterilen sembol–nesne çiftlerini incele. Çiftler gizlendiğinde sorulan nesnenin sembolünü seç. Düzey yükseldikçe çift sayısı artar; çift çoğaldıkça inceleme süresi de uzar. İlişkiler her turda yeniden kurulur.'},
nback:{desc:'Şimdiki şekil, birkaç adım önceki şekille aynı mı?',instruction:'Şekiller tek tek gösterilir. Her yeni şekli ekranda yazan sayı kadar önceki şekille karşılaştır. 1. düzeyde 1 adım, 2–5. düzeylerde 2 adım, 6–8. düzeylerde 3 adım, 9–10. düzeylerde 4 adım geriye bakarsın. İlk şekiller hazırlıktır.'},
pathmemory:{instruction:'Haritada sırayla yanan durakları izle. Gösterim bitince aynı güzergâhı aynı sırayla çiz. Düzey yükseldikçe harita büyür, güzergâh uzar ve duraklar daha hızlı yanar.'}
};
for(const [id,fix] of Object.entries(TEXT_FIX)){const g=getGame(id);if(g)Object.assign(g,fix)}
// Can dilini birleştir: her yerde "can" kullanılır.
for(const g of [...GAMES,...ARCHIVED_GAMES])g.instruction=g.instruction
  .replace(/beş hatada oyun biter/gi,'5 canın bitince oyun biter')
  .replace(/Beş hata veya/g,'5 canın bitmesi veya')
  .replace(/beş hata yapana kadar/g,'5 canın bitene kadar')
  .replace(/Beş taşma\/öncelik hatasında Akış sona erer/g,'Her taşma ya da öncelik hatası bir can götürür; 5 canın bitince oyun biter')
  .replace(/ Akışta başarıya göre düzey otomatik artar; oyun sonuç ekranıyla kesilmez\. İstediğin anda Turu bitir ile kaydedebilirsin\./g,'')
  .replace(/ Akış modunda iki başarılı seri ve 30–45 saniye aktif oyunla düzey yükselir; üç canla kesintisiz devam edersin\. Kısa tur seçeneği de vardır\./g,'')
  .replace(/ Akışta iki başarılı seriyle pekişerek ilerlersin;/g,'');

// Düzey özetleri: gerçek parametrelerden üretilir, Akış ayrıntısı tek kurala taşınır.
const contentSummary=difficultySummary;
const fmtSec=ms=>(Math.round(ms/100)/10).toLocaleString('tr-TR')+' sn';
const SUMMARY={
grid:n=>{const m=memoryProfile(n);return `${m.size}×${m.size} alan · ${m.targets} hedef · ${fmtSec(m.hold)} inceleme`},
associations:n=>{const p=Math.min(8,2+Math.floor(n*.65));return `${p} sembol–nesne çifti · ${fmtSec(2500+p*700)} inceleme`},
stroop:n=>{const pool=Math.min(6,3+n),clash=Math.round((1-Math.max(.12,.65-n*.1))*100);return `${pool} renk · kelimelerin %${clash}’i rengiyle çelişir · yanıt süresi ${fmtSec(Math.max(1500,4800-n*300))}`},
operator:n=>n<4?`Tek işlem (a ? b) · sayılar en çok ${14+n*3} · ${fmtSec(18000-n*650)}`:`İki adım ve işlem önceliği (a ? b × c) · sayılar en çok ${14+n*3} · ${fmtSec(18000-n*650)}`,
switch:n=>n<4?`3 kural (tek/çift, 50 eşiği, 3’e bölünme) · iki basamaklı sayılar · ${fmtSec(6500-n*300)}`:n<5?`5 kural (rakam toplamı ve son basamak eklenir) · iki basamaklı sayılar · ${fmtSec(6500-n*300)}`:`5 kural · üç basamaklı sayılar · ${fmtSec(6500-n*300)}`,
ceramics:n=>`${n>=4?3:2} fırın · ${n<3?2:3} şekil × ${n<2?2:3} sır rengi · sipariş süresi ${Math.round(Math.max(26,46-n*1.6))} sn · tarif ${n>=4?'gizli':'görünür'}`,
orbit:n=>{const small=typeof smallScreen==='function'&&smallScreen(),count=small?Math.min(12,6+n):6+n,targets=small?Math.min(5,2+Math.floor(n/2)):Math.min(7,2+Math.floor(n/2));return `${count} nesne · ${targets} hedef · hız %${Math.round((24+n*5)/29*100)} · ${(6+n*.7).toLocaleString('tr-TR',{maximumFractionDigits:1})} sn takip`},
crew:n=>{const p=Math.min(6,n+2);return `${p} kişi · turda ${1+Math.ceil(n/2)}+ yer değişikliği (turlar ilerledikçe artar)`},
flow:n=>`${6+n*2} gelen dalga · 3 hat · hat kapasitesi 3 paket`,
market:n=>`${4+n} eşya · ${16+n*2} jeton · 6 birimlik çanta`,
nback:n=>`${n===1?1:n<6?2:n<9?3:4} adım geriye bakış · yanıt süresi ${fmtSec(7000-n*300)}`
};
difficultySummary=function(id,n){if(typeof NEW_SUMMARY!=='undefined'&&NEW_SUMMARY[id])return NEW_SUMMARY[id](n);const s=SUMMARY[id]?SUMMARY[id](n):contentSummary(id,n);return String(s).replace(/(\d)\.(\d) sn/g,'$1,$2 sn').replace(/ · Akışta iki başarılı seri.*$/,'').replace(/ · iki seriyle pekiştirme/,'')};

/* ---------- 2. Yıldızlar ve kişisel rekor ---------- */
function recordStars(h,n){if(!h||h.edition!==2)return 0;if(h.mode==='flow'){const trace=h.levelTrace||[h.level];if(!trace.includes(n))return 0;if(n<(h.highestLevel||h.level))return h.quality>=.9?3:2;return h.quality>=.6?1:0}if(h.level!==n)return 0;const q=h.quality||0;return q>=.95?3:q>=.85?2:q>=.6?1:0}
function starsFor(id,n,hist){hist=hist||user.history.filter(h=>h.id===id);let best=0;for(const h of hist)best=Math.max(best,recordStars(h,n));return best}
function starText(s){return '★'.repeat(s)+'☆'.repeat(3-s)}
function gameStars(id){const hist=user.history.filter(h=>h.id===id);let total=0,top=0;for(let n=1;n<=10;n++){const s=starsFor(id,n,hist);total+=s;if(s)top=n}return{total,top,played:hist.length}}
levelPathHTML=function(id,selected){const hist=user.history.filter(h=>h.id===id);return '<div class="levelPath starPath">'+Array.from({length:10},(_,i)=>i+1).map(n=>{const s=starsFor(id,n,hist);return `<button class="${s>=2?'passed':''} ${selected===n?'current':''}" onclick="chooseLevel(${n})" aria-label="Düzey ${n}, ${s} yıldız"><b>${n}</b><small>${starText(s)}</small></button>`}).join('')+'</div>'};

/* ---------- 3. Sade açılış penceresi ve deneme turu ---------- */
function howToHTML(g){const steps=GUIDE[g.id]||(typeof NEW_GUIDE!=='undefined'&&NEW_GUIDE[g.id]);if(!steps)return `<p>${g.instruction}</p>`;return `<ol class="howTo">${steps.map(s=>`<li>${s}</li>`).join('')}</ol><details class="fullRules"><summary>Bütün kurallar</summary><p>${g.instruction}</p></details>`}
const contentOpen=openGame;
openGame=function(id,fromSession=false){contentOpen(id,fromSession);const box=$('modalContent'),g=getGame(id);if(!box||!g)return;const h2=box.querySelector('h2'),p=h2&&h2.nextElementSibling;if(p&&p.tagName==='P')p.outerHTML=howToHTML(g);box.querySelector('label.setting')?.remove();const legend=box.querySelector('.levelPathLegend');if(legend)legend.innerHTML=`<b>Düzey nasıl atlanır?</b> ${LEVEL_RULE}<br>${STAR_RULE}`;const pick=box.querySelector('#levelPath');if(pick)pick.insertAdjacentHTML('beforebegin','<div class="levelPickTitle">Başlangıç düzeyi</div>');const actions=box.querySelector('.actions');if(actions&&!g.fixed)actions.insertAdjacentHTML('beforeend',`<button class="secondary practiceButton" onclick="beginPractice('${id}',${fromSession})">Deneme turu · kaydedilmez</button>`)};
let practicePending=false;
function beginPractice(id,fromSession=false){const mode=user.playMode,level=setupLevel;user.playMode='short';setupLevel=1;practicePending=true;try{beginGame(id,fromSession)}finally{user.playMode=mode;setupLevel=level;practicePending=false}}
const contentBegin=beginGame;
beginGame=function(id,fromSession=false){contentBegin(id,fromSession);const a=active;if(!a)return;if(practicePending){a.practice=true;a.practiceActive=0;$('playView').querySelector('.arena')?.insertAdjacentHTML('afterbegin','<div class="practiceBadge">DENEME TURU · 1. düzey · sonuç kaydedilmez</div>');if(a.game.kind!=='round'){const timer=setInterval(()=>{if(active!==a||a.recorded){clearInterval(timer);return}if(a.paused)return;a.practiceActive+=.5;if(a.practiceActive>=35){clearInterval(timer);endGame()}},500)}}startHapticWatch(a)};
const contentNextRound=nextRound;
nextRound=function(){const a=active;if(a?.practice&&a.round>=3){endGame();return}return contentNextRound()};
function practiceToReal(fromSession){const id=active?.game.id;exitGame(false);if(id)openGame(id,fromSession)}

/* ---------- 4. Sonuç ekranı: yıldız, rekor ve sade düzey mesajı ---------- */
const contentEnd=endGame;
endGame=function(){const a=active;if(!a||a.recorded)return contentEnd();if(a.practice){cancelTimers();if(typeof stopArcadeLoop==='function')stopArcadeLoop();a.recorded=true;a.completed=true;const arena=$('playView').querySelector('.arena');$('gameProgress').style.width='100%';$('gameCounter').textContent='Deneme bitti';arena.innerHTML=`<div class="resultPanel"><span class="roundInfo">DENEME TURU BİTTİ</span><h1>Kuralları kaptın mı?</h1><p class="sub">Deneme sonucu kaydedilmedi. Hazırsan asıl oyuna geç; düzeyini kendin seçebilirsin.</p><div class="answerRow"><button class="primary" onclick="practiceToReal(${!!session})">Asıl oyuna başla →</button><button class="secondary" onclick="exitGame()">Oyun alanına dön</button></div></div>`;return}
const id=a.game.id,lvl=a.flow?(a.highestLevel||a.level):a.level,before=starsFor(id,lvl),beforeTop=gameStars(id).top,levelBefore=a.level;contentEnd();if(!active?.recorded)return;const after=starsFor(id,lvl),afterTop=gameStars(id).top,panel=$('playView').querySelector('.resultPanel');if(!panel)return;const improved=after>before||(a.flow&&afterTop>beforeTop),badge=!improved?'':before===0&&!(a.flow&&beforeTop)?'Bu düzeyde ilk yıldızların!':'Yeni kişisel rekor!';panel.querySelector('.scoreLabel')?.insertAdjacentHTML('afterend',`<div class="starRow" aria-label="${after} yıldız">${starText(after)}<small>Düzey ${lvl}</small></div>${badge&&after?`<div class="recordBadge">${badge}</div>`:''}`);const next=user.levels[id];panel.querySelectorAll('.playHint').forEach(p=>{p.innerHTML=p.innerHTML.replace(/Önerilen sonraki düzey: (\d+) \/ 10\./,()=>a.flow?`Bir dahaki sefere ${next}. düzeyden başlarsın.`:next>levelBefore?`${next}. düzey açıldı. Bir dahaki tur oradan başlar.`:next<levelBefore?`Bir düzey geri: ${next}. Orada pekiştirip yeniden dene.`:`${next}. düzeyde bir tur daha dene; %85’e ulaşınca bir sonraki açılır.`)})};

/* ---------- 5. Oyun içi sade dil ---------- */
const contentHUD=flowHUD;
flowHUD=function(){contentHUD();const a=active;if(!a?.flow||a.pendingLevel)return;const status=$('flowRibbon')?.querySelector('.flowStatus');if(!status)return;let text;try{const s=masteryState(a),m=flowMetrics(a),base=a.masteryBase||m,threshold=flowThreshold(a.game.id),progress=Math.min(threshold,m.good-base.good+m.bad-base.bad),blocks=s.blocks||0;text=a.level===10?'En üst düzey · rekorunu koru':blocks>=2?(s.seconds<s.required?'Harika gidiyorsun · düzey birazdan açılır':`Bir doğru daha → Düzey ${a.level+1}`):`Sonraki düzey: ${'●'.repeat(blocks)}${'○'.repeat(2-blocks)} · bu seri ${progress}/${threshold}`}catch(e){return}const node=status.firstChild;if(node&&node.nodeType===3){if(node.textContent!==text)node.textContent=text}else status.insertAdjacentText('afterbegin',text);status.title='İki iyi seri (en az %90 isabet) bir düzey açar.';const tempo=$('flowRibbon').querySelector('.flowTempo');if(tempo&&a.game.kind!=='round'){const sec=Math.floor(playSeconds(a)),t=(a.tempo||1)<.95?'Tempo yavaşladı':`⏱ ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;if(tempo.textContent!==t)tempo.textContent=t}};

/* ---------- 6. Titreşim geri bildirimi ---------- */
function buzz(pattern){if(user.haptics===false||!navigator.vibrate)return;try{navigator.vibrate(pattern)}catch(e){}}
const contentFinishRound=finishRound;
finishRound=function(ok,explain=''){const a=active;if(a&&a.awaiting&&!a.paused&&!a.recorded)buzz(ok?12:[35,40,35]);return contentFinishRound(ok,explain)};
function startHapticWatch(a){if(a.game.kind==='round')return;let last=null;const timer=setInterval(()=>{if(active!==a||a.recorded){clearInterval(timer);return}let m;try{m=flowMetrics(a)}catch(e){return}const bad=(m&&m.bad)||0,lives=a.lives;if(last){if(bad>last.bad||(lives!=null&&last.lives!=null&&lives<last.lives))buzz([35,40,35])}last={bad,lives}},200)}
const contentSettings=showSettings;
showSettings=function(){contentSettings();const first=$('modalContent').querySelector('p');first?.insertAdjacentHTML('beforebegin',`<label class="setting"><span>Titreşim<br><small style="font-size:11px;color:#5f6e55">Doğru ve yanlışlarda kısa titreşim (destekleyen telefonlarda).</small></span><input type="checkbox" ${user.haptics!==false?'checked':''} onchange="user.haptics=this.checked;save()"></label>`)};

/* ---------- 7. Kart, filtre ve ana sayfa ---------- */
const contentCard=card;
card=function(g){const html=contentCard(g),st=gameStars(g.id);if(!st.played)return html;return html.replace(/<div class="cardBottom"><span>[^<]*<\/span>/,`<div class="cardBottom"><span class="cardStars">★ ${st.total}/30${st.top?` · en iyi D${st.top}`:''}</span>`)};
function isCalm(g){return g.kind==='puzzle'||!!g.calm}
filterHTML=function(){return `<div class="filters">${Object.entries(CATS).map(([k,v])=>`<button class="chip ${filter===k?'active':''}" onclick="setFilter('${k}')">${k!=='all'?`<i style="--dot:${v.color}"></i>`:''}${v.name}</button>`).join('')}<button class="chip ${filter==='calm'?'active':''}" onclick="setFilter('calm')" title="Süre baskısı olmayan oyunlar">☾ Sakin</button><button class="chip ${filter==='atelier'?'active':''}" onclick="setFilter('atelier')">✧ Atölye</button><input class="search" aria-label="Oyun ara" placeholder="Oyun ara…" value="${esc(query)}" oninput="searchGames(this.value)"></div>`};
filtered=function(){return GAMES.filter(g=>(page!=='favorites'||user.favorites.includes(g.id))&&(filter==='all'||g.cat===filter||(filter==='atelier'&&g.original)||(filter==='calm'&&isCalm(g)))&&(!query||(g.name+' '+g.desc).toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'))))};
function dayKey(offset){const d=new Date();d.setDate(d.getDate()+offset);return d.toLocaleDateString('en-CA',{timeZone:'Europe/Istanbul'})}
function playStreak(){const days=new Set(user.history.map(h=>h.date));let i=days.has(dayKey(0))?0:-1,n=0;while(days.has(dayKey(i))){n++;i--}return n}
week=function(){const base=new Date(),day=base.getDay(),monday=new Date(base);monday.setDate(base.getDate()-(day+6)%7);const t=today();let html='';for(let i=0;i<7;i++){const d=new Date(monday);d.setDate(monday.getDate()+i);const date=d.toLocaleDateString('en-CA',{timeZone:'Europe/Istanbul'}),played=user.history.some(h=>h.date===date);html+=`<div class="day ${date===t?'today':''} ${played?'played':''} ${date>t?'future':''}" aria-label="${d.toLocaleDateString('tr-TR',{weekday:'long'})}${played?', oynandı':''}"><span>${['P','S','Ç','P','C','C','P'][i]}</span><b>${played?'✓':d.getDate()}</b></div>`}return html};
dailyIds=function(){const n=[...today()].reduce((s,c)=>s+c.charCodeAt(0),0),areas=Object.keys(CATS).filter(k=>k!=='all');return [0,1,2].map(i=>{const pool=GAMES.filter(g=>g.cat===areas[(n+i*2)%areas.length]);return pool[(n*13+i*7)%pool.length].id})};
function homeSuggestions(exclude){const seed=[...today()].reduce((s,c)=>s+c.charCodeAt(0),0),recent=user.history.filter(h=>h.date>=dayKey(-7)),count={};for(const k of Object.keys(CATS))if(k!=='all')count[k]=recent.filter(h=>getGame(h.id)?.cat===k).length;const cats=Object.keys(count).sort((a,b)=>count[a]-count[b]||((seed+a.length)%3)-((seed+b.length)%3));const out=[];for(const c of cats){const pool=GAMES.filter(g=>g.cat===c&&!exclude.includes(g.id)&&!out.includes(g));if(!pool.length)continue;const fresh=pool.filter(g=>!user.history.some(h=>h.id===g.id));const pick=(fresh.length?fresh:pool)[seed%(fresh.length||pool.length)];out.push(pick);if(out.length===4)break}return out}
renderHome=function(){const complete=new Set(user.history.filter(h=>h.date===today()&&h.sessionDate===today()).map(h=>h.id)).size,ids=dailyIds(),streak=playStreak();const recentIds=[...new Set(user.history.slice().reverse().map(h=>h.id))].filter(id=>GAMES.some(g=>g.id===id)).slice(0,3),recent=recentIds.map(id=>GAMES.find(g=>g.id===id)),suggest=homeSuggestions([...ids,...recentIds]);$('main').innerHTML=`<section class="homeHero"><div><span class="eyebrow">BUGÜN KENDİNE BİR OYUN MOLASI VER</span><h1 class="heroTitle">Küçük bir mola.<br>Yeni bir <em>kıvılcım.</em></h1><p class="heroDesc">Hatırla, odaklan, farklı düşün.<br>Her gün başka oyunlarla kendi ritmini bul.</p><div class="streakLine">${streak?`Serin: <b>${streak} gün</b> art arda.${user.history.some(h=>h.date===today())?'':' Bugün de oynarsan seri sürer.'}`:'Bugün bir oyun oyna, serini başlat.'}</div><div class="weekly">${week()}</div></div><div class="dailyCard"><span class="eyebrow">GÜNÜN KARIŞIMI</span><h2>Üç oyun. Taze bir başlangıç.</h2><p>${ids.map(id=>GAMES.find(g=>g.id===id).name).join(' · ')}<br>${complete>=3?'Bugünkü seansın tamamlandı. Yeniden oynayabilirsin.':'Yaklaşık 4–6 dakika · kendi hızında'}</p><button class="primary" onclick="startDaily()">${complete>=3?'Yeniden oyna':'Günlük seansa başla'} <span style="margin-left:15px">→</span></button><div class="dailyArt">${art('sequence')}</div></div></section>${recent.length?`<div class="sectionHeader"><h2>Kaldığın yerden</h2><span>son oynadıkların</span></div><div class="cardGrid">${recent.map(card).join('')}</div>`:''}<div class="sectionHeader"><h2>${recent.length?'Bugün için öneriler':'Buradan başlayabilirsin'}</h2><span>az oynadığın alanlardan</span></div><div class="cardGrid">${suggest.map(card).join('')}</div><div class="homeMore"><button class="primary" onclick="navigate('games')">Bütün oyunlara göz at · ${GAMES.length} oyun →</button><p>Yeni: Sözel ve Uzamsal oyunlar, deneme turu, düzey yıldızları ve “☾ Sakin” filtresi.</p></div>`};
