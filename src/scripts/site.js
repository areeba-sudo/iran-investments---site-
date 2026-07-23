// Ported from the Claude Design handoff (DCLogic class) into plain vanilla JS.
// Drives the hero carousel, premium/subscribe modal, sleek subscribe form, and
// the scroll-reveal animations. All setup steps guard for element existence, so
// this is safe to run on any page that uses SiteLayout.
export function initSite() {
  const reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setupReveal(reduced);
  setupCarousel(reduced);
  setupSubscribe();
  setupModal();
  setupDropdowns();
  setupMenu();
  setupSearch();
  setupWeeklyCarousel(reduced);
  setupSectorSlider(reduced);
  setupTabs();
  setupScrollers();
  setupMarketTicker();
}

/* ---------- market snapshot: live oil price override (free API via /api/market) ---------- */
function setupMarketTicker() {
  const ticker = document.querySelector('[data-market-ticker]');
  if (!ticker) return;

  const ARROWS = {
    up: { d: 'M4 0l4 8H0z', color: '#1F7A4D' },
    'down-good': { d: 'M4 8L0 0h8z', color: '#1F7A4D' },
    'down-bad': { d: 'M4 8L0 0h8z', color: '#C0442E' },
  };

  const apply = (cell, m) => {
    if (!cell || !m) return;
    const valueEl = cell.querySelector('[data-metric-value]');
    if (valueEl && m.value) valueEl.textContent = m.value;
    const changeEl = cell.querySelector('[data-metric-change]');
    const a = ARROWS[m.direction] || ARROWS.up;
    if (changeEl) {
      changeEl.style.color = a.color;
      const path = changeEl.querySelector('[data-metric-arrow]');
      if (path) {
        path.setAttribute('d', a.d);
        path.setAttribute('fill', a.color);
      }
      const num = changeEl.querySelector('[data-metric-num]');
      if (num && m.change != null) num.textContent = m.change;
    }
  };

  fetch('/api/market')
    .then((r) => (r.ok ? r.json() : {}))
    .then((data) => {
      if (!data || typeof data !== 'object') return;
      Object.keys(data).forEach((key) => {
        apply(ticker.querySelector(`[data-metric-key="${key}"]`), data[key]);
      });
    })
    .catch(() => {
      /* offline / function unavailable (e.g. plain `astro dev`) — keep CMS values */
    });
}

/* ---------- horizontal scroller arrows (about page latest slider) ---------- */
function setupScrollers() {
  document.querySelectorAll('[data-scroller]').forEach((track) => {
    const controls = track.parentElement.querySelectorAll('[data-scroll-dir]');
    controls.forEach((btn) =>
      btn.addEventListener('click', () => {
        const dir = parseInt(btn.getAttribute('data-scroll-dir'), 10);
        const amount = Math.max(track.clientWidth * 0.8, 280);
        track.scrollBy({ left: dir * amount, behavior: 'smooth' });
      })
    );
  });
}

