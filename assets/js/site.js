(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? btn.dataset.close : btn.dataset.open;
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  // Header: transparent over the hero, solid after it
  var top = document.querySelector('.top');
  var heroEl = document.querySelector('.hero');
  if (top && heroEl) {
    var onScroll = function () { top.classList.toggle('solid', window.scrollY > heroEl.offsetHeight - 80); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Hero film + running timecode (25 fps)
  var hero = document.querySelector('[data-hero]');
  var tc = document.querySelector('[data-tc]');
  if (hero && !reduce && !saveData) {
    hero.src = window.innerWidth > 1000 ? hero.dataset.srcHd : hero.dataset.src;
    var p = hero.play();
    if (p && p.catch) p.catch(function () {});
    if (tc) {
      var two = function (n) { return (n < 10 ? '0' : '') + n; };
      var tick = function () {
        var s = hero.currentTime || 0;
        tc.textContent = '00:' + two(Math.floor(s / 60)) + ':' + two(Math.floor(s % 60)) + ':' + two(Math.floor((s % 1) * 25));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  // Card preview loops: hover on desktop, in-view on touch
  var loops = [].slice.call(document.querySelectorAll('[data-loop]'));
  if (loops.length && !reduce && !saveData) {
    var play = function (v) {
      if (!v.src) v.src = v.dataset.src;
      var pr = v.play();
      if (pr && pr.then) pr.then(function () { v.classList.add('on'); }).catch(function () {});
    };
    var stop = function (v) { v.pause(); v.classList.remove('on'); };
    if (window.matchMedia('(hover: hover)').matches) {
      loops.forEach(function (v) {
        var card = v.closest('.card');
        card.addEventListener('mouseenter', function () { play(v); });
        card.addEventListener('mouseleave', function () { stop(v); });
        card.addEventListener('focus', function () { play(v); });
        card.addEventListener('blur', function () { stop(v); });
      });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? play(e.target) : stop(e.target); });
      }, { threshold: 0.6 });
      loops.forEach(function (v) { io.observe(v); });
    }
  }

  // Reveal on scroll
  var targets = document.querySelectorAll('.card, .sec-title, .persp-head, .persp-list li, .persp-close, .caps-col, .row, .about-head, .contact-head, .p-stills img');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { el.setAttribute('data-reveal', ''); ro.observe(el); });
  }

  // Contact form (Formspree)
  var form = document.getElementById('contactForm');
  if (form) {
    var submit = form.querySelector('button[type=submit]');
    var ok = form.querySelector('.form-ok');
    var label = submit.innerHTML;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit.disabled = true;
      submit.textContent = form.dataset.sending;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error();
          [].forEach.call(form.querySelectorAll('label, button'), function (el) { el.hidden = true; });
          ok.hidden = false;
        })
        .catch(function () {
          submit.disabled = false;
          submit.textContent = form.dataset.error;
          setTimeout(function () { submit.innerHTML = label; }, 4000);
        });
    });
  }
})();
