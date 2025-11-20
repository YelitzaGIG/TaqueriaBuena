// ===================================
// VARIABLES GLOBALES MenuGeneral.js
// ===================================
const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('.menu-item');

const cartBtn = document.getElementById('cart-btn');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

const customizationOverlay = document.getElementById('customization-overlay');
const closeCustomization = document.getElementById('close-customization');
const customImg = document.getElementById('custom-img');
const customName = document.getElementById('custom-name');
const customDesc = document.getElementById('custom-desc');
const customInstructions = document.getElementById('custom-instructions');
const customQty = document.getElementById('custom-qty');
const addToCartBtn = document.getElementById('add-to-cart');
const customOptionsContainer = document.querySelector('.custom-options');

let cart = [];
let currentProduct = null;

// ===================================
// VERIFICAR SESIÓN Y UBICACIÓN
// ===================================
function verificarSesionYUbicacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
        return { 
            valido: false, 
            mensaje: 'Debes iniciar sesión para hacer pedidos',
            tipo: 'sin_sesion'
        };
    }
    
    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));
    
    if (!ubicacion || !ubicacion.dentro_rango) {
        return { 
            valido: false, 
            mensaje: 'Debes validar tu ubicación para hacer pedidos',
            tipo: 'sin_ubicacion'
        };
    }
    
    // Verificar que no sea muy antigua (24 horas)
    const timestamp = new Date(ubicacion.timestamp);
    const ahora = new Date();
    const horasDiferencia = (ahora - timestamp) / (1000 * 60 * 60);
    
    if (horasDiferencia > 24) {
        localStorage.removeItem('ubicacion_validada');
        return { 
            valido: false, 
            mensaje: 'Tu validación de ubicación ha expirado. Por favor valida nuevamente.',
            tipo: 'ubicacion_expirada'
        };
    }
    
    return { valido: true };
}

// ===================================
// MOSTRAR MODAL DE UBICACIÓN
// ===================================
function abrirModalUbicacion() {
    const modal = document.getElementById('modal-ubicacion');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// ===================================
// OPCIONES POR CATEGORÍA
// ===================================
const categoryOptions = {
    tacos: ["Cebolla", "Cilantro", "Limón", "Salsas"],

    antojitos: {
        "Quesadillas": ["Queso", "Salsa roja", "Salsa verde"],
        "Sopes": ["Queso", "Crema", "Lechuga", "Salsa roja", "Salsa verde"],
        "Tlacoyos": ["Queso fresco", "Salsa roja", "Salsa verde"],
        "Gorditas": ["Queso", "Crema", "Guacamole", "Salsa picante"],
        "Tamales": ["Verde", "Rojo", "Rajas", "Dulce"],
        "Enchiladas": ["Salsa roja", "Salsa verde", "Queso", "Crema"],
        "Empanadas": ["Carne", "Queso", "Verduras"],
        "Pambazos": ["Lechuga", "Crema", "Queso"],
        "Chilaquiles": ["Salsa roja", "Salsa verde", "Pollo", "Huevo"]
    }
};

// ===================================
// PESTAÑAS
// ===================================
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.target;
        menuItems.forEach(item => {
            item.style.display = (item.dataset.category === target) ? "flex" : "none";
        });
    });
});

// Mostrar solo tacos al inicio
menuItems.forEach(item => {
    if (item.dataset.category !== "tacos") item.style.display = "none";
});

// ===================================
// ABRIR / CERRAR CARRITO
// ===================================
cartBtn.addEventListener('click', () => {
    // Verificar sesión antes de abrir carrito
    const validacion = verificarSesionYUbicacion();
    if (!validacion.valido) {
        if (validacion.tipo === 'sin_sesion') {
            const redirigir = confirm(validacion.mensaje + '\n\n¿Deseas iniciar sesión?');
            if (redirigir) {
                window.location.href = '../vistas/login.php';
            }
        } else {
            alert(validacion.mensaje);
            abrirModalUbicacion();
        }
        return;
    }
    
    cartPanel.classList.toggle('open');
});

closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));

