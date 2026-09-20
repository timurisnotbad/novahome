/* Nova Home — site.js */
(function(){
var nav=document.getElementById('nav'),bt=document.getElementById('burger'),mn=document.getElementById('mnav');
if(nav){function onS(){nav.classList.toggle('glass',scrollY>40)}addEventListener('scroll',onS,{passive:true});onS()}
if(bt&&mn){bt.addEventListener('click',function(){var o=!mn.classList.contains('open');mn.classList.toggle('open',o);bt.setAttribute('aria-expanded',o);bt.firstElementChild.className=o?'ph-bold ph-x':'ph-bold ph-list';if(o){mn.removeAttribute('inert');mn.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}else{mn.setAttribute('inert','');mn.setAttribute('aria-hidden','true');document.body.style.overflow=''}});
mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){bt.click()})});
addEventListener('keydown',function(e){if(e.key==='Escape'&&mn.classList.contains('open'))bt.click()})}
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var els=document.querySelectorAll('.reveal');
if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')})}
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -6% 0px'});els.forEach(function(e){io.observe(e)})}
var cnts=document.querySelectorAll('.cnt');
if('IntersectionObserver' in window&&!reduce){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,to=+el.dataset.to,t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/2000);p=1-Math.pow(1-p,3);el.textContent=Math.round(to*p);if(p<1)requestAnimationFrame(f)})(t0)})},{threshold:.4});cnts.forEach(function(c){co.observe(c)})}else{cnts.forEach(function(c){c.textContent=c.dataset.to})}
var fl=document.querySelectorAll('#facList li'),fi=document.querySelectorAll('#facImg img');function facSel(i){fl.forEach(function(x,k){x.classList.toggle('on',k===i)});fi.forEach(function(x,k){x.classList.toggle('on',k===i)})}fl.forEach(function(li,i){li.addEventListener('mouseenter',function(){facSel(i)});li.addEventListener('click',function(){facSel(i)});li.addEventListener('focus',function(){facSel(i)});li.setAttribute('tabindex','0')});
var ds=document.querySelectorAll('details.svc');
var easeOut=function(t){return 1-Math.pow(1-t,3)};var easeIO=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
function animH(d,a,from,to,dur,onEnd){if(d.__raf)cancelAnimationFrame(d.__raf);var t0=performance.now(),opening=to>from,ez=opening?easeOut:easeIO;a.style.overflow='hidden';a.style.height=from+'px';a.style.opacity=opening?'0':'1';
var step=function(now){var p=Math.min(1,(now-t0)/dur),e=ez(p);a.style.height=(from+(to-from)*e)+'px';a.style.opacity=opening?String(Math.min(1,e*1.4)):String(Math.max(0,1-e*1.6));if(p<1){d.__raf=requestAnimationFrame(step)}else{d.__raf=0;if(opening){a.style.cssText=''}else{a.style.height='0px';a.style.opacity='0'}onEnd&&onEnd()}};d.__raf=requestAnimationFrame(step)}
function closeD(d){var a=d.querySelector('.svc-a');if(!a||!d.open||d.__closing)return;d.__closing=true;d.classList.add('closing');animH(d,a,a.getBoundingClientRect().height,0,300,function(){d.open=false;d.__closing=false;d.classList.remove('closing');requestAnimationFrame(function(){a.style.cssText=''})})}
function openD(d){var a=d.querySelector('.svc-a');if(!a)return;var from=d.open?a.getBoundingClientRect().height:0;d.__closing=false;d.classList.remove('closing');d.open=true;a.style.cssText='';var to=a.scrollHeight;animH(d,a,from,to,340)}
ds.forEach(function(d){var s=d.querySelector('summary');if(!s)return;s.addEventListener('click',function(e){e.preventDefault();if(reduce){var o=!d.open;ds.forEach(function(x){x.open=false});d.open=o;return}if(d.open&&!d.__closing){closeD(d)}else{ds.forEach(function(x){if(x!==d&&x.open)closeD(x)});openD(d)}})});
document.addEventListener('click',function(e){var a=e.target.closest('a[href*="#book"],a.btn-primary');if(a&&typeof gtag==='function')gtag('event','book_click',{event_category:'booking',event_label:a.dataset.apt||location.pathname})},true);
/* mobile: tabbar, chips, search pill */
var tb=document.querySelector('.tabbar');if(tb){var pg=location.pathname.split('/').pop()||'index.html';tb.querySelectorAll('a').forEach(function(a){var hr=a.getAttribute('href');a.classList.toggle('on',hr===pg)});var tm=document.getElementById('tabMenu');if(tm&&bt)tm.addEventListener('click',function(){bt.click()})}
var chips=document.querySelectorAll('.chip');chips.forEach(function(c){c.addEventListener('click',function(){chips.forEach(function(x){x.classList.remove('on')});c.classList.add('on');var f=c.dataset.f;document.querySelectorAll('.mrow:not(.small) .mcard').forEach(function(k){var ok=f==='all'||k.dataset.type===f||(k.dataset.tags||'').split(' ').indexOf(f)>-1;k.style.display=ok?'':'none'})})});
var ms=document.querySelector('.msearch');if(ms)ms.addEventListener('click',function(){var t=document.getElementById('book');if(t)scrollTo({top:t.getBoundingClientRect().top+scrollY-80,behavior:'smooth'});else location.href='booking.html#book'});
/* mobile dock drawer */
var dk=document.getElementById('mdock');if(dk){var dt=document.getElementById('mdockTab'),dx=document.getElementById('mdockX');var sc=document.createElement('div');sc.className='mdock-scrim';dk.parentNode.insertBefore(sc,dk.nextSibling);
function dOpen(){dk.classList.add('open');sc.classList.add('on');dt.setAttribute('aria-expanded','true');dk.setAttribute('aria-hidden','false')}function dClose(){dk.classList.remove('open');sc.classList.remove('on');dt.setAttribute('aria-expanded','false');dk.setAttribute('aria-hidden','true')}
dt.addEventListener('click',dOpen);dx.addEventListener('click',dClose);sc.addEventListener('click',dClose);addEventListener('keydown',function(e){if(e.key==='Escape')dClose()});
var ly=scrollY;addEventListener('scroll',function(){if(Math.abs(scrollY-ly)>60&&dk.classList.contains('open'))dClose();ly=scrollY},{passive:true});
dk.querySelectorAll('.mdock-panel a').forEach(function(a){a.addEventListener('click',function(){setTimeout(dClose,200)})});
var hideNear=function(){var t=document.querySelector('.pc, #book');if(!t)return;var r=t.getBoundingClientRect();var over=r.top<innerHeight*.8&&r.bottom>0;dk.style.opacity=over?'0':'1';dk.style.pointerEvents=over?'none':''};addEventListener('scroll',hideNear,{passive:true});hideNear()}
/* mobile: nest more + review dots */
var nm=document.getElementById('nestMore');if(nm)nm.addEventListener('click',function(){var w=nm.closest('.dark-grid>div');var o=w.classList.toggle('more-on');nm.firstChild.nodeValue=o?'Свернуть ':'Подробнее '});
var rg=document.querySelector('.rev-grid'),rd=document.getElementById('revDots');if(rg&&rd){var cards=rg.querySelectorAll('.review');cards.forEach(function(_,i){var s=document.createElement('span');if(!i)s.className='on';rd.appendChild(s)});var upd=function(){var i=Math.round(rg.scrollLeft/(cards[0].offsetWidth+12));rd.querySelectorAll('span').forEach(function(s,k){s.classList.toggle('on',k===i)})};rg.addEventListener('scroll',upd,{passive:true})}
/* inner hero slideshow */
var hsEl=document.querySelector('.hero-show');if(hsEl){var hsImgs=hsEl.querySelectorAll('.media'),hsDots=hsEl.querySelectorAll('.hs-dots button'),hsCap=document.getElementById('hsCap'),hsI=[].findIndex.call(hsImgs,function(x){return x.classList.contains('on')}),hsT;
var hsGo=function(i){hsI=(i+hsImgs.length)%hsImgs.length;hsImgs.forEach(function(x,k){x.classList.toggle('on',k===hsI)});hsDots.forEach(function(x,k){x.classList.toggle('on',k===hsI)});if(hsCap){hsCap.style.opacity='0';setTimeout(function(){hsCap.textContent=hsImgs[hsI].dataset.cap;hsCap.style.opacity='1'},300)}};
var hsArm=function(){clearInterval(hsT);if(!reduce)hsT=setInterval(function(){hsGo(hsI+1)},+hsEl.dataset.auto||4200)};
hsDots.forEach(function(b,k){b.addEventListener('click',function(){hsGo(k);hsArm()})});var hp=hsEl.querySelector('.hs-p'),hn=hsEl.querySelector('.hs-n');if(hp)hp.addEventListener('click',function(){hsGo(hsI-1);hsArm()});if(hn)hn.addEventListener('click',function(){hsGo(hsI+1);hsArm()});
hsEl.addEventListener('mouseenter',function(){clearInterval(hsT)});hsEl.addEventListener('mouseleave',hsArm);var tx0=0;hsEl.addEventListener('touchstart',function(e){tx0=e.touches[0].clientX},{passive:true});hsEl.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx0;if(Math.abs(d)>40){hsGo(hsI+(d<0?1:-1));hsArm()}});
document.addEventListener('visibilitychange',function(){document.hidden?clearInterval(hsT):hsArm()});hsArm()}
/* lang dropdown */
var ld=document.getElementById('langdd');if(ld){var lb=ld.querySelector('.langdd-btn'),lp=ld.querySelector('.langdd-panel');lb.addEventListener('click',function(e){e.stopPropagation();var o=!lp.classList.contains('open');lp.classList.toggle('open',o);lb.setAttribute('aria-expanded',o)});document.addEventListener('click',function(){lp.classList.remove('open');lb.setAttribute('aria-expanded','false')});
lp.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){document.getElementById('langddCur').textContent=b.dataset.short})})}
/* floating chat + mobile cta */
var fc=document.querySelector('.fchat'),mc=document.querySelector('.mcta');
function scrollUI(){var y=scrollY;if(fc)fc.classList.toggle('on',y>420);if(mc){var hide=document.querySelector('.pc, #book');var h2=hide&&hide.getBoundingClientRect();var over=h2&&h2.top<innerHeight&&h2.bottom>0;mc.classList.toggle('on',y>360&&!over)}}
addEventListener('scroll',scrollUI,{passive:true});scrollUI();
/* lightbox */
var gal=document.querySelector('.gal');if(gal){var imgs=[].slice.call(gal.querySelectorAll('img'));if(imgs.length){var lbx=document.createElement('div');lbx.className='lb';lbx.innerHTML='<button class="x" aria-label="Закрыть"><i class="ph-bold ph-x"></i></button><button class="p" aria-label="Назад"><i class="ph-bold ph-caret-left"></i></button><img alt=""><button class="n" aria-label="Вперёд"><i class="ph-bold ph-caret-right"></i></button><div class="c"></div>';document.body.appendChild(lbx);var cur=0,im=lbx.querySelector('img');function show(i){cur=(i+imgs.length)%imgs.length;im.src=imgs[cur].src;im.alt=imgs[cur].alt;lbx.querySelector('.c').textContent=(cur+1)+' / '+imgs.length}function open(i){show(i);lbx.classList.add('on');document.body.style.overflow='hidden'}function close(){lbx.classList.remove('on');document.body.style.overflow=''}
imgs.forEach(function(x,i){x.closest('.g').classList.add('slot-real');x.closest('.g').addEventListener('click',function(){open(i)})});var all=gal.querySelector('.all');if(all)all.addEventListener('click',function(e){e.stopPropagation();open(0)});
lbx.querySelector('.x').addEventListener('click',close);lbx.querySelector('.p').addEventListener('click',function(){show(cur-1)});lbx.querySelector('.n').addEventListener('click',function(){show(cur+1)});lbx.addEventListener('click',function(e){if(e.target===lbx)close()});addEventListener('keydown',function(e){if(!lbx.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
var tx=0;lbx.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});lbx.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(cur+(d<0?1:-1))})}}
/* hero intro */
var intro=document.getElementById('intro');if(intro){var on=document.body.classList.contains('intro-on');var mob=matchMedia('(max-width:760px)').matches;
if(!on||reduce){intro.remove();document.body.classList.remove('intro-on')}else{
var done=false,t0=performance.now();
var fin=function(){if(done)return;done=true;var wait=Math.max(0,1100-(performance.now()-t0));setTimeout(function(){intro.classList.add('out');document.body.classList.remove('intro-on');document.body.classList.add('intro-go');setTimeout(function(){intro.remove()},1000)},wait+250)};
var hero=document.querySelector('.hero-photo img.media');var ready=[document.fonts?document.fonts.ready:Promise.resolve()];if(hero&&!hero.complete)ready.push(new Promise(function(r){hero.addEventListener('load',r,{once:true});hero.addEventListener('error',r,{once:true})}));
Promise.all(ready).then(fin);if(document.readyState==='complete')fin();else addEventListener('load',fin);setTimeout(fin,3500)}
/* hero video: desktop only, after load, fades back to photo at end */
var hv=document.getElementById('heroVid'),hi=document.querySelector('.hero-bg img.media');
if(hv&&!reduce&&matchMedia('(min-width:981px)').matches&&!(navigator.connection&&navigator.connection.saveData)){var startV=function(){hv.src='assets/hero.mp4';hv.load();hv.addEventListener('canplay',function(){hv.play().then(function(){hv.classList.add('on')}).catch(function(){})},{once:true});hv.loop=true;};setTimeout(startV,on?2600:400)}
var hp=document.querySelector('.hero-bg');if(hp&&!reduce&&matchMedia('(pointer:fine)').matches){addEventListener('scroll',function(){var y=Math.min(scrollY,600);hp.style.transform='translateY('+(y*.18)+'px) scale('+(1+y/6000)+')'},{passive:true})}}
})();
/* apartment page: calendar + calc + share */
(function(){

(function(){
var pc=document.querySelector('.pc');if(!pc)return;var P=+pc.dataset.price,APT=pc.dataset.apt,ci=document.getElementById('ci'),co=document.getElementById('co'),bk=document.getElementById('bookBtn');
var dr=document.getElementById('dr'),btn=document.getElementById('drBtn'),cg=document.getElementById('cg'),cm=document.getElementById('cm'),cfT=document.getElementById('cfT');
var M=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],MN=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
var iso=function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
var today=new Date();today.setHours(0,0,0,0);
var s=new Date(today);s.setDate(s.getDate()+1);var e=new Date(s);e.setDate(e.getDate()+2);
var view=new Date(s.getFullYear(),s.getMonth(),1),mode='in',hov=null; // mode: 'in' = editing check-in, 'out' = editing check-out
var ciBox=btn.children[0],coBox=btn.children[2];
function fmt(d){return d?d.getDate()+' '+M[d.getMonth()]:'—'}
function word(n){var m=n%10,h=n%100;if(h>=11&&h<=14)return 'ночей';if(m===1)return 'ночь';if(m>=2&&m<=4)return 'ночи';return 'ночей'}
function labels(){document.getElementById('ciL').textContent=fmt(s);var l=document.getElementById('coL');l.textContent=e?fmt(e):'Выберите';l.classList.toggle('ph',!e);ciBox.classList.toggle('act',mode==='in');coBox.classList.toggle('act',mode==='out');cfT.textContent=mode==='in'?'Выберите дату заезда':(!e?'Теперь дату выезда':Math.round((e-s)/864e5)+' '+word(Math.round((e-s)/864e5)))}
function render(){cm.textContent=MN[view.getMonth()]+' '+view.getFullYear();document.getElementById('cp').disabled=view<=new Date(today.getFullYear(),today.getMonth(),1);
var first=new Date(view),off=(first.getDay()+6)%7,days=new Date(view.getFullYear(),view.getMonth()+1,0).getDate(),h='';
for(var i=0;i<off;i++)h+='<button type="button" class="out" tabindex="-1" disabled></button>';
var rs=s,re=e||(mode==='out'&&hov&&hov>s?hov:null);
for(var d=1;d<=days;d++){var dt=new Date(view.getFullYear(),view.getMonth(),d),c=[];var dis=dt<today||(mode==='out'&&s&&dt<=s);
if(rs&&iso(dt)===iso(rs))c.push('s');if(re&&iso(dt)===iso(re))c.push('e');if(rs&&re&&dt>rs&&dt<re)c.push('in');if(iso(dt)===iso(today))c.push('today');
h+='<button type="button" data-d="'+iso(dt)+'" class="'+c.join(' ')+'"'+(dis?' disabled':'')+'><span>'+d+'</span></button>'}
cg.innerHTML=h}
cg.addEventListener('click',function(ev){var b=ev.target.closest('button[data-d]');if(!b||b.disabled)return;ev.stopPropagation();var d=new Date(b.dataset.d+'T00:00:00');
if(mode==='in'){s=d;if(!e||e<=s){e=null;mode='out'}else{mode='out'}}else{if(d<=s){s=d;e=null;mode='out'}else{e=d;mode='in';labels();render();calc();setTimeout(close,220);return}}
labels();render();calc()});
cg.addEventListener('mouseover',function(ev){var b=ev.target.closest('button[data-d]');if(!b||mode!=='out'||e)return;hov=new Date(b.dataset.d+'T00:00:00');render()});
cg.addEventListener('mouseleave',function(){if(hov){hov=null;render()}});
document.getElementById('cp').addEventListener('click',function(ev){ev.stopPropagation();view.setMonth(view.getMonth()-1);render()});
document.getElementById('cn').addEventListener('click',function(ev){ev.stopPropagation();view.setMonth(view.getMonth()+1);render()});
document.getElementById('cClr').addEventListener('click',function(ev){ev.stopPropagation();var t=new Date(today);t.setDate(t.getDate()+1);s=t;e=null;mode='out';view=new Date(s.getFullYear(),s.getMonth(),1);labels();render()});
function open(m){mode=m||'in';dr.classList.add('open');btn.setAttribute('aria-expanded','true');var ref=(mode==='out'&&e)?e:s;view=new Date(ref.getFullYear(),ref.getMonth(),1);labels();render()}
function close(){if(!dr.classList.contains('open'))return;dr.classList.remove('open');btn.setAttribute('aria-expanded','false');hov=null;if(!e){e=new Date(s);e.setDate(e.getDate()+1)}mode='in';labels();render();calc()}
ciBox.addEventListener('click',function(ev){ev.stopPropagation();dr.classList.contains('open')&&mode==='in'?close():open('in')});
coBox.addEventListener('click',function(ev){ev.stopPropagation();dr.classList.contains('open')&&mode==='out'?close():open('out')});
btn.addEventListener('click',function(ev){if(ev.target===btn||ev.target.classList.contains('ar')){dr.classList.contains('open')?close():open('in')}});
document.getElementById('cal').addEventListener('click',function(ev){ev.stopPropagation()});
document.addEventListener('click',function(ev){if(!dr.contains(ev.target))close()});
addEventListener('keydown',function(ev){if(ev.key==='Escape')close()});
function calc(){if(!s||!e)return;var n=Math.round((e-s)/864e5);ci.value=iso(s);co.value=iso(e);
var sub=P*n,dis=n>=7?Math.round(sub*.05):0,tot=sub-dis;
document.getElementById('n').textContent=n;document.getElementById('nw').textContent=word(n);document.getElementById('sub').textContent='$'+sub;
var drw=document.getElementById('disRow');drw.hidden=!dis;document.getElementById('dis').textContent='−$'+dis;
var el=document.getElementById('tot'),from=+el.textContent.replace(/\D/g,'')||tot,t0=performance.now();(function f(ts){var p=Math.min(1,(ts-t0)/420);p=1-Math.pow(1-p,3);el.textContent='$'+Math.round(from+(tot-from)*p);if(p<1)requestAnimationFrame(f)})(t0);
bk.href='booking.html?checkin='+ci.value+'&checkout='+co.value+'&apt='+APT+'#book'}
labels();calc();
var sh=document.getElementById('share');if(sh)sh.addEventListener('click',function(){var d={title:document.title,url:location.href};if(navigator.share){navigator.share(d).catch(function(){})}else{navigator.clipboard&&navigator.clipboard.writeText(location.href);var t=sh.innerHTML;sh.innerHTML='<i class="ph-bold ph-check"></i>Ссылка скопирована';setTimeout(function(){sh.innerHTML=t},1800)}});
})();

})();
/* registration */
(function(){
(function(){
var K='nvGuestProfile';
function get(){try{return JSON.parse(localStorage.getItem(K)||'null')}catch(e){return null}}
var reg=document.getElementById('nvReg'),prof=document.getElementById('nvProfile');if(!reg)return;
function showProfile(p){reg.hidden=true;prof.style.display='flex';prof.querySelector('.av').textContent=(p.name||'?').trim().charAt(0).toUpperCase();prof.querySelector('.nm').textContent=(p.name||'').split(' ')[0]+' · скидка 5%'}
var p=get();
if(p){showProfile(p);return}
function openReg(){reg.hidden=false;requestAnimationFrame(function(){reg.classList.add('on')})}
document.querySelectorAll('.nv-reg-open').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openReg()})});
reg.querySelector('.x').addEventListener('click',function(){reg.classList.remove('on');sessionStorage.setItem('nvRegClosed','1');setTimeout(function(){reg.hidden=true},600)});
reg.querySelector('.go').addEventListener('click',function(){
var go=reg.querySelector('.go'),LBL='Зарегистрироваться −5%';
if(go.disabled)return;
var name=document.getElementById('nvRegName').value.trim().replace(/[<>"'\\]/g,'').slice(0,80),email=document.getElementById('nvRegEmail').value.trim().slice(0,120);
function msg(t,ms){go.textContent=t;setTimeout(function(){go.textContent=LBL;go.disabled=false},ms||2200)}
if(!name||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){msg('Заполните ФИО и email',1800);return}
go.disabled=true;go.textContent='Сохраняем…';
var prof2={name:name,email:email,discount:5,created:Date.now()};
function done(){localStorage.setItem(K,JSON.stringify(prof2));var f=reg.querySelector('.form'),d=document.createElement('div');d.className='done';d.textContent='Готово, '+name.split(' ')[0]+'! Скидка 5% закреплена за профилем '+email+'.';f.replaceChildren(d);
setTimeout(function(){reg.classList.remove('on');setTimeout(function(){reg.hidden=true;showProfile(prof2)},600)},2600)}
var ctl=('AbortController' in window)?new AbortController():null;var tm=ctl&&setTimeout(function(){ctl.abort()},8000);
fetch((window.NV_API_URL||'/api/register.php'),(function(){var u=window.NV_API_URL||'/api/register.php',gs=u.indexOf('script.google.com')>-1;var fp='';try{fp=(localStorage.getItem('nv_fp')||(function(){var s=Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('nv_fp',s);return s})())}catch(e){}var body=JSON.stringify({name:name,email:email,fp:fp,hp:(document.getElementById('nvRegHp')||{}).value||''});return gs?{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:body,redirect:'follow',signal:ctl&&ctl.signal}:{method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'novahome'},body:body,signal:ctl&&ctl.signal}})())
.then(function(r){return r.json().catch(function(){return{}}).then(function(j){return{ok:r.ok,status:r.status,j:j}})})
.then(function(res){clearTimeout(tm);
  if(res.j&&res.j.error){msg(res.j.error,3200);return}
  if(res.ok){if(res.j&&res.j.discount)prof2.discount=res.j.discount;done();return}
  if(res.status===429){msg('Слишком часто. Попробуйте через 10 минут',3200);return}
  msg((res.j&&res.j.error)||'Не удалось сохранить. Напишите нам в Telegram',3200)})
.catch(function(){clearTimeout(tm);msg('Нет связи с сервером. Напишите нам в Telegram',3200)});
});
})();
})();
/* HomeReserve fallback */
(function(){
function arm(sel,ms){var el=document.querySelector(sel);if(!el)return;setTimeout(function(){
  if(el.querySelector('iframe')||Array.prototype.some.call(el.children,function(c){return !c.classList.contains('nv-hr-fb')&&c.getBoundingClientRect().height>24}))return;
  if(el.querySelector('.nv-hr-fb'))return;
  var d=document.createElement('div');d.className='nv-hr-fb';d.setAttribute('role','status');
  d.style.cssText='display:flex;flex-direction:column;gap:14px;align-items:flex-start;padding:22px 20px;border:1px dashed rgba(166,124,78,.45);border-radius:14px;background:#FBF7F0;font:500 15px/1.55 Manrope,sans-serif;color:#5e5547';
  var p=document.createElement('div');p.textContent='Календарь загружается дольше обычного. Напишите нам — подберём даты и подтвердим бронь за пару минут.';
  var row=document.createElement('div');row.style.cssText='display:flex;gap:10px;flex-wrap:wrap';
  function btn(href,txt,primary){var a=document.createElement('a');a.href=href;a.textContent=txt;if(href.indexOf('http')===0){a.target='_blank';a.rel='noopener'}
    a.style.cssText='text-decoration:none;font:700 14px Manrope,sans-serif;padding:12px 20px;border-radius:999px;display:inline-flex;align-items:center;min-height:44px;box-sizing:border-box;'+(primary?'background:linear-gradient(135deg,#FF9D2E,#FB7A1E 52%,#EE5A12);color:#fff':'border:1.5px solid #A67C4E;color:#A67C4E');return a}
  row.appendChild(btn('https://t.me/novahome_uzb','Написать в Telegram',true));row.appendChild(btn('tel:+998900115074','Позвонить',false));
  d.appendChild(p);d.appendChild(row);el.appendChild(d);
  if('MutationObserver' in window){var obs=new MutationObserver(function(){for(var i=0;i<el.children.length;i++){if(!el.children[i].classList.contains('nv-hr-fb')){d.remove();obs.disconnect();return}}});obs.observe(el,{childList:true})}
  try{typeof gtag==='function'&&gtag('event','widget_fail',{event_category:'booking',event_label:sel})}catch(e){}
},ms)}
if(location.protocol!=='file:'){arm('[data-instance-id="search"]',7000);arm('[data-instance-id="list"]',9000)}
})();
