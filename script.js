document.addEventListener('DOMContentLoaded', () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    window.scrollTo(0, 0);
    
    if (window.location.hash && window.location.hash !== '#') {
        if (history.replaceState) {
            history.replaceState(null, null, window.location.pathname);
        } else {
            window.location.hash = '';
        }
    }
    
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const navOverlay = document.querySelector('.nav-overlay');
    const navItems = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);
    navItems.forEach(link => link.addEventListener('click', closeMenu));

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    const sections = document.querySelectorAll('section:not(#home)');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(item => item.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
});


/* ---- 3D tilt + number chooser ---- */
(function () {
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
        document.querySelectorAll('.about-card, .course-card, .link-card, .contact-card, .hero-logo-large').forEach(function (el) {
            el.classList.add('t3');
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
                el.style.setProperty('--ry', (x * 16).toFixed(1) + 'deg');
                el.style.setProperty('--rx', (-y * 16).toFixed(1) + 'deg');
            });
            ['pointerleave', 'pointerup', 'pointercancel'].forEach(function (ev) {
                el.addEventListener(ev, function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
            });
        });
    }
    var NUMBERS = [['01287128091', '201287128091'], ['01206177219', '201206177219']];
    var KINDS = {
        wa: { title: 'WhatsApp', href: function (n) { return 'https://wa.me/' + n[1]; }, ext: true },
        tel: { title: 'Phone', href: function (n) { return 'tel:+' + n[1]; }, ext: false }
    };
    var box = document.getElementById('chooser'), list = document.getElementById('chooser-list'), ttl = document.getElementById('chooser-title'), lastFocus = null;
    function open(kind, trigger) {
        var k = KINDS[kind]; if (!k) return;
        lastFocus = trigger; ttl.textContent = k.title;
        list.innerHTML = '';
        NUMBERS.forEach(function (n) {
            var a = document.createElement('a'); a.href = k.href(n); a.textContent = n[0];
            if (k.ext) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
            a.addEventListener('click', close);
            list.appendChild(a);
        });
        box.hidden = false;
        var first = list.querySelector('a'); if (first) first.focus();
    }
    function close() { box.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
    document.querySelectorAll('[data-choose]').forEach(function (el) {
        el.addEventListener('click', function (e) { e.preventDefault(); open(el.getAttribute('data-choose'), el); });
        el.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); open(el.getAttribute('data-choose'), el); } });
    });
    document.getElementById('chooser-close').addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
})();
