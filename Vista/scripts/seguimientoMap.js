// ===============================
// OPTIMIZACIÓN TOTAL: Google Maps - BAJO COSTO
// Solo 1 llamada a Directions API por pedido
// Animación suave con interpolación
// ===============================

let map;
let directionsRenderer;
let clienteMarker, repartidorMarker, taqueriaMarker;
let route = []; // Array de puntos (lat/lng)
let currentIndex = 0;
let animFrame = null;
let rutaCalculada = false;
let animacionActiva = false;

// Para animación suave (interpolación)
let subSteps = 0;
const SUBSTEPS_POR_PUNTO = 20; // Más pasos = más suave

const RADIUS_METERS = 3000;
const ARRIVAL_THRESHOLD_METERS = 50;
let lastPollTime = 0;
const POLL_INTERVAL = 10000;

// ===============================
// 1️⃣ INICIALIZAR MAPA
// ===============================
async function initMap() {
  console.log("🗺️ Inicializando mapa...");
  
  if (!document.getElementById('map')) {
    console.error("❌ No existe elemento #map");
    return;
  }

  // Validar coordenadas del cliente
  if (!clientePos || !isFinite(clientePos.lat) || !isFinite(clientePos.lng)) {
    console.warn("⚠️ Coordenadas del cliente inválidas, usando TAQUERIA");
    clientePos = { ...TAQUERIA };
  }

  console.log("📍 Posiciones iniciales:", {
    cliente: clientePos,
    repartidor: repartidorPos,
    estado: estadoActual
  });

  // Crear mapa
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: clientePos,
    mapTypeId: "roadmap",
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false
  });

  // Cargar iconos
  const iconTaqueria = '/TaqueriaBuenaV4/vista/images/pin_taquera.png';
  const iconRepartidor = '/TaqueriaBuenaV4/vista/images/pin_repartidor.png';
  const iconCliente = '/TaqueriaBuenaV4/vista/images/pin_cliente.png';

  const [taqIcon, repIcon, cliIcon] = await Promise.all([
    testIcon(iconTaqueria),
    testIcon(iconRepartidor),
    testIcon(iconCliente)
  ]);

  // Marcadores
  taqueriaMarker = new google.maps.Marker({
    position: TAQUERIA,
    map,
    title: "Taquería La Cruz",
    icon: taqIcon || "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
  });

  clienteMarker = new google.maps.Marker({
    position: clientePos,
    map,
    title: "Tu ubicación",
    icon: cliIcon || "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
  });

  repartidorMarker = new google.maps.Marker({
    position: repartidorPos,
    map,
    title: "Repartidor",
    icon: repIcon || "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    zIndex: 1000
  });

  // DirectionsRenderer
  directionsRenderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: true,
    suppressInfoWindows: true,
    preserveViewport: false,
    polylineOptions: {
      strokeColor: "#b8561d",
      strokeWeight: 4,
      strokeOpacity: 0.7
    }
  });

  console.log("✅ Mapa inicializado");
  
  // Actualizar UI inicial
  actualizarUI();

  // Si el pedido ya está en camino, calcular ruta e iniciar animación
  if (estadoActual === "en_camino") {
    console.log("🚗 Estado inicial es 'en_camino', iniciando flujo...");
    const rutaOk = await calcularRuta();
    
    if (rutaOk && route.length > 0) {
      console.log("✅ Ruta lista, iniciando animación...");
      startMoverRepartidor();
    } else {
      console.error("❌ No se pudo calcular la ruta o ruta vacía");
    }
  } else {
    console.log("⏳ Estado inicial:", estadoActual, "- Esperando 'en_camino'");
  }

  // Iniciar polling
  console.log("⏰ Iniciando polling...");
  setTimeout(pollLoop, 3000);
}

