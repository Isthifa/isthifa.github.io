(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('#theme-toggle');
  const menu = document.querySelector('#mobile-menu');
  const menuBtn = document.querySelector('#menu-button');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = theme => {
    root.dataset.theme = theme;
    toggle.innerHTML = `<i class="fa-solid fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  };

  let savedTheme;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) {}
  applyTheme(savedTheme || (systemTheme.matches ? 'dark' : 'light'));

  toggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('portfolio-theme', nextTheme); } catch (_) {}
  });

  systemTheme.addEventListener('change', event => {
    let preference;
    try { preference = localStorage.getItem('portfolio-theme'); } catch (_) {}
    if (!preference) applyTheme(event.matches ? 'dark' : 'light');
  });

  const closeMenu = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  };
  menuBtn.addEventListener('click', event => {
    event.stopPropagation();
    const open = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.innerHTML = `<i class="fa-solid fa-${open ? 'xmark' : 'bars'}"></i>`;
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !menuBtn.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', closeMenu));

  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = document.querySelectorAll('main section[id]');
  const navigationObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }), { rootMargin: '-35% 0px -55%', threshold: 0 });
  sections.forEach(section => navigationObserver.observe(section));

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(card => revealObserver.observe(card));
})();
