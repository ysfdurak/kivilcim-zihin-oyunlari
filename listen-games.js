/* listen-games.js — Dinleme kategorisi: sesle oynanan 4 oyun.
   Ses Hafızası, Tiz mi Pes mi?, Ritim Ustası, Kaç Ses?
   Sesler Web Audio ile üretilir; dosya indirilmez, çevrimdışı da çalışır. */

(function(){const keep={...CATS};for(const k of Object.keys(CATS))delete CATS[k];Object.assign(CATS,keep,{listen:{name:'Dinleme',color:'#c2588f'}})})();

/* ---------- Ses motoru ---------- */
let AC=null;
function audioCtx(){if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{AC=new C()}catch(e){return null}try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(e){}}if(AC.state==='suspended')AC.resume().catch(()=>{});return AC}
function tone(freq,dur=.32,when=0,type='triangle',vol=.28){const ac=audioCtx();if(!ac)return false;const t=ac.currentTime+.03+when,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.setValueAtTime(vol,t+Math.max(.02,dur-.08));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+dur+.05);return true}
function click(when=0,hi=false){return tone(hi?1400:900,.07,when,'square',.18)}
function soundTest(){if(!tone(523,.25)||!tone(659,.25,.28)||!tone(784,.35,.56))toast('Bu tarayıcıda ses çalınamıyor.');else toast('Sesi duyduysan hazırsın. Duymadıysan telefonun sessiz modunu ve ses düzeyini kontrol et.')}
const NOTES=[261.63,293.66,329.63,392.00,440.00,523.25];

