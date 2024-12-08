
class Header extends HTMLElement {
    constructor() {
        super();
        this.userRole = this.getAttribute('user-role') || 'guest';
    }

    getNavLinks() {
        const common = [
            // { href: '/pages/about.html', text: 'About Us' },
            // { href: '/pages/faq.html', text: 'FAQ' },
            { href: 'https://github.com/Bmarshy/Group-8-TLAC.git', text: 'Github', targget: '_blank' }
        ];

        const roleSpecific = {
            admin: [{ href: '/admin.html', text: ' Admin Dashboard' }, { href: '/about.html', text: 'About Us' }, { href: '/faq.html', text: 'FAQ' }],
            trainer: [{ href: '/trainer.html', text: 'Trainer Dashboard' }, { href: '/about.html', text: 'About Us' }, { href: '/faq.html', text: 'FAQ' }],
            trainee: [{ href: '/trainee.html', text: 'Member Dashboard' }, { href: '/about.html', text: 'About Us' }, { href: '/faq.html', text: 'FAQ' }],
            guest: [{ href: '../index.html', text: 'Home' }, { href: '/pages/about.html', text: 'About Us' }, { href: '/pages/faq.html', text: 'FAQ' }]
        };

        return [...(roleSpecific[this.userRole] || []), ...common];
    }

    connectedCallback() {
        const currentPage = window.location.pathname;
        const links = this.getNavLinks();
        
        this.innerHTML = `
            <nav class="navbar navbar-expand-lg bg-white sticky-top">
                <div class="container">
                    <a class="navbar-brand" href="../index.html">
                        <img src="../assets/images/logo.png" alt="image">
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            ${links.map(link => `
                                <li class="nav-item">
                                    <a class="nav-link ${currentPage.includes(link.href) ? 'active' : ''}" 
                                       href="${link.href}">${link.text}</a>
                                </li>
                            `).join('')}
                        </ul>
                        ${this.userRole === 'guest' 
                            ? '<a href="../pages/login.html" class="btn btn-brand ms-lg-3">Login/Sign-Up</a>'
                            : '<a href="../index.html" class="btn btn-brand ms-lg-3">Logout</a>'}
                    </div>
                </div>
            </nav>`;
    }
}

customElements.define('header-component', Header);