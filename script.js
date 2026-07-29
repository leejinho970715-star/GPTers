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
        1024: { slidesPerView: 3.2, spaceBetween: 24 }, // 카드가 3개이므로 적절히 보기 좋게 설정
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
  // 섹션마다 개별 ScrollTrigger로 스코프해서, 페이지의 어느 섹션이든 스크롤로 뷰포트에 들어올 때마다
  // 그 섹션 안의 텍스트/이미지가 각각 독립적으로 하나씩 등장하도록 처리
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

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

    gsap.utils.toArray('section:not(.hero-section)').forEach((section) => {
      // 7-1. 섹션 타이틀 및 헤더 텍스트
      const heading = section.querySelectorAll('h1, h2, h3, .section-header, .animate-fade-up');
      if (heading.length > 0) {
        gsap.from(heading, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 40,
          opacity: 0,
          duration: 2,
          stagger: 0.2,
          ease: 'power3.out',
        });
      }

      // 7-2. 콘텐츠 카드 및 일반 컴포넌트 (.gsap-fade-content 또는 .gsap-fade-card)
      const contentElements = section.querySelectorAll('.gsap-fade-content, .gsap-fade-card');
      if (contentElements.length > 0) {
        gsap.from(contentElements, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          y: 60,
          opacity: 0,
          duration: 2,
          stagger: 0.15, // 여러 콘텐츠가 순차적으로 밀려오듯 등장
          ease: 'power3.out',
        });
      }

      // 7-3. 이미지나 배너 등 스케일(확대) 효과가 함께 필요한 콘텐츠 (.gsap-scale-content)
      const scaleElements = section.querySelectorAll('.gsap-scale-content');
      if (scaleElements.length > 0) {
        gsap.from(scaleElements, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          scale: 0.92,
          opacity: 0,
          duration: 2,
          stagger: 0.2,
          ease: 'power2.out',
        });
      }
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

    // 9. Background Sticky 섹션 — CSS position:sticky만으로 다음 섹션이 부드럽게 위로 슬라이드되며
    // 이전 섹션을 자연스럽게 덮는 효과를 연출 (별도의 축소/페이드 애니메이션 없이 스크롤에 그대로 동기화)

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