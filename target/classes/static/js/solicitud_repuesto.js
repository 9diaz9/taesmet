// Funcionalidades para el formulario de solicitud de repuestos
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔵 Inicializando formulario de solicitud...');
    initFormValidation();
    initCharacterCounter();
    initAutoSave();
    initFormSubmission();
    initHelpTips();
});

// Inicializar validación del formulario
function initFormValidation() {
    const form = document.getElementById('solicitudForm');
    const textarea = form.querySelector('textarea[name="descripcion"]');

    if (textarea) {
        textarea.addEventListener('blur', validateDescription);
        textarea.addEventListener('input', clearError);
    }
}

// Validar descripción
function validateDescription(event) {
    const textarea = event.target;
    const value = textarea.value.trim();
    const formGroup = textarea.closest('.form-group');
    const charCount = value.length;

    // Remover estados previos
    formGroup.classList.remove('error', 'success');

    // Remover mensajes de error existentes
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Validaciones
    if (charCount === 0) {
        showFieldError(formGroup, 'La descripción del repuesto es obligatoria');
        return false;
    }

    if (charCount < 10) {
        showFieldError(formGroup, 'La descripción debe tener al menos 10 caracteres');
        return false;
    }

    if (charCount > 500) {
        showFieldError(formGroup, 'La descripción no puede exceder los 500 caracteres');
        return false;
    }

    // Validación exitosa
    formGroup.classList.add('success');
    return true;
}

// Mostrar error en campo
function showFieldError(formGroup, message) {
    formGroup.classList.add('error');

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;

    formGroup.appendChild(errorElement);
}

// Limpiar error
function clearError(event) {
    const formGroup = event.target.closest('.form-group');
    formGroup.classList.remove('error');

    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Contador de caracteres
function initCharacterCounter() {
    const textarea = document.querySelector('textarea[name="descripcion"]');
    if (!textarea) return;

    // Crear contador
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.textContent = '0/500';

    textarea.parentNode.appendChild(counter);

    // Actualizar contador
    textarea.addEventListener('input', function () {
        const count = this.value.length;
        counter.textContent = `${count}/500`;

        // Cambiar color según el conteo
        counter.classList.remove('warning', 'error');
        if (count > 400) {
            counter.classList.add('warning');
        }
        if (count > 480) {
            counter.classList.add('error');
        }
    });
}

// Auto-guardado en localStorage
function initAutoSave() {
    const textarea = document.querySelector('textarea[name="descripcion"]');
    const mttoId = document.querySelector('input[name="mttoId"]').value;
    const storageKey = `solicitud_repuesto_${mttoId}`;

    if (!textarea) return;

    // Cargar dato guardado
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        textarea.value = savedData;
        showNotification('Datos recuperados del borrador anterior', 'info');

        // Actualizar contador si existe
        const counter = document.querySelector('.char-counter');
        if (counter) {
            counter.textContent = `${savedData.length}/500`;
        }
    }

    // Guardar en tiempo real
    textarea.addEventListener('input', function () {
        localStorage.setItem(storageKey, this.value);
    });

    // Limpiar al enviar el formulario
    const form = document.getElementById('solicitudForm');
    form.addEventListener('submit', function () {
        localStorage.removeItem(storageKey);
    });
}

// Envío del formulario - CORREGIDO
function initFormSubmission() {
    const form = document.getElementById('solicitudForm');

    form.addEventListener('submit', function (event) {
        console.log('🔵 Formulario enviado - validando...');

        // Validar antes de enviar
        const textarea = form.querySelector('textarea[name="descripcion"]');
        const fakeEvent = { target: textarea };

        if (!validateDescription(fakeEvent)) {
            console.log('❌ Validación fallida');
            event.preventDefault();
            showNotification('Por favor corrige los errores en el formulario', 'error');
            textarea.focus();
            return;
        }

        console.log('✅ Validación exitosa - mostrando confirmación');
        event.preventDefault();
        showConfirmationModal();
    });
}

// Mostrar modal de confirmación
function showConfirmationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirmar Solicitud</h3>
                <button type="button" class="modal-close" onclick="closeModal(this)">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="confirmation-content">
                    <i class="bi bi-question-circle"></i>
                    <div class="confirmation-text">
                        <h4>¿Estás seguro de enviar esta solicitud?</h4>
                        <p>La solicitud será enviada para revisión y no podrás modificarla después.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="closeModal(this)">
                    <i class="bi bi-x-circle"></i>
                    <span>Cancelar</span>
                </button>
                <button type="button" class="btn-primary" onclick="submitForm()">
                    <i class="bi bi-check-circle"></i>
                    <span>Confirmar Envío</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Agregar evento para cerrar con ESC
    document.addEventListener('keydown', handleModalEscapeKey);
}

// Cerrar modal
function closeModal(button) {
    const modal = button.closest('.modal');
    if (modal) {
        modal.remove();
    }
    document.removeEventListener('keydown', handleModalEscapeKey);
}

// Manejar tecla ESC en modal
function handleModalEscapeKey(event) {
    if (event.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            modal.remove();
            document.removeEventListener('keydown', handleModalEscapeKey);
        }
    }
}

// Enviar formulario - CORREGIDO
function submitForm() {
    const form = document.getElementById('solicitudForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    console.log('🔄 Enviando solicitud al servidor...');

    // Mostrar estado de carga
    form.classList.add('loading');
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i><span>Enviando...</span>';

    // Cerrar modal
    closeModal(document.querySelector('.modal-close'));

    // Enviar el formulario REAL después de un breve delay
    setTimeout(() => {
        try {
            console.log('✅ Enviando formulario real...');
            // Remover el event listener temporalmente para evitar loop
            form.removeEventListener('submit', arguments.callee);
            form.submit(); // Esto envía el formulario real al servidor
        } catch (error) {
            console.error('❌ Error al enviar formulario:', error);
            showNotification('Error al enviar la solicitud', 'error');

            // Restaurar botón
            form.classList.remove('loading');
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send"></i><span>Enviar Solicitud</span>';
        }
    }, 500);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="bi bi-x"></i>
        </button>
    `;

    // Estilos básicos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
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

// Hacer funciones globales disponibles
window.submitForm = submitForm;
window.closeModal = closeModal;

// Inicializar contador al cargar la página
window.addEventListener('load', function () {
    const textarea = document.querySelector('textarea[name="descripcion"]');
    if (textarea) {
        textarea.dispatchEvent(new Event('input'));
    }
});