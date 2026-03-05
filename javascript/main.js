'use strict';

(function () {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const contactForm = document.getElementById('contact-form');

    function handleScroll() {
        header.classList.toggle('header--scrolled', window.scrollY > 50);
        updateActiveNav();
    }

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('header__nav-link--active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('header__nav-link--active');
                    }
                });
            }
        });
    }

    function toggleMenu() {
        const isOpen = mainNav.classList.toggle('header__nav--open');
        menuToggle.classList.toggle('header__menu-toggle--active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
        mainNav.classList.remove('header__nav--open');
        menuToggle.classList.remove('header__menu-toggle--active');
        document.body.style.overflow = '';
    }

    function initRevealAnimations() {
        const revealElements = document.querySelectorAll(
            '.about__content, .about__visual, ' +
            '.project-card, .service-card, ' +
            '.timeline__item, .objective-card, ' +
            '.credit__content, .credit__chart, ' +
            '.contact__card, .projects__header'
        );

        revealElements.forEach((el, i) => {
            el.classList.add('reveal');
            const delayClass = 'reveal--delay-' + ((i % 4) + 1);
            el.classList.add(delayClass);
        });

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal--visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        revealElements.forEach(el => observer.observe(el));
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        const btn = contactForm.querySelector('.btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '¡Mensaje enviado! ✓';
        btn.style.pointerEvents = 'none';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.pointerEvents = '';
            contactForm.reset();
        }, 3000);

        console.log('Form data:', data);
    }

    function smoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                e.preventDefault();
                const target = document.querySelector(targetId);
                if (!target) return;

                const offset = header.offsetHeight + 20;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({ top: targetPos, behavior: 'smooth' });
                closeMenu();
            });
        });
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.hero__stat-value');
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.5 }
        );
        counters.forEach(c => observer.observe(c));
    }

    function init() {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMenu);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        smoothScrollLinks();
        initRevealAnimations();
        animateCounters();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
