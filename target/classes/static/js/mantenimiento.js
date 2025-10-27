// Funcionalidades interactivas para la página de mantenimientos
document.addEventListener('DOMContentLoaded', function () {
    // Cerrar alertas automáticamente
    autoCloseAlerts();

    // Inicializar funcionalidades de la tabla
    initTableFunctionality();

    // Inicializar funcionalidades del formulario
    initFormFunctionality();

    // Efectos visuales
    initVisualEffects();
});

// Cerrar alertas automáticamente después de 5 segundos
function autoCloseAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        const closeBtn = alert.querySelector('.alert-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                alert.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    alert.remove();
                }, 300);
            });
        }

        // Cerrar automáticamente después de 5 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 300);
            }
        }, 5000);
    });
}

// Funcionalidades de la tabla
function initTableFunctionality() {
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.table-row');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                    row.style.animation = 'fadeIn 0.3s ease-out';
                } else {
                    row.style.display = 'none';
                }
            });

            // Mostrar mensaje si no hay resultados
            const visibleRows = document.querySelectorAll('.table-row[style=""]');
            const emptyRow = document.querySelector('.empty-row');
            if (visibleRows.length === 0 && searchTerm !== '') {
                if (!emptyRow) {
                    showNoResultsMessage(searchTerm);
                }
            } else if (emptyRow && searchTerm === '') {
                emptyRow.style.display = '';
            }
        });
    }

    // Ordenamiento de columnas
    const sortableHeaders = document.querySelectorAll('th[data-sort]');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const sortBy = this.getAttribute('data-sort');
            const isAscending = !this.classList.contains('sorted-asc');

            // Remover clases de ordenamiento de todos los headers
            sortableHeaders.forEach(h => {
                h.classList.remove('sorted-asc', 'sorted-desc');
            });

            // Aplicar clase al header actual
            this.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');

            // Ordenar la tabla
            sortTable(sortBy, isAscending);
        });
    });

    // Expandir/contraer descripciones largas
    const expandButtons = document.querySelectorAll('.btn-expand');
    expandButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const descriptionText = this.previousElementSibling;
            const isExpanded = descriptionText.classList.contains('expanded');

            if (isExpanded) {
                descriptionText.classList.remove('expanded');
                this.innerHTML = '<i class="bi bi-chevron-down"></i>';
            } else {
                descriptionText.classList.add('expanded');
                this.innerHTML = '<i class="bi bi-chevron-up"></i>';
            }
        });
    });
}

// Funcionalidades del formulario
function initFormFunctionality() {
    const form = document.querySelector('.assign-form');
    if (form) {
        // Validación en tiempo real
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function () {
                validateField(this);
            });
        });

        // Envío del formulario con animación
        form.addEventListener('submit', function (e) {
            const isValid = validateForm();
            if (!isValid) {
                e.preventDefault();
                showFormError('Por favor, complete todos los campos requeridos correctamente.');
            } else {
                // Mostrar indicador de carga
                const submitBtn = this.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Procesando...';
                submitBtn.disabled = true;

                // Revertir después de 3 segundos (por si hay error)
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
}

// Efectos visuales
function initVisualEffects() {
    // Efecto de partículas en el fondo
    createParticles();

    // Animación de entrada escalonada para las filas de la tabla
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach((row, index) => {
        row.style.animationDelay = `${index * 0.05}s`;
    });

    // Efecto de brillo al pasar el cursor sobre los elementos del formulario
    const formInputs = document.querySelectorAll('.form-select, .form-input, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Funciones auxiliares
function sortTable(column, ascending) {
    const table = document.querySelector('.data-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('.table-row'));

    rows.sort((a, b) => {
        const aValue = getCellValue(a, column);
        const bValue = getCellValue(b, column);

        if (ascending) {
            return aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' });
        } else {
            return bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' });
        }
    });

    // Reordenar filas
    rows.forEach(row => {
        tbody.appendChild(row);
    });
}

function getCellValue(row, column) {
    const cellIndex = Array.from(row.cells).findIndex(cell => {
        const header = cell.closest('table').querySelector(`th[data-sort="${column}"]`);
        return header && header.cellIndex === cell.cellIndex;
    });

    if (cellIndex !== -1) {
        return row.cells[cellIndex].textContent.trim();
    }

    return '';
}

function validateField(field) {
    const isValid = field.checkValidity();
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, 'Este campo es requerido');
    } else {
        field.classList.remove('error');
        hideFieldError(field);
    }

    return isValid;
}

function validateForm() {
    const form = document.querySelector('.assign-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.animation = 'slideIn 0.3s ease-out';
}

function hideFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFormError(message) {
    // Crear elemento de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.innerHTML = `
        <div class="alert-icon">
            <i class="bi bi-exclamation-circle"></i>
        </div>
        <div class="alert-content">
            <p>${message}</p>
        </div>
        <button type="button" class="alert-close">&times;</button>
    `;

    // Insertar antes del formulario
    const form = document.querySelector('.assign-form');
    form.parentElement.insertBefore(errorDiv, form);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 300);
        }
    }, 5000);

    // Configurar botón de cierre
    const closeBtn = errorDiv.querySelector('.alert-close');
    closeBtn.addEventListener('click', function () {
        errorDiv.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 300);
    });
}

function showNoResultsMessage(searchTerm) {
    const tbody = document.querySelector('.data-table tbody');
    const existingNoResults = document.querySelector('.no-results-row');

    if (existingNoResults) {
        existingNoResults.remove();
    }

    const noResultsRow = document.createElement('tr');
    noResultsRow.className = 'no-results-row empty-row';
    noResultsRow.innerHTML = `
        <td colspan="7">
            <div class="empty-state">
                <i class="bi bi-search"></i>
                <p>No se encontraron resultados para "<strong>${searchTerm}</strong>"</p>
                <button class="btn-clear-search" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: var(--accent-primary); color: var(--primary-dark); border: none; border-radius: 6px; cursor: pointer;">Limpiar búsqueda</button>
            </div>
        </td>
    `;

    tbody.appendChild(noResultsRow);

    // Configurar botón de limpiar búsqueda
    const clearBtn = noResultsRow.querySelector('.btn-clear-search');
    clearBtn.addEventListener('click', function () {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    });
}

// Función para crear partículas en el fondo (reutilizada)
function createParticles() {
    const container = document.body;
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Posición aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        // Tamaño aleatorio
        const size = Math.random() * 3 + 1;

        // Duración de animación aleatoria
        const duration = Math.random() * 25 + 15;

        // Establecer estilos
        particle.style.cssText = `
            position: fixed;
            top: ${posY}vh;
            left: ${posX}vw;
            width: ${size}px;
            height: ${size}px;
            background: rgba(100, 255, 218, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            animation: float ${duration}s linear infinite;
        `;

        container.appendChild(particle);
    }
}

// Estilos adicionales para efectos
const additionalStyles = `
    .field-error {
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        animation: slideIn 0.3s ease-out;
    }
    
    .form-select.error,
    .form-input.error,
    .form-textarea.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .form-group.focused .form-label {
        color: var(--accent-primary);
    }
    
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .alert-error {
        background: rgba(220, 53, 69, 0.1);
        border-color: #dc3545;
        color: #f8d7da;
    }
    
    th.sorted-asc i::before {
        content: "\\f148";
    }
    
    th.sorted-desc i::before {
        content: "\\f149";
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);