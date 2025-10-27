// mantenimiento_validation.js - Validaciones en tiempo real para el formulario de mantenimientos
class MantenimientoValidation {
    constructor() {
        this.form = document.querySelector('.assign-form');
        this.fields = {
            maquinaId: document.querySelector('select[name="maquinaId"]'),
            tecnicoId: document.querySelector('select[name="tecnicoId"]'),
            tipo: document.querySelector('select[name="tipo"]'),
            programadoPara: document.querySelector('input[name="programadoPara"]'),
            descripcion: document.querySelector('textarea[name="descripcion"]')
        };

        // Contador para evitar duplicados
        this.errorCounters = new Map();

        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupEventListeners();
        this.setMinDate();
    }

    setupEventListeners() {
        // Validación en tiempo real para campos requeridos
        this.fields.maquinaId.addEventListener('change', () => this.validateRequired(this.fields.maquinaId));
        this.fields.tecnicoId.addEventListener('change', () => this.validateRequired(this.fields.tecnicoId));
        this.fields.tipo.addEventListener('change', () => this.validateRequired(this.fields.tipo));

        // Validación para fecha
        this.fields.programadoPara.addEventListener('change', () => this.validateDate(this.fields.programadoPara));
        this.fields.programadoPara.addEventListener('input', () => this.validateDate(this.fields.programadoPara));

        // Validación para descripción (en tiempo real mientras escribe)
        this.fields.descripcion.addEventListener('input', () => this.validateDescription(this.fields.descripcion));
        this.fields.descripcion.addEventListener('blur', () => this.validateDescription(this.fields.descripcion));

        // Validación antes de enviar el formulario
        this.form.addEventListener('submit', (e) => this.validateForm(e));
    }

    setMinDate() {
        // Establecer la fecha mínima como hoy
        const today = new Date().toISOString().split('T')[0];
        this.fields.programadoPara.min = today;
    }

    validateRequired(field) {
        const value = field.value.trim();
        const isValid = value !== '' && value !== null && value !== undefined;

        this.updateFieldError(field, !isValid, 'Este campo es requerido');
        return isValid;
    }

    validateDate(field) {
        const value = field.value.trim();

        if (value === '') {
            this.updateFieldError(field, false, '');
            return true; // La fecha es opcional
        }

        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset hours to compare only dates

        let errorMessage = '';
        let isValid = true;

        if (selectedDate < today) {
            errorMessage = 'La fecha no puede ser anterior al día actual';
            isValid = false;
        }

        // Validar formato de fecha
        if (value && isNaN(selectedDate.getTime())) {
            errorMessage = 'Formato de fecha inválido';
            isValid = false;
        }

        this.updateFieldError(field, !isValid, errorMessage);
        return isValid;
    }

    validateDescription(field) {
        const value = field.value.trim();

        if (value === '') {
            this.updateFieldError(field, false, '');
            return true; // La descripción es opcional
        }

        let errorMessage = '';
        let isValid = true;

        // Validar longitud mínima
        if (value.length < 5) {
            errorMessage = 'La descripción debe tener al menos 5 caracteres';
            isValid = false;
        }
        // Validar palabras sin sentido (solo consonantes)
        else if (this.hasOnlyConsonants(value)) {
            errorMessage = 'La descripción contiene palabras sin sentido (solo consonantes)';
            isValid = false;
        }
        // Validar palabras sin sentido (solo vocales)
        else if (this.hasOnlyVowels(value)) {
            errorMessage = 'La descripción contiene palabras sin sentido (solo vocales)';
            isValid = false;
        }
        // Validar caracteres repetitivos
        else if (this.hasRepeatingCharacters(value)) {
            errorMessage = 'La descripción contiene patrones repetitivos';
            isValid = false;
        }
        // Validar palabras repetitivas
        else if (this.hasRepeatingWords(value)) {
            errorMessage = 'La descripción contiene palabras repetitivas';
            isValid = false;
        }
        // Validar texto sin sentido (sin espacios ni puntuación)
        else if (this.hasNoSpaces(value)) {
            errorMessage = 'La descripción debe contener texto con sentido';
            isValid = false;
        }

        this.updateFieldError(field, !isValid, errorMessage);
        return isValid;
    }

    // Métodos de validación específicos para descripción
    hasOnlyConsonants(text) {
        const words = text.split(/\s+/);
        return words.some(word => {
            if (word.length < 3) return false; // Ignorar palabras cortas
            const consonantsOnly = /^[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]+$/;
            return consonantsOnly.test(word);
        });
    }

    hasOnlyVowels(text) {
        const words = text.split(/\s+/);
        return words.some(word => {
            if (word.length < 3) return false; // Ignorar palabras cortas
            const vowelsOnly = /^[aeiouAEIOU]+$/;
            return vowelsOnly.test(word);
        });
    }

    hasRepeatingCharacters(text) {
        // Detectar patrones como "ccccccc", "alalalala", etc.
        const repeatingPatterns = [
            /(.)\1{4,}/, // Mismo carácter repetido 5+ veces
            /(..)\1{3,}/, // Patrón de 2 caracteres repetido 4+ veces
            /(...)\1{2,}/ // Patrón de 3 caracteres repetido 3+ veces
        ];

        return repeatingPatterns.some(pattern => pattern.test(text));
    }

