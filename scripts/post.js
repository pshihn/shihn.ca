import './toc.js';


// TOC
(function () {
  const toc = document.querySelector('table-of-contents');
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  let hidden = false;

  const update = () => {
    if (hidden) {
      toc.style.position = 'fixed';
      toc.style.top = '2.1rem';
      const ww = window.innerWidth
      if (ww <= 1280) {
        toc.style.right = '3.3333333%';
        toc.style.left = '';
      } else {
        const hh = header.getBoundingClientRect().width;
        const ew = main.getBoundingClientRect().width;
        if (ew >= 1470) {
          toc.style.left = `${(hh - ew) / 2}px`;
        } else {
          toc.style.left = '3.3333333%';
        }
        toc.style.right = '';
      }
    } else {
      toc.style.position = 'absolute';
      toc.style.left = '';
      toc.style.right = '';
      toc.style.top = '';
    }
  }

  if (toc && header && ('IntersectionObserver' in window)) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      hidden = (!entry.isIntersecting) || (entry.intersectionRatio === 0);
      update();
    }, { threshold: [0, 0.5, 1.0] });
    observer.observe(header);
  }

  window.addEventListener('resize', () => update(), { passive: true });
})();
