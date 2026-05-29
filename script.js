/* ================================================
   RESOLVE+ — SCRIPTS
   ================================================ */

(function () {
  'use strict';

  // ---- Referências ----
  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');
  const form      = document.getElementById('contato-form');
  const telefoneInput = document.getElementById('telefone');
  const servicesSection = document.getElementById('servicos');

  // ---- Header: efeito scroll ----
  const headerLogo = document.getElementById('header-logo');
  const LOGO_LIGHT = 'assets/icons/logo_horizontal_fundo-azul.png';
  const LOGO_DARK  = 'assets/icons/logo_horizontal_fundo-branco.png';

  const updateScrollEffects = () => {
    const scrollY = window.scrollY;

    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      if (headerLogo) headerLogo.src = LOGO_DARK;
    } else {
      header.classList.remove('scrolled');
      if (headerLogo) headerLogo.src = LOGO_LIGHT;
    }

    if (servicesSection) {
      const revealStart = servicesSection.offsetTop - window.innerHeight * 0.88;
      const revealEnd = servicesSection.offsetTop - window.innerHeight * 0.18;
      const revealRange = Math.max(revealEnd - revealStart, 1);
      const servicesProgress = Math.min(Math.max((scrollY - revealStart) / revealRange, 0), 1);
      servicesSection.style.setProperty('--services-progress', servicesProgress.toFixed(3));
    }

    isScrollTicking = false;
  };

  let isScrollTicking = false;
  const onScroll = () => {
    if (isScrollTicking) return;
    isScrollTicking = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll(); // estado inicial

  // ---- Menu mobile ----
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Fecha menu ao clicar em link
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Fecha menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- Animação fade-in ao rolar ----
  const animTargets = document.querySelectorAll(
    '.card-dif, .card-servico, .step, .card-dep, .section-header, .contato__info, .contato__form'
  );

  animTargets.forEach((el, i) => {
    el.classList.add('fade-in');
    // atraso escalonado para cards de uma mesma grade
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.classList.contains(el.classList[0]));
      const idx = siblings.indexOf(el);
      if (idx >= 0) el.style.transitionDelay = `${idx * 80}ms`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animTargets.forEach(el => observer.observe(el));

  // ---- Máscara de telefone ----
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);

      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d+)/, '($1) $2');
      } else if (v.length > 0) {
        v = '(' + v;
      }

      e.target.value = v;
    });
  }

  // ---- Formulário: redireciona para WhatsApp ----
  const servicoLabels = {
    'esgoto':          'Desentupimento de Esgoto',
    'pia-vaso':        'Pia / Vaso Sanitário',
    'fossa':           'Limpeza de Fossa',
    'inspecao-video':  'Inspeção por Vídeo',
    'hidrojateamento': 'Hidrojateamento',
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome      = document.getElementById('nome').value.trim();
      const telefone  = document.getElementById('telefone').value.trim();
      const servico   = document.getElementById('servico').value;
      const mensagem  = document.getElementById('mensagem').value.trim();

      // Validação mínima
      if (!nome || !telefone || !servico) {
        const firstEmpty = !nome ? 'nome' : (!telefone ? 'telefone' : 'servico');
        document.getElementById(firstEmpty).focus();
        return;
      }

      let texto = `Olá! Gostaria de solicitar um serviço.\n\n`;
      texto += `*Nome:* ${nome}\n`;
      texto += `*Telefone:* ${telefone}\n`;
      texto += `*Serviço:* ${servicoLabels[servico] || servico}`;
      if (mensagem) texto += `\n*Descrição:* ${mensagem}`;

      const url = `https://wa.me/351937557049?text=${encodeURIComponent(texto)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // ---- Smooth scroll para âncoras ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Pipe background animation ----
  function initPipeBackground(canvas) {
    var ctx      = canvas.getContext('2d');
    var METAL_THEMES = [
      {dark: '#2f3a40', mid: '#6a7a84', light: '#c3d0d8', seam: 'rgba(245,251,255,0.78)', neon: 'rgba(149,217,0,0.18)'},
      {dark: '#323d45', mid: '#758590', light: '#d0d9df', seam: 'rgba(245,251,255,0.72)', neon: 'rgba(137,236,255,0.14)'},
      {dark: '#2b343b', mid: '#61747f', light: '#b8c7cf', seam: 'rgba(238,248,255,0.70)', neon: 'rgba(149,217,0,0.16)'}
    ];
    var ACCENT_THEME = {dark: '#314036', mid: '#73896e', light: '#cadcbe', seam: 'rgba(243,255,232,0.78)', neon: 'rgba(149,217,0,0.25)'};
    var PW       = 16;
    var CELL     = PW;
    var TICK_MS  = 50;
    var W, H, pipes, frameId, pixelCount;
    var lastTick = 0;
    var DIRS = [
      {dx:1,dy:0}, {dx:0,dy:1}, {dx:-1,dy:0}, {dx:0,dy:-1}
    ];

    function rand(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
    function randTheme() {
      return Math.random() < 0.07 ? ACCENT_THEME : METAL_THEMES[rand(0, METAL_THEMES.length - 1)];
    }

    function makePipe() {
      var cols = Math.max(5, Math.floor(W / CELL));
      var rows = Math.max(5, Math.floor(H / CELL));
      return {
        x: rand(2, cols - 3) * CELL,
        y: rand(2, rows - 3) * CELL,
        dir: rand(0, 3),
        theme: randTheme(),
        stepsToTurn: rand(4, 14),
        steps: 0
      };
    }

    function makePipeGradient(p, nx, ny) {
      var half = PW / 2;
      var grad;
      if (p.y === ny) {
        grad = ctx.createLinearGradient(0, p.y - half, 0, p.y + half);
      } else {
        grad = ctx.createLinearGradient(p.x - half, 0, p.x + half, 0);
      }
      grad.addColorStop(0, p.theme.dark);
      grad.addColorStop(0.24, p.theme.mid);
      grad.addColorStop(0.5, p.theme.light);
      grad.addColorStop(0.76, p.theme.mid);
      grad.addColorStop(1, p.theme.dark);
      return grad;
    }

    function drawPipeSegment(p, nx, ny) {
      var bodyGrad = makePipeGradient(p, nx, ny);

      // Soft under-shadow to detach pipe from background.
      ctx.shadowColor = 'rgba(0,0,0,0.24)';
      ctx.shadowBlur = 4;
      ctx.strokeStyle = 'rgba(15,20,24,0.34)';
      ctx.lineWidth = PW + 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      // Main metallic body with subtle neon spill.
      ctx.shadowColor = p.theme.neon;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = bodyGrad;
      ctx.lineWidth = PW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();

      // Specular reflection strip for cylindrical look.
      ctx.shadowBlur = 0;
      ctx.strokeStyle = p.theme.seam;
      ctx.lineWidth = Math.max(1, PW * 0.14);
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (p.y === ny) {
        var hiY = p.y - (PW * 0.2);
        ctx.moveTo(p.x, hiY);
        ctx.lineTo(nx, hiY);
      } else {
        var hiX = p.x - (PW * 0.2);
        ctx.moveTo(hiX, p.y);
        ctx.lineTo(hiX, ny);
      }
      ctx.stroke();

      // Opposite dark seam improves depth.
      ctx.strokeStyle = 'rgba(0,0,0,0.22)';
      ctx.lineWidth = Math.max(1, PW * 0.1);
      ctx.beginPath();
      if (p.y === ny) {
        var lowY = p.y + (PW * 0.24);
        ctx.moveTo(p.x, lowY);
        ctx.lineTo(nx, lowY);
      } else {
        var lowX = p.x + (PW * 0.24);
        ctx.moveTo(lowX, p.y);
        ctx.lineTo(lowX, ny);
      }
      ctx.stroke();
    }

    function drawPipeConnector(p) {
      var radius = PW / 2;
      var jointGrad = ctx.createRadialGradient(
        p.x - (radius * 0.26),
        p.y - (radius * 0.24),
        Math.max(1, radius * 0.2),
        p.x,
        p.y,
        radius
      );
      jointGrad.addColorStop(0, p.theme.light);
      jointGrad.addColorStop(0.52, p.theme.mid);
      jointGrad.addColorStop(1, p.theme.dark);

      ctx.shadowColor = p.theme.neon;
      ctx.shadowBlur = 7;
      ctx.fillStyle = jointGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(10,14,17,0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius - 0.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = p.theme.seam;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, radius * 0.58), -2.3, -0.45);
      ctx.stroke();
    }

    function reset() {
      ctx.clearRect(0, 0, W, H);
      pipes = Array.from({length: 4}, makePipe);
      pixelCount = 0;
    }

    function resize() {
      cancelAnimationFrame(frameId);
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      W = canvas.width;
      H = canvas.height;
      if (W > 0 && H > 0) reset();
    }

    function tick() {
      // fade to transparent (not white) so pipes fully disappear
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.012)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';

      if (pixelCount > W * H * 0.65) { reset(); return; }
      if (pipes.length < 5 && Math.random() < 0.015) pipes.push(makePipe());

      pipes.forEach(function(p) {
        var d  = DIRS[p.dir];
        var nx = p.x + d.dx * CELL;
        var ny = p.y + d.dy * CELL;

        if (nx < 0 || nx >= W || ny < 0 || ny >= H) {
          var fresh = makePipe();
          p.x = fresh.x; p.y = fresh.y; p.dir = fresh.dir;
          p.theme = fresh.theme; p.stepsToTurn = fresh.stepsToTurn; p.steps = 0;
          return;
        }

        drawPipeSegment(p, nx, ny);

        p.x = nx; p.y = ny; p.steps++;
        pixelCount += CELL;

        // square connector (elbow joint) at every junction
        drawPipeConnector(p);

        if (p.steps >= p.stepsToTurn) {
          p.steps       = 0;
          p.stepsToTurn = rand(4, 14);
          var turn      = Math.random() < 0.8 ? (Math.random() < 0.5 ? 1 : -1) : 2;
          p.dir         = ((p.dir + turn) % 4 + 4) % 4;
          p.theme       = randTheme();
        }
      });
    }

    function loop(ts) {
      if (ts - lastTick >= TICK_MS) {
        tick();
        lastTick = ts;
      }
      frameId = requestAnimationFrame(loop);
    }

    var active = false;
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && !active) {
        active = true;
        frameId = requestAnimationFrame(loop);
      } else if (!entries[0].isIntersecting && active) {
        active = false;
        cancelAnimationFrame(frameId);
      }
    }, {threshold: 0.05}).observe(canvas.parentElement);

    new ResizeObserver(resize).observe(canvas.parentElement);

    resize();
  }

  document.querySelectorAll('canvas.pipe-bg').forEach(function(c) { initPipeBackground(c); });

})();
