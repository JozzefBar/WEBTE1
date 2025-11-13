function toggleFavorite(eventId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(eventId);

    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Podujatie odstránené z obľúbených', 'info');
    } else {
        favorites.push(eventId);
        showToast('Podujatie pridané do obľúbených', 'success');
    }

    localStorage.setItem('favoriteEvents', JSON.stringify(favorites));
    updateAllFavoriteButtons();
    displayFavorites();

    if (typeof updateStatistics === 'function') {
        updateStatistics();
    }

    if (typeof filterMarkersByFavorites === 'function' && typeof favoritesFilterActive !== 'undefined' && favoritesFilterActive) {
        filterMarkersByFavorites();
    }
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
}

function showToast(message, type = 'success') {
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateAllFavoriteButtons() {
    const favorites = getFavorites();
    const buttons = document.querySelectorAll('.favorite-btn');
    
    buttons.forEach(button => {
        const eventId = parseInt(button.getAttribute('data-event-id'));
        const icon = button.querySelector('i');

        if (favorites.includes(eventId)) {
            button.classList.add('active');
            icon.className = 'fas fa-heart';
        } else {
            button.classList.remove('active');
            icon.className = 'far fa-heart';
        }
    });
}

function displayFavorites() {
    const favoritesSection = document.getElementById('favoritesSection');
    const favoritesContainer = document.getElementById('favoritesContainer');

    if (!favoritesSection || !favoritesContainer) {
        return;
    }

    const favorites = getFavorites();

    if (favorites.length === 0) {
        favoritesSection.style.display = 'none';
        return;
    }

    favoritesSection.style.display = 'block';
    favoritesContainer.innerHTML = '';
    const favoriteEvents = allEvents.filter(event => favorites.includes(event.id));

    favoriteEvents.forEach(event => {
        const eventCard = document.createElement('event-card');

        eventCard.setAttribute('title', event.title);
        eventCard.setAttribute('date', event.date);
        eventCard.setAttribute('time', event.time);
        eventCard.setAttribute('location', event.location);
        eventCard.setAttribute('description', event.shortDescription);
        eventCard.setAttribute('image', event.image);
        eventCard.setAttribute('event-id', event.id);

        favoritesContainer.appendChild(eventCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const checkEvents = setInterval(() => {
        if (allEvents && allEvents.length > 0) {
            clearInterval(checkEvents);
            displayFavorites();
        }
    }, 100);
});