// «Пион и лаванда» — лепестки на canvas, навигация, форма
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Шапка
  var nav = document.getElementById('nav');
  var onScroll = function () { nav.classList.toggle('nav--solid', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('nav--open');
      links.classList.toggle('nav__links--open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('nav--open');
        links.classList.remove('nav__links--open');
      }
    });
  }

  // Появление блоков
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('reveal--in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Падающие лепестки (только десктоп, без reduced-motion)
  var canvas = document.getElementById('petals');
  if (canvas && !reduced && window.innerWidth > 760) {
    var ctx = canvas.getContext('2d');
    var petals = [];
    var COLORS = ['rgba(217,165,179,', 'rgba(167,143,196,', 'rgba(138,155,120,'];
    function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    function Petal(init) {
      this.reset = function () {
        this.x = Math.random() * canvas.width;
        this.y = init ? Math.random() * canvas.height : -30;
        this.size = 5 + Math.random() * 8;
        this.speedY = 0.4 + Math.random() * 0.8;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = 0.25 + Math.random() * 0.35;
        this.color = COLORS[(Math.random() * COLORS.length) | 0];
      };
      this.reset();
      if (init) this.y = Math.random() * canvas.height;
    }
    for (var i = 0; i < 26; i++) petals.push(new Petal(true));

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size, -p.size * 0.4, p.size * 0.7, p.size * 0.7, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size, -p.size * 0.4, 0, -p.size);
      ctx.fillStyle = p.color + p.opacity + ')';
      ctx.fill();
      ctx.restore();
    }

    var visible = true;
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; });

    (function loop() {
      requestAnimationFrame(loop);
      if (!visible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(function (p) {
        p.y += p.speedY; p.x += p.speedX + Math.sin(p.y / 60) * 0.3; p.rot += p.rotSpeed;
        if (p.y > canvas.height + 30) p.reset();
        drawPetal(p);
      });
    })();
  } else if (canvas) {
    canvas.style.display = 'none';
  }

  // Демо-форма заказа
  var form = document.getElementById('orderForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add('form--done');
      form.querySelectorAll('input, select, textarea, button').forEach(function (el) { el.disabled = true; });
    });
  }
})();
