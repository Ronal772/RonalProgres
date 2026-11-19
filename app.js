
var BULAN=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
var HARI=["M","S","S","R","K","J","S"];
var st=null;
try{st=JSON.parse(localStorage.getItem("habit-tracker")||"null")}catch(e){}
if(!st||!st.habits){st={habits:["Bangun jam 06.00","Meditasi","Olahraga","Mandi air dingin","Kerja fokus","Baca 10 halaman","Belajar skill baru","Tidur sebelum 23.00"].map(function(n,i){return{id:"h"+i,name:n}}),done:{}}}
var prevMp=0,anim=true,dirty=false,dbRef=null,wt=null,RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
function sync(t){var e=document.getElementById("sync");if(e)e.textContent="· "+t}
var cfg=null,shaCur=null,pushT=null;
try{cfg=JSON.parse(localStorage.getItem("ronal-sync")||"null")}catch(e){}
function save(){st.updated=Date.now();try{localStorage.setItem("habit-tracker",JSON.stringify(st))}catch(e){}
if(!cfg){sync("Tersimpan di perangkat");return}
sync("Menyimpan…");clearTimeout(pushT);pushT=setTimeout(function(){push().catch(function(){sync("Gagal sinkron, tersimpan di perangkat")})},2500)}
function gh(m,body){return fetch("https://api.github.com/repos/"+cfg.owner+"/"+cfg.repo+"/contents/data.json",{method:m,headers:{"Authorization":"Bearer "+cfg.token,"Accept":"application/vnd.github+json"},body:body?JSON.stringify(body):undefined})}
function b64enc(s){return btoa(unescape(encodeURIComponent(s)))}
function b64dec(s){return decodeURIComponent(escape(atob(s.replace(/\n/g,""))))}
function push(retry){var body={message:"update progres",content:b64enc(JSON.stringify(st))};if(shaCur)body.sha=shaCur;
return gh("PUT",body).then(function(r){if((r.status===409||r.status===422)&&!retry){return gh("GET").then(function(x){return x.ok?x.json():{}}).then(function(j){shaCur=j.sha||null;return push(true)})}
if(!r.ok)throw 0;return r.json().then(function(j){shaCur=j.content.sha;sync("Tersimpan di GitHub ✓")})})}
function pull(){if(!cfg)return;sync("Mengambil dari GitHub…");
gh("GET").then(function(r){if(r.status===404){shaCur=null;return push()}if(!r.ok)throw 0;
return r.json().then(function(j){shaCur=j.sha;var d=JSON.parse(b64dec(j.content));
if(d.habits&&(d.updated||0)>(st.updated||0)){st={habits:d.habits,done:d.done||{},updated:d.updated};try{localStorage.setItem("habit-tracker",JSON.stringify(st))}catch(e){}render();sync("Tersimpan di GitHub ✓")}
else if((st.updated||0)>(d.updated||0)){return push()}else sync("Tersimpan di GitHub ✓")})}).catch(function(){sync("Gagal terhubung ke GitHub, cek token dan nama repo")})}
function streak(){var c=0,d=new Date();d.setHours(0,0,0,0);function any(x){return st.habits.some(function(h){return st.done[h.id+"|"+x.getFullYear()+"-"+x.getMonth()+"-"+x.getDate()]})}
if(!any(d))d.setDate(d.getDate()-1);while(c<800&&any(d)){c++;d.setDate(d.getDate()-1)}return c}
function tween(a,b,f){if(RM||a===b){f(b);return}var t0=performance.now();(function s(t){var k=Math.min(1,(t-t0)/900);k=1-Math.pow(1-k,3);f(a+(b-a)*k);if(k<1)requestAnimationFrame(s)})(t0)}
function afterRender(mp){
var rc=document.getElementById("rc"),rt=document.getElementById("rt"),C=2*Math.PI*44;
tween(prevMp,mp,function(v){rc.setAttribute("stroke-dasharray",(C*v)+" "+C);rt.textContent=pct(v)});prevMp=mp;
var pl=document.getElementById("pl");
if(pl){var p=pl.getAttribute("points").split(" ").pop().split(",");pl.parentNode.insertAdjacentHTML("beforeend",'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#d4f35a"/><circle class="dot" cx="'+p[0]+'" cy="'+p[1]+'" r="4" fill="#d4f35a"/>');
if(anim&&!RM){var L=pl.getTotalLength();pl.style.strokeDasharray=L;pl.style.strokeDashoffset=L;pl.getBoundingClientRect();pl.style.transition="stroke-dashoffset 1.3s ease";pl.style.strokeDashoffset=0}}
if(anim){var w=document.querySelector(".wrap");w.classList.add("anim");setTimeout(function(){w.classList.remove("anim")},1400);anim=false}}
function burst(el,n,big){var r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,cols=["#d4f35a","#5ad4f3","#ffffff","#ff9ad4"];for(var i=0;i<n;i++){var s=document.createElement("span"),a=Math.random()*6.28,d=(big?90:34)+Math.random()*(big?160:30);s.className="spark";s.style.left=x+"px";s.style.top=y+"px";s.style.background=big?cols[i%4]:"#d4f35a";s.style.setProperty("--x",Math.cos(a)*d+"px");s.style.setProperty("--y",Math.sin(a)*d+"px");document.body.appendChild(s);setTimeout(function(e){e.remove()},900,s)}}
function toast(m){var t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},2700)}
function celebrate(id,d,on){var b=document.querySelector('[data-h="'+id+'"][data-d="'+d+'"]');if(!b)return;b.classList.add("pop");b.addEventListener("animationend",function(){b.classList.remove("pop")},{once:true});if(!on||RM)return;burst(b,8);if(st.habits.length&&dayPct(d)===1){burst(b,44,true);toast("Hari sempurna! Semua kebiasaan selesai 🔥")}}
var now=new Date(),vy=now.getFullYear(),vm=now.getMonth();
function key(id,d){return id+"|"+vy+"-"+vm+"-"+d}
function isDone(id,d){return !!st.done[key(id,d)]}
function dim(){return new Date(vy,vm+1,0).getDate()}
function elapsed(){var c=vy*12+vm,t=now.getFullYear()*12+now.getMonth();return c<t?dim():c===t?now.getDate():0}
function dayPct(d){var h=st.habits;if(!h.length)return 0;return h.filter(function(x){return isDone(x.id,d)}).length/h.length}
function pct(x){return Math.round(x*100)+"%"}
function ring(p){var r=44,c=2*Math.PI*r;return '<svg class="ring" width="110" height="110" viewBox="0 0 110 110" role="img" aria-label="'+pct(p)+'"><circle cx="55" cy="55" r="'+r+'" fill="none" stroke="#26262a" stroke-width="7"/><circle id="rc" cx="55" cy="55" r="'+r+'" fill="none" stroke="#d4f35a" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+(c*p)+" "+c+'" transform="rotate(-90 55 55)"/><text id="rt" x="55" y="61" text-anchor="middle">'+pct(p)+'</text></svg>'}
function render(){
var n=dim(),e=elapsed(),H=st.habits,isNow=(vy===now.getFullYear()&&vm===now.getMonth());
document.getElementById("title").textContent=BULAN[vm]+" "+vy;
var total=0;for(var d=1;d<=e;d++)H.forEach(function(h){if(isDone(h.id,d))total++});
var mp=(H.length&&e)?total/(H.length*e):0;
var tp=isNow?dayPct(now.getDate()):0;
var wp=0;if(e){var s=Math.max(1,e-6),cnt=0;for(var d2=s;d2<=e;d2++)cnt+=dayPct(d2);wp=cnt/(e-s+1)}
var perfect=0;for(var d3=1;d3<=e;d3++)if(H.length&&dayPct(d3)===1)perfect++;
document.getElementById("stats").innerHTML=
'<div class="card ringcard">'+ring(mp)+'<div><div class="mute">Konsistensi bulan ini</div><div class="mute">'+total+' dari '+(H.length*e)+' tugas</div></div></div>'+
'<div class="card"><div class="mute">Hari ini</div><div class="big">'+(isNow?pct(tp):"–")+'</div><div class="bar"><i style="width:'+(isNow?tp*100:0)+'%"></i></div></div>'+
'<div class="card"><div class="mute">7 hari terakhir</div><div class="big">'+pct(wp)+'</div><div class="bar"><i style="width:'+wp*100+'%"></i></div></div>'+
'<div class="card"><div class="mute">Hari sempurna</div><div class="big">'+perfect+'</div><div class="mute">'+H.length+' kebiasaan aktif</div></div>'+'<div class="card"><div class="mute">Streak 🔥</div><div class="big">'+streak()+'</div><div class="mute">hari berturut-turut</div></div>';
var t='<tr><th></th>';
for(var i=1;i<=n;i++){var dt=new Date(vy,vm,i);t+='<th class="'+(isNow&&i===now.getDate()?"today":"")+'"><span>'+HARI[dt.getDay()]+'</span><br>'+i+'</th>'}
t+='</tr>';
H.forEach(function(h){
t+='<tr><td class="n"><button data-del="'+h.id+'" aria-label="Hapus '+h.name+'">×</button>'+h.name+'</td>';
for(var j=1;j<=n;j++){
var on=isDone(h.id,j),fut=j>e,tod=isNow&&j===now.getDate();
var cls="c"+(on?" on":"")+(!on&&!fut&&!tod?" miss":"")+(fut?" future":"")+(tod?" t":"");
t+='<td><button class="'+cls+'" data-h="'+h.id+'" data-d="'+j+'" '+(fut?"disabled":"")+' aria-label="'+h.name+' tanggal '+j+'">'+(on?"✓":"")+'</button></td>'}
t+='</tr>'});
if(!H.length)t='<tr><td class="empty">Belum ada kebiasaan. Tambahkan yang pertama di bawah.</td></tr>';
document.getElementById("mx").innerHTML=t;
var tr=document.getElementById("trend");
if(!e||!H.length){tr.innerHTML='<div class="empty">Belum ada data untuk bulan ini.</div>'}else{
var W=600,Hh=150,pts=[];for(var k=1;k<=e;k++){pts.push((e===1?W/2:(k-1)*(W-20)/(e-1)+10).toFixed(1)+","+(Hh-10-dayPct(k)*(Hh-30)).toFixed(1))}
tr.innerHTML='<svg viewBox="0 0 '+W+' '+Hh+'" width="100%" role="img" aria-label="Grafik konsistensi harian"><line x1="10" x2="'+(W-10)+'" y1="'+(Hh-10)+'" y2="'+(Hh-10)+'" stroke="#26262a"/><line x1="10" x2="'+(W-10)+'" y1="'+((Hh-10)-(Hh-30)/2)+'" y2="'+((Hh-10)-(Hh-30)/2)+'" stroke="#26262a" stroke-dasharray="3 4"/><polyline id="pl" points="'+pts.join(" ")+'" fill="none" stroke="#d4f35a" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg><div class="mute">Garis putus-putus: 50%. Garis bawah: 0%.</div>'}
var rk=H.map(function(h){var c=0;for(var q=1;q<=e;q++)if(isDone(h.id,q))c++;return{n:h.name,c:c,p:e?c/e:0}}).sort(function(a,b){return b.p-a.p});
document.getElementById("top").innerHTML=rk.length?rk.map(function(r){return '<li><span>'+r.n+'</span><span class="mute">'+r.c+'/'+e+' · '+pct(r.p)+'</span><div class="bar"><i style="width:'+r.p*100+'%"></i></div></li>'}).join(""):'<li class="empty">Belum ada kebiasaan.</li>';
afterRender(mp);
}
document.getElementById("mx").addEventListener("click",function(ev){
var b=ev.target.closest("button");if(!b)return;
if(b.dataset.del){if(confirm("Hapus kebiasaan ini beserta riwayatnya?")){st.habits=st.habits.filter(function(h){return h.id!==b.dataset.del});save();render()}return}
if(b.dataset.h){var k=key(b.dataset.h,b.dataset.d);var was=!!st.done[k];if(was)delete st.done[k];else st.done[k]=1;save();render();celebrate(b.dataset.h,+b.dataset.d,!was)}});
document.getElementById("add").addEventListener("submit",function(ev){ev.preventDefault();var i=document.getElementById("nh"),v=i.value.trim();if(!v)return;st.habits.push({id:"h"+Date.now(),name:v});i.value="";save();render()});
document.getElementById("prev").onclick=function(){vm--;if(vm<0){vm=11;vy--}prevMp=0;anim=true;render()};
document.getElementById("next").onclick=function(){vm++;if(vm>11){vm=0;vy++}prevMp=0;anim=true;render()};
document.getElementById("now").onclick=function(){vy=now.getFullYear();vm=now.getMonth();prevMp=0;anim=true;render()};
var br=document.getElementById("brand");"RONAL PROGRES".split("").forEach(function(c,i){var s=document.createElement("span");s.className=c===" "?"sp":"l";s.style.setProperty("--i",i);s.textContent=c===" "?"":c;s.setAttribute("aria-hidden","true");br.appendChild(s)});
br.insertAdjacentHTML("beforeend",'<i class="live"></i>');
render();
function $(i){return document.getElementById(i)}
$("exp").onclick=function(){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(st,null,1)],{type:"application/json"}));a.download="ronal-progres-"+new Date().toISOString().slice(0,10)+".json";a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},2000)};
$("imp").onclick=function(){$("file").click()};
$("file").onchange=function(){var f=this.files[0];this.value="";if(!f)return;f.text().then(function(t){var d=JSON.parse(t);if(!d.habits||!d.done)throw 0;if(!confirm("Ganti data sekarang dengan isi file ini?"))return;st={habits:d.habits,done:d.done};save();render();toast("Data berhasil diimpor")}).catch(function(){toast("File tidak valid")})};
$("cfgb").onclick=function(){$("go").value=cfg?cfg.owner:"";$("gr").value=cfg?cfg.repo:"";$("gt").value=cfg?cfg.token:"";$("dlg").showModal()};
$("gc").onclick=function(){$("dlg").close()};
$("gx").onclick=function(){cfg=null;try{localStorage.removeItem("ronal-sync")}catch(e){}$("dlg").close();sync("Tersimpan di perangkat")};
$("gs").onclick=function(){var o=$("go").value.trim(),r=$("gr").value.trim(),t=$("gt").value.trim();if(!o||!r||!t){toast("Lengkapi semua kolom");return}cfg={owner:o,repo:r,token:t};try{localStorage.setItem("ronal-sync",JSON.stringify(cfg))}catch(e){}$("dlg").close();pull()};
document.addEventListener("visibilitychange",function(){if(!document.hidden&&cfg)pull()});
sync(cfg?"Menyambung ke GitHub…":"Tersimpan di perangkat");
pull();
