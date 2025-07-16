// Theme Management
class ThemeManager {
    constructor() {
        this.themeBtn = document.getElementById('theme-btn');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        const icon = this.themeBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.init();
    }

    init() {
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavClick(e));
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        
        // Remove active class from all items
        this.navItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to clicked item
        e.currentTarget.classList.add('active');
        
        // Smooth scroll to section
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            this.scrollToSection(targetId);
        }
    }

    scrollToSection(sectionId) {
        let targetElement;
        
        switch(sectionId) {
            case 'home':
                targetElement = document.querySelector('.header');
                break;
            case 'skills':
                targetElement = document.querySelector('.skills-section');
                break;
            case 'services':
                targetElement = document.querySelector('.services-section');
                break;
            case 'contact':
                targetElement = document.querySelector('.social-links');
                break;
            default:
                targetElement = document.querySelector('.header');
        }
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Data Manager
class DataManager {
    constructor() {
        this.baseURL = window.location.origin;
    }

    async fetchData(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}/api/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return null;
        }
    }

async loadUserInfo() {
    const info = await this.fetchData('info');
    if (info) {
        document.getElementById('profile-name').textContent = info.name;
        document.getElementById('profile-title').textContent = info.title;
        document.getElementById('profile-bio').textContent = info.bio;
        
        if (info.images && Array.isArray(info.images) && info.images.length > 0) {
            const randomIndex = Math.floor(Math.random() * info.images.length);
            const randomImage = info.images[randomIndex];
            document.getElementById('profile-img').src = randomImage;
        } else {
document.getElementById('profile-img').src = 'profile.jpg';
        }
    }
}

    async loadLanguages() {
        const languages = await this.fetchData('languages');
        if (languages) {
            const container = document.getElementById('languages-container');
            container.innerHTML = '';
            
            languages.forEach(lang => {
                const langElement = this.createLanguageElement(lang);
                container.appendChild(langElement);
            });
            
            // Animate progress bars
            setTimeout(() => {
                this.animateProgressBars();
            }, 100);
        }
    }

    createLanguageElement(language) {
        const div = document.createElement('div');
        div.className = 'language-item';
        div.innerHTML = `
            <div class="language-header">
                <span class="language-name">${language.name}</span>
                <span class="language-percentage">${language.percentage}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" data-percentage="${language.percentage}"></div>
            </div>
        `;
        return div;
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            setTimeout(() => {
                bar.style.width = `${percentage}%`;
            }, Math.random() * 500);
        });
    }

    async loadServices() {
        const services = await this.fetchData('services');
        if (services) {
            const container = document.getElementById('services-container');
            container.innerHTML = '';
            
            services.forEach(service => {
                const serviceElement = this.createServiceElement(service);
                container.appendChild(serviceElement);
            });
        }
    }

    createServiceElement(service) {
        const div = document.createElement('div');
        div.className = 'service-item';
        div.innerHTML = `
            <h3 class="service-name">${service.name}</h3>
            <p class="service-description">${service.description}</p>
            <button class="service-btn" onclick="handleServiceClick('${service.name}')">${service.button_label}</button>
        `;
        return div;
    }
}

// Service button click handler
function handleServiceClick(serviceName) {
    const encodedMessage = encodeURIComponent(`Hello, I'm interested in \`${serviceName}\` and I want you to make me a project`);
    const whatsappURL = `https://wa.me/966547540321?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all glass cards
        document.querySelectorAll('.glass-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const dataManager = new DataManager();
    const scrollAnimations = new ScrollAnimations();
    
    // Load data
    dataManager.loadUserInfo();
    dataManager.loadLanguages();
    dataManager.loadServices();
});



