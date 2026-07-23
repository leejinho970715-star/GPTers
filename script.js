document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileNav.classList.contains('hidden');
      if (isOpen) {
        mobileNav.classList.add('hidden');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      } else {
        mobileNav.classList.remove('hidden');
        menuIconOpen.classList.add('hidden');
        menuIconClose.classList.add('hidden'); // Fixed typo or kept consistent
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      });
    });
  }

  // 2. Search & Recommended Tags Interaction
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const searchFeedback = document.getElementById('search-feedback');
  const tagButtons = document.querySelectorAll('.tag-btn');

  function performSearch(term) {
    const rawVal = term !== undefined ? term : (searchInput ? searchInput.value : '');
    if (rawVal && rawVal.trim()) {
      const cleanTerm = rawVal.replace(/^#/, '');
      if (searchFeedback) {
        searchFeedback.textContent = `“${cleanTerm}” 관련 AI 실무 사례를 찾고 있어요.`;
        searchFeedback.classList.remove('hidden');
      }
    }
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', () => performSearch());
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }

  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const fullTag = btn.textContent.trim();
      const rawText = fullTag.replace(/^#/, '');
      if (searchInput) {
        searchInput.value = rawText;
      }
      performSearch(fullTag);
    });
  });

  // 3. Count Up Animation for Statistics
  const statElements = document.querySelectorAll('[data-stat-value]');
  let hasAnimatedStats = false;

  function animateCounters() {
    statElements.forEach(el => {
      const targetVal = parseFloat(el.getAttribute('data-stat-value'));
      const suffix = el.getAttribute('data-stat-suffix') || '';
      const forceDecimal = el.getAttribute('data-stat-decimal') === 'true';

      const startTime = performance.now();
      const duration = 1800;

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const n = Math.round(targetVal * easeOutCubic);

        let formatted = '';
        if (n >= 1000) {
          const kVal = Math.floor(n / 1000);
          const rem = n % 1000;
          if (rem || forceDecimal) {
            const dec = Math.floor((rem % 1000) / 100);
            formatted = `${kVal}.${dec}K`;
          } else {
            formatted = `${kVal}K`;
          }
        } else {
          formatted = n.toString();
        }

        el.textContent = formatted + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  const statsSection = document.getElementById('stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          animateCounters();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsSection);
  } else {
    animateCounters();
  }

  // 4. Swiper Initialization (News Room & Events & Webinars)
  if (typeof Swiper !== 'undefined') {
    new Swiper('.news-swiper', {
      slidesPerView: 1.25,
      spaceBetween: 16,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3800,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.news-next',
        prevEl: '.news-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2.3, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 24 },
      },
    });

    new Swiper('.events-swiper', {
      slidesPerView: 1.25,
      spaceBetween: 16,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 4200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.events-next',
        prevEl: '.events-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2.3, spaceBetween: 20 },
        1024: { slidesPerView: 4, spaceBetween: 24 },
      },
    });
  } else {
    function initFallbackDrag(containerId, prevBtnSelector, nextBtnSelector) {
      const container = document.getElementById(containerId);
      if (!container) return;

      const wrapper = container.querySelector('.swiper-wrapper');
      if (!wrapper) return;

      wrapper.style.display = 'flex';
      wrapper.style.overflowX = 'auto';
      wrapper.style.scrollBehavior = 'smooth';
      wrapper.style.scrollbarWidth = 'none';

      let isDown = false;
      let startX;
      let scrollLeft;

      wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
      });

      wrapper.addEventListener('mouseleave', () => { isDown = false; });
      wrapper.addEventListener('mouseup', () => { isDown = false; });

      wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2;
        wrapper.scrollLeft = scrollLeft - walk;
      });

      const prevBtn = document.querySelector(prevBtnSelector);
      const nextBtn = document.querySelector(nextBtnSelector);

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          wrapper.scrollBy({ left: -320, behavior: 'smooth' });
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          wrapper.scrollBy({ left: 320, behavior: 'smooth' });
        });
      }
    }

    initFallbackDrag('news-swiper', '.news-prev', '.news-next');
    initFallbackDrag('events-swiper', '.events-prev', '.events-next');
  }

  // 5. Family Site Dropdown Toggle
  const familySiteBtn = document.getElementById('family-site-btn');
  if (familySiteBtn) {
    familySiteBtn.addEventListener('click', () => {
      alert('패밀리 사이트 선택: 지피터스 커뮤니티, 지피터스 스터디, 지니파이 공식 웹사이트');
    });
  }

  // 6. Sticky Header on Scroll (Added)
  const header = document.querySelector('header');
  if (header) {
    // 헤더가 스크롤 시 fixed로 바뀔 때 레이아웃 흔들림 방지 및 스타일 제어용 클래스 혹은 인라인 속성 처리
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'z-50', 'shadow-lg');
        header.style.backgroundColor = 'rgba(9, 8, 23, 0.85)'; // 스크롤 시 배경 어둡게 및 블러 강화
        header.style.backdropFilter = 'blur(12px)';
      } else {
        header.classList.remove('fixed', 'top-0', 'left-0', 'w-full', 'z-50', 'shadow-lg');
        header.style.backgroundColor = ''; // 원래 스타일로 복원
        header.style.backdropFilter = '';
      }
    });
  }

  // 7. GSAP Scroll Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('section').forEach((section) => {
      const heading = section.querySelectorAll('h2, h3, .section-header, .animate-fade-up');
      if (heading.length > 0) {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
        });
      }
    });

    const fadeCards = document.querySelectorAll('.gsap-fade-card');
    if (fadeCards.length > 0) {
      gsap.from(fadeCards, {
        scrollTrigger: {
          trigger: fadeCards[0],
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
      });
    }
  }
});