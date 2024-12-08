class RoleNavbar extends HTMLElement {
    constructor() {
        super();
        this.userRole = this.getAttribute('user-role') || 'guest';
    }

    getRoleLinks() {
        const roleLinks = {
            admin: [
                { href: '../pages/admin.html', text: 'Dashboard', icon: 'ri-dashboard-line' },
                { href: '../pages/admincalendar.html', text: 'Session Calendar', icon: 'ri-calendar-line' },
                { href: '../pages/adminreview.html', text: 'Review Directory', icon: 'ri-star-line' },
                { href: '../pages/adminutils.html', text: 'Miscellanious', icon: 'ri-user-line' }
            ],
            trainer: [
                { href: '../pages/trainer.html', text: 'Home', icon: 'ri-dashboard-line' },
                { href: '../pages/trainercalendar.html', text: 'Schedule', icon: 'ri-calendar-line' },
                { href: '../pages/trainerclients.html', text: 'Review Clients', icon: 'ri-team-line' },
                { href: '../pages/trainerworkoutlog.html', text: 'Training Session Log', icon: 'ri-book-open-line' },
                { href: '../pages/trainerprofile.html', text: 'Update Profile', icon: 'ri-user-line' }
            ],
            trainee: [
                { href: '../pages/trainee.html', text: 'Home', icon: 'ri-dashboard-line' },
                { href: '../pages/traineecalendar.html', text: 'My Schedule', icon: 'ri-calendar-line' },
                { href: '../pages/traineecatelog.html', text: 'Catalog', icon: 'ri-store-line' },
                { href: '../pages/traineeworkoutlog.html', text: 'Training Session Log', icon: 'ri-book-open-line' },
                { href: '../pages/traineeprofile.html', text: 'Update Profile', icon: 'ri-user-line' }
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
                                <a class="nav-link px-3 ${currentPage.includes(link.href) ? 'nav-active' : ''}" 
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