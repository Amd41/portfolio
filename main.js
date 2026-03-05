const AppState = {
  currentLang: 'en',
  currentTheme: 'dark',
  currentSection: 'home',
  isMenuOpen: false,
  isLoaded: false
};

// Language order for the toggle button (cycles)
const LANG_ORDER = ['en', 'ar', 'tr', 'de'];

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  loadPreferences();
  initLanguage();
  initTheme();
  initNavigation();
  initScrollEffects();
  initFormHandlers();
  initMobileMenu();
  initLoader();
  generateParticles();
  AppState.isLoaded = true;
}

function loadPreferences() {
  const savedLang = localStorage.getItem('portfolio-lang');
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedLang) AppState.currentLang = savedLang;
  if (savedTheme) AppState.currentTheme = savedTheme;
}

/* ----------------- LANGUAGE (EN/AR/TR/DE) ----------------- */
function initLanguage() {
  const toggleBtn = document.getElementById('langToggle');
  const menu = document.getElementById('langMenu');
  const dropdown = document.getElementById('langDropdown');

  if (!toggleBtn || !menu || !dropdown) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (!lang) return;

      setLanguage(lang);
      localStorage.setItem('portfolio-lang', lang);
      menu.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) menu.classList.remove('open');
  });

  setLanguage(AppState.currentLang);
}

function cycleLanguage() {
  const idx = LANG_ORDER.indexOf(AppState.currentLang);
  const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
  setLanguage(next);
  localStorage.setItem('portfolio-lang', next);
}

function setLanguage(lang) {
  AppState.currentLang = lang;

  const html = document.documentElement;
  const body = document.body;

  const isRTL = (lang === 'ar');
  html.setAttribute('lang', lang);
  html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  body.setAttribute('data-lang', lang);
  body.setAttribute('data-dir', isRTL ? 'rtl' : 'ltr');

  updateLanguageUI();
}

function updateLanguageUI() {
  // Replace text nodes
  const textElements = document.querySelectorAll('[data-text-en],[data-text-ar],[data-text-tr],[data-text-de]');
  textElements.forEach(el => {
    const value = el.getAttribute(`data-text-${AppState.currentLang}`);
    if (value) el.textContent = value;
  });

  // Replace placeholders
  const placeholderElements = document.querySelectorAll('[data-placeholder-en],[data-placeholder-ar],[data-placeholder-tr],[data-placeholder-de]');
  placeholderElements.forEach(el => {
    const value = el.getAttribute(`data-placeholder-${AppState.currentLang}`);
    if (value) el.setAttribute('placeholder', value);
  });

  // Toggle label text (shows current language)
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    const langText = langToggle.querySelector('.lang-text');
    if (langText) langText.textContent = AppState.currentLang.toUpperCase();
  }
}

/* ----------------- THEME ----------------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  setTheme(AppState.currentTheme);
}

function toggleTheme() {
  const newTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem('portfolio-theme', newTheme);
}

function setTheme(theme) {
  AppState.currentTheme = theme;
  document.body.setAttribute('data-theme', theme);
  updateThemeUI();
}

function updateThemeUI() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('i');
  if (!icon) return;

  // If dark -> show sun icon (to switch to light)
  icon.className = (AppState.currentTheme === 'dark') ? 'fas fa-sun' : 'fas fa-moon';
}

/* ----------------- NAVIGATION ----------------- */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      const header = document.querySelector('.main-header');
      const headerHeight = header ? header.offsetHeight : 0;
      const y = target.offsetTop - headerHeight;

      window.scrollTo({ top: y, behavior: 'smooth' });

      updateActiveNavLink(link);
      if (AppState.isMenuOpen) toggleMobileMenu();
    });
  });

  window.addEventListener('scroll', handleScrollSpy);
  window.addEventListener('scroll', updateHeaderOnScroll);
}

function handleScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPosition >= top && scrollPosition < top + height) {
      AppState.currentSection = id;
      updateActiveNavLink(null, id);
    }
  });
}

