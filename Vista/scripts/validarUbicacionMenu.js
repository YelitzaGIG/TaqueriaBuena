// Vista/scripts/validarUbicacionMenu.js - COMPLETO Y CORREGIDO

// ===============================
// VARIABLES GLOBALES PARA EL MAPA
// ===============================
let map;
let userMarker = null;
let taqueriaMarker = null;
let circle = null;
let ubicacionActual = null;

// Coordenadas de la taqueria
const TAQUERIA = { lat: 20.186040, lng: -99.272593 };
const RADIUS_METERS = 3000; // 3 km de radio

// ===============================
// INICIALIZAR MAPA DE GOOGLE
// ===============================
function initMap() {
    console.log("Inicializando mapa...");
    
    // Crear mapa centrado inicialmente en la taqueria
    map = new google.maps.Map(document.getElementById("map"), {
        center: TAQUERIA,
        zoom: 14,
        mapTypeId: "roadmap",
        streetViewControl: false,
        fullscreenControl: false,
    });

    // Marcador de la taqueria (rojo)
    taqueriaMarker = new google.maps.Marker({
        position: TAQUERIA,
        map: map,
        title: "Taqueria Los de Cabeza",
        icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });

    // Circulo de area de entrega
    circle = new google.maps.Circle({
        map: map,
        center: TAQUERIA,
        radius: RADIUS_METERS,
        fillColor: "#b8561d",
        fillOpacity: 0.15,
        strokeColor: "#b8561d",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        clickable: false,
    });

    // Configurar busqueda de direcciones
    const input = document.getElementById("searchBox");
    if (input) {
        const autocomplete = new google.maps.places.Autocomplete(input, {
            fields: ["geometry", "formatted_address"],
        });
        
        autocomplete.bindTo("bounds", map);
        
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                document.getElementById("mensaje-ubicacion").textContent = 
                    "No se encontro la ubicacion seleccionada.";
                return;
            }
            
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const direccion = place.formatted_address || input.value;
            
            actualizarUbicacion(lat, lng, direccion);
        });
    }

    // Boton para usar ubicacion actual del GPS
    const geoBtn = document.getElementById("useLocationBtn");
    if (geoBtn) {
        geoBtn.addEventListener("click", () => {
            if (!navigator.geolocation) {
                document.getElementById("mensaje-ubicacion").textContent =
                    "Tu navegador no soporta geolocalizacion.";
                return;
            }

            // Mostrar mensaje de carga
            document.getElementById("mensaje-ubicacion").textContent = 
                "Obteniendo tu ubicacion...";

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    console.log("Ubicacion GPS obtenida:", lat, lng);
                    
                    // Obtener direccion aproximada con Geocoding
                    obtenerDireccion(lat, lng);
                },
                (error) => {
                    console.error("Error al obtener ubicacion GPS:", error);
                    document.getElementById("mensaje-ubicacion").textContent =
                        "No se pudo obtener tu ubicacion. Verifica los permisos.";
                },
                { 
                    enableHighAccuracy: true, 
                    maximumAge: 0, 
                    timeout: 10000 
                }
            );
        });
    }

    // Click en el mapa para seleccionar ubicacion manualmente
    map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        
        console.log("Click en mapa:", lat, lng);
        
        // Obtener direccion del punto clickeado
        obtenerDireccion(lat, lng);
    });

    // Boton para abrir en Google Maps
    const openBtn = document.getElementById("openMapsBtn");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            if (ubicacionActual) {
                const origin = `${ubicacionActual.latitud},${ubicacionActual.longitud}`;
                const dest = `${TAQUERIA.lat},${TAQUERIA.lng}`;
                window.open(
                    `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`,
                    "_blank"
                );
            } else {
                window.open(
                    `https://www.google.com/maps/search/?api=1&query=${TAQUERIA.lat},${TAQUERIA.lng}`,
                    "_blank"
                );
            }
        });
    }

    console.log("Mapa inicializado correctamente");
}

// ===============================
// OBTENER DIRECCION DESDE COORDENADAS
// ===============================
function obtenerDireccion(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: lat, lng: lng };
    
    geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
            const direccion = results[0].formatted_address;
            console.log("Direccion obtenida:", direccion);
            actualizarUbicacion(lat, lng, direccion);
        } else {
            console.warn("No se pudo obtener la direccion");
            actualizarUbicacion(lat, lng, "Sin direccion disponible");
        }
    });
}

