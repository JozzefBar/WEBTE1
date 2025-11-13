let map;
let markersLayer;
let allMarkers;
let routeLine = null;
let routeVisible = false;
let favoritesFilterActive = false;

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

window.showEventDetailFromMap = function(eventId) {
    window.showEventDetail(eventId);
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
    button.innerHTML = '<i class="fas fa-route"></i> Zobraziť trasu';

    button.addEventListener('click', () => {
        toggleRoute();
        if (routeVisible) {
            button.innerHTML = '<i class="fas fa-route"></i> Skryť trasu';
            button.classList.add('active');
        } else {
            button.innerHTML = '<i class="fas fa-route"></i> Zobraziť trasu';
            button.classList.remove('active');
        }
    });

    controlDiv.appendChild(button);
    document.getElementById('mapContainer').appendChild(controlDiv);
}

function toggleRoute() {
    if (routeVisible) {
        if (routeLine) {
            map.removeLayer(routeLine);
            routeLine = null;
        }
        routeVisible = false;
    } else {
        drawRoute();
        routeVisible = true;
    }
}

function drawRoute() {
    const sortedEvents = [...allEvents].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    const coordinates = sortedEvents.map(event => [event.gps.lat, event.gps.lng]);

    if (coordinates.length < 2) {
        if (typeof showToast === 'function') {
            showToast('Nedostatok podujatí pre vytvorenie trasy', 'info');
        }
        return;
    }

    routeLine = L.polyline(coordinates, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1,
        dashArray: '10, 10'
    }).addTo(map);
}

function addFavoritesControl() {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'leaflet-control-favorites';

    const button = document.createElement('button');
    button.className = 'favorites-toggle-btn';
    button.innerHTML = '<i class="fas fa-heart"></i> Obľúbené';

    button.addEventListener('click', () => {
        toggleFavoritesFilter();
        if (favoritesFilterActive) {
            button.innerHTML = '<i class="fas fa-heart"></i> Všetky';
            button.classList.add('active');
        } else {
            button.innerHTML = '<i class="fas fa-heart"></i> Obľúbené';
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

        // Remove non-favorite markers, add favorite markers
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
        // Show all markers
        allMarkers.forEach(item => {
            if (!markersLayer.hasLayer(item.marker)) {
                markersLayer.addLayer(item.marker);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const checkEvents = setInterval(() => {
        if (allEvents && allEvents.length > 0) {
            clearInterval(checkEvents);
            initMap();
        }
    }, 100);
});