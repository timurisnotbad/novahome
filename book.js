/* Nova Home — own booking (no widgets). Set API to your Worker URL after deploy. */
(function(){
var NV_T=window.NV_T||function(x){return x};
var API=(window.NV_BOOK_API||'').replace(/\/$/,'');
window.NV_PAY=function(id,tk,btn){if(!API)return;var lab=btn&&btn.querySelector('span');if(btn){btn.disabled=true;btn.classList.add('busy')}if(lab)lab.textContent=NV_T('Открываем оплату…');var c=new AbortController();setTimeout(function(){c.abort()},12000);fetch(API+'/pay/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,t:tk,lang:document.documentElement.lang||'ru'}),signal:c.signal}).then(function(r){return r.json().then(function(d){if(!r.ok)throw new Error(d.message||d.error||'error');return d})}).then(function(d){if(typeof gtag==='function')gtag('event','begin_checkout',{value:d.usd,currency:'USD'});location.href=d.url}).catch(function(e){if(btn){btn.disabled=false;btn.classList.remove('busy')}if(lab)lab.textContent=NV_T('Оплатить онлайн');var m=e.name==='AbortError'?NV_T('Платёжная система отвечает слишком долго. Попробуйте ещё раз.'):e.message;var er=btn&&btn.parentNode.querySelector('.bk-payerr');if(!er&&btn){er=document.createElement('div');er.className='bk-err bk-payerr';btn.parentNode.insertBefore(er,btn.nextSibling)}if(er){er.textContent=m;er.hidden=false}})};
var ICAL=window.NV_ICAL||{};
if(!API&&!Object.keys(ICAL).length)return;
function parseIcal(t){var add=function(i,n){var d=new Date(i+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)},dt=function(v){var m=v.match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/);if(!m)return null;if(!m[4]||!m[7])return m[1]+'-'+m[2]+'-'+m[3];var x=Date.UTC(+m[1],+m[2]-1,+m[3],+m[4],+m[5],+m[6])+5*3600e3;return new Date(x).toISOString().slice(0,10)};
var L=t.replace(/\r?\n[ \t]/g,'').split(/\r?\n/),out=[],ev=null;L.forEach(function(l){if(l==='BEGIN:VEVENT')ev={};else if(l==='END:VEVENT'){if(ev&&ev.s&&ev.e&&ev.st!=='CANCELLED')for(var d=ev.s;d<ev.e;d=add(d,1))out.push(d);ev=null}else if(ev){var i=l.indexOf(':'),k=l.slice(0,i).split(';')[0].toUpperCase(),v=l.slice(i+1).trim();if(k==='DTSTART')ev.s=dt(v);else if(k==='DTEND')ev.e=dt(v);else if(k==='STATUS')ev.st=v.toUpperCase()}});return out}
function busyFor(apt,fresh){if(API){var u=function(f){return '/busy?apt='+apt+(f?'&fresh=1':'')+'&_='+Date.now()};return j(u(fresh),{cache:'no-store'}).catch(function(){return j(u(true),{cache:'no-store'})}).then(function(d){if(!d||!Array.isArray(d.busy))throw new Error('bad');return d.busy})}if(!ICAL[apt])return Promise.reject(new Error('no_feed'));return fetch(ICAL[apt]+(fresh?'&_='+Date.now():''),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('feed');return r.text()}).then(parseIcal)}
document.documentElement.classList.add('nv-own-booking');
var PRICE={};
function j(u,o){var c=new AbortController(),t=setTimeout(function(){c.abort()},9000);o=o||{};o.signal=c.signal;return fetch(API+u,o).then(function(r){clearTimeout(t);return r.json().then(function(d){if(!r.ok){var e=new Error(d.message||d.error||'error');e.code=d.error;e.status=r.status;throw e}return d})})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function word(n){var m=n%10,h=n%100;if(h>=11&&h<=14)return NV_T('ночей');if(m===1)return NV_T('ночь');if(m>=2&&m<=4)return NV_T('ночи');return NV_T('ночей')}
function fmt(iso){var M=[NV_T('янв'),NV_T('фев'),NV_T('мар'),NV_T('апр'),NV_T('мая'),NV_T('июн'),NV_T('июл'),NV_T('авг'),NV_T('сен'),NV_T('окт'),NV_T('ноя'),NV_T('дек')],p=iso.split('-');return +p[2]+' '+M[+p[1]-1]}
function nights(a,b){return Math.round((new Date(b)-new Date(a))/864e5)}
function disc(n){return n>=30?20:n>=7?10:0}
function gdisc(){var g=window.NV_GUEST;return g&&g.token?(g.discount||5):0}
function total(price,n){var sub=price*n;var d=disc(n)+gdisc();return sub-Math.round(sub*d/100)}

/* ---------- apartment page ---------- */
var pc=document.getElementById('pc');
if(pc){
  var APT=pc.dataset.apt,P=+pc.dataset.price,bk=document.getElementById('bookBtn');
  var st=document.createElement('div');st.className='bk-status';st.innerHTML='<span class="dot"></span><span class="t">Проверяем свободные даты…</span>';bk.parentNode.insertBefore(st,bk);
  var last=0,inflight=null,lg=document.querySelector('.cal-legend'),cal=document.getElementById('cal');
  function ago(){var s=Math.round((Date.now()-last)/1000);return s<10?NV_T('только что'):s<60?s+NV_T(' сек назад'):Math.round(s/60)+NV_T(' мин назад')}
  function sync(fresh){if(inflight)return inflight;st.classList.remove('ok','warn');st.querySelector('.t').textContent=NV_T('Сверяем даты с календарём…');if(cal)cal.classList.add('syncing');
    inflight=busyFor(APT,fresh).then(function(list){var m={};list.forEach(function(x){m[x]=1});window.NV_BUSY=m;last=Date.now();if(lg)lg.hidden=false;if(window.NV_CAL)window.NV_CAL.refresh();st.classList.add('ok');st.querySelector('.t').textContent=NV_T('Даты актуальны · обновлено ')+ago()})
    .catch(function(){st.classList.add('warn');st.querySelector('.t').textContent=NV_T('Не удалось сверить даты — проверим при бронировании')})
    .then(function(){inflight=null;if(cal)cal.classList.remove('syncing')});return inflight}
  sync(false);
  document.addEventListener('nv:calopen',function(){if(Date.now()-last>15000)sync(true)});
  document.addEventListener('visibilitychange',function(){if(!document.hidden&&Date.now()-last>60000)sync(true)});
  setInterval(function(){if(last&&st.classList.contains('ok'))st.querySelector('.t').textContent=NV_T('Даты актуальны · обновлено ')+ago()},15000);
  bk.addEventListener('click',function(ev){ev.preventDefault();var ci=document.getElementById('ci').value,co=document.getElementById('co').value;if(!ci||!co){document.getElementById('drBtn').click();return}openForm(APT,P,ci,co,+document.getElementById('gs').value,document.querySelector('.ap-head h1').textContent)});
}

/* ---------- add to calendar ---------- */
window.NV_ICS=function(r){var z=function(s){return s.replace(/-/g,'')};
var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Nova Home//Booking//RU','BEGIN:VEVENT','UID:'+r.id+'@novahome.uz','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART;TZID=Asia/Tashkent:'+z(r.from)+'T140000','DTEND;TZID=Asia/Tashkent:'+z(r.to)+'T110000','SUMMARY:Nova Home · '+r.title+NV_T(' · бронь ')+r.id,'LOCATION:Nest One\\, ул. Батыра Закирова 1А/1\\, Ташкент',NV_T('DESCRIPTION:Бронь ')+r.id+'\\nЗаезд с 14:00\\, выезд до 11:00\\nИтого: '+r.total+'\\nМенеджер: @novahome_uzb · +998 90 011 50 74','END:VEVENT','END:VCALENDAR'].join('\r\n');
var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='novahome-'+r.id+'.ics';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)};

/* ---------- form sheet ---------- */
var sheet;
function openForm(apt,price,ci,co,guests,title){
  var n=nights(ci,co),tot=total(price,n);
  if(!sheet){sheet=document.createElement('div');sheet.className='bk-sheet';sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-labelledby','bkT');document.body.appendChild(sheet);
    sheet.addEventListener('click',function(e){if(e.target===sheet||e.target.closest('.bk-x'))closeForm()});addEventListener('keydown',function(e){if(e.key==='Escape'&&sheet.classList.contains('on'))closeForm()})}
  var saved={};try{saved=JSON.parse(localStorage.getItem('nvGuestContact')||'{}')}catch(e){}if(window.NV_GUEST){saved.name=saved.name||window.NV_GUEST.name;saved.email=saved.email||window.NV_GUEST.email}
  sheet.innerHTML='<form class="bk-card" novalidate>'+
   '<button type="button" class="bk-x" aria-label="Закрыть"><i class="ph-bold ph-x"></i></button>'+
   '<div class="eyebrow">Бронирование</div><h3 id="bkT">'+esc(title)+'</h3>'+
   '<div class="bk-sum"><div><small>Заезд</small><b>'+fmt(ci)+'</b></div><i class="ph-bold ph-arrow-right"></i><div><small>Выезд</small><b>'+fmt(co)+'</b></div><div class="bk-tot"><small>'+n+' '+word(n)+' · '+guests+NV_T(' гост.')+(gdisc()?NV_T(' · профиль −')+gdisc()+'%':'')+'</small><b>$'+tot+'</b></div></div>'+(gdisc()?'':'<div class="bk-promo"><i class="ph-fill ph-gift"></i><span>Профиль гостя даёт ещё <b>−5%</b> на эту и все следующие брони.</span><button type="button" class="nv-reg-open" id="bkReg">Получить</button></div>')+
   '<label>Имя и фамилия<input name="name" autocomplete="name" required minlength="2" value="'+esc(saved.name||'')+'"></label>'+
   '<label>Телефон<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+998 90 000 00 00" value="'+esc(saved.phone||'')+'"></label>'+
   '<div class="bk-seg" role="radiogroup" aria-label="Мессенджер"><label><input type="radio" name="messenger" value="Telegram" checked><span><i class="ph-fill ph-telegram-logo"></i>Telegram</span></label><label><input type="radio" name="messenger" value="WhatsApp"><span><i class="ph-fill ph-whatsapp-logo"></i>WhatsApp</span></label></div>'+
   '<label>Email <small>необязательно</small><input name="email" type="email" inputmode="email" autocomplete="email" value="'+esc(saved.email||'')+'"></label>'+
   '<label>Примерное время заезда<input name="arrival" type="text" inputmode="numeric" autocomplete="off" placeholder="14:00" value="14:00" maxlength="12"><small class="bk-hint" id="arrHint" hidden><i class="ph-fill ph-clock"></i>Стандартный заезд с 14:00. Постараемся подготовить апартамент раньше, если будет возможность — уточним до заселения.</small></label>'+
   '<label>Комментарий <small>необязательно</small><textarea name="comment" rows="2" placeholder="Пожелания, вопросы"></textarea></label>'+
   '<input name="website" class="bk-hp" tabindex="-1" autocomplete="off" aria-hidden="true">'+
   '<label class="bk-agree"><input type="checkbox" name="agree" required><span>Согласен с <a href="docs/oferta.pdf" target="_blank" rel="noopener">договором оферты</a></span></label>'+
   '<div class="bk-err" role="alert" hidden></div>'+
   '<button class="btn btn-primary w100 bk-go" type="submit"><span>'+(API?NV_T('Забронировать'):NV_T('Отправить заявку'))+'</span></button>'+
   '<p class="bk-note"><i class="ph-fill ph-lightning"></i>'+(API?NV_T('Мгновенное подтверждение. Оплата — любым удобным способом, детали пришлём в мессенджер.'):NV_T('Подтвердим в течение 15 минут в выбранном мессенджере. Оплата — после подтверждения.'))+'</p>'+
  '</form>';
  var f=sheet.querySelector('form'),err=f.querySelector('.bk-err'),go=f.querySelector('.bk-go');
  var bkReg=f.querySelector('#bkReg');if(bkReg)bkReg.addEventListener('click',function(){if(window.NV_openReg)window.NV_openReg()});
  var onG=function(){document.removeEventListener('nv:guest',onG);if(sheet.classList.contains('on'))openForm(apt,price,ci,co,guests,title)};document.addEventListener('nv:guest',onG);
  var arrI=f.querySelector('[name=arrival]'),arrH=f.querySelector('#arrHint');function arrChk(){var m=(arrI.value||'').match(/(\d{1,2})(?:[:.\s]?(\d{2}))?/);var early=m&&+m[1]<14&&+m[1]>=5;arrH.hidden=!early}arrI.addEventListener('input',arrChk);arrI.addEventListener('blur',function(){if(!arrI.value.trim())arrI.value='14:00';arrChk()});
  f.addEventListener('submit',function(ev){ev.preventDefault();err.hidden=true;
    var fd=new FormData(f),d={title:title,apt:apt,checkin:ci,checkout:co,guests:guests,total:'$'+tot,gtoken:(window.NV_GUEST&&window.NV_GUEST.token)||'',lang:document.documentElement.lang||'ru',name:fd.get('name'),phone:fd.get('phone'),messenger:fd.get('messenger'),email:fd.get('email'),arrival:(fd.get('arrival')||'14:00').trim()||'14:00',comment:fd.get('comment'),website:fd.get('website'),agree:!!fd.get('agree')};
    var bad=!d.name||d.name.trim().length<2?'name':!/^\+?[\d\s()-]{7,20}$/.test(d.phone||'')?'phone':d.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)?'email':!d.agree?'agree':'';
    if(bad){var el=f.elements[bad];el.focus();err.textContent={name:NV_T('Укажите имя'),phone:NV_T('Проверьте номер телефона'),email:NV_T('Проверьте email'),agree:NV_T('Подтвердите согласие с офертой')}[bad];err.hidden=false;return}
    try{localStorage.setItem('nvGuestContact',JSON.stringify({name:d.name,phone:d.phone,email:d.email}))}catch(e){}
    go.disabled=true;go.classList.add('busy');go.querySelector('span').textContent=NV_T('Отправляем…');
    if(!API){busyFor(apt).then(function(list){var m={};list.forEach(function(x){m[x]=1});window.NV_BUSY=m;var t=new Date(ci);for(;t<new Date(co);t.setDate(t.getDate()+1)){if(m[t.toISOString().slice(0,10)]){var er=new Error('taken');er.code='dates_taken';throw er}}
      var msg=NV_T('Здравствуйте! Хочу забронировать ')+title+'\n'+fmt(ci)+' → '+fmt(co)+' ('+n+' '+word(n)+NV_T('), гостей: ')+guests+'\nИтого: $'+tot+'\nЗаезд примерно в '+d.arrival+'\nИмя: '+d.name+'\nТелефон: '+d.phone+(d.email?'\nEmail: '+d.email:'')+(d.comment?'\nКомментарий: '+d.comment:'');
      var wa='https://wa.me/998900115074?text='+encodeURIComponent(msg),tgl='https://t.me/novahome_uzb';
      if(navigator.clipboard)navigator.clipboard.writeText(msg).catch(function(){});
      if(typeof gtag==='function')gtag('event','booking_request',{apt:apt,value:tot,currency:'USD',method:d.messenger});
      f.innerHTML='<button type="button" class="bk-x" aria-label="Закрыть"><i class="ph-bold ph-x"></i></button><div class="bk-ok"><i class="ph-fill ph-check-circle"></i><h3>Даты свободны</h3><p>Остался один шаг — отправьте заявку нам в '+esc(d.messenger)+NV_T('. Текст уже готов')+(d.messenger==='Telegram'?NV_T(' и скопирован — просто вставьте его в чат'):'')+'.</p><div class="bk-sum sm"><div><small>'+fmt(ci)+' → '+fmt(co)+'</small><b>'+esc(title)+'</b></div><div class="bk-tot"><small>Итого</small><b>$'+tot+'</b></div></div><a class="btn btn-primary w100" href="'+(d.messenger==='WhatsApp'?wa:tgl)+'" target="_blank" rel="noopener"><i class="ph-fill ph-'+(d.messenger==='WhatsApp'?'whatsapp':'telegram')+'-logo"></i>Отправить в '+esc(d.messenger)+'</a></div>';
    }).catch(function(e){go.disabled=false;go.classList.remove('busy');go.querySelector('span').textContent=NV_T('Отправить заявку');err.textContent=e.code==='dates_taken'?NV_T('Эти даты только что заняли. Выберите другие — календарь обновлён.'):NV_T('Не удалось проверить даты. Напишите нам в Telegram — забронируем вручную.');err.hidden=false;if(window.NV_CAL)window.NV_CAL.refresh()});return}
    j('/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){
      if(typeof gtag==='function')gtag('event','booking_request',{apt:apt,value:tot,currency:'USD'});
      var rec={id:r.id,tk:r.tk,apt:apt,title:title,from:ci,to:co,nights:n,guests:guests,total:'$'+tot,name:d.name,status:r.instant?'confirmed':'new',created:new Date().toISOString()};
      try{var L=JSON.parse(localStorage.getItem('nvBookings')||'[]');L.unshift(rec);localStorage.setItem('nvBookings',JSON.stringify(L.slice(0,20)))}catch(_){}
      var page='bron.html?id='+r.id+'&t='+r.tk,bot='https://t.me/'+(r.bot||'novahome_bookings_bot')+'?start='+r.id+'_'+r.tk;
      f.innerHTML='<button type="button" class="bk-x" aria-label="Закрыть"><i class="ph-bold ph-x"></i></button><div class="bk-ok"><i class="ph-fill ph-check-circle"></i><h3>'+(r.instant?NV_T('Бронь подтверждена'):NV_T('Заявка отправлена'))+'</h3><p>Номер брони <b>'+esc(r.id)+'</b>. Получите подтверждение в Telegram — там же менеджер пришлёт детали оплаты и инструкцию по заселению.</p><div class="bk-sum sm"><div><small>'+fmt(ci)+' → '+fmt(co)+'</small><b>'+esc(title)+'</b></div><div class="bk-tot"><small>Итого</small><b>$'+tot+'</b></div></div>'+(r.prepay?'<div class="bk-pay"><div class="bk-pay-h"><div><small>Предоплата за '+r.prepay.nights+' '+word(r.prepay.nights)+'</small><b>'+r.prepay.uzs.toLocaleString('ru-RU')+' сум <span>≈ $'+r.prepay.usd+'</span></b></div><div class="bk-pay-logos"><i class="ph-fill ph-apple-logo" title="Apple Pay"></i><i class="ph-fill ph-google-logo" title="Google Pay"></i><span>Humo · Uzcard · Visa · MC</span></div></div><button type="button" class="btn btn-primary w100 bk-paygo" id="bkPay"><i class="ph-bold ph-lock-simple"></i><span>Оплатить онлайн</span></button><p class="bk-note"><i class="ph-fill ph-shield-check"></i>Остаток — при заселении. Безопасная оплата через Octo, данные карты мы не видим.</p></div>':'')+'<a class="btn '+(r.prepay?'btn-ghost':'btn-primary')+' w100" href="'+bot+'" target="_blank" rel="noopener"><i class="ph-fill ph-telegram-logo"></i>Получить подтверждение в Telegram</a><div class="bk-row2"><a class="btn btn-ghost" href="'+page+'"><i class="ph-bold ph-receipt"></i>Страница брони</a><button type="button" class="btn btn-ghost" id="bkIcs"><i class="ph-bold ph-calendar-plus"></i>В календарь</button></div><p class="bk-note"><i class="ph-fill ph-bookmark-simple"></i>Бронь сохранена на этом устройстве — её всегда можно открыть по ссылке «Страница брони».</p></div>';
      f.querySelector('#bkIcs').addEventListener('click',function(){window.NV_ICS(rec)});
      var pb=f.querySelector('#bkPay');if(pb)pb.addEventListener('click',function(){window.NV_PAY(r.id,r.tk,pb)});
      var pb=f.querySelector('#bkPay');if(pb)pb.addEventListener('click',function(){window.NV_PAY(r.id,r.tk,pb)});

    }).catch(function(e){go.disabled=false;go.classList.remove('busy');go.querySelector('span').textContent=API?NV_T('Забронировать'):NV_T('Отправить заявку');
      err.textContent=e.code==='dates_taken'?NV_T('Эти даты только что заняли. Выберите другие — календарь обновлён.'):e.name==='AbortError'?NV_T('Сервер отвечает слишком долго. Попробуйте ещё раз или напишите нам в Telegram.'):(e.message&&e.status<500?e.message:NV_T('Не получилось отправить. Напишите нам в Telegram — забронируем вручную.'));err.hidden=false;
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
  var q=new URLSearchParams(location.search);if(q.get('checkin'))fi.value=q.get('checkin');if(q.get('checkout'))ti.value=q.get('checkout');
  
  sb.addEventListener('submit',function(ev){ev.preventDefault();var a=fi.value,b=ti.value,g=+gi.value||1;
    if(!a||!b||b<=a){if(window.NV_QB){window.NV_QB.open({from:a,to:'',guests:g});return}out.textContent=NV_T('Выберите даты заезда и выезда');out.className='nvs-msg warn';return}
    if(!grid){location.href='booking.html?checkin='+a+'&checkout='+b+'&guests='+g+'#apts';return}
    /* index: no catalog here → open catalog with dates */
    if(!grid){location.href='booking.html?checkin='+a+'&checkout='+b+'&guests='+g+'#apts';return}
    out.textContent=NV_T('Ищем свободные апартаменты…');out.className='nvs-msg';sb.classList.add('busy');
    j('/availability?from='+a+'&to='+b).then(function(d){sb.classList.remove('busy');
      var cards=grid?grid.querySelectorAll('.cat-card'):[],free=0,n=d.nights;
      var busyN=0;
      cards.forEach(function(c){var id=(c.getAttribute('href').match(/apartment-(\d+)/)||[])[1],r=d.apts[id],small=+c.dataset.guests<g,ok=r&&r.free!==false&&!small;
        c.classList.toggle('na',!ok);c.classList.toggle('na-small',!ok&&small&&r&&r.free!==false);
        ['.nvs-tot','.av-badge','.av-cta'].forEach(function(s){var o=c.querySelector(s);if(o)o.remove()});
        c.href='apartment-'+id+'.html?checkin='+a+'&checkout='+b+'&guests='+g;
        var bd=c.querySelector('.bd'),im=c.querySelector('.im'),badge=document.createElement('span');badge.className='av-badge';
        if(ok){free++;badge.innerHTML='<i class="ph-fill ph-check-circle"></i>Свободно';im.appendChild(badge);
          var p=+c.dataset.price,el=document.createElement('div');el.className='nvs-tot';el.innerHTML='<span>'+n+' '+word(n)+' · '+fmt(a)+' → '+fmt(b)+'</span><b>$'+total(p,n)+'</b>';bd.appendChild(el);
          var cta=document.createElement('span');cta.className='btn btn-primary w100 av-cta';cta.innerHTML='Забронировать <i class="ph-bold ph-arrow-right"></i>';bd.appendChild(cta)}
        else{busyN++;badge.innerHTML=small?'<i class="ph-bold ph-users"></i>До '+c.dataset.guests+NV_T(' гостей'):'<i class="ph-bold ph-x"></i>Занято';im.appendChild(badge)}});
      out.innerHTML=free?('<b>Свободно '+free+NV_T(' из ')+cards.length+'</b> · '+fmt(a)+' → '+fmt(b)+' · '+g+' '+(g===1?NV_T('гость'):g<5?NV_T('гостя'):NV_T('гостей'))):'<b>На эти даты всё занято.</b> Попробуйте соседние даты или напишите нам.';out.className='nvs-msg '+(free?'ok':'warn');
      if(grid){grid.classList.add('searched');var sep=grid.querySelector('.av-sep');if(!sep){sep=document.createElement('div');sep.className='av-sep';grid.appendChild(sep)}sep.innerHTML=busyN?'<span>Недоступно на эти даты · '+busyN+'</span>':'';sep.style.display=busyN&&free?'':'none';
        var pill=document.getElementById('avPill');if(!pill){pill=document.createElement('button');pill.type='button';pill.id='avPill';pill.className='av-pill';pill.setAttribute('data-qb','');document.body.appendChild(pill)}
        pill.innerHTML='<span class="av-go"><i class="ph-fill ph-calendar-check"></i><span><b>'+(free?NV_T('Свободно ')+free+NV_T(' · к списку'):NV_T('Всё занято'))+'</b><small>'+fmt(a)+' → '+fmt(b)+' · '+g+' гост.</small></span></span><em data-qb>Изменить</em>';pill.removeAttribute('data-qb');pill.classList.add('on');pill.onclick=function(ev){if(ev.target.closest('[data-qb]'))return;var f=grid.querySelector('.cat-card:not(.na)')||grid;scrollTo({top:f.getBoundingClientRect().top+scrollY-84,behavior:'smooth'})}}
      var tgt=document.getElementById('catCount')||document.getElementById('apts');var first=grid&&grid.querySelector('.cat-card:not(.na)');var goTo=function(){var el=(matchMedia('(max-width:760px)').matches&&first)?first:tgt;if(!el)return;var top=el.getBoundingClientRect().top+scrollY-(matchMedia('(max-width:760px)').matches?84:100);scrollTo({top:top,behavior:'smooth'})};requestAnimationFrame(function(){setTimeout(goTo,60)});setTimeout(goTo,450);
      var cc=document.getElementById('catCount');if(cc)cc.innerHTML=free?'<b>'+free+'</b> свободно на выбранные даты · <a href="#" class="av-reset">сбросить</a>':'Нет свободных на эти даты · <a href="#" class="av-reset">сбросить</a>';
    }).catch(function(){sb.classList.remove('busy');out.textContent=NV_T('Не удалось проверить наличие. Напишите нам в Telegram — ответим за пару минут.');out.className='nvs-msg warn'});
  });
  document.addEventListener('click',function(ev){var r=ev.target.closest('.av-reset');if(!r)return;ev.preventDefault();fi.value='';ti.value='';document.querySelectorAll('.hs-v').forEach(function(x){x.textContent=NV_T('Выберите');x.classList.add('ph')});grid.classList.remove('searched');grid.querySelectorAll('.cat-card').forEach(function(c){c.classList.remove('na','na-small');['.nvs-tot','.av-badge','.av-cta'].forEach(function(s){var o=c.querySelector(s);if(o)o.remove()});c.href=c.href.split('?')[0]});var sep=grid.querySelector('.av-sep');if(sep)sep.remove();var pill=document.getElementById('avPill');if(pill)pill.classList.remove('on');out.textContent='';var cc=document.getElementById('catCount');if(cc)cc.textContent=NV_T('Показано ')+grid.querySelectorAll('.cat-card').length+NV_T(' из ')+grid.querySelectorAll('.cat-card').length;history.replaceState(null,'',location.pathname+'#apts')});
  if(fi.value&&ti.value)sb.requestSubmit?sb.requestSubmit():sb.dispatchEvent(new Event('submit'));
}
/* prefill apartment page dates from ?checkin&checkout */
if(pc&&window.NV_CAL){var qq=new URLSearchParams(location.search);if(qq.get('checkin')&&qq.get('checkout'))window.NV_CAL.set(qq.get('checkin'),qq.get('checkout'),qq.get('guests'))}
})();