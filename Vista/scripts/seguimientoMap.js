//let map, directionsService, directionsRenderer;
//let clienteMarker, repartidorMarker;
//let animFrame = null;
//let rutaActual = null; // Cachear la ruta calculada
//let puntosRuta = []; // Puntos de la ruta para seguir
//let indicePuntoActual = 0; // Ãndice del punto actual en la ruta
//let lastRouteCalcTime = 0; // Control de tiempo para recalcular ruta
//const ROUTE_CALC_INTERVAL = 30000; // Recalcular ruta mÃ¡ximo cada 30 segundos
//
//const RADIUS_METERS = 3000;
//const SPEED_KM_H = 30; // Velocidad del repartidor en km/h (ajustable)
//const ARRIVAL_THRESHOLD_METERS = 20;
//
//// util: carga icono y verifica si existe
//function testIcon(url) {
//  return new Promise(resolve => {
//    if (!url) return resolve(null);
//    const img = new Image();
//    img.onload = () => resolve(url);
//    img.onerror = () => resolve(null);
//    img.src = url;
//  });
//}
//
//// util distancia en metros (usa geometry)
//function distanciaEntre(a, b) {
//  try {
//    return google.maps.geometry.spherical.computeDistanceBetween(
//      new google.maps.LatLng(a.lat, a.lng),
//      new google.maps.LatLng(b.lat, b.lng)
//    );
//  } catch (e) {
//    console.warn('Error calculando distancia:', e);
//    return Infinity;
//  }
//}
//
//// Extraer puntos de la ruta devuelta por Directions API
//function extraerPuntosRuta(rutaResponse) {
//  const puntos = [];
//  if (rutaResponse && rutaResponse.routes && rutaResponse.routes.length > 0) {
//    const ruta = rutaResponse.routes[0];
//    ruta.legs.forEach(leg => {
//      leg.steps.forEach(step => {
//        // Agregar punto de inicio del step
//        puntos.push({
//          lat: step.start_location.lat(),
//          lng: step.start_location.lng()
//        });
//        // Agregar puntos intermedios del path
//        if (step.path) {
//          step.path.forEach(punto => {
//            puntos.push({
//              lat: punto.lat(),
//              lng: punto.lng()
//            });
//          });
//        }
//      });
//      // Agregar punto final
//      puntos.push({
//        lat: leg.end_location.lat(),
//        lng: leg.end_location.lng()
//      });
//    });
//  }
//  return puntos;
//}
//
//// Encontrar el punto mÃ¡s cercano en la ruta desde la posiciÃ³n actual
//function encontrarPuntoCercano(posActual, puntos) {
//  let menorDistancia = Infinity;
//  let indiceMasCercano = 0;
//  
//  for (let i = 0; i < puntos.length; i++) {
//    const dist = distanciaEntre(posActual, puntos[i]);
//    if (dist < menorDistancia) {
//      menorDistancia = dist;
//      indiceMasCercano = i;
//    }
//  }
//  
//  return indiceMasCercano;
//}
//
//// muestra estado de Ã¡rea y mensaje
//function setStatusMessage(html) {
//  const el = document.getElementById('status');
//  if (el) el.innerHTML = html;
//}
//
//// seguridad: comprobar coords son nÃºmeros vÃ¡lidos
//function coordsValid(p) {
//  return p && isFinite(p.lat) && isFinite(p.lng);
//}
//
//async function initMap() {
//  // validaciones iniciales
//  if (!coordsValid(clientePos)) {
//    console.warn('clientePos invÃ¡lido, usando TAQUERIA como fallback', clientePos);
//    clientePos = { ...TAQUERIA };
//  }
//
//  map = new google.maps.Map(document.getElementById('map'), {
//    center: clientePos || TAQUERIA,
//    zoom: 15,
//    mapTypeId: 'roadmap'
//  });
//
//  directionsService = new google.maps.DirectionsService();
//  directionsRenderer = new google.maps.DirectionsRenderer({ map, suppressMarkers: true });
//  directionsRenderer.setMap(map);
//
//  // Ã­conos propuestos (si no existen, hago fallback a markers de Google)
//  const iconTaqueria = '/TaqueriaLaCruz/vista/images/pin_taquera.png';
//  const iconRepartidor = '/TaqueriaLaCruz/vista/images/pin_repartidor.png';
//  const iconCliente = '/TaqueriaLaCruz/vista/images/pin_cliente.png';
//
//  // verificar si existen (evita PNG 404 que "ocultan" marcador)
//  const [okTaq, okRepar, okCliente] = await Promise.all([
//    testIcon(iconTaqueria),
//    testIcon(iconRepartidor),
//    testIcon(iconCliente)
//  ]);
//
//  const taqIcon = okTaq || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
//  const repIcon = okRepar || 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
//  const cliIcon = okCliente || 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
//
//  // marcador TAQUERÃA (local)
//  new google.maps.Marker({
//    position: TAQUERIA,
//    map,
//    title: 'TaquerÃ­a',
//    icon: taqIcon
//  });
//
//  // marcador cliente (desde BD)
//  clienteMarker = new google.maps.Marker({
//    position: clientePos,
//    map,
//    title: 'Cliente',
//    icon: cliIcon
//  });
//
//  // marcador repartidor (inicia en taquerÃ­a)
//  repartidorMarker = new google.maps.Marker({
//    position: repartidorPos,
//    map,
//    title: 'Repartidor',
//    icon: repIcon
//  });
//
//  // mensaje Ã¡rea
//  const d = distanciaEntre(clientePos, TAQUERIA);
//  if (d <= RADIUS_METERS) {
//    setStatusMessage(`Dentro del Ã¡rea de entrega â€” ${(d/1000).toFixed(2)} km`);
//  } else {
//    setStatusMessage(`<strong>Fuera del Ã¡rea de entrega</strong> â€” ${(d/1000).toFixed(2)} km. Se mostrarÃ¡ ruta.`);
//  }
//
//  // primer render y primer polling
//  await recalcularRutaYBarra(true); // forzar primera vez y esperar
//  setTimeout(pollLoop, 1000);
//}
//
//async function fetchEstadoServidor() {
//  try {
//    const r = await fetch(`/TaqueriaLaCruz/controlador/obtenerEstado.php?pedido_id=${PEDIDO_ID}`, { cache: 'no-store' });
//    if (!r.ok) {
//      console.warn('obtenerEstado no OK', r.status);
//      return null;
//    }
//    return await r.json();
//  } catch (e) {
//    console.error('fetchEstadoServidor', e);
//    return null;
//  }
//}
//
//async function postActualizarEstado(nuevoEstado) {
//  try {
//    const fd = new FormData();
//    fd.append('pedido_id', PEDIDO_ID);
//    fd.append('nuevo_estado', nuevoEstado);
//    const r = await fetch('/TaqueriaLaCruz/controlador/actualizarEstado.php', { method: 'POST', body: fd });
//    if (!r.ok) {
//      console.warn('postActualizarEstado fallo HTTP', r.status);
//      return null;
//    }
//    return await r.json();
//  } catch (e) {
//    console.error('postActualizarEstado', e);
//    return null;
//  }
//}
//
//// CLAVE: Solo recalcular ruta si han pasado suficientes segundos O si se fuerza
//async function recalcularRutaYBarra(forzar = false) {
//  if (!directionsService || !coordsValid(repartidorPos) || !coordsValid(clientePos)) return;
//
//  const ahora = Date.now();
//  const tiempoTranscurrido = ahora - lastRouteCalcTime;
//
//  // Solo recalcular si se fuerza o si ha pasado el intervalo mÃ­nimo
//  if (!forzar && tiempoTranscurrido < ROUTE_CALC_INTERVAL) {
//    // Actualizar solo la barra de progreso sin llamar a Directions API
//    actualizarBarraProgreso();
//    return;
//  }
//
//  lastRouteCalcTime = ahora;
//
//  return new Promise((resolve) => {
//    directionsService.route({
//      origin: new google.maps.LatLng(repartidorPos.lat, repartidorPos.lng),
//      destination: new google.maps.LatLng(clientePos.lat, clientePos.lng),
//      travelMode: google.maps.TravelMode.DRIVING
//    }, (res, status) => {
//      if (status === 'OK' && res.routes && res.routes.length) {
//        rutaActual = res; // Cachear la ruta
//        directionsRenderer.setDirections(res);
//        
//        // Extraer puntos de la ruta para que el marcador los siga
//        puntosRuta = extraerPuntosRuta(res);
//        
//        // Encontrar el punto mÃ¡s cercano en la nueva ruta
//        if (puntosRuta.length > 0) {
//          indicePuntoActual = encontrarPuntoCercano(repartidorPos, puntosRuta);
//          console.log(`Ruta recalculada: ${puntosRuta.length} puntos. Comenzando desde Ã­ndice ${indicePuntoActual}`);
//        }
//        
//        const leg = res.routes[0].legs[0];
//        if (leg) {
//          document.getElementById('tiempo').textContent = `Tiempo estimado: ${leg.duration.text}`;
//          actualizarBarraProgreso();
//          
//          // llegada automÃ¡tica si muy cerca
//          const distanciaLegMeters = leg.distance.value;
//          if (distanciaLegMeters <= ARRIVAL_THRESHOLD_METERS && estadoActual === 'en_camino') {
//            postActualizarEstado('entregado').then(res => {
//              if (res && res.ok) {
//                estadoActual = 'entregado';
//                actualizarUI();
//              }
//            });
//          }
//        }
//        resolve(true);
//      } else if (status === 'OVER_QUERY_LIMIT') {
//        console.warn('OVER_QUERY_LIMIT detectado - esperando antes de reintentar');
//        document.getElementById('tiempo').textContent = 'Calculando ruta...';
//        // Esperar mÃ¡s tiempo antes del prÃ³ximo intento
//        lastRouteCalcTime = ahora + 60000; // Esperar 1 minuto adicional
//        resolve(false);
//      } else {
//        console.warn('DirectionsService no devolviÃ³ ruta OK:', status);
//        directionsRenderer.setDirections({ routes: [] });
//        document.getElementById('tiempo').textContent = `Ruta no disponible (${status})`;
//        resolve(false);
//      }
//    });
//  });
//}
//
//// Nueva funciÃ³n: actualizar solo la barra de progreso sin llamar a la API
//function actualizarBarraProgreso() {
//  if (!puntosRuta.length || !rutaActual || !rutaActual.routes[0]) {
//    return;
//  }
//  
//  const leg = rutaActual.routes[0].legs[0];
//  const distanciaTotal = leg.distance.value; // distancia total en metros
//  
//  // Calcular distancia recorrida basada en el Ã­ndice actual
//  let distanciaRecorrida = 0;
//  for (let i = 0; i < indicePuntoActual && i < puntosRuta.length - 1; i++) {
//    distanciaRecorrida += distanciaEntre(puntosRuta[i], puntosRuta[i + 1]);
//  }
//  
//  let porcentaje = 0;
//  if (distanciaTotal > 0) {
//    porcentaje = Math.round(100 * (distanciaRecorrida / distanciaTotal));
//    porcentaje = Math.max(0, Math.min(100, porcentaje));
//  }
//  
//  document.getElementById('barra-progreso').style.width = porcentaje + '%';
//}
//
//function animateStep() {
//  // Si no hay puntos de ruta, no animar
//  if (!puntosRuta || puntosRuta.length === 0) {
//    cancelAnimationFrame(animFrame);
//    animFrame = null;
//    return;
//  }
//  
//  // Si llegamos al final de la ruta, marcar como entregado
//  if (indicePuntoActual >= puntosRuta.length - 1) {
//    cancelAnimationFrame(animFrame);
//    animFrame = null;
//    console.log('LlegÃ³ al destino - marcando como entregado');
//    
//    // Cambiar estado a entregado automÃ¡ticamente
//    if (estadoActual === 'en_camino') {
//      postActualizarEstado('entregado').then(res => {
//        if (res && res.ok) {
//          estadoActual = 'entregado';
//          actualizarUI();
//          setStatusMessage('Â¡Pedido entregado!');
//        }
//      });
//    }
//    return;
//  }
//  
//  const puntoDestino = puntosRuta[indicePuntoActual + 1];
//  const dx = puntoDestino.lng - repartidorPos.lng;
//  const dy = puntoDestino.lat - repartidorPos.lat;
//  const distancia = Math.sqrt(dx * dx + dy * dy);
//  
//  // Calcular velocidad basada en km/h (mÃ¡s realista)
//  // Aproximadamente: 1 grado â‰ˆ 111km, entonces velocidad en grados/segundo
//  const velocidadGradosPorSegundo = (SPEED_KM_H / 3600) / 111;
//  const velocidadPorFrame = velocidadGradosPorSegundo / 60; // 60 fps
//  
//  // Si estamos muy cerca del siguiente punto, avanzar al siguiente
//  if (distancia < velocidadPorFrame * 2) {
//    indicePuntoActual++;
//    if (indicePuntoActual >= puntosRuta.length - 1) {
//      repartidorPos = { ...puntosRuta[puntosRuta.length - 1] };
//      repartidorMarker.setPosition(repartidorPos);
//      actualizarBarraProgreso();
//      cancelAnimationFrame(animFrame);
//      animFrame = null;
//      return;
//    }
//  } else {
//    // Mover hacia el siguiente punto
//    const factor = velocidadPorFrame / distancia;
//    repartidorPos.lat += dy * factor;
//    repartidorPos.lng += dx * factor;
//  }
//  
//  repartidorMarker.setPosition(repartidorPos);
//  actualizarBarraProgreso();
//  
//  animFrame = requestAnimationFrame(animateStep);
//}
//
//function startSmoothMove() {
//  if (!animFrame && puntosRuta.length > 0) {
//    // Encontrar el punto mÃ¡s cercano antes de comenzar
//    indicePuntoActual = encontrarPuntoCercano(repartidorPos, puntosRuta);
//    console.log(`Iniciando movimiento desde punto ${indicePuntoActual} de ${puntosRuta.length}`);
//    animFrame = requestAnimationFrame(animateStep);
//  }
//}
//
//function actualizarUI() {
//  const estadoEl = document.getElementById('estado-texto');
//  if (estadoEl) estadoEl.textContent = estadoActual;
//  const src = IMAGENES[estadoActual] || IMAGENES['en_espera'];
//  const imgEl = document.getElementById('toro-img');
//  if (imgEl) {
//    imgEl.classList.remove('fade');
//    void imgEl.offsetWidth;
//    imgEl.src = src;
//    imgEl.classList.add('fade');
//  }
//
//  // Solo actualizar barra, no recalcular ruta completa
//  actualizarBarraProgreso();
//}
//
//async function pollLoop() {
//  const info = await fetchEstadoServidor();
//  if (!info) {
//    setTimeout(pollLoop, POLLING_MS);
//    return;
//  }
//
//  // validar coords recibidas
//  if (info.latitud !== null && info.longitud !== null) {
//    const newLat = Number(info.latitud);
//    const newLng = Number(info.longitud);
//    if (isFinite(newLat) && isFinite(newLng)) {
//      const coordsCambiaron = Math.abs(clientePos.lat - newLat) > 0.0001 || 
//                              Math.abs(clientePos.lng - newLng) > 0.0001;
//      
//      clientePos.lat = newLat;
//      clientePos.lng = newLng;
//      if (clienteMarker) clienteMarker.setPosition(clientePos);
//      
//      // Si las coordenadas cambiaron significativamente, forzar recÃ¡lculo
//      if (coordsCambiaron) {
//        await recalcularRutaYBarra(true);
//      }
//    } else {
//      console.warn('Coordenadas del servidor invÃ¡lidas:', info.latitud, info.longitud);
//    }
//  }
//
//  const servidorEstado = info.estadopedido;
//
//  if (servidorEstado !== estadoActual) {
//    if (servidorEstado === 'en_espera') {
//      const dentro = distanciaEntre(clientePos, TAQUERIA) <= RADIUS_METERS;
//      if (dentro) {
//        await postActualizarEstado('preparando');
//        estadoActual = 'preparando';
//        actualizarUI();
//      } else {
//        estadoActual = 'en_espera';
//        actualizarUI();
//        setStatusMessage(`<strong>Fuera del Ã¡rea</strong> â€” el pedido permanecerÃ¡ en espera hasta que se ajuste la direcciÃ³n.`);
//      }
//    } else if (servidorEstado === 'listo') {
//      const dentro = distanciaEntre(clientePos, TAQUERIA) <= RADIUS_METERS;
//      if (dentro) {
//        await postActualizarEstado('en_camino');
//        estadoActual = 'en_camino';
//        actualizarUI();
//        await recalcularRutaYBarra(true); // Forzar recÃ¡lculo al iniciar entrega
//        startSmoothMove();
//      } else {
//        estadoActual = 'listo';
//        actualizarUI();
//        setStatusMessage(`<strong>Listo pero fuera del Ã¡rea</strong> â€” el repartidor no fue asignado.`);
//      }
//    } else {
//      estadoActual = servidorEstado;
//      actualizarUI();
//    }
//  }
//
//  if (estadoActual === 'en_camino') {
//    setStatusMessage('Repartidor en camino...');
//    startSmoothMove();
//  }
//
//  setTimeout(pollLoop, POLLING_MS);
//}
//
//// Exponer initMap globalmente para callback de Google
//window.initMap = initMap;

