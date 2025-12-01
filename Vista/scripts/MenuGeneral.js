// Vista/scripts/MenuGeneral.js - COMPLETO Y CORREGIDO

// ===============================
// VARIABLES GLOBALES
// ===============================
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
let pagoProcesado = false;

// ===============================
// OBTENER UBICACION ACTUAL
// ===============================
function obtenerUbicacionActual() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) {
        console.warn("No hay usuario");
        return null;
    }
    
    const ubicacionKey = "ubicacion_temporal_" + usuario.id;
    const ubicacion = localStorage.getItem(ubicacionKey);
    
    console.log("Buscando ubicacion con key:", ubicacionKey);
    console.log("Ubicacion encontrada:", ubicacion);
    
    return ubicacion ? JSON.parse(ubicacion) : null;
}

// ===============================
// GUARDAR UBICACION TEMPORAL
// ===============================
function guardarUbicacionTemporal(ubicacion) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) {
        console.error("No hay usuario");
        return false;
    }
    
    const ubicacionKey = "ubicacion_temporal_" + usuario.id;
    localStorage.setItem(ubicacionKey, JSON.stringify(ubicacion));
    
    console.log("Ubicacion temporal guardada para usuario:", usuario.id);
    console.log("Dentro del rango:", ubicacion.dentro_rango);
    
    return true;
}

// ===============================
// LIMPIAR UBICACION TEMPORAL
// ===============================
function limpiarUbicacionTemporal() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) return;
    
    const ubicacionKey = "ubicacion_temporal_" + usuario.id;
    localStorage.removeItem(ubicacionKey);
    
    console.log("Ubicacion temporal limpiada para usuario:", usuario.id);
}

// ===============================
// ESTADO INICIAL DEL MENU
// ===============================
function estadoInicialDelMenu() {
    console.log("=== VERIFICANDO ESTADO DEL MENU ===");
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    console.log("Usuario:", usuario ? usuario.nombre : "ninguno");

    // 1️⃣ SIN USUARIO = DESHABILITAR TODO
    if (!usuario || !usuario.id) {
        console.log("❌ Sin usuario - Menu deshabilitado");
        deshabilitarBotonesMenu();
        mostrarBotonFlotanteLogin();
        return;
    }

    console.log("✅ Usuario encontrado:", usuario.nombre);

    // 2️⃣ VERIFICAR UBICACION
    const ubicacion = obtenerUbicacionActual();
    
    console.log("Ubicacion:", ubicacion ? "encontrada" : "no encontrada");
    if (ubicacion) {
        console.log("  - Direccion:", ubicacion.direccion);
        console.log("  - Dentro del rango:", ubicacion.dentro_rango);
    }
    
    // 3️⃣ SIN UBICACION O FUERA DE RANGO = DESHABILITAR
    if (!ubicacion || ubicacion.dentro_rango !== true) {
        console.log("❌ Sin ubicacion valida o fuera de rango - Menu deshabilitado");
        deshabilitarBotonesMenu();
        mostrarBotonFlotanteUbicacion();
        
        const flagModal = "modal_ubicacion_mostrado_" + usuario.id;
        if (!sessionStorage.getItem(flagModal)) {
            console.log("Mostrando modal de ubicacion (primera vez)");
            mostrarModalUbicacion();
            sessionStorage.setItem(flagModal, "1");
        }
        
        return;
    }

    // 4️⃣ TODO CORRECTO = HABILITAR MENU
    console.log("✅✅✅ TODO CORRECTO - MENU HABILITADO");
    console.log("  Usuario:", usuario.nombre);
    console.log("  Ubicacion:", ubicacion.direccion);
    console.log("  Dentro del rango: SI");
    
    habilitarBotonesMenu();
    ocultarBotonFlotanteUbicacion();
}

// ===============================
// VERIFICAR SESION Y UBICACION
// ===============================
function verificarSesionYUbicacion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) {
        console.log("No hay usuario");
        mostrarModalLoginObligatorio();
        return { valido: false, mensaje: "Debes iniciar sesion para hacer pedidos" };
    }

    const ubicacion = obtenerUbicacionActual();
    if (!ubicacion || ubicacion.dentro_rango !== true) {
        console.log("No hay ubicacion valida");
        mostrarModalUbicacion();
        return { valido: false, mensaje: "Debes validar tu ubicacion para hacer pedidos" };
    }

    console.log("Sesion y ubicacion validas");
    return { valido: true };
}

// ===============================
// MODAL: LOGIN OBLIGATORIO
// ===============================
function mostrarModalLoginObligatorio() {
    const modal = document.createElement('div');
    modal.id = 'modal-login-obligatorio';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;";
    
    modal.innerHTML = "<div style=\"background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px;\"><h2>Inicia Sesion</h2><p style=\"margin: 20px 0; color: #666;\">Necesitas iniciar sesion para ver el menu y hacer pedidos</p><div style=\"display: flex; gap: 10px; margin-top: 20px;\"><button onclick=\"window.location.href='../vistas/login.php'\" style=\"flex: 1; padding: 12px; background: #0f5b0f; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;\">Iniciar Sesion</button><button onclick=\"window.location.href='../vistas/registrarse.php'\" style=\"flex: 1; padding: 12px; background: #666; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;\">Registrarse</button></div></div>";
    
    const modalAnterior = document.getElementById('modal-login-obligatorio');
    if (modalAnterior) modalAnterior.remove();
    
    document.body.appendChild(modal);
}

