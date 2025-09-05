// Usuarios de demo
const usuarios = {
    "usuario@demo.com": { password: "demo123", tipo: "usuario", nombre: "Usuario Demo" },
    "admin@demo.com": { password: "admin123", tipo: "admin", nombre: "Administrador" }
};

// Inicializar login al cargar
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const togglePassword = document.getElementById("togglePassword");

    // Enviar formulario
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        login();
    });

    // Mostrar / ocultar contraseña
    togglePassword.addEventListener("click", () => {
        const passwordInput = document.getElementById("password");
        const eyeIcon = togglePassword.querySelector(".eye-icon");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.textContent = "🙈";
        } else {
            passwordInput.type = "password";
            eyeIcon.textContent = "👁️";
        }
    });
});

// Lógica principal de login
function login() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    if (!usuarios[email]) {
        return mostrarError("Correo no registrado");
    }
    if (usuarios[email].password !== password) {
        return mostrarError("Contraseña incorrecta");
    }

    // ✅ Login correcto
    alert(`Bienvenido ${usuarios[email].nombre}`);
    if (usuarios[email].tipo === "admin") {
        window.location.href = "index.html";
    } else {
        window.location.href = "index.html";
    }
}

// Mostrar error
function mostrarError(mensaje) {
    let errorBox = document.querySelector(".login-error");
    if (!errorBox) {
        errorBox = document.createElement("div");
        errorBox.className = "login-error";
        errorBox.style.cssText = `
            background:#e74c3c;color:white;padding:10px;
            border-radius:8px;text-align:center;margin:10px 0;
        `;
        document.getElementById("loginForm").before(errorBox);
    }
    errorBox.textContent = mensaje;
}

// Botones de demo
function fillDemoData(tipo) {
    if (tipo === "user") {
        document.getElementById("email").value = "usuario@demo.com";
        document.getElementById("password").value = "demo123";
    } else if (tipo === "admin") {
        document.getElementById("email").value = "admin@demo.com";
        document.getElementById("password").value = "admin123";
    }
}

function showComingSoon() {
    alert("Funcionalidad de registro próximamente disponible.");
}