    hasRepeatingWords(text) {
        const words = text.toLowerCase().split(/\s+/);
        const wordCount = {};

        for (const word of words) {
            if (word.length >= 3) { // Solo considerar palabras de 3+ letras
                wordCount[word] = (wordCount[word] || 0) + 1;
                if (wordCount[word] >= 3) {
                    return true; // Palabra repetida 3+ veces
                }
            }
        }
        return false;
    }

    hasNoSpaces(text) {
        // Si el texto es muy largo pero no tiene espacios ni puntuación
        if (text.length > 20 && !/\s/.test(text) && !/[.,!?;:]/.test(text)) {
            return true;
        }

        // Verificar si hay suficiente diversidad de caracteres
        const uniqueChars = new Set(text.replace(/\s/g, ''));
        return uniqueChars.size < 5 && text.length > 15;
    }

    updateFieldError(field, showError, message) {
        const fieldName = field.getAttribute('name');
        const currentCounter = this.errorCounters.get(fieldName) || 0;

        // Solo actualizar si el mensaje cambió
        const existingError = field.parentNode.querySelector('.field-error');
        const currentMessage = existingError ? existingError.textContent : '';

        if (currentMessage === message && existingError) {
            return; // No hacer nada si el mensaje es el mismo
        }

        // Remover errores existentes
        this.removeFieldError(field);

        if (showError && message) {
            this.showFieldError(field, message);
            field.classList.add('error');
            field.classList.remove('valid');
            this.errorCounters.set(fieldName, currentCounter + 1);
        } else {
            field.classList.remove('error');
            field.classList.add('valid');
            this.errorCounters.set(fieldName, 0);

            // Remover clase valid después de un tiempo
            setTimeout(() => {
                if (field.classList.contains('valid')) {
                    field.classList.remove('valid');
                }
            }, 2000);
        }
    }

    showFieldError(field, message) {
        // Verificar si ya existe un error para este campo
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.innerHTML = `
            <i class="bi bi-exclamation-circle" style="font-size: 0.9rem;"></i>
            <span>${message}</span>
        `;

        field.parentNode.appendChild(errorElement);

        // Animación de entrada
        setTimeout(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        }, 10);
    }

    removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            // Animación de salida
            existingError.style.opacity = '0';
            existingError.style.transform = 'translateY(-5px)';

            setTimeout(() => {
                if (existingError.parentNode) {
                    existingError.remove();
                }
            }, 300);
        }
    }

    validateForm(e) {
        let isValid = true;

        // Validar campos requeridos
        isValid = this.validateRequired(this.fields.maquinaId) && isValid;
        isValid = this.validateRequired(this.fields.tecnicoId) && isValid;
        isValid = this.validateRequired(this.fields.tipo) && isValid;

        // Validar fecha (si se proporcionó)
        if (this.fields.programadoPara.value.trim() !== '') {
            isValid = this.validateDate(this.fields.programadoPara) && isValid;
        }

        // Validar descripción (si se proporcionó)
        if (this.fields.descripcion.value.trim() !== '') {
            isValid = this.validateDescription(this.fields.descripcion) && isValid;
        }

        if (!isValid) {
            e.preventDefault();
            this.showFormError('Por favor, corrige los errores en el formulario antes de enviar.');

            // Hacer scroll al primer error
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }

        return isValid;
    }

    showFormError(message) {
        // Remover mensaje de error existente
        this.removeFormError();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error form-submit-error';
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
        this.form.parentNode.insertBefore(errorDiv, this.form);

        // Configurar botón de cierre
        const closeBtn = errorDiv.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => this.removeFormError());

        // Auto-eliminar después de 5 segundos
        setTimeout(() => this.removeFormError(), 5000);
    }

    removeFormError() {
        const existingError = document.querySelector('.form-submit-error');
        if (existingError) {
            existingError.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (existingError.parentNode) {
                    existingError.remove();
                }
            }, 300);
        }
    }

    // Método para resetear todas las validaciones
    resetValidations() {
        Object.values(this.fields).forEach(field => {
            this.removeFieldError(field);
            field.classList.remove('error', 'valid');
        });
        this.removeFormError();
        this.errorCounters.clear();
    }
}

// Estilos CSS adicionales para las validaciones
const validationStyles = `
    .form-select.error,
    .form-input.error,
    .form-textarea.error {
        border-color: #ff6b6b !important;
        box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1) !important;
        background: rgba(255, 107, 107, 0.05) !important;
    }
    
    .form-select.valid,
    .form-input.valid,
    .form-textarea.valid {
        border-color: #51cf66 !important;
        box-shadow: 0 0 0 3px rgba(81, 207, 102, 0.1) !important;
    }
    
    .field-error {
        color: #ff6b6b;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        opacity: 0;
        transform: translateY(-5px);
        transition: all 0.3s ease-out;
    }
    
    .form-group {
        position: relative;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .alert.form-submit-error {
        background: rgba(255, 107, 107, 0.1) !important;
        border-color: #ff6b6b !important;
        color: #ff6b6b !important;
    }
    
    /* Efecto de carga para el botón de enviar */
    .btn-submit.loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .btn-submit.loading i {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Agregar estilos de validación
    const styleSheet = document.createElement('style');
    styleSheet.textContent = validationStyles;
    document.head.appendChild(styleSheet);

    // Inicializar el sistema de validación
    new MantenimientoValidation();

    console.log('Sistema de validación de mantenimientos inicializado');
});

// También hacer disponible globalmente por si se necesita acceder desde la consola
window.MantenimientoValidation = MantenimientoValidation;