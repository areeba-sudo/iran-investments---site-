// Ported verbatim from iran_investments_with_globe.html — Beehiiv subscribe modal.
// DO NOT change BEEHIIV or the subClick logic — this is the client's live newsletter integration.
export const BEEHIIV='https://iraninvestments-newsletter-c22238.beehiiv.com/subscribe';

export function openModal(){document.getElementById('modalOverlay').classList.add('open');setTimeout(()=>document.getElementById('mEmail').focus(),280);document.body.style.overflow='hidden';}
export function closeModal(){document.getElementById('modalOverlay').classList.remove('open');document.body.style.overflow='';setTimeout(()=>{document.getElementById('mEmail').value='';document.getElementById('mErr').textContent='';document.getElementById('mEmail').classList.remove('er');document.getElementById('mFrm').classList.remove('hide');document.getElementById('mSuc').classList.remove('show');},300);}
export function ovClick(e){if(e.target===document.getElementById('modalOverlay'))closeModal();}
export function subClick(el){const em=document.getElementById('mEmail'),er=document.getElementById('mErr'),v=em.value.trim();er.textContent='';em.classList.remove('er');if(!v){er.textContent='Please enter your email address.';em.classList.add('er');return false;}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){er.textContent='Please enter a valid email address.';em.classList.add('er');return false;}el.href=`${BEEHIIV}?email=${encodeURIComponent(v)}&utm_source=website&utm_medium=organic`;setTimeout(()=>{document.getElementById('mFrm').classList.add('hide');document.getElementById('mSuc').classList.add('show');},300);return true;}

export function initSubscribeModal(){
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  window.openModal=openModal;
  window.closeModal=closeModal;
  window.ovClick=ovClick;
  window.subClick=subClick;
}