// ===============================
// 2️⃣ CALCULAR RUTA (UNA SOLA VEZ)
// ===============================
async function calcularRuta() {
  if (rutaCalculada) {
    console.log("⏭️ Ruta ya calculada, reutilizando...");
    return true;
  }

  console.log("🌐 Calculando ruta (ÚNICA llamada a Directions API)...");
  console.log("   Origen:", repartidorPos);
  console.log("   Destino:", clientePos);
  
  setStatusMessage("Calculando ruta...");

  return new Promise((resolve) => {
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: new google.maps.LatLng(repartidorPos.lat, repartidorPos.lng),
        destination: new google.maps.LatLng(clientePos.lat, clientePos.lng),
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false
      },
      (result, status) => {
        console.log("📡 Respuesta de Directions API:", status);
        
        if (status === "OK" && result.routes.length > 0) {
          console.log("✅ Ruta obtenida del servidor");

          // Dibujar ruta en el mapa
          directionsRenderer.setDirections(result);

          // Extraer puntos de la ruta
          route = result.routes[0].overview_path.map(p => ({
            lat: p.lat(),
            lng: p.lng()
          }));
          
          console.log(`📍 Puntos de ruta: ${route.length}`);

          rutaCalculada = true;
          currentIndex = 0;
          subSteps = 0;

          // Mostrar tiempo estimado
          const leg = result.routes[0].legs[0];
          if (leg) {
            const tiempoTexto = `Tiempo estimado: ${leg.duration.text} (${leg.distance.text})`;
            document.getElementById("tiempo").textContent = tiempoTexto;
            console.log("⏱️", tiempoTexto);
            setStatusMessage("Repartidor en camino 🚗");
          }

          resolve(true);
        } else {
          console.error("❌ Error en Directions API:", status);
          document.getElementById("tiempo").textContent = `No se pudo calcular la ruta`;
          setStatusMessage("Error calculando ruta ⚠️");
          resolve(false);
        }
      }
    );
  });
}

// ===============================
// 3️⃣ ANIMAR REPARTIDOR (CON INTERPOLACIÓN SUAVE)
// ===============================
function moverRepartidor() {
  if (!route || route.length === 0) {
    console.warn("⚠️ No hay ruta disponible para animar");
    animacionActiva = false;
    return;
  }

  if (!animacionActiva) {
    console.log("⏸️ Animación pausada por flag");
    return;
  }

  // Si ya llegó al destino
  if (currentIndex >= route.length - 1 && subSteps >= SUBSTEPS_POR_PUNTO) {
    console.log("🎯 ¡Repartidor llegó al destino!");
    animacionActiva = false;
    
    const distanciaFinal = calcularDistancia(repartidorPos, clientePos);
    console.log(`📏 Distancia final: ${distanciaFinal.toFixed(2)}m`);
    
    if (estadoActual === "en_camino") {
      console.log("📦 Cambiando estado a 'entregado'");
      setStatusMessage("¡Pedido entregado! 🎉");
      postActualizarEstado("entregado");
    }
    return;
  }

  // Interpolación suave entre puntos
  if (subSteps >= SUBSTEPS_POR_PUNTO) {
    // Avanzar al siguiente punto
    currentIndex++;
    subSteps = 0;
    
    if (currentIndex % 5 === 0) {
      console.log(`🚗 Progreso: ${currentIndex}/${route.length} puntos (${Math.round(currentIndex/route.length*100)}%)`);
    }
  }

  if (currentIndex >= route.length - 1) {
    // Último punto
    repartidorPos.lat = route[route.length - 1].lat;
    repartidorPos.lng = route[route.length - 1].lng;
    repartidorMarker.setPosition(repartidorPos);
    subSteps = SUBSTEPS_POR_PUNTO; // Forzar fin
    actualizarBarraProgreso();
    
    // Continuar para detectar llegada
    animFrame = setTimeout(moverRepartidor, 50);
    return;
  }

  // Interpolación lineal entre currentIndex y currentIndex + 1
  const puntoActual = route[currentIndex];
  const puntoSiguiente = route[currentIndex + 1];
  const t = subSteps / SUBSTEPS_POR_PUNTO; // 0 a 1

  repartidorPos.lat = puntoActual.lat + (puntoSiguiente.lat - puntoActual.lat) * t;
  repartidorPos.lng = puntoActual.lng + (puntoSiguiente.lng - puntoActual.lng) * t;
  
  repartidorMarker.setPosition(repartidorPos);
  subSteps++;

  // Actualizar barra de progreso
  actualizarBarraProgreso();

  // Verificar si está cerca del cliente
  const distanciaAlCliente = calcularDistancia(repartidorPos, clientePos);
  if (distanciaAlCliente <= ARRIVAL_THRESHOLD_METERS && estadoActual === "en_camino") {
    console.log(`🎯 Repartidor a ${distanciaAlCliente.toFixed(2)}m del cliente - ¡Entregando!`);
    animacionActiva = false;
    setStatusMessage("¡Pedido entregado! 🎉");
    postActualizarEstado("entregado");
    return;
  }

  // Continuar animación (más rápido = más suave)
  const velocidadMs = 30; // 30ms = ~33 fps
  animFrame = setTimeout(moverRepartidor, velocidadMs);
}

