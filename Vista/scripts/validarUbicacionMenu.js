// Vista/scripts/validarUbicacionMenu.js
// Este script se ejecuta SOLO en MenuGeneral.php

const TAQUERIA = { lat: 20.186040, lng: -99.272593 };
const RADIUS_METERS = 3000;

let ubicacionValidada = false;
let googleMapsLoaded = false;

// Esperar a que Google Maps se cargue
window.initMap = function() {
    googleMapsLoaded = true;
    console.log('Google Maps cargado correctamente');
};

// Verificar si el usuario ya tiene ubicación validada en localStorage
function verificarUbicacionPrevia() {
    const ubicacion = JSON.parse(localStorage.getItem('ubicacion_validada'));
    
    console.log('Ubicación previa en localStorage:', ubicacion);
    
    if (ubicacion && ubicacion.dentro_rango) {
        console.log('✅ Ubicación previamente validada');
        ubicacionValidada = true;
        habilitarBotonesMenu();
        return true;
    }
    console.log('❌ No hay ubicación validada previa');
    return false;
}

// Mostrar modal de ubicación
function mostrarModalUbicacion() {
    const modal = document.getElementById('modal-ubicacion');
    if (modal) {
        console.log('Mostrando modal de ubicación');
        modal.style.display = 'flex';
    } else {
        console.error('❌ Modal de ubicación no encontrado en el DOM');
    }
}

// Cerrar modal
function cerrarModalUbicacion() {
    const modal = document.getElementById('modal-ubicacion');
    if (modal) {
        console.log('Cerrando modal de ubicación');
        modal.style.display = 'none';
    }
}

