// Funcionalidades para el dashboard del técnico
document.addEventListener('DOMContentLoaded', function () {
    console.log('Dashboard del técnico cargado');

    initDashboard();
    initAnimations();
    initRealTimeUpdates();
});

// Inicialización del dashboard
function initDashboard() {
    // Actualizar métricas en tiempo real si es necesario
    updateMetrics();

    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Configurar eventos para las tarjetas de métricas
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', function () {
            const metricType = this.querySelector('.metric-label').textContent.toLowerCase();
            filterTableByMetric(metricType);
        });
    });
}

// Animaciones para elementos del dashboard
function initAnimations() {
    // Animación de entrada para las tarjetas de métricas
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // Animación para las filas de la tabla
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            row.style.transition = 'all 0.4s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 200 + (50 * index));
    });
}

// Filtrar tabla por tipo de métrica
function filterTableByMetric(metricType) {
    const tableRows = document.querySelectorAll('.table-row');
    let count = 0;

    tableRows.forEach(row => {
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge) {
            const status = statusBadge.textContent.trim().toLowerCase();
            let shouldShow = false;

            switch (metricType) {
                case 'pendientes':
                    shouldShow = status.includes('pendiente');
                    break;
                case 'en curso':
                    shouldShow = status.includes('curso') || status.includes('proceso');
                    break;
                case 'completados':
                    shouldShow = status.includes('completado') || status.includes('finalizado');
                    break;
                default:
                    shouldShow = true;
            }

            if (shouldShow) {
                row.style.display = '';
                count++;
            } else {
                row.style.display = 'none';
            }
        }
    });

    // Mostrar notificación del filtro aplicado
    showNotification(`Mostrando ${count} mantenimientos ${metricType}`, 'info');

    // Scroll a la tabla
    document.querySelector('.card-main').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Actualizar métricas (simulación)
function updateMetrics() {
    // En una aplicación real, aquí harías una petición al servidor
    // para obtener las métricas actualizadas
    console.log('Actualizando métricas del dashboard...');

    // Simular actualización cada 30 segundos
    setInterval(() => {
        // Esto sería reemplazado por una llamada real al servidor
        console.log('Verificando actualizaciones de métricas...');
    }, 30000);
}

// Actualizaciones en tiempo real
function initRealTimeUpdates() {
    // Simular actualizaciones en tiempo real para el dashboard
    // En una aplicación real, esto se conectaría a WebSockets o similar

    setInterval(() => {
        // Simular cambio de estado aleatorio en mantenimientos
        const statusBadges = document.querySelectorAll('.status-badge');
        if (statusBadges.length > 0) {
            const randomIndex = Math.floor(Math.random() * statusBadges.length);
            const badge = statusBadges[randomIndex];

            // Solo cambiar si está pendiente (para demo)
            if (badge.classList.contains('status-pending')) {
                badge.classList.remove('status-pending');
                badge.classList.add('status-progress');
                badge.textContent = 'EN CURSO';

                showNotification(`Mantenimiento actualizado a EN CURSO`, 'info');
            }
        }
    }, 45000); // Cada 45 segundos para la demo
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${getAlertType(type)} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 80px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        box-shadow: 0 10px 30px -15px rgba(2, 12, 27, 0.7);
        border: 1px solid rgba(100, 255, 218, 0.2);
        backdrop-filter: blur(10px);
    `;

    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getAlertType(type) {
    const types = {
        'success': 'success',
        'error': 'danger',
        'warning': 'warning',
        'info': 'info'
    };
    return types[type] || 'info';
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'bi-check-circle-fill',
        'error': 'bi-exclamation-circle-fill',
        'warning': 'bi-exclamation-triangle-fill',
        'info': 'bi-info-circle-fill'
    };
    return icons[type] || 'bi-info-circle-fill';
}

// Función para buscar en la tabla
function searchTable() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    const filter = input.value.toLowerCase();
    const table = document.querySelector('.table-custom');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;

        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (cell) {
                const text = cell.textContent || cell.innerText;
                if (text.toLowerCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }

        rows[i].style.display = found ? '' : 'none';
    }
}

// Exportar datos del dashboard
function exportDashboardData() {
    const data = {
        timestamp: new Date().toISOString(),
        metrics: {
            total: document.querySelector('.metric-card:nth-child(1) .metric-value').textContent,
            pending: document.querySelector('.metric-card:nth-child(2) .metric-value').textContent,
            inProgress: document.querySelector('.metric-card:nth-child(3) .metric-value').textContent,
            completed: document.querySelector('.metric-card:nth-child(4) .metric-value').textContent
        }
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    link.click();

    showNotification('Datos del dashboard exportados', 'success');
}

// Inicializar búsqueda si existe el campo
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchTable);
    }
});