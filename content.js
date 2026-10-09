/* Nova Home — site content from admin panel (photos, prices, texts, promos, blog, hidden apts) */
(function(){
var NV_T=function(s){return window.NV_T?window.NV_T(s):s};
var API=(window.NV_BOOK_API||'').replace(/\/$/,'');if(!API)return;
var IMG=function(k){return k?(/^https?:/.test(k)?k:API+'/img/'+k):''};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function load(){var c=null;try{c=JSON.parse(sessionStorage.getItem('nvCms')||'null')}catch(e){}
  if(c&&Date.now()-c.t<60000)return Promise.resolve(c.d);
  return fetch(API+'/public/data',{cache:'no-store'}).then(function(r){return r.json()}).then(function(d){try{sessionStorage.setItem('nvCms',JSON.stringify({t:Date.now(),d:d}))}catch(e){}return d})}
/* views */
try{var pg=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'')||'index';var payload=JSON.stringify({p:pg,m:matchMedia('(max-width:760px)').matches?1:0});
  if(!sessionStorage.getItem('nvHit:'+pg)){sessionStorage.setItem('nvHit:'+pg,'1');if(navigator.sendBeacon)navigator.sendBeacon(API+'/hit',new Blob([payload],{type:'application/json'}));else fetch(API+'/hit',{method:'POST',body:payload,headers:{'Content-Type':'application/json'},keepalive:true})}}catch(e){}

load().then(function(D){
  var A=D.apts||{},ids=Object.keys(A);window.NV_APTS=A;document.dispatchEvent(new Event('nv:apts'));
  /* ---- apartment page ---- */
  var pc=document.getElementById('pc');
  var qid=new URLSearchParams(location.search).get('id');
  var aptId=pc&&(pc.dataset.apt||qid);
  if(pc&&qid&&!pc.dataset.apt){pc.dataset.apt=qid}
  if(pc&&aptId){var a=A[aptId];
    if(!a&&qid){document.title='Апартамент не найден — Nova Home';return}
    if(a){
      var name=a.name||('Suite '+aptId);
      document.querySelectorAll('.ap-head h1, .crumbs span').forEach(function(el){el.textContent=name});
      document.title=name+' — '+[a.type,a.area?a.area+' m²':''].filter(Boolean).join(' · ')+' — Nova Home';
      var h2=document.querySelector('.ap-body h2');if(h2)h2.textContent=[a.type,a.area?a.area+' m²':'',a.floor?a.floor+' этаж':''].filter(Boolean).join(' · ');
      var lead=document.querySelector('.ap-body .lead');if(lead&&a.desc)lead.textContent=a.desc;
      if(a.price){pc.dataset.price=a.price;var pr=pc.querySelector('.price');if(pr)pr.innerHTML='$'+a.price+'<span> / сутки</span>';window.NV_PRICE=+a.price;if(window.NV_CAL&&window.NV_CAL.recalc)window.NV_CAL.recalc()}
      var gs=document.getElementById('gs');if(gs&&a.guests){var cur=gs.value;gs.innerHTML='';for(var g=1;g<=a.guests;g++){var o=document.createElement('option');o.value=g;o.textContent=g+(g===1?' гость':g<5?' гостя':' гостей');gs.appendChild(o)}if(cur&&+cur<=a.guests)gs.value=cur}
      document.querySelectorAll('.facts-grid .fact, .ap-facts .fact').forEach(function(f){var k=(f.querySelector('.k')||{}).textContent||'';var v=f.querySelector('.v');if(!v)return;
        if(/формат/i.test(k)&&a.type)v.textContent=a.type;if(/площад/i.test(k)&&a.area)v.textContent=a.area;if(/этаж/i.test(k)&&a.floor)v.textContent=a.floor;if(/спальн/i.test(k)&&a.beds)v.textContent=a.beds});
      if(a.hidden){var bb=document.getElementById('bookBtn');if(bb){bb.textContent='Временно недоступен';bb.setAttribute('aria-disabled','true');bb.style.pointerEvents='none';bb.style.opacity='.5'}}
      if(a.photos&&a.photos.length)buildGallery(a.photos,name);
    }
  }
  function buildGallery(ph,name){var gal=document.querySelector('.gal');if(!gal)return;
    var old=document.querySelector('.lb');if(old)old.remove();var oc=document.querySelector('.gal-cnt');if(oc)oc.remove();
    var mob=matchMedia('(max-width:760px)').matches,show=mob?ph:ph.slice(0,5);
    gal.innerHTML=show.map(function(p,i){return '<div class="g reveal in slot-real" style="--d:'+(i*.08)+'s"><img src="'+esc(IMG(p.k))+'" alt="'+esc(name)+' — фото '+(i+1)+'" '+(i?'loading="lazy"':'fetchpriority="high"')+'>'+(i===0&&ph.length>1?'<span class="all"><i class="ph-bold ph-images"></i>Все фото ('+ph.length+')</span>':'')+'</div>'}).join('');
    var lbx=document.createElement('div');lbx.className='lb';lbx.innerHTML='<button class="lb-x" aria-label="Закрыть"><i class="ph-bold ph-x"></i></button><button class="lb-p" aria-label="Назад"><i class="ph-bold ph-caret-left"></i></button><img alt=""><button class="lb-n" aria-label="Вперёд"><i class="ph-bold ph-caret-right"></i></button><div class="lb-c"></div>';document.body.appendChild(lbx);
    var cur=0,im=lbx.querySelector('img'),cnt=lbx.querySelector('.lb-c');
    function open(i){cur=i;im.src=IMG(ph[cur].k);cnt.textContent=(cur+1)+' / '+ph.length;lbx.classList.add('on');document.body.style.overflow='hidden'}
    function close(){lbx.classList.remove('on');document.body.style.overflow=''}
    function nav(d){open((cur+d+ph.length)%ph.length)}
    lbx.querySelector('.lb-x').onclick=close;lbx.querySelector('.lb-p').onclick=function(){nav(-1)};lbx.querySelector('.lb-n').onclick=function(){nav(1)};lbx.addEventListener('click',function(e){if(e.target===lbx)close()});
    addEventListener('keydown',function(e){if(!lbx.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')nav(-1);if(e.key==='ArrowRight')nav(1)});
    gal.querySelectorAll('.g').forEach(function(x,i){x.addEventListener('click',function(){open(i)})});
    if(mob&&ph.length>1){var c=document.createElement('div');c.className='gal-cnt';c.textContent='1 / '+ph.length;gal.parentNode.style.position='relative';gal.parentNode.appendChild(c);gal.addEventListener('scroll',function(){c.textContent=(Math.round(gal.scrollLeft/gal.clientWidth)+1)+' / '+ph.length},{passive:true})}
  }
  /* ---- catalog cards (booking.html) + index articles ---- */
  document.querySelectorAll('.cat-card').forEach(function(c){var id=(c.getAttribute('href').match(/apartment-(\d+)|[?&]id=(\d+)/)||[]);id=id[1]||id[2];var a=A[id];if(!a)return;
    if(a.hidden){c.remove();return}
    if(a.photos&&a.photos[0]){var im=c.querySelector('.im');if(im){im.removeAttribute('data-bg');im.removeAttribute('data-bg-m')}if(im)im.style.backgroundImage='url("'+IMG(a.photos[0].t||a.photos[0].k)+'")'}
    if(a.price){c.dataset.price=a.price;var pr=c.querySelector('.pr span:first-child');if(pr)pr.innerHTML='$'+a.price+' <small>/ сутки</small>'}
    if(a.name){var h3=c.querySelector('h3');if(h3)h3.textContent=a.name}
    if(a.type)c.dataset.type=a.type;if(a.guests)c.dataset.guests=a.guests;
    var m=c.querySelector('.m');if(m)m.textContent=[a.type,a.area?a.area+' m²':'',a.guests?'до '+a.guests+' гостей':''].filter(Boolean).join(' · ');
    var eb=c.querySelector('.eyebrow');if(eb)eb.textContent=[a.complex,a.floor?a.floor+' этаж':'',a.view].filter(Boolean).join(' · ');
    var tg=c.querySelector('.apt-tag');if(tg){if(a.tag)tg.textContent=a.tag;else tg.remove()}
  });
  /* new apartments without static page */
  var grid=document.getElementById('catGrid');
  if(grid){var have={};grid.querySelectorAll('.cat-card').forEach(function(c){var id=(c.getAttribute('href').match(/apartment-(\d+)|[?&]id=(\d+)/)||[]);have[id[1]||id[2]]=1});
    ids.filter(function(id){return !have[id]&&!A[id].hidden}).forEach(function(id){var a=A[id];var el=document.createElement('a');el.className='reveal in cat-card';el.href='apartment.html?id='+id;el.dataset.type=a.type||'';el.dataset.guests=a.guests||'';el.dataset.complex=a.complex||'';el.dataset.price=a.price||'';el.dataset.floor=a.floor||'';el.dataset.extra=a.extra||'';
      el.innerHTML='<div class="im" style="background-image:url(\''+esc(IMG(a.photos&&a.photos[0]&&(a.photos[0].t||a.photos[0].k)))+'\')">'+(a.tag?'<span class="apt-tag">'+esc(a.tag)+'</span>':'')+'</div><div class="bd"><div class="eyebrow" style="font-size:11px">'+esc([a.complex,a.floor?a.floor+' этаж':'',a.view].filter(Boolean).join(' · '))+'</div><h3>'+esc(a.name||'Suite '+id)+'</h3><div class="m">'+esc([a.type,a.area?a.area+' m²':'',a.guests?'до '+a.guests+' гостей':''].filter(Boolean).join(' · '))+'</div><div class="pr"><span>$'+esc(a.price||'—')+' <small>/ сутки</small></span><span class="rate-pill"><i class="ph-fill ph-star"></i>4.9</span></div></div>';
      grid.appendChild(el)});
    var cc=document.getElementById('catCount');if(cc){var n=grid.querySelectorAll('.cat-card').length;cc.textContent='Показано '+n+' из '+n}
  }
  document.querySelectorAll('article.apt').forEach(function(ar){var l=ar.querySelector('a[href*="apartment-"]');var id=l&&(l.getAttribute('href').match(/apartment-(\d+)/)||[])[1];var a=A[id];if(!a)return;
    if(a.hidden){ar.remove();return}
    if(a.photos&&a.photos[0]){var ph=ar.querySelector('.apt-photo');if(ph)ph.style.backgroundImage='url("'+IMG(a.photos[0].k)+'")'}
    if(a.price){var pr=ar.querySelector('.price');if(pr)pr.innerHTML='от $'+a.price+'<span> / сутки</span>'}
    if(a.name){var h3=ar.querySelector('h3');if(h3)h3.textContent=a.name}
  });
  /* ---- promo banner ---- */
  var today=new Date().toISOString().slice(0,10);
  var promo=(D.promos||[]).filter(function(p){return p.active&&(!p.from||p.from<=today)&&(!p.to||p.to>=today)})[0];
  if(promo&&!sessionStorage.getItem('nvPromoX:'+promo.id)&&!document.getElementById('pc')){
    var b=document.createElement('div');b.className='nv-promo';b.innerHTML='<i class="ph-fill ph-seal-percent"></i><div><b>'+esc(promo.title)+'</b>'+(promo.text?'<span>'+esc(promo.text)+'</span>':'')+'</div>'+(promo.code?'<code>'+esc(promo.code)+'</code>':'')+'<button aria-label="Закрыть"><i class="ph-bold ph-x"></i></button>';
    document.body.appendChild(b);requestAnimationFrame(function(){b.classList.add('on')});b.querySelector('button').onclick=function(){b.classList.remove('on');sessionStorage.setItem('nvPromoX:'+promo.id,'1');setTimeout(function(){b.remove()},400)};
  }
  if(promo&&promo.percent)window.NV_PROMO={percent:+promo.percent,title:promo.title,apts:promo.apts||[]};
  /* ---- blog ---- */
  var bg=document.querySelector('.blog-grid');var posts=(D.blog||[]).filter(function(p){return p.published});
  if(bg&&posts.length){var wrap=bg.parentNode;
    posts.forEach(function(p,i){var card=document.createElement('a');card.className='post reveal in';card.href='#'+p.slug;card.innerHTML='<div class="img" style="background-image:url(\''+esc(IMG(p.cover))+'\')"></div><div class="body"><div class="eyebrow">'+esc(p.cat||NV_T('Блог'))+(p.min?' · '+p.min+' мин':'')+'</div><h3>'+esc(p.title)+'</h3><p>'+esc(p.excerpt||'')+'</p><span class="arrow-link">Читать статью</span></div>';bg.insertBefore(card,bg.firstChild);
      var art=document.createElement('article');art.className='article reveal in';art.id=p.slug;art.innerHTML='<div class="img" style="background-image:url(\''+esc(IMG(p.cover))+'\')"></div><div><div class="eyebrow">'+esc(p.cat||NV_T('Блог'))+'</div><h2>'+esc(p.title)+'</h2>'+String(p.body||'').split(/\n{2,}/).map(function(t){return '<p>'+esc(t).replace(/\n/g,'<br>')+'</p>'}).join('')+'<a class="arrow-link" href="booking.html">Забронировать апартаменты</a></div>';
      var firstArt=wrap.querySelector('article.article');wrap.insertBefore(art,firstArt)});
    var cnt=wrap.querySelector('.eyebrow');if(cnt&&/стат/i.test(cnt.textContent)){var n=wrap.querySelectorAll('.post').length;cnt.textContent=n+' '+(n%10===1&&n%100!==11?'статья':n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'статьи':'статей')}
  }
}).catch(function(){});
/* mini map per apartment (lazy) */
(function(){var fr=document.getElementById('aptMapFrame');if(!fr)return;var id=(location.pathname.match(/apartment-(\d+)/)||[])[1]||new URLSearchParams(location.search).get('id');
fetch('apartments.json',{cache:'force-cache'}).then(function(r){return r.json()}).then(function(j){var L=Array.isArray(j)?j:(j.apts||Object.values(j));var a=L.filter(function(x){return String(x.id)===String(id)})[0]||{};var cm=window.NV_APTS&&window.NV_APTS[id];if(cm){['lat','lng','address','mapUrl','complex'].forEach(function(k){if(cm[k])a[k]=cm[k]})}if(!a.lat)return;
 var t=document.getElementById('aptMapTitle'),ad=document.getElementById('aptMapAddr'),lk=document.getElementById('aptMapLink');if(t)t.textContent='ЖК '+a.complex;if(ad)ad.textContent=a.address||'';
 var q=a.lat+','+a.lng;if(lk)lk.href=a.mapUrl||('https://www.google.com/maps?q='+q);
 function put(){if(fr.firstChild)return;if(window.NV_APT_MAP){window.NV_APT_MAP(fr,a).catch(function(){});return}var i=document.createElement('iframe');i.title='Карта: '+(a.address||a.complex);i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';i.src='https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=15&output=embed';fr.appendChild(i)}
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();put()}},{rootMargin:'400px 0px'});io.observe(fr)}else put()}).catch(function(){})})();

})();
