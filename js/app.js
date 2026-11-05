/* ══════════════════════════════════════════════
   INDEXES
   ══════════════════════════════════════════════ */
const DATA = window.SECTIONS || [];
const LEVELS = window.LEVELS || [{id:'A1',name:'A1',blurb:''},{id:'A2',name:'A2',blurb:''},{id:'B1',name:'B1',blurb:''},{id:'B2',name:'B2',blurb:''}];
DATA.forEach(sec=>{ if(!sec.level && !(sec.levels&&sec.levels.length)) sec.level='A1'; });
function secLevels(sec){ return sec.levels&&sec.levels.length?sec.levels:[sec.level||'A1']; }
function sectionsFor(level){
  const rank=s=>/^(ae-|alterego)/.test(s.id)?0:/^(ca-|cahier)/.test(s.id)?1:/^(gr-|grammaire)/.test(s.id)?2:/^(vp-|vocab-prog)/.test(s.id)?3:4;
  return DATA.filter(s=>secLevels(s).includes(level)).sort((a,b)=>rank(a)-rank(b));
}
function lessonInLevel(les, sec, level){
  if(les.level) return les.level===level;
  if(les.levels&&les.levels.length) return les.levels.includes(level);
  return secLevels(sec)[0]===level;
}
function levelLessons(level){
  const out=[];
  sectionsFor(level).forEach(sec=>{
    if(sec.placeholder) return;
    sec.lessons.forEach(les=>{ if(lessonInLevel(les, sec, level)) out.push(les); });
  });
  return out;
}
function levelProgress(level){
  const lessons=levelLessons(level);
  const doneN=lessons.filter(l=>done.has(l.id)).length;
  const pct=lessons.length?Math.round(doneN/lessons.length*100):0;
  return {doneN, total:lessons.length, pct, waiting:!lessons.length};
}
function pathBundle(){
  const p=window.STUDY_PATH;
  if(Array.isArray(p)) return {A1:p,A2:[],B1:[],B2:[]};
  return p||{A1:[],A2:[],B1:[],B2:[]};
}
function pathFor(level){ return pathBundle()[level]||[]; }
function allSteps(){ return LEVELS.flatMap(lv=>pathFor(lv.id)); }
function currentLevel(){
  const h=location.hash.replace('#','');
  if(h.startsWith('lv/')) return h.slice(3);
  const m=h.match(/^path\/(A1|A2|B1|B2)$/);
  if(m) return m[1];
  try{ const saved=localStorage.getItem('carnet-level'); if(saved) return saved; }catch(e){}
  return 'A1';
}
const LESSONS=[], FLAT=[];
DATA.forEach(sec=>{
  sec.count=0;
  sec.lessons.forEach(les=>{
    les.section=sec;
    les.count=les.groups.reduce((a,g)=>a+(g.items?g.items.length:0)+(g.pages?g.pages.length:0)+(g.tracks?g.tracks.length:0)+(g.quiz?g.quiz.length:0),0)+(les.verbs?les.verbs.length:0);
    sec.count+=les.count;
    LESSONS.push(les);
    les.groups.forEach(g=>{
      (g.items||[]).forEach(it=>{
        FLAT.push({it,les,group:g.name,key:it[0]+'|'+(it[2]||'')});
      });
      (g.quiz||[]).forEach(q=>{
        const fr=q.a||'';
        if(!fr) return;
        FLAT.push({it:[fr,q.hint||'',q.q||''],les,group:g.name,key:fr+'|'+(q.q||'')});
      });
    });
    (les.verbs||[]).forEach(v=>{
      FLAT.push({it:[v.inf,'',v.en||''],les,group:'Infinitif',key:v.inf+'|'+(v.en||'')});
    });
  });
});
const lessonById=id=>LESSONS.find(l=>l.id===id);
const TOTAL=FLAT.length;

/* ══════════════════════════════════════════════
   FAVOURITES
   ══════════════════════════════════════════════ */
let done=new Set();
try{const d=localStorage.getItem('carnet-done'); if(d) done=new Set(JSON.parse(d));}catch(e){}
function saveDone(){try{localStorage.setItem('carnet-done',JSON.stringify([...done]));}catch(e){}}

let favs=new Set();
try{ const raw=localStorage.getItem('carnet-favs'); if(raw) favs=new Set(JSON.parse(raw)); }catch(e){}
function saveFavs(){ try{ localStorage.setItem('carnet-favs',JSON.stringify([...favs])); }catch(e){} }
function toggleFav(key){
  favs.has(key)?favs.delete(key):favs.add(key);
  saveFavs(); updateFavCount();
}
function updateFavCount(){
  const el=document.getElementById('favct');
  el.textContent=favs.size?favs.size:'';
}
updateFavCount();

/* ══════════════════════════════════════════════
   SPEECH
   ══════════════════════════════════════════════ */
let voice=null, rate=0.8, speakingEl=null, queue=null, queueBtn=null, voiceListBuilt=false;
function voiceKey(v){ return v.voiceURI||(v.name+'|'+v.lang); }
function pickVoice(){
  if(!('speechSynthesis' in window)) return;
  const vs=speechSynthesis.getVoices(); if(!vs.length) return;
  const sel=document.getElementById('voicepick'), dot=document.getElementById('voicedot');
  const frVoices=vs.filter(v=>/^fr/i.test(v.lang));
  const otherVoices=vs.filter(v=>!/^fr/i.test(v.lang));
  let saved=null;
  try{ saved=localStorage.getItem('carnet-voice'); }catch(e){}

  // Only rebuild the option list when the underlying voice set actually changes —
  // rebuilding on every 'voiceschanged' fire would reset an in-progress user pick.
  const sig=vs.length+'|'+vs.map(voiceKey).join(',');
  if(sel.dataset.sig!==sig){
    sel.dataset.sig=sig;
    sel.innerHTML='';
    const addGroup=(label,list)=>{
      if(!list.length) return;
      const og=document.createElement('optgroup'); og.label=label;
      list.forEach(v=>{
        const o=document.createElement('option');
        o.value=voiceKey(v);
        o.textContent=v.name.replace(/\s*\(.*\)/,'')+' — '+v.lang;
        og.appendChild(o);
      });
      sel.appendChild(og);
    };
    addGroup(frVoices.length?'Français':'Français (none installed)',frVoices);
    addGroup('Autres langues',otherVoices);
    voiceListBuilt=frVoices.length>0;

    // choose: saved pick if still present, else best French voice, else first voice
    let pick=null;
    if(saved) pick=vs.find(v=>voiceKey(v)===saved)||null;
    if(!pick) pick=frVoices.find(v=>/^fr[-_]FR/i.test(v.lang))||frVoices[0]||vs[0]||null;
    voice=pick;
    if(voice) sel.value=voiceKey(voice);
  }

  if(voice && /^fr/i.test(voice.lang)) dot.classList.remove('bad');
  else dot.classList.add('bad');
  document.getElementById('voicewrap').title=voice
    ? 'Narrator voice: '+voice.name+' ('+voice.lang+')'
    : 'No voices installed';
}
if('speechSynthesis' in window){
  speechSynthesis.addEventListener('voiceschanged',pickVoice);
  pickVoice(); setTimeout(pickVoice,700);
}
document.getElementById('voicepick').addEventListener('change',e=>{
  const vs=speechSynthesis.getVoices();
  const chosen=vs.find(v=>voiceKey(v)===e.target.value);
  if(!chosen) return;
  voice=chosen;
  document.getElementById('voicedot').classList.toggle('bad',!/^fr/i.test(voice.lang));
  document.getElementById('voicewrap').title='Narrator voice: '+voice.name+' ('+voice.lang+')';
  try{ localStorage.setItem('carnet-voice',voiceKey(voice)); }catch(err){}
  // give an immediate sample so the change is obvious
  speak('Bonjour ! Voici ma voix.',null);
});
document.getElementById('speed').addEventListener('change',e=>{rate=parseFloat(e.target.value)});