// ===============================
// ACTUALIZAR UBICACION EN EL MAPA
// ===============================
function actualizarUbicacion(lat, lng, direccion) {
    console.log("Actualizando ubicacion:", { lat, lng, direccion });
    
    // Guardar ubicacion actual temporalmente
    ubicacionActual = {
        latitud: lat,
        longitud: lng,
        direccion: direccion
    };

    // Crear o actualizar marcador del usuario (azul)
    if (!userMarker) {
        userMarker = new google.maps.Marker({
            map: map,
            position: { lat: lat, lng: lng },
            title: "Tu ubicacion",
            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            draggable: true
        });
        
        // Permitir arrastrar el marcador
        userMarker.addListener("dragend", (e) => {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            console.log("Marcador arrastrado a:", newLat, newLng);
            obtenerDireccion(newLat, newLng);
        });
    } else {
        userMarker.setPosition({ lat: lat, lng: lng });
    }

    // Centrar mapa en la ubicacion del usuario
    map.setCenter({ lat: lat, lng: lng });
    map.setZoom(15);

    // Calcular distancia a la taqueria
    const distanciaMetros = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(lat, lng),
        new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng)
    );

    const km = (distanciaMetros / 1000).toFixed(2);
    const dentroRango = distanciaMetros <= RADIUS_METERS;
    
    ubicacionActual.dentro_rango = dentroRango;

    // Mostrar mensaje
    const mensajeEl = document.getElementById("mensaje-ubicacion");
    if (dentroRango) {
        mensajeEl.innerHTML = `✅ Estas a ${km} km de la taqueria.<br>Dentro del area de entrega.`;
        mensajeEl.className = "status success";
    } else {
        mensajeEl.innerHTML = `❌ Estas a ${km} km de la taqueria.<br>Fuera del area de entrega (maximo 3 km).`;
        mensajeEl.className = "status error";
    }

    // Actualizar input de busqueda
    const searchBox = document.getElementById("searchBox");
    if (searchBox) {
        searchBox.value = direccion;
    }

    console.log("Ubicacion actualizada:", ubicacionActual);
}

// ===============================
// GUARDAR UBICACION TEMPORAL
// ===============================
function guardarUbicacionTemporal(ubicacion) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) {
        console.error("No hay usuario para guardar ubicacion");
        return false;
    }
    
    const ubicacionKey = "ubicacion_temporal_" + usuario.id;
    localStorage.setItem(ubicacionKey, JSON.stringify(ubicacion));
    
    console.log("✅ Ubicacion guardada para usuario:", usuario.id);
    console.log("   Datos guardados:", ubicacion);
    
    return true;
}

