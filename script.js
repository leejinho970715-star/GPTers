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
        menuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileNav.classList.remove('hidden');
        menuIconOpen.classList.add('hidden');
        menuIconClose.classList.remove('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
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
  let newsSwiperInstance = null;
  let eventsSwiperInstance = null;

  if (typeof Swiper !== 'undefined') {
    // News Room Swiper
    newsSwiperInstance = new Swiper('.news-swiper', {
      slidesPerView: 1.25,
      spaceBetween: 16,
      loop: false,
      grabCursor: true,
      navigation: {
        nextEl: '.news-next',
        prevEl: '.news-prev',
      },
      breakpoints: {
        640: { slidesPerView: 1.8, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 },
      },
      on: {
        progress(swiper, progress) {
          const fill = document.getElementById('news-progress-fill');
          if (fill) fill.style.width = (progress * 100) + '%';
        },
      },
    });

    // Events & Webinars Swiper (이벤트 섹션 전용)
    eventsSwiperInstance = new Swiper('.events-swiper', {
      slidesPerView: 1.25,
      spaceBetween: 16,
      loop: false,
      grabCursor: true,
      navigation: {
        nextEl: '.events-next', // HTML의 .events-next 버튼과 매칭
        prevEl: '.events-prev', // HTML의 .events-prev 버튼과 매칭
      },
      breakpoints: {
        640: { slidesPerView: 2.3, spaceBetween: 20 },
        1024: { slidesPerView: 3.2, spaceBetween: 24 },
      },
      on: {
        progress(swiper, progress) {
          const fill = document.getElementById('events-progress-fill');
          if (fill) fill.style.width = (progress * 100) + '%';
        },
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

  // 5-1. Newsroom Hero Video → Image Fallback (동영상이 한 번 재생 완료되면 정지 이미지로 전환)
  const newsroomHeroVideo = document.getElementById('newsroom-hero-video');
  if (newsroomHeroVideo) {
    const heroFallbackImg = document.querySelector('.hero-video-fallback');
    newsroomHeroVideo.addEventListener('ended', () => {
      if (heroFallbackImg) {
        heroFallbackImg.classList.add('is-visible');
      }
    });
  }

  // 5-2. Scroll Robot Companion — 클릭하면 맨 위로 부드럽게 스크롤
  const scrollRobotBtn = document.getElementById('scroll-robot');
  if (scrollRobotBtn) {
    scrollRobotBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // 6-1. 게시판/뉴스룸 좋아요(하트) 버튼 토글
  document.querySelectorAll('.like-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.toggle('is-active');
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  });

  // 7. Advanced GSAP Scroll Animations (Text & Content Elements)
  // 요소마다 서로 다른 모션 클래스(위/좌/우 슬라이드, 줌인, 회전, 마스크 리빌, 패럴랙스)를 부여해
  // 스크롤로 뷰포트에 들어올 때마다 텍스트/이미지가 다양한 방식으로 등장하도록 처리 (등장 모션은 모두 2초 지속)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const ENTRANCE_DURATION = 2;

    // 7-0. 히어로 섹션은 스크롤 없이 처음부터 화면에 보이므로 스크롤 트리거 대신 페이지 로드 시 바로 등장
    const heroEntranceEls = document.querySelectorAll('.hero-section .animate-fade-up, .hero-section .gsap-fade-content');
    if (heroEntranceEls.length > 0) {
      gsap.from(heroEntranceEls, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2,
      });
    }

    // 7-1. 아래에서 위로 페이드 (본문 텍스트 기본 모션 — 기존 .animate-fade-up 마크업 호환 유지)
    gsap.utils.toArray('section:not(.hero-section) .gsap-fade-up, section:not(.hero-section) .animate-fade-up').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        y: 50,
        opacity: 0,
        duration: ENTRANCE_DURATION,
        ease: 'power3.out',
        clearProps: 'transform',
      });
    });

    // 7-2. 왼쪽에서 슬라이드 등장 (섹션 타이틀 등)
    gsap.utils.toArray('section:not(.hero-section) .gsap-fade-left').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        x: -90,
        opacity: 0,
        duration: ENTRANCE_DURATION,
        ease: 'power3.out',
        clearProps: 'transform',
      });
    });

    // 7-3. 오른쪽에서 슬라이드 등장 (타이틀/버튼 등)
    gsap.utils.toArray('section:not(.hero-section) .gsap-fade-right').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        x: 90,
        opacity: 0,
        duration: ENTRANCE_DURATION,
        ease: 'power3.out',
        clearProps: 'transform',
      });
    });

    // 7-4. 카드/리스트 그룹 — 순차적으로 밀려오듯 등장 (.gsap-fade-card)
    gsap.utils.toArray('section:not(.hero-section)').forEach((section) => {
      const cardGroups = section.querySelectorAll('.gsap-fade-card');
      if (cardGroups.length > 0) {
        gsap.from(cardGroups, {
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
          y: 60,
          opacity: 0,
          duration: ENTRANCE_DURATION,
          stagger: 0.15,
          ease: 'power3.out',
          clearProps: 'transform',
        });
      }
    });

    // 7-5. 이미지 줌인 등장 (배경/썸네일 이미지)
    gsap.utils.toArray('.gsap-zoom-in').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        scale: 0.85,
        opacity: 0,
        duration: ENTRANCE_DURATION,
        ease: 'power2.out',
        clearProps: 'transform',
      });
    });

    // 7-6. 회전하며 등장 (아이콘/썸네일 이미지)
    gsap.utils.toArray('.gsap-rotate-in').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
        rotation: -14,
        scale: 0.88,
        opacity: 0,
        duration: ENTRANCE_DURATION,
        ease: 'power2.out',
        clearProps: 'transform',
      });
    });

    // 7-7. 클립 패스 마스크 리빌 — 커튼이 걷히듯 이미지가 드러남
    gsap.utils.toArray('.gsap-reveal-mask').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          duration: ENTRANCE_DURATION,
          ease: 'power3.inOut',
        }
      );
    });

    // 7-8. 배경 이미지 패럴랙스 — 섹션을 스크롤하는 동안 배경이 콘텐츠보다 느리게 움직여 입체감 연출
    gsap.utils.toArray('.gsap-parallax').forEach((el) => {
      gsap.to(el, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // 7-9. 켄번즈 줌 — 섹션이 스크롤되는 동안 배경 영상/이미지가 서서히 확대
    gsap.utils.toArray('.gsap-kenburns').forEach((el) => {
      gsap.to(el, {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // 8. 스크롤 시 섹션을 고정하고, 세로 스크롤을 스와이퍼 가로 진행으로 변환
    // 모든 슬라이드를 다 넘기면 고정이 풀리고 다음 섹션으로 자연스럽게 스크롤됨 (데스크톱 전용)
    ScrollTrigger.matchMedia({
      '(min-width: 1024px)': function () {
        function pinSwiperSection(sectionEl, swiperInstance, distanceMultiplier) {
          if (!sectionEl || !swiperInstance) return;
          const headerEl = document.querySelector('.header');
          const headerHeight = headerEl ? headerEl.offsetHeight : 0;

          ScrollTrigger.create({
            trigger: sectionEl,
            start: 'top ' + headerHeight + 'px',
            end: () => '+=' + Math.round(window.innerHeight * distanceMultiplier),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              swiperInstance.setProgress(self.progress, 0);
            },
          });
        }

        pinSwiperSection(document.querySelector('.news-section'), newsSwiperInstance, 1.5);
        pinSwiperSection(document.querySelector('.events-section'), eventsSwiperInstance, 1.5);
      },
    });

    // 9. 스크롤 따라오는 로봇 컴패니언 — position:fixed로 항상 화면에 붙어있고,
    // 스크롤 진행률에 맞춰 scrub로 부드럽게 계속 회전
    if (scrollRobotBtn) {
      gsap.to(scrollRobotBtn, {
        rotation: 1440,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      });
    }

    // 10. 이미지 등 늦게 로드되는 콘텐츠 때문에 문서 높이가 나중에 늘어나면서
    // pin 스페이서 계산이 어긋나 페이지 끝(푸터)이 밀리는 문제 방지 — 모든 리소스 로드 완료 후 강제로 재계산
    // (레이아웃이 여러 단계에 걸쳐 안정되는 경우를 대비해 약간의 지연 후 한 번 더 재계산)
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
      setTimeout(() => ScrollTrigger.refresh(), 300);
      setTimeout(() => ScrollTrigger.refresh(), 1000);
      setTimeout(() => ScrollTrigger.refresh(), 2000);
    });
  }
});