/* Nova Home — maps (Leaflet + CARTO light tiles, no API key). Loaded on demand. */
(function(){
var LV='1.9.4',CSS='https://unpkg.com/leaflet@'+LV+'/dist/leaflet.css',JS='https://unpkg.com/leaflet@'+LV+'/dist/leaflet.js';
var TILE='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
var TILE_LBL='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}';
var DEF=[41.3166,69.2486];
var p=null;
function load(){if(p)return p;p=new Promise(function(res,rej){if(window.L)return res(window.L);var l=document.createElement('link');l.rel='stylesheet';l.href=CSS;document.head.appendChild(l);var s=document.createElement('script');s.src=JS;s.onload=function(){res(window.L)};s.onerror=rej;document.head.appendChild(s)});return p}
function base(el,center,zoom){var m=L.map(el,{zoomControl:true,attributionControl:true,scrollWheelZoom:false,tap:true,preferCanvas:true,fadeAnimation:false,zoomSnap:0.5,maxZoom:18}).setView(center||DEF,zoom||15);
  L.tileLayer(TILE,{maxZoom:16,maxNativeZoom:16,updateWhenIdle:true,keepBuffer:2,attribution:'© Esri, OpenStreetMap'}).addTo(m);L.tileLayer(TILE_LBL,{maxZoom:16,maxNativeZoom:16,updateWhenIdle:true,pane:'overlayPane'}).addTo(m);m.on('focus',function(){m.scrollWheelZoom.enable()});m.on('blur',function(){m.scrollWheelZoom.disable()});return m}
/* parse "41.31, 69.24" or Google Maps links (@lat,lng / ?q=lat,lng / !3d..!4d..) */
function parse(s){s=String(s||'');var m=s.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)||s.match(/[?&](?:q|query|ll)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/)||s.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)||s.match(/^\s*(-?\d{1,2}\.\d+)\s*[,;\s]\s*(-?\d{1,3}\.\d+)\s*$/);return m?[+m[1],+m[2]]:null}
function priceIcon(txt,state){return L.divIcon({className:'nvm-pin-w',html:'<span class="nvm-pin '+(state||'')+'">'+txt+'</span>',iconSize:null,iconAnchor:[0,0]})}

/* ---- admin picker ---- */
window.NV_MAP_PICKER=function(el,cur,onPick){return load().then(function(){var c=cur&&cur.lat?[cur.lat,cur.lng]:DEF;var m=base(el,c,cur&&cur.lat?16:14);m.scrollWheelZoom.enable();
  var mk=L.marker(c,{draggable:true,icon:priceIcon('<i class="ph-fill ph-house"></i>','sel')}).addTo(m);
  function set(ll,fly){mk.setLatLng(ll);if(fly)m.setView(ll,17);onPick&&onPick({lat:+ll[0].toFixed(6),lng:+ll[1].toFixed(6)})}
  m.on('click',function(e){set([e.latlng.lat,e.latlng.lng])});mk.on('dragend',function(){var l=mk.getLatLng();set([l.lat,l.lng])});
  setTimeout(function(){m.invalidateSize()},200);return {set:function(ll){set(ll,true)},map:m}})};
window.NV_MAP_PARSE=parse;

/* ---- catalog map (Airbnb-style; same-building apartments grouped) ---- */
function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function groupBy(items){var g={},out=[];items.forEach(function(a){if(!a.lat||!a.lng)return;var k=(+a.lat).toFixed(4)+','+(+a.lng).toFixed(4);if(!g[k]){g[k]={key:k,lat:+a.lat,lng:+a.lng,list:[]};out.push(g[k])}g[k].list.push(a)});return out}
function minP(l){var p=l.map(function(a){return a.price}).filter(Boolean);return p.length?Math.min.apply(null,p):0}
function groupLabel(G){var l=G.list;if(l.length===1){var a=l[0];return {txt:esc(a.label||('$'+a.price)),st:a.state||''}}
  var searched=l.some(function(a){return a.state});var free=l.filter(function(a){return a.state==='free'});
  if(searched)return free.length?{txt:'<i class="ph-fill ph-buildings"></i>'+free.length+' свободно · от $'+minP(free),st:'free'}:{txt:'<i class="ph-fill ph-buildings"></i>Всё занято',st:'busy'};
  return {txt:'<i class="ph-fill ph-buildings"></i>'+l.length+' · от $'+minP(l),st:''}}
