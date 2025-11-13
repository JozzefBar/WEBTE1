let map;
let markersLayer;
let allMarkers;
let allEvents;
let routingControl = null;
let routeVisible = false;
let favoritesFilterActive = false;
let selectedStartEvent = null;
let selectedEndEvent = null;

let currentMapFilters = {
    search: '',
    type: 'all',
    dateFrom: '',
    dateTo: ''
};

function initMap() {
    if (typeof L === 'undefined') {
        console.error('Leaflet knižnica sa nenačítala!');
        return;
    }

    map = L.map('mapContainer').setView([48.1486, 17.1077], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    markersLayer = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
    });

    map.addLayer(markersLayer);

    loadEventsOnMap();
    addRouteControl();
    addFavoritesControl();
}

function loadEventsOnMap() {
    allMarkers = [];

    allEvents.forEach(event => {
        const icon = createCustomIcon(event.type);
        const marker = L.marker([event.gps.lat, event.gps.lng], { icon: icon });
        marker.eventId = event.id;

        // Add click event for route selection
        marker.on('click', function() {
            handleMarkerClick(event);
        });

        const popupContent = `
            <div class="popup-content">
                <h5>${event.title}</h5>
                <p><i class="far fa-calendar-alt"></i> ${formatDate(event.date)} o ${event.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-tag"></i> ${event.type}</p>
                <button class="btn btn-sm btn-primary" onclick="showEventDetailFromMap(${event.id})">
                    <i class="fas fa-info-circle"></i> Detail
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);
        allMarkers.push({
            marker: marker,
            type: event.type,
            event: event
        });

        markersLayer.addLayer(marker);
    });
}

function createCustomIcon(type) {
    const iconConfig = {
        'koncert': 'fa-music',
        'vystava': 'fa-palette',
        'divadlo': 'fa-theater-masks',
        'festival': 'fa-star',
        'default': 'fa-map-marker-alt'
    };

    const iconClass = iconConfig[type] || iconConfig.default;
    const typeClass = type || 'default';

    return L.divIcon({
        html: `
            <div class="map-marker map-marker--${typeClass}">
                <i class="fas ${iconClass}"></i>
            </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
}

// Filter map markers based on criteria
function filterMapMarkers(type, searchText = '', dateFrom = '', dateTo = '') {
    markersLayer.clearLayers();

    allMarkers.forEach(item => {
        const typeMatches = (type === 'all' || item.type === type);

        let searchMatches = true;
        if (searchText) {
            const search = searchText.toLowerCase();
            searchMatches = (
                item.event.title.toLowerCase().includes(search) ||
                item.event.location.toLowerCase().includes(search) ||
                item.event.shortDescription.toLowerCase().includes(search)
            );
        }

        let dateMatches = true;
        if (dateFrom || dateTo) {
            const eventDate = new Date(item.event.date);

            if (dateFrom) {
                const fromDate = new Date(dateFrom);
                if (eventDate < fromDate) {
                    dateMatches = false;
                }
            }

            if (dateTo) {
                const toDate = new Date(dateTo);
                if (eventDate > toDate) {
                    dateMatches = false;
                }
            }
        }

        if (typeMatches && searchMatches && dateMatches) {
            markersLayer.addLayer(item.marker);
        }
    });
}

// Redirect to index.html with event parameter
window.showEventDetailFromMap = function(eventId) {
    window.location.href = `index.html?event=${eventId}`;
};

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('sk-SK', options);
}

function addRouteControl() {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'leaflet-control-route';

    const button = document.createElement('button');
    button.className = 'route-toggle-btn';
    button.innerHTML = '<i class="fas fa-route"></i><span class="btn-text"> Zobraziť trasu</span>';

    button.addEventListener('click', () => {
        toggleRoute();
        if (routeVisible) {
            button.innerHTML = '<i class="fas fa-route"></i><span class="btn-text"> Skryť trasu</span>';
            button.classList.add('active');
        } else {
            button.innerHTML = '<i class="fas fa-route"></i><span class="btn-text"> Zobraziť trasu</span>';
            button.classList.remove('active');
        }
    });

    controlDiv.appendChild(button);
    document.getElementById('mapContainer').appendChild(controlDiv);
}

function handleMarkerClick(event) {
    if (!selectedStartEvent) {
        selectedStartEvent = event;
        if (typeof showToast === 'function') {
            showToast(`ŠTART: ${event.title}`, 'success');
        }
    } else if (!selectedEndEvent) {
        if (selectedStartEvent.id === event.id) {
            if (typeof showToast === 'function') {
                showToast('Štart a cieľ nemôžu byť rovnaké!', 'info');
            }
            return;
        }
        selectedEndEvent = event;
        if (typeof showToast === 'function') {
            showToast(`CIEĽ: ${event.title}`, 'success');
        }
        createRoute();
    } else {
        // Reset and start over
        clearRoute();
        selectedStartEvent = event;
        if (typeof showToast === 'function') {
            showToast(`Nový ŠTART: ${event.title}`, 'info');
        }
    }
}

function createRoute() {
    if (!selectedStartEvent || !selectedEndEvent) {
        return;
    }

    if (routingControl) {
        map.removeControl(routingControl);
    }

    try {
        routingControl = L.Routing.control({
            waypoints: [
                L.latLng(selectedStartEvent.gps.lat, selectedStartEvent.gps.lng),
                L.latLng(selectedEndEvent.gps.lat, selectedEndEvent.gps.lng)
            ],
            routeWhileDragging: false,
            showAlternatives: false,
            addWaypoints: false,
            show: false,
            lineOptions: {
                styles: [{ color: '#2563eb', opacity: 0.8, weight: 5 }]
            },
            createMarker: function(i, waypoint, n) {
                return L.marker(waypoint.latLng, {
                    draggable: false,
                    icon: L.icon({
                        iconUrl: i === 0
                            ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
                            : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })
                });
            },
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            })
        }).addTo(map);

        setTimeout(() => {
            const routingContainer = document.querySelector('.leaflet-routing-container');
            if (routingContainer) {
                routingContainer.style.display = 'none';
            }
        }, 100);

        routeVisible = true;
        updateRouteButton();

        if (typeof showToast === 'function') {
            showToast('Trasa vytvorená!', 'success');
        }
    } catch (error) {
        console.log('Routing error (ignorované):', error);
        if (typeof showToast === 'function') {
            showToast('Nepodarilo sa vytvoriť trasu. Skúste to znova.', 'info');
        }
    }
}

