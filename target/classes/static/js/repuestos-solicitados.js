document.addEventListener('DOMContentLoaded', function () {
    // Inicializar la aplicación
    initFilters();
    initStats();
    initEventListeners();
    console.log("✅ JavaScript cargado correctamente");

    // Actualizar estadísticas iniciales
    updateStats();
});

// Inicializar filtros
function initFilters() {
    const filterEstado = document.getElementById('filterEstado');
    const searchInput = document.getElementById('searchInput');
    const clearFiltersBtn = document.getElementById('clearFilters');

    if (filterEstado) {
        filterEstado.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Inicializar event listeners
function initEventListeners() {
    const refreshBtn = document.getElementById('refreshBtn');
    const exportBtn = document.getElementById('exportBtn');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }

    // Delegación de eventos para los botones de acción - CORREGIDO
    document.addEventListener('click', function (e) {
        if (e.target.closest('.btn-aprobar')) {
            const id = e.target.closest('.btn-aprobar').dataset.id;
            aprobarSolicitud(id);
        }
        if (e.target.closest('.btn-rechazar')) {
            const id = e.target.closest('.btn-rechazar').dataset.id;
            rechazarSolicitud(id);
        }
        if (e.target.closest('.btn-procesar')) {
            const id = e.target.closest('.btn-procesar').dataset.id;
            procesarSolicitud(id);
        }
    });

    // Configurar botones del modal
    setupModalButtons();
}

// Configurar botones del modal
function setupModalButtons() {
    const confirmAprobar = document.getElementById('confirmAprobar');
    const confirmRechazar = document.getElementById('confirmRechazar');
    const confirmProcesar = document.getElementById('confirmProcesar');

    if (confirmAprobar) {
        confirmAprobar.addEventListener('click', function () {
            ejecutarAccion('/lider/repuestos/' + currentSolicitudId + '/aprobar');
        });
    }

    if (confirmRechazar) {
        confirmRechazar.addEventListener('click', function () {
            ejecutarAccion('/lider/repuestos/' + currentSolicitudId + '/rechazar');
        });
    }

    if (confirmProcesar) {
        confirmProcesar.addEventListener('click', function () {
            ejecutarAccion('/lider/repuestos/' + currentSolicitudId + '/procesar');
        });
    }

    // Limpiar modal cuando se cierre
    const observacionesModal = document.getElementById('observacionesModal');
    if (observacionesModal) {
        observacionesModal.addEventListener('hidden.bs.modal', function () {
            const observacionesText = document.getElementById('observacionesText');
            if (observacionesText) {
                observacionesText.value = '';
            }
            currentSolicitudId = null;
            currentAction = null;
        });
    }
}

// Variables globales para el modal
let currentSolicitudId = null;
let currentAction = null;

// Función para aprobar solicitud
function aprobarSolicitud(id) {
    currentSolicitudId = id;
    currentAction = 'aprobar';
    const modalTitle = document.getElementById('modalTitle');
    const confirmAprobar = document.getElementById('confirmAprobar');
    const confirmRechazar = document.getElementById('confirmRechazar');
    const confirmProcesar = document.getElementById('confirmProcesar');

    if (modalTitle) modalTitle.textContent = 'Aprobar Solicitud';
    if (confirmAprobar) confirmAprobar.style.display = 'inline-block';
    if (confirmRechazar) confirmRechazar.style.display = 'none';
    if (confirmProcesar) confirmProcesar.style.display = 'none';

    const modalElement = document.getElementById('observacionesModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

// Función para rechazar solicitud
function rechazarSolicitud(id) {
    currentSolicitudId = id;
    currentAction = 'rechazar';
    const modalTitle = document.getElementById('modalTitle');
    const confirmAprobar = document.getElementById('confirmAprobar');
    const confirmRechazar = document.getElementById('confirmRechazar');
    const confirmProcesar = document.getElementById('confirmProcesar');

    if (modalTitle) modalTitle.textContent = 'Rechazar Solicitud';
    if (confirmAprobar) confirmAprobar.style.display = 'none';
    if (confirmRechazar) confirmRechazar.style.display = 'inline-block';
    if (confirmProcesar) confirmProcesar.style.display = 'none';

    const modalElement = document.getElementById('observacionesModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

// Función para procesar solicitud
function procesarSolicitud(id) {
    currentSolicitudId = id;
    currentAction = 'procesar';
    const modalTitle = document.getElementById('modalTitle');
    const confirmAprobar = document.getElementById('confirmAprobar');
    const confirmRechazar = document.getElementById('confirmRechazar');
    const confirmProcesar = document.getElementById('confirmProcesar');

    if (modalTitle) modalTitle.textContent = 'Procesar Solicitud';
    if (confirmAprobar) confirmAprobar.style.display = 'none';
    if (confirmRechazar) confirmRechazar.style.display = 'none';
    if (confirmProcesar) confirmProcesar.style.display = 'inline-block';

    const modalElement = document.getElementById('observacionesModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

// Función para obtener el token CSRF
function getCsrfToken() {
    // Buscar el token en el meta tag
    const metaTag = document.querySelector('meta[name="_csrf"]');
    if (metaTag) {
        return metaTag.getAttribute('content');
    }

    // Buscar en input hidden
    const inputTag = document.querySelector('input[name="_csrf"]');
    if (inputTag) {
        return inputTag.value;
    }

    console.error('No se encontró el token CSRF');
    return '';
}

// Ejecutar acción en el servidor - VERSIÓN MEJORADA
// Ejecutar acción en el servidor - VERSIÓN CORREGIDA
function ejecutarAccion(url) {
    const observacionesText = document.getElementById('observacionesText');
    const observaciones = observacionesText ? observacionesText.value : '';

    // Crear objeto JSON para enviar
    const data = {};
    if (observaciones) {
        data.observaciones = observaciones;
    }

    // Obtener token CSRF
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
        showNotification('Error de seguridad: No se pudo obtener el token CSRF', 'error');
        return;
    }

    // Mostrar loading en los botones del modal
    showLoading(true);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.text().then(text => {
                    try {
                        return JSON.parse(text);
                    } catch {
                        return { message: 'Acción realizada correctamente' };
                    }
                });
            } else {
                throw new Error('Error en la respuesta del servidor: ' + response.status);
            }
        })
        .then(data => {
            // Cerrar el modal inmediatamente
            const modalElement = document.getElementById('observacionesModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }

            // Mostrar mensaje de éxito
            showNotification(data.message || 'Acción realizada correctamente', 'success');

            // Recargar la página después de un breve delay para que se vea el mensaje
            setTimeout(() => {
                location.reload();
            }, 1500);
        })
        .catch(error => {
            console.error('Error:', error);

            // Cerrar el modal incluso en caso de error
            const modalElement = document.getElementById('observacionesModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }

            showNotification('Error al ejecutar la acción: ' + error.message, 'error');
        })
        .finally(() => {
            showLoading(false);
        });
}

// Mostrar/ocultar loading - VERSIÓN MEJORADA
function showLoading(show) {
    const buttons = [
        document.getElementById('confirmAprobar'),
        document.getElementById('confirmRechazar'),
        document.getElementById('confirmProcesar')
    ];

    buttons.forEach(button => {
        if (button) {
            if (show) {
                button.disabled = true;
                const originalText = button.textContent;
                button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Procesando...';
                button.setAttribute('data-original-text', originalText);
            } else {
                button.disabled = false;
                const originalText = button.getAttribute('data-original-text');
                if (originalText) {
                    button.textContent = originalText;
                }
            }
        }
    });
}

// Mostrar/ocultar loading
function showLoading(show) {
    const buttons = [
        document.getElementById('confirmAprobar'),
        document.getElementById('confirmRechazar'),
        document.getElementById('confirmProcesar')
    ];

    buttons.forEach(button => {
        if (button) {
            if (show) {
                button.disabled = true;
                button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Procesando...';
            } else {
                button.disabled = false;
                // Restaurar texto original basado en el botón
                if (button.id === 'confirmAprobar') button.textContent = 'Aprobar';
                if (button.id === 'confirmRechazar') button.textContent = 'Rechazar';
                if (button.id === 'confirmProcesar') button.textContent = 'Procesar';
            }
        }
    });
}

// Aplicar filtros
function applyFilters() {
    const estadoFilter = document.getElementById('filterEstado').value;
    const searchFilter = document.getElementById('searchInput').value.toLowerCase();

    const rows = document.querySelectorAll('.solicitud-row');
    let visibleCount = 0;

    rows.forEach(row => {
        const estado = row.getAttribute('data-estado');
        const texto = row.textContent.toLowerCase();

        const estadoMatch = !estadoFilter || estado === estadoFilter;
        const searchMatch = !searchFilter || texto.includes(searchFilter);

        if (estadoMatch && searchMatch) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Actualizar contadores
    updateShowingCount(visibleCount);
    updateStats();
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('filterEstado').value = '';
    document.getElementById('searchInput').value = '';
    applyFilters();

    // Mostrar notificación
    showNotification('Filtros limpiados correctamente', 'success');
}

// Inicializar estadísticas
function initStats() {
    updateStats();
}

// Actualizar estadísticas
function updateStats() {
    const rows = document.querySelectorAll('.solicitud-row');
    let total = 0;
    let aprobadas = 0;
    let pendientes = 0;
    let rechazadas = 0;
    let procesadas = 0;

    rows.forEach(row => {
        if (row.style.display !== 'none') {
            total++;
            const estado = row.getAttribute('data-estado');

            switch (estado) {
                case 'APROBADA':
                    aprobadas++;
                    break;
                case 'PENDIENTE':
                    pendientes++;
                    break;
                case 'RECHAZADA':
                    rechazadas++;
                    break;
                case 'PROCESADA':
                    procesadas++;
                    break;
            }
        }
    });

    // Actualizar elementos DOM
    const totalElement = document.getElementById('totalSolicitudes');
    const aprobadasElement = document.getElementById('aprobadasCount');
    const pendientesElement = document.getElementById('pendientesCount');
    const rechazadasElement = document.getElementById('rechazadasCount');
    const totalCountElement = document.getElementById('totalCount');

    if (totalElement) totalElement.textContent = total;
    if (aprobadasElement) aprobadasElement.textContent = aprobadas;
    if (pendientesElement) pendientesElement.textContent = pendientes;
    if (rechazadasElement) rechazadasElement.textContent = rechazadas;
    if (totalCountElement) totalCountElement.textContent = rows.length;

    updateShowingCount(total);
}

// Actualizar contador de elementos mostrados
function updateShowingCount(count) {
    const showingElement = document.getElementById('showingCount');
    if (showingElement) {
        showingElement.textContent = count;
    }
}

// Refrescar datos
function refreshData() {
    const refreshBtn = document.getElementById('refreshBtn');

    if (refreshBtn) {
        // Agregar animación de giro
        const icon = refreshBtn.querySelector('i');
        if (icon) {
            icon.classList.add('spin');
        }

        // Simular carga de datos
        setTimeout(() => {
            if (icon) {
                icon.classList.remove('spin');
            }

            // En una aplicación real, aquí harías una petición al servidor
            console.log('Datos actualizados');

            // Actualizar estadísticas
            updateStats();

            // Mostrar notificación
            showNotification('Datos actualizados correctamente', 'success');
        }, 1000);
    }
}

// Exportar datos
function exportData() {
    const exportBtn = document.getElementById('exportBtn');

    if (exportBtn) {
        // Agregar animación de giro
        const icon = exportBtn.querySelector('i');
        if (icon) {
            icon.classList.add('spin');
        }

        // Simular exportación
        setTimeout(() => {
            if (icon) {
                icon.classList.remove('spin');
            }

            // Crear datos para exportar
            const solicitudes = [];
            document.querySelectorAll('.solicitud-row').forEach(row => {
                if (row.style.display !== 'none') {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 7) {
                        const id = cells[0].textContent;
                        const mantenimiento = cells[1].querySelector('span') ? cells[1].querySelector('span').textContent : '';
                        const maquina = cells[2].querySelector('span') ? cells[2].querySelector('span').textContent : '';
                        const motivo = cells[3].textContent;
                        const descripcion = cells[4].textContent;
                        const fecha = cells[5].textContent;
                        const estado = cells[6].querySelector('.badge') ? cells[6].querySelector('.badge').textContent : '';

                        solicitudes.push({
                            id, mantenimiento, maquina, motivo,
                            descripcion, fecha, estado
                        });
                    }
                }
            });

            // Crear CSV
            let csv = 'ID,Mantenimiento,Máquina,Motivo,Descripción,Fecha,Estado\n';
            solicitudes.forEach(sol => {
                csv += `"${sol.id}","${sol.mantenimiento}","${sol.maquina}","${sol.motivo}",` +
                    `"${sol.descripcion.replace(/"/g, '""')}","${sol.fecha}","${sol.estado}"\n`;
            });

            // Descargar archivo
            downloadCSV(csv, `repuestos_solicitados_${new Date().toISOString().split('T')[0]}.csv`);

            // Mostrar notificación
            showNotification('Datos exportados correctamente', 'success');
        }, 1500);
    }
}

// Descargar archivo CSV
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `
        <i class="bi ${getNotificationIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;

    // Insertar después del primer alert si existe, o al principio del container
    const container = document.querySelector('.container.py-5');
    if (container) {
        const existingAlert = container.querySelector('.alert');

        if (existingAlert) {
            existingAlert.parentNode.insertBefore(notification, existingAlert.nextSibling);
        } else {
            const firstChild = container.firstChild;
            container.insertBefore(notification, firstChild);
        }

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                const bsAlert = new bootstrap.Alert(notification);
                bsAlert.close();
            }
        }, 5000);
    }
}

// Obtener icono para notificación
function getNotificationIcon(type) {
    const icons = {
        success: 'bi-check-circle',
        error: 'bi-exclamation-triangle',
        warning: 'bi-exclamation-triangle',
        info: 'bi-info-circle'
    };
    return icons[type] || 'bi-info-circle';
}

// Agregar estilos para animaciones
const style = document.createElement('style');
style.textContent = `
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Hacer funciones globales disponibles
window.aprobarSolicitud = aprobarSolicitud;
window.rechazarSolicitud = rechazarSolicitud;
window.procesarSolicitud = procesarSolicitud;