function stopSpeech(){
  if('speechSynthesis' in window) speechSynthesis.cancel();
  queue=null;
  if(queueBtn){queueBtn.classList.remove('on');queueBtn.querySelector('.t').textContent='Play all';queueBtn=null;}
  document.querySelectorAll('.item.speaking').forEach(e=>e.classList.remove('speaking'));
  speakingEl=null;
}
function speak(text,el,onend){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  document.querySelectorAll('.item.speaking').forEach(e=>e.classList.remove('speaking'));
  const clean=text.replace(/\s*[—–]\s*/g,', ').replace(/\s*→\s*/g,', ');
  const u=new SpeechSynthesisUtterance(clean);
  u.lang='fr-FR'; if(voice) u.voice=voice; u.rate=rate;
  if(el){el.classList.add('speaking'); speakingEl=el;}
  u.onend=()=>{ if(el) el.classList.remove('speaking'); if(onend) onend(); };
  u.onerror=()=>{ if(el) el.classList.remove('speaking'); };
  speechSynthesis.speak(u);
}
function playGroup(btn,items,tiles){
  if(queueBtn===btn){stopSpeech();return;}
  stopSpeech();
  queueBtn=btn; btn.classList.add('on'); btn.querySelector('.t').textContent='Stop';
  queue=0;
  (function step(){
    if(queue===null||queue>=items.length){stopSpeech();return;}
    const i=queue, el=tiles[i];
    el.scrollIntoView({block:'nearest',behavior:'smooth'});
    speak(items[i][0],el,()=>{ if(queue!==null){queue=i+1;step();} });
  })();
}


/* ══════════════════════════════════════════════
   MEDIA PATHS — works whether files sit in
   pages/ + audio/ folders or flat beside index.html
   ══════════════════════════════════════════════ */
let FLATMEDIA=false;
const pageName=p=>(typeof p==='string'?p:'p'+String(p).padStart(3,'0'))+'.jpg';
const trackName=n=>'piste_'+String(n).padStart(3,'0')+'.mp3';
const pageSrc =p=>(FLATMEDIA?'':'pages/')+pageName(p);
const trackSrc=n=>(FLATMEDIA?'':'audio/')+trackName(n);
/* per-element rescue: if the folder path 404s, retry flat */
function rescueImg(img,p){
  img.addEventListener('error',function h(){
    img.removeEventListener('error',h);
    if(img.getAttribute('src').indexOf('pages/')===0){FLATMEDIA=true;img.src=pageName(p);}
    else img.dispatchEvent(new Event('failed'));
  });
}
function rescueAudio(au,n){
  au.addEventListener('error',function h(){
    au.removeEventListener('error',h);
    if(au.getAttribute('src').indexOf('audio/')===0){FLATMEDIA=true;au.src=trackName(n);}
  });
}

/* ══════════════════════════════════════════════
   RENDER HELPERS
   ══════════════════════════════════════════════ */
const main=document.getElementById('main');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function hl(t,q){
  if(!q) return esc(t);
  const i=t.toLowerCase().indexOf(q.toLowerCase());
  if(i<0) return esc(t);
  return esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length));
}
const STAR='<svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 1.8l1.85 3.95 4.15.55-3.05 2.9.78 4.2L8 11.4 4.27 13.4l.78-4.2L2 6.3l4.15-.55z" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>';
const STAR_O='<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.8l1.85 3.95 4.15.55-3.05 2.9.78 4.2L8 11.4 4.27 13.4l.78-4.2L2 6.3l4.15-.55z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';

function makeItem(it,q){
  const [fr,ph,en]=it, key=fr+'|'+(en||'');
  const b=document.createElement('button');
  b.className='item'; b.type='button'; b.setAttribute('aria-label',fr);
  b.innerHTML=(en?'<span class="en">'+hl(en,q)+'</span>':'')+
    '<span class="fr">'+hl(fr,q)+'</span>'+
    '<span class="ph">'+esc(ph)+'</span>';
  const fav=document.createElement('span');
  fav.className='fav'+(favs.has(key)?' on':'');
  fav.setAttribute('role','button'); fav.tabIndex=0;
  fav.setAttribute('aria-label','Save this word');
  fav.innerHTML=favs.has(key)?STAR:STAR_O;
  const flip=e=>{
    e.stopPropagation(); e.preventDefault();
    toggleFav(key);
    const on=favs.has(key);
    fav.classList.toggle('on',on);
    fav.innerHTML=on?STAR:STAR_O;
  };
  fav.addEventListener('click',flip);
  fav.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')flip(e)});
  b.appendChild(fav);
  b.addEventListener('click',()=>{
    if(speakingEl===b && speechSynthesis.speaking){stopSpeech();return;}
    stopSpeech(); speak(fr,b);
  });
  return b;
}

let quizLog={};
try{quizLog=JSON.parse(localStorage.getItem('carnet-quiz')||'{}')||{};}catch(e){quizLog={};}
function saveQuiz(){try{localStorage.setItem('carnet-quiz',JSON.stringify(quizLog));}catch(e){}}
function fold(s){
  return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’ʼ]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
}
function strict(s){
  return String(s||'').toLowerCase().replace(/['’ʼ]/g,"'").replace(/[.?!,;:«»"()]/g,'').replace(/\s+/g,' ').trim();
}
function grade(input,a,alt){
  const answers=[a].concat(alt||[]).filter(Boolean);
  const s=strict(input);
  if(!s) return 'empty';
  if(answers.some(x=>strict(x)===s)) return 'ok';
  if(answers.some(x=>fold(x)===fold(input))) return 'close';
  return 'no';
}
function speakable(s){return String(s||'').replace(/\([^)]*\)/g,'').split(/\s+\/\s+/)[0];}

function renderQuiz(wrap,g,les,gi){
  const box=document.createElement('div');
  box.className='quiz';
  g.quiz.forEach((q,qi)=>{
    const key=(les?les.id:'x')+'/'+gi+'/'+qi;
    const card=document.createElement('div');
    card.className='qcard';
    const saved=quizLog[key];
    if(saved==='ok'||saved==='close') card.classList.add('solved');
    const prompt=document.createElement('div');
    prompt.className='qprompt';
    prompt.textContent=(qi+1)+'. '+q.q;
    card.appendChild(prompt);
    if(q.hint){
      const hint=document.createElement('div');
      hint.className='qhint';
      hint.textContent=q.hint;
      card.appendChild(hint);
    }
    const fb=document.createElement('div');
    fb.className='qfb';
    function mark(result, shown){
      if(result==='ok'||result==='close'||result==='no'){quizLog[key]=result; saveQuiz();}
      card.classList.toggle('solved', result==='ok'||result==='close');
      card.classList.toggle('missed', result==='no');
      fb.className='qfb '+result;
      fb.textContent=result==='ok'?'Correct.':result==='close'?'Close. Spelling: '+shown:result==='no'?'Not quite. Answer: '+shown:'';
    }
    if(q.t==='choice'){
      const opts=document.createElement('div');
      opts.className='qopts';
      (q.opts||[]).forEach(opt=>{
        const b=document.createElement('button');
        b.type='button'; b.className='qopt'; b.textContent=opt;
        b.addEventListener('click',()=>{
          const result=strict(opt)===strict(q.a)?'ok':'no';
          opts.querySelectorAll('button').forEach(x=>{x.disabled=true;});
          b.classList.add(result==='ok'?'ok':'bad');
          if(result==='no'){
            opts.querySelectorAll('button').forEach(x=>{if(strict(x.textContent)===strict(q.a)) x.classList.add('ok');});
          }
          mark(result, q.a);
          if(result==='ok') speak(speakable(q.a), null);
        });
        opts.appendChild(b);
      });
      card.appendChild(opts);
    } else {
      const row=document.createElement('form');
      row.className='qrow';
      const input=document.createElement('input');
      input.type='text'; input.className='qinput'; input.autocomplete='off'; input.spellcheck=false;
      input.placeholder=q.t==='translate'?'Type the French…':'Fill the blank…';
      input.setAttribute('aria-label', q.q);
      const btn=document.createElement('button');
      btn.type='submit'; btn.className='qcheck'; btn.textContent='Check';
      const reveal=document.createElement('button');
      reveal.type='button'; reveal.className='qreveal'; reveal.textContent='Answer';
      row.addEventListener('submit',e=>{
        e.preventDefault();
        const result=grade(input.value, q.a, q.alt);
        if(result==='empty'){fb.className='qfb'; fb.textContent='Type an answer first.'; return;}
        mark(result, q.a);
        if(result==='ok'||result==='close') speak(speakable(q.a), null);
      });
      reveal.addEventListener('click',()=>{
        fb.className='qfb show';
        fb.textContent=q.a+(q.alt&&q.alt.length?'  ·  also '+q.alt.join(' / '):'');
        speak(speakable(q.a), null);
      });
      row.append(input, btn, reveal);
      card.appendChild(row);
    }
    card.appendChild(fb);
    if(saved==='ok'||saved==='close'){
      fb.className='qfb '+(saved==='close'?'close':'ok');
      fb.textContent=saved==='close'?'Saved as close. Answer: '+q.a:'Saved as correct.';
    }
    box.appendChild(card);
  });
  wrap.appendChild(box);
}