// ===============================
// OPTIMIZACIÓN TOTAL: Google Maps - BAJO COSTO
// Basado en: https://ejemplo.com (tu código de referencia)
// ===============================

let map;
let directionsRenderer;
let clienteMarker, repartidorMarker, taqueriaMarker;
let route = []; // Array de puntos (lat/lng)
let currentIndex = 0;
let animFrame = null;
let rutaCalculada = false;

// Variables del servidor (pasadas desde PHP)
// const PEDIDO_ID = ...
// const TAQUERIA = ...
// const clientePos = ...
// let estadoActual = ...
// let repartidorPos = ...

const RADIUS_METERS = 3000;
const SPEED_KM_H = 30;
const ARRIVAL_THRESHOLD_METERS = 20;
let lastPollTime = 0;
const POLL_INTERVAL = 10000; // 10 segundos

// ===============================
// 1️⃣ INICIALIZAR MAPA
// ===============================
async function initMap() {
  console.log("🗺️ Inicializando mapa...");
  
  if (!document.getElementById('map')) {
    console.error("❌ No existe elemento #map");
    return;
  }

  // Crear mapa
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: clientePos || TAQUERIA,
    mapTypeId: "roadmap",
    fullscreenControl: false
  });

  // Cargar iconos
  const iconTaqueria = '/TaqueriaLaCruz/vista/images/pin_taquera.png';
  const iconRepartidor = '/TaqueriaLaCruz/vista/images/pin_repartidor.png';
  const iconCliente = '/TaqueriaLaCruz/vista/images/pin_cliente.png';

  const [taqIcon, repIcon, cliIcon] = await Promise.all([
    testIcon(iconTaqueria),
    testIcon(iconRepartidor),
    testIcon(iconCliente)
  ]);

  // Marcadores
  taqueriaMarker = new google.maps.Marker({
    position: TAQUERIA,
    map,
    title: "Taquería",
    icon: taqIcon || "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
  });

  clienteMarker = new google.maps.Marker({
    position: clientePos,
    map,
    title: "Cliente",
    icon: cliIcon || "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
  });

  repartidorMarker = new google.maps.Marker({
    position: repartidorPos,
    map,
    title: "Repartidor",
    icon: repIcon || "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  });

  // DirectionsRenderer (sin markers propios)
  directionsRenderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: true,
    suppressInfoWindows: true
  });

  console.log("✅ Mapa inicializado");

  // Calcular ruta SOLO UNA VEZ
  await calcularRuta();

  // Iniciar polling
  setTimeout(pollLoop, 1000);
}

