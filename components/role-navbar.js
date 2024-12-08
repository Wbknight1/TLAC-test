class RoleNavbar extends HTMLElement {
    constructor() {
        super();
        this.userRole = this.getAttribute('user-role') || 'guest';
    }

    getRoleLinks() {
        const roleLinks = {
            admin: [
            { href: '/TLAC-test/pages/admin.html', text: 'Dashboard', icon: 'ri-dashboard-line' },
            { href: '/TLAC-test/pages/admincalendar.html', text: 'Session Calendar', icon: 'ri-calendar-line' },
            { href: '/TLAC-test/pages/adminreview.html', text: 'Review Directory', icon: 'ri-star-line' },
            { href: '/TLAC-test/pages/adminutils.html', text: 'Miscellanious', icon: 'ri-user-line' }
            ],
            trainer: [
            { href: '/TLAC-test/pages/trainer.html', text: 'Home', icon: 'ri-dashboard-line' },
            { href: '/TLAC-test/pages/trainercalendar.html', text: 'Schedule', icon: 'ri-calendar-line' },
            { href: '/TLAC-test/pages/trainerclients.html', text: 'Review Clients', icon: 'ri-team-line' },
            { href: '/TLAC-test/pages/trainerworkoutlog.html', text: 'Training Session Log', icon: 'ri-book-open-line' },
            { href: '/TLAC-test/pages/trainerprofile.html', text: 'Update Profile', icon: 'ri-user-line' }
            ],
            trainee: [
            { href: '/TLAC-test/pages/trainee.html', text: 'Home', icon: 'ri-dashboard-line' },
            { href: '/TLAC-test/pages/traineecalendar.html', text: 'My Schedule', icon: 'ri-calendar-line' },
            { href: '/TLAC-test/pages/traineecatelog.html', text: 'Catalog', icon: 'ri-store-line' },
            { href: '/TLAC-test/pages/traineeworkoutlog.html', text: 'Training Session Log', icon: 'ri-book-open-line' },
            { href: '/TLAC-test/pages/traineeprofile.html', text: 'Update Profile', icon: 'ri-user-line' }
            ]
        };

        return roleLinks[this.userRole] || [];
    }

    connectedCallback() {
        const links = this.getRoleLinks();
        const currentPage = window.location.pathname;

        if (links.length > 0) {
            this.innerHTML = `
                <nav class="navbar navbar-expand role-nav bg-light py-2 sticky-top border-bottom">
                    <div class="container-fluid px-4">
                        <div class="navbar-nav flex-row flex-nowrap overflow-auto">
                            ${links.map(link => `
                                <a class="nav-link px-3 ${currentPage === link.href ? 'active' : ''}" 
                                   href="${link.href}">
                                    <i class="${link.icon}"></i> ${link.text}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </nav>
            `;
        }
    }
}

customElements.define('role-navbar', RoleNavbar);