/* ---------- section topic tabs (client-side filter) ---------- */
function setupTabs() {
  const bar = document.querySelector('.ii-tabs');
  const grid = document.querySelector('.ii-tab-grid');
  if (!bar || !grid) return;
  const cards = Array.from(grid.children);
  const empty = document.querySelector('.ii-tab-empty');

  bar.querySelectorAll('.ii-tab').forEach((tab) =>
    tab.addEventListener('click', () => {
      bar.querySelectorAll('.ii-tab').forEach((t) => t.classList.remove('on'));
      tab.classList.add('on');
      const sel = tab.getAttribute('data-tab');
      let visible = 0;
      cards.forEach((c) => {
        const show = sel === 'all' || c.getAttribute('data-topic') === sel;
        c.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (empty) empty.style.display = visible ? 'none' : 'block';
    })
  );
}

/* ---------- explore-sectors auto slider ----------
 * Cards show a B&W image by default; the "active" card reveals its colour
 * photo (same visual as :hover). The active card auto-advances; hovering the
 * grid pauses it and hands control to the hovered card. */
function setupSectorSlider(reduced) {
  const grid = document.querySelector('.ii-sector-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.ii-scard'));
  if (cards.length < 2) return;

  let i = 0;
  let timer = null;
  const activate = (n) => {
    cards.forEach((c) => c.classList.remove('on'));
    cards[n].classList.add('on');
  };
  const start = () => {
    if (reduced) return;
    timer = setInterval(() => {
      i = (i + 1) % cards.length;
      activate(i);
    }, 3000);
  };
  const stop = () => timer && (clearInterval(timer), (timer = null));

  if (!reduced) {
    activate(0);
    start();
  }
  grid.addEventListener('mouseenter', () => {
    stop();
    cards.forEach((c) => c.classList.remove('on')); // let :hover take over
  });
  grid.addEventListener('mouseleave', () => {
    if (!reduced) {
      activate(i);
      start();
    }
  });
}

/* ---------- weekly column carousel ---------- */
function setupWeeklyCarousel(reduced) {
  const slides = Array.from(document.querySelectorAll('.ii-wc-slide'));
  const dots = Array.from(document.querySelectorAll('.ii-wc-dot'));
  if (slides.length < 2) return;

  let current = 0;
  let auto = null;
  const interval = 7000;

  const goTo = (n) => {
    n = (n + slides.length) % slides.length;
    if (n === current) return;
    slides[current].classList.remove('on');
    if (dots[current]) dots[current].classList.remove('on');
    current = n;
    slides[n].classList.add('on');
    if (dots[n]) dots[n].classList.add('on');
  };

  dots.forEach((d) => d.addEventListener('click', () => goTo(parseInt(d.getAttribute('data-wc-go'), 10))));
  document.querySelectorAll('[data-wc-dir]').forEach((b) =>
    b.addEventListener('click', () => goTo(current + parseInt(b.getAttribute('data-wc-dir'), 10)))
  );

  if (!reduced) {
    const start = () => (auto = setInterval(() => goTo(current + 1), interval));
    start();
    const wc = document.querySelector('.ii-wc');
    if (wc) {
      wc.addEventListener('mouseenter', () => auto && clearInterval(auto));
      wc.addEventListener('mouseleave', start);
    }
  }
}

/* ---------- menu drawer ---------- */
function setupMenu() {
  const drawer = document.getElementById('ii-drawer');
  const btn = document.querySelector('.ii-menu-btn');
  if (!drawer || !btn) return;
  const open = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  btn.addEventListener('click', open);
  drawer.querySelectorAll('[data-drawer-close]').forEach((e) => e.addEventListener('click', close));
  // close when a nav link is followed (same-page anchors still navigate)
  drawer.querySelectorAll('.ii-drawer-nav a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && drawer.classList.contains('open') && close());
}

/* ---------- search overlay ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function setupSearch() {
  const overlay = document.getElementById('ii-search');
  const btn = document.getElementById('ii-search-btn');
  const input = document.getElementById('ii-search-input');
  const results = document.getElementById('ii-search-results');
  if (!overlay || !btn || !input || !results) return;

  let index = null;
  const render = (raw) => {
    const q = raw.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '<div class="ii-search-empty">Start typing to search articles.</div>';
      return;
    }
    const hits = (index || [])
      .filter((p) => `${p.title} ${p.excerpt} ${p.section}`.toLowerCase().includes(q))
      .slice(0, 8);
    if (!hits.length) {
      results.innerHTML = `<div class="ii-search-empty">No articles match “${esc(raw.trim())}”.</div>`;
      return;
    }
    results.innerHTML = hits
      .map(
        (p) =>
          `<a class="ii-search-result" href="/blog/${esc(p.slug)}/"><span class="sec">${esc(p.section || 'Article')}</span><h4>${esc(p.title)}</h4><p>${esc(p.excerpt)}</p></a>`
      )
      .join('');
  };
  const open = async () => {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 120);
    if (!index) {
      try {
        index = await (await fetch('/search-index.json')).json();
      } catch {
        index = [];
      }
    }
    render(input.value);
  };
  const close = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  btn.addEventListener('click', open);
  overlay.querySelectorAll('[data-search-close]').forEach((e) => e.addEventListener('click', close));
  input.addEventListener('input', () => render(input.value));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && overlay.classList.contains('open') && close());
}

/* ---------- nav dropdowns ----------
 * The menu is portaled to <body> so it escapes the masthead's stacking context
 * (the homepage hero would otherwise paint over an in-header dropdown). */
function setupDropdowns() {
  const dds = Array.from(document.querySelectorAll('.ii-navdd'));
  if (!dds.length) return;

  dds.forEach((dd) => {
    const trigger = dd.querySelector('.ii-navdd-trigger');
    const menu = dd.querySelector('.ii-navdd-menu');
    if (!trigger || !menu) return;
    document.body.appendChild(menu); // portal out of the header

    let open = false;
    let hideTimer = null;
    const clearHide = () => hideTimer && clearTimeout(hideTimer);

    const place = () => {
      const r = trigger.getBoundingClientRect();
      menu.style.top = `${Math.round(r.bottom - 2)}px`;
      menu.style.left = `${Math.round(r.left)}px`;
    };
    const show = () => {
      clearHide();
      dds.forEach((o) => o !== dd && closeOther(o));
      open = true;
      place();
      dd.classList.add('open');
      menu.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    };
    const hide = () => {
      open = false;
      dd.classList.remove('open');
      menu.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    };
    const scheduleHide = () => {
      clearHide();
      hideTimer = setTimeout(hide, 140);
    };

    dd._close = hide; // for closeOther

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      open ? hide() : show();
    });
    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', scheduleHide);
    menu.addEventListener('mouseenter', clearHide);
    menu.addEventListener('mouseleave', scheduleHide);
    menu.addEventListener('click', (e) => e.stopPropagation());
    window.addEventListener('scroll', () => open && place(), { passive: true });
    window.addEventListener('resize', () => open && place());
  });

  const closeOther = (dd) => dd._close && dd._close();
  document.addEventListener('click', () => dds.forEach(closeOther));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && dds.forEach(closeOther));
}