function renderDrill(wrap, items, gi){
  const drills=items.map((it,i)=>({fr:it[0],en:it[2]||''})).filter(d=>d.en && d.fr && d.fr.length<180);
  if(drills.length<2) return;
  const box=document.createElement('div');
  box.className='drill';
  const head=document.createElement('div');
  head.className='drillhead';
  head.innerHTML='<b>Type the French</b>';
  const toggle=document.createElement('button');
  toggle.type='button'; toggle.className='qreveal';
  const body=document.createElement('div');
  const slice=drills.slice(0,24);
  let built=false;
  function build(){
    if(built) return;
    built=true;
    slice.forEach(d=>{
      const card=document.createElement('form');
      card.className='qcard';
      const prompt=document.createElement('div');
      prompt.className='qprompt';
      prompt.textContent=d.en;
      const row=document.createElement('div');
      row.className='qrow';
      const input=document.createElement('input');
      input.type='text'; input.className='qinput'; input.autocomplete='off'; input.spellcheck=false;
      input.placeholder='French…'; input.setAttribute('aria-label', d.en);
      const btn=document.createElement('button');
      btn.type='submit'; btn.className='qcheck'; btn.textContent='Check';
      const fb=document.createElement('div'); fb.className='qfb';
      card.addEventListener('submit',e=>{
        e.preventDefault();
        const result=grade(input.value, d.fr);
        fb.className='qfb '+result;
        fb.textContent=result==='empty'?'Type an answer first.':result==='ok'?'Correct.':result==='close'?'Close. Spelling: '+d.fr:'Not quite. '+d.fr;
        if(result==='ok'||result==='close') speak(speakable(d.fr), null);
        const key='drill/'+d.fr+'|'+d.en;
        if(result==='ok'||result==='close'||result==='no'){quizLog[key]=result; saveQuiz();}
      });
      row.append(input, btn);
      card.append(prompt, row, fb);
      body.appendChild(card);
    });
    if(drills.length>24){
      const more=document.createElement('div');
      more.className='qhint';
      more.textContent='Showing 24 of '+drills.length+'. Star the ones you want and review them from Saved words.';
      body.appendChild(more);
    }
  }
  body.hidden=true;
  toggle.textContent='Practise these';
  toggle.addEventListener('click',()=>{
    body.hidden=!body.hidden;
    if(!body.hidden) build();
    toggle.textContent=body.hidden?'Practise these':'Hide practice';
  });
  head.appendChild(toggle);
  box.append(head, body);
  wrap.appendChild(box);
}

function renderGroups(host,groups,q,les){
  groups.forEach((g,gi)=>{
    const wrap=document.createElement('section');
    wrap.className='group'; wrap.id='g'+gi;
    wrap.dataset.gname=g.name||'';
    const isPages = !!(g.pages && g.pages.length);
    const isTracks = !!(g.tracks && g.tracks.length);
    const hasQuiz = !!(g.quiz && g.quiz.length);
    const hasItems = !!(g.items && g.items.length);
    const isEmpty = !isPages && !isTracks && !hasItems && !hasQuiz;

    const h=document.createElement('div');
    h.className='ghead';
    h.innerHTML='<h3>'+esc(g.name)+'</h3>';
    const right=document.createElement('div'); right.className='right';
    const countLabel=isPages?g.pages.length+' p.':isTracks?g.tracks.length+' pistes':hasItems&&hasQuiz?g.items.length+' · '+g.quiz.length+' q':hasQuiz?g.quiz.length+' questions':(g.items?g.items.length:0);
    right.innerHTML='<span class="gct">'+countLabel+'</span>';
    let pb=null;
    if(hasItems && !isPages && !isTracks){
      pb=document.createElement('button');
      pb.className='playall';
      pb.innerHTML='<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg><span class="t">Play all</span>';
      right.appendChild(pb);
    }
    h.appendChild(right); wrap.appendChild(h);
    if(g.note){const n=document.createElement('div');n.className='note';n.innerHTML=g.note;wrap.appendChild(n);}

    if(g.dict){
      const box=document.createElement('div');
      box.className='dico';
      box.innerHTML=
        '<div class="dsearch"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="5"/><path d="M11 11l4 4" stroke-linecap="round"/></svg>'+
        '<input id="dq" type="search" placeholder="Type a French or English word…" autocomplete="off" spellcheck="false">'+
        '<button class="dclear" id="dclear" hidden aria-label="Clear">&times;</button></div>'+
        '<div class="dmeta" id="dmeta"></div><div class="dlist" id="dlist"></div>';
      wrap.appendChild(box);
      setTimeout(()=>initDico(),0);
      host.appendChild(wrap);
      return;
    }
    if(isTracks){
      const list=document.createElement('div'); list.className='tracklist';
      g.tracks.forEach(t=>{
        const row=document.createElement('div'); row.className='track';

        row.innerHTML='<span class="tn">'+String(t.n).padStart(3,'0')+'</span>'+
          '<span class="tmeta">'+(t.label?esc(t.label):'<em>not yet matched</em>')+'</span>';
        const au=document.createElement('audio');
        au.controls=true; au.preload='none'; au.src=trackSrc(t.n); rescueAudio(au,t.n);
        au.addEventListener('play',()=>{
          stopSpeech();
          document.querySelectorAll('audio').forEach(a=>{if(a!==au)a.pause();});
        });
        au.addEventListener('error',()=>{row.classList.add('broken');});
        row.appendChild(au);
        list.appendChild(row);
      });
      wrap.appendChild(list);
    } else if(isPages){
      const grid=document.createElement('div'); grid.className='pagegrid';
      g.pages.forEach(p=>{
        const b=document.createElement('button');
        b.className='pagecard'; b.type='button';
        b.setAttribute('aria-label','Page '+p);
        b.innerHTML='<span class="ph-wrap"><img loading="lazy" src="'+pageSrc(p)+'" alt="Page '+p+'"></span><span class="pn">'+p+'</span>';
        const img=b.querySelector('img');
        rescueImg(img,p);
        img.addEventListener('failed',()=>{
          b.classList.add('broken');
          b.querySelector('.ph-wrap').innerHTML='<span class="brokenmsg">image<br>not loaded</span>';
        });
        b.addEventListener('click',()=>openLightbox(g.pages,g.pages.indexOf(p)));
        grid.appendChild(b);
      });
      wrap.appendChild(grid);
    } else if(hasItems) {
      const box=document.createElement('div'); box.className='items '+(g.cols||'');
      const tiles=g.items.map(it=>{const t=makeItem(it,q);box.appendChild(t);return t;});
      wrap.appendChild(box);
      if(pb) pb.addEventListener('click',()=>playGroup(pb,g.items,tiles));
      renderDrill(wrap, g.items, gi);
    } else if(isEmpty){
      const e=document.createElement('div');
      e.className='note'; e.style.opacity='.8';
      e.textContent='Nothing here yet.';
      wrap.appendChild(e);
    }
    if(hasQuiz) renderQuiz(wrap, g, les, gi);
    host.appendChild(wrap);
  });
}

/* ── lightbox for book pages ── */
let lbPages=[], lbIdx=0;
function openLightbox(pages,i){
  lbPages=pages; lbIdx=i;
  const lb=document.getElementById('lightbox');
  lb.hidden=false; document.body.style.overflow='hidden';
  paintLightbox();
}
function paintLightbox(){
  const p=lbPages[lbIdx];
  const li=document.getElementById('lbimg');
  li.src=pageSrc(p);
  li.onerror=()=>{ if(li.getAttribute('src').indexOf('pages/')===0){FLATMEDIA=true;li.src=pageName(p);} };
  document.getElementById('lbnum').textContent='Page '+p+'  ·  '+(lbIdx+1)+' / '+lbPages.length;
}
function closeLightbox(){
  document.getElementById('lightbox').hidden=true;
  document.body.style.overflow='';
}
function lbMove(d){
  lbIdx=(lbIdx+d+lbPages.length)%lbPages.length;
  paintLightbox();
}

/* ══════════════════════════════════════════════
   VIEWS
   ══════════════════════════════════════════════ */