// ===============================
// HABILITAR BOTONES DEL MENU
// ===============================
function habilitarBotonesMenu() {
    console.log("🔓 Habilitando botones del menu (desde validarUbicacionMenu.js)...");
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
// DESHABILITAR BOTONES DEL MENU
// ===============================
function deshabilitarBotonesMenu() {
    console.log("🔒 Deshabilitando botones del menu (desde validarUbicacionMenu.js)...");
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

// ===============================
// OCULTAR BOTON FLOTANTE
// ===============================
function ocultarBotonFlotanteUbicacion() {
    console.log("Ocultando boton flotante...");
    const btn = document.getElementById("btn-flotante-ubicacion");
    if (!btn) return;
    btn.classList.remove("visible", "pulsar");
    btn.style.display = "none";
}

// ===============================
// MOSTRAR BOTON FLOTANTE
// ===============================
function mostrarBotonFlotanteUbicacion() {
    console.log("Mostrando boton flotante...");
    const btn = document.getElementById("btn-flotante-ubicacion");
    if (!btn) return;
    btn.classList.add("visible", "pulsar");
    btn.style.display = "block";
    btn.innerHTML = "Validar Ubicacion";
    btn.onclick = function() {
        const modal = document.getElementById("modal-ubicacion");
        if (modal) {
            modal.classList.add("active");
            document.body.classList.add("modal-open");
        }
    };
}

// ===============================
// VALIDAR Y GUARDAR UBICACION
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    const btnValidarUbicacion = document.getElementById("btn-validar-ubicacion");
    
    if (btnValidarUbicacion) {
        btnValidarUbicacion.addEventListener("click", async function() {
            console.log("=== VALIDANDO UBICACION ===");
            
            if (!ubicacionActual) {
                alert("Por favor selecciona una ubicacion en el mapa");
                return;
            }
            
            const { latitud, longitud, direccion, dentro_rango } = ubicacionActual;
            
            console.log("Datos a validar:");
            console.log("  - Latitud:", latitud);
            console.log("  - Longitud:", longitud);
            console.log("  - Direccion:", direccion);
            console.log("  - Dentro del rango:", dentro_rango);
            
            if (!dentro_rango) {
                alert("⚠️ Tu ubicacion esta fuera de nuestro rango de entrega (maximo 3 km)");
                deshabilitarBotonesMenu();
                mostrarBotonFlotanteUbicacion();
                return;
            }
            
            try {
                console.log("Enviando ubicacion al servidor...");
                
                // Enviar ubicacion al servidor
                const response = await fetch("/TaqueriaBuenaV4/Controlador/validarUbicacion.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        latitud: latitud,
                        longitud: longitud,
                        direccion: direccion,
                        dentro_rango: dentro_rango
                    })
                });
                
                const data = await response.json();
                console.log("✅ Respuesta del servidor:", data);
                
                if (data.status === "success") {
                    console.log("✅ Ubicacion validada en servidor");
                    
                    // Guardar en localStorage
                    const guardado = guardarUbicacionTemporal({
                        latitud: latitud,
                        longitud: longitud,
                        direccion: direccion,
                        dentro_rango: true
                    });
                    
                    if (guardado) {
                        alert("✅ Ubicacion validada correctamente!\n\nAhora puedes hacer pedidos desde el menu.");
                        
                        // Cerrar modal
                        cerrarModalUbicacion();
                        
                        // ✅ HABILITAR MENU COMPLETAMENTE
                        habilitarBotonesMenu();
                        ocultarBotonFlotanteUbicacion();
                        
                        // ✅ FORZAR VERIFICACION DEL ESTADO
                        setTimeout(function() {
                            if (typeof estadoInicialDelMenu === 'function') {
                                console.log("Ejecutando estadoInicialDelMenu()...");
                                estadoInicialDelMenu();
                            }
                        }, 100);
                        
                        console.log("✅✅✅ Menu habilitado - ubicacion dentro del rango");
                    } else {
                        alert("⚠️ Error: Debes iniciar sesion primero");
                        deshabilitarBotonesMenu();
                        if (typeof mostrarBotonFlotanteLogin === 'function') {
                            mostrarBotonFlotanteLogin();
                        }
                    }
                    
                } else {
                    console.error("❌ Error en validacion del servidor");
                    alert("❌ Error al validar ubicacion en el servidor");
                    deshabilitarBotonesMenu();
                }
                
            } catch (error) {
                console.error("❌ Error validando ubicacion:", error);
                alert("❌ Error al validar la ubicacion. Intenta de nuevo.");
                deshabilitarBotonesMenu();
            }
        });
    }
});

// ===============================
// CERRAR MODAL DE UBICACION
// ===============================
function cerrarModalUbicacion() {
    console.log("Cerrando modal de ubicacion...");
    const modal = document.getElementById("modal-ubicacion");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
    
    // ✅ VERIFICAR ESTADO DEL MENU AL CERRAR
    setTimeout(function() {
        if (typeof estadoInicialDelMenu === 'function') {
            console.log("Verificando estado del menu tras cerrar modal...");
            estadoInicialDelMenu();
        }
    }, 300);
}

