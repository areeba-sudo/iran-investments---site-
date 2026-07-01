// Ported from iran_investments_with_globe.html (rCat's `catF` newest/oldest sort toggle).
export function initCategorySort(){
  window.setCF = function setCF(value){
    const grid = document.querySelector('.cat-grid');
    if (!grid) return;
    const cards = Array.from(grid.children);
    cards.sort((a, b) => {
      const da = new Date(a.dataset.date).getTime();
      const db = new Date(b.dataset.date).getTime();
      return value === 'newest' ? db - da : da - db;
    });
    cards.forEach((c) => grid.appendChild(c));
    window.hookAll?.();
  };
}
