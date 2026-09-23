/* Nova Home — own booking (no widgets). Set API to your Worker URL after deploy. */
(function(){
var API=(window.NV_BOOK_API||'').replace(/\/$/,'');
var ICAL=window.NV_ICAL||{};
if(!API&&!Object.keys(ICAL).length)return;
function parseIcal(t){var add=function(i,n){var d=new Date(i+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)},dt=function(v){var m=v.match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/);if(!m)return null;if(!m[4]||!m[7])return m[1]+'-'+m[2]+'-'+m[3];var x=Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6])+5*3600e3;return new Date(x).toISOString().slice(0,10)};
var L=t.replace(/\r?\n[ \t]/g,'').split(/\r?\n/),out=[],ev=null;L.forEach(function(l){if(l==='BEGIN:VEVENT')ev={};else if(l==='END:VEVENT'){if(ev&&ev.s&&ev.e&&ev.st!=='CANCELLED')for(var d=ev.s;d<ev.e;d=add(d,1))out.push(d);ev=null}else if(ev){var i=l.indexOf(':'),k=l.slice(0,i).split(';')[0].toUpperCase(),v=l.slice(i+1).trim();if(k==='DTSTART')ev.s=dt(v);else if(k==='DTEND')ev.e=dt(v);else if(k==='STATUS')ev.st=v.toUpperCase()}});return out}
function busyFor(apt,fresh){if(API)return j('/busy?apt='+apt+(fresh?'&fresh=1':'')).then(function(d){return d.busy});if(!ICAL[apt])return Promise.reject(new Error('no_feed'));return fetch(ICAL[apt]+(fresh?'&_='+Date.now():''),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('feed');return r.text()}).then(parseIcal)}
document.documentElement.classList.add('nv-own-booking');
var PRICE={};
function j(u,o){var c=new AbortController(),t=setTimeout(function(){c.abort()},9000);o=o||{};o.signal=c.signal;return fetch(API+u,o).then(function(r){clearTimeout(t);return r.json().then(function(d){if(!r.ok){var e=new Error(d.message||d.error||'error');e.code=d.error;e.status=r.status;throw e}return d})})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function word(n){var m=n%10,h=n%100;if(h>=11&&h<=14)return 'ночей';if(m===1)return 'ночь';if(m>=2&&m<=4)return 'ночи';return 'ночей'}
function fmt(iso){var M=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'],p=iso.split('-');return +p[2]+' '+M[+p[1]-1]}
function nights(a,b){return Math.round((new Date(b)-new Date(a))/864e5)}
function total(price,n){var sub=price*n;return sub-(n>=7?Math.round(sub*.05):0)}

/* ---------- apartment page ---------- */
var pc=document.getElementById('pc');
if(pc){
  var APT=pc.dataset.apt,P=+pc.dataset.price,bk=document.getElementById('bookBtn');
  var st=document.createElement('div');st.className='bk-status';st.innerHTML='<span class="dot"></span><span class="t">Проверяем свободные даты…</span>';bk.parentNode.insertBefore(st,bk);
  var last=0,inflight=null,lg=document.querySelector('.cal-legend'),cal=document.getElementById('cal');
  function ago(){var s=Math.round((Date.now()-last)/1000);return s<10?'только что':s<60?s+' сек назад':Math.round(s/60)+' мин назад'}
  function sync(fresh){if(inflight)return inflight;st.classList.remove('ok','warn');st.querySelector('.t').textContent='Сверяем даты с календарём…';if(cal)cal.classList.add('syncing');
    inflight=busyFor(APT,fresh).then(function(list){var m={};list.forEach(function(x){m[x]=1});window.NV_BUSY=m;last=Date.now();if(lg)lg.hidden=false;if(window.NV_CAL)window.NV_CAL.refresh();st.classList.add('ok');st.querySelector('.t').textContent='Даты актуальны · обновлено '+ago()})
    .catch(function(){st.classList.add('warn');st.querySelector('.t').textContent='Не удалось сверить даты — проверим при бронировании'})
    .then(function(){inflight=null;if(cal)cal.classList.remove('syncing')});return inflight}
  sync(false);
  document.addEventListener('nv:calopen',function(){if(Date.now()-last>15000)sync(true)});
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&Date.now()-last>60000)sync(true)});
  setInterval(function(){if(last&&st.classList.contains('ok'))st.querySelector('.t').textContent='Даты актуальны · обновлено '+ago()},15000);
  bk.addEventListener('click',function(ev){ev.preventDefault();var ci=document.getElementById('ci').value,co=document.getElementById('co').value;if(!ci||!co){document.getElementById('drBtn').click();return}openForm(APT,P,ci,co,+document.getElementById('gs').value,document.querySelector('.ap-head h1').textContent)});
}

