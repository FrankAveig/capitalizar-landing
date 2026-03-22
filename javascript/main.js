'use strict';

(function () {
    const WHATSAPP_PHONE = '593987098858';
    const WA_ME_PREFIX = 'https://wa.me/' + WHATSAPP_PHONE;

    /** Escritorio → web.whatsapp.com; móvil/tablet → wa.me (abre la app) */
    function isDesktopWhatsApp() {
        return window.matchMedia('(min-width: 1024px)').matches;
    }

    function buildWhatsAppUrl(text) {
        const enc = encodeURIComponent(text);
        if (isDesktopWhatsApp()) {
            return 'https://web.whatsapp.com/send?phone=' + WHATSAPP_PHONE + '&text=' + enc;
        }
        return WA_ME_PREFIX + '?text=' + enc;
    }

    function initWhatsAppSmartLinks() {
        document.body.addEventListener(
            'click',
            function (e) {
                const a = e.target.closest('a[href^="' + WA_ME_PREFIX + '"]');
                if (!a || !isDesktopWhatsApp()) return;
                e.preventDefault();
                let text = '';
                try {
                    const u = new URL(a.href);
                    text = u.searchParams.get('text') || '';
                } catch (err) {
                    return;
                }
                const next = buildWhatsAppUrl(text);
                if (a.getAttribute('target') === '_blank') {
                    window.open(next, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = next;
                }
            },
            true
        );
    }

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

        const nombre = data.name || '';
        const email = data.email || '';
        const telefono = data.phone || '';
        const proyecto = contactForm.querySelector('#project option:checked')?.textContent || '';
        const mensaje = data.message || '';

        let text = `Hola, soy *${nombre}*`;
        if (proyecto && proyecto !== 'Seleccionar proyecto') text += `\nMe interesa el proyecto: *${proyecto}*`;
        if (telefono) text += `\nMi teléfono: ${telefono}`;
        if (email) text += `\nMi correo: ${email}`;
        if (mensaje) text += `\n\n${mensaje}`;

        const waUrl = buildWhatsAppUrl(text);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        contactForm.reset();
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
        initWhatsAppSmartLinks();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