/* ---------- Oyun tanımları ---------- */
const LISTEN_GAMES=[
{id:'tonememory',name:'Ses Hafızası',cat:'listen',kind:'round',rounds:5,calm:true,desc:'Notaların sırasını dinle, aynı sırayla çal.',instruction:'Notalar sırayla çalınır. Dinleme bitince aynı sırayla tuşlara dokun; her tuş kendi notasını çalar. 1–2. düzeyde tuşlar da yanar, 3. düzeyden sonra yalnız ses vardır. Düzey yükseldikçe tuş sayısı ve dizi uzunluğu artar. Sesi açık tut; kulaklık önerilir.'},
{id:'pitch',name:'Tiz mi Pes mi?',cat:'listen',kind:'round',rounds:12,calm:true,desc:'İki ses: ikincisi daha ince mi, daha kalın mı?',instruction:'İki ses art arda çalınır. İkinci ses birinciden daha tiz (ince, yüksek) mi yoksa daha pes (kalın, alçak) mı, seç. Düzey yükseldikçe iki ses arasındaki fark küçülür; üst düzeylerde ses rengi de değişerek yanıltır. İlk düzeylerde bir kez yeniden dinleyebilirsin.'},
{id:'rhythm',name:'Ritim Ustası',cat:'listen',kind:'round',rounds:6,desc:'Duyduğun ritmi aynen vur.',instruction:'Bir ritim çalınır. Bitince büyük düğmeye (bilgisayarda boşluk tuşuna) aynı ritimle vur. Hız önemli değil; vuruşlar arasındaki uzun–kısa oranları tutmalı. Düzey yükseldikçe vuruş sayısı artar, aralıklar incelir ve tolerans azalır.'},
{id:'beepcount',name:'Kaç Ses?',cat:'listen',kind:'round',rounds:8,calm:true,desc:'Hızlı sesleri say; gerekirse yalnız tiz olanları.',instruction:'Hızlı bir ses dizisi çalınır ve sorulan sesleri sayarsın. 1–3. düzeyde bütün sesleri sayarsın. 4–7. düzeyde yalnız tiz (yüksek) sesleri sayarsın, arada kalın sesler gelir. 8. düzeyden sonra üç farklı ses gelir ve yalnız ortadakileri sayarsın. Dizi hızlanır ve uzar.'}
];
for(const g of LISTEN_GAMES){g.original=true;g.featured=true;g.newSet=true;g.sound=true}
GAMES.unshift(...LISTEN_GAMES);
const LISTEN_IDS=LISTEN_GAMES.map(g=>g.id);
Object.assign(NEW_GUIDE,{
tonememory:['🔊 Sesi aç; kulaklık önerilir.','Notaların sırasını dinle.','Aynı sırayla tuşlara dokun; 3. düzeyden sonra tuşlar yanmaz.'],
pitch:['🔊 Sesi aç; kulaklık önerilir.','İki sesi dinle.','İkincisi daha tiz (ince) mi, daha pes (kalın) mı, seç.'],
rhythm:['🔊 Sesi aç.','Ritmi dinle.','Büyük düğmeye aynı uzun–kısa düzenle vur; hız önemli değil.'],
beepcount:['🔊 Sesi aç; kulaklık önerilir.','Hızlı ses dizisini dinle.','Sorulan sesleri say: hepsini, yalnız tizleri ya da yalnız ortadakileri.']
});
function toneProfile(n){return{pads:n<=2?4:n<=6?5:6,len:3+Math.floor(n*.7),lit:n<=2,gap:Math.max(330,620-n*30)}}
function pitchCents(n){return[0,600,400,300,200,130,90,60,40,28,18][n]}
function rhythmProfile(n){return{beats:3+Math.floor((n+1)/2),units:n<=3?[1,2]:n<=6?[1,2,3]:[.5,1,1.5,2],unit:Math.max(260,460-n*20),tol:Math.max(.2,.48-n*.03),show:n<=3}}
function countProfile(n){return n<=3?{mode:'all',min:3+n,max:5+n,gap:Math.max(240,380-n*25)}:n<=7?{mode:'high',min:5+n,max:8+n,gap:Math.max(190,330-n*18)}:{mode:'mid',min:8+n,max:11+n,gap:Math.max(160,280-n*12)}}
Object.assign(NEW_SUMMARY,{
tonememory:n=>{const p=toneProfile(n);return `${p.pads} nota · ${p.len} notalık dizi · ${p.lit?'tuşlar da yanar':'yalnız ses'} · süre yok`},
pitch:n=>`Ses farkı ${pitchCents(n)} sent (${(pitchCents(n)/100).toLocaleString('tr-TR')} yarım ton)${n>=7?' · değişen ses rengi':''}${n<=4?' · bir kez yeniden dinleme':''}`,
rhythm:n=>{const p=rhythmProfile(n);return `${p.beats} vuruş · ${p.units.length} farklı aralık · tolerans %${Math.round(p.tol*100)}${p.show?' · ritim görünür':''}`},
beepcount:n=>{const p=countProfile(n);return `${p.min}–${p.max} ses · ${p.mode==='all'?'hepsini say':p.mode==='high'?'yalnız tizleri say':'üç ses, yalnız ortadakileri say'} · ${p.gap} ms aralık`}
});

/* ---------- Tur akışı ---------- */
const listenRoundBase=nextRound;
nextRound=function(){const a=active;if(!a||!LISTEN_IDS.includes(a.game.id))return listenRoundBase();if(a.practice&&a.round>=3){endGame();return}cancelTimers();$('gameCounter').textContent=`${a.round+1} / ${a.game.rounds}`;$('roundInfo').textContent='TUR '+(a.round+1);a.awaiting=false;a.replays=0;if(!audioCtx()){ui('Ses desteklenmiyor.','Bu tarayıcı ses çalamıyor; başka bir oyun seç.','');return}({tonememory:toneRound,pitch:pitchRound,rhythm:rhythmRound,beepcount:countRound})[a.game.id]()};
function listenBoard(inner){return `<div class="listenBoard">${inner}</div>`}
function listenStatus(t){const s=$('listenStatus');if(s)s.textContent=t}

