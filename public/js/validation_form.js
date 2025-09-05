document.addEventListener('DOMContentLoaded', function() {

    // CAPTURAMOS EL ELEMENTO FORM CUANDO TERMINE DE RENDERIZAR LA PAGINA
    // RENDERERIZAR = CARGAR TOOO EL HTML
    /*---------------------------------
        Dede la linea 17 (entonces) hasta la 28
        estamos simplemente guardando los elementos html en variables
        para luego hacer uso de ellos segun la necesidad, por ejemplo
        al obtener el getElementById('nombre') estamos guardando
        el input del nombre en la variable nombre, para luego
        poder hacer uso de el en la funcion validarNombre()
        y mmm no se evitar que el usuario ponga numeros o caracteres 
        o nombres tontos o incluso mmmm intente hacer alguna 
        inyeccion xss que hemos visto en el track
    ---------------------------------
    */
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('success-message');
    
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono');
    const mensaje = document.getElementById('mensaje');
    
    const nombreError = document.getElementById('nombre-error');
    const emailError = document.getElementById('email-error');
    const telefonoError = document.getElementById('telefono-error');
    const mensajeError = document.getElementById('mensaje-error');
    
    /*---------------------------------
        LAS EXPRESIONES REGULARES SON PATRONES QUE NOS PERMITEN
        COMPARAR Y VALIDAR CADENAS DE TEXTO
        un patron simple podria ser /^abc$/ que solo acepta    
        solo acepta abc y nada mas (ni ABC, ni abcd, ni 123abc)
        entonce entendemos que un regex parte  y termina con / /
        y entre medio van los caracteres que queremos aceptar
        ^ = inicio de la cadena
        $ = fin de la cadena
        . = cualquier caracter
        * = cero o más veces
        + = una o más veces
        ? = cero o una vez
        \s = espacio en blanco
        \d = dígito (0-9)
        \w = carácter de palabra (letras, dígitos, guion bajo)
        [abc] = cualquiera de los caracteres a, b o c
        [a-z] = cualquier letra minúscula
        [A-Z] = cualquier letra mayúscula
        [0-9] = cualquier dígito
        {n} = exactamente n veces
        {n,} = al menos n veces
        {n,m} = entre n y m veces
         minitip pero siu buscai regex en google y repasas y experimentas
         vas a cachar que en general uno busca los genericos para email, telefonom nombre y evitar
         tambien inyecciones
         */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
    
    /** Las funciones en general se explican solas
     * trate de que fueran lo mas generericas posibles
     * para hacer uso de la reutilizacion de codigo
     * si hay dudas hablamo dps o se las tirai al chtgpt
     */
    function mostrarError(campo, errorElement, mensaje) {
        campo.parentNode.classList.add('error');
        campo.parentNode.classList.remove('success');
        errorElement.textContent = mensaje;
        return false;
    }
    
    function mostrarExito(campo, errorElement) {
        campo.parentNode.classList.remove('error');
        campo.parentNode.classList.add('success');
        errorElement.textContent = '';
        return true;
    }
    
    function validarNombre() {
        const valorNombre = nombre.value.trim();
        
        if (valorNombre === '') {
            return mostrarError(nombre, nombreError, 'El nombre es obligatorio');
        }
        
        if (valorNombre.length < 2) {
            return mostrarError(nombre, nombreError, 'El nombre debe tener al menos 2 caracteres');
        }
        
        if (valorNombre.length > 50) {
            return mostrarError(nombre, nombreError, 'El nombre no puede tener más de 50 caracteres');
        }
        
        if (!nombreRegex.test(valorNombre)) {
            return mostrarError(nombre, nombreError, 'El nombre solo puede contener letras y espacios');
        }
        
        return mostrarExito(nombre, nombreError);
    }
    
    function validarEmail() {
        const valorEmail = email.value.trim();
        
        if (valorEmail === '') {
            return mostrarError(email, emailError, 'El correo electrónico es obligatorio');
        }
        
        if (!emailRegex.test(valorEmail)) {
            return mostrarError(email, emailError, 'Por favor ingresa un correo electrónico válido');
        }
        
        return mostrarExito(email, emailError);
    }
    
    function validarTelefono() {
        const valorTelefono = telefono.value.trim();
        
        if (valorTelefono === '') {
            return mostrarError(telefono, telefonoError, 'El teléfono es obligatorio');
        }
        
        if (!telefonoRegex.test(valorTelefono)) {
            return mostrarError(telefono, telefonoError, 'Por favor ingresa un teléfono válido');
        }
        
        return mostrarExito(telefono, telefonoError);
    }
    
    function validarMensaje() {
        const valorMensaje = mensaje.value.trim();
        
        if (valorMensaje === '') {
            return mostrarError(mensaje, mensajeError, 'El mensaje es obligatorio');
        }
        
        if (valorMensaje.length < 10) {
            return mostrarError(mensaje, mensajeError, 'El mensaje debe tener al menos 10 caracteres');
        }
        
        if (valorMensaje.length > 500) {
            return mostrarError(mensaje, mensajeError, 'El mensaje no puede tener más de 500 caracteres');
        }
        
        return mostrarExito(mensaje, mensajeError);
    }
    
    nombre.addEventListener('blur', validarNombre);
    nombre.addEventListener('input', function() {
        if (nombre.value.trim() !== '') {
            validarNombre();
        }
    });
    
    email.addEventListener('blur', validarEmail);
    email.addEventListener('input', function() {
        if (email.value.trim() !== '') {
            validarEmail();
        }
    });
    
    telefono.addEventListener('blur', validarTelefono);
    telefono.addEventListener('input', function() {
        if (telefono.value.trim() !== '') {
            validarTelefono();
        }
    });
    
    mensaje.addEventListener('blur', validarMensaje);
    mensaje.addEventListener('input', function() {
        if (mensaje.value.trim() !== '') {
            validarMensaje();
        }
    });
    
    // Función para mostrar popup de éxito
    function mostrarPopupExito() {
        const popup = document.createElement('div');
        popup.className = 'success-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <div class="popup-icon">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#27ae60"/>
                        <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>¡Mensaje Enviado!</h3>
                <p>Gracias por contactarnos. Te responderemos pronto.</p>
                <button class="popup-close-btn" onclick="cerrarPopup()">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            cerrarPopup();
        }, 5000);
    }
    
    window.cerrarPopup = function() {
        const popup = document.querySelector('.success-popup');
        if (popup) {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
    };
    
    function resetearFormulario() {
        form.reset();
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
        });
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }
    
    // ADDEVENTLISTENER  = ESTAR ATENTOS A CUANDO SE PRESIONE EL BOTON ENVIAR
    // CUANDO ESTO OCURRE HAGAMOS LO QUE ESTA DENTRO
    // e = this en JAVA, HACE REFERENCIA AL EVENTO Y A EL
    // ELEMENTO HTML QUE LO DISPARO, EN ESTE CASO EL BOTON

    // CUANDO SE PRESIONEEL BGOTON, SE EJECUTAN LAS FUNCIONES QUE DEFINIMOS ARRIA LOCO SI

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevenir el envío por defecto
        
        //GUARDAMOS LOS BOOLEANOS PARA LUEGO VALIDARLOS EN IF
        const nombreValido = validarNombre();
        const emailValido = validarEmail();
        const telefonoValido = validarTelefono();
        const mensajeValido = validarMensaje();
        // CONDICIONAL PARA REVISAR QUE TODAS LAS VALIDACIONES FUNKEN
        if (nombreValido && emailValido && telefonoValido && mensajeValido) {
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            //TIMERR PARA SIMULAR EL ENVIO
            setTimeout(() => {
                mostrarPopupExito();
                
                resetearFormulario();
                
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar mensaje';
            }, 1500);
        } else {
            const primerError = document.querySelector('.form-group.error');
            if (primerError) {
                primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
        