// ===================================
// ABRIR CUADRO DE PERSONALIZACIÓN
// ===================================
document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // ✅ VALIDAR SESIÓN Y UBICACIÓN
        const validacion = verificarSesionYUbicacion();
        
        if (!validacion.valido) {
            if (validacion.tipo === 'sin_sesion') {
                const redirigir = confirm(
                    '🔐 Para hacer pedidos necesitas iniciar sesión.\n\n¿Deseas iniciar sesión ahora?'
                );
                if (redirigir) {
                    window.location.href = '../vistas/login.php';
                }
            } else if (validacion.tipo === 'sin_ubicacion' || validacion.tipo === 'ubicacion_expirada') {
                alert(validacion.mensaje);
                abrirModalUbicacion();
            }
            return;
        }
        
        // Continuar con la lógica normal del botón
        const menuItem = btn.closest('.menu-item');
        const category = menuItem.dataset.category;

        currentProduct = {
            name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            img: menuItem.querySelector('img').src,
            desc: menuItem.querySelector('.description').innerText,
            category: category,
            options: [],
            instructions: '',
            qty: 1
        };

        // Rellenar cuadro
        customImg.src = currentProduct.img;
        if (category === 'bebidas') {
            customName.textContent = currentProduct.name + " (600ml)";
        } else {
            customName.textContent = currentProduct.name;
        }
        customDesc.textContent = currentProduct.desc;
        customInstructions.value = '';
        customOptionsContainer.innerHTML = '';

        // Mostrar opciones según categoría
        if (category === 'bebidas') {
            customQty.value = 1;
            customQty.disabled = false;
            customInstructions.placeholder = "Tamaño fijo 600ml. Puedes agregar instrucciones especiales.";
        } else {
            customQty.value = 1;
            customQty.disabled = false;
            customInstructions.placeholder = "Agregar instrucciones especiales";

            let options = [];
            if (category === 'antojitos' && categoryOptions.antojitos[currentProduct.name]) {
                options = categoryOptions.antojitos[currentProduct.name];
            } else if (category === 'tacos') {
                options = categoryOptions.tacos;
            }

            options.forEach(opt => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="${opt}"> ${opt}`;
                customOptionsContainer.appendChild(label);
            });

            if (options.length > 0) {
                const note = document.createElement('p');
                note.classList.add('options-note');
                note.textContent = "Selecciona los ingredientes o agregados que deseas incluir:";
                customOptionsContainer.prepend(note);
            }
        }

        customizationOverlay.classList.add('active');
    });
});

// ===================================
// CERRAR CUADRO DE PERSONALIZACIÓN
// ===================================
function closeCustomizationBox() {
    const box = document.querySelector('.customization-box');
    box.style.transform = 'scale(0.8)';
    box.style.opacity = '0';
    setTimeout(() => {
        customizationOverlay.classList.remove('active');
        box.style.transform = '';
        box.style.opacity = '';
    }, 300);
}

closeCustomization.addEventListener('click', closeCustomizationBox);

customizationOverlay.addEventListener('click', (e) => {
    if (e.target === customizationOverlay) {
        closeCustomizationBox();
    }
});

// ===================================
// AGREGAR AL CARRITO
// ===================================
addToCartBtn.addEventListener('click', () => {
    currentProduct.qty = parseInt(customQty.value);
    currentProduct.instructions = customInstructions.value;

    if (currentProduct.category !== 'bebidas') {
        currentProduct.options = Array.from(customOptionsContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(i => i.value);
    } else {
        currentProduct.options = [];
    }

    // Verificar si ya existe en carrito
    const existing = cart.find(item => item.name === currentProduct.name &&
        JSON.stringify(item.options) === JSON.stringify(currentProduct.options));

    if (existing) {
        existing.qty += currentProduct.qty;
    } else {
        cart.push({ ...currentProduct });
    }

    updateCartUI();
    closeCustomizationBox();
});

// ===================================
// FUNCIÓN PARA ACTUALIZAR EL CARRITO
// ===================================
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <span class="name">${item.name} ${item.options.length ? '(' + item.options.join(', ') + ')' : ''}</span>
            <div class="qty-controls">
                <button class="minus">-</button>
                <span>${item.qty}</span>
                <button class="plus">+</button>
            </div>
            <span>$${(item.price * item.qty).toFixed(2)}</span>
        `;

        div.querySelector('.plus').addEventListener('click', () => {
            item.qty++;
            updateCartUI();
        });
        div.querySelector('.minus').addEventListener('click', () => {
            item.qty--;
            if (item.qty <= 0) cart.splice(idx, 1);
            updateCartUI();
        });

        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
}

// 🟦 MOSTRAR MODAL DE PAGO
document.querySelector(".checkout").addEventListener("click", () => {
    // ✅ VALIDAR ANTES DE ABRIR MODAL
    const validacion = verificarSesionYUbicacion();
    if (!validacion.valido) {
        if (validacion.tipo === 'sin_sesion') {
            const redirigir = confirm(validacion.mensaje + '\n\n¿Deseas iniciar sesión?');
            if (redirigir) {
                window.location.href = '../vistas/login.php';
            }
        } else {
            alert(validacion.mensaje);
            abrirModalUbicacion();
        }
        return;
    }
    
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    document.getElementById("payment-modal").style.display = "flex";
});

// 🟥 CERRAR MODAL DE PAGO
document.querySelector(".close-payment").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "none";
});

// 🟦 BOTONES DE PAGO
document.querySelector(".mercado-btn").addEventListener("click", () => {
    alert("Redirigiendo a Mercado Pago...");
});

document.querySelector(".paypal-btn").addEventListener("click", () => {
    alert("Redirigiendo a PayPal...");
});

// ===================================
// INDICADOR VISUAL DE ESTADO
// ===================================
function actualizarIndicadorEstado() {
    const validacion = verificarSesionYUbicacion();
    const indicador = document.getElementById('estado-pedido');
    
    if (!indicador) return;
    
    if (!validacion.valido) {
        if (validacion.tipo === 'sin_sesion') {
            indicador.innerHTML = '👤 <strong>Modo invitado</strong> - Inicia sesión para ordenar';
            indicador.className = 'estado-invitado';
        } else {
            indicador.innerHTML = '📍 <strong>Valida tu ubicación</strong> para hacer pedidos';
            indicador.className = 'estado-sin-ubicacion';
        }
    } else {
        const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));
        indicador.innerHTML = `✅ <strong>Listo para ordenar</strong> - A ${ubicacion.distancia} km`;
        indicador.className = 'estado-listo';
    }
}

// Actualizar indicador al cargar
document.addEventListener('DOMContentLoaded', () => {
    actualizarIndicadorEstado();
    
    // Actualizar cada 30 segundos
    setInterval(actualizarIndicadorEstado, 30000);
});