// validarUbicacionMenu.js - Sistema de validación de ubicación mejorado
const TAQUERIA = { lat: 20.186040, lng: -99.272593 };
const RADIUS_METERS = 3000;

let map, userMarker = null, directionsService, directionsRenderer;
let ubicacionValidada = false;
let ubicacionActual = null;
let esInvitado = true;

// ========================================
// INICIALIZAR MAPA
// ========================================
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: TAQUERIA,
        zoom: 15,
        mapTypeId: "roadmap",
        streetViewControl: false,
        fullscreenControl: false
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
            strokeColor: "#b8561d",
            strokeOpacity: 0.8,
            strokeWeight: 5
        }
    });
    directionsRenderer.setMap(map);

    // Marcador de la taquería
    new google.maps.Marker({
        position: TAQUERIA,
        map,
        title: "Taquería La Cruz",
        icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
    });

    // Círculo de área de entrega
    new google.maps.Circle({
        map,
        center: TAQUERIA,
        radius: RADIUS_METERS,
        fillColor: "#b8561d",
        fillOpacity: 0.15,
        strokeColor: "#b8561d",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        clickable: false
    });

    // Autocomplete para búsqueda
    configurarAutocomplete();

    // Clic en mapa
    map.addListener("click", (e) => {
        manejarUbicacion({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    });

    // Botón de geolocalización
    document.getElementById("btn-obtener-ubicacion")?.addEventListener("click", obtenerUbicacionDispositivo);
}

// ========================================
// CONFIGURAR AUTOCOMPLETE
// ========================================
function configurarAutocomplete() {
    const input = document.getElementById("searchBox");
    if (!input) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ["geometry", "formatted_address"],
        componentRestrictions: { country: "mx" }
    });

    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
            manejarUbicacion({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            });
        }
    });
}

// ========================================
// OBTENER UBICACIÓN DEL DISPOSITIVO
// ========================================
function obtenerUbicacionDispositivo() {
    const btn = document.getElementById("btn-obtener-ubicacion");

    if (!navigator.geolocation) {
        mostrarMensaje("❌ Tu navegador no soporta geolocalización", "error");
        return;
    }

    // Estado de carga
    btn.disabled = true;
    btn.textContent = "⏳ Obteniendo ubicación...";
    mostrarMensaje("Esperando permiso de ubicación...", "info");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            btn.disabled = false;
            btn.textContent = "📍 Usar mi ubicación actual";
            manejarUbicacion({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        },
        (error) => {
            btn.disabled = false;
            btn.textContent = "🔄 Reintentar ubicación";
            
            let mensaje = "❌ No se pudo obtener tu ubicación. ";
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    mensaje += "Por favor, permite el acceso a tu ubicación en tu navegador.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensaje += "La ubicación no está disponible en este momento.";
                    break;
                case error.TIMEOUT:
                    mensaje += "Tiempo de espera agotado. Intenta de nuevo.";
                    break;
            }
            mostrarMensaje(mensaje, "error");
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// ========================================
// MANEJAR UBICACIÓN SELECCIONADA
// ========================================
function manejarUbicacion(coordenadas) {
    const { lat, lng } = coordenadas;

    // Actualizar o crear marcador del usuario
    if (!userMarker) {
        userMarker = new google.maps.Marker({
            position: { lat, lng },
            map,
            title: "Tu ubicación",
            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            animation: google.maps.Animation.DROP
        });
    } else {
        userMarker.setPosition({ lat, lng });
        userMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => userMarker.setAnimation(null), 750);
    }

    map.setCenter({ lat, lng });
    map.setZoom(16);

    // Validar distancia
    validarDistancia(lat, lng);
}

// ========================================
// VALIDAR DISTANCIA Y RANGO
// ========================================
function validarDistancia(lat, lng) {
    const ubicacionUsuario = new google.maps.LatLng(lat, lng);
    const ubicacionTaqueria = new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng);
    
    const distanciaMetros = google.maps.geometry.spherical.computeDistanceBetween(
        ubicacionUsuario,
        ubicacionTaqueria
    );

    const km = (distanciaMetros / 1000).toFixed(2);
    const dentroRango = distanciaMetros <= RADIUS_METERS;

    ubicacionActual = {
        lat,
        lng,
        distancia: km,
        dentro_rango: dentroRango,
        timestamp: new Date().toISOString()
    };

    // Configurar botón de confirmar
    const btnConfirmar = document.getElementById("btn-confirmar-ubicacion");
    
    if (dentroRango) {
        mostrarMensaje(
            `✅ ¡Excelente! Estás a ${km} km de nosotros.\n\n${esInvitado ? '🔐 Inicia sesión y confirma tu ubicación para hacer pedidos.' : 'Ahora confirma tu ubicación para continuar.'}`,
            "success"
        );
        
        if (btnConfirmar) {
            btnConfirmar.disabled = false;
            btnConfirmar.classList.add("enabled");
            btnConfirmar.style.display = "block";
        }

        // Limpiar rutas si estaban mostradas
        if (directionsRenderer) {
            directionsRenderer.setDirections({ routes: [] });
        }

    } else {
        const exceso = (parseFloat(km) - 3).toFixed(2);
        mostrarMensaje(
            `❌ Lo sentimos, estás a ${km} km de distancia.\n\nEstás fuera del área de entrega por ${exceso} km adicionales (máx. 3 km).`,
            "error"
        );
        
        if (btnConfirmar) {
            btnConfirmar.disabled = true;
            btnConfirmar.classList.remove("enabled");
            btnConfirmar.style.display = "block";
        }
        
        // Mostrar ruta al negocio
        mostrarRuta({ lat, lng });
    }
}

