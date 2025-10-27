// Funcionalidades interactivas para el panel de técnico
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar componentes
    initStatsAnimation();
    initParticles();
    initVisualEffects();
    initRealTimeUpdates();
});

// Animación de contadores en las estadísticas
function initStatsAnimation() {
    const statValues = document.querySelectorAll('.stat-value');

    statValues.forEach(stat => {
        const target = parseInt(stat.textContent);
        if (isNaN(target)) return;

        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, stepTime);
    });
}

// Efectos de partículas en el fondo
function initParticles() {
    const container = document.body;
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Posición aleatoria
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;

    // Tamaño aleatorio
    const size = Math.random() * 3 + 1;

    // Duración de animación aleatoria
    const duration = Math.random() * 20 + 10;

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

// Efectos visuales adicionales
function initVisualEffects() {
    // Efecto de escritura para el título
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        const originalText = pageTitle.textContent;
        pageTitle.textContent = '';

        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                pageTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };

        setTimeout(typeWriter, 500);
    }

    // Efecto de brillo al pasar el cursor sobre las tarjetas
    const cards = document.querySelectorAll('.stat-card, .access-card, .recent-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Efecto hover para items recientes
    const recentItems = document.querySelectorAll('.recent-item');
    recentItems.forEach(item => {
        item.addEventListener('click', function () {
            const mttoId = this.getAttribute('data-mtto-id');
            if (mttoId) {
                window.location.href = `/tecnico/mios#mtto-${mttoId}`;
            }
        });
    });
}

// Actualizaciones en tiempo real (cada 30 segundos)
function initRealTimeUpdates() {
    setInterval(() => {
        fetch('/tecnico/api/stats')
            .then(response => response.json())
            .then(data => {
                updateStats(data);
            })
            .catch(error => console.log('Error actualizando stats:', error));
    }, 30000);
}

// Actualizar estadísticas
function updateStats(data) {
    const pendientes = document.getElementById('statPendientes');
    const enProceso = document.getElementById('statEnProceso');
    const completados = document.getElementById('statCompletados');

    if (pendientes && data.pendientes !== undefined) {
        animateValueChange(pendientes, parseInt(pendientes.textContent), data.pendientes);
    }
    if (enProceso && data.enProceso !== undefined) {
        animateValueChange(enProceso, parseInt(enProceso.textContent), data.enProceso);
    }
    if (completados && data.completados !== undefined) {
        animateValueChange(completados, parseInt(completados.textContent), data.completados);
    }
}

// Animación suave de cambio de valores
function animateValueChange(element, start, end) {
    const duration = 1000;
    const steps = 60;
    const stepValue = (end - start) / steps;
    const stepTime = duration / steps;

    let current = start;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        current += stepValue;

        if (step >= steps) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, stepTime);
}

// Agregar estilos CSS adicionales para efectos
const additionalStyles = `
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
    
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* Estados de mantenimiento */
    .status-pendiente {
        background: #fef3c7;
        color: #d97706;
    }

    .status-en_proceso {
        background: #dbeafe;
        color: #1d4ed8;
    }

    .status-completado {
        background: #dcfce7;
        color: #15803d;
    }

    .status-en_espera {
        background: #f3e8ff;
        color: #7e22ce;
    }

    .status-falta_repuestos {
        background: #fecaca;
        color: #dc2626;
    }

    .recent-item {
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .recent-item:hover {
        background: #f8fafc;
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);