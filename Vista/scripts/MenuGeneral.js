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
// 🟦 ESTADO INICIAL DEL MENÚ (CORREGIDO)
// ===================================
function estadoInicialDelMenu() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));

    if (!usuario) {
        deshabilitarBotonesMenu();
        mostrarBotonFlotanteLogin();
        return;
    }

    if (!ubicacion || !ubicacion.dentro_rango) {
        deshabilitarBotonesMenu();
        mostrarBotonFlotanteUbicacion();

        if (!localStorage.getItem("modal_mostrado")) {
            mostrarModalUbicacion();
            localStorage.setItem("modal_mostrado", "1");
        }

        return;
    }

    habilitarBotonesMenu();
    ocultarBotonFlotanteUbicacion();
}


// ===================================
// VERIFICAR SESIÓN Y UBICACIÓN (CORREGIDO)
// ===================================
function verificarSesionYUbicacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));

    if (!usuario) {
        return { valido: false, mensaje: "Debes iniciar sesión para hacer pedidos" };
    }

    if (!ubicacion || !ubicacion.dentro_rango) {
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
        cart.push({...currentProduct});
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


// ===================================
// PAGOS
// ===================================
document.querySelector(".checkout").addEventListener("click", () => {

    const validacion = verificarSesionYUbicacion();
    if (!validacion.valido) return;

    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    document.getElementById("payment-modal").style.display = "flex";
});

document.querySelector(".close-payment").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "none";
});

document.querySelector(".mercado-btn").addEventListener("click", () => {
    alert("Redirigiendo a Mercado Pago...");
});

document.querySelector(".paypal-btn").addEventListener("click", () => {
    alert("Redirigiendo a PayPal...");
});


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
// MODAL UBICACIÓN (CORREGIDO)
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

    // Guardar que el usuario cerró el modal
    localStorage.setItem("modal_mostrado", "1");
}


// ===================================
// EJECUCIÓN INICIAL
// ===================================
document.addEventListener("DOMContentLoaded", () => {
    estadoInicialDelMenu();

    // Manejar botón cierre del modal
    document.querySelectorAll('.close-modal-ubicacion').forEach(btn => {
        btn.addEventListener("click", cerrarModalUbicacion);
    });
});

// 🟦 MOSTRAR MODAL DE PAGO AL PRESIONAR "Finalizar Pedido"
document.querySelector(".checkout").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "flex";
});

// 🟥 BOTÓN PARA CERRAR EL MODAL
document.querySelector(".close-payment").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "none";
});

// 🟦 BOTONES DE PAGO
document.querySelector(".mercado-btn").addEventListener("click", () => {
    alert("Redirigiendo a Mercado Pago...");
    // aquí puedes poner window.location.href = "tu_link";
});

document.querySelector(".paypal-btn").addEventListener("click", () => {
    alert("Redirigiendo a PayPal...");
    // aquí puedes poner window.location.href = "tu_link";
});


//async function finalizarPedido() {
//
//    const validacion = verificarSesionYUbicacion();
//    if (!validacion.valido) {
//        alert(validacion.mensaje);
//        return;
//    }
//
//    if (cart.length === 0) {
//        alert("Tu carrito está vacío");
//        return;
//    }
//
//    // 🚨 Aquí obtenemos la ubicación guardada
//    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));
//
//    if (!ubicacion) {
//        alert("Debes validar tu ubicación antes de hacer el pedido");
//        return;
//    }
//
//    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
//
//    try {
//       fetch("../../controlador/crearPedido.php", {
//
//            method: "POST",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify({
//                carrito: cart,
//                ubicacion: ubicacion,   // ✅ IMPORTANTE: enviar ubicación
//                total: total
//            })
//        });
//
//        const data = await response.json();
//
//        if (data.ok) {
//            alert("¡Pedido creado correctamente!");
//
//            cart = [];
//            updateCartUI();
//
//            // cerrar modal
//            document.getElementById("payment-modal").style.display = "none";
//
//            // redirigir si el PHP lo envía
//            if (data.redirect) {
//                window.location.href = data.redirect;
//            }
//        } else {
//            alert("Error al guardar el pedido: " + data.error);
//        }
//
//    } catch (error) {
//        console.error(error);
//        alert("Error de conexión con el servidor.");
//    }
//}


// ===================================
// FUNCIÓN FINALIZAR PEDIDO - CORREGIDA
// ===================================

async function finalizarPedido() {
    const validacion = verificarSesionYUbicacion();
    if (!validacion.valido) {
        alert(validacion.mensaje);
        return;
    }

    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    // Obtener ubicación validada
    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));

    if (!ubicacion || !ubicacion.dentro_rango) {
        alert("Debes validar tu ubicación antes de hacer el pedido");
        mostrarModalUbicacion();
        return;
    }

    // Calcular total
    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    try {
        // ✅ CORREGIDO: agregar "const response = await"
        const response = await fetch("../../controlador/crearPedido.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                carrito: cart,
                ubicacion: ubicacion,
                total: total
            })
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.ok) {
            alert("¡Pedido creado correctamente!");

            // Limpiar carrito
            cart = [];
            localStorage.removeItem('carrito');
            updateCartUI();

            // Cerrar modal de pago
            document.getElementById("payment-modal").style.display = "none";

            // Redirigir a seguimiento
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        } else {
            alert("Error al guardar el pedido: " + data.error);
        }

    } catch (error) {
        console.error("Error al crear pedido:", error);
        alert("Error de conexión con el servidor. Por favor intenta de nuevo.");
    }
}

// ===================================
// EVENTO BOTÓN CHECKOUT
// ===================================

document.addEventListener("DOMContentLoaded", () => {
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

            // Mostrar modal de pago
            document.getElementById("payment-modal").style.display = "flex";
        });
    }
});

// ===================================
// INTEGRACIÓN CON BOTONES DE PAGO
// ===================================

document.addEventListener("DOMContentLoaded", () => {
    // PayPal
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
                
                // ✅ Finalizar pedido después del pago
                await finalizarPedido();
            },
            onError: function (err) {
                console.error("Error en el pago:", err);
                alert("Ocurrió un error en PayPal.");
            }
        }).render("#paypal-button-container");
    });

    // Mercado Pago
    document.getElementById("btn-mercado")?.addEventListener("click", async () => {
        const total = parseFloat(document.getElementById("cart-total").textContent);

        try {
            const res = await fetch("http://localhost:3000/create_preference", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({total})
            });

            const data = await res.json();
            
            const mp = new MercadoPago("APP_USR-ae72e001-96d4-42df-8159-1cd12f01675d", {
                locale: "es-MX",
                autoOpen: false
            });

            mp.checkout({
                preference: {id: data.id},
                render: {
                    container: "#wallet_container",
                    label: "Pagar con Mercado Pago"
                }
            });

            // ✅ Finalizar pedido después del pago
            // Nota: Necesitas un webhook de Mercado Pago para confirmar
            
        } catch (error) {
            console.error("Error con Mercado Pago:", error);
            alert("Error al conectar con Mercado Pago");
        }
    });
});