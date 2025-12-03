// Vista/scripts/MenuGeneral.js - VERSIÓN CORREGIDA

// ===============================
// VARIABLES GLOBALES
// ===============================
let cart = [];
let currentProduct = null;
let pagoProcesado = false;

// Elementos del DOM (se inicializarán después)
let tabs, menuItems, cartBtn, cartPanel, closeCart, cartItemsContainer, cartTotal;
let customizationOverlay, closeCustomization, customImg, customName, customDesc;
let customInstructions, customQty, addToCartBtn, customOptionsContainer;

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

// ===============================
// INICIALIZAR ELEMENTOS DEL DOM
// ===============================
function inicializarElementosDOM() {
    console.log("🔧 Inicializando elementos del DOM...");
    
    tabs = document.querySelectorAll('.tab');
    menuItems = document.querySelectorAll('.menu-item');
    
    cartBtn = document.getElementById('cart-btn');
    cartPanel = document.getElementById('cart-panel');
    closeCart = document.getElementById('close-cart');
    cartItemsContainer = document.getElementById('cart-items');
    cartTotal = document.getElementById('cart-total');
    
    customizationOverlay = document.getElementById('customization-overlay');
    closeCustomization = document.getElementById('close-customization');
    customImg = document.getElementById('custom-img');
    customName = document.getElementById('custom-name');
    customDesc = document.getElementById('custom-desc');
    customInstructions = document.getElementById('custom-instructions');
    customQty = document.getElementById('custom-qty');
    addToCartBtn = document.getElementById('add-to-cart');
    customOptionsContainer = document.querySelector('.custom-options');
    
    console.log("✅ Elementos del DOM inicializados");
}

