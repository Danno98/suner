document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Cerrar navbar mobile al hacer clic
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
    
    // Efecto de scroll para la barra de navegación
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Animaciones al hacer scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('[data-animate]');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Ejecutar al cargar la página
    
    // Modal para proyectos
    const proyectoModal = document.getElementById('proyectoModal');
    if (proyectoModal) {
        proyectoModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const imgSrc = button.getAttribute('data-bs-img');
            const modalImg = document.getElementById('modalProyectoImg');
            modalImg.src = imgSrc;
        });
    }
    
    // Manejo del formulario de cotización
    const formCotizacion = document.getElementById('formCotizacion');
    if (formCotizacion) {
        formCotizacion.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulación de envío exitoso
            const nombre = document.getElementById('nombre').value;
            const servicio = document.getElementById('servicio').value;
            
            // Mostrar alerta de éxito
            const alertHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>¡Gracias, ${nombre}!</strong> Hemos recibido tu solicitud de cotización para <strong>${servicio}</strong>. Nos pondremos en contacto contigo en breve.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            const alertPlaceholder = document.createElement('div');
            alertPlaceholder.innerHTML = alertHTML;
            formCotizacion.parentNode.insertBefore(alertPlaceholder, formCotizacion);
            
            // Desplazarse al alerta
            window.scrollTo({
                top: alertPlaceholder.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Limpiar el formulario
            formCotizacion.reset();
            
            // Opcional: Enviar datos a un servidor
            // const formData = new FormData(formCotizacion);
            // fetch('url-del-servidor', { method: 'POST', body: formData });
        });
    }
    
    // Contador animado
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    if (counters.length > 0) {
        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(animateCounters, 1);
                } else {
                    counter.innerText = target;
                }
            });
        };
        
        // Activar cuando la sección es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            observer.observe(counter.parentElement);
        });
    }
});