// ========================================
// MOSTRAR RUTA EN EL MAPA
// ========================================
function mostrarRuta(origen) {
    directionsRenderer.setDirections({ routes: [] });

    directionsService.route(
        {
            origin: new google.maps.LatLng(origen.lat, origen.lng),
            destination: new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng),
            travelMode: google.maps.TravelMode.DRIVING
        },
        (resultado, estado) => {
            if (estado === "OK") {
                directionsRenderer.setDirections(resultado);
            }
        }
    );
}

// ========================================
// MOSTRAR MENSAJES EN EL MODAL
// ========================================
function mostrarMensaje(texto, tipo = "info") {
    const mensajeEl = document.getElementById("mensaje-ubicacion");
    if (!mensajeEl) return;

    mensajeEl.textContent = texto;
    mensajeEl.className = "status";
    
    switch(tipo) {
        case "success":
            mensajeEl.classList.add("success");
            break;
        case "error":
            mensajeEl.classList.add("error");
            break;
        default:
            mensajeEl.classList.add("info");
    }
}

// ========================================
// GUARDAR UBICACIÓN VALIDADA
// ========================================
function guardarUbicacionValidada(datos) {
    try {
        localStorage.setItem("ubicacion_validada", JSON.stringify(datos));
        
        // También enviar al servidor
        enviarUbicacionAlServidor(datos);
        
        // Actualizar estado visual
        actualizarIndicadorEstado();
    } catch (error) {
        console.error("Error al guardar ubicación:", error);
    }
}

// ========================================
// ENVIAR UBICACIÓN AL SERVIDOR
// ========================================
async function enviarUbicacionAlServidor(datos) {
    try {
        const response = await fetch("../Controlador/validarUbicacion.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                latitud: datos.lat,
                longitud: datos.lng,
                dentro_rango: datos.dentro_rango,
                direccion: null
            })
        });

        const resultado = await response.json();
        console.log("Respuesta del servidor:", resultado);
    } catch (error) {
        console.error("Error al comunicarse con el servidor:", error);
    }
}

// ========================================
// GESTIÓN DEL MODAL
// ========================================
function mostrarModal() {
    const modal = document.getElementById("modal-ubicacion");
    if (modal) {
        modal.classList.add("active");
        document.body.classList.add("modal-open");
        
        // Resetear el botón de confirmar
        const btnConfirmar = document.getElementById("btn-confirmar-ubicacion");
        if (btnConfirmar) {
            btnConfirmar.style.display = "none";
            btnConfirmar.disabled = true;
            btnConfirmar.classList.remove("enabled");
        }
        
        // Ocultar botón flotante
        const btnFlotante = document.getElementById("btn-flotante-ubicacion");
        if (btnFlotante) {
            btnFlotante.classList.remove("visible");
        }
    }
}

