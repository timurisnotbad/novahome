/* Nova Home — catalog filters: pill dropdowns (desktop) + bottom sheet (mobile).
   Drives the original .cat-group chips and #catSort, so filtering logic stays untouched. */
(function(){
var bar=document.querySelector('.cat-bar');if(!bar||bar.dataset.fx)return;bar.dataset.fx='1';
var G=[].slice.call(bar.querySelectorAll('.cat-group[data-key]'));
var sortSel=document.getElementById('catSort');
var ICON={complex:'ph-buildings',type:'ph-bed',guests:'ph-users',extra:'ph-sparkle'};
var TITLE={complex:'ЖК',type:'Формат',guests:'Гости',extra:'Особенности'};
function T(s){return window.NV_T?window.NV_T(s):s}
function opts(g){return [].slice.call(g.querySelectorAll('.fchip')).map(function(b){return {v:b.dataset.v,t:b.textContent.trim(),on:b.classList.contains('on'),el:b}})}
function cur(g){var o=opts(g).filter(function(x){return x.on})[0];return o&&o.v!=='all'?o:null}
function pick(g,v){var b=g.querySelector('.fchip[data-v="'+v.replace(/"/g,'\\"')+'"]');if(b&&!b.classList.contains('on'))b.click();sync()}
function activeCount(){return G.filter(cur).length+(sortSel&&sortSel.value!=='rec'?1:0)}
function count(){var c=document.getElementById('catCount');var m=c&&c.textContent.match(/(\d+)\s*из\s*(\d+)/);return m?+m[1]:null}

/* ---------- desktop pills ---------- */
var row=document.createElement('div');row.className='fx-row';
var pills=G.map(function(g){var k=g.dataset.key;var w=document.createElement('div');w.className='fx-dd';w.dataset.k=k;
  w.innerHTML='<button type="button" class="fx-pill" aria-haspopup="listbox" aria-expanded="false"><i class="ph-bold '+(ICON[k]||'ph-funnel')+'"></i><span class="l"></span><i class="ph-bold ph-caret-down cv"></i></button><div class="fx-pop" role="listbox"></div>';
  var btn=w.querySelector('.fx-pill'),pop=w.querySelector('.fx-pop');
  btn.addEventListener('click',function(e){e.stopPropagation();var o=!w.classList.contains('open');closeAll();if(o){fillPop(g,pop);w.classList.add('open');btn.setAttribute('aria-expanded','true')}});
  row.appendChild(w);return {g:g,w:w,btn:btn,pop:pop,k:k}});
function fillPop(g,pop){pop.innerHTML='<div class="fx-h">'+T(TITLE[g.dataset.key]||'')+'</div>'+opts(g).map(function(o){return '<button type="button" role="option" class="fx-o'+(o.on?' on':'')+'" data-v="'+o.v.replace(/"/g,'&quot;')+'" aria-selected="'+o.on+'"><span>'+o.t+'</span><i class="ph-bold ph-check"></i></button>'}).join('');
  [].forEach.call(pop.querySelectorAll('.fx-o'),function(b){b.addEventListener('click',function(e){e.stopPropagation();pick(g,b.dataset.v);closeAll()})})}
/* sort pill */
var sortW=null;if(sortSel){sortW=document.createElement('div');sortW.className='fx-dd fx-sort';sortW.innerHTML='<button type="button" class="fx-pill" aria-haspopup="listbox" aria-expanded="false"><i class="ph-bold ph-arrows-down-up"></i><span class="l"></span><i class="ph-bold ph-caret-down cv"></i></button><div class="fx-pop right" role="listbox"></div>';
  var sb=sortW.querySelector('.fx-pill'),sp=sortW.querySelector('.fx-pop');
  sb.addEventListener('click',function(e){e.stopPropagation();var o=!sortW.classList.contains('open');closeAll();if(o){sp.innerHTML='<div class="fx-h">'+T('Сортировка')+'</div>'+[].map.call(sortSel.options,function(op){return '<button type="button" role="option" class="fx-o'+(op.value===sortSel.value?' on':'')+'" data-v="'+op.value+'"><span>'+op.textContent+'</span><i class="ph-bold ph-check"></i></button>'}).join('');
    [].forEach.call(sp.querySelectorAll('.fx-o'),function(b){b.addEventListener('click',function(ev){ev.stopPropagation();sortSel.value=b.dataset.v;sortSel.dispatchEvent(new Event('change',{bubbles:true}));sync();closeAll()})});sortW.classList.add('open');sb.setAttribute('aria-expanded','true')}});
  row.appendChild(sortW)}
var reset=document.createElement('button');reset.type='button';reset.className='fx-reset';reset.innerHTML='<i class="ph-bold ph-x"></i>'+T('Сбросить');
reset.addEventListener('click',function(){G.forEach(function(g){pick(g,'all')});if(sortSel&&sortSel.value!=='rec'){sortSel.value='rec';sortSel.dispatchEvent(new Event('change',{bubbles:true}))}sync()});
row.insertBefore(reset,sortW);
/* mobile trigger */
var mbtn=document.createElement('button');mbtn.type='button';mbtn.className='fx-mbtn';mbtn.innerHTML='<i class="ph-bold ph-sliders-horizontal"></i><span>'+T('Фильтры')+'</span><b class="n"></b>';
mbtn.addEventListener('click',openSheet);
bar.classList.add('fx-on');bar.appendChild(row);bar.appendChild(mbtn);
function closeAll(){[].forEach.call(bar.querySelectorAll('.fx-dd.open'),function(w){w.classList.remove('open');var b=w.querySelector('.fx-pill');b&&b.setAttribute('aria-expanded','false')})}
document.addEventListener('click',function(e){if(!bar.contains(e.target))closeAll()});
addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll();closeSheet()}});

/* ---------- mobile sheet ---------- */
var sh=null;
function openSheet(){if(!sh){sh=document.createElement('div');sh.className='fx-sheet';sh.innerHTML='<div class="fx-card" role="dialog" aria-modal="true" aria-label="'+T('Фильтры')+'"><div class="fx-sh"><b>'+T('Фильтры')+'</b><button type="button" class="fx-x" aria-label="'+T('Закрыть')+'"><i class="ph-bold ph-x"></i></button></div><div class="fx-body"></div><div class="fx-ft"><button type="button" class="fx-clr">'+T('Сбросить')+'</button><button type="button" class="btn btn-primary fx-show"></button></div></div>';document.body.appendChild(sh);
  sh.addEventListener('click',function(e){if(e.target===sh||e.target.closest('.fx-x,.fx-show'))closeSheet()});
  sh.querySelector('.fx-clr').addEventListener('click',function(){reset.click();drawSheet()})}
  drawSheet();document.body.classList.add('fx-open');requestAnimationFrame(function(){sh.classList.add('on')})}
function drawSheet(){var b=sh.querySelector('.fx-body');
  b.innerHTML=G.map(function(g){return '<div class="fx-sec"><div class="fx-st"><i class="ph-bold '+(ICON[g.dataset.key]||'ph-funnel')+'"></i>'+T(TITLE[g.dataset.key]||'')+'</div><div class="fx-chips" data-k="'+g.dataset.key+'">'+opts(g).map(function(o){return '<button type="button" class="fx-c'+(o.on?' on':'')+'" data-v="'+o.v.replace(/"/g,'&quot;')+'">'+o.t+'</button>'}).join('')+'</div></div>'}).join('')+
   (sortSel?'<div class="fx-sec"><div class="fx-st"><i class="ph-bold ph-arrows-down-up"></i>'+T('Сортировка')+'</div><div class="fx-chips" data-k="__sort">'+[].map.call(sortSel.options,function(op){return '<button type="button" class="fx-c'+(op.value===sortSel.value?' on':'')+'" data-v="'+op.value+'">'+op.textContent+'</button>'}).join('')+'</div></div>':'');
  [].forEach.call(b.querySelectorAll('.fx-c'),function(c){c.addEventListener('click',function(){var k=c.parentNode.dataset.k;if(k==='__sort'){sortSel.value=c.dataset.v;sortSel.dispatchEvent(new Event('change',{bubbles:true}))}else{var g=G.filter(function(x){return x.dataset.key===k})[0];pick(g,c.dataset.v)}drawSheet()})});
  var n=count();sh.querySelector('.fx-show').textContent=n==null?T('Показать'):('Показать '+n+' '+word(n))}
function closeSheet(){if(!sh||!sh.classList.contains('on'))return;sh.classList.remove('on');document.body.classList.remove('fx-open')}
function word(n){var m=n%10,h=n%100;return h>=11&&h<=14?'апартаментов':m===1?'апартамент':m>=2&&m<=4?'апартамента':'апартаментов'}

/* ---------- labels ---------- */
function sync(){pills.forEach(function(p){var c=cur(p.g);p.btn.querySelector('.l').textContent=c?c.t:T(TITLE[p.k]||'');p.w.classList.toggle('act',!!c)});
  if(sortW){var op=sortSel.options[sortSel.selectedIndex];sortW.querySelector('.l').textContent=op?op.textContent:'';sortW.classList.toggle('act',sortSel.value!=='rec')}
  var n=activeCount();reset.hidden=!n;var nb=mbtn.querySelector('.n');nb.textContent=n||'';nb.hidden=!n;mbtn.classList.toggle('act',!!n)}
G.forEach(function(g){g.addEventListener('click',function(){setTimeout(sync,0)})});
if(sortSel)sortSel.addEventListener('change',sync);
sync();
})();