// Obtener ubicación del usuario
async function obtenerUbicacion() {
    const btnUbicar = document.getElementById('btn-obtener-ubicacion');
    const mensaje = document.getElementById('mensaje-ubicacion');
    
    console.log('Iniciando obtención de ubicación...');
    
    btnUbicar.disabled = true;
    btnUbicar.textContent = '⏳ Obteniendo ubicación...';
    mensaje.textContent = 'Por favor, permite el acceso a tu ubicación';
    mensaje.style.color = '#666';

    if (!navigator.geolocation) {
        mensaje.textContent = '❌ Tu navegador no soporta geolocalización';
        mensaje.style.color = 'red';
        btnUbicar.disabled = false;
        btnUbicar.textContent = '📍 Obtener mi ubicación';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            console.log('📍 Ubicación obtenida:', lat, lng);
            await validarUbicacion(lat, lng);
        },
        (error) => {
            console.error('❌ Error de geolocalización:', error);
            let mensajeError = '';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    mensajeError = '❌ Permiso denegado. Habilita la ubicación en tu navegador.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensajeError = '❌ Ubicación no disponible. Intenta de nuevo.';
                    break;
                case error.TIMEOUT:
                    mensajeError = '❌ Tiempo agotado. Intenta de nuevo.';
                    break;
                default:
                    mensajeError = '❌ Error desconocido. Intenta de nuevo.';
            }
            
            mensaje.textContent = mensajeError;
            mensaje.style.color = 'red';
            btnUbicar.disabled = false;
            btnUbicar.textContent = '📍 Reintentar';
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Validar si la ubicación está dentro del rango
async function validarUbicacion(lat, lng) {
    const mensaje = document.getElementById('mensaje-ubicacion');
    const btnUbicar = document.getElementById('btn-obtener-ubicacion');
    
    console.log('Validando ubicación:', lat, lng);
    
    // Calcular distancia
    const distancia = calcularDistancia(lat, lng, TAQUERIA.lat, TAQUERIA.lng);
    const dentroRango = distancia <= RADIUS_METERS;
    
    const km = (distancia / 1000).toFixed(2);
    
    console.log(`Distancia calculada: ${km} km, Dentro de rango: ${dentroRango}`);
    
    if (dentroRango) {
        mensaje.textContent = `✅ ¡Perfecto! Estás a ${km} km. Dentro del área de entrega.`;
        mensaje.style.color = 'green';
        
        // Obtener dirección aproximada
        let direccion = `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        // Esperar a que Google Maps esté cargado
        if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
            try {
                const geocoder = new google.maps.Geocoder();
                const result = await new Promise((resolve, reject) => {
                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            resolve(results[0].formatted_address);
                        } else {
                            reject(status);
                        }
                    });
                });
                direccion = result;
                console.log('Dirección obtenida:', direccion);
            } catch (e) {
                console.warn('No se pudo obtener la dirección:', e);
            }
        }
        
        // Enviar al backend para validar
        try {
            const respuesta = await fetch('/TaqueriaBuena/controlador/validarUbicacion.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitud: lat,
                    longitud: lng,
                    direccion: direccion,
                    dentro_rango: true
                })
            });
            
            const data = await respuesta.json();
            console.log('Respuesta del servidor:', data);
            
            if (data.status === 'success') {
                // Guardar en localStorage
                const ubicacionData = {
                    latitud: lat,
                    longitud: lng,
                    direccion: direccion,
                    dentro_rango: true,
                    timestamp: new Date().getTime()
                };
                
                localStorage.setItem('ubicacion_validada', JSON.stringify(ubicacionData));
                console.log('✅ Ubicación guardada en localStorage:', ubicacionData);
                
                ubicacionValidada = true;
                
                setTimeout(() => {
                    cerrarModalUbicacion();
                    habilitarBotonesMenu();
                    alert('✅ Ubicación validada correctamente. Ya puedes hacer pedidos.');
                }, 1500);
            } else {
                throw new Error(data.mensaje || 'Error al validar ubicación');
            }
        } catch (error) {
            console.error('Error al enviar ubicación al servidor:', error);
            mensaje.textContent = '❌ Error al validar con el servidor. Intenta de nuevo.';
            mensaje.style.color = 'red';
            btnUbicar.disabled = false;
            btnUbicar.textContent = '🔄 Intentar de nuevo';
        }
        
    } else {
        mensaje.textContent = `❌ Lo sentimos, estás a ${km} km. Fuera del área de entrega (máx. 3 km).`;
        mensaje.style.color = 'red';
        
        // Guardar que está fuera de rango
        localStorage.setItem('ubicacion_validada', JSON.stringify({
            dentro_rango: false,
            timestamp: new Date().getTime()
        }));
        
        btnUbicar.disabled = false;
        btnUbicar.textContent = '🔄 Intentar de nuevo';
        
        // Enviar al servidor que está fuera de rango
        try {
            await fetch('/TaqueriaBuena/controlador/validarUbicacion.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    latitud: lat,
                    longitud: lng,
                    direccion: 'Fuera de rango',
                    dentro_rango: false
                })
            });
        } catch (e) {
            console.warn('No se pudo notificar al servidor:', e);
        }
    }
}

// Calcular distancia en metros (Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Habilitar todos los botones "+"
function habilitarBotonesMenu() {
    console.log('✅ Habilitando botones del menú');
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    });
}

// Deshabilitar todos los botones "+"
function deshabilitarBotonesMenu() {
    console.log('🔒 Deshabilitando botones del menú');
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando validarUbicacionMenu.js');
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    console.log('Usuario en localStorage:', usuario);
    
    // Verificar si el usuario está logueado
    if (!usuario) {
        console.warn('⚠️ No hay usuario logueado');
        alert('Debes iniciar sesión para acceder al menú');
        window.location.href = '../vistas/login.php';
        return;
    }
    
    // Deshabilitar botones por defecto
    deshabilitarBotonesMenu();
    
    // Verificar si ya tiene ubicación validada
    if (!verificarUbicacionPrevia()) {
        console.log('Mostrando modal porque no hay ubicación validada');
        // Esperar un poco para asegurar que el DOM esté completamente cargado
        setTimeout(() => {
            mostrarModalUbicacion();
        }, 500);
    }
    
    // Configurar botón de obtener ubicación
    const btnUbicar = document.getElementById('btn-obtener-ubicacion');
    if (btnUbicar) {
        console.log('✅ Botón de ubicación encontrado');
        btnUbicar.addEventListener('click', obtenerUbicacion);
    } else {
        console.error('❌ No se encontró el botón btn-obtener-ubicacion');
    }
    
    // Botón de cerrar modal
    const btnCerrar = document.querySelector('.close-modal-ubicacion');
    if (btnCerrar) {
        console.log('✅ Botón de cerrar modal encontrado');
        btnCerrar.addEventListener('click', () => {
            if (ubicacionValidada) {
                cerrarModalUbicacion();
            } else {
                alert('⚠️ Debes validar tu ubicación para hacer pedidos');
            }
        });
    } else {
        console.error('❌ No se encontró el botón close-modal-ubicacion');
    }
    
    // Botón flotante de ubicación (opcional)
    const btnFlotanteUbicacion = document.getElementById('btn-flotante-ubicacion');
    if (btnFlotanteUbicacion) {
        btnFlotanteUbicacion.addEventListener('click', () => {
            mostrarModalUbicacion();
        });
    }
});