function viewHome(levelArg){
  stopSpeech();
  main.style.setProperty('--sc','#16233A');
  main.innerHTML='';

  const level=LEVELS.some(l=>l.id===levelArg)?levelArg:currentLevel();
  try{localStorage.setItem('carnet-level', level);}catch(e){}
  const prog=levelProgress(level);
  const meta=LEVELS.find(l=>l.id===level)||LEVELS[0];
  const hero=document.createElement('section');
  hero.className='hero2';
  const pctDone=prog.pct;
  hero.innerHTML=
    '<div class="hero2-l">'+
      '<span class="eyebrow">Carnet d\'étude · A1 → B2</span>'+
      '<h1>Learn French from the books you are actually using.</h1>'+
      '<p>From A1 to B2, each level follows the books you study: Alter Ego, the cahier, Grammaire progressive and Vocabulaire progressif. Every line here is original French, with an English translation and a phonetic hint — tap it to hear it. Exercises check themselves.</p>'+
      '<div class="hero2-cta">'+
        '<button class="btn-solid" id="goPath">Study path</button>'+
        '<button class="btn-ghost" id="goPractice">Practise now</button>'+
        '<button class="btn-ghost" id="goDico">Look up a word</button>'+
      '</div>'+
    '</div>'+
    '<div class="hero2-r">'+
      '<div class="ring" style="--pct:'+pctDone+'">'+
        '<svg viewBox="0 0 120 120"><circle class="rbg" cx="60" cy="60" r="52"/>'+
        '<circle class="rfg" cx="60" cy="60" r="52" stroke-dasharray="'+(pctDone*3.267)+' 999"/></svg>'+
        '<div class="rmid"><b>'+pctDone+'<i>%</i></b><span>'+esc(level)+(prog.waiting?' waiting':' done')+'</span></div>'+
      '</div>'+
      '<div class="minis">'+
        '<div class="mini"><b>'+TOTAL.toLocaleString()+'</b><span>phrases</span></div>'+
        '<div class="mini"><b>'+prog.total+'</b><span>'+esc(level)+' lessons</span></div>'+
        '<div class="mini"><b>'+favs.size+'</b><span>saved</span></div>'+
      '</div>'+
    '</div>';
  main.appendChild(hero);
  hero.querySelector('#goPractice').addEventListener('click',()=>document.getElementById('practicebtn').click());
  hero.querySelector('#goDico').addEventListener('click',()=>{location.hash='l/dico';});
  hero.querySelector('#goPath').addEventListener('click',()=>{location.hash='path/'+level;});

  const levelsEl=document.createElement('div');
  levelsEl.className='levelgrid';
  LEVELS.forEach(lv=>{
    const p=levelProgress(lv.id);
    const b=document.createElement('button');
    b.className='levelcard'+(lv.id===level?' on':'');
    b.innerHTML='<b>'+lv.id+'</b><span>'+(p.waiting?'Books not loaded yet':p.doneN+' / '+p.total+' lessons')+'</span><i style="width:'+p.pct+'%"></i>';
    b.addEventListener('click',()=>{location.hash='lv/'+lv.id;});
    levelsEl.appendChild(b);
  });
  main.appendChild(levelsEl);

  const last=lastOpened();
  if(last){
    const r=document.createElement('button');
    r.className='resume'; r.style.setProperty('--sc',last.section.color);
    r.innerHTML='<span class="rl">Continue where you left off</span>'+
      '<span class="rn">'+esc(last.name)+'</span>'+
      '<span class="rs">'+esc(last.label)+' · '+esc(last.section.name)+'</span>'+
      '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>';
    r.addEventListener('click',()=>location.hash='l/'+last.id);
    main.appendChild(r);
  }

  const pathLab=document.createElement('div');
  pathLab.className='seclabel'; pathLab.textContent=level+' · suggested order';
  main.appendChild(pathLab);
  const pathRow=document.createElement('div');
  pathRow.className='pathrow';
  const steps=pathFor(level);
  if(!steps.length){
    const note=document.createElement('p');
    note.className='waitnote';
    note.textContent='The '+level+' path will follow each dossier once that level’s books are transcribed. The shelves below are the slots it will use.';
    pathRow.appendChild(note);
  }
  steps.forEach(step=>{
    const ids=stepIds(step);
    const doneN=ids.filter(id=>done.has(id)).length;
    const b=document.createElement('button');
    b.className='pathchip';
    b.innerHTML='<span class="pn">'+step.n+'</span><span class="pt">'+esc(step.title)+'</span><span class="pc">'+doneN+'/'+ids.length+'</span>';
    b.addEventListener('click',()=>{location.hash='path/'+level;});
    pathRow.appendChild(b);
  });
  main.appendChild(pathRow);

  const lab=document.createElement('div');
  lab.className='seclabel'; lab.textContent=level+' · '+meta.blurb;
  main.appendChild(lab);

  const grid=document.createElement('div'); grid.className='shelf';
  sectionsFor(level).forEach(sec=>{
    const mine=sec.lessons.filter(l=>lessonInLevel(l, sec, level));
    const doneN=mine.filter(l=>done.has(l.id)).length;
    const pct=mine.length?Math.round(doneN/mine.length*100):0;
    const phrases=mine.reduce((a,l)=>a+(l.count||0),0);
    const c=document.createElement('button');
    c.className='book'+(sec.placeholder?' wait':''); c.style.setProperty('--sc',sec.color);
    c.innerHTML=
      '<span class="spine"></span>'+
      '<span class="bmain">'+
        '<span class="btitle">'+esc(sec.name)+'</span>'+
        '<span class="bblurb">'+esc(sec.blurb)+'</span>'+
        '<span class="bmeta">'+(sec.placeholder?'Waiting for the text':mine.length+' lessons · '+phrases.toLocaleString()+' phrases')+'</span>'+
        '<span class="bbar"><i style="width:'+pct+'%"></i></span>'+
      '</span>'+
      '<span class="bgo"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg></span>';
    c.addEventListener('click',()=>location.hash='s/'+sec.id);
    grid.appendChild(c);
  });
  main.appendChild(grid);
  setActive(null);
  window.scrollTo(0,0);
}

function lastOpened(){
  try{
    const id=localStorage.getItem('carnet-last');
    if(id){const l=lessonById(id); if(l) return l;}
  }catch(e){}
  return null;
}

function viewSection(id){
  stopSpeech();
  const sec=DATA.find(s=>s.id===id); if(!sec){viewHome();return;}
  main.style.setProperty('--sc',sec.color);
  main.innerHTML='';

  const crumb=document.createElement('div');
  crumb.className='crumb';
  crumb.innerHTML='<button data-home>Overview</button><span>/</span><span class="cur">'+esc(sec.name)+'</span>';
  crumb.querySelector('[data-home]').addEventListener('click',()=>location.hash='home');
  main.appendChild(crumb);

  const head=document.createElement('div');
  head.className='shead';
  const doneN=sec.lessons.filter(l=>done.has(l.id)).length;
  head.innerHTML='<h2>'+esc(sec.name)+'</h2><p>'+esc(sec.blurb)+'</p>'+
    '<div class="sstats"><span>'+secLevels(sec).join(' · ')+'</span><span>'+sec.lessons.length+' lessons</span><span>'+sec.count.toLocaleString()+' phrases</span>'+
    '<span>'+doneN+' done</span></div>';
  main.appendChild(head);
  if(sec.placeholder){
    const empty=document.createElement('div');
    empty.className='empty';
    empty.innerHTML='<b>This book is not on the site yet.</b> The slot is here so '+esc(secLevels(sec).join(' and '))+' stays organised. When the text arrives it will fill this same section, and your progress for the level will start counting these lessons.';
    main.appendChild(empty);
    setActive(null);
    window.scrollTo(0,0);
    return;
  }

  const list=document.createElement('div'); list.className='lgrid';
  sec.lessons.forEach((les,i)=>{
    const pages=les.groups.reduce((a,g)=>a+(g.pages||[]).length,0)+(les.bookpages||[]).length;
    const tracks=les.groups.reduce((a,g)=>a+(g.tracks||[]).length,0);
    const words=les.groups.reduce((a,g)=>a+(g.items||[]).length,0);
    const b=document.createElement('button');
    b.className='lcard'+(done.has(les.id)?' done':'');
    b.innerHTML=
      '<span class="lnum">'+String(i+1).padStart(2,'0')+'</span>'+
      '<span class="lmain">'+
        '<span class="llab">'+esc(les.label)+'</span>'+
        '<span class="lname">'+esc(les.name)+'</span>'+
        '<span class="lsum">'+esc(les.summary||'')+'</span>'+
        '<span class="lchips">'+
          (words?'<i>'+words+' phrases</i>':'')+
          (les.groups.reduce((a,g)=>a+(g.quiz||[]).length,0)?'<i class="qz">'+les.groups.reduce((a,g)=>a+(g.quiz||[]).length,0)+' drills</i>':'')+
          (tracks?'<i class="au">'+tracks+' audio</i>':'')+
          (pages?'<i class="pg">'+pages+' pages</i>':'')+
        '</span>'+
      '</span>'+
      (done.has(les.id)?'<span class="ldone">✓</span>':'');
    b.addEventListener('click',()=>location.hash='l/'+les.id);
    list.appendChild(b);
  });
  main.appendChild(list);
  setActive(null);
  openSection(sec.id);
  window.scrollTo(0,0);
}