// ===================================
// INICIALIZAR PESTAÑAS
// ===================================
function inicializarPestanas() {
    console.log("🔧 Inicializando pestañas...");
    
    if (!tabs || tabs.length === 0) {
        console.error(" No se encontraron pestañas");
        return;
    }
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            console.log("📑 Click en pestaña:", tab.dataset.target);
            
            // Remover active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Agregar active a la pestaña clickeada
            tab.classList.add('active');
            
            const target = tab.dataset.target;
            
            // Mostrar/ocultar items del menú
            menuItems.forEach(item => {
                if (item.dataset.category === target) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
    
    // Mostrar solo tacos al inicio
    menuItems.forEach(item => {
        if (item.dataset.category !== "tacos") {
            item.style.display = "none";
        }
    });
    
    console.log("✅ Pestañas inicializadas correctamente");
}

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
    
    console.log("👤 Usuario:", usuario ? usuario.nombre : "ninguno");

    // 1️⃣ SIN USUARIO = DESHABILITAR TODO
    if (!usuario || !usuario.id) {
        console.log(" Sin usuario - Menu deshabilitado");
        deshabilitarBotonesMenu();
        mostrarBotonFlotanteLogin();
        return;
    }

    console.log("✅ Usuario encontrado:", usuario.nombre, "(ID:", usuario.id + ")");

    // 2️⃣ VERIFICAR UBICACION
    const ubicacion = obtenerUbicacionActual();
    
    console.log("📍 Ubicación:", ubicacion ? "encontrada" : "no encontrada");
    
    if (ubicacion) {
        console.log("  📌 Dirección:", ubicacion.direccion);
        console.log("  🗺️ Latitud:", ubicacion.latitud);
        console.log("  🗺️ Longitud:", ubicacion.longitud);
        console.log("  ✔️ Dentro del rango:", ubicacion.dentro_rango);
    }
    
    // 3️⃣ SIN UBICACION O FUERA DE RANGO = DESHABILITAR
    if (!ubicacion || ubicacion.dentro_rango === false) {
        console.log(" Sin ubicación válida o fuera de rango - Menu deshabilitado");
        deshabilitarBotonesMenu();
        mostrarBotonFlotanteUbicacion();
        
        // Mostrar modal solo una vez por sesión
        const flagModal = "modal_ubicacion_mostrado_" + usuario.id;
        if (!sessionStorage.getItem(flagModal)) {
            console.log("📢 Mostrando modal de ubicación (primera vez)");
            mostrarModalUbicacion();
            sessionStorage.setItem(flagModal, "1");
        }
        
        return;
    }

    // 4️⃣ TODO CORRECTO = HABILITAR MENU
    console.log("✅✅✅ TODO CORRECTO - HABILITANDO MENU");
    console.log("  👤 Usuario:", usuario.nombre);
    console.log("  📍 Ubicación:", ubicacion.direccion);
    console.log("  ✔️ Dentro del rango: SI");
    
    habilitarBotonesMenu();
    ocultarBotonFlotanteUbicacion();
    
    // Verificación final
    setTimeout(() => {
        const botones = document.querySelectorAll(".plus-btn");
        const habilitados = Array.from(botones).filter(btn => !btn.disabled).length;
        console.log(`  ✔️ Estado final: ${habilitados}/${botones.length} botones habilitados`);
        
        if (habilitados === botones.length) {
            console.log("  🎉 MENU COMPLETAMENTE HABILITADO");
        } else {
            console.warn("  ⚠️ Algunos botones no se habilitaron correctamente");
        }
    }, 200);
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
// MODALES
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
    console.log("✅ Usuario confirmó ubicación");
    
    const modal = document.getElementById('modal-elegir-ubicacion');
    if (modal) {
        modal.remove();
        console.log("  ✅ Modal de elegir ubicación cerrado");
    }
    
    // Abrir modal de pago
    const paymentModal = document.getElementById("payment-modal");
    if (paymentModal) {
        paymentModal.style.display = "flex";
        console.log("  ✅ Modal de pago abierto");
    } else {
        console.error("   No se encontró el modal de pago");
    }
}

function mostrarModalUbicacion() {
    console.log("🎯 ===== ABRIENDO MODAL DE UBICACIÓN =====");
    
    const modal = document.getElementById("modal-ubicacion");
    if (!modal) {
        console.error(" NO SE ENCONTRÓ EL MODAL #modal-ubicacion EN EL DOM");
        return;
    }
    
    console.log("✅ Modal encontrado, mostrando...");
    modal.classList.add("active");
    document.body.classList.add("modal-open");
    
    // Verificar si Google Maps está cargado
    console.log("🔍 Verificando Google Maps...");
    
    if (typeof google === 'undefined') {
        console.error(" Google Maps NO está cargado");
        console.log("📋 Estado de window.google:", typeof google);
        console.log("📋 Estado de window.initMap:", typeof window.initMap);
        
        // Mostrar mensaje al usuario
        const mensajeEl = document.getElementById("mensaje-ubicacion");
        if (mensajeEl) {
            mensajeEl.innerHTML = "⚠️ Cargando mapa... Por favor espera.";
            mensajeEl.className = "status info";
        }
        
        // Intentar inicializar después de un delay
        let intentos = 0;
        const maxIntentos = 20; // 10 segundos máximo
        
        const esperarGoogleMaps = setInterval(() => {
            intentos++;
            console.log(`⏳ Intento ${intentos}/${maxIntentos} - Esperando Google Maps...`);
            
            if (typeof google !== 'undefined' && google.maps) {
                console.log("✅ Google Maps finalmente cargado!");
                clearInterval(esperarGoogleMaps);
                
                // Inicializar el mapa
                if (typeof window.initMap === 'function') {
                    console.log("🗺️ Llamando a initMap()...");
                    window.initMap();
                } else {
                    console.error(" window.initMap no es una función");
                }
                
            } else if (intentos >= maxIntentos) {
                console.error(" TIMEOUT: Google Maps no cargó después de 10 segundos");
                clearInterval(esperarGoogleMaps);
                
                if (mensajeEl) {
                    mensajeEl.innerHTML = " Error al cargar el mapa. Recarga la página.";
                    mensajeEl.className = "status error";
                }
            }
        }, 500);
        
    } else {
        console.log("✅ Google Maps ya está disponible");
        
        // Verificar si el mapa ya está inicializado
        if (window.mapData && window.mapData.mapaInicializado) {
            console.log("✅ El mapa ya estaba inicializado");
        } else {
            console.log("🗺️ Inicializando mapa por primera vez...");
            if (typeof window.initMap === 'function') {
                window.initMap();
            } else {
                console.error(" window.initMap no existe");
            }
        }
    }
    
    console.log("✅ Modal abierto correctamente");
}

// ===============================
// CERRAR MODAL DE UBICACION
// ===============================
function cerrarModalUbicacion() {
    console.log(" Cerrando modal de ubicación...");
    
    const modal = document.getElementById("modal-ubicacion");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
        console.log("  ✅ Modal cerrado");
    }
    
    // Verificar estado del menú al cerrar
    setTimeout(function() {
        console.log("🔍 Verificando estado del menú tras cerrar modal...");
        estadoInicialDelMenu();
    }, 300);
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
// CREAR PEDIDO - VERSIÓN MEJORADA
// Reemplaza la función crearPedido() en MenuGeneral.js
// ===============================

async function crearPedido() {
    console.log("📝 ===== INICIANDO CREACIÓN DE PEDIDO =====");
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const ubicacion = obtenerUbicacionActual();

    if (!usuario || !ubicacion) {
        console.error(" Falta usuario u ubicación");
        alert("Error: falta usuario u ubicación");
        return;
    }

    console.log("👤 Usuario:", usuario.nombre, "(ID:", usuario.id + ")");
    console.log("📍 Ubicación:", ubicacion.direccion);

    const total = cart.reduce(function(acc, item) {
        return acc + (item.price * item.qty);
    }, 0);

    console.log("💰 Total calculado: $" + total);
    console.log("🛒 Productos en carrito:", cart.length);

    try {
        console.log("📤 Enviando petición a crearPedido.php...");
        
        const response = await fetch("../../Controlador/crearPedido.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                carrito: cart,
                ubicacion: ubicacion,
                total: total
            })
        });

        console.log("📥 Respuesta recibida, status:", response.status);

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const data = await response.json();
        console.log("📦 Datos del servidor:", data);

        if (data.ok) {
            console.log("✅ ===== PEDIDO CREADO EXITOSAMENTE =====");
            console.log("  🆔 Pedido ID:", data.pedido_id);
            console.log("  🔗 Redirect:", data.redirect);
            
            // Mostrar alerta de éxito
            alert("¡Pedido creado exitosamente! Serás redirigido al seguimiento.");
            
            // Limpiar carrito
            cart = [];
            updateCartUI();
            console.log("  🧹 Carrito limpiado");
            
            // Limpiar ubicación temporal
            limpiarUbicacionTemporal();
            console.log("  🧹 Ubicación temporal limpiada");
            
            // Cerrar modal de pago si está abierto
            const paymentModal = document.getElementById("payment-modal");
            if (paymentModal) {
                paymentModal.style.display = "none";
                console.log("  ✅ Modal de pago cerrado");
            }
            
            // Redirigir después de 2 segundos
            console.log("  🔄 Redirigiendo en 2 segundos...");
            setTimeout(function() {
                window.location.href = data.redirect;
            }, 2000);
            
        } else {
            console.error(" Error del servidor:", data.error);
            throw new Error(data.error || "Error desconocido al crear pedido");
        }
        
    } catch (error) {
        console.error(" ===== ERROR AL CREAR PEDIDO =====");
        console.error("  Tipo:", error.name);
        console.error("  Mensaje:", error.message);
        console.error("  Stack:", error.stack);
        
        alert("Error al crear el pedido: " + error.message + "\n\nPor favor, intenta de nuevo o contacta al soporte.");
    }
}

