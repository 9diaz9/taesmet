// Efecto de escritura para el título
document.addEventListener('DOMContentLoaded', function () {
    const title = document.querySelector('.title');
    const originalText = title.textContent;
    title.textContent = '';

    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    setTimeout(typeWriter, 500);

    // Efectos hover para botones
    const buttons = document.querySelectorAll('.btn-interactive');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });

        // Efecto click
        button.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(1px)';
        });

        button.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-3px)';
        });
    });

    // Efecto ripple al hacer click
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            // Color según tipo de botón
            if (this.classList.contains('btn-primary')) {
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            } else if (this.classList.contains('btn-secondary')) {
                ripple.style.background = 'rgba(100, 255, 218, 0.4)';
            } else {
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            }

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Animación de entrada para elementos
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Aplicar animación a botones y footer
    const animatedElements = document.querySelectorAll('.btn-interactive, footer');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Efecto de brillo en tarjeta al mover mouse
    const cardPanel = document.querySelector('.card-panel');

    cardPanel.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--mouse-x', `${x}px`);
        this.style.setProperty('--mouse-y', `${y}px`);
    });
});