// validarUbicacionMenu.js (COMPLETO Y CORREGIDO)
"use strict";

// CONFIG
const TAQUERIA = { lat: 20.186040, lng: -99.272593 };
const RADIUS_METERS = 3000;

let map, taqueriaMarker, userMarker = null, directionsService, directionsRenderer;
let ubicacionValidaEnModal = false;

// Inicializar mapa - callback Google Maps
function initMap() {
    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    map = new google.maps.Map(mapDiv, {
        center: TAQUERIA,
        zoom: 14,
        mapTypeId: "roadmap",
        streetViewControl: false,
        fullscreenControl: false
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: { strokeColor: "#b8561d", strokeOpacity: 0.8, strokeWeight: 5 }
    });
    directionsRenderer.setMap(map);

    taqueriaMarker = new google.maps.Marker({
        position: TAQUERIA,
        map,
        title: "Taquería",
        icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
    });

    new google.maps.Circle({
        map,
        center: TAQUERIA,
        radius: RADIUS_METERS,
        fillColor: "#b8561d",
        fillOpacity: 0.08,
        strokeColor: "#b8561d",
        strokeOpacity: 0.6,
        strokeWeight: 2,
        clickable: false
    });

    // Autocomplete
    const input = document.getElementById("searchBox");
    if (input && google.maps.places) {
        const autocomplete = new google.maps.places.Autocomplete(input, { fields: ["geometry", "formatted_address"] });
        autocomplete.bindTo("bounds", map);
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                setStatus("No se encontró la ubicación seleccionada.", "error");
                return;
            }
            handleUserLocation(place.geometry.location, place.formatted_address);
        });
    }

    // Botón: usar ubicación del dispositivo
    const geoBtn = document.getElementById("useLocationBtn");
    if (geoBtn) {
        geoBtn.addEventListener("click", () => {
            if (!navigator.geolocation) {
                setStatus("Tu navegador no soporta geolocalización.", "error");
                return;
            }
            navigator.geolocation.getCurrentPosition(
                pos => handleUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => setStatus("No se pudo obtener tu ubicación.", "error"),
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
            );
        });
    }

    // Click en el mapa
    map.addListener("click", (e) => {
        const loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        handleUserLocation(loc);
    });

    // Botón: validar ubicación
    const validarBtn = document.getElementById("btn-validar-ubicacion");
    if (validarBtn) {
        validarBtn.addEventListener("click", async () => {
            if (!userMarker) {
                alert("Selecciona una ubicación primero.");
                return;
            }

            const p = userMarker.getPosition();
            const lat = Number(p.lat());
            const lng = Number(p.lng());
            const direccion = document.getElementById("searchBox")?.value || `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

            let distanciaMetros;
            try {
                distanciaMetros = google.maps.geometry.spherical.computeDistanceBetween(
                    new google.maps.LatLng(lat, lng),
                    new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng)
                );
            } catch (e) {
                distanciaMetros = calcularDistancia(lat, lng, TAQUERIA.lat, TAQUERIA.lng);
            }

            const dentro = distanciaMetros <= RADIUS_METERS;

            // 🔥 CORREGIDO: ruta real de tu proyecto
            try {
                const resp = await fetch('/TaqueriaLaCruz/controlador/validarUbicacion.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ latitud: lat, longitud: lng, direccion, dentro_rango: dentro })
                });

                let data = null;
                try { data = await resp.json(); } catch (e) { data = null; }

                // 🔥 CORREGIDO: guardar SIEMPRE con la key correcta
                if (dentro) {
                    localStorage.setItem("ubicacion_validada", JSON.stringify({
                        latitud: lat,
                        longitud: lng,
                        direccion,
                        dentro_rango: true,
                        timestamp: new Date().toISOString()
                    }));

                    ubicacionValidaEnModal = true;
                    setStatus(`✅ Ubicación validada. Estás a ${(distanciaMetros / 1000).toFixed(2)} km.`, "success");

                    // Cerrar modal
                    setTimeout(() => {
                        document.getElementById("modal-ubicacion").classList.remove("active");
                        document.body.classList.remove("modal-open");
                    }, 700);

                } else {
                    setStatus(`❌ Fuera del área de entrega (${(distanciaMetros / 1000).toFixed(2)} km).`, "error");

                    localStorage.setItem("ubicacion_validada", JSON.stringify({
                        dentro_rango: false
                    }));

                    ubicacionValidaEnModal = false;

                    showRoute({ lat, lng });
                }
            } catch (err) {
                console.error("Error al validar con servidor:", err);
                setStatus("Error al validar con el servidor.", "error");
            }
        });
    }
}

// helpers
window.initMap = initMap;

function toLatLngObj(any) {
    if (!any) return null;
    try {
        if (typeof any.lat === "function" && typeof any.lng === "function") {
            return { lat: any.lat(), lng: any.lng() };
        }
        if (any.lat !== undefined && any.lng !== undefined) {
            return { lat: Number(any.lat), lng: Number(any.lng) };
        }
    } catch (err) { console.warn("Error coords:", err); }
    return null;
}

function setStatus(text, type = "info") {
    const statusEl = document.getElementById("mensaje-ubicacion") || document.getElementById("status");
    if (!statusEl) return;
    statusEl.className = `status ${type}`;
    statusEl.innerHTML = text;
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function handleUserLocation(rawLocation, formattedAddress = null) {
    const loc = toLatLngObj(rawLocation);
    if (!loc) { setStatus("Ubicación inválida.", "error"); return; }

    if (!userMarker) {
        userMarker = new google.maps.Marker({
            map,
            position: loc,
            title: "Tu ubicación seleccionada",
            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
    } else {
        userMarker.setPosition(loc);
    }

    map.panTo(loc);

    let distanciaMetros;
    try {
        distanciaMetros = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(loc.lat, loc.lng),
            new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng)
        );
    } catch (e) {
        distanciaMetros = calcularDistancia(loc.lat, loc.lng, TAQUERIA.lat, TAQUERIA.lng);
    }

    const km = (distanciaMetros / 1000).toFixed(2);

    if (distanciaMetros <= RADIUS_METERS) {
        setStatus(`Estás a ${km} km. Dentro del área de entrega.`, "success");
    } else {
        setStatus(`Estás a ${km} km. Fuera del área de entrega.`, "error");
        showRoute(loc);
    }
}

function showRoute(originObj) {
    const origin = toLatLngObj(originObj);
    if (!origin || !directionsService) return;

    directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng),
        travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
        } else {
            setStatus(`No se pudo generar la ruta (${status}).`, "error");
        }
    });
}
