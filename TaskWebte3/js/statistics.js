let statsChart = null;

function initializeStatistics() {
    updateStatistics();
    initializeDatePickers();
}

function updateStatistics() {
    const stats = calculateStatistics(allEvents);
    displayStatisticsCards(stats);
    createChart(stats);
}

function calculateStatistics(events) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const stats = {
        total: events.length,
        upcoming: 0,
        today: 0,
        byType: {}
    };

    events.forEach(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);

        if (eventDate >= now){
            stats.upcoming++;
        }
        if (eventDate.getTime() === now.getTime()){
            stats.today++;
        }
        if (!stats.byType[event.type]) {
            stats.byType[event.type] = 0;
        }
        stats.byType[event.type]++;
    });

    return stats;
}

function displayStatisticsCards(stats) {
    const statsCards = document.getElementById('statsCards');
    const favorites = getFavorites();

    statsCards.innerHTML = `
        <div class="stats-card stats-card--primary" data-aos="fade-up">
            <div class="stats-card-icon">
                <i class="fas fa-calendar-check"></i>
            </div>
            <div class="stats-card-content">
                <h3 class="stats-card-number">${stats.total}</h3>
                <p class="stats-card-label">Celkom podujatí</p>
            </div>
        </div>

        <div class="stats-card stats-card--success" data-aos="fade-up" data-aos-delay="100">
            <div class="stats-card-icon">
                <i class="fas fa-clock"></i>
            </div>
            <div class="stats-card-content">
                <h3 class="stats-card-number">${stats.upcoming}</h3>
                <p class="stats-card-label">Nadchádzajúce</p>
            </div>
        </div>

        <div class="stats-card stats-card--warning" data-aos="fade-up" data-aos-delay="200">
            <div class="stats-card-icon">
                <i class="fas fa-star"></i>
            </div>
            <div class="stats-card-content">
                <h3 class="stats-card-number">${stats.today}</h3>
                <p class="stats-card-label">Dnes</p>
            </div>
        </div>

        <div class="stats-card stats-card--danger" data-aos="fade-up" data-aos-delay="300">
            <div class="stats-card-icon">
                <i class="fas fa-heart"></i>
            </div>
            <div class="stats-card-content">
                <h3 class="stats-card-number">${favorites.length}</h3>
                <p class="stats-card-label">Obľúbené</p>
            </div>
        </div>
    `;
}

function createChart(stats) {
    const ctx = document.getElementById('statsChart');

    if (!ctx) return;

    if (statsChart) {
        statsChart.destroy();
    }

    const typeLabels = {
        'koncert': 'Koncerty',
        'vystava': 'Výstavy',
        'divadlo': 'Divadlá',
        'festival': 'Festivaly'
    };

    const labels = Object.keys(stats.byType).map(type => typeLabels[type] || type);
    const data = Object.values(stats.byType);

    const colors = {
        'koncert': '#667eea',
        'vystava': '#4ecdc4',
        'divadlo': '#ff6b6b',
        'festival': '#ffa502'
    }

    const backgroundColors = Object.keys(stats.byType).map(type => colors[type] || '#667eea');

    statsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 3,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                title:{
                    display: true,
                    text: 'Rozdelenie podujatí podle typu',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: 20
                }
            }
        }
    });
}

function initializeDatePickers() {
    const today = new Date().toISOString().split('T')[0];

    const startDateInput = document.getElementById('exportStartDate');
    const endDateInput = document.getElementById('exportEndDate');
    const favStartDateInput = document.getElementById('exportFavStartDate');
    const favEndDateInput = document.getElementById('exportFavEndDate');

    if (startDateInput) startDateInput.value = today;
    if (endDateInput) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        endDateInput.value = nextMonth.toISOString().split('T')[0];
    }

    if (favStartDateInput) favStartDateInput.value = today;
    if (favEndDateInput) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        favEndDateInput.value = nextMonth.toISOString().split('T')[0];
    }
}

function exportCurrentEvents(format = 'csv') {
    const startDate = document.getElementById('exportStartDate');
    const endDate = document.getElementById('exportEndDate');

    if (!startDate || !endDate || !startDate.value || !endDate.value){
        showToast('Prosím, vyberte dátumové rozpätie', 'info');
        return;
    }

    const filteredEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        return eventDate >= start && eventDate <= end;
    });

    if (filteredEvents.length === 0) {
        showToast('V zadanom období nie sú žiadne podujatia', 'info');
        return;
    }

    const filename = `podujatia_${startDate.value}_${endDate.value}`;
    if (format === 'json') {
        exportToJSON(filteredEvents, `${filename}.json`);
    } else {
        exportToCSV(filteredEvents, `${filename}.csv`);
    }
}

function exportFavoriteEvents(format = 'csv') {
    const startDate = document.getElementById('exportFavStartDate').value;
    const endDate = document.getElementById('exportFavEndDate').value;

    if (!startDate || !endDate) {
        showToast('Prosím, vyberte dátumové rozpätie', 'info');
        return;
    }

    const favorites = getFavorites();
    const favoriteEvents = allEvents.filter(event => favorites.includes(event.id));

    const filteredEvents = favoriteEvents.filter(event => {
        const eventDate = new Date(event.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return eventDate >= start && eventDate <= end;
    });

    if (filteredEvents.length === 0) {
        showToast('V zadanom období nie sú žiadne obľúbené podujatia', 'info');
        return;
    }

    const filename = `oblubene_podujatia_${startDate}_${endDate}`;
    if (format === 'json') {
        exportToJSON(filteredEvents, `${filename}.json`);
    } else {
        exportToCSV(filteredEvents, `${filename}.csv`);
    }
}

function exportToCSV(events, filename) {
    const headers = ['Názov', 'Typ', 'Dátum', 'Čas', 'Miesto', 'Popis'];
    
    const rows = events.map(event => [
        `"${event.title}"`,
        `"${event.type}"`,
        event.date,
        event.time,
        `"${event.location}"`,
        `"${event.shortDescription}"`
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Export úspešný! Stiahnutých ${events.length} podujatí`, 'success');
}

function exportToJSON(events, filename) {
    const jsonContent = JSON.stringify(events, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Export úspešný! Stiahnutých ${events.length} podujatí`, 'success');
}

document.addEventListener('DOMContentLoaded', () => {
    const checkEvents = setInterval(() => {
        if (typeof allEvents !== 'undefined' && allEvents.length > 0) {
            clearInterval(checkEvents);
            initializeStatistics();
        }
    }, 100);
});