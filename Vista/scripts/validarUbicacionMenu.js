// Vista/scripts/validarUbicacionMenu.js - VERSIÓN FINAL SIN DUPLICADOS

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
    console.log("🗺️ Inicializando mapa de Google Maps...");
    
    map = new google.maps.Map(document.getElementById("map"), {
        center: TAQUERIA,
        zoom: 14,
        mapTypeId: "roadmap",
        streetViewControl: false,
        fullscreenControl: false,
    });

    taqueriaMarker = new google.maps.Marker({
        position: TAQUERIA,
        map: map,
        title: "Taqueria Los de Cabeza",
        icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });

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
                    "No se encontró la ubicación seleccionada.";
                return;
            }
            
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const direccion = place.formatted_address || input.value;
            
            actualizarUbicacion(lat, lng, direccion);
        });
    }

    const geoBtn = document.getElementById("useLocationBtn");
    if (geoBtn) {
        geoBtn.addEventListener("click", () => {
            if (!navigator.geolocation) {
                document.getElementById("mensaje-ubicacion").textContent =
                    "Tu navegador no soporta geolocalización.";
                return;
            }

            document.getElementById("mensaje-ubicacion").textContent = 
                "Obteniendo tu ubicación...";

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    console.log("📍 Ubicación GPS obtenida:", lat, lng);
                    obtenerDireccion(lat, lng);
                },
                (error) => {
                    console.error("❌ Error al obtener ubicación GPS:", error);
                    document.getElementById("mensaje-ubicacion").textContent =
                        "No se pudo obtener tu ubicación. Verifica los permisos.";
                },
                { 
                    enableHighAccuracy: true, 
                    maximumAge: 0, 
                    timeout: 10000 
                }
            );
        });
    }

    map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        console.log("🖱️ Click en mapa:", lat, lng);
        obtenerDireccion(lat, lng);
    });

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

    console.log("✅ Mapa inicializado correctamente");
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
            console.log("📍 Dirección obtenida:", direccion);
            actualizarUbicacion(lat, lng, direccion);
        } else {
            console.warn("⚠️ No se pudo obtener la dirección");
            actualizarUbicacion(lat, lng, "Sin dirección disponible");
        }
    });
}

// ===============================
// ACTUALIZAR UBICACION EN EL MAPA
// ===============================
function actualizarUbicacion(lat, lng, direccion) {
    console.log("🔄 Actualizando ubicación:", { lat, lng, direccion });
    
    ubicacionActual = {
        latitud: lat,
        longitud: lng,
        direccion: direccion
    };

    if (!userMarker) {
        userMarker = new google.maps.Marker({
            map: map,
            position: { lat: lat, lng: lng },
            title: "Tu ubicación",
            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            draggable: true
        });
        
        userMarker.addListener("dragend", (e) => {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            console.log("🖱️ Marcador arrastrado a:", newLat, newLng);
            obtenerDireccion(newLat, newLng);
        });
    } else {
        userMarker.setPosition({ lat: lat, lng: lng });
    }

    map.setCenter({ lat: lat, lng: lng });
    map.setZoom(15);

    const distanciaMetros = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(lat, lng),
        new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng)
    );

    const km = (distanciaMetros / 1000).toFixed(2);
    const dentroRango = distanciaMetros <= RADIUS_METERS;
    
    ubicacionActual.dentro_rango = dentroRango;

    const mensajeEl = document.getElementById("mensaje-ubicacion");
    if (dentroRango) {
        mensajeEl.innerHTML = `✅ Estás a ${km} km de la taquería.<br>Dentro del área de entrega.`;
        mensajeEl.className = "status success";
    } else {
        mensajeEl.innerHTML = `❌ Estás a ${km} km de la taquería.<br>Fuera del área de entrega (máximo 3 km).`;
        mensajeEl.className = "status error";
    }

    const searchBox = document.getElementById("searchBox");
    if (searchBox) {
        searchBox.value = direccion;
    }

    console.log("✅ Ubicación actualizada:", ubicacionActual);
}

