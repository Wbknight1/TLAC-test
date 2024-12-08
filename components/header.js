class Header extends HTMLElement {
    constructor() {
        super();
        this.userRole = this.getAttribute('user-role') || 'guest';
        this.theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    getNavLinks() {
        const common = [
            { href: 'https://github.com/Bmarshy/Group-8-TLAC.git', text: 'Github', target: '_blank' }
        ];

        const roleSpecific = {
            admin: [
                { href: '/TLAC-test/pages/admin.html', text: 'Admin Dashboard' }, 
                { href: '/TLAC-test/pages/about.html', text: 'About Us' }, 
                { href: '/TLAC-test/pages/faq.html', text: 'FAQ' }
            ],
            trainer: [
                { href: '/TLAC-test/pages/trainer.html', text: 'Trainer Dashboard' }, 
                { href: '/TLAC-test/pages/about.html', text: 'About Us' }, 
                { href: '/TLAC-test/pages/faq.html', text: 'FAQ' }
            ],
            trainee: [
                { href: '/TLAC-test/pages/trainee.html', text: 'Member Dashboard' }, 
                { href: '/TLAC-test/pages/about.html', text: 'About Us' }, 
                { href: '/TLAC-test/pages/faq.html', text: 'FAQ' }
            ],
            guest: [
                { href: '/TLAC-test/index.html', text: 'Home' }, 
                { href: '/TLAC-test/pages/about.html', text: 'About Us' }, 
                { href: '/TLAC-test/pages/faq.html', text: 'FAQ' }
            ]
        };

        return [...(roleSpecific[this.userRole] || []), ...common];
    }

    toggleTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    connectedCallback() {
        const currentPage = window.location.pathname;
        const links = this.getNavLinks();
        
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg sticky-top">
                <div class="container">
                    <a class="navbar-brand mt-2" href="/TLAC-test/index.html">
                        <img src="/TLAC-test/assets/images/logo.png" alt="TLAC Logo">
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            ${links.map(link => `
                                <li class="nav-item">
                                    <a class="nav-link ${currentPage === link.href ? 'active' : ''}" 
                                       href="${link.href}">${link.text}</a>
                                </li>
                            `).join('')}
                            <li class="nav-item">
                                <button class="nav-link" id="themeToggle">
                                    <i class="ri-${this.theme === 'light' ? 'moon' : 'sun'}-line"></i>
                                </button>
                            </li>
                        </ul>
                        ${this.userRole === 'guest' 
                            ? '<a href="/TLAC-test/pages/login.html" class="btn btn-brand ms-lg-3">Login/Sign-Up</a>'
                            : '<a href="/TLAC-test/index.html" class="btn btn-brand ms-lg-3">Logout</a>'}
                    </div>
                </div>
            </nav>`;

        // Add theme toggle event listener
        this.querySelector('#themeToggle').addEventListener('click', () => {
            this.toggleTheme();
            // Update icon
            const icon = this.querySelector('#themeToggle i');
            icon.className = `ri-${document.documentElement.getAttribute('data-theme') === 'light' ? 'moon' : 'sun'}-line`;
        });
    }
}

customElements.define('header-component', Header);