function viewLesson(id){
  stopSpeech();
  const les=lessonById(id); if(!les){viewHome();return;}
  try{localStorage.setItem('carnet-last',id);}catch(e){}
  const sec=les.section;
  main.style.setProperty('--sc',sec.color);
  main.innerHTML='';

  const crumb=document.createElement('div');
  crumb.className='crumb';
  crumb.innerHTML='<button data-home>Overview</button><span>/</span>'+
    '<button data-sec>'+esc(sec.name)+'</button><span>/</span><span class="cur">'+esc(les.label)+'</span>';
  crumb.querySelector('[data-home]').addEventListener('click',()=>location.hash='home');
  crumb.querySelector('[data-sec]').addEventListener('click',()=>{location.hash='s/'+sec.id;});
  main.appendChild(crumb);

  const head=document.createElement('div');
  head.className='lhead';
  head.innerHTML='<span class="ltag">'+esc(les.label)+'</span>'+(les.original?'<span class="pill">Original practice</span>':'')+'<h2>'+esc(les.name)+'</h2>'+
    '<p>'+esc(les.summary)+'</p>';
  main.appendChild(head);
  const step=stepFor(les.id);
  if(step){
    const rel=document.createElement('div');
    rel.className='related';
    rel.innerHTML='<span class="striplab">Same step · '+esc(step.title)+'</span>';
    stepIds(step).filter(id=>id!==les.id).slice(0,8).forEach(id=>{
      const other=lessonById(id); if(!other) return;
      const b=document.createElement('button');
      b.type='button'; b.className='rel';
      b.textContent=other.section.short+' · '+other.name;
      b.addEventListener('click',()=>{location.hash='l/'+id;});
      rel.appendChild(b);
    });
    const more=document.createElement('button');
    more.type='button'; more.className='rel more';
    more.textContent='Full path';
    more.addEventListener('click',()=>{location.hash='path';});
    rel.appendChild(more);
    main.appendChild(rel);
  }
  if(les.verbs) renderVerbs(main, les.verbs);

  if(les.bookpages && les.bookpages.length){
    const strip=document.createElement('div'); strip.className='pagestrip';
    const lab=document.createElement('span'); lab.className='striplab';
    lab.textContent='Pages du livre';
    strip.appendChild(lab);
    les.bookpages.forEach(p=>{
      const b=document.createElement('button');
      b.className='thumb'; b.type='button'; b.title='Page '+p;
      b.innerHTML='<img loading="lazy" src="'+pageSrc(p)+'" alt="Page '+p+'"><span>'+p+'</span>';
      const im=b.querySelector('img'); rescueImg(im,p);
      im.addEventListener('failed',()=>b.classList.add('broken'));
      b.addEventListener('click',()=>openLightbox(les.bookpages,les.bookpages.indexOf(p)));
      strip.appendChild(b);
    });
    main.appendChild(strip);
  }

  const nav=document.createElement('div'); nav.className='lnav';
  les.groups.forEach((g,i)=>{
    const chip=document.createElement('button');
    chip.className='gchip'; chip.textContent=g.name; chip.dataset.g=i;
    chip.addEventListener('click',()=>{
      document.getElementById('g'+i).scrollIntoView({behavior:'smooth',block:'start'});
    });
    nav.appendChild(chip);
  });
  if(les.groups.length>1) main.appendChild(nav);

  if(les.art && ART[les.art]){
    const fig=document.createElement('figure');
    fig.className='art';
    fig.innerHTML=ART[les.art].svg+'<figcaption>'+esc(ART[les.art].cap)+'</figcaption>';
    main.appendChild(fig);
  }

  renderGroups(main,les.groups,'',les);

  const doneBar=document.createElement('div');
  doneBar.className='donebar';
  const isDone=done.has(les.id);
  doneBar.innerHTML='<button class="donebtn'+(isDone?' on':'')+'" id="donebtn">'+
    '<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.5 3.5L13 5"/></svg>'+
    '<span>'+(isDone?'Lesson done':'Mark this lesson done')+'</span></button>';
  main.appendChild(doneBar);
  doneBar.querySelector('#donebtn').addEventListener('click',()=>{
    done.has(les.id)?done.delete(les.id):done.add(les.id);
    saveDone(); renderTree(); viewLesson(les.id);
  });

  const idx=LESSONS.indexOf(les);
  const foot=document.createElement('div');
  foot.style.cssText='display:flex;gap:10px;justify-content:space-between;margin-top:34px;padding-top:20px;border-top:1px solid var(--rule)';
  const prev=LESSONS[idx-1], next=LESSONS[idx+1];
  foot.innerHTML=
    (prev?'<button class="tbtn" data-p>← '+esc(prev.label)+'</button>':'<span></span>')+
    (next?'<button class="tbtn" data-n>'+esc(next.label)+' →</button>':'<span></span>');
  if(prev) foot.querySelector('[data-p]').addEventListener('click',()=>location.hash='l/'+prev.id);
  if(next) foot.querySelector('[data-n]').addEventListener('click',()=>location.hash='l/'+next.id);
  main.appendChild(foot);

  setActive(les.id); openSection(sec.id);
  spy(nav);
  window.scrollTo(0,0);
}

function spy(nav){
  const groups=[...main.querySelectorAll('.group')];
  if(!groups.length||!nav.parentNode) return;
  const chips=[...nav.querySelectorAll('.gchip')];
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const i=groups.indexOf(e.target);
        chips.forEach((c,ci)=>c.classList.toggle('on',ci===i));
      }
    });
  },{rootMargin:'-100px 0px -70% 0px'});
  groups.forEach(g=>io.observe(g));
}

function viewFavs(){
  stopSpeech();
  main.style.setProperty('--sc','#D9A400');
  main.innerHTML='';
  const head=document.createElement('div');
  head.className='lhead';
  head.innerHTML='<span class="ltag">Saved</span><h2>Your saved words</h2>'+
    '<p>Tap the star on any card to keep it here. This list lives in your browser, so it survives a refresh on this device.</p>';
  main.appendChild(head);

  const rows=FLAT.filter(r=>favs.has(r.key));
  if(!rows.length){
    main.insertAdjacentHTML('beforeend',
      '<div class="empty"><b>Nothing saved yet.</b>Hover or tap the star in the corner of any card and it will collect here — handy for building a list before a test.</div>');
    setActive('fav'); return;
  }
  const byLes=new Map();
  rows.forEach(r=>{
    const k=r.les.id+'||'+r.group;
    if(!byLes.has(k)) byLes.set(k,{les:r.les,group:r.group,items:[]});
    byLes.get(k).items.push(r.it);
  });
  byLes.forEach(b=>{
    const w=document.createElement('section');
    w.className='rgroup'; w.style.setProperty('--sc',b.les.section.color);
    w.innerHTML='<span class="rpath">'+esc(b.les.label)+' · '+esc(b.group)+'</span>';
    const box=document.createElement('div'); box.className='items two';
    b.items.forEach(it=>box.appendChild(makeItem(it,'')));
    w.appendChild(box); main.appendChild(w);
  });
  setActive('fav');
  window.scrollTo(0,0);
}

function viewSearch(q){
  stopSpeech();
  const term=q.trim().toLowerCase();
  if(!term){route();return;}
  main.style.setProperty('--sc','#16233A');
  main.innerHTML='';
  const hits=FLAT.filter(r=>
    r.it[0].toLowerCase().includes(term)||
    (r.it[2]&&r.it[2].toLowerCase().includes(term))||
    r.it[1].toLowerCase().includes(term)).slice(0,300);

  if(!hits.length){
    main.innerHTML='<div class="empty"><b>Nothing matched “'+esc(q)+'”.</b>Try a shorter word or the English meaning — searching <em>family</em> finds la famille, and <em>87</em> finds quatre-vingt-sept.</div>';
    setActive(null); return;
  }
  main.insertAdjacentHTML('beforeend',
    '<div class="rmeta">'+hits.length+(hits.length===300?'+':'')+' result'+(hits.length===1?'':'s')+' for “'+esc(q)+'”</div>');
  const buckets=new Map();
  hits.forEach(r=>{
    const k=r.les.id+'||'+r.group;
    if(!buckets.has(k)) buckets.set(k,{les:r.les,group:r.group,items:[]});
    buckets.get(k).items.push(r.it);
  });
  buckets.forEach(b=>{
    const w=document.createElement('section');
    w.className='rgroup'; w.style.setProperty('--sc',b.les.section.color);
    w.innerHTML='<button class="rpath" data-go="'+b.les.id+'">'+esc(b.les.section.short)+' · '+esc(b.les.label)+' · '+esc(b.group)+'</button>';
    w.querySelector('[data-go]').addEventListener('click',()=>{
      document.getElementById('q').value=''; location.hash='l/'+b.les.id;
    });
    const box=document.createElement('div'); box.className='items two';
    b.items.forEach(it=>box.appendChild(makeItem(it,term)));
    w.appendChild(box); main.appendChild(w);
  });
  setActive(null);
  window.scrollTo(0,0);
}

