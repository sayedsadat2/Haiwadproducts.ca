// Haiwad Products Canada — page navigation and contact interactions.
const pageIds = ['home', 'about', 'products', 'contact'];
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

function showPage(pageId, updateHistory = true) {
  const target = document.getElementById(`page-${pageId}`);
  if (!target || !pageIds.includes(pageId)) return;
  document.querySelectorAll('.page').forEach((page) => {
    const active = page === target;
    page.classList.toggle('active', active);
    page.setAttribute('aria-hidden', String(!active));
  });
  document.querySelectorAll('.main-nav [data-page]').forEach((link) => {
    const active = link.dataset.page === pageId;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (updateHistory) {
    const nextHash = pageId === 'home' ? '' : `#${pageId}`;
    if (window.location.hash !== nextHash) history.pushState({ pageId }, '', nextHash || window.location.pathname);
  }
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.showPage = showPage;

function closeMenu() {
  if (!menuToggle || !mainNav) return;
  mainNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
}

function syncPageFromLocation() {
  const id = window.location.hash.slice(1);
  showPage(pageIds.includes(id) ? id : 'home', false);
}

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Open navigation menu' : 'Close navigation menu');
  mainNav?.classList.toggle('is-open', !expanded);
});

document.querySelectorAll('[data-page]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});
window.addEventListener('hashchange', syncPageFromLocation);
window.addEventListener('popstate', syncPageFromLocation);
syncPageFromLocation();

// Back-to-top control.
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Exit popup: desktop pointer exit only, once per browser session.
const exitPopup = document.getElementById('exitPopup');
let exitPopupShown = false;
document.addEventListener('mouseleave', (event) => {
  if (event.clientY < 0 && !exitPopupShown && !sessionStorage.getItem('haiwadPopupDismissed') && window.matchMedia('(pointer:fine)').matches) {
    exitPopupShown = true;
    exitPopup?.classList.add('active');
    document.querySelector('.close-popup')?.focus();
  }
});
function closeExitPopup() {
  exitPopup?.classList.remove('active');
  sessionStorage.setItem('haiwadPopupDismissed', '1');
}
window.closeExitPopup = closeExitPopup;
document.querySelector('.close-popup')?.addEventListener('click', closeExitPopup);
document.querySelector('.popup-dismiss')?.addEventListener('click', closeExitPopup);
document.querySelector('[data-close-popup]')?.addEventListener('click', closeExitPopup);
exitPopup?.addEventListener('click', (event) => { if (event.target === exitPopup) closeExitPopup(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeExitPopup(); });

// Reveal product and testimonial cards only when motion is allowed.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.product-card, .vm-card, .testimonial-card, .contact-item').forEach((element) => {
    element.classList.add('reveal-on-scroll');
    observer.observe(element);
  });
}

// No server endpoint is configured. Prepare an email in the visitor's email app honestly.
document.getElementById('contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `[Haiwad website] ${data.get('subject') || 'General inquiry'}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Phone: ${data.get('phone') || 'Not provided'}`,
    '',
    String(data.get('message') || '')
  ].join('\n');
  const status = document.getElementById('formStatus');
  if (status) {
    status.textContent = 'Your email app should open with this inquiry ready to send.';
    status.classList.add('is-ready');
    status.classList.remove('is-error');
  }
  window.location.href = `mailto:Haiwadproductscanada@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