function groupPopup(G){var l=G.list.slice().sort(function(a,b){return (a.state==='busy')-(b.state==='busy')||a.price-b.price});
  if(l.length===1){var a=l[0],st=a.state;return '<a class="nvm-card" href="'+a.href+'"><span class="im" style="background-image:url(\''+esc(a.img)+'\')"></span><span class="bd"><b>'+esc(a.name)+'</b><small>'+esc(a.sub)+'</small><em>'+(st==='busy'?'Занято на эти даты':st==='free'?'Свободно · '+esc(a.total||('$'+a.price+' / ночь')):'$'+a.price+' / ночь')+'</em></span></a>'}
  var cx=(l[0].sub||'').split('·')[0];
  return '<div class="nvm-list"><div class="nvm-lh"><b>'+l.length+' апартаментов</b><small>'+esc(l[0].complex||'')+'</small></div><div class="nvm-rows">'+l.map(function(a){return '<a class="nvm-row'+(a.state==='busy'?' busy':'')+'" href="'+a.href+'"><span class="im" style="background-image:url(\''+esc(a.img)+'\')"></span><span class="t"><b>'+esc(a.name)+'</b><small>'+esc(a.sub)+'</small></span><span class="p">'+(a.state==='busy'?'Занято':a.state==='free'?esc(a.total||('$'+a.price)):'$'+a.price+'<small>/ночь</small>')+'</span></a>'}).join('')+'</div></div>'}
window.NV_CAT_MAP=function(el,items){return load().then(function(){var m=base(el,DEF,15);var marks={};
  function draw(list){var groups=groupBy(list),pts=[];groups.forEach(function(G){var lb=groupLabel(G);var mk=marks[G.key];
    if(!mk){mk=L.marker([G.lat,G.lng],{riseOnHover:true}).addTo(m);marks[G.key]=mk;mk.on('mouseover',function(){var p=mk.getElement()&&mk.getElement().querySelector('.nvm-pin');p&&p.classList.add('hov')});mk.on('mouseout',function(){var p=mk.getElement()&&mk.getElement().querySelector('.nvm-pin');p&&p.classList.remove('hov')})}
    mk.setIcon(priceIcon(lb.txt,lb.st+(G.list.length>1?' grp':'')));mk.setZIndexOffset(lb.st==='free'?500:0);
    mk.unbindPopup();mk.bindPopup(groupPopup(G),{closeButton:false,offset:[0,-6],maxWidth:320,minWidth:G.list.length>1?300:240,className:G.list.length>1?'nvm-pop-list':''});pts.push([G.lat,G.lng])});return pts}
  var pts=draw(items);if(pts.length>1)m.fitBounds(pts,{padding:[60,60],maxZoom:16});else if(pts.length)m.setView(pts[0],16);
  setTimeout(function(){m.invalidateSize()},200);
  return {map:m,update:function(list){draw(list)}}})};

/* ---- single apartment: Google Maps embed (no API key) ---- */
window.NV_APT_MAP=function(el,a){var q=encodeURIComponent((+a.lat).toFixed(6)+','+(+a.lng).toFixed(6));el.innerHTML='<iframe class="gmap" title="Карта" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="https://www.google.com/maps?q='+q+'&z=16&hl='+(document.documentElement.lang==='en'?'en':'ru')+'&output=embed"></iframe>';return Promise.resolve(el)};
})();
