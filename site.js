/* data-bg-loader: lazy backgrounds, light versions on phones / slow networks */
(function(){
var c=navigator.connection||{},slow=c.saveData||/(^|-)2g|3g/.test(c.effectiveType||''),mob=matchMedia('(max-width:760px)').matches;
var useM=mob||slow;
function load(el){var src=(useM&&el.getAttribute('data-bg-m'))||el.getAttribute('data-bg');if(!src)return;el.style.backgroundImage='url("'+src+'")';el.removeAttribute('data-bg');el.removeAttribute('data-bg-m');el.classList.add('bg-in')}
function run(){var els=document.querySelectorAll('[data-bg]');if(!('IntersectionObserver' in window)){els.forEach(load);return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);load(e.target)}})},{rootMargin:(slow?'300px':'900px')+' 0px'});
els.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight*1.2&&r.bottom>-200)load(el);else io.observe(el)});
window.NV_BG=function(root){(root||document).querySelectorAll('[data-bg]').forEach(function(el){io.observe(el)})}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
if(slow)document.documentElement.classList.add('nv-slow');
})();
/* Nova Home — site.js */
(function(){
var nav=document.getElementById('nav'),bt=document.getElementById('burger'),mn=document.getElementById('mnav');
if(nav){function onS(){nav.classList.toggle('glass',scrollY>40)}(function(){var q=false;addEventListener('scroll',function(){if(q)return;q=true;requestAnimationFrame(function(){onS();q=false})},{passive:true})})();onS()}
if(bt&&mn){bt.addEventListener('click',function(){var o=!mn.classList.contains('open');mn.classList.toggle('open',o);document.body.classList.toggle('menu-open',o);bt.setAttribute('aria-expanded',o);bt.firstElementChild.className=o?'ph-bold ph-x':'ph-bold ph-list';if(o){mn.removeAttribute('inert');mn.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}else{mn.setAttribute('inert','');mn.setAttribute('aria-hidden','true');document.body.style.overflow=''}});
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
function closeD(d){if(!d.open||d.__t)return;d.classList.add('closing');d.__t=setTimeout(function(){d.open=false;d.classList.remove('closing');d.__t=0},reduce?0:330)}
function openD(d){if(d.__t){clearTimeout(d.__t);d.__t=0;d.classList.remove('closing')}d.open=true}
ds.forEach(function(d){var s=d.querySelector('summary');if(!s)return;s.addEventListener('click',function(e){e.preventDefault();if(d.open&&!d.classList.contains('closing')){closeD(d)}else{ds.forEach(function(x){if(x!==d)closeD(x)});openD(d)}})});
document.addEventListener('click',function(e){var a=e.target.closest('a[href*="#book"],a.btn-primary');if(a&&typeof gtag==='function')gtag('event','book_click',{event_category:'booking',event_label:a.dataset.apt||location.pathname})},true);
/* mobile: tabbar, chips, search pill */
var tb=document.querySelector('.tabbar');if(tb){var pg=location.pathname.split('/').pop()||'index.html';tb.querySelectorAll('a').forEach(function(a){var hr=a.getAttribute('href');a.classList.toggle('on',hr===pg)});var tm=document.getElementById('tabMenu');if(tm&&bt)tm.addEventListener('click',function(){bt.click()})}
var chips=document.querySelectorAll('.chip');chips.forEach(function(c){c.addEventListener('click',function(){chips.forEach(function(x){x.classList.remove('on')});c.classList.add('on');var f=c.dataset.f;document.querySelectorAll('.mrow:not(.small) .mcard').forEach(function(k){var ok=f==='all'||k.dataset.type===f||(f==='g4'&&+k.dataset.guests>=4)||(k.dataset.tags||'').split(' ').indexOf(f)>-1;k.style.display=ok?'':'none'})})});
var ms=document.querySelector('.msearch');if(ms)ms.addEventListener('click',function(){var hs=document.querySelector('.hs');if(hs&&getComputedStyle(hs).display!=='none'){scrollTo({top:hs.getBoundingClientRect().top+scrollY-90,behavior:'smooth'});var f=hs.querySelector('[name=from]');if(f){f.focus();f.showPicker&&f.showPicker()}return}location.href='booking.html#apts'});
/* mobile dock drawer */
var dk=document.getElementById('mdock');if(dk){var dt=document.getElementById('mdockTab'),dx=document.getElementById('mdockX');if(!dt||!dx)return;var sc=document.createElement('div');sc.className='mdock-scrim';dk.parentNode.insertBefore(sc,dk.nextSibling);
function dOpen(){dk.classList.add('open');sc.classList.add('on');document.body.classList.add('dock-open');dt.setAttribute('aria-expanded','true');dk.setAttribute('aria-hidden','false')}function dClose(){dk.classList.remove('open');sc.classList.remove('on');document.body.classList.remove('dock-open');dt.setAttribute('aria-expanded','false');dk.setAttribute('aria-hidden','true')}
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
document.querySelectorAll('a[data-scroll]').forEach(function(a){a.addEventListener('click',function(e){var t=document.getElementById(a.dataset.scroll);if(!t)return;e.preventDefault();scrollTo({top:t.getBoundingClientRect().top+scrollY-84,behavior:'smooth'})})});
var rm=document.getElementById('revMore');if(rm)rm.addEventListener('click',function(){document.querySelector('.rev-grid').classList.add('all')});
/* catalog filters */
(function(){var grid=document.getElementById('catGrid');if(!grid)return;var cards=Array.prototype.slice.call(grid.querySelectorAll('.cat-card')),cnt=document.getElementById('catCount'),empty=document.getElementById('catEmpty'),sort=document.getElementById('catSort');
var meta=cards.map(function(c){var m=c.querySelector('.m').textContent.match(/(\d+) m/);return{el:c,type:c.dataset.type,guests:+c.dataset.guests,complex:c.dataset.complex,price:+c.dataset.price,floor:+c.dataset.floor,extra:c.dataset.extra.split(','),area:m?+m[1]:0,idx:cards.indexOf(c)}});
cards.forEach(function(c){c.classList.add('in');c.style.removeProperty('--d')});
var st={type:'all',guests:'all',extra:'all',complex:'all'},raf;
function apply(){cancelAnimationFrame(raf);raf=requestAnimationFrame(function(){var v=sort.value,n=0,arr=meta.slice();
if(v==='price')arr.sort(function(a,b){return a.price-b.price});else if(v==='price-d')arr.sort(function(a,b){return b.price-a.price});else if(v==='floor-d')arr.sort(function(a,b){return b.floor-a.floor});else if(v==='area-d')arr.sort(function(a,b){return b.area-a.area});else arr.sort(function(a,b){return a.idx-b.idx});
var frag=document.createDocumentFragment();arr.forEach(function(m){var ok=(st.complex==='all'||m.complex===st.complex)&&(st.type==='all'||m.type===st.type)&&(st.guests==='all'||m.guests>=+st.guests)&&(st.extra==='all'||(st.extra==='high'?m.floor>=10:m.extra.indexOf(st.extra)>-1));m.el.classList.toggle('hide',!ok);if(ok)n++;frag.appendChild(m.el)});grid.appendChild(frag);
cnt.textContent='Показано '+n+' из '+cards.length;empty.hidden=n>0})}
document.querySelectorAll('.cat-group[data-key]').forEach(function(g){var k=g.dataset.key;g.addEventListener('click',function(e){var b=e.target.closest('.fchip');if(!b)return;g.querySelectorAll('.fchip').forEach(function(x){x.classList.remove('on')});b.classList.add('on');st[k]=b.dataset.v;apply()})});
sort.addEventListener('change',apply);
document.getElementById('catReset').addEventListener('click',function(){st={type:'all',guests:'all',extra:'all',complex:'all'};document.querySelectorAll('.cat-group[data-key] .fchip').forEach(function(b){b.classList.toggle('on',b.dataset.v==='all')});sort.value='rec';apply()});
var qs=new URLSearchParams(location.search);['type','complex','guests','extra'].forEach(function(k){var q=qs.get(k);if(!q)return;var b=document.querySelector('.cat-group[data-key="'+k+'"] .fchip[data-v="'+q.replace(/"/g,'')+'"]');if(b)b.click()});
})();
addEventListener('hashchange',function(){if(mn&&mn.classList.contains('open')&&bt)bt.click()});
/* hidden admin entry: 5 fast taps on the footer copyright */
(function(){var el=document.querySelector('footer .copy');if(!el)return;var n=0,t;el.addEventListener('click',function(e){if(e.target.closest('a'))return;n++;clearTimeout(t);t=setTimeout(function(){n=0},1200);if(n>=5){n=0;location.href='admin.html'}})})();
/* lang dropdown */
var ld=document.getElementById('langdd');if(ld){var lb=ld.querySelector('.langdd-btn'),lp=ld.querySelector('.langdd-panel');lb.addEventListener('click',function(e){e.stopPropagation();var o=!lp.classList.contains('open');lp.classList.toggle('open',o);lb.setAttribute('aria-expanded',o)});document.addEventListener('click',function(){lp.classList.remove('open');lb.setAttribute('aria-expanded','false')});
lp.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){document.getElementById('langddCur').textContent=b.dataset.short})})}
/* floating chat + mobile cta */
var fc=document.querySelector('.fchat'),mc=document.querySelector('.mcta');
function scrollUI(){var y=scrollY;if(fc)fc.classList.toggle('on',y>420);if(mc){var hide=document.querySelector('.pc, #book');var h2=hide&&hide.getBoundingClientRect();var over=h2&&h2.top<innerHeight&&h2.bottom>0;mc.classList.toggle('on',y>360&&!over)}}
(function(){var q=false;addEventListener('scroll',function(){if(q)return;q=true;requestAnimationFrame(function(){scrollUI();q=false})},{passive:true})})();scrollUI();
/* mobile gallery: counter */
(function(){var w=document.querySelector('.ap-hero .wrap'),g=w&&w.querySelector('.gal');if(!g)return;var n=g.querySelectorAll('.g').length;if(n<2)return;var c=document.createElement('div');c.className='gal-cnt';c.setAttribute('aria-hidden','true');c.textContent='1 / '+n;g.after(c);var q=0;g.addEventListener('scroll',function(){if(q)return;q=1;requestAnimationFrame(function(){q=0;c.textContent=Math.min(n,Math.round(g.scrollLeft/g.clientWidth)+1)+' / '+n})},{passive:true})})();
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
if(hv&&!reduce&&matchMedia('(min-width:981px)').matches&&!(navigator.connection&&(navigator.connection.saveData||/2g|3g/.test(navigator.connection.effectiveType||'')))){var startV=function(){hv.src='assets/hero.mp4';hv.load();hv.addEventListener('canplay',function(){hv.play().then(function(){hv.classList.add('on')}).catch(function(){})},{once:true});hv.loop=true;};setTimeout(startV,on?2600:400)}
var hp=document.querySelector('.hero-bg');if(hp&&!reduce&&matchMedia('(pointer:fine)').matches){addEventListener('scroll',function(){var y=Math.min(scrollY,600);hp.style.transform='translateY('+(y*.18)+'px) scale('+(1+y/6000)+')'},{passive:true})}}
})();
/* apartment page: calendar + calc + share */
(function(){
(function(){
var pc=document.querySelector('.pc');if(!pc)return;var P=+pc.dataset.price,APT=pc.dataset.apt,ci=document.getElementById('ci'),co=document.getElementById('co'),bk=document.getElementById('bookBtn');
var dr=document.getElementById('dr'),btn=document.getElementById('drBtn'),cg=document.getElementById('cg'),cm=document.getElementById('cm'),cfT=document.getElementById('cfT');
var M=(document.documentElement.lang==='en'&&window.NV_EN_MONTHS_FULL||['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']),MN=(document.documentElement.lang==='en'&&window.NV_EN_MONTHS_FULL||['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']);
var iso=function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
var today=new Date();today.setHours(0,0,0,0);
var s=new Date(today);s.setDate(s.getDate()+1);var e=new Date(s);e.setDate(e.getDate()+2);
var view=new Date(s.getFullYear(),s.getMonth(),1),mode='in',hov=null; // mode: 'in' = editing check-in, 'out' = editing check-out
var ciBox=btn.children[0],coBox=btn.children[2];
function fmt(d){return d?d.getDate()+' '+M[d.getMonth()]:'—'}
function nb(x){return !!(window.NV_BUSY&&window.NV_BUSY[x]&&x>=iso(today))}
function rb(a,b){for(var t=new Date(a);t<b;t.setDate(t.getDate()+1))if(nb(iso(t)))return true;return false}
function word(n){if(document.documentElement.lang==='en')return n===1?'night':'nights';var m=n%10,h=n%100;if(h>=11&&h<=14)return 'ночей';if(m===1)return 'ночь';if(m>=2&&m<=4)return 'ночи';return 'ночей'}
function labels(){document.getElementById('ciL').textContent=fmt(s);var l=document.getElementById('coL');l.textContent=e?fmt(e):'Выберите';l.classList.toggle('ph',!e);ciBox.classList.toggle('act',mode==='in');coBox.classList.toggle('act',mode==='out');cfT.textContent=!e?'Теперь дату выезда':(mode==='in'&&!dr.classList.contains('open')?Math.round((e-s)/864e5)+' '+word(Math.round((e-s)/864e5)):(mode==='in'?'Выберите новую дату заезда · '+Math.round((e-s)/864e5)+' '+word(Math.round((e-s)/864e5)):Math.round((e-s)/864e5)+' '+word(Math.round((e-s)/864e5))))}
function render(){cm.textContent=MN[view.getMonth()]+' '+view.getFullYear();document.getElementById('cp').disabled=view<=new Date(today.getFullYear(),today.getMonth(),1);
var first=new Date(view),off=(first.getDay()+6)%7,days=new Date(view.getFullYear(),view.getMonth()+1,0).getDate(),h='';
for(var i=0;i<off;i++)h+='<button type="button" class="out" tabindex="-1" disabled></button>';
var rs=s,re=e||(mode==='out'&&hov&&hov>s?hov:null),lim=null;if(mode==='out'&&s&&window.NV_BUSY){var t=new Date(s);for(var k=0;k<370;k++){if(nb(iso(t))){lim=new Date(t);break}t.setDate(t.getDate()+1)}}
for(var d=1;d<=days;d++){var dt=new Date(view.getFullYear(),view.getMonth(),d),c=[],di=iso(dt),bz=dt>=today&&nb(di);var far=mode==='out'&&s&&lim&&dt>lim;var dis=dt<today||(bz&&!(mode==='out'&&s&&lim&&iso(dt)===iso(lim)));if(mode==='out'&&s&&dt<=s&&!bz)c.push('pre');if(far&&!bz)c.push('far');if(bz)c.push('busy');if(bz&&!dis)c.push('co');
if(rs&&iso(dt)===iso(rs)){c.push('s');if(re&&iso(re)!==iso(rs))c.push('r')}if(re&&iso(dt)===iso(re))c.push('e');if(rs&&re&&dt>rs&&dt<re)c.push('in');if(iso(dt)===iso(today))c.push('today');
h+='<button type="button" data-d="'+iso(dt)+'" class="'+c.join(' ')+'"'+(dis?' disabled':'')+'><span>'+d+'</span></button>'}
cg.innerHTML=h}
cg.addEventListener('click',function(ev){var b=ev.target.closest('button[data-d]');if(!b||b.disabled)return;ev.stopPropagation();var d=new Date(b.dataset.d+'T00:00:00');
var lm=null;if(window.NV_BUSY){var t2=new Date(s);for(var k2=0;k2<370;k2++){if(nb(iso(t2))){lm=t2;break}t2.setDate(t2.getDate()+1)}}
if(mode==='in'){s=d;e=null;mode='out'}else{if(d<=s||(lm&&d>lm)){if(nb(iso(d)))return;s=d;e=null;mode='out'}else{e=d;mode='in';labels();render();calc();setTimeout(close,220);return}}
labels();render();calc()});
var hq=0;cg.addEventListener('mouseover',function(ev){var b=ev.target.closest('button[data-d]');if(!b||mode!=='out'||e||b.classList.contains('far')||b.classList.contains('pre'))return;if(hov&&iso(hov)===b.dataset.d)return;hov=new Date(b.dataset.d+'T00:00:00');if(hq)return;hq=requestAnimationFrame(function(){hq=0;render()})});
cg.addEventListener('mouseleave',function(){if(hov){hov=null;render()}});
document.getElementById('cp').addEventListener('click',function(ev){ev.stopPropagation();view.setMonth(view.getMonth()-1);render()});
document.getElementById('cn').addEventListener('click',function(ev){ev.stopPropagation();view.setMonth(view.getMonth()+1);render()});
document.getElementById('cClr').addEventListener('click',function(ev){ev.stopPropagation();var t=new Date(today);t.setDate(t.getDate()+1);for(var k=0;k<370&&nb(iso(t));k++)t.setDate(t.getDate()+1);s=t;e=new Date(t);e.setDate(e.getDate()+1);if(rb(s,e)){e=null;mode='out'}else mode='in';view=new Date(s.getFullYear(),s.getMonth(),1);labels();render();calc()});
function open(m){mode=m||'in';dr.classList.add('open');try{document.dispatchEvent(new CustomEvent('nv:calopen'))}catch(_){}btn.setAttribute('aria-expanded','true');var ref=(mode==='out'&&e)?e:s;view=new Date(ref.getFullYear(),ref.getMonth(),1);labels();render()}
function close(){if(!dr.classList.contains('open'))return;dr.classList.remove('open');btn.setAttribute('aria-expanded','false');hov=null;if(!e){e=new Date(s);e.setDate(e.getDate()+1)}mode='in';labels();render();calc()}
ciBox.addEventListener('click',function(ev){ev.stopPropagation();dr.classList.contains('open')&&mode==='in'?close():open('in')});
coBox.addEventListener('click',function(ev){ev.stopPropagation();dr.classList.contains('open')&&mode==='out'?close():open('out')});
btn.addEventListener('click',function(ev){if(ev.target===btn||ev.target.classList.contains('ar')){dr.classList.contains('open')?close():open('in')}});
document.getElementById('cal').addEventListener('click',function(ev){ev.stopPropagation()});
document.addEventListener('click',function(ev){if(!dr.contains(ev.target))close()});
addEventListener('keydown',function(ev){if(ev.key==='Escape')close()});
function calc(){if(!s||!e)return;var n=Math.round((e-s)/864e5);ci.value=iso(s);co.value=iso(e);
var PP=window.NV_PRICE||P;var dp=n>=30?20:n>=7?10:0;var sub=PP*n,lsd=Math.round(sub*dp/100);var promo=window.NV_PROMO&&window.NV_PROMO.percent&&(!window.NV_PROMO.apts.length||window.NV_PROMO.apts.indexOf(APT)>-1)?Math.round(sub*window.NV_PROMO.percent/100):0;var drl=document.querySelector('#disRow span');if(drl)drl.textContent=dp&&promo?'Скидка от '+(n>=30?'30':'7')+' ночей −'+dp+'% и акция −'+window.NV_PROMO.percent+'%':dp?'Скидка от '+(n>=30?'30':'7')+' ночей −'+dp+'%':promo?'Акция −'+window.NV_PROMO.percent+'%':'';var dis=lsd+promo;var gd=window.NV_GUEST&&window.NV_GUEST.token?(window.NV_GUEST.discount||5):0;var gdis=Math.round(sub*gd/100);var grow=document.getElementById('gdRow');if(!grow&&gd){grow=document.createElement('div');grow.className='dis gd';grow.id='gdRow';grow.innerHTML='<span><i class="ph-fill ph-seal-percent"></i>Ваш профиль −'+gd+'%</span><b id="gdis"></b>';var dr=document.getElementById('disRow');dr.parentNode.insertBefore(grow,dr.nextSibling)}if(grow){grow.hidden=!gd;var ge=document.getElementById('gdis');if(ge)ge.textContent='−$'+gdis}var rowDis=dis;dis+=gdis;var tot=sub-dis;
document.getElementById('n').textContent=n;document.getElementById('nw').textContent=word(n);document.getElementById('sub').textContent='$'+sub;
var drw=document.getElementById('disRow');drw.hidden=!rowDis;document.getElementById('dis').textContent='−$'+rowDis;
var el=document.getElementById('tot'),from=+el.textContent.replace(/\D/g,'')||tot,t0=performance.now(),tok=(window.__nvTot=(window.__nvTot||0)+1);if(from===tot){el.textContent='$'+tot}else(function f(ts){if(tok!==window.__nvTot)return;var p=Math.min(1,(ts-t0)/420);p=1-Math.pow(1-p,3);el.textContent='$'+Math.round(from+(tot-from)*p);if(p<1)requestAnimationFrame(f);else el.textContent='$'+tot})(t0);
bk.href='booking.html?checkin='+ci.value+'&checkout='+co.value+'&apt='+APT+'#book'}
labels();calc();document.addEventListener('nv:guest',function(){try{calc()}catch(e){}});
window.NV_CAL={recalc:function(){calc()},refresh:function(){if(s&&(nb(iso(s))||(e&&rb(s,e)))){var t=new Date(today);for(var g=0;g<400&&nb(iso(t));g++)t.setDate(t.getDate()+1);s=t;e=new Date(t);e.setDate(e.getDate()+1);mode='in';view=new Date(s.getFullYear(),s.getMonth(),1)}labels();render();calc()},set:function(a,b,g){var x=new Date(a+'T00:00:00'),y=new Date(b+'T00:00:00');if(isNaN(x)||isNaN(y)||y<=x||x<today)return;s=x;e=y;var gs=document.getElementById('gs');if(g&&gs&&gs.querySelector('option[value="'+g+'"]'))gs.value=g;labels();render();calc()}};
var sh=document.getElementById('share');if(sh)sh.addEventListener('click',function(){var d={title:document.title,url:location.href};if(navigator.share){navigator.share(d).catch(function(){})}else{navigator.clipboard&&navigator.clipboard.writeText(location.href);var t=sh.innerHTML;sh.innerHTML='<i class="ph-bold ph-check"></i>Ссылка скопирована';setTimeout(function(){sh.innerHTML=t},1800)}});
})();
})();
/* registration + guest profile (server-backed, 5% discount) */
(function(){
function nvApplyDisc(){
var g=window.NV_GUEST,on=!!(g&&g.token),dp=on?(g.discount||5):0;
document.documentElement.classList.toggle('nv-guest',on);
var re=new RegExp('^(\\D*)\\$(\\d+)(.*)$');
document.querySelectorAll('[data-price]').forEach(function(n){var base=+n.getAttribute('data-price');if(!base)return;var el=n.querySelector('.pr-v')||n.querySelector('b');var host0=el||n,tn=null;for(var ch=host0.firstChild;ch;ch=ch.nextSibling){if(ch.nodeType===3&&/\$\d/.test(ch.nodeValue)){tn=ch;break}}if(!tn)return;var out=on?Math.round(base*(1-dp/100)):base;var m=tn.nodeValue.match(re);if(!m)return;var txt=m[1]+'$'+out+m[3];if(tn.nodeValue!==txt)tn.nodeValue=txt;
  var host=tn.parentNode,was=host.querySelector(':scope > s.was'),tag=n.querySelector('.disc-tag');
  if(on){if(!was){was=document.createElement('s');was.className='was';host.insertBefore(was,tn)}was.textContent='$'+base;
    if(!tag){tag=document.createElement('span');tag.className='disc-tag';tag.innerHTML='<i class="ph-fill ph-seal-percent"></i>−'+dp+'% ваш профиль';n.appendChild(tag)}}
  else{if(was)was.remove();if(tag)tag.remove()}
  n.classList.toggle('disc',on)});
}
window.nvApplyDisc=nvApplyDisc;document.addEventListener('nv:guest',nvApplyDisc);addEventListener('nv:guest',nvApplyDisc);document.addEventListener('DOMContentLoaded',nvApplyDisc);setTimeout(nvApplyDisc,800);setTimeout(nvApplyDisc,2500);
var K='nvGuest',API=(window.NV_BOOK_API||'').replace(/\/$/,'');
function get(){try{return JSON.parse(localStorage.getItem(K)||'null')}catch(e){return null}}
function set(p){try{localStorage.setItem(K,JSON.stringify(p))}catch(e){}window.NV_GUEST=p;dispatchEvent(new Event('nv:guest'));document.dispatchEvent(new CustomEvent('nv:guest',{detail:p}))}
var reg=document.getElementById('nvReg'),prof=document.getElementById('nvProfile');if(!reg)return;
var p=get();window.NV_GUEST=p;dispatchEvent(new Event('nv:guest'));
function esc2(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function renderAcc(){var na=document.querySelector('.nav-actions');if(!na)return;var old=document.getElementById('nvAccW');if(old)old.remove();var g=get();
  var w=document.createElement('div');w.id='nvAccW';w.className='nv-accw';
  if(g&&g.token){var nm=(g.name||'').trim(),first=nm.split(' ')[0]||'Профиль',d=g.discount||5;
    w.innerHTML='<button type="button" id="nvAcc" class="nv-acc on" aria-haspopup="true" aria-expanded="false"><span class="av">'+esc2(first.charAt(0).toUpperCase())+'</span><span class="nm">'+esc2(first)+'</span><b>−'+d+'%</b></button>'+
      '<div class="nv-accm" role="menu"><div class="hd"><span class="av lg">'+esc2(first.charAt(0).toUpperCase())+'</span><div><b>'+esc2(nm||first)+'</b>'+(g.email?'<small>'+esc2(g.email)+'</small>':'')+'</div></div>'+
      '<div class="perk"><i class="ph-fill ph-seal-percent"></i><div><b>Скидка −'+d+'% активна</b><small>Применяется ко всем броням автоматически</small></div></div>'+
      '<a role="menuitem" href="bron.html"><i class="ph-bold ph-calendar-check"></i>Мои брони</a><a role="menuitem" href="booking.html"><i class="ph-bold ph-magnifying-glass"></i>Найти апартамент</a><button type="button" role="menuitem" class="out"><i class="ph-bold ph-sign-out"></i>Выйти</button></div>';
    var btn=w.querySelector('#nvAcc'),mn=w.querySelector('.nv-accm');
    btn.onclick=function(e){e.stopPropagation();var o=w.classList.toggle('open');btn.setAttribute('aria-expanded',o)};
    document.addEventListener('click',function(e){if(!w.contains(e.target)){w.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
    addEventListener('keydown',function(e){if(e.key==='Escape')w.classList.remove('open')});
    w.querySelector('.out').onclick=function(){localStorage.removeItem(K);window.NV_GUEST=null;dispatchEvent(new Event('nv:guest'));document.dispatchEvent(new CustomEvent('nv:guest'));renderAcc();if(prof)prof.style.display='none'};
  }else{w.innerHTML='<button type="button" id="nvAcc" class="nv-acc" title="Войти или создать профиль гостя"><i class="ph-bold ph-user-circle"></i><span class="nm">Войти</span><b>−5%</b></button>';w.querySelector('#nvAcc').onclick=function(){if(window.NV_openReg)window.NV_openReg(true)}}
  na.insertBefore(w,na.firstChild)}
renderAcc();
function showProfile(p){reg.hidden=true;renderAcc();nvApplyDisc();if(!prof)return;prof.style.display='none';return;prof.style.display='flex';prof.querySelector('.av').textContent=(p.name||'?').trim().charAt(0).toUpperCase();prof.querySelector('.nm').textContent=(p.name||'').split(' ')[0]+' · −'+(p.discount||5)+'%';prof.title='Выйти из профиля';prof.onclick=function(){if(confirm('Выйти из профиля гостя?')){localStorage.removeItem(K);location.reload()}}}
if(p&&p.token){showProfile(p);if(API)fetch(API+'/guest/me?t='+p.token).then(function(r){return r.ok?r.json():null}).then(function(d){if(d&&d.ok){set(d);showProfile(d)}else if(d===null){}}).catch(function(){});return}
var shown=false;
function openReg(force){if(get()&&get().token)return;if(shown&&!force)return;shown=true;reg.hidden=false;document.body.classList.add('reg-open');requestAnimationFrame(function(){reg.classList.add('on')})}
window.NV_openReg=openReg;
document.querySelectorAll('.nv-reg-open').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();shown=false;openReg()})});
/* invite: after 20s on page, or when guest scrolls past 60%, once per session */
try{if(!sessionStorage.getItem('nvRegClosed')){var t=setTimeout(openReg,20000);addEventListener('scroll',function sc(){if(scrollY>document.body.scrollHeight*.5){removeEventListener('scroll',sc);clearTimeout(t);setTimeout(openReg,1200)}},{passive:true})}}catch(e){}
reg.querySelector('.x').addEventListener('click',function(){reg.classList.remove('on');document.body.classList.remove('reg-open');try{sessionStorage.setItem('nvRegClosed','1')}catch(e){}setTimeout(function(){reg.hidden=true},600)});
reg.querySelector('.go').addEventListener('click',function(){
var go=reg.querySelector('.go'),LBL=go.textContent;
if(go.disabled)return;
var name=document.getElementById('nvRegName').value.trim().replace(/[<>"'\\]/g,'').slice(0,80),email=document.getElementById('nvRegEmail').value.trim().slice(0,120),phoneEl=document.getElementById('nvRegPhone'),phone=phoneEl?phoneEl.value.trim().slice(0,30):'';
function msg(t,ms){go.textContent=t;setTimeout(function(){go.textContent=LBL;go.disabled=false},ms||2200)}
if(!name||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){msg('Заполните имя и email',1800);return}
go.disabled=true;go.textContent='Сохраняем…';
function done(d){set(d);var f=reg.querySelector('.form'),x=document.createElement('div');x.className='done';x.textContent='Готово, '+d.name.split(' ')[0]+'! Скидка '+d.discount+'% уже применяется к вашим броням на сайте.';f.replaceChildren(x);
if(typeof gtag==='function')gtag('event','sign_up',{method:'site'});
setTimeout(function(){reg.classList.remove('on');document.body.classList.remove('reg-open');setTimeout(function(){reg.hidden=true;showProfile(d)},600)},2800)}
if(!API){done({token:'',name:name,email:email,discount:5});return}
var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort()},9000);
fetch(API+'/guest/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,email:email,phone:phone,lang:document.documentElement.lang||'ru',website:(document.getElementById('nvRegHp')||{}).value||''}),signal:ctl.signal})
.then(function(r){return r.json().then(function(d){if(!r.ok)throw new Error(d.message||'error');return d})})
.then(function(d){clearTimeout(tm);done(d)})
.catch(function(e){clearTimeout(tm);msg(e.name==='AbortError'?'Сервер не ответил, попробуйте ещё раз':(e.message||'Не получилось, попробуйте позже'),2600)});
});
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