// ===============================
// FUNCIÓN AUXILIAR: LIMPIAR UBICACIÓN TEMPORAL
// ===============================
function limpiarUbicacionTemporal() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) {
        console.warn("  ⚠️ No hay usuario para limpiar ubicación");
        return;
    }
    
    const ubicacionKey = "ubicacion_temporal_" + usuario.id;
    localStorage.removeItem(ubicacionKey);
    
    console.log("  ✅ Ubicación temporal limpiada para usuario:", usuario.id);
}

console.log("✅ Función crearPedido() actualizada");





// ===============================
// INICIALIZAR CARRITO
// ===============================
function inicializarCarrito() {
    console.log("🔧 Inicializando carrito...");
    
    if (!cartBtn || !cartPanel || !closeCart) {
        console.error(" Elementos del carrito no encontrados");
        return;
    }
    
    cartBtn.addEventListener('click', function() { 
        cartPanel.classList.toggle('open'); 
    });
    
    closeCart.addEventListener('click', function() { 
        cartPanel.classList.remove('open'); 
    });
    
    console.log("✅ Carrito inicializado");
}

// ===============================
// INICIALIZAR PERSONALIZACION
// ===============================
function inicializarPersonalizacion() {
    console.log("🔧 Inicializando personalización...");
    
    // Abrir personalización
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

    // Cerrar personalización
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

    // Agregar al carrito
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
    
    console.log("✅ Personalización inicializada");
}

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
// HABILITAR/DESHABILITAR BOTONES
// ===============================
function habilitarBotonesMenu() {
    console.log("🔓 HABILITANDO BOTONES DEL MENÚ...");
    
    const botones = document.querySelectorAll(".plus-btn");
    console.log(`  📊 Total de botones encontrados: ${botones.length}`);
    
    if (botones.length === 0) {
        console.error("   NO SE ENCONTRARON BOTONES .plus-btn");
        return;
    }
    
    let contador = 0;
    botones.forEach(function(btn) {
        btn.removeAttribute("disabled");
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.style.pointerEvents = "auto";
        btn.style.filter = "none";
        btn.style.backgroundColor = "";
        contador++;
    });
    
    console.log(`  ✅ ${contador} botones habilitados exitosamente`);
}

