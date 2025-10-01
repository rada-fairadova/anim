class Collapsible {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        this.options = {
            multiple: options.multiple || false,
            animationDuration: options.animationDuration || 300,
            ...options
        };

        this.sections = [];
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Collapsible container not found');
            return;
        }

        this.sections = Array.from(this.container.querySelectorAll('.collapsible-section'));
        
        this.sections.forEach(section => {
            const header = section.querySelector('.collapsible-header');
            const content = section.querySelector('.collapsible-content');

            if (!header || !content) {
                console.warn('Invalid collapsible section structure', section);
                return;
            }

            content.style.transition = `max-height ${this.options.animationDuration}ms ease-out`;

            header.addEventListener('click', () => this.toggleSection(section));
        });

        this.setupGlobalControls();
    }

    toggleSection(section) {
        const isActive = section.classList.contains('active');
        
        if (!this.options.multiple && !isActive) {
            this.closeAllSections();
        }

        if (isActive) {
            this.closeSection(section);
        } else {
            this.openSection(section);
        }
    }

    openSection(section) {
        const header = section.querySelector('.collapsible-header');
        const content = section.querySelector('.collapsible-content');

        section.classList.add('active');
        header.classList.add('active');

        content.style.maxHeight = content.scrollHeight + 'px';
        content.classList.add('show');

        this.dispatchEvent('sectionOpened', { section });
    }

    closeSection(section) {
        const header = section.querySelector('.collapsible-header');
        const content = section.querySelector('.collapsible-content');

        section.classList.remove('active');
        header.classList.remove('active');
        content.style.maxHeight = '0px';
        content.classList.remove('show');

        this.dispatchEvent('sectionClosed', { section });
    }

    openAllSections() {
        this.sections.forEach(section => this.openSection(section));
    }

    closeAllSections() {
        this.sections.forEach(section => this.closeSection(section));
    }

    setupGlobalControls() {
        const expandAllBtn = document.getElementById('expand-all');
        const collapseAllBtn = document.getElementById('collapse-all');

        if (expandAllBtn) {
            expandAllBtn.addEventListener('click', () => this.openAllSections());
        }

        if (collapseAllBtn) {
            collapseAllBtn.addEventListener('click', () => this.closeAllSections());
        }
    }

    getActiveSections() {
        return this.sections.filter(section => section.classList.contains('active'));
    }

    openSectionById(sectionId) {
        const section = this.sections.find(s => s.dataset.section === sectionId);
        if (section) {
            this.openSection(section);
        }
    }

    closeSectionById(sectionId) {
        const section = this.sections.find(s => s.dataset.section === sectionId);
        if (section) {
            this.closeSection(section);
        }
    }

    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`collapsible:${eventName}`, {
            detail,
            bubbles: true
        });
        this.container.dispatchEvent(event);
    }

    on(eventName, callback) {
        this.container.addEventListener(`collapsible:${eventName}`, callback);
    }

    destroy() {
        this.sections.forEach(section => {
            const header = section.querySelector('.collapsible-header');
            header.removeEventListener('click', this.toggleSection);
        });
        this.sections = [];
    }
}

export default Collapsible;