// Funcionalidades para la página de máquinas
class MaquinasManager {
    constructor() {
        this.modal = document.getElementById('machineModal');
        this.modalBody = document.getElementById('modalBody');
        this.modalTitle = document.getElementById('modalTitle');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAnimations();
        this.setupMachineCards();
    }

    setupEventListeners() {
        // Cerrar modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());

        // Cerrar modal al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    setupAnimations() {
        // Animación de entrada para las tarjetas
        const cards = document.querySelectorAll('.machine-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // Efecto de pulso en el botón de crear
        const createBtn = document.querySelector('.btn-create');
        if (createBtn) {
            setInterval(() => {
                createBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
                setTimeout(() => {
                    createBtn.style.boxShadow = 'none';
                }, 1000);
            }, 5000);
        }
    }

    setupMachineCards() {
        const cards = document.querySelectorAll('.machine-card');

        cards.forEach(card => {
            // Efecto de elevación al hover
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });

            // Click en toda la tarjeta (excepto botones)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-view') && !e.target.closest('.btn-delete')) {
                    const machineId = card.getAttribute('data-machine');
                    this.openMachineModal(machineId);
                }
            });
        });
    }

    async openMachineModal(machineId) {
        this.showLoadingState();
        this.showModal();

        try {
            const machineData = await this.fetchMachineData(machineId);
            this.populateModal(machineData);
        } catch (error) {
            this.showErrorState('Error al cargar los datos de la máquina');
            console.error('Error fetching machine data:', error);
        }
    }

    async fetchMachineData(machineId) {
        // Usar la ruta correcta: /admin/maquinas/{id}/detalles
        const response = await fetch(`/admin/maquinas/${machineId}/detalles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        return await response.json();
    }

    populateModal(data) {
        this.modalTitle.textContent = data.nombre;

        // Obtener el token CSRF del formulario existente
        const csrfToken = document.querySelector('input[name="_csrf"]')?.value || '';

        this.modalBody.innerHTML = `
        <div class="modal-grid">
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="bi bi-info-circle"></i> Información General
                </h3>
                <div class="modal-info-grid">
                    <div class="info-item">
                        <span class="info-label">ID:</span>
                        <span class="info-value">${data.id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Código:</span>
                        <span class="info-value code-value">${data.codigo}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value">${data.nombre}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Tipo:</span>
                        <span class="info-value type-value">${data.tipo}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Condición:</span>
                        <span class="info-value condition-value ${data.condicion === 'NUEVA' ? 'status-new' : 'status-used'}">${data.condicion}</span>
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <form action="/admin/maquinas/${data.id}/eliminar" method="post" class="inline-form">
                    <input type="hidden" name="page" value="0">
                    <input type="hidden" name="size" value="10">
                    <input type="hidden" name="tipo" value="">
                    <input type="hidden" name="cond" value="">
                    <input type="hidden" name="_csrf" value="${csrfToken}">
                    <button type="submit" class="btn-modal btn-danger" onclick="return confirm('¿Estás seguro de que quieres eliminar esta máquina? Esta acción no se puede deshacer.')">
                        <i class="bi bi-trash"></i> Eliminar Máquina
                    </button>
                </form>
            </div>
        </div>
    `;
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }

    showLoadingState() {
        this.modalBody.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Cargando información de la máquina...</p>
            </div>
        `;
    }

    showErrorState(message) {
        this.modalBody.innerHTML = `
            <div class="error-state">
                <div class="error-icon">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
                <h3>Error</h3>
                <p>${message}</p>
                <button class="btn-modal btn-primary" onclick="this.closest('.modal').querySelector('.modal-close').click()">
                    <i class="bi bi-arrow-left"></i> Volver
                </button>
            </div>
        `;
    }

    showModal() {
        this.modal.style.display = 'flex';
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
    }

    closeModal() {
        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
        }, 300);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new MaquinasManager();
});

// Función global para abrir modal desde HTML
window.openMachineModal = function (machineId) {
    const manager = new MaquinasManager();
    manager.openMachineModal(machineId);
};