function deshabilitarBotonesMenu() {
    console.log("🔒 DESHABILITANDO BOTONES DEL MENÚ...");
    
    const botones = document.querySelectorAll(".plus-btn");
    console.log(`  📊 Total de botones encontrados: ${botones.length}`);
    
    if (botones.length === 0) {
        console.error("   NO SE ENCONTRARON BOTONES .plus-btn");
        return;
    }
    
    let contador = 0;
    botones.forEach(function(btn) {
        btn.setAttribute("disabled", "true");
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
        btn.style.pointerEvents = "none";
        btn.style.filter = "grayscale(50%)";
        contador++;
    });
    
    console.log(`  ✅ ${contador} botones deshabilitados`);
}

// ===============================
// INICIALIZAR CHECKOUT
// ===============================
function inicializarCheckout() {
    console.log("🔧 Inicializando checkout...");
    
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
    
    console.log("✅ Checkout inicializado");
}

// ===============================
// INICIALIZAR MODAL UBICACION
// ===============================
function inicializarModalUbicacion() {
    console.log("🔧 Inicializando modal de ubicación...");
    
    document.querySelectorAll('.close-modal-ubicacion').forEach(function(btn) {
        btn.addEventListener("click", cerrarModalUbicacion);
    });
    
    console.log("✅ Modal de ubicación inicializado");
}

// ===============================
// EJECUCION INICIAL
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Inicializando MenuGeneral.js");
    
    // Inicializar elementos del DOM primero
    inicializarElementosDOM();
    
    // Esperar un momento para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
        console.log("🔍 Iniciando componentes del menú...");
        
        // Inicializar en orden
        inicializarPestanas();
        inicializarCarrito();
        inicializarPersonalizacion();
        inicializarCheckout();
        inicializarModalUbicacion();
        
        // Finalmente verificar estado del menú
        console.log("🔍 Ejecutando verificación inicial del menú...");
        estadoInicialDelMenu();
    }, 200);
});