function updateActiveNavLink(clickedLink, sectionId = null) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');

    if (clickedLink && link === clickedLink) {
      link.classList.add('active');
      return;
    }

    if (sectionId) {
      const linkSection = link.getAttribute('data-section');
      if (linkSection === sectionId) link.classList.add('active');
    }
  });
}

function updateHeaderOnScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 50);
}

/* ----------------- MOBILE MENU ----------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);

  document.addEventListener('click', (e) => {
    const navMenu = document.getElementById('navMenu');
    const menuToggleBtn = document.getElementById('menuToggle');
    if (!navMenu || !menuToggleBtn) return;

    if (AppState.isMenuOpen && !navMenu.contains(e.target) && !menuToggleBtn.contains(e.target)) {
      toggleMobileMenu();
    }
  });
}

function toggleMobileMenu() {
  AppState.isMenuOpen = !AppState.isMenuOpen;

  const navMenu = document.getElementById('navMenu');
  const menuToggle = document.getElementById('menuToggle');

  if (navMenu) navMenu.classList.toggle('active', AppState.isMenuOpen);
  if (menuToggle) menuToggle.classList.toggle('active', AppState.isMenuOpen);
}

/* ----------------- SCROLL EFFECTS ----------------- */
function initScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  initSkillAnimations();
  initStatsCounter();
}

function initSkillAnimations() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const items = skillsSection.querySelectorAll('.skill-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const item = entry.target;
      const bar = item.querySelector('.skill-progress');
      const pctEl = item.querySelector('.skill-percent');
      const pct = parseInt(item.getAttribute('data-percent') || '0', 10);

      animateWidth(bar, pct, 1800);
      animateNumber(pctEl, pct, 1800, (v) => `${v}%`);

      obs.unobserve(item);
    });
  }, { threshold: 0.5 });

  items.forEach(i => obs.observe(i));
}

function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count') || '0', 10);
      animateNumber(el, target, 1600, (v) => `${v}`);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => obs.observe(s));
}

/* ----------------- FORM ----------------- */
function initFormHandlers() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const messageByLang = {
      en: 'Message sent successfully! (Demo alert)',
      ar: 'تم إرسال الرسالة بنجاح! (تنبيه تجريبي)',
      tr: 'Mesaj başarıyla gönderildi! (Demo uyarı)',
      de: 'Nachricht erfolgreich gesendet! (Demo)'
    };

    alert(messageByLang[AppState.currentLang] || messageByLang.en);
    form.reset();
  });
}

/* ----------------- PARTICLES ----------------- */
function generateParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const symbols = ['{','}','[',']','(',')','<','>','/','*','=','+','-',';',';',':','&','|','%','$','#','@'];
  const count = 22;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = (Math.random() * 100) + '%';
    p.style.animationDelay = (Math.random() * 15) + 's';
    p.style.animationDuration = (10 + Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

/* ----------------- LOADER ----------------- */
function initLoader() {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const percentEl = document.getElementById('loaderPercent');
    if (!loader || !percentEl) return;

    let progress = 0;
    const timer = setInterval(() => {
      progress += (Math.random() * 16);
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);

        setTimeout(() => {
          loader.classList.add('hidden');
        }, 250);
      }
      percentEl.textContent = `${Math.floor(progress)}%`;
    }, 90);
  });
}

/* ----------------- small animation helpers ----------------- */
function animateNumber(element, to, duration = 1200, format = (v) => `${v}`) {
  if (!element) return;
  const start = performance.now();
  const from = 0;

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutExpo(t);
    const value = Math.floor(from + (to - from) * eased);
    element.textContent = format(value);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function animateWidth(element, toPercent, duration = 1200) {
  if (!element) return;
  const start = performance.now();
  const from = 0;

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutExpo(t);
    const value = (from + (toPercent - from) * eased);
    element.style.width = `${value}%`;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}