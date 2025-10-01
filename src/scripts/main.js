import '../styles/main.css';
import Collapsible from '../components/Collapsible';

document.addEventListener('DOMContentLoaded', function() {
    const widgetContainer = document.querySelector('.widget-container');
    
    if (widgetContainer) {
        const collapsible = new Collapsible(widgetContainer, {
            multiple: false,
            animationDuration: 300
        });

        collapsible.on('sectionOpened', (event) => {
            console.log('Section opened:', event.detail.section.dataset.section);
        });

        collapsible.on('sectionClosed', (event) => {
            console.log('Section closed:', event.detail.section.dataset.section);
        });

        window.collapsibleWidget = collapsible;
    } else {
        console.error('Widget container not found');
    }
});