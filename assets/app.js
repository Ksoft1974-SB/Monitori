(function(){
var C=window.COURSE,N=C.N,B=document.body,I=+B.dataset.page,R=B.dataset.root,BASE=location.href,KEY="cri:"+C.key;
var $=function(s){return document.querySelector(s)},root=document.documentElement;
var pad=function(j){return("00"+j).slice(-3)};
var rel=function(j){return R+(j==1?"index.html":"pagine/p"+pad(j)+".html")};
var abs=function(p){return new URL(p,BASE).href};
function st(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
function lesson(p){var k=-1;C.lessons.forEach(function(l,j){if(p>=l[1])k=j});return k}
var th=$("#theme");
if(th)th.onclick=function(){var d=root.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),n=d=="dark"?"light":"dark";root.dataset.theme=n;st("cri:theme",n)};
function help(){var d=$("#helpd");if(d&&d.showModal)d.showModal()}
if($("#help"))$("#help").onclick=help;
if($("#helpclose"))$("#helpclose").onclick=function(){$("#helpd").close()};
if(I===0)return overview();
var img=$("#slide"),cur=I,drawer=$("#drawer"),scrim=$("#scrim");
function setOff(id,v){var e=$(id);if(e)e.classList.toggle("off",v)}
function update(j){
  $("#num").value=j;$("#bar").style.width=(j/N*100)+"%";
  var k=lesson(j);$("#chip").textContent=k<0?"Introduzione":"Lezione "+(k+1)+" · "+C.lessons[k][0];
  setOff("#first",j==1);setOff("#prev",j==1);setOff("#next",j==N);setOff("#last",j==N);
  [["#home",1],["#first",1],["#prev",j-1],["#next",j+1],["#last",N]].forEach(function(a){var e=$(a[0]);if(e)e.href=abs(rel(Math.max(1,Math.min(N,a[1]))))});
  document.title=C.title+" · "+j+"/"+N;
  try{history.replaceState(null,"",abs(rel(j)))}catch(e){try{location.hash=j}catch(_){}}
  st(KEY,j);
  document.querySelectorAll("#lessons button").forEach(function(b){b.classList.toggle("act",+b.dataset.k===k)});
  [j-1,j+1,j+2].forEach(function(p){if(p>=1&&p<=N)(new Image).src=abs(R+"img/s-"+pad(p)+".jpg")});
}
function show(j){
  j=Math.max(1,Math.min(N,j));if(j===cur)return;cur=j;
  img.classList.add("sw");var n=new Image;
  n.onload=n.onerror=function(){if(cur!==j)return;img.src=n.src;img.alt="Diapositiva "+j+" di "+N;img.classList.remove("sw")};
  n.src=abs(R+"img/s-"+pad(j)+".jpg");update(j);
}
var act={first:function(){show(1)},home:function(){show(1)},prev:function(){show(cur-1)},next:function(){show(cur+1)},last:function(){show(N)}};
document.querySelectorAll("[data-go]").forEach(function(e){e.addEventListener("click",function(ev){if(ev.metaKey||ev.ctrlKey||ev.shiftKey)return;ev.preventDefault();act[e.dataset.go]();})});
$("#num").onkeydown=function(e){if(e.key=="Enter"){show(parseInt(this.value)||cur);this.blur()}e.stopPropagation()};
$("#num").onchange=function(){show(parseInt(this.value)||cur)};
$(".stage").onclick=function(e){show(cur+(e.clientX<innerWidth*.3?-1:1))};
function menu(on){drawer.classList.toggle("on",on);scrim.classList.toggle("on",on);if(on){var a=$("#lessons .act");if(a)a.scrollIntoView({block:"center"})}}
$("#menu").onclick=function(){menu(true)};$("#close").onclick=scrim.onclick=function(){menu(false)};
var ul=$("#lessons"),h='<li><button data-k="-1" data-p="1"><span class="n">★</span><span class="t">Introduzione</span><small>p. 1</small></button></li>';
C.lessons.forEach(function(l,j){h+='<li><button data-k="'+j+'" data-p="'+l[1]+'"><span class="n">'+(j+1)+'</span><span class="t">'+l[0]+'</span><small>p. '+l[1]+'</small></button></li>'});
ul.innerHTML=h;
ul.onclick=function(e){var b=e.target.closest("button");if(b){show(+b.dataset.p);menu(false)}};
function fs(){if(document.fullscreenElement)document.exitFullscreen();else if(root.requestFullscreen)root.requestFullscreen()}
$("#fs").onclick=fs;
document.addEventListener("fullscreenchange",function(){B.classList.toggle("fs",!!document.fullscreenElement)});
var tm;document.addEventListener("mousemove",function(){B.classList.add("show");clearTimeout(tm);tm=setTimeout(function(){B.classList.remove("show")},2500)});
document.addEventListener("keydown",function(e){
  if(e.target.tagName=="INPUT"||e.ctrlKey||e.metaKey||e.altKey)return;var k=e.key;
  if(k=="ArrowRight"||k=="PageDown"||k==" "){e.preventDefault();show(cur+1)}
  else if(k=="ArrowLeft"||k=="PageUp"){show(cur-1)}
  else if(k=="Home"){show(1)}else if(k=="End"){show(N)}
  else if(k=="f"||k=="F")fs();else if(k=="m"||k=="M")menu(!drawer.classList.contains("on"));
  else if(k=="g"||k=="G")location.href=abs(R+"indice.html");
  else if(k=="t"||k=="T")th.click();else if(k=="?")help();else if(k=="Escape")menu(false);
});
var x0=null;document.addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});
document.addEventListener("touchend",function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>60)show(cur+(d<0?1:-1));x0=null});
update(I);
var hh=parseInt((location.hash||"").slice(1));if(hh>0&&hh!==I)show(hh);
else if(I===1){var s=+st(KEY);if(s>1&&s<=N){var r=$("#resume");r.hidden=false;r.textContent="Riprendi da pagina "+s;r.onclick=function(){r.hidden=true;show(s)};setTimeout(function(){r.hidden=true},9000)}}
function overview(){
  var secs=[{t:"Introduzione",s:1,e:C.lessons[0][1]-1}];
  C.lessons.forEach(function(l,j){secs.push({t:(j+1)+". "+l[0],s:l[1],e:j+1<C.lessons.length?C.lessons[j+1][1]-1:N})});
  var h="";secs.forEach(function(s){
    h+='<section data-t="'+s.t.toLowerCase()+'"><h2>'+s.t+'<small>pagine '+s.s+'–'+s.e+'</small></h2><div class="tg">';
    for(var p=s.s;p<=s.e;p++)h+='<a href="'+rel(p)+'"><img loading="lazy" alt="Pagina '+p+'" src="thumbs/t-'+pad(p)+'.jpg"><b>'+p+'</b></a>';
    h+='</div></section>'});
  $("#secs").innerHTML=h;
  $("#q").oninput=function(){var q=this.value.trim().toLowerCase();document.querySelectorAll("#secs section").forEach(function(s){s.hidden=q&&s.dataset.t.indexOf(q)<0})};
  document.addEventListener("keydown",function(e){if(e.key=="Home"||e.key=="Escape"){if(e.target.id!="q")location.href="index.html"}});
}
})();
