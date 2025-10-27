class UserValidator {
    constructor() {
        this.form = document.getElementById('usuarioForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.fields = ['nombre', 'email', 'password', 'rol'];
        this.errors = {};

        this.init();
    }

    init() {
        // Validación en tiempo real para cada campo
        this.fields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', () => this.validateField(field));
                input.addEventListener('blur', () => this.validateField(field));
            }
        });

        // Validar formulario completo al enviar
        this.form.addEventListener('submit', (e) => this.validateForm(e));

        // Validación inicial
        this.updateSubmitButton();
    }

    validateField(field) {
        const value = document.getElementById(field).value.trim();
        let isValid = true;
        let message = '';

        switch (field) {
            case 'nombre':
                isValid = this.validateNombre(value);
                if (!isValid) {
                    message = 'Nombre no válido. Debe ser coherente y sin repeticiones extrañas.';
                }
                break;

            case 'email':
                isValid = this.validateEmail(value);
                if (!isValid) {
                    message = 'Email no válido. Debe ser del dominio @taesmet.com y coherente.';
                }
                break;

            case 'password':
                isValid = this.validatePassword(value);
                if (!isValid) {
                    message = 'La contraseña debe tener 8-15 caracteres con minúscula, mayúscula, dígito y carácter especial.';
                }
                this.updatePasswordStrength(value);
                break;

            case 'rol':
                isValid = this.validateRol(value);
                if (!isValid) {
                    message = 'Selecciona un rol válido.';
                }
                break;
        }

        this.setFieldState(field, isValid, message);
        this.updateSubmitButton();
    }

    validateNombre(nombre) {
        if (!nombre) return false;
        if (nombre.length < 2 || nombre.length > 60) return false;

        // Solo letras, espacios y acentos
        if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(nombre)) return false;

        // No permite solo consonantes (mínimo 40% vocales)
        const vowels = (nombre.match(/[aeiouáéíóú]/gi) || []).length;
        const consonants = (nombre.match(/[bcdfghjklmnñpqrstvwxyz]/gi) || []).length;
        if (vowels === 0 || vowels / (vowels + consonants) < 0.4) return false;

        // No permite solo vocales (mínimo 40% consonantes)
        if (consonants === 0 || consonants / (vowels + consonants) < 0.4) return false;

        // No permite repeticiones de caracteres (más de 3 veces seguidas)
        if (/(.)\1{3,}/.test(nombre)) return false;

        // No permite palabras sin sentido (patrones de teclado)
        const keyboardPatterns = [
            /qwerty/i, /asdfgh/i, /zxcvbn/i, /qazwsx/i,
            /123456/i, /abcdef/i
        ];
        if (keyboardPatterns.some(pattern => pattern.test(nombre))) return false;

        // No permite repetición de la primera palabra completa
        const words = nombre.toLowerCase().split(/\s+/);
        if (words.length >= 2 && words[0] === words[1]) return false;

        // No permite secuencias alfabéticas (abc, xyz, etc.)
        if (this.hasAlphabeticalSequence(nombre)) return false;

        // No permite patrones repetitivos excesivos, SOLO permite "Pepe" como excepción
        if (this.hasExcessiveRepetition(nombre)) return false;

        return true;
    }

    validateEmail(email) {
        if (!email) return false;

        // Formato básico taesmet.com - PERMITE NÚMEROS después de al menos 2 letras
        const basicPattern = /^[A-Za-z]{2,}(?:[._-]?[A-Za-z0-9]+)*@taesmet\.com$/;
        if (!basicPattern.test(email)) return false;

        const localPart = email.split('@')[0].toLowerCase();

        // No permite solo números - debe tener al menos una letra
        if (!/[a-z]/.test(localPart)) return false;

        // No permite solo consonantes (mínimo 30% vocales)
        const vowels = (localPart.match(/[aeiou]/g) || []).length;
        const consonants = (localPart.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length;
        const numbers = (localPart.match(/[0-9]/g) || []).length;
        const totalChars = localPart.length;

        // Calcula el porcentaje de vocales respecto a letras (excluyendo números)
        const totalLetters = vowels + consonants;
        if (totalLetters > 0 && vowels / totalLetters < 0.3) return false;

        // No permite solo números y consonantes sin vocales
        if (vowels === 0 && totalLetters > 0) return false;

        // No permite repeticiones excesivas
        if (/(.)\1{3,}/.test(localPart)) return false;

        // No permite patrones de teclado
        const keyboardPatterns = [
            /qwerty/i, /asdfgh/i, /zxcvbn/i, /qazwsx/i,
            /123456/i, /abcdef/i
        ];
        if (keyboardPatterns.some(pattern => pattern.test(localPart))) return false;

        // No permite secuencias alfabéticas
        if (this.hasAlphabeticalSequence(localPart)) return false;

        // No permite patrones repetitivos excesivos
        if (this.hasExcessiveRepetition(localPart)) return false;

        return true;
    }

    validatePassword(password) {
        if (!password) return false;
        if (password.length < 8 || password.length > 15) return false;

        // Debe contener: minúscula, mayúscula, dígito, carácter especial
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecial = /[^\w\s]/.test(password);

        return hasLower && hasUpper && hasDigit && hasSpecial;
    }

    validateRol(rol) {
        return !!rol; // No vacío
    }

    hasAlphabeticalSequence(text) {
        const sequences = ['abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk',
            'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst',
            'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz'];
        const lowerText = text.toLowerCase();
        return sequences.some(seq => lowerText.includes(seq));
    }

    hasExcessiveRepetition(text) {
        const lowerText = text.toLowerCase();

        // SOLO "pepe" está permitido como excepción
        const allowedNames = ['pepe'];

        // Si es exactamente "pepe", lo permitimos
        if (allowedNames.includes(lowerText)) {
            return false;
        }

        // Patrones que indican repetición excesiva (incluyendo "lala", "meme", etc.)
        const excessivePatterns = [
            // Patrones de 3+ repeticiones de la misma sílaba
            /(.)\1{2,}(.)\2{2,}/i,    // lalalala, nananana
            /(..)\1{2,}/i,            // lalalala (captura "la" repetida)
            /(...)\1{2,}/i,           // lalalala (captura "lal" repetida)

            // Patrones específicos problemáticos - INCLUYENDO lala, meme, coco, etc.
            /lala/i, /nanana/i, /tatata/i, /bababa/i, /mamama/i, /papapa/i,
            /alalal/i, /ananan/i, /atata/i, /ababa/i, /amama/i, /apapa/i,
            /meme/i, /coco/i, /lolo/i, /nene/i, /toto/i, /papa/i, /mama/i,
            /bebe/i, /didi/i, /fifi/i, /gigi/i, /kiki/i, /lili/i, /mimi/i,
            /nini/i, /pipi/i, /riri/i, /sisi/i, /titi/i, /vivi/i, /zizi/i,
            /chichi/i, /jojo/i, /yoyo/i,

            // Cualquier sílaba de 2-3 letras repetida 2+ veces (excepto "pepe")
            /(\w{2,3})\1{1,}/i
        ];

        // Verificar si el texto consiste principalmente en repeticiones
        const words = lowerText.split(/\s+/);
        for (let word of words) {
            // Si una palabra tiene más del 70% de caracteres repetitivos
            if (word.length >= 4) {
                const uniqueChars = new Set(word);
                if (uniqueChars.size / word.length < 0.4) {
                    return true;
                }
            }

            // Verificar patrones excesivos
            if (excessivePatterns.some(pattern => pattern.test(word))) {
                // Solo permitir si es exactamente "pepe"
                if (word === 'pepe') {
                    continue;
                }
                return true;
            }

            // Detectar palabras con estructura A-B-A-B o similar
            if (word.length >= 4) {
                // Patrón ABAB
                if (word.length === 4 && word[0] === word[2] && word[1] === word[3]) {
                    if (word !== 'pepe') {
                        return true;
                    }
                }
                // Patrón ABCABC
                if (word.length === 6 && word[0] === word[3] && word[1] === word[4] && word[2] === word[5]) {
                    return true;
                }
            }
        }

        return false;
    }

    updatePasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');

        if (!password) {
            strengthFill.className = 'strength-fill';
            strengthText.className = 'strength-text';
            strengthText.textContent = 'Seguridad';
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^\w\s]/.test(password)) strength++;

        if (strength <= 2) {
            strengthFill.className = 'strength-fill weak';
            strengthText.className = 'strength-text weak';
            strengthText.textContent = 'Débil';
        } else if (strength <= 4) {
            strengthFill.className = 'strength-fill medium';
            strengthText.className = 'strength-text medium';
            strengthText.textContent = 'Media';
        } else {
            strengthFill.className = 'strength-fill strong';
            strengthText.className = 'strength-text strong';
            strengthText.textContent = 'Fuerte';
        }
    }

    setFieldState(field, isValid, message) {
        const input = document.getElementById(field);
        const errorElement = document.getElementById(field + 'Error');

        if (isValid) {
            input.classList.add('valid');
            input.classList.remove('invalid');
            errorElement.classList.remove('show');
            delete this.errors[field];
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
            errorElement.textContent = message;
            errorElement.classList.add('show');
            this.errors[field] = message;
        }
    }

    updateSubmitButton() {
        const allValid = this.fields.every(field => {
            const input = document.getElementById(field);
            return input && !this.errors[field] && input.value.trim();
        });

        this.submitBtn.disabled = !allValid;
    }

    validateForm(e) {
        // Validar todos los campos antes de enviar
        this.fields.forEach(field => this.validateField(field));

        if (Object.keys(this.errors).length > 0) {
            e.preventDefault();

            // Mostrar primer error
            const firstErrorField = Object.keys(this.errors)[0];
            const firstErrorElement = document.getElementById(firstErrorField);
            firstErrorElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            firstErrorElement.focus();

            // Efecto de shake en el formulario
            this.form.style.animation = 'none';
            setTimeout(() => {
                this.form.style.animation = 'shake 0.5s ease-in-out';
            }, 10);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new UserValidator();
});

// Animación shake para errores
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);