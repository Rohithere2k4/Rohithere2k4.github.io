(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#year').textContent = new Date().getFullYear();

  /* mobile menu */
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  /* header state + progress bar */
  const header = $('#header'), bar = $('#progress');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 10);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* active link (scroll spy) */
  const links = $$('.menu a');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* typed role */
  const roles = ['Data Analyst', 'SQL & MySQL', 'Excel & Power BI dashboards', 'Python for data science'];
  const typed = $('#typed');
  if (reduce) typed.textContent = roles[0];
  else {
    let r = 0, c = 0, del = false;
    (function tick() {
      const w = roles[r];
      typed.textContent = w.slice(0, c);
      if (!del && c === w.length) { del = true; return setTimeout(tick, 1400); }
      if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 80);
    })();
  }

  /* SQL terminal */
  const lines = [
    '<span class="k">SELECT</span> name, degree, cgpa, skills',
    '<span class="k">FROM</span>   candidates',
    '<span class="k">WHERE</span>  name = <span class="s">\'Rohith Chirra\'</span>;',
    '',
    '<span class="d">+-----------+------------------------------+</span>',
    'name      | Rohith Chirra',
    'degree    | B.Tech Data Science / CS',
    'cgpa      | 7.3',
    'skills    | Excel, SQL, Power BI, Python',
    'project   | 300,000-row payments dashboard',
    'status    | <span class="s">open_to_work</span>',
    '<span class="d">+-----------+------------------------------+</span>',
    '<span class="d">1 row in set (0.00 sec)</span>'
  ];
  const term = $('#term');
  if (reduce) term.innerHTML = lines.join('\n');
  else {
    let i = 0;
    const next = () => {
      if (i >= lines.length) return;
      term.innerHTML += (i ? '\n' : '') + lines[i++];
      setTimeout(next, i < 4 ? 450 : 220);
    };
    next();
  }

  /* testimonials carousel */
  const track = $('#track'), slides = $$('.slide'), dots = $('#dots');
  let idx = 0, timer;
  slides.forEach((_, n) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to testimonial ' + (n + 1));
    b.addEventListener('click', () => { go(n); play(); });
    dots.appendChild(b);
  });
  function go(n) {
    idx = (n + slides.length) % slides.length;
    track.style.setProperty('--i', idx);
    $$('button', dots).forEach((b, k) => b.classList.toggle('on', k === idx));
    slides.forEach((s, k) => s.setAttribute('aria-hidden', k !== idx));
  }
  function play() { clearInterval(timer); if (!reduce) timer = setInterval(() => go(idx + 1), 6000); }
  $('#prev').addEventListener('click', () => { go(idx - 1); play(); });
  $('#next').addEventListener('click', () => { go(idx + 1); play(); });
  const car = $('#carousel');
  car.addEventListener('mouseenter', () => clearInterval(timer));
  car.addEventListener('mouseleave', play);
  let sx = 0;
  car.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  car.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - sx;
    if (Math.abs(d) > 40) { go(idx + (d < 0 ? 1 : -1)); play(); }
  });
  go(0); play();
})();