/* Ses Hafızası */
function toneRound(){const a=active,p=toneProfile(a.level);a.tp=p;a.seq=Array.from({length:p.len},()=>rand(p.pads));a.step=0;ui('Dinle…',`${p.len} nota · ${p.lit?'tuşlar da yanacak':'yalnız ses'}`,listenBoard(`<div class="listenWave" id="listenWave"><i></i><i></i><i></i><i></i><i></i></div><p id="listenStatus">Dizi çalıyor</p>`),Array.from({length:p.pads},(_,i)=>`<button class="answer padTone" id="tpad${i}" style="--hue:${[340,25,48,140,200,265][i]}" disabled onclick="tonePick(${i})">${['Do','Re','Mi','Sol','La','Do↑'][i]}</button>`).join(''));$('listenWave').classList.add('on');a.seq.forEach((v,i)=>{tone(NOTES[v],p.gap/1000*.8,(i*p.gap)/1000);if(p.lit){later(()=>$('tpad'+v)?.classList.add('lit'),i*p.gap+30);later(()=>$('tpad'+v)?.classList.remove('lit'),i*p.gap+p.gap*.75)}});later(()=>{$('listenWave')?.classList.remove('on');listenStatus('Şimdi sıra sende');$('prompt').textContent='Aynı sırayla çal.';document.querySelectorAll('.padTone').forEach(b=>b.disabled=false);a.awaiting=true},a.seq.length*p.gap+250)}
function tonePick(i){const a=active;if(!a?.awaiting||a.game.id!=='tonememory')return;tone(NOTES[i],.28);const b=$('tpad'+i);b?.classList.add('lit');setTimeout(()=>b?.classList.remove('lit'),180);if(a.seq[a.step]!==i){finishRound(false,'Doğru sıra: '+a.seq.map(v=>['Do','Re','Mi','Sol','La','Do↑'][v]).join(' → '));return}a.step++;listenStatus(`${a.step} / ${a.seq.length}`);if(a.step===a.seq.length)finishRound(true,'Diziyi eksiksiz çaldın.')}

/* Tiz mi Pes mi? */
function pitchRound(){const a=active,n=a.level,base=220+rand(330),up=Math.random()<.5,cents=pitchCents(n)*(.85+Math.random()*.3);a.pitch={f1:base,f2:base*Math.pow(2,(up?1:-1)*cents/1200),t1:'triangle',t2:n>=7?pick(['sine','square','sawtooth']):'triangle'};a.expected=up?0:1;a.explain=`İkinci ses ${up?'daha tiz':'daha pes'}ti.`;ui('İkinci ses nasıl?','Dinle: önce birinci, sonra ikinci ses.',listenBoard(`<div class="pitchPair"><span id="pp1">1</span><span id="pp2">2</span></div><p id="listenStatus">Dinle</p>${n<=4?'<button class="replayBtn" onclick="pitchReplay()">↻ Bir kez daha dinle</button>':''}`),answerButton('↑ Daha TİZ (ince)',0)+answerButton('↓ Daha PES (kalın)',1));pitchPlay();later(()=>{a.awaiting=true;listenStatus('Seçimini yap')},1250)}
function pitchPlay(){const p=active.pitch;tone(p.f1,.42,0,p.t1,p.t1==='square'?.12:.28);tone(p.f2,.42,.68,p.t2,p.t2==='square'||p.t2==='sawtooth'?.12:.28);later(()=>$('pp1')?.classList.add('on'),30);later(()=>{$('pp1')?.classList.remove('on');$('pp2')?.classList.add('on')},700);later(()=>$('pp2')?.classList.remove('on'),1150)}
function pitchReplay(){const a=active;if(!a||a.game.id!=='pitch'||a.replays>=1||!a.awaiting)return;a.replays++;document.querySelector('.replayBtn')?.setAttribute('disabled','');pitchPlay()}