// ===============================
// 2️⃣ CALCULAR RUTA (UNA SOLA VEZ)
// ===============================
async function calcularRuta() {
  if (rutaCalculada) {
    console.log("⏭️ Ruta ya calculada, saltando...");
    return;
  }

  console.log("🌐 Calculando ruta (ÚNICA llamada a Directions API)...");

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
        if (status === "OK" && result.routes.length > 0) {
          console.log("✅ Ruta obtenida del servidor");

          // Dibujar ruta en el mapa
          directionsRenderer.setDirections(result);

          // ✅ IMPORTANTE: Usar overview_path (menos puntos = más rápido)
          route = result.routes[0].overview_path;
          console.log(`📍 Puntos de ruta: ${route.length}`);

          rutaCalculada = true;
          resolve(true);

          // Mostrar tiempo estimado
          const leg = result.routes[0].legs[0];
          if (leg) {
            document.getElementById("tiempo").textContent =
              `Tiempo estimado: ${leg.duration.text}`;
          }
        } else {
          console.error("❌ Error en Directions API:", status);
          document.getElementById("tiempo").textContent = `Error: ${status}`;
          resolve(false);
        }
      }
    );
  });
}

// ===============================
// 3️⃣ ANIMAR REPARTIDOR
// ===============================
function moverRepartidor() {
  if (!route || route.length === 0) {
    console.warn("⚠️ No hay ruta disponible");
    return;
  }

  if (currentIndex >= route.length - 1) {
    console.log("✅ Repartidor llegó al destino");
    if (estadoActual === "en_camino") {
      postActualizarEstado("entregado");
    }
    return;
  }

  currentIndex++;

  // Actualizar posición del repartidor
  const punto = route[currentIndex];
  repartidorPos.lat = punto.lat();
  repartidorPos.lng = punto.lng();
  repartidorMarker.setPosition(repartidorPos);

  // Actualizar barra de progreso
  actualizarBarraProgreso();

  // Velocidad controlada (ajusta según necesites)
  // 500ms = movimiento visible, 100ms = muy rápido
  const velocidadMs = 500;
  animFrame = setTimeout(moverRepartidor, velocidadMs);
}