function cerrarModal() {
    const modal = document.getElementById("modal-ubicacion");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
        
        // Mostrar botón flotante
        const btnFlotante = document.getElementById("btn-flotante-ubicacion");
        if (btnFlotante) {
            btnFlotante.classList.add("visible");
            
            // Si no hay ubicación validada, hacerlo pulsar
            if (!ubicacionValidada) {
                btnFlotante.classList.add("pulsar");
            } else {
                btnFlotante.classList.remove("pulsar");
            }
        }
    }
}

// ========================================
// HABILITAR/DESHABILITAR BOTONES
// ========================================
function habilitarBotonesPedido() {
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.title = 'Agregar al carrito';
    });
}

function deshabilitarBotonesPedido() {
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.title = esInvitado ? 'Inicia sesión para hacer pedidos' : 'Debes validar tu ubicación primero';
    });
}

// ========================================
// VERIFICAR UBICACIÓN AL CARGAR
// ========================================
function verificarUbicacionGuardada() {
    try {
        const ubicacionGuardada = localStorage.getItem("ubicacion_validada");
        
        if (ubicacionGuardada) {
            const datos = JSON.parse(ubicacionGuardada);
            
            // Verificar que no sea muy antigua (24 horas)
            const timestamp = new Date(datos.timestamp);
            const ahora = new Date();
            const horasDiferencia = (ahora - timestamp) / (1000 * 60 * 60);
            
            if (horasDiferencia > 24 || !datos.dentro_rango) {
                localStorage.removeItem("ubicacion_validada");
                return false;
            }
            
            ubicacionValidada = true;
            return true;
        }
        
        return false;
    } catch (error) {
        console.error("Error al verificar ubicación guardada:", error);
        return false;
    }
}

// ========================================
// VERIFICAR SESIÓN
// ========================================
function verificarSesion() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    esInvitado = usuario === null;
    return !esInvitado;
}

// ========================================
// ACTUALIZAR INDICADOR DE ESTADO
// ========================================
function actualizarIndicadorEstado() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada') || 'null');
    const indicador = document.getElementById('estado-pedido');
    const btnFlotante = document.getElementById('btn-flotante-ubicacion');
    
    if (!indicador) return;
    
    if (!usuario) {
        indicador.innerHTML = '👤 <strong>Modo invitado</strong> - Inicia sesión para ordenar';
        indicador.className = 'estado-pedido estado-invitado';
        
        if (btnFlotante) {
            btnFlotante.classList.add('visible', 'pulsar');
        }
    } else if (!ubicacion || !ubicacion.dentro_rango) {
        indicador.innerHTML = '📍 <strong>¡Valida tu ubicación!</strong> - Click aquí';
        indicador.className = 'estado-pedido estado-sin-ubicacion';
        indicador.style.cursor = 'pointer';
        
        if (btnFlotante) {
            btnFlotante.classList.add('visible', 'pulsar');
        }
    } else {
        indicador.innerHTML = `✅ <strong>Listo para ordenar</strong> - A ${ubicacion.distancia} km`;
        indicador.className = 'estado-pedido estado-listo';
        indicador.style.cursor = 'default';
        
        if (btnFlotante) {
            btnFlotante.classList.add('visible');
            btnFlotante.classList.remove('pulsar');
        }
    }
}

// ========================================
// ACTUALIZAR ALERTA DE INVITADO
// ========================================
function actualizarAlertaInvitado() {
    const alertaInvitado = document.getElementById("alerta-invitado");
    if (!alertaInvitado) return;
    
    if (esInvitado) {
        alertaInvitado.style.display = "block";
    } else {
        alertaInvitado.style.display = "none";
    }
}

