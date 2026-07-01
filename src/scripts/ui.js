// Ported verbatim from iran_investments_with_globe.html — cross-page UI behavior:
// progress bar, custom cursor, scroll-reveal, 3D card tilt, magnetic buttons.
export function initCommonUI(){
  // ── PROGRESS BAR ──
  const pgBar=document.getElementById('pgBar');
  window.addEventListener('scroll',()=>{const p=(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight))*100;pgBar.style.width=Math.min(p,100)+'%';},{passive:true});

  // ── CUSTOM CURSOR ──
  const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing');
  let rx=0,ry=0;
  document.addEventListener('mousemove',e=>{dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';},{passive:true});
  (function animCursor(){rx+=(parseFloat(dot.style.left||0)-rx)*.15;ry+=(parseFloat(dot.style.top||0)-ry)*.15;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animCursor);})();
  document.addEventListener('mouseenter',()=>{dot.style.opacity='1';ring.style.opacity='.4';});
  document.addEventListener('mouseleave',()=>{dot.style.opacity='0';ring.style.opacity='0';});
  document.querySelectorAll('a,button,.a-card,.sl-btn,.why-item').forEach(el=>{el.addEventListener('mouseenter',()=>{dot.style.width='14px';dot.style.height='14px';ring.style.width='44px';ring.style.height='44px';ring.style.opacity='.2';});el.addEventListener('mouseleave',()=>{dot.style.width='8px';dot.style.height='8px';ring.style.width='28px';ring.style.height='28px';ring.style.opacity='.4';});});

  // ── SCROLL REVEAL ──
  const sObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');sObs.unobserve(e.target);}});},{threshold:.06,rootMargin:'0px 0px -40px 0px'});
  window.hookReveal=function hookReveal(){document.querySelectorAll('.sr,.sr-l,.sr-r,.why-item').forEach(el=>{if(!el.classList.contains('vis'))sObs.observe(el);});};

  // ── 3D CARD TILT ──
  let tiltCard=null;
  document.addEventListener('mousemove',e=>{
    const card=e.target.closest?.('.a-card');
    if(tiltCard&&tiltCard!==card){tiltCard.classList.remove('tilting');tiltCard.style.transform='';tiltCard=null;}
    if(card){const r=card.getBoundingClientRect();const rx=(e.clientY-r.top)/r.height-.5;const ry=(e.clientX-r.left)/r.width-.5;card.classList.add('tilting');card.style.transform=`perspective(600px) rotateX(${rx*-10}deg) rotateY(${ry*10}deg) translateY(-5px) scale(1.02)`;tiltCard=card;}
  },{passive:true});
  document.addEventListener('mouseleave',e=>{const c=e.target.closest?.('.a-card');if(c){c.classList.remove('tilting');c.style.transform='';}},true);

  // ── MAGNETIC BUTTONS ──
  window.hookMagnetic=function hookMagnetic(){
    document.querySelectorAll('.will-mag,.btn-primary,.btn-white,.nav-cta').forEach(btn=>{
      if(btn.dataset.mag)return;btn.dataset.mag='1';
      btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.2;const y=(e.clientY-r.top-r.height/2)*.2;btn.style.transform=`translate(${x}px,${y}px)`;});
      btn.addEventListener('mouseleave',()=>{btn.style.transform='';btn.style.transition='transform .45s cubic-bezier(.23,1,.32,1)';});
      btn.addEventListener('mouseenter',()=>{btn.style.transition='transform .1s';});
    });
  };

  window.hookAll=function hookAll(){window.hookReveal();window.hookMagnetic();};
  window.hookAll();
}