function toggleRoute() {
    if (!routingControl) {
        if (typeof showToast === 'function') {
            showToast('Najprv vyberte 2 podujatia na mape!', 'info');
        }
        return;
    }

    if (routeVisible) {
        map.removeControl(routingControl);
        routeVisible = false;
    } else {
        createRoute();
        routeVisible = true;
    }
    updateRouteButton();
}

function clearRoute() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    selectedStartEvent = null;
    selectedEndEvent = null;
    routeVisible = false;
    updateRouteButton();
}

function updateRouteButton() {
    const button = document.querySelector('.route-toggle-btn');
    if (button) {
        if (routeVisible && routingControl) {
            button.innerHTML = '<i class="fas fa-route"></i><span class="btn-text"> Skryť trasu</span>';
            button.classList.add('active');
        } else {
            button.innerHTML = '<i class="fas fa-route"></i><span class="btn-text"> Zobraziť trasu</span>';
            button.classList.remove('active');
        }
    }
}

// Add favorites filter control
function addFavoritesControl() {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'leaflet-control-favorites';

    const button = document.createElement('button');
    button.className = 'favorites-toggle-btn';
    button.innerHTML = '<i class="fas fa-heart"></i><span class="btn-text"> Obľúbené</span>';

    button.addEventListener('click', () => {
        toggleFavoritesFilter();
        if (favoritesFilterActive) {
            button.innerHTML = '<i class="fas fa-heart"></i><span class="btn-text"> Všetky</span>';
            button.classList.add('active');
        } else {
            button.innerHTML = '<i class="fas fa-heart"></i><span class="btn-text"> Obľúbené</span>';
            button.classList.remove('active');
        }
    });

    controlDiv.appendChild(button);
    document.getElementById('mapContainer').appendChild(controlDiv);
}

