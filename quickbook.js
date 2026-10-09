/* Nova Home — quick booking drawer (dates + guests), site-styled calendar */
(function(){
var NV_T=window.NV_T||function(x){return x};
var M=[NV_T('Январь'),NV_T('Февраль'),NV_T('Март'),NV_T('Апрель'),NV_T('Май'),NV_T('Июнь'),NV_T('Июль'),NV_T('Август'),NV_T('Сентябрь'),NV_T('Октябрь'),NV_T('Ноябрь'),NV_T('Декабрь')],MS=[NV_T('янв'),NV_T('фев'),NV_T('мар'),NV_T('апр'),NV_T('мая'),NV_T('июн'),NV_T('июл'),NV_T('авг'),NV_T('сен'),NV_T('окт'),NV_T('ноя'),NV_T('дек')],WD=[NV_T('Пн'),NV_T('Вт'),NV_T('Ср'),NV_T('Чт'),NV_T('Пт'),NV_T('Сб'),NV_T('Вс')];
var iso=function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function word(n){var m=n%10,h=n%100;if(h>=11&&h<=14)return NV_T('ночей');if(m===1)return NV_T('ночь');if(m>=2&&m<=4)return NV_T('ночи');return NV_T('ночей')}
function gw(n){return n===1?NV_T('гость'):n<5?NV_T('гостя'):NV_T('гостей')}
var today=new Date();today.setHours(0,0,0,0);
var s=null,e=null,g=2,mode='in',view=new Date(today.getFullYear(),today.getMonth(),1),el,built=false;
function fmt(d){return d?d.getDate()+' '+MS[d.getMonth()]:'—'}
function build(){if(built)return;built=true;
  el=document.createElement('div');el.className='qb';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label',NV_T('Выбор дат'));
  el.innerHTML='<div class="qb-scrim"></div><div class="qb-card">'+
   '<div class="qb-grab"></div><button type="button" class="qb-x" aria-label="Закрыть"><i class="ph-bold ph-x"></i></button>'+
   '<div class="qb-head"><div class="eyebrow">Бронирование</div><h3>Когда приедете?</h3></div>'+
   '<div class="qb-io"><button type="button" class="qb-f act" data-m="in"><small>Заезд</small><b id="qbIn">Выберите</b></button><button type="button" class="qb-f" data-m="out"><small>Выезд</small><b id="qbOut">—</b></button></div>'+
   '<div class="qb-cal"><div class="cal-h"><button type="button" class="cal-nav" id="qbPrev" aria-label="Предыдущий месяц"><i class="ph-bold ph-caret-left"></i></button><b id="qbM"></b><button type="button" class="cal-nav" id="qbNext" aria-label="Следующий месяц"><i class="ph-bold ph-caret-right"></i></button></div><div class="cal-w">'+WD.map(function(w){return '<span>'+w+'</span>'}).join('')+'</div><div class="cal-g" id="qbG"></div></div>'+
   '<div class="qb-g"><div><b>Гости</b><small id="qbGl">2 гостя</small></div><div class="qb-st"><button type="button" id="qbMinus" aria-label="Меньше"><i class="ph-bold ph-minus"></i></button><span id="qbN">2</span><button type="button" id="qbPlus" aria-label="Больше"><i class="ph-bold ph-plus"></i></button></div></div>'+
   '<div class="qb-foot"><div class="qb-sum" id="qbSum"></div><button type="button" class="btn btn-primary" id="qbGo"><i class="ph-bold ph-magnifying-glass"></i><span>Показать свободные</span></button></div>'+
  '</div>';
  document.body.appendChild(el);
  el.querySelector('.qb-scrim').onclick=close;el.querySelector('.qb-x').onclick=close;
  el.querySelectorAll('.qb-f').forEach(function(b){b.onclick=function(){mode=b.dataset.m;if(mode==='out'&&!s)mode='in';paint()}});
  var slide=function(dir){var G=el.querySelector('#qbG');G.classList.add(dir>0?'sl-l':'sl-r');setTimeout(function(){view=new Date(view.getFullYear(),view.getMonth()+dir,1);grid();G.classList.remove('sl-l','sl-r');G.classList.add(dir>0?'sl-r':'sl-l');requestAnimationFrame(function(){requestAnimationFrame(function(){G.classList.remove('sl-l','sl-r')})})},160)};
  el.querySelector('#qbPrev').onclick=function(){if(!this.disabled)slide(-1)};
  el.querySelector('#qbNext').onclick=function(){slide(1)};
  var sx=null;el.querySelector('.qb-cal').addEventListener('touchstart',function(ev){sx=ev.touches[0].clientX},{passive:true});el.querySelector('.qb-cal').addEventListener('touchend',function(ev){if(sx===null)return;var dx=ev.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50){if(dx<0)slide(1);else if(!el.querySelector('#qbPrev').disabled)slide(-1)}},{passive:true});
  el.querySelector('#qbMinus').onclick=function(){g=Math.max(1,g-1);paint();syncBars()};el.querySelector('#qbPlus').onclick=function(){g=Math.min(6,g+1);paint();syncBars()};
  el.querySelector('#qbGo').onclick=go;
  el.querySelector('#qbG').addEventListener('click',function(ev){var b=ev.target.closest('button[data-d]');if(!b||b.disabled)return;pick(new Date(b.dataset.d+'T00:00:00'))});
  addEventListener('keydown',function(ev){if(ev.key==='Escape'&&el.classList.contains('on'))close()});
  // swipe down to close on mobile
  var y0=null;el.querySelector('.qb-grab').addEventListener('touchstart',function(ev){y0=ev.touches[0].clientY},{passive:true});el.querySelector('.qb-card').addEventListener('touchmove',function(ev){if(y0!==null&&ev.touches[0].clientY-y0>70){y0=null;close()}},{passive:true});
}
function pick(d){if(mode==='in'||(s&&d<=s)){s=d;e=null;mode='out'}else{e=d;mode='in'}paint();syncBars()}
function grid(){var G=el.querySelector('#qbG');el.querySelector('#qbM').textContent=M[view.getMonth()]+' '+view.getFullYear();el.querySelector('#qbPrev').disabled=view<=new Date(today.getFullYear(),today.getMonth(),1);
  var off=(view.getDay()+6)%7,days=new Date(view.getFullYear(),view.getMonth()+1,0).getDate(),h='';
  for(var i=0;i<off;i++)h+='<button type="button" class="out" tabindex="-1" disabled></button>';
  for(var d=1;d<=days;d++){var dt=new Date(view.getFullYear(),view.getMonth(),d),c=[],dis=dt<today||(mode==='out'&&s&&dt<=s);
    if(s&&iso(dt)===iso(s)){c.push('s');if(e)c.push('r')}if(e&&iso(dt)===iso(e))c.push('e');if(s&&e&&dt>s&&dt<e)c.push('in');if(iso(dt)===iso(today))c.push('today');if(mode==='out'&&s&&dt<=s)c.push('pre');
    h+='<button type="button" data-d="'+iso(dt)+'" class="'+c.join(' ')+'"'+(dis?' disabled':'')+'><span>'+d+'</span></button>'}
  G.innerHTML=h}
function paint(){el.querySelector('#qbIn').textContent=s?fmt(s):NV_T('Выберите');el.querySelector('#qbOut').textContent=e?fmt(e):(s?NV_T('Выберите'):'—');
  el.querySelectorAll('.qb-f').forEach(function(b){b.classList.toggle('act',b.dataset.m===mode)});
  el.querySelector('#qbN').textContent=g;el.querySelector('#qbGl').textContent=g+' '+gw(g);
  var n=s&&e?Math.round((e-s)/864e5):0;el.querySelector('#qbSum').innerHTML=n?'<b>'+n+' '+word(n)+'</b><small>'+fmt(s)+' → '+fmt(e)+(n>=30?' · −20%':n>=7?' · −10%':'')+'</small>':'<small>'+(s?NV_T('Теперь дату выезда'):NV_T('Выберите дату заезда'))+'</small>';
  el.querySelector('#qbGo').disabled=!n;grid()}
function open(pre){build();if(pre&&pre.from){s=new Date(pre.from+'T00:00:00');e=pre.to?new Date(pre.to+'T00:00:00'):null;g=+pre.guests||g;mode=e?'in':'out';view=new Date(s.getFullYear(),s.getMonth(),1)}
  if(!s){var q=new URLSearchParams(location.search);if(q.get('checkin')){s=new Date(q.get('checkin')+'T00:00:00');e=q.get('checkout')?new Date(q.get('checkout')+'T00:00:00'):null;g=+q.get('guests')||g;view=new Date(s.getFullYear(),s.getMonth(),1);mode=e?'in':'out'}}
  paint();el.classList.add('on');document.body.classList.add('qb-open');document.dispatchEvent(new CustomEvent('nv:qbopen'))}
function close(){if(!el)return;el.classList.remove('on');document.body.classList.remove('qb-open')}
function go(){if(!(s&&e))return;var a=iso(s),b=iso(e);
  var sb=document.getElementById('nvSearch'),grid=document.getElementById('catGrid');
  if(sb&&grid){syncBars();close();sb.requestSubmit?sb.requestSubmit():sb.dispatchEvent(new Event('submit'));return}
  if(window.NV_CAL&&document.getElementById('pc')){window.NV_CAL.set(a,b,g);close();var bb=document.getElementById('bookBtn');if(bb)bb.click();return}
  location.href='booking.html?checkin='+a+'&checkout='+b+'&guests='+g+'#apts'}
window.NV_QB={open:open,close:close};
/* sync drawer → search bars */
function syncBars(){var a=s?iso(s):'',b=e?iso(e):'';document.querySelectorAll('#nvSearch,.hs').forEach(function(f){var fi=f.querySelector('[name=from]'),ti=f.querySelector('[name=to]'),gi=f.querySelector('[name=guests]');if(fi)fi.value=a;if(ti)ti.value=b;if(gi&&g){var v=String(Math.min(+gi.options[gi.options.length-1].value||6,g));if(gi.querySelector('option[value="'+v+'"]'))gi.value=v}
  f.querySelectorAll('.hs-v').forEach(function(x){var d=x.dataset.f==='from'?s:e;x.textContent=d?fmt(d):NV_T('Выберите');x.classList.toggle('ph',!d)})})}
function readBar(){var f=document.getElementById('nvSearch')||document.querySelector('.hs');if(!f)return;var a=f.querySelector('[name=from]'),b=f.querySelector('[name=to]'),gi=f.querySelector('[name=guests]');if(a&&a.value){s=new Date(a.value+'T00:00:00');e=b&&b.value?new Date(b.value+'T00:00:00'):null;view=new Date(s.getFullYear(),s.getMonth(),1)}if(gi&&gi.value)g=+gi.value||g}
/* hooks: explicit CTAs only */
document.addEventListener('click',function(ev){var a=ev.target.closest('[data-qb],[data-qb-field]');if(!a)return;ev.preventDefault();
  if(a.dataset.qbField){readBar();mode=a.dataset.qbField==='out'&&s?'out':'in';open();return}
  readBar();open()},true);
/* on load: reflect ?checkin from URL into bars */
(function(){var qq=new URLSearchParams(location.search);if(qq.get('checkin')){s=new Date(qq.get('checkin')+'T00:00:00');e=qq.get('checkout')?new Date(qq.get('checkout')+'T00:00:00'):null;g=+qq.get('guests')||g;view=new Date(s.getFullYear(),s.getMonth(),1);syncBars()}})();
})();
