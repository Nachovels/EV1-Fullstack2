// Sistema de Login - Autenticación simulada
class SistemaLogin {
    constructor() {
        this.usuarios = {
            'usuario@demo.com': {
                password: 'demo123',
                tipo: 'usuario',
                nombre: 'Usuario Demo',
                id: 1
            },
            'admin@demo.com': {
                password: 'admin123',
                tipo: 'admin',
                nombre: 'Administrador',
                id: 2
            }
        };
        
        this.usuarioActual = this.obtenerSesionActual();
        this.init();
    }

    init() {
        this.configurarEventos();
        this.verificarSesion();
    }

    configurarEventos() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.manejarLogin(e));
        }

        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePassword());
        }

        // Configurar eventos de validación en tiempo real
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validarEmail());
            emailInput.addEventListener('input', () => {
                if (emailInput.value.trim() !== '') {
                    this.validarEmail();
                }
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', () => this.validarPassword());
            passwordInput.addEventListener('input', () => {
                if (passwordInput.value.trim() !== '') {
                    this.validarPassword();
                }
            });
        }
    }

    validarEmail() {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        const valor = emailInput.value.trim();
        
        if (valor === '') {
            return this.mostrarError(emailInput, emailError, 'El correo electrónico es obligatorio');
        }
        
        if (!emailRegex.test(valor)) {
            return this.mostrarError(emailInput, emailError, 'Por favor ingresa un correo electrónico válido');
        }
        
        return this.mostrarExito(emailInput, emailError);
    }

    validarPassword() {
        const passwordInput = document.getElementById('password');
        const passwordError = document.getElementById('password-error');
        
        const valor = passwordInput.value.trim();
        
        if (valor === '') {
            return this.mostrarError(passwordInput, passwordError, 'La contraseña es obligatoria');
        }
        
        if (valor.length < 6) {
            return this.mostrarError(passwordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres');
        }
        
        return this.mostrarExito(passwordInput, passwordError);
    }

    mostrarError(campo, errorElement, mensaje) {
        campo.parentNode.classList.add('error');
        campo.parentNode.classList.remove('success');
        errorElement.textContent = mensaje;
        return false;
    }

    mostrarExito(campo, errorElement) {
        campo.parentNode.classList.remove('error');
        campo.parentNode.classList.add('success');
        errorElement.textContent = '';
        return true;
    }

    async manejarLogin(e) {
        e.preventDefault();
        
        const emailValido = this.validarEmail();
        const passwordValido = this.validarPassword();
        
        if (!emailValido || !passwordValido) {
            return;
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const remember = document.getElementById('remember').checked;
        
        const loginBtn = document.querySelector('.login-btn');
        
        // Mostrar estado de carga
        this.mostrarCargando(loginBtn);
        
        try {
            // Simular delay de autenticación
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const resultado = this.autenticar(email, password);
            
            if (resultado.exito) {
                this.guardarSesion(resultado.usuario, remember);
                this.mostrarExito(resultado.usuario);
                
                // Redirigir según el tipo de usuario
                setTimeout(() => {
                    if (resultado.usuario.tipo === 'admin') {
                        window.location.href = 'dashboard-admin.html';
                    } else {
                        window.location.href = 'dashboard-usuario.html';
                    }
                }, 2000);
                
            } else {
                this.mostrarErrorLogin(resultado.mensaje);
            }
            
        } catch (error) {
            this.mostrarErrorLogin('Error de conexión. Inténtalo nuevamente.');
        } finally {
            this.ocultarCargando(loginBtn);
        }
    }

    autenticar(email, password) {
        const usuario = this.usuarios[email.toLowerCase()];
        
        if (!usuario) {
            return {
                exito: false,
                mensaje: 'Correo electrónico no registrado'
            };
        }
        
        if (usuario.password !== password) {
            return {
                exito: false,
                mensaje: 'Contraseña incorrecta'
            };
        }
        
        return {
            exito: true,
            usuario: {
                ...usuario,
                email: email
            }
        };
    }

    guardarSesion(usuario, recordar) {
        this.usuarioActual = usuario;
        
        // En un caso real, esto se guardaría en localStorage o cookies
        window.sessionData = {
            usuario: usuario,
            timestamp: Date.now(),
            recordar: recordar
        };
    }

    obtenerSesionActual() {
        // En un caso real, esto vendría de localStorage o cookies
        return window.sessionData ? window.sessionData.usuario : null;
    }

    verificarSesion() {
        if (this.usuarioActual) {
            // Usuario ya está logueado, redirigir al dashboard apropiado
            if (window.location.pathname.includes('login.html')) {
                if (this.usuarioActual.tipo === 'admin') {
                    window.location.href = 'dashboard-admin.html';
                } else {
                    window.location.href = 'dashboard-usuario.html';
                }
            }
        }
    }

    mostrarCargando(boton) {
        boton.disabled = true;
        boton.textContent = 'Iniciando sesión...';
        boton.classList.add('loading');
    }

    ocultarCargando(boton) {
        boton.disabled = false;
        boton.textContent = 'Iniciar Sesión';
        boton.classList.remove('loading');
    }

    mostrarExito(usuario) {
        const form = document.getElementById('loginForm');
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>¡Bienvenido, ${usuario.nombre}!</h3>
            <p>Redirigiendo a tu dashboard...</p>
        `;
        
        form.parentNode.insertBefore(successMessage, form);
        form.style.display = 'none';
    }

    mostrarErrorLogin(mensaje) {
        // Remover mensajes de error previos
        const errorPrevio = document.querySelector('.login-error');
        if (errorPrevio) {
            errorPrevio.remove();
        }

        const form = document.getElementById('loginForm');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'login-error';
        errorMessage.style.cssText = `
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px rgba(231, 76, 60, 0.3);
        `;
        errorMessage.innerHTML = `
            <strong>Error de autenticación</strong><br>
            ${mensaje}
        `;
        
        form.parentNode.insertBefore(errorMessage, form);

        // Auto-remover el error después de 5 segundos
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 5000);
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.querySelector('.eye-icon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            eyeIcon.textContent = '👁️';
        }
    }

    cerrarSesion() {
        this.usuarioActual = null;
        window.sessionData = null;
        window.location.href = 'login.html';
    }

    estaLogueado() {
        return this.usuarioActual !== null;
    }

    esAdmin() {
        return this.usuarioActual && this.usuarioActual.tipo === 'admin';
    }

    obtenerUsuarioActual() {
        return this.usuarioActual;
    }
}

// Funciones globales para los botones de demo
function fillDemoData(tipo) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (tipo === 'user') {
        emailInput.value = 'usuario@demo.com';
        passwordInput.value = 'demo123';
    } else if (tipo === 'admin') {
        emailInput.value = 'admin@demo.com';
        passwordInput.value = 'admin123';
    }
    
    // Trigger validation
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
}

function showComingSoon() {
    alert('Funcionalidad de registro próximamente disponible.\nPor ahora, usa las cuentas de demostración.');
}

// Protección de rutas - Verificar autenticación en páginas protegidas
function verificarAutenticacion() {
    const paginasProtegidas = ['dashboard-admin.html', 'dashboard-usuario.html'];
    const paginaActual = window.location.pathname.split('/').pop();
    
    if (paginasProtegidas.includes(paginaActual)) {
        const sistema = new SistemaLogin();
        if (!sistema.estaLogueado()) {
            alert('Debes iniciar sesión para acceder a esta página.');
            window.location.href = 'login.html';
            return false;
        }
        
        // Verificar permisos específicos
        if (paginaActual === 'dashboard-admin.html' && !sistema.esAdmin()) {
            alert('No tienes permisos para acceder al panel de administración.');
            window.location.href = 'dashboard-usuario.html';
            return false;
        }
    }
    
    return true;
}

// Inicializar sistema de login
let sistemaLogin;

document.addEventListener('DOMContentLoaded', function() {
    sistemaLogin = new SistemaLogin();
    
    // Verificar autenticación en páginas protegidas
    verificarAutenticacion();
});

// Exponer sistema globalmente para debugging
window.sistemaLogin = sistemaLogin;