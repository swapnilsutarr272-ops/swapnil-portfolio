// Scroll progress, mobile navigation, repeatable scroll reveals and subtle 3D effects.
const progress = document.querySelector('.progress');
function updateProgress(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if(progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}
window.addEventListener('scroll', updateProgress, {passive:true});
window.addEventListener('resize', updateProgress);
updateProgress();

const menu = document.querySelector('.menu');
const nav = document.querySelector('.topbar nav');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? '✕' : '☰';
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
  if(menu) menu.textContent = '☰';
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer:fine)').matches;

// Repeatable, scroll-triggered reveals for headings, paragraphs, cards, logos and images.
// Each target animates when it enters view and resets after leaving view, so it replays on scroll-back.
const revealSelector = [
  '.hero-photo', '.intro .eyebrow', '.intro h1', '.intro h2', '.intro-copy', '.intro .actions',
  '.stats > div', '.footnote', '.section-heading > *', '.incident-card', '.demo-label',
  '.skill-card', '.about-copy > *', '.globe-scene', '.environment > *', '.environment li',
  '.section-label', '.job', '.job .company-mark', '.job h3', '.job .role-line', '.job li',
  '.achievements > *', '.achievement-row', '.certification > *', '.cert-card',
  'footer > div > *', '.contact-links > *'
].join(',');
const revealTargets = [...new Set(document.querySelectorAll(revealSelector))];
if (!reduceMotion && 'IntersectionObserver' in window) {
  revealTargets.forEach((el, i) => {
    el.classList.add('scroll-reveal');
    el.style.setProperty('--reveal-delay', `${(i % 5) * 85}ms`);
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
      else entry.target.classList.remove('is-visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

// Current section navigation highlight.
const navLinks = [...document.querySelectorAll('.topbar nav a')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.id) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  }), {rootMargin:'-35% 0px -55% 0px'});
  document.querySelectorAll('main section[id], footer[id]').forEach(s => sectionObserver.observe(s));
}

// Gentle pointer parallax, restricted to fine pointers and reduced-motion off.
if (!reduceMotion && finePointer) {
  const hero = document.querySelector('.hero');
  const photo = document.querySelector('.hero-photo');
  const stack = document.querySelector('.incident-stack');
  hero?.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    if(photo) photo.style.setProperty('--pointer-x', `${x * -7}px`);
    if(photo) photo.style.setProperty('--pointer-y', `${y * -5}px`);
    if(stack) stack.style.transform = `perspective(1000px) rotateY(${x * -2.5}deg) rotateX(${y * 1.5}deg)`;
  });
  hero?.addEventListener('pointerleave', () => {
    photo?.style.removeProperty('--pointer-x');
    photo?.style.removeProperty('--pointer-y');
    if(stack) stack.style.transform = '';
  });
}

// Sequential entrance for the four-stage illustrative incident workflow.
document.querySelectorAll('.incident-card').forEach((card, i) => {
  card.style.setProperty('--card-delay', `${i * 150}ms`);
});
