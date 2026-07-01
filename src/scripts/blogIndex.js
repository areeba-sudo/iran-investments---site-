// Ported verbatim from iran_investments_with_globe.html (cpSlide) — per-category sliders on /blog.
export function initBlogIndex(){
  const CARD_W=338;
  const idx={};
  window.cpSlide=function cpSlide(cat,d){
    const t=document.getElementById('cpt-'+cat);if(!t)return;
    const count=t.children.length;
    idx[cat]=Math.max(0,Math.min((idx[cat]||0)+d,Math.max(0,count-3)));
    t.style.transform=`translateX(-${idx[cat]*CARD_W}px)`;
  };
}