/* ---------- hero carousel ---------- */
function setupCarousel(reduced) {
  const slides = Array.from(document.querySelectorAll('.ii-slide'));
  const dots = Array.from(document.querySelectorAll('.ii-dot'));
  if (!slides.length) return;

  let current = 0;
  const interval = 6000;
  let auto = null;

  const goTo = (n) => {
    if (n === current) return;
    slides[current].classList.remove('on');
    if (dots[current]) dots[current].classList.remove('on');
    current = n;
    slides[n].classList.add('on');
    if (dots[n]) dots[n].classList.add('on');
  };

  dots.forEach((d) =>
    d.addEventListener('click', () => goTo(parseInt(d.getAttribute('data-go'), 10)))
  );
  document.querySelectorAll('[data-dir]').forEach((b) =>
    b.addEventListener('click', () => {
      const dir = parseInt(b.getAttribute('data-dir'), 10);
      goTo((current + dir + slides.length) % slides.length);
    })
  );

  if (!reduced) {
    const start = () => (auto = setInterval(() => goTo((current + 1) % slides.length), interval));
    start();
    const hero = document.querySelector('[data-screen-label="Hero carousel"]');
    if (hero) {
      hero.addEventListener('mouseenter', () => auto && clearInterval(auto));
      hero.addEventListener('mouseleave', start);
    }
  }
}

/* ---------- API helper ----------
 * In production these hit the Netlify functions. Under bare `astro dev`
 * the endpoints don't exist, so callers fall back to optimistic UI. */
async function callApi(path, payload) {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return { ok: false, unavailable: true };
    return await res.json();
  } catch {
    return { ok: false, unavailable: true };
  }
}

/* ---------- envelope modal (guide download + newsletter subscribe) ---------- */
const MODAL_MODES = {
  guide: {
    title: "There's an opportunity behind chaos",
    sub: "Enter your email and we'll deliver the Legal Structuring Handbook to your inbox in seconds.",
    cta: 'Send me the guide',
    successTitle: 'On its way.',
    successSub: (email) =>
      `Your Legal Structuring Handbook is on its way to <span style="color:#B8923D;font-weight:600;">${email}</span>.`,
  },
  subscribe: {
    title: "There's an opportunity behind chaos",
    sub: 'Weekly economics, markets, and opportunity intelligence — free, straight to your inbox.',
    cta: 'Subscribe',
    successTitle: "You're in.",
    successSub: (email) =>
      `We've added <span style="color:#B8923D;font-weight:600;">${email}</span> — watch your inbox for the next issue.`,
  },
};

