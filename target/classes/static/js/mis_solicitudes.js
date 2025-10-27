// Funcionalidades para la página de Mis Solicitudes
document.addEventListener('DOMContentLoaded', function () {
    console.log("cargando aquiii")
    initFilters();
    initStats();
    initExpandableCards();
    initRealTimeUpdates();
});

// Inicializar filtros
function initFilters() {
    const filterEstado = document.getElementById('filterEstado');
    const filterFecha = document.getElementById('filterFecha');
    const filterSearch = document.getElementById('filterSearch');

    if (filterEstado) {
        filterEstado.addEventListener('change', applyFilters);
    }
    if (filterFecha) {
        filterFecha.addEventListener('change', applyFilters);
    }
    if (filterSearch) {
        filterSearch.addEventListener('input', applyFilters);
    }
}

// Aplicar filtros
function applyFilters() {
    const estadoFilter = document.getElementById('filterEstado').value;
    const fechaFilter = document.getElementById('filterFecha').value;
    const searchFilter = document.getElementById('filterSearch').value.toLowerCase();

    const cards = document.querySelectorAll('.solicitud-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const estado = card.getAttribute('data-estado');
        const fecha = card.getAttribute('data-fecha');
        const texto = card.textContent.toLowerCase();

        const estadoMatch = !estadoFilter || estado === estadoFilter;
        const fechaMatch = !fechaFilter || filterByDate(fecha, fechaFilter);
        const searchMatch = !searchFilter || texto.includes(searchFilter);

        if (estadoMatch && fechaMatch && searchMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    updateFilterStats(visibleCount);
}

// Filtrar por fecha
function filterByDate(fecha, filterType) {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaSolicitud = new Date(fecha);
    const hoyDate = new Date(hoy);

    switch (filterType) {
        case 'today':
            return fecha === hoy;
        case 'week':
            const unaSemanaAtras = new Date(hoyDate);
            unaSemanaAtras.setDate(hoyDate.getDate() - 7);
            return fechaSolicitud >= unaSemanaAtras;
        case 'month':
            const unMesAtras = new Date(hoyDate);
            unMesAtras.setMonth(hoyDate.getMonth() - 1);
            return fechaSolicitud >= unMesAtras;
        default:
            return true;
    }
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('filterEstado').value = '';
    document.getElementById('filterFecha').value = '';
    document.getElementById('filterSearch').value = '';
    applyFilters();
}

// Actualizar estadísticas de filtros
function updateFilterStats(visibleCount) {
    const totalElement = document.getElementById('totalSolicitudes');
    if (totalElement) {
        totalElement.textContent = visibleCount;
    }
}

// Inicializar estadísticas
function initStats() {
    const cards = document.querySelectorAll('.solicitud-card');
    let pendientes = 0;
    let aprobadas = 0;
    let rechazadas = 0;
    let procesadas = 0;
    let recientes = 0;
    
    const hoy = new Date();
    const unaSemanaAtras = new Date(hoy);
    unaSemanaAtras.setDate(hoy.getDate() - 7);

    cards.forEach(card => {
        const estado = card.getAttribute('data-estado');
        const fecha = new Date(card.getAttribute('data-fecha'));

        // Contar por estado
        if (estado === 'PENDIENTE') pendientes++;
        if (estado === 'APROBADA') aprobadas++;
        if (estado === 'RECHAZADA') rechazadas++;
        if (estado === 'PROCESADA') procesadas++;
        
        // Contar recientes (última semana)
        if (fecha >= unaSemanaAtras) recientes++;
    });

    // Actualizar elementos en el DOM
    const totalElement = document.getElementById('totalSolicitudes');
    const pendingElement = document.getElementById('pendingSolicitudes');
    const approvedElement = document.getElementById('approvedSolicitudes');
    const processedElement = document.getElementById('processedSolicitudes');

    if (totalElement) totalElement.textContent = cards.length;
    if (pendingElement) pendingElement.textContent = pendientes;
    if (approvedElement) approvedElement.textContent = aprobadas;
    if (processedElement) processedElement.textContent = procesadas;
}

// Tarjetas expandibles
function initExpandableCards() {
    // Los detalles se expanden al hacer clic en el botón de información
}

function showSolicitudDetails(button) {
    const card = button.closest('.solicitud-card');
    const expandable = card.querySelector('.solicitud-expandable');

    if (expandable) {
        const isExpanded = expandable.classList.contains('expanded');

        // Cerrar todos los demás
        document.querySelectorAll('.solicitud-expandable.expanded').forEach(el => {
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

// Copiar información de solicitud
function copySolicitudInfo(button) {
    const card = button.closest('.solicitud-card');
    const id = card.querySelector('h3').textContent;
    const descripcion = card.querySelector('.descripcion-content').textContent;
    const estado = card.querySelector('.status-badge').textContent;

    const texto = `Solicitud: ${id}\nEstado: ${estado}\nDescripción: ${descripcion}`;

    navigator.clipboard.writeText(texto).then(() => {
        showNotification('Información copiada al portapapeles', 'success');

        // Efecto visual de copiado
        button.innerHTML = '<i class="bi bi-check"></i>';
        setTimeout(() => {
            button.innerHTML = '<i class="bi bi-clipboard"></i>';
        }, 2000);
    }).catch(() => {
        showNotification('Error al copiar la información', 'error');
    });
}

// Mostrar modal con detalles completos
function showSolicitudModal(solicitudId) {
    const modal = document.getElementById('solicitudModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // En una aplicación real, aquí cargarías los datos de la solicitud
    modalTitle.textContent = `Detalles de SOL-${solicitudId}`;
    modalBody.innerHTML = `
        <div class="modal-solicitud-info">
            <p>Cargando información de la solicitud...</p>
        </div>
    `;

    modal.classList.add('show');

    // Simular carga de datos
    setTimeout(() => {
        modalBody.innerHTML = `
            <div class="modal-solicitud-info">
                <div class="info-section">
                    <h4>Información General</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>ID:</label>
                            <span>SOL-${solicitudId}</span>
                        </div>
                        <div class="info-item">
                            <label>Estado:</label>
                            <span class="status-badge status-pending">PENDIENTE</span>
                        </div>
                        <div class="info-item">
                            <label>Fecha:</label>
                            <span>${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div class="info-section">
                    <h4>Descripción Completa</h4>
                    <div class="descripcion-completa">
                        Esta es una descripción más detallada de la solicitud que incluye todos los aspectos técnicos y especificaciones requeridas para el repuesto solicitado.
                    </div>
                </div>
            </div>
        `;
    }, 500);
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('solicitudModal');
    modal.classList.remove('show');
}

// Cargar solicitudes (simulación de actualización)
function loadSolicitudes() {
    const refreshBtn = document.querySelector('.btn-refresh');

    if (refreshBtn) {
        // Agregar animación de giro
        refreshBtn.classList.add('spin');

        // Simular carga
        setTimeout(() => {
            refreshBtn.classList.remove('spin');

            // En una aplicación real, aquí harías una petición al servidor
            console.log('Solicitudes actualizadas');

            // Mostrar notificación de éxito
            showNotification('Solicitudes actualizadas correctamente', 'success');

            // Actualizar estadísticas
            initStats();
        }, 1000);
    }
}

// Exportar solicitudes
function exportSolicitudes() {
    const exportBtn = document.querySelector('.btn-export');

    if (exportBtn) {
        exportBtn.classList.add('spin');

        // Simular exportación
        setTimeout(() => {
            exportBtn.classList.remove('spin');

            // Crear datos para exportar
            const solicitudes = [];
            document.querySelectorAll('.solicitud-card').forEach(card => {
                if (card.style.display !== 'none') {
                    const id = card.querySelector('h3').textContent;
                    const estado = card.querySelector('.status-badge').textContent;
                    const fecha = card.querySelector('.date-badge').textContent;
                    const descripcion = card.querySelector('.descripcion-content').textContent;

                    solicitudes.push({ id, estado, fecha, descripcion });
                }
            });

            // Crear CSV
            let csv = 'ID,Estado,Fecha,Descripción\n';
            solicitudes.forEach(sol => {
                csv += `"${sol.id}","${sol.estado}","${sol.fecha}","${sol.descripcion.replace(/"/g, '""')}"\n`;
            });

            // Descargar
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `solicitudes_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showNotification('Solicitudes exportadas correctamente', 'success');
        }, 1500);
    }
}

// Actualizaciones en tiempo real
function initRealTimeUpdates() {
    // Actualizar cada 30 segundos
    setInterval(() => {
        // En una aplicación real, aquí harías una petición fetch al servidor
        // para obtener datos actualizados de las solicitudes
        console.log('Verificando actualizaciones de solicitudes...');
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

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function (event) {
    const modal = document.getElementById('solicitudModal');
    if (event.target === modal) {
        closeModal();
    }
});