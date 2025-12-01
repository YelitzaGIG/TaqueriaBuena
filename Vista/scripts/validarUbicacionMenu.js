// Vista/scripts/validarUbicacionMenu.js - VERSIÓN CORREGIDA

// ===============================
// VARIABLES GLOBALES (WINDOW)
// ===============================
window.mapData = {
    map: null,
    userMarker: null,
    taqueriaMarker: null,
    circle: null,
    ubicacionActual: null,
    mapaInicializado: false
};

// Coordenadas de la taqueria
const TAQUERIA = { lat: 20.186040, lng: -99.272593 };
const RADIUS_METERS = 3000; // 3 km de radio

// ===============================
// INICIALIZAR MAPA DE GOOGLE
// ===============================
function initMap() {
    console.log("🗺️ ===== INICIANDO MAPA DE GOOGLE MAPS =====");
    
    const mapElement = document.getElementById("map");
    
    if (!mapElement) {
        console.error("❌ NO SE ENCONTRÓ EL ELEMENTO #map EN EL DOM");
        return;
    }
    
    console.log("✅ Elemento #map encontrado:", mapElement);
    
    // Crear mapa
    window.mapData.map = new google.maps.Map(mapElement, {
        center: TAQUERIA,
        zoom: 14,
        mapTypeId: "roadmap",
        streetViewControl: false,
        fullscreenControl: false,
    });
    
    console.log("✅ Mapa de Google creado exitosamente");

    // Marcador de la taquería
    window.mapData.taqueriaMarker = new google.maps.Marker({
        position: TAQUERIA,
        map: window.mapData.map,
        title: "Taqueria Los de Cabeza",
        icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });

    // Círculo de cobertura
    window.mapData.circle = new google.maps.Circle({
        map: window.mapData.map,
        center: TAQUERIA,
        radius: RADIUS_METERS,
        fillColor: "#b8561d",
        fillOpacity: 0.15,
        strokeColor: "#b8561d",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        clickable: false,
    });

    // Autocompletado de búsqueda
    const input = document.getElementById("searchBox");
    if (input) {
        const autocomplete = new google.maps.places.Autocomplete(input, {
            fields: ["geometry", "formatted_address"],
        });
        
        autocomplete.bindTo("bounds", window.mapData.map);
        
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

    // Botón de geolocalización
    const geoBtn = document.getElementById("useLocationBtn");
    if (geoBtn) {
        console.log("✅ Botón 'Usar mi ubicación' encontrado");
        
        geoBtn.addEventListener("click", () => {
            console.log("🎯 ===== CLICK EN 'USAR MI UBICACIÓN' =====");
            
            if (!navigator.geolocation) {
                console.error("❌ Geolocalización no soportada");
                document.getElementById("mensaje-ubicacion").textContent =
                    "Tu navegador no soporta geolocalización.";
                return;
            }

            document.getElementById("mensaje-ubicacion").textContent = 
                "Obteniendo tu ubicación...";
            
            console.log("📡 Solicitando ubicación GPS...");

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    
                    console.log("✅ ===== UBICACIÓN GPS OBTENIDA =====");
                    console.log("   Latitud:", lat);
                    console.log("   Longitud:", lng);
                    console.log("   Precisión:", pos.coords.accuracy, "metros");
                    
                    obtenerDireccion(lat, lng);
                },
                (error) => {
                    console.error("❌ ===== ERROR AL OBTENER GPS =====");
                    console.error("   Código:", error.code);
                    console.error("   Mensaje:", error.message);
                    
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
    } else {
        console.error("❌ NO se encontró el botón #useLocationBtn");
    }

    // Click en el mapa
    window.mapData.map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        console.log("🖱️ ===== CLICK EN MAPA DETECTADO =====");
        console.log("   Latitud:", lat);
        console.log("   Longitud:", lng);
        obtenerDireccion(lat, lng);
    });

    // Botón para abrir Google Maps
    const openBtn = document.getElementById("openMapsBtn");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            if (window.mapData.ubicacionActual) {
                const origin = `${window.mapData.ubicacionActual.latitud},${window.mapData.ubicacionActual.longitud}`;
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

    window.mapData.mapaInicializado = true;
    console.log("✅ Mapa inicializado correctamente");
    console.log("✅ Variables globales configuradas en window.mapData");
}

// ===============================
// OBTENER DIRECCION DESDE COORDENADAS
// ===============================
function obtenerDireccion(lat, lng) {
    console.log("🌍 ===== OBTENIENDO DIRECCIÓN =====");
    console.log("   Input - Lat:", lat, "Lng:", lng);
    
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: lat, lng: lng };
    
    geocoder.geocode({ location: latlng }, (results, status) => {
        console.log("📍 Geocoding status:", status);
        
        if (status === "OK" && results[0]) {
            const direccion = results[0].formatted_address;
            console.log("✅ Dirección encontrada:", direccion);
            actualizarUbicacion(lat, lng, direccion);
        } else {
            console.warn("⚠️ No se pudo obtener la dirección. Status:", status);
            actualizarUbicacion(lat, lng, "Sin dirección disponible");
        }
    });
}

// ===============================
// ACTUALIZAR UBICACION EN EL MAPA
// ===============================
function actualizarUbicacion(lat, lng, direccion) {
    console.log("🔄 ===== ACTUALIZANDO UBICACIÓN =====");

    window.mapData.ubicacionActual = {
        latitud: lat,
        longitud: lng,
        direccion: direccion
    };

    if (!window.mapData.userMarker) {
        window.mapData.userMarker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: window.mapData.map,
            title: "Tu ubicación",
            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
        console.log("✅ Marcador azul creado");
    } else {
        window.mapData.userMarker.setPosition({ lat: lat, lng: lng });
        console.log("✅ Marcador azul actualizado");
    }

    window.mapData.map.setCenter({ lat: lat, lng: lng });
    window.mapData.map.setZoom(15);

    const distanciaMetros = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(lat, lng),
        new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng)
    );

    const km = (distanciaMetros / 1000).toFixed(2);
    const dentroRango = distanciaMetros <= RADIUS_METERS;

    window.mapData.ubicacionActual.dentro_rango = dentroRango;

    const mensajeEl = document.getElementById("mensaje-ubicacion");

    if (dentroRango) {
        mensajeEl.innerHTML = `✅ Estás a ${km} km de la taquería.<br>Dentro del área de entrega.`;
        mensajeEl.className = "status success";
    } else {
        mensajeEl.innerHTML = `❌ Estás a ${km} km de la taquería.<br>Fuera del área de entrega.`;
        mensajeEl.className = "status error";
    }

    console.log("✅ Ubicación actualizada y guardada en memoria:", window.mapData.ubicacionActual);
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
    
    // Verificación inmediata
    const verificar = localStorage.getItem(ubicacionKey);
    console.log("   🔍 Verificación:", verificar ? "✅ SÍ GUARDADO" : "❌ NO GUARDADO");
    
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
// 🔧 VALIDAR Y GUARDAR UBICACIÓN (FUNCIÓN GLOBAL)
// ===============================
window.validarYGuardarUbicacion = async function() {
    console.log("🎯 ===== FUNCIÓN VALIDAR Y GUARDAR EJECUTADA =====");
    
    // Verificar que existe ubicación actual
    if (!window.mapData.ubicacionActual) {
        console.error("❌ No hay ubicación actual seleccionada");
        console.log("   window.mapData.ubicacionActual:", window.mapData.ubicacionActual);
        alert("Por favor selecciona una ubicación en el mapa primero.\n\nPuedes:\n1. Hacer clic en el mapa\n2. Usar el botón 'Usar mi ubicación'\n3. Buscar una dirección");
        return;
    }
    
    const { latitud, longitud, direccion, dentro_rango } = window.mapData.ubicacionActual;
    
    console.log("📍 Datos de ubicación:");
    console.log("  - Latitud:", latitud);
    console.log("  - Longitud:", longitud);
    console.log("  - Dirección:", direccion);
    console.log("  - Dentro del rango:", dentro_rango);
    
    if (!dentro_rango) {
        console.warn("⚠️ Ubicación fuera del rango");
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
            console.log("✅ Servidor validó ubicación correctamente");
            
            // Guardar en localStorage
            const guardado = guardarUbicacionTemporal({
                latitud: latitud,
                longitud: longitud,
                direccion: direccion,
                dentro_rango: true
            });
            
            if (guardado) {
                console.log("💾 Ubicación guardada exitosamente en localStorage");
                
                cerrarModalUbicacion();
                
                alert("✅ Ubicación validada correctamente!\n\nAhora puedes hacer pedidos desde el menú.");
                
                // Recargar página para actualizar estado
                setTimeout(() => {
                    console.log("🔄 Recargando página...");
                    location.reload();
                }, 500);
                
            } else {
                console.error("❌ Error al guardar en localStorage");
                alert("⚠️ Error: Debes iniciar sesión primero");
            }
            
        } else {
            console.error("❌ Error en validación del servidor:", data);
            alert("❌ Error al validar ubicación: " + (data.message || "Error desconocido"));
        }
        
    } catch (error) {
        console.error("❌ Error al validar ubicación:", error);
        alert("❌ Error al validar la ubicación. Intenta de nuevo.");
    }
}

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 ===== validarUbicacionMenu.js - INICIADO =====");
    
    // Delegación de eventos para el botón de validar
    document.addEventListener("click", function(e) {
        if (e.target && (e.target.id === "btn-validar-ubicacion" || e.target.closest("#btn-validar-ubicacion"))) {
            console.log("🎯 ===== CLICK DETECTADO EN VALIDAR UBICACIÓN =====");
            e.preventDefault();
            e.stopPropagation();
            window.validarYGuardarUbicacion();
            return;
        }
        
        if (e.target && e.target.classList.contains("close-modal-ubicacion")) {
            console.log("❌ Click en cerrar modal");
            e.preventDefault();
            cerrarModalUbicacion();
            return;
        }
    });
    
    console.log("✅ Event listeners configurados");
});

// ===============================
// CALLBACK GLOBAL PARA GOOGLE MAPS
// ===============================
window.initMap = initMap;

console.log("✅ validarUbicacionMenu.js cargado correctamente");