// ========================================
// CONFIRMACIÓN DE UBICACIÓN
// ========================================
function confirmarUbicacion() {
    if (!ubicacionActual) {
        mostrarMensaje("⚠️ Por favor selecciona primero tu ubicación", "error");
        return;
    }

    const btnConfirmar = document.getElementById("btn-confirmar-ubicacion");
    if (btnConfirmar) {
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = "✓ Confirmando...";
    }

    // Verificar sesión antes de confirmar
    if (esInvitado) {
        const redirigir = confirm(
            "🔐 Necesitas iniciar sesión para confirmar tu ubicación y hacer pedidos.\n\n¿Deseas ir al inicio de sesión?"
        );
        
        if (redirigir) {
            // Guardar ubicación temporalmente
            sessionStorage.setItem("ubicacion_pendiente", JSON.stringify(ubicacionActual));
            window.location.href = '../vistas/login.php';
        } else {
            if (btnConfirmar) {
                btnConfirmar.disabled = false;
                btnConfirmar.textContent = "✓ Confirmar mi ubicación";
            }
        }
        return;
    }

    // Usuario con sesión: confirmar y guardar
    if (ubicacionActual.dentro_rango) {
        ubicacionValidada = true;
        guardarUbicacionValidada(ubicacionActual);
        
        mostrarMensaje(
            "✅ ¡Ubicación confirmada! Ya puedes hacer pedidos.",
            "success"
        );
        
        setTimeout(() => {
            cerrarModal();
            habilitarBotonesPedido();
            actualizarIndicadorEstado();
        }, 1500);
    } else {
        mostrarMensaje(
            "❌ No puedes confirmar esta ubicación porque está fuera del área de entrega.",
            "error"
        );
        if (btnConfirmar) {
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = "✓ Confirmar mi ubicación";
        }
    }
}

// ========================================
// VALIDAR AL HACER CLIC EN BOTÓN "+"
// ========================================
function validarAntesDeAgregar() {
    if (esInvitado) {
        const redirigir = confirm(
            "🔐 Para hacer pedidos necesitas iniciar sesión.\n\n¿Deseas iniciar sesión ahora?"
        );
        
        if (redirigir) {
            window.location.href = '../vistas/login.php';
        }
        return false;
    }

    if (!ubicacionValidada) {
        mostrarModal();
        mostrarMensaje(
            "📍 Por favor valida tu ubicación para poder agregar productos al carrito.",
            "info"
        );
        return false;
    }

    return true;
}

// ========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    // Verificar sesión
    const tieneSesion = verificarSesion();
    
    // Actualizar UI según estado
    actualizarAlertaInvitado();
    actualizarIndicadorEstado();
    
    if (esInvitado) {
        // MODO INVITADO: Puede ver el menú pero no ordenar
        deshabilitarBotonesPedido();
        console.log("👤 Navegando como invitado");
    } else {
        // Usuario con sesión: verificar ubicación
        const tieneUbicacionValida = verificarUbicacionGuardada();

        if (tieneUbicacionValida) {
            habilitarBotonesPedido();
        } else {
            deshabilitarBotonesPedido();
            
            // Mostrar modal automáticamente después de 3 segundos
            setTimeout(() => {
                mostrarModal();
            }, 3000);
        }
    }

    // Verificar si hay ubicación pendiente (después de login)
    const ubicacionPendiente = sessionStorage.getItem("ubicacion_pendiente");
    if (ubicacionPendiente && tieneSesion) {
        sessionStorage.removeItem("ubicacion_pendiente");
        mostrarModal();
        
        const datos = JSON.parse(ubicacionPendiente);
        setTimeout(() => {
            manejarUbicacion(datos);
        }, 500);
    }

    // Interceptar clics en botones "+"
    document.querySelectorAll('.plus-btn').forEach(btn => {
        const clickOriginal = btn.onclick;
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (validarAntesDeAgregar()) {
                if (clickOriginal) {
                    clickOriginal.call(this, e);
                }
            }
        };
    });

    // Botón de cerrar modal
    const btnCerrar = document.querySelector(".close-modal-ubicacion");
    btnCerrar?.addEventListener("click", cerrarModal);

    // Botón de confirmar ubicación
    const btnConfirmar = document.getElementById("btn-confirmar-ubicacion");
    btnConfirmar?.addEventListener("click", confirmarUbicacion);

    // Botón flotante
    const btnFlotante = document.getElementById("btn-flotante-ubicacion");
    btnFlotante?.addEventListener("click", () => {
        mostrarModal();
    });

    // Click en indicador de estado
    const indicador = document.getElementById("estado-pedido");
    indicador?.addEventListener("click", () => {
        if (indicador.classList.contains("estado-sin-ubicacion")) {
            mostrarModal();
        }
    });

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById("modal-ubicacion");
    modal?.addEventListener("click", (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });
});

// Exportar función para uso global
window.initMap = initMap;