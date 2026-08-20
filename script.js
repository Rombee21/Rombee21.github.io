// ===== HERO ВИДЕО — hover играет, click паузит, кнопка звука =====
const heroVideo  = document.getElementById('heroVideo');
const videoHint  = document.getElementById('videoHint');
const soundBtn   = document.getElementById('soundBtn');
const phoneFrame = heroVideo ? heroVideo.closest('.phone-frame') : null;

if (phoneFrame && heroVideo) {
  phoneFrame.addEventListener('mouseenter', () => {
    if (heroVideo.paused) {
      heroVideo.play();
      videoHint.classList.add('hidden');
    }
  });

  phoneFrame.addEventListener('click', (e) => {
    if (e.target === soundBtn) return; // обрабатывается ниже
    if (!heroVideo.paused) {
      heroVideo.pause();
      videoHint.classList.remove('hidden');
    } else {
      heroVideo.play();
      videoHint.classList.add('hidden');
    }
  });

  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    heroVideo.muted = !heroVideo.muted;
    soundBtn.textContent = heroVideo.muted ? '🔇' : '🔊';
  });
}

// ===== ЛАЙТБОКС — открывает видео =====
const lightbox         = document.getElementById('lightbox');
const lightboxVideo    = document.getElementById('lightboxVideo');
const lightboxTag      = document.getElementById('lightboxTag');
const lightboxTitle    = document.getElementById('lightboxTitle');
const lightboxClose    = document.getElementById('lightboxClose');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');

document.querySelectorAll('.portfolio-card').forEach(card => {
  card.addEventListener('click', () => {
    const videoSrc = card.dataset.video;
    const tag      = card.querySelector('.portfolio-card__tag');
    const title    = card.querySelector('.portfolio-card__info p');

    lightboxVideo.src             = videoSrc || '';
    lightboxTag.textContent       = tag   ? tag.textContent   : '';
    lightboxTitle.textContent     = title ? title.textContent : '';

    lightboxVideo.load();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxVideo.play().catch(() => {});
  });
});

function closeLightbox() {
  lightboxVideo.pause();
  lightboxVideo.src = '';
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ===== ТАБЫ ПОРТФОЛИО =====
const tabBtns       = document.querySelectorAll('.tab-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const types = card.dataset.type.split(/\s+/);
      if (filter === 'all' || types.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== СЧЁТЧИКИ СТАТИСТИКИ =====
const counters = document.querySelectorAll('.stat-card__number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  // Точные цифры (7 каналов, 3 года, 11 работ) не должны выводиться как "7+".
  const suffix   = el.dataset.suffix !== undefined ? el.dataset.suffix : '+';
  const duration = 1800;
  const step     = target / (duration / 16);
  let current    = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

// ===== КОНТАКТЫ =====
// ВАЖНО: подставь свои реальные контакты. Пока здесь заглушки — форма
// не должна показывать "отправлено", если письмо никуда не уходит.
const CONTACT_EMAIL    = 'rombeeeeee@gmail.com';
const CONTACT_TELEGRAM = 'romansh21';

// ===== ФОРМА =====
// Раньше форма показывала "✅ Заявка отправлена!" и молча выбрасывала письмо.
// Теперь она реально открывает почтовый клиент с заполненным письмом.
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const [nameEl, emailEl] = form.querySelectorAll('.form__row .form__input');
  const subjEl            = form.querySelectorAll('.form__input')[2];
  const msgEl             = form.querySelector('.form__textarea');

  const name  = (nameEl?.value  || '').trim();
  const email = (emailEl?.value || '').trim();
  const subj  = (subjEl?.value  || '').trim() || 'Заявка на монтаж';
  const msg   = (msgEl?.value   || '').trim();

  const body = [
    `Имя: ${name}`,
    `Email: ${email}`,
    '',
    msg
  ].join('\n');

  const href = `mailto:${CONTACT_EMAIL}`
    + `?subject=${encodeURIComponent(subj)}`
    + `&body=${encodeURIComponent(body)}`;

  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = '📧 Открываю почту…';
  btn.disabled = true;

  window.location.href = href;

  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 2500);
});

// ===== МОБИЛЬНОЕ МЕНЮ =====
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose  = document.getElementById('menuClose');
burger.addEventListener('click', () => mobileMenu.classList.add('open'));
menuClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== ПОДСВЕТКА МЕНЮ =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? '#f0f0f0' : '';
  });
});
