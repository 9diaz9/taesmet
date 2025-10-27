// Funcionalidades para la página de Mis Mantenimientos
document.addEventListener('DOMContentLoaded', function () {
    initFilters();
    initStats();
    initExpandableCards();
    initRealTimeUpdates();
});

// Inicializar filtros
function initFilters() {
    const filterEstado = document.getElementById('filterEstado');
    const filterTipo = document.getElementById('filterTipo');
    const filterSearch = document.getElementById('filterSearch');

    if (filterEstado) {
        filterEstado.addEventListener('change', applyFilters);
    }
    if (filterTipo) {
        filterTipo.addEventListener('change', applyFilters);
    }
    if (filterSearch) {
        filterSearch.addEventListener('input', applyFilters);
    }
}

// Aplicar filtros
function applyFilters() {
    const estadoFilter = document.getElementById('filterEstado').value;
    const tipoFilter = document.getElementById('filterTipo').value;
    const searchFilter = document.getElementById('filterSearch').value.toLowerCase();

    const cards = document.querySelectorAll('.mantenimiento-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const estado = card.getAttribute('data-estado');
        const tipo = card.getAttribute('data-tipo');
        const texto = card.textContent.toLowerCase();

        const estadoMatch = !estadoFilter || estado === estadoFilter;
        const tipoMatch = !tipoFilter || tipo === tipoFilter;
        const searchMatch = !searchFilter || texto.includes(searchFilter);

        if (estadoMatch && tipoMatch && searchMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    updateFilterStats(visibleCount);
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('filterEstado').value = '';
    document.getElementById('filterTipo').value = '';
    document.getElementById('filterSearch').value = '';
    applyFilters();
}

// Actualizar estadísticas de filtros
function updateFilterStats(visibleCount) {
    const totalElement = document.getElementById('totalMttos');
    if (totalElement) {
        totalElement.textContent = visibleCount;
    }
}

// Inicializar estadísticas
function initStats() {
    const cards = document.querySelectorAll('.mantenimiento-card');
    let pendientes = 0;
    let enProceso = 0;
    let completados = 0;

    cards.forEach(card => {
        const estado = card.getAttribute('data-estado');
        switch (estado) {
            case 'PENDIENTE':
                pendientes++;
                break;
            case 'EN_PROCESO':
                enProceso++;
                break;
            case 'COMPLETADO':
            case 'REALIZADO':
                completados++;
                break;
        }
    });

    const pendingElement = document.getElementById('pendingMttos');
    const progressElement = document.getElementById('progressMttos');
    const completedElement = document.getElementById('completedMttos');

    if (pendingElement) pendingElement.textContent = pendientes;
    if (progressElement) progressElement.textContent = enProceso;
    if (completedElement) completedElement.textContent = completados;
}

// Tarjetas expandibles
function initExpandableCards() {
    // Los detalles se expanden al hacer clic en el botón de información
}

function showDetails(button) {
    const card = button.closest('.mantenimiento-card');
    const expandable = card.querySelector('.mantenimiento-expandable');

    if (expandable) {
        const isExpanded = expandable.classList.contains('expanded');

        // Cerrar todos los demás
        document.querySelectorAll('.mantenimiento-expandable.expanded').forEach(el => {
            if (el !== expandable) {
                el.classList.remove('expanded');
            }
        });

        // Alternar el actual
        expandable.classList.toggle('expanded', !isExpanded);

        // Animación suave
        if (!isExpanded) {
            expandable.style.maxHeight = expandable.scrollHeight + 'px';
        } else {
            expandable.style.maxHeight = '0';
        }
    }
}

// Cambiar estado
function changeEstado(button) {
    const card = button.closest('.mantenimiento-card');
    const expandable = card.querySelector('.mantenimiento-expandable');
    const estadoForm = card.querySelector('.estado-form');

    // Expandir si no está expandido
    if (!expandable.classList.contains('expanded')) {
        showDetails(button);
    }

    // Enfocar el select de estado
    setTimeout(() => {
        const estadoSelect = estadoForm.querySelector('.estado-select');
        if (estadoSelect) {
            estadoSelect.focus();
        }
    }, 300);
}

// Cargar mantenimientos (simulación de actualización)
function loadMantenimientos() {
    const refreshBtn = document.querySelector('.btn-refresh');

    if (refreshBtn) {
        // Agregar animación de giro
        refreshBtn.classList.add('spin');

        // Simular carga
        setTimeout(() => {
            refreshBtn.classList.remove('spin');

            // En una aplicación real, aquí harías una petición al servidor
            console.log('Mantenimientos actualizados');

            // Mostrar notificación de éxito
            showNotification('Mantenimientos actualizados correctamente', 'success');
        }, 1000);
    }
}

// Actualizaciones en tiempo real
function initRealTimeUpdates() {
    // Actualizar cada 30 segundos
    setInterval(() => {
        // En una aplicación real, aquí harías una petición fetch al servidor
        // para obtener datos actualizados
        console.log('Verificando actualizaciones...');
    }, 30000);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="bi bi-x"></i>
        </button>
    `;

    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--primary-medium);
        padding: 1rem;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        border-left: 4px solid ${getNotificationColor(type)};
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        border: 1px solid rgba(100, 255, 218, 0.1);
        color: var(--text-primary);
    `;

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#64ffda',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#0ea5e9'
    };
    return colors[type] || '#0ea5e9';
}