function setupModal() {
  const modal = document.getElementById('ii-modal');
  const pop = document.getElementById('ii-pop');
  if (!modal || !pop) return;
  const openers = document.querySelectorAll('.ii-open-modal, #ii-open-modal');
  const el = (id) => document.getElementById(id);

  let activeMode = 'subscribe';
  let activeGuideId = null;

  const show = (mode, guideId) => {
    activeMode = MODAL_MODES[mode] ? mode : 'subscribe';
    activeGuideId = guideId || null;
    const cfg = MODAL_MODES[activeMode];

    if (el('ii-modal-title')) el('ii-modal-title').textContent = cfg.title;
    if (el('ii-modal-sub')) el('ii-modal-sub').textContent = cfg.sub;
    if (el('ii-modal-submit')) el('ii-modal-submit').textContent = cfg.cta;

    // reset to the form state
    pop.classList.remove('done');
    const emReset = el('ii-modal-email');
    if (emReset) emReset.value = '';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => emReset && emReset.focus(), 140);
  };
  const hide = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  openers.forEach((o) =>
    o.addEventListener('click', (e) => {
      e.preventDefault();
      show(o.getAttribute('data-modal') || 'subscribe', o.getAttribute('data-guide-id'));
    })
  );
  modal.querySelectorAll('[data-close]').forEach((c) => c.addEventListener('click', hide));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && hide());

  const form = el('ii-modal-form');
  if (form)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const em = el('ii-modal-email');
      if (!em || !em.value) return;

      const btn = el('ii-modal-submit');
      const cfg = MODAL_MODES[activeMode];
      if (btn) btn.textContent = 'Sending…';

      const result =
        activeMode === 'guide' && activeGuideId
          ? await callApi('/api/get-guide', { email: em.value.trim(), guideId: activeGuideId })
          : await callApi('/api/subscribe', { email: em.value.trim() });

      if (!result.ok && !result.unavailable) {
        if (btn) btn.textContent = cfg.cta;
        alert(result.error || 'Something went wrong. Please try again.');
        return;
      }
      if (result.ok && result.pdfUrl) window.open(result.pdfUrl, '_blank');

      // prepare success copy, then crossfade to the success state
      if (el('ii-modal-success-title')) el('ii-modal-success-title').textContent = cfg.successTitle;
      if (el('ii-modal-success-sub')) el('ii-modal-success-sub').innerHTML = cfg.successSub(em.value.trim());
      pop.classList.add('done');
      if (btn) btn.textContent = cfg.cta;
    });
}

/* ---------- sleek subscribe strip ---------- */
function setupSubscribe() {
  const form = document.getElementById('ii-sub-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('ii-sub-input');
    const label = document.getElementById('ii-sub-label');
    if (!input || !input.value) return;

    if (label) label.textContent = 'Sending…';
    const result = await callApi('/api/subscribe', { email: input.value.trim() });

    if (!result.ok && !result.unavailable) {
      if (label) label.textContent = 'Subscribe';
      alert(result.error || 'Something went wrong. Please try again.');
      return;
    }
    if (label) label.textContent = 'Subscribed ✓';
    input.value = '';
    input.placeholder = "You're on the list.";
  });
}

/* ---------- scroll reveal ---------- */
function setupReveal(reduced) {
  const els = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!els.length) return;
  if (reduced) {
    els.forEach((el) => (el.style.opacity = '1'));
    return;
  }
  els.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    el.style.transition =
      'opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)';
  });
  const show = (el) => {
    const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  };
  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return (
      r.top < (window.innerHeight || document.documentElement.clientHeight) - 40 && r.bottom > 0
    );
  };
  els.forEach((el) => inView(el) && show(el));
  try {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            show(en.target);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));
  } catch (e) {
    /* IntersectionObserver unsupported — fallback below covers it */
  }
  const onScroll = () => {
    let remaining = false;
    els.forEach((el) => {
      if (el.style.opacity === '1') return;
      if (inView(el)) show(el);
      else remaining = true;
    });
    if (!remaining) window.removeEventListener('scroll', onScroll);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  // safety net: never trap content hidden
  setTimeout(
    () =>
      els.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }),
    2500
  );
}
