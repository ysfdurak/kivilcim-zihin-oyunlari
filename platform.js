/* platform.js — tarayıcı (fare/klavye) ve telefon (dokunma) için ortak uyumluluk katmanı.
   - Masaüstünde klavye kısayolları: seçenekler 1–9, Kelime Avı'nda harf yazma,
     Kasa Başı'nda rakam/virgül/Enter, Esc ile ara verme
   - Cihaza göre metin: "dokun" ↔ "tıkla", kurulum düğmesinin adı
   - Adres parametreleri: ?oyun=<id>, ?gunluk=1, ?sayfa=oyunlar (uygulama kısayolları için) */

const finePointer=()=>window.matchMedia('(hover:hover) and (pointer:fine)').matches;
const isPhone=()=>/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Macintosh/.test(navigator.userAgent));
function syncDeviceClass(){document.documentElement.classList.toggle('finePointer',finePointer());document.documentElement.classList.toggle('touchDevice',!finePointer())}
syncDeviceClass();window.matchMedia('(hover:hover) and (pointer:fine)').addEventListener?.('change',syncDeviceClass);

/* Kurulum düğmesi masaüstünde "Uygulamayı yükle" olarak görünür. */
(function(){const b=$('installButton');if(b&&!isPhone()&&/Telefona/.test(b.textContent))b.textContent='↧ Uygulamayı yükle'})();

/* Masaüstünde "dokun" yerine "tıkla" yazılır (yalnız oyuncuya görünen metinlerde). */
function deviceText(s){if(!finePointer()||typeof s!=='string')return s;return s.replace(/dokunarak/g,'tıklayarak').replace(/Dokunarak/g,'Tıklayarak').replace(/dokununca/g,'tıklayınca').replace(/dokun\b/g,'tıkla').replace(/Dokun\b/g,'Tıkla').replace(/dokunma\b/g,'tıklama').replace(/dokunuş/g,'tıklama')}
const platformUi=ui;
ui=function(prompt,sub,board,answers='',hint=''){platformUi(deviceText(prompt),deviceText(sub),board,answers,deviceText(hint))};
const platformHowTo=howToHTML;
howToHTML=function(g){return deviceText(platformHowTo(g))};

/* Oyun ekranında klavye ipucu (yalnız fare/klavye kullanan cihazlarda görünür). */
function keyboardHint(g){if(!g)return '';const id=g.id;if(id==='anagram')return 'Klavye: harfleri yaz · ⌫ sil · Esc ara';if(id==='cashier')return 'Klavye: rakamları yaz · virgül · ⌫ sil · Enter onayla';if(id==='mirror')return 'Enter: kontrol et · Esc ara';if(id==='chainmath')return 'Klavye: sonucu yaz · Enter onayla';if(id==='fallmath')return 'Klavye: sonucu yaz · Enter onayla';if(g.kind==='round')return 'Klavye: 1–9 seçenekleri seçer · Esc ara';if(g.kind==='arcade')return 'Klavye: ok tuşları/boşluk (destekleyen oyunlarda) · Esc ara';return 'Esc: ara ver'}
const platformBegin=beginGame;
beginGame=function(id,fromSession=false){platformBegin(id,fromSession);const a=active;if(!a)return;const arena=$('playView').querySelector('.arena');if(arena&&!arena.querySelector('.kbdHint'))arena.insertAdjacentHTML('beforeend',`<p class="kbdHint">${keyboardHint(a.game)}</p>`)};

/* Klavye kısayolları */
const TYPED_ROUND=['anagram','cashier','chainmath','mirror'];
addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const modalOpen=$('modal')?.open;if(e.key==='Escape'&&!modalOpen&&active&&!active.recorded&&!active.paused&&typeof pausePlay==='function'){e.preventDefault();pausePlay();return}if(modalOpen||!active||active.paused||active.recorded)return;const tag=document.activeElement?.tagName;if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;const id=active.game.id;
  if(id==='anagram'&&active.awaiting){if(e.key==='Backspace'){e.preventDefault();const last=active.slots.map((v,i)=>v!=null&&!(active.fixedFirst&&i===0)?i:-1).filter(i=>i>=0).pop();if(last!=null)anagramSlot(last);return}if(e.key==='Delete'){anagramClear();return}const ch=e.key.length===1?e.key.toLocaleUpperCase('tr'):'';if(!ch)return;const w=Array.from(active.word),filled=active.slots.filter((v,i)=>v!=null&&!(active.fixedFirst&&i===0)).length;if(active.fixedFirst&&!filled&&ch===w[0]&&w[1]!==ch){e.preventDefault();return}const t=active.tiles.findIndex((c,i)=>c===ch&&!active.slots.includes(i));if(t>=0){e.preventDefault();anagramTile(t)}return}
  if(id==='cashier'&&active.awaiting){if(/^[0-9]$/.test(e.key)){e.preventDefault();cashKey(e.key)}else if(e.key===','||e.key==='.'){e.preventDefault();if(document.querySelector('.kvPad')?.textContent.includes(','))cashKey(',')}else if(e.key==='Backspace'){e.preventDefault();cashKey('⌫')}else if(e.key==='Enter'){e.preventDefault();cashSubmit()}return}
  if(id==='mirror'&&active.awaiting){if(e.key==='Enter'){e.preventDefault();mirrorCheck()}return}
  if(active.game.kind!=='round'||TYPED_ROUND.includes(id))return;
  if(/^[1-9]$/.test(e.key)){const buttons=[...document.querySelectorAll('#answers button:not([disabled])')];const b=buttons[Number(e.key)-1];if(b){e.preventDefault();b.click()}}
  else if(e.key==='Enter'){const only=[...document.querySelectorAll('#answers button:not([disabled])')];if(only.length===1){e.preventDefault();only[0].click()}}
});

/* Seçenek düğmelerine klavye numarası rozeti (yalnız masaüstünde görünür). */
const platformRender=ui;
ui=function(...args){platformRender(...args);const a=active;if(!a||a.game.kind!=='round'||TYPED_ROUND.includes(a.game.id))return;document.querySelectorAll('#answers button').forEach((b,i)=>{if(i<9&&!b.querySelector('.keyNum'))b.insertAdjacentHTML('afterbegin',`<kbd class="keyNum">${i+1}</kbd>`)})};

/* Adres parametreleri: paylaşılabilir oyun bağlantıları ve uygulama kısayolları. */
(function(){let p;try{p=new URLSearchParams(location.search)}catch(e){return}const game=p.get('oyun'),daily=p.get('gunluk'),pageName=p.get('sayfa');if(!game&&!daily&&!pageName)return;try{history.replaceState(null,'',location.pathname)}catch(e){}if(pageName==='oyunlar')navigate('games');else if(pageName==='yolculuk')navigate('progress');if(daily)setTimeout(startDaily,50);else if(game&&GAMES.some(g=>g.id===game))setTimeout(()=>openGame(game),50)})();
