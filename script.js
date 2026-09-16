// Portfolio interactions and personal media archive.
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    }));
  }
  const revealItems = document.querySelectorAll('.card, .contact-box, .hero-card');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealItems.forEach((item) => item.classList.add('reveal'));
    const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  const grid = document.querySelector('#title-grid');
  if (!grid) return;
  const collections = {
    manga: ['My Hero Academia','JoJo’s Bizarre Adventure','Attack on Titan','Hunter × Hunter','Chainsaw Man','Jujutsu Kaisen','One Punch Man','Fullmetal Alchemist','Fullmetal Alchemist: Brotherhood','Mob Psycho 100','Spy × Family','Mashle: Magic and Muscles','Fire Force','Kaiju No. 8','Black Clover','Tokyo Revengers','Demon Slayer: Kimetsu no Yaiba','Frieren: Beyond Journey’s End','Re:Zero − Starting Life in Another World','That Time I Got Reincarnated as a Slime','Overlord','The Eminence in Shadow','The Misfit of Demon King Academy','Sword Art Online'],
    manhwa: ['Solo Leveling','Omniscient Reader’s Viewpoint','Tower of God','The Beginning After the End','Lookism','The God of High School','Eleceed','The Greatest Estate Developer','Nano Machine','The Legend of the Northern Blade','Return of the Mount Hua Sect','The World After the Fall','Doom Breaker','SSS-Class Revival Hunter','Leviathan','Hardcore Leveling Warrior','Noblesse','Weak Hero'],
    anime: ['My Hero Academia (All Seasons)','JoJo’s Bizarre Adventure (All Parts and Seasons)','Attack on Titan','Hunter × Hunter','Chainsaw Man','Jujutsu Kaisen','One Punch Man','Fullmetal Alchemist: Brotherhood','Fullmetal Alchemist','Mob Psycho 100','Spy × Family','Mashle: Magic and Muscles','Fire Force','Kaiju No. 8','Black Clover','Tokyo Revengers','Demon Slayer: Kimetsu no Yaiba','Hellsing','Hellsing Ultimate','Parasyte: The Maxim','Dr. Stone','The Seven Deadly Sins','Blue Lock','Haikyuu!!','Classroom of the Elite','Frieren: Beyond Journey’s End','Re:Zero − Starting Life in Another World','That Time I Got Reincarnated as a Slime','Overlord','The Eminence in Shadow','The Misfit of Demon King Academy','Sword Art Online','Solo Leveling'],
    books: ['Atomic Habits — James Clear','The 7 Habits of Highly Effective People — Stephen R. Covey','Deep Work — Cal Newport','Reverend Insanity']
  };
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'manga';
  const titles = collections[type] || collections.manga;
  const title = document.querySelector('#library-title');
  const description = document.querySelector('#library-description');
  const search = document.querySelector('#title-search');
  const filter = document.querySelector('#genre-filter');
  const count = document.querySelector('#result-count');
  const names = { manga: 'Manga Shelf', manhwa: 'Manhwa Shelf', anime: 'Anime Shelf', books: 'Bookshelf' };
  if (title) title.textContent = names[type] || 'My Shelf';
  if (description) description.textContent = `A personal collection of ${type === 'books' ? 'books and novels' : type + ' I’ve read, watched, or want to revisit'}.`;
  if (filter) filter.hidden = true; // No genre data has been curated yet; avoid misleading filters.
  const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  function render() {
    const query = (search?.value || '').trim().toLowerCase();
    const visible = titles.filter((name) => name.toLowerCase().includes(query));
    grid.innerHTML = visible.map((name, index) => `<article class="title-card"><span class="title-number">${String(index + 1).padStart(2, '0')}</span><h2>${escapeHtml(name)}</h2><span class="title-type">${escapeHtml(type)}</span></article>`).join('');
    if (count) count.textContent = `${visible.length} of ${titles.length} titles`;
    if (!visible.length) grid.innerHTML = '<p class="muted">No titles match your search.</p>';
  }
  search?.addEventListener('input', render);
  render();
});