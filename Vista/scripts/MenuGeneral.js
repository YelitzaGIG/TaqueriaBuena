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
let pagoProcesado = false; // Prevenir doble procesamiento


// ===================================
// ESTADO INICIAL DEL MENÚ
// ===================================
function estadoInicialDelMenu() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));

    console.log("📋 Estado inicial del menú");
    console.log("Usuario:", usuario);
    console.log("Ubicación:", ubicacion);

    // 1️⃣ Sin usuario → Mostrar botón login
    if (!usuario || !usuario.id) {
        console.log("❌ Sin usuario");
        deshabilitarBotonesMenu();
        mostrarBotonFlotanteLogin();
        return;
    }

    console.log("✅ Usuario encontrado:", usuario.nombre);

    // 2️⃣ Sin ubicación válida → Mostrar modal OBLIGATORIO
    if (!ubicacion || ubicacion.dentro_rango !== true) {
        console.log("❌ Sin ubicación válida");
        deshabilitarBotonesMenu();
        mostrarBotonFlotanteUbicacion();

        // 🔥 IMPORTANTE: Flag único por usuario
        const flagModal = "modal_mostrado_" + usuario.id;
        
        if (!localStorage.getItem(flagModal)) {
            console.log("📍 Mostrando modal de ubicación para usuario:", usuario.id);
            mostrarModalUbicacion();
            localStorage.setItem(flagModal, "1");
        }

        return;
    }

    // 3️⃣ Usuario + Ubicación válida → Habilitar menú
    console.log("✅ Ubicación válida:", ubicacion);
    console.log("✅ Menú habilitado");
    habilitarBotonesMenu();
    ocultarBotonFlotanteUbicacion();
}


// ===================================
// VERIFICAR SESIÓN Y UBICACIÓN
// ===================================
function verificarSesionYUbicacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));

    console.log("🔍 Verificando sesión y ubicación");
    console.log("Usuario:", usuario);
    console.log("Ubicación:", ubicacion);

    // Validar usuario
    if (!usuario || !usuario.id) {
        console.log("❌ No hay usuario válido");
        return { valido: false, mensaje: "Debes iniciar sesión para hacer pedidos" };
    }

    // Validar ubicación
    if (!ubicacion || ubicacion.dentro_rango !== true) {
        console.log("❌ No hay ubicación válida");
        mostrarModalUbicacion();
        return { valido: false, mensaje: "Debes validar tu ubicación para hacer pedidos" };
    }

    console.log("✅ Sesión y ubicación válidas");
    return { valido: true };
}


// ===================================
// VERIFICAR SESIÓN Y UBICACIÓN (CORREGIDO)
// ===================================
function verificarSesionYUbicacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));

    console.log("Usuario en localStorage:", usuario);
    console.log("Ubicación en localStorage:", ubicacion);

    if (!usuario || !usuario.id) {
        return { valido: false, mensaje: "Debes iniciar sesión para hacer pedidos" };
    }

    if (!ubicacion || ubicacion.dentro_rango !== true) {
        mostrarModalUbicacion();
        return { valido: false, mensaje: "Debes validar tu ubicación para hacer pedidos" };
    }

    return { valido: true };
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
    if (item.dataset.category !== "tacos")
        item.style.display = "none";
});


// ===================================
// ABRIR / CERRAR CARRITO
// ===================================
cartBtn.addEventListener('click', () => cartPanel.classList.toggle('open'));
closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));


