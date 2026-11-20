{
  // reading progress
  const bar = document.querySelector('.progress');
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // table of contents highlight
  const links = [...document.querySelectorAll('.toc a')];
  const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && secs.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    secs.forEach(s => spy.observe(s));
  }

  // switchers (tabs)
  document.querySelectorAll('[data-switch]').forEach(sw => {
    const btns = [...sw.querySelectorAll('.seg button')];
    const panels = [...sw.querySelectorAll('.panel')];
    const show = k => {
      btns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.k === k)));
      panels.forEach(p => { p.hidden = p.dataset.k !== k; });
    };
    btns.forEach(b => b.addEventListener('click', () => show(b.dataset.k)));
    sw.querySelector('.seg').addEventListener('keydown', e => {
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const n = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
        n.focus(); show(n.dataset.k); e.preventDefault();
      }
    });
    if (btns[0]) show((btns.find(b => b.getAttribute('aria-selected') === 'true') || btns[0]).dataset.k);
  });

  // lightbox for figures
  const lb = document.createElement('dialog');
  lb.className = 'lb';
  lb.innerHTML = '<button type="button" aria-label="Close">&#10005;</button><img alt=""><p></p>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p');
  lb.querySelector('button').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  document.querySelectorAll('figure.zoom img').forEach(img => {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    const open = () => {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      const cap = img.closest('figure').querySelector('figcaption');
      lbCap.textContent = cap ? cap.textContent : '';
      if (lb.showModal) lb.showModal();
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}
