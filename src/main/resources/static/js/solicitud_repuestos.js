// Funcionalidades para el formulario de solicitud de repuestos
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔵 Inicializando formulario de solicitud...');
    initFormValidation();
    initCharacterCounter();
    initAutoSave();
    initFormSubmission();
});

// Inicializar validación del formulario
function initFormValidation() {
    const form = document.getElementById('solicitudForm');
    const textarea = form.querySelector('textarea[name="descripcion"]');
    const motivo = form.querySelector('select[name="motivo"]');
    const codigoMaquina = form.querySelector('input[name="codigoMaquina"]');

    if (textarea) {
        textarea.addEventListener('input', validateDescriptionRealTime);
        textarea.addEventListener('blur', validateDescriptionRealTime);
    }

    if (motivo) {
        motivo.addEventListener('change', validateMotivo);
    }

    if (codigoMaquina) {
        codigoMaquina.addEventListener('input', validateCodigoMaquina);
    }
}

// Validar motivo
function validateMotivo(event) {
    const select = event.target;
    const formGroup = select.closest('.form-group');
    const value = select.value;

    clearFieldError(formGroup);

    if (!value) {
        showFieldError(formGroup, 'El motivo es obligatorio');
        return false;
    }

    formGroup.classList.add('success');
    return true;
}

// Validar código máquina
function validateCodigoMaquina(event) {
    const input = event.target;
    const formGroup = input.closest('.form-group');
    const value = input.value.trim();

    clearFieldError(formGroup);

    if (!value) {
        showFieldError(formGroup, 'El código de máquina es obligatorio');
        return false;
    }

    formGroup.classList.add('success');
    return true;
}

// Validar descripción en tiempo real
function validateDescriptionRealTime(event) {
    const textarea = event.target;
    const value = textarea.value.trim();
    const formGroup = textarea.closest('.form-group');

    // Limpiar estados previos
    clearFieldError(formGroup);

    // Validaciones básicas
    if (value.length === 0) {
        return false;
    }

    if (value.length < 10) {
        showFieldError(formGroup, 'La descripción debe tener al menos 10 caracteres');
        return false;
    }

    if (value.length > 500) {
        showFieldError(formGroup, 'La descripción no puede exceder los 500 caracteres');
        return false;
    }

    // Validaciones avanzadas de contenido
    const validationResult = validateTextContent(value);
    if (!validationResult.isValid) {
        showFieldError(formGroup, validationResult.message);
        return false;
    }

    // Validación exitosa
    formGroup.classList.add('success');
    return true;
}

// Validar contenido del texto
function validateTextContent(text) {
    const words = text.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word.replace(/[.,!?;:()]/g, ''));

    // 1. Validar mínimo de palabras
    if (words.length < 5) {
        return {
            isValid: false,
            message: 'La descripción debe tener al menos 5 palabras'
        };
    }

    // 2. Validar palabras repetidas consecutivas
    const consecutiveRepeats = hasConsecutiveRepeatedWords(words);
    if (consecutiveRepeats) {
        return {
            isValid: false,
            message: 'No se permiten palabras repetidas consecutivas'
        };
    }

    // 3. Validar caracteres repetidos excesivos
    const excessiveRepeats = hasExcessiveRepeatedCharacters(text);
    if (excessiveRepeats) {
        return {
            isValid: false,
            message: 'No se permiten secuencias de caracteres repetidos (como "aaaa", "cccc")'
        };
    }

    // 4. Validar palabras sin sentido (sin vocales o muy cortas repetidas)
    const nonsenseWords = hasNonsenseWords(words);
    if (nonsenseWords) {
        return {
            isValid: false,
            message: 'El texto contiene palabras sin sentido o incoherentes'
        };
    }

    // 5. Validar diversidad léxica
    const uniqueWords = new Set(words);
    const diversityRatio = uniqueWords.size / words.length;
    if (diversityRatio < 0.3 && words.length > 8) {
        return {
            isValid: false,
            message: 'El texto es muy repetitivo. Usa más variedad de palabras'
        };
    }

    return { isValid: true, message: '' };
}

// Verificar palabras repetidas consecutivas
function hasConsecutiveRepeatedWords(words) {
    for (let i = 0; i < words.length - 1; i++) {
        if (words[i] === words[i + 1] && words[i].length > 2) {
            return true;
        }
    }
    return false;
}

// Verificar caracteres repetidos excesivos
function hasExcessiveRepeatedCharacters(text) {
    // Patrones de caracteres repetidos (4 o más del mismo carácter consecutivo)
    const repeatPattern = /(.)\1{3,}/;
    return repeatPattern.test(text);
}

// Verificar palabras sin sentido
function hasNonsenseWords(words) {
    const nonsensePatterns = [
        /^[^aeiou]{4,}$/i, // Palabras sin vocales de 4+ caracteres
        /^[a-z]{1,2}$/i,   // Palabras muy cortas (1-2 letras) repetidas
        /^[aeiou]{4,}$/i,  // Solo vocales repetidas
        /^[bcdfghjklmnpqrstvwxyz]{4,}$/i // Solo consonantes
    ];

    let shortWordCount = 0;
    
    for (const word of words) {
        // Contar palabras muy cortas
        if (word.length <= 2) {
            shortWordCount++;
            if (shortWordCount > 3) {
                return true;
            }
        }

        // Verificar patrones sin sentido
        for (const pattern of nonsensePatterns) {
            if (pattern.test(word) && word.length >= 4) {
                return true;
            }
        }

        // Palabras con caracteres repetidos
        if (/(.)\1{2,}/.test(word) && word.length >= 4) {
            return true;
        }
    }

    return false;
}

// Mostrar error en campo
function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    formGroup.classList.remove('success');

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;

    formGroup.appendChild(errorElement);
}

// Limpiar error
function clearFieldError(formGroup) {
    formGroup.classList.remove('error', 'success');

    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Validar formulario completo
function validateForm() {
    const form = document.getElementById('solicitudForm');
    const motivo = form.querySelector('select[name="motivo"]');
    const codigoMaquina = form.querySelector('input[name="codigoMaquina"]');
    const descripcion = form.querySelector('textarea[name="descripcion"]');

    let isValid = true;

    // Validar motivo
    if (!validateMotivo({ target: motivo })) {
        isValid = false;
    }

    // Validar código máquina
    if (!validateCodigoMaquina({ target: codigoMaquina })) {
        isValid = false;
    }

    // Validar descripción
    if (!validateDescriptionRealTime({ target: descripcion })) {
        isValid = false;
    }

    return isValid;
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

        // Validar contenido cargado
        setTimeout(() => {
            validateDescriptionRealTime({ target: textarea });
        }, 100);
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

// Envío del formulario
function initFormSubmission() {
    const form = document.getElementById('solicitudForm');

    form.addEventListener('submit', function (event) {
        console.log('🔵 Formulario enviado - validando...');

        if (!validateForm()) {
            console.log('❌ Validación fallida');
            event.preventDefault();
            showNotification('Por favor corrige los errores en el formulario', 'error');
            
            // Enfocar el primer campo con error
            const firstError = form.querySelector('.error');
            if (firstError) {
                const input = firstError.querySelector('input, select, textarea');
                if (input) input.focus();
            }
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

// Enviar formulario
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