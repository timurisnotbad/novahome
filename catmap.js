/* Nova Home — catalog map toggle */
(function(){var grid=document.getElementById('catGrid');if(!grid)return;
var bar=document.createElement('div');bar.className='cat-view';bar.innerHTML='<button type="button" class="on" data-v="list"><i class="ph-bold ph-squares-four"></i>Список</button><button type="button" data-v="map"><i class="ph-bold ph-map-trifold"></i>Карта</button>';
var cnt=document.getElementById('catCount');(cnt||grid).parentNode.insertBefore(bar,cnt||grid);
var box=document.createElement('div');box.id='catMap';box.className='cat-map';box.hidden=true;grid.parentNode.insertBefore(box,grid.nextSibling);
var ctl=null,J=null;
function coords(){if(J)return Promise.resolve(J);return fetch('apartments.json',{cache:'force-cache'}).then(function(r){return r.json()}).then(function(j){J={};(Array.isArray(j)?j:(j.apts||Object.values(j))).forEach(function(a){J[a.id]=a});return J}).catch(function(){J={};return J})}
function items(){var A=window.NV_APTS||{};return Array.prototype.map.call(grid.querySelectorAll('.cat-card'),function(c){var id=(c.getAttribute('href').match(/apartment-(\d+)/)||[])[1];var j=J[id]||{},cm=A[id]||{};var lat=cm.lat||j.lat,lng=cm.lng||j.lng;
  var im=c.querySelector('.im');var img=(im&&(im.getAttribute('data-bg-m')||im.getAttribute('data-bg')))||(im&&(im.style.backgroundImage||'').replace(/^url\(["']?|["']?\)$/g,''))||'';
  var searched=grid.classList.contains('searched'),na=c.classList.contains('na'),tot=c.querySelector('.nvs-tot b');var price=+(c.dataset.price||cm.price||j.price||0);
  var hidden=c.style.display==='none'||c.hidden;
  return {id:id,complex:(c.dataset.complex||cm.complex||j.complex||''),lat:lat,lng:lng,price:price,href:c.getAttribute('href'),name:(c.querySelector('h3')||{}).textContent||('Suite '+id),sub:(c.querySelector('.m')||{}).textContent||'',img:img,state:hidden?'busy':searched?(na?'busy':'free'):'',label:searched&&!na&&tot?tot.textContent:'$'+price,total:tot?tot.textContent:''}}).filter(function(x){return x.lat&&x.lng})}
function show(v){bar.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.dataset.v===v)});box.hidden=v!=='map';grid.style.display=v==='map'?'none':'';
  if(v==='map'){coords().then(function(){if(!window.NV_CAT_MAP)return;if(ctl){ctl.update(items());setTimeout(function(){ctl.map.invalidateSize()},50);return}window.NV_CAT_MAP(box,items()).then(function(x){ctl=x})})}}
bar.addEventListener('click',function(e){var b=e.target.closest('button');if(b)show(b.dataset.v)});
var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(function(){if(ctl&&!box.hidden)ctl.update(items())},150)}).observe(grid,{attributes:true,subtree:true,attributeFilter:['class','style']});
if(/[?&]view=map/.test(location.search))show('map');
})();
