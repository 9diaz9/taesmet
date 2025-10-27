// Funcionalidades para la página de selección de mantenimiento
let selectedMttoId = null;
let selectedMttoInfo = null;

// Función global para seleccionar mantenimiento
function selectMantenimiento(mttoId) {
    console.log('Seleccionando mantenimiento:', mttoId);

    const card = document.querySelector(`[data-mtto-id="${mttoId}"]`);

    if (card) {
        selectedMttoId = mttoId;
        selectedMttoInfo = {
            id: mttoId,
            codigo: card.querySelector('h3').textContent,
            maquina: card.querySelector('.info-content span').textContent,
            tipo: card.getAttribute('data-tipo')
        };

        showConfirmationModal(selectedMttoInfo);
    } else {
        console.error('No se encontró la tarjeta para el mantenimiento:', mttoId);
        showNotification('Error al seleccionar el mantenimiento', 'error');
    }
}

// Mostrar modal de confirmación
function showConfirmationModal(mttoInfo) {
    const modal = document.getElementById('confirmationModal');
    const modalInfo = document.getElementById('modalMttoInfo');

    if (!modal || !modalInfo) {
        console.error('Modal no encontrado');
        showNotification('Error al mostrar la confirmación', 'error');
        return;
    }

    modalInfo.innerHTML = `
        <strong>${mttoInfo.codigo}</strong><br>
        Máquina: ${mttoInfo.maquina}<br>
        Tipo: ${formatTipoMantenimiento(mttoInfo.tipo)}
    `;

    modal.classList.add('show');

    // Agregar evento para cerrar con ESC
    document.addEventListener('keydown', handleEscapeKey);
}

// Formatear tipo de mantenimiento
function formatTipoMantenimiento(tipo) {
    const tipos = {
        'CRITICO': 'Crítico',
        'PREVENTIVO_ELECTRICO': 'Preventivo Eléctrico',
        'PREVENTIVO_MECANICO': 'Preventivo Mecánico'
    };
    return tipos[tipo] || tipo;
}

// Confirmar selección
function confirmSelection() {
    if (selectedMttoId) {
        console.log('Confirmando selección para mantenimiento:', selectedMttoId);
        showNotification('Redirigiendo a creación de solicitud...', 'info');

        // Pequeño delay para mostrar la notificación
        setTimeout(() => {
            window.location.href = `/tecnico/repuestos/solicitar/${selectedMttoId}`;
        }, 1000);
    } else {
        console.error('No hay mantenimiento seleccionado');
        showNotification('Por favor selecciona un mantenimiento primero', 'error');
    }
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.classList.remove('show');
        selectedMttoId = null;
        selectedMttoInfo = null;

        // Remover evento ESC
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

// Manejar tecla ESC
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

// Cerrar modal al hacer clic fuera
function initModalCloseOnOutsideClick() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    console.log('Inicializando página de selección de mantenimiento');
    initFilters();
    initCardInteractions();
    initKeyboardNavigation();
    initModalCloseOnOutsideClick();
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

    const cards = document.querySelectorAll('.mtto-card');
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

    // Mostrar notificación si no hay resultados
    if (visibleCount === 0 && cards.length > 0) {
        showNotification('No se encontraron mantenimientos con los filtros aplicados', 'warning');
    }
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('filterEstado').value = '';
    document.getElementById('filterTipo').value = '';
    document.getElementById('filterSearch').value = '';
    applyFilters();
    showNotification('Filtros limpiados', 'info');
}