/* ══════════════════════════════════════════════
   SIDEBAR
   ══════════════════════════════════════════════ */
const tree=document.getElementById('tree');
function renderTree(){tree.innerHTML='';buildTree();const cur=location.hash.replace('#l/','');setActive(DATA.some(s=>s.lessons.some(l=>l.id===cur))?cur:null);const s=DATA.find(s=>s.lessons.some(l=>l.id===cur));if(s)openSection(s.id);}
function buildTree(){
  const chev='<span class="chev" role="button" tabindex="-1" aria-label="Expand"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  LEVELS.forEach(lv=>{
    const block=document.createElement('div');
    block.className='levelblock';
    block.dataset.level=lv.id;
    const prog=levelProgress(lv.id);
    const lab=document.createElement('button');
    lab.className='levelhead';
    lab.innerHTML='<span>'+lv.id+'</span><span class="ct">'+(prog.waiting?'soon':prog.pct+'%')+'</span>';
    lab.addEventListener('click',()=>{location.hash='lv/'+lv.id; closeDrawer();});
    block.appendChild(lab);
    sectionsFor(lv.id).forEach(sec=>{
      const box=document.createElement('div');
      box.className='sec'+(sec.placeholder?' wait':''); box.dataset.sec=sec.id;
      box.style.setProperty('--sc',sec.color);
      const h=document.createElement('button');
      h.className='sechead';
      const shown=sec.placeholder?[]:sec.lessons.filter(les=>lessonInLevel(les, sec, lv.id));
      h.innerHTML='<span class="dot"></span><span class="nm">'+esc(sec.name)+'</span>'+
        '<span class="ct">'+(sec.placeholder?'—':shown.length)+'</span>'+
        (sec.placeholder?'':chev);
      h.addEventListener('click',e=>{
        if(e.target.closest('.chev')){ box.classList.toggle('open'); return; }
        location.hash='s/'+sec.id; closeDrawer();
      });
      box.appendChild(h);
      if(!sec.placeholder){
        const ul=document.createElement('div'); ul.className='lessons';
        shown.forEach(les=>{
          const b=document.createElement('button');
          b.className='les'; b.dataset.les=les.id;
          b.innerHTML='<span class="lb">'+esc(les.label)+'</span>'+esc(les.name)+(done.has(les.id)?'<span class="tick">✓</span>':'');
          b.addEventListener('click',()=>{location.hash='l/'+les.id; closeDrawer();});
          ul.appendChild(b);
        });
        box.appendChild(ul);
      }
      block.appendChild(box);
    });
    tree.appendChild(block);
  });
}
function openSection(id){
  document.querySelectorAll('.sec').forEach(s=>s.classList.toggle('open',s.dataset.sec===id));
}
function setActive(id){
  document.querySelectorAll('.les').forEach(b=>b.classList.toggle('on',b.dataset.les===id));
  const hash=location.hash.replace('#','');
  document.getElementById('navhome').classList.toggle('on',id===null&&!hash.startsWith('l/')&&!hash.startsWith('path'));
  document.getElementById('navfav').classList.toggle('on',id==='fav');
  const navPath=document.getElementById('navpath');
  if(navPath) navPath.classList.toggle('on',id==='path');
}
document.getElementById('navhome').addEventListener('click',()=>{location.hash='home';closeDrawer();});
document.getElementById('navfav').addEventListener('click',()=>{location.hash='fav';closeDrawer();});
document.getElementById('navpath').addEventListener('click',()=>{location.hash='path';closeDrawer();});

/* drawer */
const side=document.getElementById('side'), scrim=document.getElementById('scrim');
function openDrawer(){side.classList.add('on');scrim.classList.add('on');}
function closeDrawer(){side.classList.remove('on');scrim.classList.remove('on');}
document.getElementById('menubtn').addEventListener('click',openDrawer);
scrim.addEventListener('click',closeDrawer);

/* ══════════════════════════════════════════════
   PRACTICE
   ══════════════════════════════════════════════ */
const overlay=document.getElementById('overlay'), pbody=document.getElementById('pbody');
let pScope='lesson', pDir='fr', pDeck=[], pIdx=0, pRevealed=false, pDone=0;

function openPractice(){
  overlay.hidden=false;
  document.body.style.overflow='hidden';
  renderPracticeSetup();
}
function closePractice(){
  overlay.hidden=true; document.body.style.overflow=''; stopSpeech();
}
document.getElementById('practicebtn').addEventListener('click',openPractice);
document.getElementById('pclose').addEventListener('click',closePractice);
overlay.addEventListener('click',e=>{if(e.target===overlay)closePractice()});

function scopePool(){
  if(pScope==='favs') return FLAT.filter(r=>favs.has(r.key));
  if(pScope==='all') return FLAT;
  const id=location.hash.replace('#l/','');
  const les=lessonById(id);
  return les?FLAT.filter(r=>r.les.id===les.id):FLAT;
}
function renderPracticeSetup(){
  document.getElementById('ptitle').textContent='Practise';
  const les=lessonById(location.hash.replace('#l/',''));
  const lessonLabel=les?les.label+' · '+les.name:'Current lesson';
  pbody.innerHTML=
   '<div class="optrow"><div class="lab">What to drill</div><div class="opts">'+
     '<button class="opt" data-s="lesson"'+(les?'':' disabled')+'>'+esc(lessonLabel)+'</button>'+
     '<button class="opt" data-s="favs"'+(favs.size?'':' disabled')+'>Saved words ('+favs.size+')</button>'+
     '<button class="opt" data-s="all">Everything</button>'+
   '</div></div>'+
   '<div class="optrow"><div class="lab">Which side first</div><div class="opts">'+
     '<button class="opt" data-d="fr">French → English</button>'+
     '<button class="opt" data-d="en">English → French</button>'+
   '</div></div>'+
   '<div class="prow"><button class="go" id="pstart">Start · 20 cards</button></div>';
  if(!les && pScope==='lesson') pScope='all';
  if(pScope==='favs' && !favs.size) pScope='all';
  pbody.querySelectorAll('[data-s]').forEach(b=>{
    b.classList.toggle('on',b.dataset.s===pScope);
    b.addEventListener('click',()=>{pScope=b.dataset.s;renderPracticeSetup();});
  });
  pbody.querySelectorAll('[data-d]').forEach(b=>{
    b.classList.toggle('on',b.dataset.d===pDir);
    b.addEventListener('click',()=>{pDir=b.dataset.d;renderPracticeSetup();});
  });
  document.getElementById('pstart').addEventListener('click',startDeck);
}
function startDeck(){
  let pool=scopePool().filter(r=>r.it[2]);
  if(pDir==='en') pool=pool.filter(r=>r.it[2]);
  if(!pool.length){ pool=scopePool(); }
  pDeck=[...pool].sort(()=>Math.random()-0.5).slice(0,20);
  pIdx=0; pDone=0; pRevealed=false;
  renderCard();
}
function renderCard(){
  if(pIdx>=pDeck.length){ renderDone(); return; }
  const r=pDeck[pIdx], [fr,ph,en]=r.it;
  document.getElementById('ptitle').textContent='Card '+(pIdx+1)+' of '+pDeck.length;
  const pct=Math.round((pIdx/pDeck.length)*100);
  const promptTxt = pDir==='fr' ? fr : (en||fr);
  pbody.innerHTML=
    '<div class="pbar"><i style="width:'+pct+'%"></i></div>'+
    '<div class="pcount"><span>'+esc(r.les.label)+' · '+esc(r.group)+'</span><span>'+pDone+' done</span></div>'+
    '<div class="flash" id="flash">'+
      '<div class="prompt">'+esc(promptTxt)+'</div>'+
      (pRevealed
        ? '<div class="divider"></div>'+
          (pDir==='fr'
            ? '<div class="ansph">'+esc(ph)+'</div><div class="anseng">'+esc(en||'')+'</div>'
            : '<div class="ansfr">'+esc(fr)+'</div><div class="ansph">'+esc(ph)+'</div>')
        : '<div class="sub">'+(pDir==='fr'?'What does it mean?':'How do you say it?')+'</div>')+
    '</div>'+
    (pRevealed
      ? '<div class="prow"><button class="again" id="pagain">Show again later</button><button class="know" id="pknow">Got it</button></div>'
      : '<div class="prow"><button class="tbtn" id="phear" style="flex:none;justify-content:center">Hear it</button><button class="go" id="preveal">Show answer</button></div>');

  if(pRevealed){
    document.getElementById('pagain').addEventListener('click',()=>{
      pDeck.push(pDeck[pIdx]); pIdx++; pRevealed=false; renderCard();
    });
    document.getElementById('pknow').addEventListener('click',()=>{
      pDone++; pIdx++; pRevealed=false; renderCard();
    });
    speak(fr,null);
  } else {
    document.getElementById('preveal').addEventListener('click',()=>{pRevealed=true;renderCard();});
    document.getElementById('phear').addEventListener('click',()=>speak(fr,null));
    if(pDir==='fr') speak(fr,null);
  }
}
function renderDone(){
  document.getElementById('ptitle').textContent='Done';
  pbody.innerHTML='<div class="pdone"><b>'+pDone+' of '+pDeck.length+' first time.</b>'+
    '<p>Cards you asked to see again were shuffled back in, so the count above is the honest one.</p>'+
    '<div class="prow"><button class="tbtn" id="pback" style="justify-content:center">Change settings</button>'+
    '<button class="go" id="pmore">Another 20</button></div></div>';
  document.getElementById('pback').addEventListener('click',renderPracticeSetup);
  document.getElementById('pmore').addEventListener('click',startDeck);
}

