let allEvents = [];

function displayCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('sk-SK', options);
    dateElement.textContent = formattedDate;
}

// Load events with caching
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
            console.log('Nové dáta - aktualizujem cache');
            localStorage.setItem('eventsCache', newDataString);
            localStorage.setItem('eventsCacheTimestamp', new Date().toISOString());
            allEvents = data.events;
        }

        displayEvents(allEvents);
    
    } catch (error) {
        console.error('Chyba pri načítavaní podujatí:', error);
         const container = document.getElementById('eventsContainer');
        container.innerHTML = `
            <div class="error-message">
                <div class="error-message-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="error-message-title">Ups! Niečo sa pokazilo</h3>
                <p class="error-message-text">
                    Nepodarilo sa načítať podujatia. Skúste obnoviť stránku.
                </p>
            </div>
        `;
    }
}

// Display events
function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search-minus"></i>
                </div>
                <h3 class="no-results-title">Nenašli sa žiadne podujatia</h3>
                <p class="no-results-text">
                    Skúste zmeniť filter alebo vyhľadávacie kritériá
                </p>
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

// Show event detail in modal
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

    const modalElement = document.getElementById('eventModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('sk-SK', options);
}

// Filters
let currentFilters = {
    search: '',
    type: 'all',
    dateFrom: '',
    dateTo: ''
};

function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const dateFromFilter = document.getElementById('dateFromFilter');
    const dateToFilter = document.getElementById('dateToFilter');
    const resetButton = document.getElementById('resetFilters');

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = e.target.value.toLowerCase();
            applyFilters();
        }, 300);
    });

    typeFilter.addEventListener('change', (e) => {
        currentFilters.type = e.target.value;
        applyFilters();
    });

    dateFromFilter.addEventListener('change', (e) => {
        currentFilters.dateFrom = e.target.value;
        applyFilters();
    });

    dateToFilter.addEventListener('change', (e) => {
        currentFilters.dateTo = e.target.value;
        applyFilters();
    });

    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        typeFilter.value = 'all';
        dateFromFilter.value = '';
        dateToFilter.value = '';
        currentFilters = { search: '', type: 'all', dateFrom: '', dateTo: '' };
        applyFilters();
    });
}

function applyFilters() {
    let filteredEvents = [...allEvents];

    if (currentFilters.search) {
        filteredEvents = filteredEvents.filter(event => {
            const searchTerm = currentFilters.search;
            return (
                event.title.toLowerCase().includes(searchTerm) ||
                event.location.toLowerCase().includes(searchTerm) ||
                event.shortDescription.toLowerCase().includes(searchTerm)
            );
        });
    }

    if (currentFilters.type !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.type === currentFilters.type);
    }

    if (currentFilters.dateFrom) {
        const fromDate = new Date(currentFilters.dateFrom);
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= fromDate;
        });
    }

    if (currentFilters.dateTo) {
        const toDate = new Date(currentFilters.dateTo);
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate <= toDate;
        });
    }

    updateResultsCount(filteredEvents.length, allEvents.length);
    displayEvents(filteredEvents);

    if (typeof filterMapMarkers === 'function') {
        filterMapMarkers(currentFilters.type, currentFilters.search, currentFilters.dateFrom, currentFilters.dateTo);
    }
}

function updateResultsCount(filteredCount, totalCount) {
    const resultsCountElement = document.getElementById('resultsCount');

    if(currentFilters.search || currentFilters.type !== 'all' || currentFilters.dateFrom || currentFilters.dateTo) {
        resultsCountElement.classList.remove("filters-results--hidden");
        resultsCountElement.innerHTML = `
            <i class="fas fa-info-circle"></i>
            Nájdených ${filteredCount} z ${totalCount} podujatí
        `;
    } else {
        resultsCountElement.classList.add("filters-results--hidden");
    }
}

function initializeModalFocusManagement() {
    const modalElement = document.getElementById('eventModal');
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', function () {
            setTimeout(() => {
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());

                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';

                if (document.activeElement && document.activeElement !== document.body) {
                    document.activeElement.blur();
                }
            }, 50);
        });
    }
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function checkForEventParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');

    if (eventId) {
        // Wait for events to be loaded
        const checkEvents = setInterval(() => {
            if (allEvents && allEvents.length > 0) {
                clearInterval(checkEvents);

                // Scroll to events section
                const eventsSection = document.getElementById('events');
                if (eventsSection) {
                    const headerOffset = 80;
                    const elementPosition = eventsSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }

                // Open the modal for this event after a short delay
                setTimeout(() => {
                    const eventIdNum = parseInt(eventId);
                    showEventDetail(eventIdNum);
                }, 500);

                // Remove the parameter from URL without reload
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    initializeFilters();
    loadEvents();
    initializeContactForm();
    initializeSmoothScroll();
    initializeModalFocusManagement();
    checkForEventParameter();
});