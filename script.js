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
        menuIconClose.classList.add('hidden');
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
    // News Room Swiper
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

    // Events & Webinars Swiper (이벤트 섹션 전용)
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
        nextEl: '.events-next', // HTML의 .events-next 버튼과 매칭
        prevEl: '.events-prev', // HTML의 .events-prev 버튼과 매칭
      },
      breakpoints: {
        640: { slidesPerView: 2.3, spaceBetween: 20 },
        1024: { slidesPerView: 3.2, spaceBetween: 24 }, // 카드가 3개이므로 적절히 보기 좋게 설정
      },
    });
  }


  // 5. Family Site Dropdown Toggle
  const familySiteBtn = document.getElementById('family-site-btn');
  if (familySiteBtn) {
    familySiteBtn.addEventListener('click', () => {
      alert('패밀리 사이트 선택: 지피터스 커뮤니티, 지피터스 스터디, 지니파이 공식 웹사이트');
    });
  }

  // 6. Sticky Header on Scroll
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'z-50', 'shadow-lg');
        header.style.backgroundColor = 'rgba(9, 8, 23, 0.85)';
        header.style.backdropFilter = 'blur(12px)';
      } else {
        header.classList.remove('fixed', 'top-0', 'left-0', 'w-full', 'z-50', 'shadow-lg');
        header.style.backgroundColor = '';
        header.style.backdropFilter = '';
      }
    });
  }

  // 7. Advanced GSAP Scroll Animations (Text & Content Elements)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // 7-1. 섹션 타이틀 및 헤더 모션
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

    // 7-2. 콘텐츠 카드 및 일반 컴포넌트 스크롤 등장 모션 (.gsap-fade-content 또는 .gsap-fade-card)
    const contentElements = document.querySelectorAll('.gsap-fade-content, .gsap-fade-card');
    if (contentElements.length > 0) {
      gsap.from(contentElements, {
        scrollTrigger: {
          trigger: contentElements[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15, // 여러 콘텐츠가 순차적으로 밀려오듯 등장
        ease: 'power3.out',
      });
    }

    // 7-3. 이미지나 배너 등 스케일(확대) 효과가 함께 필요한 콘텐츠 (.gsap-scale-content)
    const scaleElements = document.querySelectorAll('.gsap-scale-content');
    if (scaleElements.length > 0) {
      gsap.from(scaleElements, {
        scrollTrigger: {
          trigger: scaleElements[0],
          start: 'top 85%',
        },
        scale: 0.92,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
      });
    }
  }
});