/* ══════════════════════════════════════════════
   DICTIONNAIRE
   ══════════════════════════════════════════════ */
let DICO=null;
function buildDico(){
  if(DICO) return DICO;
  const seen=new Map();
  FLAT.forEach(r=>{
    const [fr,ph,en]=r.it;
    const key=fr.toLowerCase()+'|'+(en||'').toLowerCase();
    if(seen.has(key)){ seen.get(key).where.add(r.les.label); return; }
    seen.set(key,{fr,ph,en:en||'',where:new Set([r.les.label]),color:r.les.section.color});
  });
  const strip=s=>s.toLowerCase()
    .replace(/^(le |la |les |l'|un |une |des |je |j'|tu |il |elle |nous |vous |ils )/,'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  DICO=[...seen.values()].sort((a,b)=>strip(a.fr).localeCompare(strip(b.fr),'fr'));
  return DICO;
}
function initDico(){
  const inp=document.getElementById('dq'); if(!inp) return;
  const clr=document.getElementById('dclear');
  const paint=q=>{
    const all=buildDico();
    const t=q.trim().toLowerCase();
    const rows=t? all.filter(d=>d.fr.toLowerCase().includes(t)||d.en.toLowerCase().includes(t)||d.ph.toLowerCase().includes(t)) : all;
    document.getElementById('dmeta').textContent=
      rows.length+' word'+(rows.length===1?'':'s')+(t?' matching “'+q.trim()+'”':' in total');
    const list=document.getElementById('dlist');
    list.innerHTML='';
    rows.slice(0,600).forEach(d=>{
      const b=document.createElement('button');
      b.className='dentry'; b.type='button';
      b.style.setProperty('--dc',d.color);
      b.innerHTML='<span class="dfr">'+hl(d.fr,t)+'</span>'+
                  '<span class="dph">'+esc(d.ph)+'</span>'+
                  '<span class="den">'+hl(d.en,t)+'</span>'+
                  '<span class="dwh">'+esc([...d.where].slice(0,2).join(' · '))+'</span>';
      b.addEventListener('click',()=>{
        if(speakingEl===b && speechSynthesis.speaking){stopSpeech();return;}
        stopSpeech(); speak(d.fr,b);
      });
      list.appendChild(b);
    });
    if(rows.length>600){
      const n=document.createElement('div'); n.className='dmore';
      n.textContent='Showing the first 600 — keep typing to narrow it down.';
      list.appendChild(n);
    }
  };
  let t; inp.addEventListener('input',()=>{clr.hidden=!inp.value;clearTimeout(t);t=setTimeout(()=>paint(inp.value),120);});
  clr.addEventListener('click',()=>{inp.value='';clr.hidden=true;paint('');inp.focus();});
  paint('');
}


/* ══════════════════════════════════════════════
   THEME
   ══════════════════════════════════════════════ */
(function(){
  const root=document.documentElement;
  let th='light'; try{th=localStorage.getItem('carnet-theme')||'light';}catch(e){}
  root.setAttribute('data-theme',th);
  document.getElementById('themebtn').addEventListener('click',()=>{
    const n=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',n);
    try{localStorage.setItem('carnet-theme',n);}catch(e){}
  });
})();

/* ══════════════════════════════════════════════
   INTERFACE — progress, palette, shortcuts
   ══════════════════════════════════════════════ */
(function(){
  const bar=document.getElementById('progress'), top=document.querySelector('.top');
  const main=document.getElementById('main');
  function tick(){
    const el=document.scrollingElement||document.documentElement;
    const max=el.scrollHeight-el.clientHeight;
    bar.style.width=(max>40?(el.scrollTop/max)*100:0)+'%';
    top.classList.toggle('scrolled',el.scrollTop>6);
  }
  addEventListener('scroll',tick,{passive:true});
  addEventListener('resize',tick,{passive:true});
  tick();
  if(main) new MutationObserver(tick).observe(main,{childList:true,subtree:false});
})();

/* ── jump palette ── */
const pal=document.getElementById('palette'), pq=document.getElementById('pq'), plist=document.getElementById('plist');
let palRows=[], palSel=0;
function palOpen(){
  pal.hidden=false; pq.value=''; palPaint(''); pq.focus();
}
function palClose(){ pal.hidden=true; }
function palPaint(q){
  const t=q.trim().toLowerCase();
  const all=[];
  DATA.forEach(s=>s.lessons.forEach(l=>all.push({l,s})));
  palRows=t? all.filter(r=>(r.l.name+' '+r.l.label+' '+r.s.name).toLowerCase().includes(t)) : all;
  palSel=0;
  if(!palRows.length){ plist.innerHTML='<div class="pempty">Nothing matches that.</div>'; return; }
  plist.innerHTML=palRows.slice(0,60).map((r,i)=>
    '<button class="pitem'+(i===0?' sel':'')+'" data-i="'+i+'">'+
    '<span class="pdot" style="background:'+r.s.color+'"></span>'+
    '<span><strong>'+esc(r.l.name)+'</strong> <span style="opacity:.65">'+esc(r.l.label)+'</span></span>'+
    '<span class="psec">'+esc(r.s.short||r.s.name)+'</span></button>').join('');
  [...plist.children].forEach(b=>b.addEventListener('click',()=>palGo(+b.dataset.i)));
}
function palGo(i){
  const r=palRows[i]; if(!r) return;
  palClose(); location.hash='#l/'+r.l.id;
}
function palMove(d){
  const n=Math.min(palRows.length,60); if(!n) return;
  palSel=(palSel+d+n)%n;
  [...plist.children].forEach((b,i)=>b.classList.toggle('sel',i===palSel));
  const el=plist.children[palSel]; if(el) el.scrollIntoView({block:'nearest'});
}
pq.addEventListener('input',()=>palPaint(pq.value));
pq.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();palMove(1);}
  else if(e.key==='ArrowUp'){e.preventDefault();palMove(-1);}
  else if(e.key==='Enter'){e.preventDefault();palGo(palSel);}
  else if(e.key==='Escape'){palClose();}
});
pal.addEventListener('click',e=>{ if(e.target===pal) palClose(); });

/* ── shortcuts sheet ── */
const sheet=document.getElementById('shortcuts');
sheet.addEventListener('click',()=>sheet.hidden=true);

/* ── global keys ── */
addEventListener('keydown',e=>{
  const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
  if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); pal.hidden?palOpen():palClose(); return; }
  if(!pal.hidden || typing) return;
  if(e.key==='?'){ e.preventDefault(); sheet.hidden=!sheet.hidden; return; }
  if(e.key==='Escape'){ sheet.hidden=true; return; }
  if(e.key.toLowerCase()==='d'){ document.getElementById('themebtn').click(); return; }
  if(e.key.toLowerCase()==='p'){ const b=document.getElementById('practicebtn'); if(b) b.click(); return; }
  if(e.key.toLowerCase()==='j'||e.key.toLowerCase()==='k'){
    const cur=location.hash.replace('#l/','');
    const i=LESSONS.findIndex(l=>l.id===cur);
    if(i<0) return;
    const n=e.key.toLowerCase()==='j'?i+1:i-1;
    if(LESSONS[n]) location.hash='#l/'+LESSONS[n].id;
  }
});