// Hacer la función global para que sea accesible desde modales dinámicos
window.confirmarpedidoConUbicacion = confirmarpedidoConUbicacion;

// ===============================
// CREAR PEDIDO - VERSIÓN CORREGIDA
// Reemplaza la función crearPedido() en MenuGeneral.js
// ===============================

async function crearPedido(metodoPago = 'Efectivo') {
    console.log("📝 ===== INICIANDO CREACIÓN DE PEDIDO =====");
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const ubicacion = obtenerUbicacionActual();

    if (!usuario || !ubicacion) {
        console.error(" Falta usuario u ubicación");
        alert("Error: falta usuario u ubicación");
        throw new Error("Falta usuario u ubicación");
    }

    console.log("👤 Usuario:", usuario.nombre, "(ID:", usuario.id + ")");
    console.log("📍 Ubicación:", ubicacion.direccion);
    console.log("💳 Método de pago:", metodoPago);

    const total = cart.reduce(function(acc, item) {
        return acc + (item.price * item.qty);
    }, 0);

    console.log("💰 Total calculado: $" + total);
    console.log("🛒 Productos en carrito:", cart.length);

    try {
        console.log("📤 Enviando petición a crearPedido.php...");
        
        const response = await fetch("../../Controlador/crearPedido.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: 'same-origin', // ✅ IMPORTANTE: Enviar cookies de sesión
            body: JSON.stringify({
                carrito: cart,
                ubicacion: ubicacion,
                total: total,
                metodo_pago: metodoPago // ✅ Enviar método de pago
            })
        });

        console.log("📥 Respuesta recibida, status:", response.status);

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const data = await response.json();
        console.log("📦 Datos del servidor:", data);

        if (data.ok) {
            console.log("✅ ===== PEDIDO CREADO EXITOSAMENTE =====");
            console.log("  🆔 Pedido ID:", data.pedido_id);
            console.log("  🔗 Redirect:", data.redirect);
            
            // Limpiar carrito
            cart = [];
            updateCartUI();
            console.log("  🧹 Carrito limpiado");
            
            // Limpiar ubicación temporal
            limpiarUbicacionTemporal();
            console.log("  🧹 Ubicación temporal limpiada");
            
            // Cerrar modal de pago si está abierto
            const paymentModal = document.getElementById("payment-modal");
            if (paymentModal) {
                paymentModal.style.display = "none";
                console.log("  ✅ Modal de pago cerrado");
            }
            
            // Retornar el ID del pedido
            return data.pedido_id;
            
        } else {
            console.error(" Error del servidor:", data.error);
            
            // Si es error de sesión, redirigir a login
            if (data.error && data.error.includes("sesión")) {
                alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
                localStorage.removeItem('usuario');
                setTimeout(() => {
                    window.location.href = "../vistas/login.php";
                }, 1500);
                return null;
            }
            
            throw new Error(data.error || "Error desconocido al crear pedido");
        }
        
    } catch (error) {
        console.error(" ===== ERROR AL CREAR PEDIDO =====");
        console.error("  Tipo:", error.name);
        console.error("  Mensaje:", error.message);
        console.error("  Stack:", error.stack);
        
        throw error; // Re-lanzar el error para que lo maneje simularPagoYCrearPedido
    }
}

// ===============================
// FUNCIÓN AUXILIAR: LIMPIAR UBICACIÓN TEMPORAL
// ===============================
function limpiarUbicacionTemporal() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) {
        console.warn("No hay usuario para limpiar ubicación");
        return;
    }
    
    const ubicacionKey = "ubicacion_temporal_" + usuario.id;
    localStorage.removeItem(ubicacionKey);
    
    console.log("Ubicación temporal limpiada para usuario:", usuario.id);
}

console.log("✅ Función crearPedido() actualizada");