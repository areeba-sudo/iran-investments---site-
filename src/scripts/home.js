// Ported verbatim from iran_investments_with_globe.html — homepage-only behavior:
// stats counter, hero counter, scroll journey, vision word reveal, blog slider, globe init.
import { initHero3D } from './globe.js';
import { initWhy3D } from './why3d.js';

export function initHome(){
  // ── STATS COUNTER ──
  const statObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting||e.target.dataset.done)return;e.target.dataset.done='1';const target=parseInt(e.target.dataset.target);const start=performance.now();const dur=1800;(function step(now){const t=Math.min((now-start)/dur,1);const ease=1-Math.pow(1-t,3);e.target.textContent=Math.round(ease*target);if(t<1)requestAnimationFrame(step);else e.target.textContent=target;})( performance.now());});},{threshold:.4});
  document.querySelectorAll('.stat-num').forEach(el=>statObs.observe(el));

  // ── HERO COUNTER ──
  (function(){const el=document.getElementById('ctrNum');if(!el)return;const start=performance.now();const dur=1800;(function step(now){const t=Math.min((now-start)/dur,1);el.textContent=Math.round((1-Math.pow(1-t,3))*10000).toLocaleString();if(t<1)requestAnimationFrame(step);else el.textContent='10,000';})( performance.now());})();

  // ── SCROLL JOURNEY ──
  let sjLast=-1;
  function updateSJ(){
    const outer=document.getElementById('sjOuter');if(!outer)return;
    const rect=outer.getBoundingClientRect();
    const total=outer.offsetHeight-window.innerHeight;
    const progress=Math.max(0,Math.min(1,-rect.top/total));
    const ch=Math.min(2,Math.floor(progress*3));
    if(ch===sjLast)return;sjLast=ch;
    document.querySelectorAll('.sj-ch').forEach((el,i)=>el.classList.toggle('active',i===ch));
    document.querySelectorAll('.sj-dot').forEach((el,i)=>el.classList.toggle('active',i===ch));
  }
  window.jumpChapter=function jumpChapter(n){
    const outer=document.getElementById('sjOuter');if(!outer)return;
    const start=outer.offsetTop;const total=outer.offsetHeight-window.innerHeight;
    window.scrollTo({top:start+n/3*total,behavior:'smooth'});
  };
  window.addEventListener('scroll',updateSJ,{passive:true});

  // ── VISION WORD REVEAL ──
  function hookVision(){
    const vq=document.getElementById('visionQuote');if(!vq||vq.dataset.split)return;
    vq.dataset.split='1';
    const words=vq.textContent.trim().split(' ');
    vq.innerHTML=words.map((w,i)=>`<span class="v-word" style="transition-delay:${i*.055}s">${w}&nbsp;</span>`).join('');
    const vo=new IntersectionObserver(en=>{if(en[0].isIntersecting){vq.querySelectorAll('.v-word').forEach(w=>w.classList.add('show'));vo.disconnect();}},{threshold:.3});
    vo.observe(vq);
  }
  hookVision();

  // ── SCROLL JOURNEY HEIGHT ──
  document.getElementById('sjOuter').style.height='360vh';

  // ── BLOG SLIDER (home) ──
  let homeIdx=0;
  const CARD_W=338;
  window.hSlide=function hSlide(d){
    const t=document.getElementById('homeTrack');if(!t)return;
    const count=t.children.length;
    homeIdx=Math.max(0,Math.min(homeIdx+d,Math.max(0,count-3)));
    t.style.transform=`translateX(-${homeIdx*CARD_W}px)`;
  };

  // ── 3D SCENES ──
  setTimeout(()=>{
    initHero3D();
    initWhy3D();
    window.hookAll?.();
  },200);
}
