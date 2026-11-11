/* ==========================================================================
   RAIDERS SPORTS ACADEMY – CORE SHARED APPLICATION SCRIPT
   Handles: Theme Switcher, RTL/LTR Switcher (with Arabic support),
   Public Navbar/Mobile Drawer, Demo Auth Session, Three.js Stadium Canvas,
   GSAP Animations, AOS, Swiper.js, Animated Counters, Toast & AJAX Helpers
   ========================================================================== */

(function () {
  const { STORAGE_KEYS, getStoredJSON, setStoredJSON } = window.RSA_DATA;
  let activeSwipers = [];

  const ARABIC_NAV_LABELS = {
    home: 'الرئيسية',
    home1: 'الرئيسية ١: الكابادي',
    home2: 'الرئيسية ٢: خو-خو',
    programs: 'البرامج التدريبية',
    coaches: 'المدربون',
    about: 'عن الأكاديمية',
    contact: 'تواصل معنا',
    login: 'تسجيل الدخول',
    dashboard: 'لوحة اللاعب',
    join: 'انضم للأكاديمية',
    menuLabel: 'القائمة'
  };

  const ENGLISH_NAV_LABELS = {
    home: 'Home',
    home1: 'Home 1: Kabaddi',
    home2: 'Home 2: Kho-Kho',
    programs: 'Programs',
    coaches: 'Coaches',
    about: 'About Academy',
    contact: 'Contact',
    login: 'Login',
    dashboard: 'Dashboard',
    join: 'Join Academy',
    menuLabel: 'MENU'
  };

  function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      const iconName = theme === 'dark' ? 'sun' : 'moon';
      const label = theme === 'dark' ? 'Light' : 'Dark';
      const iconEl = btn.querySelector('[data-theme-icon]');
      const textEl = btn.querySelector('[data-theme-label]');
      if (iconEl) iconEl.setAttribute('data-lucide', iconName);
      if (textEl) textEl.textContent = label;
      btn.setAttribute('aria-label', `Switch to ${label} Mode`);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
    window.dispatchEvent(new CustomEvent('rsa:themechange', { detail: { theme } }));
  }

  function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  function getDir() {
    return localStorage.getItem(STORAGE_KEYS.DIR) || 'ltr';
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(STORAGE_KEYS.DIR, dir);

    const dict = dir === 'rtl' ? ARABIC_NAV_LABELS : ENGLISH_NAV_LABELS;
    document.querySelectorAll('[data-i18n-nav]').forEach((el) => {
      const key = el.getAttribute('data-i18n-nav');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-dir-toggle]').forEach((btn) => {
      const textEl = btn.querySelector('[data-dir-label]');
      if (textEl) textEl.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left (Arabic)');
    });

    // Update Arabic direction indicator banner if present
    document.querySelectorAll('[data-rtl-greeting]').forEach((el) => {
      const enText = el.getAttribute('data-en-text') || '';
      const arText = el.getAttribute('data-ar-text') || '';
      if (arText) el.textContent = dir === 'rtl' ? arText : enText;
    });

    // Re-init Swipers cleanly for RTL
    if (activeSwipers.length > 0 && window.Swiper) {
      initSwipers();
    }

    window.dispatchEvent(new CustomEvent('rsa:dirchange', { detail: { dir } }));
  }

  function toggleDir() {
    const next = getDir() === 'ltr' ? 'rtl' : 'ltr';
    applyDir(next);
  }

  function getSession() {
    return getStoredJSON(STORAGE_KEYS.SESSION, null);
  }

  function logoutDemoSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.location.href = 'login.html';
  }

  function showToast(title, message, type = 'info') {
    let container = document.getElementById('rsaToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'rsaToastContainer';
      container.className = 'academy-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `academy-toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <div class="flex-grow-1">
        <div class="fw-bold mb-1">${title}</div>
        <div class="text-secondary-custom" style="font-size:0.83rem;">${message}</div>
      </div>
      <button type="button" class="btn-close btn-sm" aria-label="Close"></button>
    `;
    toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 5200);
  }

  function syncNavbarAuthUI() {
    const session = getSession();
    const isLoggedIn = Boolean(session && session.playerId);

    document.querySelectorAll('[data-auth-guest]').forEach((el) => {
      el.classList.toggle('d-none', isLoggedIn);
    });
    document.querySelectorAll('[data-auth-player]').forEach((el) => {
      el.classList.toggle('d-none', !isLoggedIn);
    });
  }

  function initPublicNavbar() {
    const navbar = document.querySelector('.academy-navbar');
    const toggleBtn = document.getElementById('mobileMenuOpenBtn');
    const closeBtn = document.getElementById('mobileMenuCloseBtn');
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');

    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('is-scrolled', window.scrollY > 18);
      }, { passive: true });
    }

    // Inject 3D Edge Navbar hover sensor & bottom-right MENU dock on public pages
    let hoverZone = document.getElementById('edge3dHoverZone');
    let dockBtn = document.getElementById('edge3dDockBtn');
    if (navbar && drawer && !hoverZone) {
      hoverZone = document.createElement('div');
      hoverZone.id = 'edge3dHoverZone';
      hoverZone.className = 'edge3d-hover-zone';
      hoverZone.setAttribute('aria-hidden', 'true');
      document.body.appendChild(hoverZone);

      dockBtn = document.createElement('button');
      dockBtn.type = 'button';
      dockBtn.id = 'edge3dDockBtn';
      dockBtn.className = 'edge3d-dock-btn';
      dockBtn.setAttribute('aria-label', 'Open 3D Edge Navigation Menu');
      dockBtn.setAttribute('aria-expanded', 'false');
      dockBtn.setAttribute('aria-controls', 'mobileNavDrawer');
      dockBtn.innerHTML = `
        <span class="edge3d-dock-rail" aria-hidden="true"></span>
        <span class="edge3d-dock-text" data-i18n-nav="menuLabel">MENU</span>
        <span class="edge3d-dock-icon" aria-hidden="true">
          <span></span><span></span><span></span>
        </span>
      `;
      document.body.appendChild(dockBtn);

      const header = drawer.querySelector('.mobile-drawer-header');
      if (header && !drawer.querySelector('.edge3d-panel-tag')) {
        const tag = document.createElement('div');
        tag.className = 'edge3d-panel-tag';
        tag.innerHTML = '<i data-lucide="box" style="width:13px;height:13px;"></i><span>3D Edge Nav</span>';
        header.insertAdjacentElement('afterend', tag);
      }
    }

    let pinnedOpen = false;
    let hoverCloseTimer = null;

    function setDrawer(open, mode = 'pin') {
      if (!drawer || !backdrop) return;
      clearTimeout(hoverCloseTimer);

      const isHoverMode = open && mode === 'hover' && !pinnedOpen;
      if (!open) {
        pinnedOpen = false;
      } else if (mode === 'pin') {
        pinnedOpen = true;
      }

      drawer.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
      backdrop.classList.toggle('is-hover-mode', isHoverMode);
      document.body.classList.toggle('edge3d-panel-open', open);
      document.body.style.overflow = open && pinnedOpen ? 'hidden' : '';

      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(open));
      if (dockBtn) dockBtn.setAttribute('aria-expanded', String(open));
    }

    function openByHover() {
      clearTimeout(hoverCloseTimer);
      if (!pinnedOpen) {
        setDrawer(true, 'hover');
      }
    }

    function scheduleHoverClose() {
      clearTimeout(hoverCloseTimer);
      if (pinnedOpen) return;
      hoverCloseTimer = setTimeout(() => {
        if (!pinnedOpen) setDrawer(false, 'hover');
      }, 180);
    }

    if (hoverZone) {
      hoverZone.addEventListener('mouseenter', openByHover);
      hoverZone.addEventListener('mouseleave', scheduleHoverClose);
    }
    if (dockBtn) {
      dockBtn.addEventListener('mouseenter', openByHover);
      dockBtn.addEventListener('mouseleave', scheduleHoverClose);
      dockBtn.addEventListener('click', () => {
        const currentlyPinned = pinnedOpen && drawer && drawer.classList.contains('open');
        setDrawer(!currentlyPinned, 'pin');
      });
    }
    if (drawer) {
      drawer.addEventListener('mouseenter', () => {
        clearTimeout(hoverCloseTimer);
      });
      drawer.addEventListener('mouseleave', scheduleHoverClose);
      drawer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setDrawer(false, 'pin'));
      });
    }

    if (toggleBtn) toggleBtn.addEventListener('click', () => setDrawer(true, 'pin'));
    if (closeBtn) closeBtn.addEventListener('click', () => setDrawer(false, 'pin'));
    if (backdrop) backdrop.addEventListener('click', () => setDrawer(false, 'pin'));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
        setDrawer(false, 'pin');
      }
    });

    // Active page highlight
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav-page]').forEach((el) => {
      const target = el.getAttribute('data-nav-page');
      if (target === page || (page === '' && target === 'index.html')) {
        el.classList.add('active');
      }
    });

    syncNavbarAuthUI();
  }

  function initThreeStadiumBg() {
    const canvas = document.getElementById('heroThreeCanvas');
    if (!canvas || !window.THREE) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = canvas.parentElement;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Subtle Championship Stadium Floodlight Particles
    const count = 90;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const orange = new THREE.Color('#FF5722');
    const yellow = new THREE.Color('#FFD43B');

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const c = i % 3 === 0 ? yellow : orange;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: 0.72
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      points.rotation.y += 0.0012;
      points.rotation.x += 0.0005;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  function initGSAPAndCounters() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.gsap && !reduced) {
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      const heroItems = document.querySelectorAll('.gsap-hero-stagger');
      if (heroItems.length) {
        gsap.from(heroItems, {
          y: 28,
          opacity: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform'
        });
      }
    }

    // Animated Counters
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!counters.length) return;

    const runCounter = (el) => {
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';
      const target = parseInt(el.getAttribute('data-counter-target'), 10) || 0;
      const suffix = el.getAttribute('data-counter-suffix') || '';

      if (reduced) {
        el.textContent = target.toLocaleString() + suffix;
        return;
      }

      const obj = { val: 0 };
      if (window.gsap) {
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toLocaleString() + suffix;
          }
        });
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    };

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) runCounter(entry.target);
        });
      }, { threshold: 0.35 });
      counters.forEach((c) => obs.observe(c));
    } else {
      counters.forEach(runCounter);
    }
  }

  function initSwipers() {
    if (!window.Swiper) return;
    activeSwipers.forEach((s) => s.destroy && s.destroy(true, true));
    activeSwipers = [];

    const champEl = document.querySelector('.champions-swiper');
    if (champEl) {
      activeSwipers.push(new Swiper(champEl, {
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        pagination: { el: '.champions-swiper .swiper-pagination', clickable: true },
        navigation: {
          nextEl: '.champions-next',
          prevEl: '.champions-prev'
        },
        breakpoints: {
          576: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 }
        }
      }));
    }

    const testEl = document.querySelector('.testimonials-swiper');
    if (testEl) {
      activeSwipers.push(new Swiper(testEl, {
        slidesPerView: 1,
        spaceBetween: 22,
        grabCursor: true,
        pagination: { el: '.testimonials-swiper .swiper-pagination', clickable: true },
        breakpoints: {
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 }
        }
      }));
    }
  }

  function initAOS() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.AOS && !reduced) {
      AOS.init({
        duration: 550,
        once: true,
        offset: 20
      });
      document.documentElement.classList.add('rsa-aos-active');
      setTimeout(() => {
        if (window.AOS) window.AOS.refreshHard();
      }, 150);
    }
  }

  function initAjaxContactForms() {
    if (!window.jQuery) return;
    const $ = window.jQuery;

    $('.js-ajax-contact-form').on('submit', function (e) {
      e.preventDefault();
      const $form = $(this);
      const name = $.trim($form.find('[name="contactName"]').val());
      const email = $.trim($form.find('[name="contactEmail"]').val());
      const sport = $form.find('[name="contactSport"]').val();
      const msg = $.trim($form.find('[name="contactMessage"]').val());

      if (!name || !email || !msg || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Check Required Fields', 'Please enter a valid name, email address, and inquiry message.', 'error');
        return;
      }

      const $btn = $form.find('button[type="submit"]');
      const originalHtml = $btn.html();
      $btn.prop('disabled', true).text('Sending (Demo AJAX)...');

      // Simulated jQuery AJAX submission saved locally in demo store
      $.Deferred(function (dfd) {
        setTimeout(() => {
          const contacts = getStoredJSON(STORAGE_KEYS.CONTACTS, []);
          contacts.unshift({ id: 'inq-' + Date.now(), name, email, sport, msg, createdAt: new Date().toISOString() });
          setStoredJSON(STORAGE_KEYS.CONTACTS, contacts);
          dfd.resolve({ ok: true });
        }, 450);
      }).done(function () {
        $btn.prop('disabled', false).html(originalHtml);
        $form[0].reset();
        showToast('Inquiry Recorded (Demo Mode)', 'Your academy inquiry was logged in demo mode. Visit Programs or Register to try enrollment.', 'success');
      });
    });
  }

  function bindGlobalToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });
    document.querySelectorAll('[data-dir-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggleDir);
    });
    document.querySelectorAll('[data-logout-btn]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        logoutDemoSession();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPublicNavbar();
    applyTheme(getTheme());
    applyDir(getDir());
    bindGlobalToggles();
    initThreeStadiumBg();
    initAOS();
    initSwipers();
    initGSAPAndCounters();
    initAjaxContactForms();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  window.RSA_APP = {
    getTheme,
    applyTheme,
    toggleTheme,
    getDir,
    applyDir,
    toggleDir,
    getSession,
    logoutDemoSession,
    showToast,
    syncNavbarAuthUI
  };
})();