// Actualizar estadísticas de filtros
function updateFilterStats(visibleCount) {
    const totalElement = document.getElementById('totalMttos');
    if (totalElement) {
        totalElement.textContent = visibleCount;

        // Efecto visual al actualizar
        totalElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// Interacciones con las tarjetas
function initCardInteractions() {
    const cards = document.querySelectorAll('.mtto-card');

    cards.forEach(card => {
        // Efecto hover mejorado
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 25px 50px -12px rgba(2, 12, 27, 0.8)';
        });

        card.addEventListener('mouseleave', function () {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            }
        });

        // Click en toda la tarjeta
        card.addEventListener('click', function (event) {
            // Evitar que se dispare cuando se hace click en el botón
            if (!event.target.closest('.btn-select')) {
                const mttoId = this.getAttribute('data-mtto-id');
                if (mttoId) {
                    selectMantenimiento(mttoId);
                }
            }
        });

        // Efecto de focus para accesibilidad
        card.addEventListener('focus', function () {
            this.style.outline = '2px solid var(--accent-primary)';
            this.style.outlineOffset = '2px';
        });

        card.addEventListener('blur', function () {
            this.style.outline = '';
        });
    });
}

// Navegación con teclado
function initKeyboardNavigation() {
    document.addEventListener('keydown', function (event) {
        // Solo navegar si no estamos en un input
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            return;
        }

        const cards = Array.from(document.querySelectorAll('.mtto-card[style*="display: block"]'));
        const currentIndex = cards.findIndex(card => card.classList.contains('selected'));

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                navigateCards(cards, currentIndex, 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                navigateCards(cards, currentIndex, -1);
                break;
            case 'Enter':
                if (currentIndex !== -1) {
                    const selectedCard = cards[currentIndex];
                    const mttoId = selectedCard.getAttribute('data-mtto-id');
                    if (mttoId) {
                        selectMantenimiento(mttoId);
                    }
                }
                break;
            case ' ':
                if (currentIndex !== -1) {
                    event.preventDefault();
                    const selectedCard = cards[currentIndex];
                    const mttoId = selectedCard.getAttribute('data-mtto-id');
                    if (mttoId) {
                        selectMantenimiento(mttoId);
                    }
                }
                break;
        }
    });
}

// Navegar entre tarjetas
function navigateCards(cards, currentIndex, direction) {
    if (cards.length === 0) return;

    cards.forEach(card => card.classList.remove('selected'));

    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = cards.length - 1;
    if (newIndex >= cards.length) newIndex = 0;

    if (cards[newIndex]) {
        cards[newIndex].classList.add('selected');
        cards[newIndex].focus();
        cards[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Efecto visual de selección
        cards[newIndex].style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            cards[newIndex].style.animation = '';
        }, 500);
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentElement) {
            notification.remove();
        }
    });

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

    // Aplicar estilos consistentes con la nueva paleta
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
        backdrop-filter: blur(10px);
    `;

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
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

// Agregar estilos CSS adicionales para animaciones
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0% { 
            transform: translateY(-2px) scale(1);
            box-shadow: 0 20px 40px -15px rgba(2, 12, 27, 0.7);
        }
        50% { 
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 25px 50px -12px rgba(100, 255, 218, 0.3);
        }
        100% { 
            transform: translateY(-2px) scale(1);
            box-shadow: 0 20px 40px -15px rgba(2, 12, 27, 0.7);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        color: var(--text-primary);
    }
    
    .notification-close:hover {
        background: rgba(136, 146, 176, 0.1);
    }
    
    .mtto-card.selected {
        border-color: var(--accent-primary);
        background: rgba(100, 255, 218, 0.05);
        transform: translateY(-2px);
    }
    
    .mtto-card:focus {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
    }
    
    /* Efectos de transición suave para todos los elementos interactivos */
    .btn-select, .btn-primary, .btn-secondary, .btn-clear-filters {
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    
    /* Mejoras de accesibilidad */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Hacer las funciones globales disponibles
window.selectMantenimiento = selectMantenimiento;
window.confirmSelection = confirmSelection;
window.closeModal = closeModal;
window.clearFilters = clearFilters;

// Exportar para tests (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectMantenimiento,
        confirmSelection,
        closeModal,
        clearFilters,
        applyFilters,
        showNotification
    };
}