/* ---------- form sheet ---------- */
var sheet;
function openForm(apt,price,ci,co,guests,title){
  var n=nights(ci,co),tot=total(price,n);
  if(!sheet){sheet=document.createElement('div');sheet.className='bk-sheet';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-labelledby','bkT');document.body.appendChild(sheet);
    sheet.addEventListener('click',function(e){if(e.target===sheet||e.target.closest('.bk-x'))closeForm()});addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('on'))closeForm()})}
  var saved={};try{saved=JSON.parse(localStorage.getItem('nvGuestContact')||'{}')}catch(e){}
  sheet.innerHTML='<form class="bk-card" novalidate>'+
   '<button type="button" class="bk-x" aria-label="Закрыть"><i class="ph-bold ph-x"></i></button>'+
   '<div class="eyebrow">Бронирование</div><h3 id="bkT">'+esc(title)+'</h3>'+
   '<div class="bk-sum"><div><small>Заезд</small><b>'+fmt(ci)+'</b></div><i class="ph-bold ph-arrow-right"></i><div><small>Выезд</small><b>'+fmt(co)+'</b></div><div class="bk-tot"><small>'+n+' '+word(n)+' · '+guests+' гост.</small><b>$'+tot+'</b></div></div>'+
   '<label>Имя и фамилия<input name="name" autocomplete="name" required minlength="2" value="'+esc(saved.name||'')+'"></label>'+
   '<label>Телефон<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+998 90 000 00 00" value="'+esc(saved.phone||'')+'"></label>'+
   '<div class="bk-seg" role="radiogroup" aria-label="Мессенджер"><label><input type="radio" name="messenger" value="Telegram" checked><span><i class="ph-fill ph-telegram-logo"></i>Telegram</span></label><label><input type="radio" name="messenger" value="WhatsApp"><span><i class="ph-fill ph-whatsapp-logo"></i>WhatsApp</span></label></div>'+
   '<label>Email <small>необязательно</small><input name="email" type="email" inputmode="email" autocomplete="email" value="'+esc(saved.email||'')+'"></label>'+
   '<label>Комментарий <small>необязательно</small><textarea name="comment" rows="2" placeholder="Время заезда, пожелания"></textarea></label>'+
   '<input name="website" class="bk-hp" tabindex="-1" autocomplete="off" aria-hidden="true">'+
   '<label class="bk-agree"><input type="checkbox" name="agree" required><span>Согласен с <a href="docs/oferta.pdf" target="_blank" rel="noopener">договором оферты</a></span></label>'+
   '<div class="bk-err" role="alert" hidden></div>'+
   '<button class="btn btn-primary w100 bk-go" type="submit"><span>'+(API?'Забронировать':'Отправить заявку')+'</span></button>'+
   '<p class="bk-note"><i class="ph-fill ph-lightning"></i>'+(API?'Мгновенное подтверждение. Оплата — любым удобным способом, детали пришлём в мессенджер.':'Подтвердим в течение 15 минут в выбранном мессенджере. Оплата — после подтверждения.')+'</p>'+
  '</form>';
  var f=sheet.querySelector('form'),err=f.querySelector('.bk-err'),go=f.querySelector('.bk-go');
  f.addEventListener('submit',function(ev){ev.preventDefault();err.hidden=true;
    var fd=new FormData(f),d={apt:apt,checkin:ci,checkout:co,guests:guests,total:'$'+tot,name:fd.get('name'),phone:fd.get('phone'),messenger:fd.get('messenger'),email:fd.get('email'),comment:fd.get('comment'),website:fd.get('website'),agree:!!fd.get('agree')};
    var bad=!d.name||d.name.trim().length<2?'name':!/^\+?[\d\s()-]{7,20}$/.test(d.phone||'')?'phone':d.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)?'email':!d.agree?'agree':'';
    if(bad){var el=f.elements[bad];el.focus();err.textContent={name:'Укажите имя',phone:'Проверьте номер телефона',email:'Проверьте email',agree:'Подтвердите согласие с офертой'}[bad];err.hidden=false;return}
    try{localStorage.setItem('nvGuestContact',JSON.stringify({name:d.name,phone:d.phone,email:d.email}))}catch(e){}
    go.disabled=true;go.classList.add('busy');go.querySelector('span').textContent='Отправляем…';
    if(!API){busyFor(apt).then(function(list){var m={};list.forEach(function(x){m[x]=1});window.NV_BUSY=m;var t=new Date(ci);for(;t<new Date(co);t.setDate(t.getDate()+1)){if(m[t.toISOString().slice(0,10)]){var er=new Error('taken');er.code='dates_taken';throw er}}
      var msg='Здравствуйте! Хочу забронировать '+title+'\n'+fmt(ci)+' → '+fmt(co)+' ('+n+' '+word(n)+'), гостей: '+guests+'\nИтого: $'+tot+'\nИмя: '+d.name+'\nТелефон: '+d.phone+(d.email?'\nEmail: '+d.email:'')+(d.comment?'\nКомментарий: '+d.comment:'');
      var wa='https://wa.me/998900115074?text='+encodeURIComponent(msg),tgl='https://t.me/novahome_uzb';
      if(navigator.clipboard)navigator.clipboard.writeText(msg).catch(function(){});
      if(typeof gtag==='function')gtag('event','booking_request',{apt:apt,value:tot,currency:'USD',method:d.messenger});
      f.innerHTML='<button type="button" class="bk-x" aria-label="Закрыть"><i class="ph-bold ph-x"></i></button><div class="bk-ok"><i class="ph-fill ph-check-circle"></i><h3>Даты свободны</h3><p>Остался один шаг — отправьте заявку нам в '+esc(d.messenger)+'. Текст уже готов'+(d.messenger==='Telegram'?' и скопирован — просто вставьте его в чат':'')+'.</p><div class="bk-sum sm"><div><small>'+fmt(ci)+' → '+fmt(co)+'</small><b>'+esc(title)+'</b></div><div class="bk-tot"><small>Итого</small><b>$'+tot+'</b></div></div><a class="btn btn-primary w100" href="'+(d.messenger==='WhatsApp'?wa:tgl)+'" target="_blank" rel="noopener"><i class="ph-fill ph-'+(d.messenger==='WhatsApp'?'whatsapp':'telegram')+'-logo"></i>Отправить в '+esc(d.messenger)+'</a></div>';
    }).catch(function(e){go.disabled=false;go.classList.remove('busy');go.querySelector('span').textContent='Отправить заявку';err.textContent=e.code==='dates_taken'?'Эти даты только что заняли. Выберите другие — календарь обновлён.':'Не удалось проверить даты. Напишите нам в Telegram — забронируем вручную.';err.hidden=false;if(window.NV_CAL)window.NV_CAL.refresh()});return}
    j('/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){
      if(typeof gtag==='function')gtag('event','booking_request',{apt:apt,value:tot,currency:'USD'});
      f.innerHTML='<button type="button" class="bk-x" aria-label="Закрыть"><i class="ph-bold ph-x"></i></button><div class="bk-ok"><i class="ph-fill ph-check-circle"></i><h3>'+(r.instant?'Бронь подтверждена':'Заявка отправлена')+'</h3><p>Номер брони <b>'+esc(r.id)+'</b>. '+(r.instant?'Даты закреплены за вами. В течение 15 минут пришлём в '+esc(d.messenger)+' детали оплаты и инструкцию по заселению.':'Мы проверим даты и подтвердим бронь в '+esc(d.messenger)+' в течение 15 минут.')+'</p><div class="bk-sum sm"><div><small>'+fmt(ci)+' → '+fmt(co)+'</small><b>'+esc(title)+'</b></div><div class="bk-tot"><small>Итого</small><b>$'+tot+'</b></div></div><a class="btn btn-ghost w100" href="https://t.me/novahome_uzb" target="_blank" rel="noopener"><i class="ph-fill ph-telegram-logo"></i>Написать нам сейчас</a></div>';
    }).catch(function(e){go.disabled=false;go.classList.remove('busy');go.querySelector('span').textContent=API?'Забронировать':'Отправить заявку';
      err.textContent=e.code==='dates_taken'?'Эти даты только что заняли. Выберите другие — календарь обновлён.':e.name==='AbortError'?'Сервер отвечает слишком долго. Попробуйте ещё раз или напишите нам в Telegram.':(e.message&&e.status<500?e.message:'Не получилось отправить. Напишите нам в Telegram — забронируем вручную.');err.hidden=false;
      if(e.code==='dates_taken'&&pc)busyFor(apt).then(function(x){var m={};x.forEach(function(y){m[y]=1});window.NV_BUSY=m;if(window.NV_CAL)window.NV_CAL.refresh()})});
  });
  document.body.classList.add('bk-open');requestAnimationFrame(function(){sheet.classList.add('on');setTimeout(function(){var i=f.querySelector('input[name=name]');if(i&&!i.value)i.focus()},320)});
}
function closeForm(){sheet.classList.remove('on');document.body.classList.remove('bk-open')}

