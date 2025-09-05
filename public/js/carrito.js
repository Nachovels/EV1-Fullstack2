// Carrito de compras - Gestión completa
class CarritoCompras {
    constructor() {
        this.items = this.cargarCarrito();
        this.shipping = 2990;
        this.init();
    }

    init() {
        this.actualizarContadorCarrito();
        this.renderizarCarrito();
        this.configurarEventos();
    }

    // Cargar carrito desde memoria (simulando persistencia)
    cargarCarrito() {
        // En un caso real, esto vendría de localStorage o una base de datos
        return [];
    }

    // Agregar producto al carrito
    agregarProducto(producto) {
        const productoExistente = this.items.find(item => item.id === producto.id);
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            this.items.push({
                ...producto,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.renderizarCarrito();
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
    }

    // Remover producto del carrito
    removerProducto(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.renderizarCarrito();
    }

    // Actualizar cantidad de producto
    actualizarCantidad(id, nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            this.removerProducto(id);
            return;
        }
        
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.cantidad = nuevaCantidad;
            this.guardarCarrito();
            this.actualizarContadorCarrito();
            this.renderizarCarrito();
        }
    }

    // Obtener cantidad total de items
    obtenerCantidadTotal() {
        return this.items.reduce((total, item) => total + item.cantidad, 0);
    }

    // Obtener subtotal
    obtenerSubtotal() {
        return this.items.reduce((total, item) => {
            const precio = parseInt(item.precio.replace(/[$.]/g, ''));
            return total + (precio * item.cantidad);
        }, 0);
    }

    // Obtener total
    obtenerTotal() {
        return this.obtenerSubtotal() + (this.items.length > 0 ? this.shipping : 0);
    }

    // Guardar carrito (simulado)
    guardarCarrito() {
        // En un caso real guardaría en localStorage
        window.carritoData = this.items;
    }

    // Actualizar contador en navbar
    actualizarContadorCarrito() {
        const contador = document.getElementById('cart-count');
        if (contador) {
            const cantidad = this.obtenerCantidadTotal();
            contador.textContent = cantidad;
            contador.style.display = cantidad > 0 ? 'inline-block' : 'none';
        }
    }

    // Renderizar carrito completo
    renderizarCarrito() {
        const cartEmpty = document.getElementById('cart-empty');
        const cartContent = document.getElementById('cart-content');
        const cartItems = document.getElementById('cart-items');

        if (!cartItems) return; // No estamos en la página del carrito

        if (this.items.length === 0) {
            cartEmpty.style.display = 'block';
            cartContent.style.display = 'none';
        } else {
            cartEmpty.style.display = 'none';
            cartContent.style.display = 'block';
            
            cartItems.innerHTML = this.items.map(item => this.crearItemHTML(item)).join('');
            this.actualizarResumen();
        }
    }