// ===============================
// LOGICA ADICIONAL
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando validarUbicacionMenu.js");

    // Cerrar modales
    document.querySelectorAll('.close-modal-ubicacion').forEach(function(btn) {
        btn.addEventListener("click", cerrarModalUbicacion);
    });

    // Modal de telefono
    const phoneBtn = document.querySelector(".boton-telefono");
    const modal = document.getElementById("telefonoModal");
    const closeModal = document.querySelector(".close");

    if (phoneBtn && modal && closeModal) {
        phoneBtn.addEventListener("click", function() { modal.style.display = "block"; });
        closeModal.addEventListener("click", function() { modal.style.display = "none"; });

        window.addEventListener("click", function(e) {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    // Validacion de contrasena
    const passwordInput = document.getElementById("password");
    const passwordMessage = document.getElementById("passwordMessage");

    if (passwordInput && passwordMessage) {
        passwordInput.addEventListener("input", function() {
            const pass = passwordInput.value;
            const errores = [];

            if (pass.length < 8) errores.push("minimo 8 caracteres");
            if (!/[A-Z]/.test(pass)) errores.push("una mayuscula");
            if (!/[a-z]/.test(pass)) errores.push("una minuscula");
            if (!/[0-9]/.test(pass)) errores.push("un numero");
            if (!/[!@#$%^&*]/.test(pass)) errores.push("un simbolo (!@#$%^&*)");

            if (errores.length > 0) {
                passwordMessage.textContent = "Falta: " + errores.join(", ");
                passwordMessage.style.color = "red";
            } else {
                passwordMessage.textContent = "Contrasena correcta";
                passwordMessage.style.color = "#235b0f";
            }
        });
    }

    // Login con telefono
    const telefonoForm = document.getElementById("telefonoForm");
    const loginInput = document.getElementById("celular");

    if (telefonoForm && passwordInput) {
        telefonoForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const loginValor = loginInput.value.trim();
            const password = passwordInput.value.trim();

            if (!loginValor) {
                alert("Ingresa un numero de celular o usuario.");
                return;
            }

            const esTelefono = /^[0-9]{10}$/.test(loginValor);
            if (!esTelefono && loginValor.length < 3) {
                alert("Ingresa un numero valido o un usuario (minimo 3 letras).");
                return;
            }

            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
            if (!passRegex.test(password)) {
                alert("La contrasena no cumple los requisitos.");
                return;
            }

            fetch("/TaqueriaBuenaV4/Controlador/CLoginNormal.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario_o_telefono: loginValor,
                    contrasena: password
                })
            })
                .then(function(res) { return res.json(); })
                .then(function(respuesta) {
                    if (respuesta.status === "ok") {
                        const usuario = {
                            id: respuesta.usuario.id,
                            nombre: respuesta.usuario.nombre,
                            correo: respuesta.usuario.correo || null,
                            telefono: respuesta.usuario.telefono || null,
                            metodo: "Normal",
                            inicial: (respuesta.usuario.nombre || "").charAt(0).toUpperCase(),
                            foto: null
                        };

                        localStorage.setItem("usuario", JSON.stringify(usuario));
                        localStorage.removeItem("modal_mostrado");

                        console.log("Usuario guardado:", usuario.nombre);

                        alert("Bienvenido " + usuario.nombre);
                        if (modal) modal.style.display = "none";
                        window.location.href = "../../index.php";
                    } else {
                        alert(respuesta.mensaje || "Error en el inicio de sesion.");
                    }
                })
                .catch(function(err) {
                    console.error("Error login normal:", err);
                });
        });
    }
});

// ===============================
// CALLBACK GLOBAL PARA GOOGLE MAPS
// ===============================
window.initMap = initMap;

// ===============================
// CALLBACK PARA LOGIN CON GOOGLE
// ===============================
window.handleCredentialResponse = function (response) {
    console.log("Respuesta de Google recibida");
    const data = parseJwt(response.credential);

    const usuarioGoogle = {
        nombre: data.name,
        email: data.email,
        google_id: data.sub,
        foto: data.picture
    };

    fetch("/TaqueriaBuenaV4/Controlador/CLoginGoogle.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioGoogle)
    })
        .then(function(res) {
            const ctype = res.headers.get("content-type");
            if (!ctype || !ctype.includes("application/json")) {
                throw new TypeError("Respuesta no es JSON valido");
            }
            return res.json();
        })
        .then(function(respuesta) {
            console.log("Respuesta del servidor:", JSON.stringify(respuesta));

            if (!respuesta || typeof respuesta !== "object") {
                alert("Respuesta invalida del servidor.");
                return;
            }

            if (respuesta.status === "error") {
                console.error("Error servidor:", respuesta.mensaje);
                alert("Error: " + (respuesta.mensaje || "Error en el servidor"));
                return;
            }

            if ((respuesta.status === "existe" || respuesta.status === "nuevo") &&
                respuesta.usuario && respuesta.usuario.id) {

                const usuario = {
                    id: respuesta.usuario.id,
                    nombre: respuesta.usuario.nombre || usuarioGoogle.nombre,
                    inicial: (respuesta.usuario.nombre || usuarioGoogle.nombre).charAt(0).toUpperCase(),
                    correo: respuesta.usuario.email || usuarioGoogle.email || null,
                    email: respuesta.usuario.email || usuarioGoogle.email || null,
                    foto: usuarioGoogle.foto || null,
                    metodo: "Google"
                };

                localStorage.setItem("usuario", JSON.stringify(usuario));
                localStorage.removeItem("modal_mostrado");

                console.log("Usuario guardado:", usuario.nombre);

                alert("Bienvenido " + usuario.nombre);
                window.location.href = "../../index.php";
                return;
            }

            console.error("La respuesta no contiene usuario.id:", JSON.stringify(respuesta));
            alert("No se pudo completar el registro.");
        })
        .catch(function(error) {
            console.error("Error en login Google:", error);
            alert("Ocurrio un error en la comunicacion con el servidor.");
        });
};

function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function(c) { return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2); })
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar JWT:", e);
        return null;
    }
}