/* ---------- catalog search (booking.html / index) ---------- */
var grid=document.getElementById('catGrid');
var sb=document.getElementById('nvSearch');
if(sb){
  var fi=sb.querySelector('[name=from]'),ti=sb.querySelector('[name=to]'),gi=sb.querySelector('[name=guests]'),out=sb.querySelector('.nvs-msg');
  var t=new Date();t.setHours(0,0,0,0);var iso=function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  fi.min=iso(t);var q=new URLSearchParams(location.search);if(q.get('checkin'))fi.value=q.get('checkin');if(q.get('checkout'))ti.value=q.get('checkout');
  function syncMin(){if(fi.value){var d=new Date(fi.value);d.setDate(d.getDate()+1);ti.min=iso(d);if(ti.value&&ti.value<=fi.value)ti.value=iso(d)}}
  fi.addEventListener('change',function(){syncMin();if(!ti.value)ti.showPicker&&ti.showPicker()});syncMin();
  sb.addEventListener('submit',function(ev){ev.preventDefault();var a=fi.value,b=ti.value,g=+gi.value||1;
    if(!a||!b||b<=a){out.textContent='Выберите даты заезда и выезда';out.className='nvs-msg warn';return}
    out.textContent='Ищем свободные апартаменты…';out.className='nvs-msg';sb.classList.add('busy');
    j('/availability?from='+a+'&to='+b).then(function(d){sb.classList.remove('busy');
      var cards=grid?grid.querySelectorAll('.cat-card'):[],free=0,n=d.nights;
      cards.forEach(function(c){var id=(c.getAttribute('href').match(/apartment-(\d+)/)||[])[1],r=d.apts[id],ok=r&&r.free!==false&&+c.dataset.guests>=g;
        c.classList.toggle('na',!ok);var old=c.querySelector('.nvs-tot');if(old)old.remove();
        c.href='apartment-'+id+'.html?checkin='+a+'&checkout='+b+'&guests='+g;
        if(ok){free++;var p=+c.dataset.price,el=document.createElement('div');el.className='nvs-tot';el.innerHTML='<span>'+n+' '+word(n)+'</span><b>$'+total(p,n)+'</b>';c.querySelector('.bd').appendChild(el)}});
      out.textContent=free?('Свободно '+free+' из '+cards.length+' на '+fmt(a)+' — '+fmt(b)):'На эти даты всё занято. Попробуйте соседние даты или напишите нам.';out.className='nvs-msg '+(free?'ok':'warn');
      if(grid)grid.classList.add('searched');
      var tgt=document.getElementById('apts');if(tgt)scrollTo({top:tgt.getBoundingClientRect().top+scrollY-90,behavior:'smooth'});
    }).catch(function(){sb.classList.remove('busy');out.textContent='Не удалось проверить наличие. Напишите нам в Telegram — ответим за пару минут.';out.className='nvs-msg warn'});
  });
  if(fi.value&&ti.value)sb.requestSubmit?sb.requestSubmit():sb.dispatchEvent(new Event('submit'));
}
/* prefill apartment page dates from ?checkin&checkout */
if(pc&&window.NV_CAL){var qq=new URLSearchParams(location.search);if(qq.get('checkin')&&qq.get('checkout'))window.NV_CAL.set(qq.get('checkin'),qq.get('checkout'),qq.get('guests'))}
})();