    // Crear HTML de un item del carrito
    crearItemHTML(item) {
        const precio = parseInt(item.precio.replace(/[$.]/g, ''));
        const subtotalItem = precio * item.cantidad;

        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imagen}" alt="${item.nombre}" class="item-image">
                <div class="item-details">
                    <h3 class="item-name">${item.nombre}</h3>
                    <p class="item-description">${item.descripcion}</p>
                </div>
                <div class="item-price">$${precio.toLocaleString('es-CL')}</div>
                <div class="quantity-controls">
                    <button class="qty-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.cantidad}</span>
                    <button class="qty-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="item-total">$${subtotalItem.toLocaleString('es-CL')}</div>
                <button class="remove-btn" data-id="${item.id}">Eliminar</button>
            </div>
        `;
    }

    // Actualizar resumen de compra
    actualizarResumen() {
        const subtotal = this.obtenerSubtotal();
        const total = this.obtenerTotal();
        
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const totalElement = document.getElementById('total');
        
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toLocaleString('es-CL')}`;
        if (shippingElement) shippingElement.textContent = `$${this.shipping.toLocaleString('es-CL')}`;
        if (totalElement) totalElement.textContent = `$${total.toLocaleString('es-CL')}`;
    }

    // Configurar eventos
    configurarEventos() {
        // Eventos para botones de cantidad
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('decrease')) {
                const id = parseInt(e.target.getAttribute('data-id'));
                const item = this.items.find(item => item.id === id);
                if (item) {
                    this.actualizarCantidad(id, item.cantidad - 1);
                }
            }
            
            if (e.target.classList.contains('increase')) {
                const id = parseInt(e.target.getAttribute('data-id'));
                const item = this.items.find(item => item.id === id);
                if (item) {
                    this.actualizarCantidad(id, item.cantidad + 1);
                }
            }
            
            if (e.target.classList.contains('remove-btn')) {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.removerProducto(id);
            }
        });

        // Evento para proceder al pago
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.procederPago();
            });
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>${mensaje}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Agregar estilos si no existen
        if (!document.getElementById('cart-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'cart-notification-styles';
            styles.textContent = `
                .cart-notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: #27ae60;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .notification-content button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remover después de 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Proceder al pago (simulado)
    procederPago() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        // Simular proceso de pago
        const total = this.obtenerTotal();
        const confirmacion = confirm(`¿Proceder con el pago de $${total.toLocaleString('es-CL')}?`);
        
        if (confirmacion) {
            // Simular éxito del pago
            setTimeout(() => {
                alert('¡Pago procesado exitosamente! Recibirás un email de confirmación.');
                this.vaciarCarrito();
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    // Vaciar carrito
    vaciarCarrito() {
        this.items = [];
        this.guardarCarrito();
        this.actualizarContadorCarrito();
        this.renderizarCarrito();
    }
}

// Productos de ejemplo para testing
const productosEjemplo = [
    {
        id: 1,
        nombre: "¿Alcachofas? ¡No, gracias!",
        descripcion: "Un juego de cartas sin corazón - DEVIR",
        precio: "$9.990",
        imagen: "public/img/juegos_mesa/X_alcachofas-no-gracias1222.jpg"
    },
    {
        id: 2,
        nombre: "Ensalada de puntos",
        descripcion: "Adquiere vegetales en un mercado para ganar - DEVIR",
        precio: "$11.990",
        imagen: "public/img/juegos_mesa/X_ensalada-de-puntos4892.jpg"
    },
    {
        id: 3,
        nombre: "Taco Gorro Torta Caja Pizza",
        descripcion: "Deshazte de tus cartas antes que todos y ¡gana!",
        precio: "$10.990",
        imagen: "public/img/juegos_mesa/X_taco-gorro-torta-caja-pizza8998.jpg"
    },
    {
        id: 4,
        nombre: "Yokai Sketch",
        descripcion: "Completa los bocetos de estos espíritus y obtén la victoria",
        precio: "$8.990",
        imagen: "public/img/juegos_mesa/X_yokai-sketch8794.jpg"
    },
    {
        id: 5,
        nombre: "Magic The Gathering",
        descripcion: "Murders at Karlov Manor Bundle",
        precio: "$49.990",
        imagen: "public/img/tcg/X_magic-the-gathering-murders-at-karlov-manor-bundle8015.jpg"
    },
    {
        id: 6,
        nombre: "One Piece Card Game",
        descripcion: "OP11 A Fist of Divine Speed Booster Display",
        precio: "$129.990",
        imagen: "public/img/tcg/X_op11-one-piece-a-fist-of-divine-speed-booster-box5231.png"
    }
];

// Inicializar carrito cuando se carga la página
let carrito;

document.addEventListener('DOMContentLoaded', function() {
    carrito = new CarritoCompras();
    
    // Configurar botones "Agregar al carrito"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('boton') && e.target.textContent === 'Agregar al carrito') {
            e.preventDefault();
            
            // Encontrar el producto basado en el botón clickeado
            const card = e.target.closest('.card');
            if (card) {
                const nombre = card.querySelector('h4 b').textContent.trim();
                const descripcion = card.querySelector('p').textContent.trim();
                const precio = card.querySelector('h4:last-of-type').textContent.trim().split(' ').pop(); // Tomar el último precio si hay oferta
                const imagen = card.querySelector('img').src;
                
                // Crear ID basado en el nombre (en un caso real vendría de la base de datos)
                const id = Date.now() + Math.random();
                
                const producto = {
                    id: id,
                    nombre: nombre,
                    descripcion: descripcion,
                    precio: precio,
                    imagen: imagen
                };
                
                carrito.agregarProducto(producto);
            }
        }
    });
    
    // Para testing - agregar algunos productos automáticamente si el carrito está vacío
    // Esto se puede comentar en producción
    if (window.location.pathname.includes('carrito.html') && carrito.items.length === 0) {
        // Agregar productos de ejemplo para demostrar la funcionalidad
        setTimeout(() => {
            carrito.agregarProducto(productosEjemplo[0]);
            carrito.agregarProducto(productosEjemplo[4]);
            carrito.actualizarCantidad(productosEjemplo[0].id, 2);
        }, 500);
    }
});

// Exponer carrito globalmente para debugging
window.carrito = carrito;