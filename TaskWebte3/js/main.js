let allEvents = [];

function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('sk-SK', options);
    dateElement.textContent = formattedDate;
}

async function loadEvents() {
    try {
        const cachedData = localStorage.getItem('eventsCache');
        const cacheTimestamp = localStorage.getItem('eventsCacheTimestamp');

        const response = await fetch('data/events.json');
        if (!response.ok) throw new Error('Nepodarilo sa načítať podujatia');

        const data = await response.json();
        const newDataString = JSON.stringify(data);

        if (cachedData && cachedData === newDataString) {
            console.log('Dáta načítané z cache (bez zmien)');
            const lastUpdate = new Date(cacheTimestamp);
            console.log('Cache posledný krát aktualizovaná:', lastUpdate.toLocaleString('sk-SK'));
            allEvents = JSON.parse(cachedData).events;
        }
        else {
            console.log('🆕 Nové dáta - aktualizujem cache');
            localStorage.setItem('eventsCache', newDataString);
            localStorage.setItem('eventsCacheTimestamp', new Date().toISOString());
            allEvents = data.events;
        }

        displayEvents(allEvents);
    } catch (error) {
        console.error('Chyba pri načítavaní podujatí:', error);
        document.getElementById('eventsContainer').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i>
                Nepodarilo sa načítať podujatia. Skúste to neskôr.
            </div>
        `;
    }
}

function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                Momentálne nie sú k dispozícii žiadne podujatia.
            </div>
        `;
        return;
    }

    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    sortedEvents.forEach(event => {
        const eventCard = document.createElement('event-card');

        eventCard.setAttribute('title', event.title);
        eventCard.setAttribute('date', event.date);
        eventCard.setAttribute('time', event.time);
        eventCard.setAttribute('location', event.location);
        eventCard.setAttribute('description', event.shortDescription);
        eventCard.setAttribute('image', event.image);
        eventCard.setAttribute('event-id', event.id);

        container.appendChild(eventCard);
    });
}

window.showEventDetail = function (eventId) {
    const event = allEvents.find(e => e.id === parseInt(eventId));

    if (!event) {
        console.error('Podujatie nenájdené');
        return;
    }

    document.getElementById('modalTitle').textContent = event.title;
    document.getElementById('modalBody').innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="img-fluid mb-3 rounded">
        
        <div class="mb-3">
            <h6><i class="far fa-calendar-alt"></i> Dátum a čas</h6>
            <p>${formatDate(event.date)} o ${event.time}</p>
        </div>
        
        <div class="mb-3">
            <h6><i class="fas fa-map-marker-alt"></i> Miesto</h6>
            <p>${event.location}</p>
        </div>
        
        <div class="mb-3">
            <h6><i class="fas fa-info-circle"></i> Popis</h6>
            <p>${event.longDescription}</p>
        </div>
        
        ${event.organizerUrl ? `
            <a href="${event.organizerUrl}" target="_blank" class="btn btn-primary">
                <i class="fas fa-external-link-alt"></i> Oficiálna stránka organizátora
            </a>
        ` : ''}
    `;

    // Otvoríme modal
    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    modal.show();
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('sk-SK', options);
}

document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    loadEvents();
});