// ===============================
// MODAL: ELEGIR UBICACION PARA PEDIDO
// ===============================
function mostrarModalElegirUbicacion() {
    const ubicacion = obtenerUbicacionActual();
    
    if (!ubicacion) {
        mostrarModalUbicacion();
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'modal-elegir-ubicacion';
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;";
    
    modal.innerHTML = "<div style=\"background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px;\"><h2>Confirmar Ubicacion</h2><p style=\"margin: 20px 0; color: #666;\"><strong>Ubicacion registrada:</strong><br>" + ubicacion.direccion + "</p><div style=\"background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #333;\"><p>Latitud: " + ubicacion.latitud + "</p><p>Longitud: " + ubicacion.longitud + "</p></div><div style=\"display: flex; gap: 10px; margin-top: 20px;\"><button onclick=\"confirmarpedidoConUbicacion()\" style=\"flex: 1; padding: 12px; background: #0f5b0f; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;\">Usar Esta</button><button onclick=\"mostrarModalUbicacion()\" style=\"flex: 1; padding: 12px; background: #2196f3; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;\">Validar Otra</button></div></div>";
    
    const modalAnterior = document.getElementById('modal-elegir-ubicacion');
    if (modalAnterior) modalAnterior.remove();
    
    document.body.appendChild(modal);
}

// ===============================
// CONFIRMAR PEDIDO CON UBICACION
// ===============================
function confirmarpedidoConUbicacion() {
    const modal = document.getElementById('modal-elegir-ubicacion');
    if (modal) modal.remove();
    
    console.log("Pedido confirmado con ubicacion");
    
    // Abrir modal de pago
    document.getElementById("payment-modal").style.display = "flex";
}

// ===============================
// FINALIZAR PEDIDO
// ===============================
async function finalizarPedido() {
    console.log("Iniciando proceso de pedido...");
    
    const validacion = verificarSesionYUbicacion();
    if (!validacion.valido) {
        alert(validacion.mensaje);
        return;
    }

    if (cart.length === 0) {
        alert("Tu carrito esta vacio");
        return;
    }

    mostrarModalElegirUbicacion();
}

// ===============================
// CREAR PEDIDO
// ===============================
async function crearPedido() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const ubicacion = obtenerUbicacionActual();

    if (!usuario || !ubicacion) {
        alert("Error: falta usuario u ubicacion");
        return;
    }

    const total = cart.reduce(function(acc, item) {
        return acc + (item.price * item.qty);
    }, 0);

    try {
        console.log("Creando pedido...");
        
        const response = await fetch("../../Controlador/crearPedido.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                carrito: cart,
                ubicacion: ubicacion,
                total: total
            })
        });

        const data = await response.json();

        if (data.ok) {
            console.log("Pedido creado:", data.pedido_id);
            
            alert("Pedido creado correctamente!");
            
            cart = [];
            updateCartUI();
            
            limpiarUbicacionTemporal();
            
            const paymentModal = document.getElementById("payment-modal");
            if (paymentModal) paymentModal.style.display = "none";
            
            setTimeout(function() {
                window.location.href = data.redirect;
            }, 1500);
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexion con el servidor");
    }
}

// ===============================
// OPCIONES POR CATEGORIA
// ===============================
const categoryOptions = {
    tacos: ["Cebolla", "Cilantro", "Limon", "Salsas"],

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

// ===============================
// PESTANAS
// ===============================
tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');

        const target = tab.dataset.target;

        menuItems.forEach(function(item) {
            item.style.display = (item.dataset.category === target) ? "flex" : "none";
        });
    });
});

menuItems.forEach(function(item) {
    if (item.dataset.category !== "tacos")
        item.style.display = "none";
});

// ===============================
// ABRIR / CERRAR CARRITO
// ===============================
cartBtn.addEventListener('click', function() { cartPanel.classList.toggle('open'); });
closeCart.addEventListener('click', function() { cartPanel.classList.remove('open'); });

// ===============================
// ABRIR PERSONALIZACION
// ===============================
document.querySelectorAll('.plus-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {

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

            opts.forEach(function(opt) {
                const label = document.createElement('label');
                label.innerHTML = '<input type="checkbox" value="' + opt + '"> ' + opt;
                customOptionsContainer.appendChild(label);
            });
        }

        customizationOverlay.classList.add('active');
    });
});

// ===============================
// CERRAR PERSONALIZACION
// ===============================
function closeCustomizationBox() {
    const box = document.querySelector('.customization-box');
    box.style.transform = 'scale(0.8)';
    box.style.opacity = '0';

    setTimeout(function() {
        customizationOverlay.classList.remove('active');
        box.style.transform = '';
        box.style.opacity = '';
    }, 300);
}