// ===================================
// ABRIR CUADRO DE PERSONALIZACIÓN
// ===================================
document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', () => {

        const validacion = verificarSesionYUbicacion();
        if (!validacion.valido) return;

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

        customImg.src = currentProduct.img;
        customName.textContent = category === 'bebidas'
            ? currentProduct.name + " (600ml)"
            : currentProduct.name;

        customDesc.textContent = currentProduct.desc;
        customInstructions.value = '';
        customOptionsContainer.innerHTML = '';

        if (category !== 'bebidas') {
            const opts = (category === 'antojitos' && categoryOptions.antojitos[currentProduct.name])
                ? categoryOptions.antojitos[currentProduct.name]
                : categoryOptions.tacos;

            opts.forEach(opt => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="${opt}"> ${opt}`;
                customOptionsContainer.appendChild(label);
            });
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
    if (e.target === customizationOverlay) closeCustomizationBox();
});


// ===================================
// AGREGAR AL CARRITO
// ===================================
addToCartBtn.addEventListener('click', () => {

    currentProduct.qty = parseInt(customQty.value);
    currentProduct.instructions = customInstructions.value;

    if (currentProduct.category !== 'bebidas') {
        currentProduct.options = Array
            .from(customOptionsContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(i => i.value);
    }

    const existing = cart.find(item =>
        item.name === currentProduct.name &&
        JSON.stringify(item.options) === JSON.stringify(currentProduct.options)
    );

    if (existing) {
        existing.qty += currentProduct.qty;
    } else {
        cart.push({ ...currentProduct });
    }

    updateCartUI();
    closeCustomizationBox();
});


// ===================================
// ACTUALIZAR CARRITO
// ===================================
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, idx) => {
        total += item.price * item.qty;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <span class="name">${item.name} ${item.options && item.options.length ? '(' + item.options.join(', ') + ')' : ''}</span>
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


// ===================================
// BOTONES FLOTANTES
// ===================================
function mostrarBotonFlotanteLogin() {
    const btn = document.getElementById("btn-flotante-ubicacion");
    if (!btn) return;
    btn.classList.add("visible");
    btn.innerHTML = "🔑";
    btn.onclick = () => window.location.href = "../vistas/login.php";
}

function mostrarBotonFlotanteUbicacion() {
    const btn = document.getElementById("btn-flotante-ubicacion");
    if (!btn) return;
    btn.classList.add("visible", "pulsar");
    btn.innerHTML = "📍";
    btn.onclick = () => mostrarModalUbicacion();
}

function ocultarBotonFlotanteUbicacion() {
    const btn = document.getElementById("btn-flotante-ubicacion");
    if (!btn) return;
    btn.classList.remove("visible", "pulsar");
}


// ===================================
// HABILITAR / DESHABILITAR BOTONES
// ===================================
function deshabilitarBotonesMenu() {
    document.querySelectorAll(".plus-btn").forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.5";
    });
}

function habilitarBotonesMenu() {
    document.querySelectorAll(".plus-btn").forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = "1";
    });
}


// ===================================
// MODAL UBICACIÓN
// ===================================
function mostrarModalUbicacion() {
    const modal = document.getElementById("modal-ubicacion");
    if (!modal) return;
    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function cerrarModalUbicacion() {
    const modal = document.getElementById("modal-ubicacion");
    if (!modal) return;
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    localStorage.setItem("modal_mostrado", "1");
}


// ===================================
// FINALIZAR PEDIDO (CORREGIDO COMPLETO)
// ===================================
async function finalizarPedido() {
    // Prevenir doble procesamiento
    if (pagoProcesado) {
        console.log("Pago ya fue procesado, ignorando...");
        return;
    }

    const validacion = verificarSesionYUbicacion();
    if (!validacion.valido) {
        alert(validacion.mensaje);
        return;
    }

    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));

    if (!ubicacion || ubicacion.dentro_rango !== true) {
        alert("Debes validar tu ubicación antes de hacer el pedido");
        mostrarModalUbicacion();
        return;
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    try {
        pagoProcesado = true; // Marcar como procesado

        const response = await fetch("../../controlador/crearPedido.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                carrito: cart,
                ubicacion: ubicacion,
                total: total
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.ok) {
            alert("¡Pedido creado correctamente!");

            cart = [];
            localStorage.removeItem('carrito');
            updateCartUI();

            const modal = document.getElementById("payment-modal");
            if (modal) modal.style.display = "none";

            if (data.redirect) {
                window.location.href = data.redirect;
            }
        } else {
            alert("Error al guardar el pedido: " + data.error);
            pagoProcesado = false; // Permitir reintentos
        }

    } catch (error) {
        console.error("Error al crear pedido:", error);
        alert("Error de conexión con el servidor. Por favor intenta de nuevo.");
        pagoProcesado = false; // Permitir reintentos
    }
}


// ===================================
// EJECUCIÓN INICIAL
// ===================================
document.addEventListener("DOMContentLoaded", () => {
    estadoInicialDelMenu();

    document.querySelectorAll('.close-modal-ubicacion').forEach(btn => {
        btn.addEventListener("click", cerrarModalUbicacion);
    });

    // BOTÓN CHECKOUT - Solo abre modal
    const checkoutBtn = document.querySelector(".checkout");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const validacion = verificarSesionYUbicacion();
            if (!validacion.valido) {
                alert(validacion.mensaje);
                return;
            }

            if (cart.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }

            pagoProcesado = false; // Reset el flag
            document.getElementById("payment-modal").style.display = "flex";
        });
    }

    // CERRAR MODAL DE PAGO
    document.querySelector(".close-payment")?.addEventListener("click", () => {
        document.getElementById("payment-modal").style.display = "none";
    });

    // PAYPAL
    document.querySelector(".paypal-btn")?.addEventListener("click", async function () {
        document.getElementById("paypal-button-container").innerHTML = "";
        
        let total = parseFloat(document.getElementById("cart-total").textContent) || 0;

        paypal.Buttons({
            createOrder: function (data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        description: "Pedido Taquería Los de Cabeza",
                        amount: {
                            currency_code: "MXN",
                            value: total.toFixed(2)
                        }
                    }]
                });
            },
            onApprove: async function (data, actions) {
                const details = await actions.order.capture();
                console.log("Pago completado:", details);
                await finalizarPedido();
            },
            onError: function (err) {
                console.error("Error en el pago:", err);
                alert("Ocurrió un error en PayPal.");
            }
        }).render("#paypal-button-container");
    });

    // MERCADO PAGO - SIMULADO
    document.getElementById("btn-mercado")?.addEventListener("click", async () => {
        const total = parseFloat(document.getElementById("cart-total").textContent) || 0;

        if (total <= 0) {
            alert("El carrito está vacío");
            return;
        }

        console.log("TOTAL A ENVIAR:", total);

        try {
            // Simular pago completado
            const preferenceId = "PREF_" + Math.random().toString(36).substr(2, 9).toUpperCase();
            console.log("PREF ID:", preferenceId);

            alert(`¡Pago simulado completado!\nID: ${preferenceId}\nTotal: $${total.toFixed(2)} MXN`);

            // Después del pago, procesar el pedido
            await finalizarPedido();

        } catch (error) {
            console.error("Error con Mercado Pago:", error);
            alert("Error al procesar el pago.");
        }
    });
});