function toggleFavoritesFilter() {
    favoritesFilterActive = !favoritesFilterActive;
    filterMarkersByFavorites();
}

// Filter markers to show only favorites
function filterMarkersByFavorites() {
    const favorites = getFavorites();

    if (favoritesFilterActive) {
        const favoriteMarkers = allMarkers.filter(item => favorites.includes(item.event.id));

        if (favoriteMarkers.length === 0) {
            if (typeof showToast === 'function') {
                showToast('Nemáte žiadne obľúbené podujatia', 'info');
            }
            favoritesFilterActive = false;
            const button = document.querySelector('.favorites-toggle-btn');
            if (button) {
                button.innerHTML = '<i class="fas fa-heart"></i> Obľúbené';
                button.classList.remove('active');
            }
            return;
        }

        allMarkers.forEach(item => {
            if (!favorites.includes(item.event.id)) {
                if (markersLayer.hasLayer(item.marker)) {
                    markersLayer.removeLayer(item.marker);
                }
            } else {
                if (!markersLayer.hasLayer(item.marker)) {
                    markersLayer.addLayer(item.marker);
                }
            }
        });
    } else {
        allMarkers.forEach(item => {
            if (!markersLayer.hasLayer(item.marker)) {
                markersLayer.addLayer(item.marker);
            }
        });
    }
}

function initializeMapFilters() {
    const urlParams = new URLSearchParams(window.location.search);

    const searchInput = document.getElementById('mapSearchInput');
    const typeFilter = document.getElementById('mapTypeFilter');
    const dateFromFilter = document.getElementById('mapDateFromFilter');
    const dateToFilter = document.getElementById('mapDateToFilter');
    const resetButton = document.getElementById('mapResetFilters');

    // Apply filters from URL parameters
    if (urlParams.has('search')) {
        currentMapFilters.search = urlParams.get('search');
        searchInput.value = currentMapFilters.search;
    }
    if (urlParams.has('type')) {
        currentMapFilters.type = urlParams.get('type');
        typeFilter.value = currentMapFilters.type;
    }
    if (urlParams.has('dateFrom')) {
        currentMapFilters.dateFrom = urlParams.get('dateFrom');
        dateFromFilter.value = currentMapFilters.dateFrom;
    }
    if (urlParams.has('dateTo')) {
        currentMapFilters.dateTo = urlParams.get('dateTo');
        dateToFilter.value = currentMapFilters.dateTo;
    }

    applyMapFilters();

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentMapFilters.search = e.target.value.toLowerCase();
            applyMapFilters();
        }, 300);
    });

    typeFilter.addEventListener('change', (e) => {
        currentMapFilters.type = e.target.value;
        applyMapFilters();
    });

    dateFromFilter.addEventListener('change', (e) => {
        currentMapFilters.dateFrom = e.target.value;
        applyMapFilters();
    });

    dateToFilter.addEventListener('change', (e) => {
        currentMapFilters.dateTo = e.target.value;
        applyMapFilters();
    });

    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        typeFilter.value = 'all';
        dateFromFilter.value = '';
        dateToFilter.value = '';
        currentMapFilters = { search: '', type: 'all', dateFrom: '', dateTo: '' };
        applyMapFilters();
    });
}

function applyMapFilters() {
    filterMapMarkers(currentMapFilters.type, currentMapFilters.search, currentMapFilters.dateFrom, currentMapFilters.dateTo);
}

document.addEventListener('DOMContentLoaded', async () => {
    const isStandalone = document.body.classList.contains('map-page');

    if (isStandalone && (!allEvents || allEvents.length === 0)) {
        try {
            const response = await fetch('data/events.json');
            if (!response.ok) throw new Error('Nepodarilo sa načítať podujatia');
            const data = await response.json();
            allEvents = data.events;
            initMap();
            initializeMapFilters();
        } catch (error) {
            console.error('Chyba pri načítavaní podujatí:', error);
        }
    } else {
        const checkEvents = setInterval(() => {
            if (allEvents && allEvents.length > 0) {
                clearInterval(checkEvents);
                initMap();
                initializeMapFilters();
            }
        }, 100);
    }
});