closeCustomization.addEventListener('click', closeCustomizationBox);

customizationOverlay.addEventListener('click', function(e) {
    if (e.target === customizationOverlay) closeCustomizationBox();
});

// ===============================
// AGREGAR AL CARRITO
// ===============================
addToCartBtn.addEventListener('click', function() {

    currentProduct.qty = parseInt(customQty.value);
    currentProduct.instructions = customInstructions.value;

    if (currentProduct.category !== 'bebidas') {
        currentProduct.options = Array
            .from(customOptionsContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(function(i) { return i.value; });
    }

    const existing = cart.find(function(item) {
        return item.name === currentProduct.name &&
        JSON.stringify(item.options) === JSON.stringify(currentProduct.options);
    });

    if (existing) {
        existing.qty += currentProduct.qty;
    } else {
        cart.push({ ...currentProduct });
    }

    updateCartUI();
    closeCustomizationBox();
});

// ===============================
// ACTUALIZAR CARRITO
// ===============================
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(function(item, idx) {
        total += item.price * item.qty;

        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = '<span class="name">' + item.name + (item.options && item.options.length ? ' (' + item.options.join(', ') + ')' : '') + '</span>' +
            '<div class="qty-controls">' +
            '<button class="minus">-</button>' +
            '<span>' + item.qty + '</span>' +
            '<button class="plus">+</button>' +
            '</div>' +
            '<span>$' + (item.price * item.qty).toFixed(2) + '</span>';

        div.querySelector('.plus').addEventListener('click', function() {
            item.qty++;
            updateCartUI();
        });

        div.querySelector('.minus').addEventListener('click', function() {
            item.qty--;
            if (item.qty <= 0) cart.splice(idx, 1);
            updateCartUI();
        });

        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
}

// ===============================
// BOTONES FLOTANTES
// ===============================
function mostrarBotonFlotanteLogin() {
    const btn = document.getElementById("btn-flotante-ubicacion");
    if (!btn) return;
    btn.classList.add("visible", "pulsar");
    btn.style.display = "block";
    btn.innerHTML = "Inicia Sesion";
    btn.onclick = mostrarModalLoginObligatorio;
}

function mostrarBotonFlotanteUbicacion() {
    const btn = document.getElementById("btn-flotante-ubicacion");
    if (!btn) return;
    btn.classList.add("visible", "pulsar");
    btn.style.display = "block";
    btn.innerHTML = "Validar Ubicacion";
    btn.onclick = mostrarModalUbicacion;
}

function ocultarBotonFlotanteUbicacion() {
    const btn = document.getElementById("btn-flotante-ubicacion");
    if (!btn) return;
    btn.classList.remove("visible", "pulsar");
    btn.style.display = "none";
}

// ===============================
// HABILITAR / DESHABILITAR BOTONES
// ===============================
function deshabilitarBotonesMenu() {
    console.log("🔒 Deshabilitando botones del menu...");
    const botones = document.querySelectorAll(".plus-btn");
    console.log("  Total de botones encontrados:", botones.length);
    
    botones.forEach(function(btn) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
        btn.style.pointerEvents = "none";
    });
    
    console.log("  ✅ Botones deshabilitados");
}

function habilitarBotonesMenu() {
    console.log("🔓 Habilitando botones del menu...");
    const botones = document.querySelectorAll(".plus-btn");
    console.log("  Total de botones encontrados:", botones.length);
    
    botones.forEach(function(btn) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.style.pointerEvents = "auto";
    });
    
    console.log("  ✅ Botones habilitados");
}

// ===============================
// MODAL UBICACION
// ===============================
function mostrarModalUbicacion() {
    console.log("Abriendo modal de ubicacion...");
    const modal = document.getElementById("modal-ubicacion");
    if (!modal) {
        console.error("No se encontro el modal de ubicacion");
        return;
    }
    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function cerrarModalUbicacion() {
    console.log("Cerrando modal de ubicacion...");
    const modal = document.getElementById("modal-ubicacion");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
    
    // ✅ VERIFICAR ESTADO DEL MENU AL CERRAR
    setTimeout(function() {
        console.log("Verificando estado del menu tras cerrar modal...");
        estadoInicialDelMenu();
    }, 300);
}

// ===============================
// EJECUCION INICIAL
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando MenuGeneral.js");
    
    estadoInicialDelMenu();

    document.querySelectorAll('.close-modal-ubicacion').forEach(function(btn) {
        btn.addEventListener("click", cerrarModalUbicacion);
    });

    const checkoutBtn = document.querySelector(".checkout");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
            const validacion = verificarSesionYUbicacion();
            if (!validacion.valido) {
                alert(validacion.mensaje);
                return;
            }

            if (cart.length === 0) {
                alert("Tu carrito esta vacio");
                return;
            }

            pagoProcesado = false;
            mostrarModalElegirUbicacion();
        });
    }

    document.querySelector(".close-payment")?.addEventListener("click", function() {
        document.getElementById("payment-modal").style.display = "none";
    });
});