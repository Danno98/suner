document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // 1. SMOOTH SCROLLING Y NAVEGACIÓN
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                // Cerrar navbar en móvil
                const navbarCollapse = document.querySelector('.navbar-collapse.show');
                if (navbarCollapse) new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });

    // =============================================
    // 2. EFECTOS DE SCROLL
    // =============================================
    window.addEventListener('scroll', function() {
        // Barra de navegación
        document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 100);
        
        // Animaciones
        document.querySelectorAll('[data-animate]').forEach(element => {
            if (element.getBoundingClientRect().top < window.innerHeight / 1.3) {
                element.classList.add('animated');
            }
        });
    });
    // Trigger inicial
    window.dispatchEvent(new Event('scroll'));

    // =============================================
    // 3. MODAL DE PROYECTOS
    // =============================================
    const proyectoModal = document.getElementById('proyectoModal');
    if (proyectoModal) {
        proyectoModal.addEventListener('show.bs.modal', function(e) {
            document.getElementById('modalProyectoImg').src = e.relatedTarget.getAttribute('data-bs-img');
        });
    }

    // =============================================
    // 4. FORMULARIO WHATSAPP (SOLUCIÓN COMPLETA)
    // =============================================
    const formCotizacion = document.getElementById('formCotizacion');
    if (formCotizacion) {
        formCotizacion.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Configuración
            const numeroWhatsApp = '528140118983'; // ¡CAMBIA ESTO!
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Estado de carga
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Preparando...';
            submitBtn.disabled = true;
            
            // Obtener datos
            const formData = {
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                servicio: document.getElementById('servicio').value,
                mensaje: document.getElementById('mensaje').value,
                email: document.getElementById('email')?.value || 'No proporcionado'
            };
            
            // Formatear mensaje
            const mensaje = `*Nueva Cotización SUNER*%0A%0A` +
                          `*Nombre:* ${formData.nombre}%0A` +
                          `*Teléfono:* ${formData.telefono}%0A` +
                          `*Email:* ${formData.email}%0A` +
                          `*Servicio:* ${formData.servicio}%0A%0A` +
                          `*Mensaje:*%0A${formData.mensaje}`;
            
            // Detección de dispositivo
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // Estrategia de envío
            if (isMobile) {
                // Móvil: Redirección directa
                window.location.href = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
            } else {
                // Desktop: Solución completa
                const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensaje}`;
                const fallbackHTML = `
                    <div class="alert alert-info alert-dismissible fade show mt-3" role="alert">
                        <h5 class="alert-heading">¡Sigue estos pasos!</h5>
                        <ol>
                            <li><a href="${whatsappWebUrl}" target="_blank">Abrir WhatsApp Web</a></li>
                            <li>Pega este mensaje automático:</li>
                        </ol>
                        <textarea class="form-control my-2" rows="6" onclick="this.select()">${decodeURIComponent(mensaje.replace(/%0A/g, '\n'))}</textarea>
                        <button class="btn btn-success btn-sm" onclick="navigator.clipboard.writeText(this.previousElementSibling.value)">
                            <i class="fas fa-copy me-2"></i>Copiar mensaje
                        </button>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                
                // Intentar apertura automática
                const whatsappWindow = window.open(whatsappWebUrl, '_blank');
                
                // Plan B si falla (ej: bloqueadores de ventanas emergentes)
                setTimeout(() => {
                    if (!whatsappWindow || whatsappWindow.closed) {
                        const alertDiv = document.createElement('div');
                        alertDiv.innerHTML = fallbackHTML;
                        formCotizacion.parentNode.insertBefore(alertDiv, formCotizacion.nextSibling);
                    }
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
            }
            
            // Guardar datos localmente
            localStorage.setItem('datosCotizacion', JSON.stringify(formData));
        });
    }

    // Recuperar datos del formulario
    const savedData = localStorage.getItem('datosCotizacion');
    if (savedData && formCotizacion) {
        const datos = JSON.parse(savedData);
        Object.keys(datos).forEach(key => {
            const field = document.getElementById(key);
            if (field && datos[key] !== 'No proporcionado') field.value = datos[key];
        });
        localStorage.removeItem('datosCotizacion');
    }

    // =============================================
    // 5. CONTADORES ANIMADOS
    // =============================================
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animate = (counter, target, speed) => {
                        const count = +counter.innerText;
                        if (count < target) {
                            counter.innerText = Math.ceil(count + target/speed);
                            setTimeout(() => animate(counter, target, speed), 1);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    animate(entry.target, +entry.target.getAttribute('data-target'), 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
});