/* ══════════════════════════════════════════════
   ROUTING + KEYS
   ══════════════════════════════════════════════ */
function stepIds(s){return [].concat(s.ae||[], s.ca||[], s.gr||[], s.vp||[], s.also||[]);}
function stepFor(id){return allSteps().find(s=>stepIds(s).includes(id))||null;}

function viewPath(){
  stopSpeech();
  const h=location.hash.replace('#','');
  const level=(h.match(/^path\/(A1|A2|B1|B2)$/)||[])[1]||currentLevel();
  try{localStorage.setItem('carnet-level', level);}catch(e){}
  main.style.setProperty('--sc','#16233A');
  main.innerHTML='';
  const head=document.createElement('div');
  head.className='lhead';
  head.innerHTML='<span class="ltag">Parcours</span><h2>A path through each level</h2>'+
    '<p>Each A1 step lines up one Alter Ego dossier with the cahier, the grammar chapters and the vocabulary that belong with it. A2, B1 and B2 will grow the same way when their books are added.</p>';
  main.appendChild(head);
  const switcher=document.createElement('div');
  switcher.className='levelgrid';
  LEVELS.forEach(lv=>{
    const p=levelProgress(lv.id);
    const b=document.createElement('button');
    b.className='levelcard'+(lv.id===level?' on':'');
    b.innerHTML='<b>'+lv.id+'</b><span>'+(p.waiting?'Not loaded':p.pct+'%')+'</span><i style="width:'+p.pct+'%"></i>';
    b.addEventListener('click',()=>{location.hash='path/'+lv.id;});
    switcher.appendChild(b);
  });
  main.appendChild(switcher);
  const steps=pathFor(level);
  if(!steps.length){
    const note=document.createElement('div');
    note.className='empty';
    note.innerHTML='<b>No '+level+' steps yet.</b> The book slots are on the '+level+' shelf. This path will list each dossier when the text is transcribed.';
    main.appendChild(note);
    setActive('path');
    window.scrollTo(0,0);
    return;
  }
  steps.forEach(step=>{
    const card=document.createElement('section');
    card.className='pathstep';
    const ids=stepIds(step);
    const doneN=ids.filter(id=>done.has(id)).length;
    card.innerHTML='<header><span class="pn">'+step.n+'</span><div><h3>'+esc(step.title)+'</h3><p>'+esc(step.focus)+'</p></div><span class="pc">'+doneN+'/'+ids.length+' done</span></header>';
    const cols=document.createElement('div');
    cols.className='pathcols';
    [['Livre','ae'],['Cahier','ca'],['Grammaire','gr'],['Vocabulaire','vp'],['Also','also']].forEach(([label,key])=>{
      const list=step[key]||[];
      if(!list.length) return;
      const col=document.createElement('div');
      col.innerHTML='<h4>'+label+'</h4>';
      list.forEach(id=>{
        const les=lessonById(id); if(!les) return;
        const b=document.createElement('button');
        b.type='button'; b.className='rel'+(done.has(id)?' on':'');
        b.textContent=(done.has(id)?'✓ ':'')+les.name;
        b.addEventListener('click',()=>{location.hash='l/'+id;});
        col.appendChild(b);
      });
      cols.appendChild(col);
    });
    card.appendChild(cols);
    main.appendChild(card);
  });
  setActive('path');
  window.scrollTo(0,0);
}

function renderVerbs(host, verbs){
  const wrap=document.createElement('section');
  wrap.className='group';
  wrap.innerHTML='<div class="ghead"><h3>Conjugations</h3><div class="right"><span class="gct">'+verbs.length+'</span></div></div>'+
    '<p class="note">Tap a form to hear it. Passé composé with être shows (e) / (e)s for agreement. <em>Je voudrais</em> (I would like) is the conditional, not the future <em>je voudrai</em>.</p>';
  const search=document.createElement('div');
  search.className='dsearch verbsearch';
  search.innerHTML='<input type="search" placeholder="Search a verb, in French or English…" autocomplete="off" spellcheck="false">';
  wrap.appendChild(search);
  const list=document.createElement('div');
  list.className='vlist';
  wrap.appendChild(list);
  const input=search.querySelector('input');
  function paint(){
    const t=input.value.trim().toLowerCase();
    const rows=verbs.filter(v=>!t || v.inf.toLowerCase().includes(t) || (v.en||'').toLowerCase().includes(t));
    list.innerHTML='';
    rows.forEach(v=>{
      const det=document.createElement('details');
      det.className='vcard';
      const sum=document.createElement('summary');
      sum.innerHTML='<b>'+esc(v.inf)+'</b><span>'+esc(v.en||'')+'</span><i>'+esc(v.aux||'')+'</i>';
      det.appendChild(sum);
      if(v.note){
        const n=document.createElement('p'); n.className='vnote'; n.textContent=v.note; det.appendChild(n);
      }
      const grid=document.createElement('div'); grid.className='vgrid';
      [['Présent',v.present],['Passé composé',v.pc],['Imparfait',v.imparfait],['Futur simple',v.futur]].forEach(([name, forms])=>{
        const col=document.createElement('div');
        col.innerHTML='<h4>'+esc(name)+'</h4>';
        (forms||[]).forEach(line=>{
          const b=document.createElement('button');
          b.type='button'; b.className='vline'; b.textContent=line;
          b.addEventListener('click',()=>speak(speakable(line), b));
          col.appendChild(b);
        });
        grid.appendChild(col);
      });
      det.appendChild(grid);
      if(v.imperatif&&v.imperatif.length){
        const p=document.createElement('p');
        p.className='vimp';
        p.innerHTML='<b>Impératif</b> '+v.imperatif.map(esc).join(' · ');
        det.appendChild(p);
      }
      list.appendChild(det);
    });
    if(!rows.length){
      const empty=document.createElement('div');
      empty.className='qhint';
      empty.textContent='No verb matches.';
      list.appendChild(empty);
    }
  }
  input.addEventListener('input', paint);
  paint();
  host.appendChild(wrap);
}

function route(){
  const h=location.hash.replace('#','');
  if(h==='fav') return viewFavs();
  if(h==='path'||h.startsWith('path/')) return viewPath();
  if(h.startsWith('lv/')) return viewHome(h.slice(3));
  if(h.startsWith('s/')) return viewSection(h.slice(2));
  if(h.startsWith('l/')) return viewLesson(h.slice(2));
  viewHome();
}
window.addEventListener('hashchange',()=>{
  const q=document.getElementById('q');
  if(q.value){q.value='';}
  route();
});

const qEl=document.getElementById('q');
let deb;
qEl.addEventListener('input',()=>{clearTimeout(deb);deb=setTimeout(()=>viewSearch(qEl.value),140);});
qEl.addEventListener('keydown',e=>{if(e.key==='Escape'){qEl.value='';qEl.blur();route();}});

document.getElementById('lbclose').addEventListener('click',closeLightbox);
document.getElementById('lbprev').addEventListener('click',()=>lbMove(-1));
document.getElementById('lbnext').addEventListener('click',()=>lbMove(1));
document.getElementById('lightbox').addEventListener('click',e=>{
  if(e.target.id==='lightbox') closeLightbox();
});

document.addEventListener('keydown',e=>{
  const lb=document.getElementById('lightbox');
  if(!lb.hidden){
    if(e.key==='Escape') closeLightbox();
    if(e.key==='ArrowLeft') lbMove(-1);
    if(e.key==='ArrowRight') lbMove(1);
    return;
  }
  if(!overlay.hidden){
    if(e.key==='Escape') closePractice();
    if(e.key===' '&&pDeck.length&&pIdx<pDeck.length){
      const btn=document.getElementById('preveal')||document.getElementById('pknow');
      if(btn){e.preventDefault();btn.click();}
    }
    return;
  }
  if(e.key==='/'&&document.activeElement!==qEl){e.preventDefault();qEl.focus();}
  if(e.key==='Escape') stopSpeech();
});

(function probeMedia(){
  const probe=new Image();
  probe.onload=()=>{renderTree();route();};
  probe.onerror=()=>{FLATMEDIA=true;renderTree();route();};
  probe.src='pages/p045.jpg';
  setTimeout(()=>{if(!document.getElementById('main').childNodes.length){renderTree();route();}},2500);
})();