/* Ritim Ustası */
function rhythmRound(){const a=active,p=rhythmProfile(a.level);a.rp=p;let iv;do{iv=Array.from({length:p.beats-1},()=>pick(p.units))}while(new Set(iv).size<2);a.iv=iv;a.taps=[];const times=[0];iv.forEach(v=>times.push(times.at(-1)+v*p.unit));ui('Ritmi dinle.',`${p.beats} vuruş · hız değil, uzun–kısa düzeni önemli`,listenBoard(`<div class="beatRow" id="beatRow">${times.map(()=>'<i></i>').join('')}</div><p id="listenStatus">Ritim çalıyor</p>`),'<button class="answer tapBig" id="tapBig" disabled onpointerdown="rhythmTap(event)">VUR</button>');times.forEach((t,i)=>{click(t/1000,i===0);if(p.show){later(()=>document.querySelectorAll('#beatRow i')[i]?.classList.add('on'),t+20)}});later(()=>{document.querySelectorAll('#beatRow i').forEach(x=>x.classList.remove('on'));listenStatus('Şimdi aynı ritmi vur');$('prompt').textContent='Sıra sende: vur.';$('tapBig').disabled=false;a.awaiting=true},times.at(-1)+700)}
function rhythmTap(e){e?.preventDefault?.();const a=active;if(!a?.awaiting||a.game.id!=='rhythm')return;click(0,a.taps.length===0);a.taps.push(performance.now());document.querySelectorAll('#beatRow i')[a.taps.length-1]?.classList.add('on');if(a.taps.length<a.rp.beats)return;const u=a.taps.slice(1).map((t,i)=>t-a.taps[i]),sumU=u.reduce((s,x)=>s+x,0),sumT=a.iv.reduce((s,x)=>s+x,0),scale=sumU/sumT;const err=Math.max(...u.map((x,i)=>Math.abs(x/scale-a.iv[i])/a.iv[i]));finishRound(err<=a.rp.tol,err<=a.rp.tol?`Ritim tuttu (sapma %${Math.round(err*100)}).`:`En büyük sapma %${Math.round(err*100)}; sınır %${Math.round(a.rp.tol*100)}.`)}
addEventListener('keydown',e=>{if(e.code!=='Space'||e.repeat||$('modal')?.open||active?.game.id!=='rhythm')return;e.preventDefault();rhythmTap()});

/* Kaç Ses? */
function countRound(){const a=active,p=countProfile(a.level),total=p.min+rand(p.max-p.min+1),lo=330,mid=520,hi=780;let seq;if(p.mode==='all')seq=Array(total).fill(mid);else if(p.mode==='high')seq=Array.from({length:total},()=>Math.random()<.5?hi:lo);else seq=Array.from({length:total},()=>pick([lo,mid,hi]));const target=p.mode==='all'?seq.length:seq.filter(f=>f===(p.mode==='high'?hi:mid)).length;a.expected=target;const opts=[...new Set([target,target-1,target+1,target+(Math.random()<.5?2:-2)])].filter(v=>v>=0).slice(0,4).sort((x,y)=>x-y);a.expected=opts.indexOf(target);a.explain=`Doğru sayı: ${target}.`;const ask=p.mode==='all'?'Kaç ses duydun?':p.mode==='high'?'Kaç TİZ ses duydun?':'Kaç ORTA ses duydun?';ui(ask,p.mode==='all'?'Bütün sesleri say.':p.mode==='high'?'Yalnız ince (yüksek) sesleri say; kalınları atla.':'Üç ses var: yalnız ortadakini say.',listenBoard(`${p.mode==='mid'?`<div class="refTones"><button onclick="tone(330,.25)">Kalın</button><button onclick="tone(520,.25)">Orta</button><button onclick="tone(780,.25)">İnce</button></div>`:p.mode==='high'?'<div class="refTones"><button onclick="tone(330,.25)">Kalın</button><button onclick="tone(780,.25)">İnce</button></div>':''}<div class="listenWave" id="listenWave"><i></i><i></i><i></i><i></i><i></i></div><p id="listenStatus">Hazırlan…</p>`),opts.map((v,i)=>answerButton(String(v),i,'big')).join(''));document.querySelectorAll('#answers button').forEach(b=>b.disabled=true);const lead=p.mode==='all'?600:1500;if(p.mode!=='all'){tone(330,.22,0);tone(p.mode==='high'?780:520,.22,.35);if(p.mode==='mid')tone(780,.22,.7)}later(()=>{$('listenWave')?.classList.add('on');listenStatus('Say…')},lead);seq.forEach((f,i)=>tone(f,Math.min(.14,p.gap/1000*.6),lead/1000+i*p.gap/1000,'triangle',.26));later(()=>{$('listenWave')?.classList.remove('on');listenStatus('Kaç tane?');document.querySelectorAll('#answers button').forEach(b=>b.disabled=false);a.awaiting=true},lead+seq.length*p.gap+250)}

