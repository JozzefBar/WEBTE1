class EventCard extends HTMLElement {
    constructor(){
        super();
    }

    static get observedAttributes(){
        return ["title", "date", "time", "location", "description", "image", "event-id"];
    }

    connectedCallback(){
        this.render();
        this.addEventListener('click', () => {
            const eventId = this.getAttribute('event-id');
            window.showEventDetail(eventId);
        });
    }

    render(){
        const title = this.getAttribute('title') || '';
        const date = this.getAttribute('date') || '';
        const time = this.getAttribute('time') || '';
        const location = this.getAttribute('location') || '';
        const description = this.getAttribute('description') || '';
        const image = this.getAttribute('image') || '';
        const eventId = this.getAttribute('event-id') || '';

        const badge = this.getEventBadge(date);
        const isFavorite = this.isFavorite(eventId);

        this.className = 'event-card';
        this.innerHTML = `
            <img src="${image}" alt="${title}" class="event-card-image">
            <div class="event-card-content">
                ${badge ? `<span class="event-card-badge event-card-badge--${badge.class}">${badge.text}</span>` : ''}
                
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-event-id="${eventId}" onclick="event.stopPropagation(); toggleFavorite(${eventId})">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
                
                <h3 class="event-card-title">${title}</h3>
                <div class="event-card-date">
                    <i class="far fa-calendar-alt"></i>
                    ${this.formatDate(date)} o ${time}
                </div>
                <div class="event-card-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${location}
                </div>
                <p class="event-card-description">${description}</p>
            </div>
        `;
    }

    isFavorite(eventId) {
        const favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
        return favorites.includes(parseInt(eventId));
    }

    getEventBadge(dateString){
        const eventDate = new Date(dateString);
        const today = new Date();
        today.setHours(0,0,0,0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const eventDay = new Date(eventDate);
        eventDay.setHours(0,0,0,0);

        if (eventDay.getTime() === today.getTime())
            return { text: '🔥 DNES', class: 'today' };
        else if (eventDay.getTime() === tomorrow.getTime())
            return { text: '⭐ ZAJTRA', class: 'tomorrow' };
        else if (eventDay > today)
            return { text: '📅 ČOSKORO', class: 'upcoming' };
        else if (eventDay < today)
            return { text: '✓ UKONČENÉ', class: 'past' };

        return null;
    }

    formatDate(dateString){
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('sk-SK', options);
    }
}

customElements.define('event-card', EventCard);