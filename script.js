class ThemeManager {
    constructor() {
        this.toggle = document.getElementById('theme-toggle');
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
    }
}

class MobileNavigation {
    constructor() {
        this.header = document.getElementById('main-header');
        this.menuButton = document.getElementById('toggle-navigation-menu');
        if (!this.menuButton || !this.header) return;

        this.menuButton.addEventListener('click', () => this.toggle());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });

        document.querySelectorAll('#navigation-menu a').forEach(a => {
            a.addEventListener('click', () => this.close());
        });
    }

    toggle() {
        const isOpen = this.header.classList.toggle('menu-open');
        this.menuButton.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);
    }

    close() {
        this.header.classList.remove('menu-open');
        if (this.menuButton) this.menuButton.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }
}

class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const header = document.getElementById('main-header');
                const offset = header ? header.offsetHeight + 16 : 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
                history.pushState(null, '', href);
            });
        });
    }
}

class LazyImages {
    constructor() {
        const images = document.querySelectorAll('img[data-src]');
        if (!images.length) return;

        if (!('IntersectionObserver' in window)) {
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '150px' });

        images.forEach(img => observer.observe(img));
    }
}

class NavigationHighlight {
    constructor() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('#navigation-menu a[href^="#"]');
        if (!sections.length || !navLinks.length) return;

        const setActive = (id) => {
            navLinks.forEach(link => {
                const active = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', active);
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });

        sections.forEach(s => observer.observe(s));

        // Set initial active state based on hash
        const hash = window.location.hash;
        if (hash) setActive(hash.slice(1));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new MobileNavigation();
    new SmoothScroll();
    new LazyImages();
    new NavigationHighlight();
});