function startMoverRepartidor() {
  if (!animFrame && route.length > 0) {
    console.log("🚗 Iniciando movimiento del repartidor...");
    moverRepartidor();
  }
}

function stopMoverRepartidor() {
  if (animFrame) {
    clearTimeout(animFrame);
    animFrame = null;
    console.log("⏸️ Repartidor detenido");
  }
}

// ===============================
// 4️⃣ BARRA DE PROGRESO
// ===============================
function actualizarBarraProgreso() {
  if (!route || route.length === 0) return;

  const porcentaje = Math.round(
    (currentIndex / (route.length - 1)) * 100
  );
  const barra = document.getElementById("barra-progreso");
  if (barra) {
    barra.style.width = porcentaje + "%";
  }
}

// ===============================
// 5️⃣ POLLING (SIN Directions API)
// ===============================
async function pollLoop() {
  const ahora = Date.now();
  if (ahora - lastPollTime < POLL_INTERVAL) {
    setTimeout(pollLoop, 1000);
    return;
  }

  lastPollTime = ahora;

  try {
    const response = await fetch(
      `/TaqueriaLaCruz/controlador/obtenerEstado.php?pedido_id=${PEDIDO_ID}`,
      { cache: "no-store" }
    );

    if (!response.ok) return;

    const info = await response.json();

    // Actualizar posición del cliente (si cambió)
    if (info.latitud && info.longitud) {
      const newLat = Number(info.latitud);
      const newLng = Number(info.longitud);

      if (
        Math.abs(clientePos.lat - newLat) > 0.001 ||
        Math.abs(clientePos.lng - newLng) > 0.001
      ) {
        console.log("📍 Cliente se movió, recalculando ruta...");
        clientePos.lat = newLat;
        clientePos.lng = newLng;
        clienteMarker.setPosition(clientePos);

        // Reiniciar ruta
        stopMoverRepartidor();
        rutaCalculada = false;
        currentIndex = 0;
        route = [];
        
        await calcularRuta();
        startMoverRepartidor();
      }
    }

    // Actualizar estado
    if (info.estadopedido !== estadoActual) {
      estadoActual = info.estadopedido;
      actualizarUI();

      if (estadoActual === "en_camino") {
        startMoverRepartidor();
      } else {
        stopMoverRepartidor();
      }
    }

  } catch (error) {
    console.error("❌ Error en polling:", error);
  }

  setTimeout(pollLoop, POLL_INTERVAL);
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
    imgEl.src = IMAGENES[estadoActual];
  }
}

// ===============================
// 7️⃣ AUXILIARES
// ===============================
function testIcon(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function postActualizarEstado(nuevoEstado) {
  try {
    const fd = new FormData();
    fd.append("pedido_id", PEDIDO_ID);
    fd.append("nuevo_estado", nuevoEstado);
    const r = await fetch(
      "/TaqueriaLaCruz/controlador/actualizarEstado.php",
      { method: "POST", body: fd }
    );
    if (r.ok) {
      console.log(`✅ Estado actualizado a: ${nuevoEstado}`);
      return await r.json();
    }
  } catch (e) {
    console.error("Error actualizando estado:", e);
  }
}

// Exponer globalmente
window.initMap = initMap;
console.log("✅ Script optimizado cargado");