// ===============================
// GUARDAR UBICACION TEMPORAL
// ===============================
function guardarUbicacionTemporal(ubicacion) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario || !usuario.id) {
        console.error("❌ No hay usuario para guardar ubicación");
        return false;
    }
    
    const ubicacionKey = "ubicacion_temporal_" + usuario.id;
    localStorage.setItem(ubicacionKey, JSON.stringify(ubicacion));
    
    console.log("✅ Ubicación guardada para usuario:", usuario.id);
    console.log("   📦 Datos guardados:", ubicacion);
    
    return true;
}

// ===============================
// CERRAR MODAL DE UBICACION
// ===============================
function cerrarModalUbicacion() {
    console.log("❌ Cerrando modal de ubicación...");
    
    const modal = document.getElementById("modal-ubicacion");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
        console.log("  ✅ Modal cerrado");
    }
}

// ===============================
// INICIALIZACIÓN Y EVENT LISTENERS
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Inicializando validarUbicacionMenu.js");
    
    // ✅ VERIFICAR BOTÓN DE VALIDACIÓN
    setTimeout(() => {
        const btnValidar = document.getElementById("btn-validar-ubicacion");
        if (btnValidar) {
            console.log("✅ Botón de validación encontrado");
        } else {
            console.error("❌ NO se encontró el botón btn-validar-ubicacion");
        }
    }, 1000);

    // ✅ EVENT LISTENER PARA VALIDAR UBICACIÓN
    const btnValidarUbicacion = document.getElementById("btn-validar-ubicacion");
    
    if (btnValidarUbicacion) {
        console.log("🔧 Agregando event listener al botón de validación...");
        
        btnValidarUbicacion.addEventListener("click", async function() {
            console.log("🎯 CLICK DETECTADO EN VALIDAR UBICACIÓN");
            console.log("=== INICIANDO VALIDACIÓN DE UBICACIÓN ===");
            
            if (!ubicacionActual) {
                alert("Por favor selecciona una ubicación en el mapa");
                return;
            }
            
            const { latitud, longitud, direccion, dentro_rango } = ubicacionActual;
            
            console.log("📍 Datos a validar:");
            console.log("  - Latitud:", latitud);
            console.log("  - Longitud:", longitud);
            console.log("  - Dirección:", direccion);
            console.log("  - Dentro del rango:", dentro_rango);
            
            if (!dentro_rango) {
                alert("⚠️ Tu ubicación está fuera de nuestro rango de entrega (máximo 3 km)");
                return;
            }
            
            try {
                console.log("📤 Enviando ubicación al servidor...");
                
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
                console.log("📥 Respuesta del servidor:", data);
                
                if (data.status === "success") {
                    console.log("✅ Servidor validó ubicación");
                    
                    const guardado = guardarUbicacionTemporal({
                        latitud: latitud,
                        longitud: longitud,
                        direccion: direccion,
                        dentro_rango: true
                    });
                    
                    if (guardado) {
                        console.log("💾 Ubicación guardada en localStorage");
                        
                        // Verificar guardado
                        const verificacion = localStorage.getItem("ubicacion_temporal_" + JSON.parse(localStorage.getItem('usuario')).id);
                        console.log("🔍 Verificando guardado:", verificacion ? "✅ SÍ" : "❌ NO");
                        
                        cerrarModalUbicacion();
                        
                        alert("✅ Ubicación validada correctamente!\n\nAhora puedes hacer pedidos desde el menú.");
                        
                        // Recargar para actualizar estado
                        setTimeout(() => {
                            location.reload();
                        }, 500);
                        
                    } else {
                        alert("⚠️ Error: Debes iniciar sesión primero");
                    }
                    
                } else {
                    console.error("❌ Error en validación del servidor");
                    alert("❌ Error al validar ubicación en el servidor");
                }
                
            } catch (error) {
                console.error("❌ Error validando ubicación:", error);
                alert("❌ Error al validar la ubicación. Intenta de nuevo.");
            }
        });
        
        console.log("✅ Event listener agregado correctamente");
    } else {
        console.error("❌ NO SE PUDO AGREGAR EVENT LISTENER - Botón no encontrado");
    }

    // Cerrar modales
    document.querySelectorAll('.close-modal-ubicacion').forEach(function(btn) {
        btn.addEventListener("click", cerrarModalUbicacion);
    });
});

// ===============================
// CALLBACK GLOBAL PARA GOOGLE MAPS
// ===============================
window.initMap = initMap;