function startMoverRepartidor() {
  console.log("🚀 Iniciando animación del repartidor");

  if (estadoActual !== "en_camino") {
    console.warn("❌ Estado no es 'en_camino'");
    return;
  }

  if (!route || route.length === 0) {
    console.error("❌ No hay ruta");
    return;
  }

  if (animacionActiva) {
    console.log("⏭️ Ya está activa");
    return;
  }

  console.log("✅ Iniciando movimiento...");
  animacionActiva = true;
  currentIndex = 0;
  subSteps = 0;
  setStatusMessage("Repartidor en camino 🚗");
  moverRepartidor();
}

function stopMoverRepartidor() {
  console.log("⏹️ Deteniendo animación...");
  if (animFrame) {
    clearTimeout(animFrame);
    animFrame = null;
  }
  animacionActiva = false;
  console.log("✅ Animación detenida");
}

// ===============================
// 4️⃣ BARRA DE PROGRESO
// ===============================
function actualizarBarraProgreso() {
  if (!route || route.length === 0) return;

  const porcentaje = Math.min(100, Math.round(
    (currentIndex / (route.length - 1)) * 100
  ));
  
  const barra = document.getElementById("barra-progreso");
  if (barra) {
    barra.style.width = porcentaje + "%";
  }
}

// ===============================
// 5️⃣ POLLING
// ===============================
async function pollLoop() {
  const ahora = Date.now();
  
  if (ahora - lastPollTime >= POLL_INTERVAL) {
    lastPollTime = ahora;

    try {
      // Detectar la ruta base correcta
      const baseUrl = window.location.pathname.includes('TaqueriaBuenaV4') 
        ? '/TaqueriaBuenaV4' 
        : '/TaqueriaLaCruz';
      
      const response = await fetch(
        `${baseUrl}/controlador/obtenerEstado.php?pedido_id=${PEDIDO_ID}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        console.warn("⚠️ Error en polling:", response.status);
        setTimeout(pollLoop, 5000);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Respuesta no es JSON:", text.substring(0, 200));
        setTimeout(pollLoop, 5000);
        return;
      }

      const info = await response.json();
      console.log("📊 Polling - Estado servidor:", info.estadopedido);

      // Actualizar posición del cliente si cambió
      if (info.latitud && info.longitud) {
        const newLat = Number(info.latitud);
        const newLng = Number(info.longitud);

        if (isFinite(newLat) && isFinite(newLng)) {
          const cambioSignificativo = 
            Math.abs(clientePos.lat - newLat) > 0.001 ||
            Math.abs(clientePos.lng - newLng) > 0.001;

          if (cambioSignificativo) {
            console.log("📍 Cliente cambió de ubicación");
            clientePos.lat = newLat;
            clientePos.lng = newLng;
            clienteMarker.setPosition(clientePos);

            if (estadoActual === "en_camino") {
              console.log("🔄 Recalculando ruta...");
              stopMoverRepartidor();
              rutaCalculada = false;
              currentIndex = 0;
              route = [];
              
              const rutaOk = await calcularRuta();
              if (rutaOk) {
                startMoverRepartidor();
              }
            }
          }
        }
      }

      // Actualizar estado si cambió
      if (info.estadopedido !== estadoActual) {
        const estadoAnterior = estadoActual;
        estadoActual = info.estadopedido;
        
        console.log(`🔄 Cambio de estado: ${estadoAnterior} → ${estadoActual}`);
        actualizarUI();

        if (estadoActual === "en_camino" && estadoAnterior !== "en_camino") {
          console.log("🚗 Iniciando entrega...");
          const rutaOk = await calcularRuta();
          if (rutaOk) {
            startMoverRepartidor();
          }
        } else if (estadoActual !== "en_camino") {
          stopMoverRepartidor();
        }
      }

    } catch (error) {
      console.error("❌ Error en polling:", error);
    }
  }

  setTimeout(pollLoop, 1000);
}

// ===============================
// 6️⃣ ACTUALIZAR UI
// ===============================
function actualizarUI() {
  const estadoEl = document.getElementById("estado-texto");
  if (estadoEl) {
    estadoEl.textContent = estadoActual;
  }

  const imgEl = document.getElementById("toro-img");
  if (imgEl && IMAGENES[estadoActual]) {
    imgEl.classList.remove('fade');
    void imgEl.offsetWidth;
    imgEl.src = IMAGENES[estadoActual];
    imgEl.classList.add('fade');
  }

  const mensajes = {
    "en_espera": "Esperando confirmación del pedido ⏳",
    "preparando": "Preparando tu pedido 👨‍🍳",
    "listo": "¡Pedido listo! Esperando repartidor 📦",
    "en_camino": "Repartidor en camino 🚗",
    "entregado": "¡Pedido entregado! ¡Buen provecho! 🎉"
  };

  setStatusMessage(mensajes[estadoActual] || "");
}

// ===============================
// 7️⃣ FUNCIONES AUXILIARES
// ===============================
function setStatusMessage(html) {
  const el = document.getElementById('status');
  if (el) el.innerHTML = html;
}

function testIcon(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function calcularDistancia(pos1, pos2) {
  const R = 6371e3;
  const lat1 = pos1.lat * Math.PI / 180;
  const lat2 = pos2.lat * Math.PI / 180;
  const deltaLat = (pos2.lat - pos1.lat) * Math.PI / 180;
  const deltaLng = (pos2.lng - pos1.lng) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function postActualizarEstado(nuevoEstado) {
  try {
    console.log(`📤 Enviando actualización: ${estadoActual} → ${nuevoEstado}`);
    
    const fd = new FormData();
    fd.append("pedido_id", PEDIDO_ID);
    fd.append("nuevo_estado", nuevoEstado);
    
    // Usar la ruta correcta del proyecto
    const baseUrl = window.location.pathname.includes('TaqueriaBuenaV4') 
      ? '/TaqueriaBuenaV4' 
      : '/TaqueriaLaCruz';
    
    const r = await fetch(
      `${baseUrl}/controlador/actualizarEstado.php`,
      { method: "POST", body: fd }
    );
    
    if (r.ok) {
      const contentType = r.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await r.json();
        console.log(`✅ Estado actualizado:`, result);
        estadoActual = nuevoEstado;
        actualizarUI();
        return result;
      } else {
        const text = await r.text();
        console.error("❌ Respuesta no es JSON:", text.substring(0, 200));
      }
    } else {
      console.error("❌ Error HTTP:", r.status);
    }
  } catch (e) {
    console.error("❌ Error actualizando estado:", e);
  }
}

// Exponer globalmente
window.initMap = initMap;
console.log("✅ Script de seguimiento cargado correctamente");