/* ---------- Pencere: ses denemesi · Günlük karışımda sessiz oyunlar ---------- */
const listenOpen=openGame;
openGame=function(id,fromSession=false){listenOpen(id,fromSession);const g=getGame(id);if(!g?.sound)return;const box=$('modalContent'),anchor=box.querySelector('.fullRules')||box.querySelector('.howTo');(anchor||box.querySelector('.actions'))?.insertAdjacentHTML(anchor?'afterend':'beforebegin','<div class="soundCheck"><span>🔊 Bu oyun sesle oynanır. Telefon sessizdeyse ses gelmeyebilir.</span><button class="secondary" onclick="soundTest()">Sesi dene</button></div>')};
const listenDaily=dailyIds;
dailyIds=function(){const n=[...today()].reduce((s,c)=>s+c.charCodeAt(0),0),areas=Object.keys(CATS).filter(k=>k!=='all'&&k!=='listen');return [0,1,2].map(i=>{const pool=GAMES.filter(g=>g.cat===areas[(n+i*2)%areas.length]);return pool[(n*13+i*7)%pool.length].id})};

/* ---------- Kart görselleri ---------- */
const listenArt=art;
art=function(id){if(!LISTEN_IDS.includes(id))return listenArt(id);const bg='#3d2a3c',c='#f0a6c8';let s='';if(id==='tonememory')s=[0,1,2,3,4].map(i=>`<rect x="${70+i*25}" y="${30+(i%2)*14}" width="20" height="${46-(i%2)*14}" rx="5" fill="${i===2?c:'#ffffff26'}"/>`).join('')+'<path d="M196 34v34a7 7 0 1 1-4-6V40l14-4v26a7 7 0 1 1-4-6V42Z" fill="#ffffff55"/>';if(id==='pitch')s=`<path d="M60 80Q90 30 120 80T180 80" stroke="#ffffff55" stroke-width="3" fill="none"/><path d="M60 72Q75 36 90 72T120 72T150 72T180 72T210 72" stroke="${c}" stroke-width="3" fill="none"/><text x="214" y="46" font-size="20" fill="${c}">↑</text>`;if(id==='rhythm')s=[60,84,96,132,156,168,204].map((x,i)=>`<rect x="${x}" y="${[40,48,48,40,48,48,40][i]}" width="8" height="${[40,32,32,40,32,32,40][i]}" rx="3" fill="${[0,3,6].includes(i)?c:'#ffffff44'}"/>`).join('');if(id==='beepcount')s=[0,1,2,3,4,5,6].map(i=>`<circle cx="${66+i*22}" cy="${[70,46,70,46,70,46,70][i]}" r="7" fill="${[1,3,5].includes(i)?c:'#ffffff33'}"/>`).join('')+'<text x="222" y="66" font-size="20" font-weight="700" fill="#fff">3</text>';return `<svg viewBox="0 0 260 120" aria-hidden="true"><rect width="260" height="120" fill="${bg}"/><circle cx="240" cy="-15" r="80" fill="#ffffff10"/>${s}<path d="M0 115H260" stroke="#ffffff13" stroke-width="10"/></svg>`};

if(typeof active==='undefined'||!active)render();
