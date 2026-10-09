(function(){var f=document.getElementById('corpForm');if(!f)return;var API=(window.NV_BOOK_API||'').replace(/\/$/,'');
f.addEventListener('submit',function(ev){ev.preventDefault();var er=document.getElementById('corpErr'),go=document.getElementById('corpGo');er.hidden=true;
 var d={};new FormData(f).forEach(function(v,k){d[k]=String(v).trim()});
 var bad=!d.company?'company':d.name.length<2?'name':!/^\+?[\d\s()-]{7,20}$/.test(d.phone)?'phone':d.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)?'email':'';
 if(bad){f.elements[bad].focus();er.textContent={company:'Укажите компанию',name:'Укажите контактное лицо',phone:'Проверьте телефон',email:'Проверьте email'}[bad];er.hidden=false;return}
 go.disabled=true;go.querySelector('span').textContent='Отправляем…';
 fetch(API+'/corporate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.message||'error');return j})}).then(function(){
  if(typeof gtag==='function')gtag('event','corporate_request',{people:d.people,period:d.period});
  f.innerHTML='<div class="bk-ok"><i class="ph-fill ph-check-circle"></i><h3>Запрос отправлен</h3><p>Свяжемся с '+d.name.replace(/[<>&]/g,'')+' в течение 2 часов и пришлём предложение с ценами и договором.</p><a class="btn btn-ghost" href="https://t.me/novahome_uzb" target="_blank" rel="noopener"><i class="ph-fill ph-telegram-logo"></i>Написать сейчас</a></div>'
 }).catch(function(e){go.disabled=false;go.querySelector('span').textContent='Отправить запрос';er.textContent='Не получилось отправить. Напишите нам в Telegram @novahome_uzb — ответим сразу.';er.hidden=false})})})();