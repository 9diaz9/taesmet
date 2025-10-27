// Efectos interactivos para el panel de líder
document.addEventListener('DOMContentLoaded', function () {
    // Efecto de escritura para el título de bienvenida
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
        const originalText = welcomeTitle.textContent;
        welcomeTitle.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                welcomeTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };

        // Iniciar efecto después de un breve retraso
        setTimeout(typeWriter, 500);
    }

    // Efecto de conteo para las estadísticas
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50; // Dividir en 50 pasos

        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                setTimeout(updateCount, 30);
            } else {
                stat.textContent = target;
            }
        };

        // Iniciar cuando el elemento es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(stat);
    });

    // Efecto de partículas en el fondo
    createParticles();

    // Efecto de sonido al hacer hover en las tarjetas (opcional)
    const cards = document.querySelectorAll('.option-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Agregar clase para efecto visual adicional
            card.classList.add('card-hover-active');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('card-hover-active');
        });
    });

    // Navegación suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Función para crear partículas en el fondo
function createParticles() {
    const container = document.body;
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Posición aleatoria
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        // Tamaño aleatorio
        const size = Math.random() * 4 + 1;

        // Duración de animación aleatoria
        const duration = Math.random() * 20 + 10;

        // Establecer estilos
        particle.style.cssText = `
            position: fixed;
            top: ${posY}vh;
            left: ${posX}vw;
            width: ${size}px;
            height: ${size}px;
            background: rgba(100, 255, 218, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            animation: float ${duration}s linear infinite;
        `;

        container.appendChild(particle);
    }

    // Agregar la animación de flotación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(20px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Efecto de modo oscuro/claro (opcional)
function toggleTheme() {
    document.body.classList.toggle('light-theme');

    // Guardar preferencia
    if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
}

// Cargar tema guardado
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// Inicializar tema al cargar
loadTheme();