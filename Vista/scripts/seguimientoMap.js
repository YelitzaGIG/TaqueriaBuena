let map, directionsService, directionsRenderer;
let clienteMarker, repartidorMarker;
let animFrame = null;
let rutaActual = null; // Cachear la ruta calculada
let puntosRuta = []; // Puntos de la ruta para seguir
let indicePuntoActual = 0; // Índice del punto actual en la ruta
let lastRouteCalcTime = 0; // Control de tiempo para recalcular ruta
const ROUTE_CALC_INTERVAL = 30000; // Recalcular ruta máximo cada 30 segundos

const RADIUS_METERS = 3000;
const SPEED_KM_H = 30; // Velocidad del repartidor en km/h (ajustable)
const ARRIVAL_THRESHOLD_METERS = 20;

// util: carga icono y verifica si existe
function testIcon(url) {
  return new Promise(resolve => {
    if (!url) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// util distancia en metros (usa geometry)
function distanciaEntre(a, b) {
  try {
    return google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(a.lat, a.lng),
      new google.maps.LatLng(b.lat, b.lng)
    );
  } catch (e) {
    console.warn('Error calculando distancia:', e);
    return Infinity;
  }
}

// Extraer puntos de la ruta devuelta por Directions API
function extraerPuntosRuta(rutaResponse) {
  const puntos = [];
  if (rutaResponse && rutaResponse.routes && rutaResponse.routes.length > 0) {
    const ruta = rutaResponse.routes[0];
    ruta.legs.forEach(leg => {
      leg.steps.forEach(step => {
        // Agregar punto de inicio del step
        puntos.push({
          lat: step.start_location.lat(),
          lng: step.start_location.lng()
        });
        // Agregar puntos intermedios del path
        if (step.path) {
          step.path.forEach(punto => {
            puntos.push({
              lat: punto.lat(),
              lng: punto.lng()
            });
          });
        }
      });
      // Agregar punto final
      puntos.push({
        lat: leg.end_location.lat(),
        lng: leg.end_location.lng()
      });
    });
  }
  return puntos;
}

// Encontrar el punto más cercano en la ruta desde la posición actual
function encontrarPuntoCercano(posActual, puntos) {
  let menorDistancia = Infinity;
  let indiceMasCercano = 0;
  
  for (let i = 0; i < puntos.length; i++) {
    const dist = distanciaEntre(posActual, puntos[i]);
    if (dist < menorDistancia) {
      menorDistancia = dist;
      indiceMasCercano = i;
    }
  }
  
  return indiceMasCercano;
}

// muestra estado de área y mensaje
function setStatusMessage(html) {
  const el = document.getElementById('status');
  if (el) el.innerHTML = html;
}

// seguridad: comprobar coords son números válidos
function coordsValid(p) {
  return p && isFinite(p.lat) && isFinite(p.lng);
}

async function initMap() {
  // validaciones iniciales
  if (!coordsValid(clientePos)) {
    console.warn('clientePos inválido, usando TAQUERIA como fallback', clientePos);
    clientePos = { ...TAQUERIA };
  }

  map = new google.maps.Map(document.getElementById('map'), {
    center: clientePos || TAQUERIA,
    zoom: 15,
    mapTypeId: 'roadmap'
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map, suppressMarkers: true });
  directionsRenderer.setMap(map);

  // íconos propuestos (si no existen, hago fallback a markers de Google)
  const iconTaqueria = '/TaqueriaLaCruz/vista/images/pin_taquera.png';
  const iconRepartidor = '/TaqueriaLaCruz/vista/images/pin_repartidor.png';
  const iconCliente = '/TaqueriaLaCruz/vista/images/pin_cliente.png';

  // verificar si existen (evita PNG 404 que "ocultan" marcador)
  const [okTaq, okRepar, okCliente] = await Promise.all([
    testIcon(iconTaqueria),
    testIcon(iconRepartidor),
    testIcon(iconCliente)
  ]);

  const taqIcon = okTaq || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
  const repIcon = okRepar || 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  const cliIcon = okCliente || 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';

  // marcador TAQUERÍA (local)
  new google.maps.Marker({
    position: TAQUERIA,
    map,
    title: 'Taquería',
    icon: taqIcon
  });

  // marcador cliente (desde BD)
  clienteMarker = new google.maps.Marker({
    position: clientePos,
    map,
    title: 'Cliente',
    icon: cliIcon
  });

  // marcador repartidor (inicia en taquería)
  repartidorMarker = new google.maps.Marker({
    position: repartidorPos,
    map,
    title: 'Repartidor',
    icon: repIcon
  });

  // mensaje área
  const d = distanciaEntre(clientePos, TAQUERIA);
  if (d <= RADIUS_METERS) {
    setStatusMessage(`Dentro del área de entrega — ${(d/1000).toFixed(2)} km`);
  } else {
    setStatusMessage(`<strong>Fuera del área de entrega</strong> — ${(d/1000).toFixed(2)} km. Se mostrará ruta.`);
  }

  // primer render y primer polling
  await recalcularRutaYBarra(true); // forzar primera vez y esperar
  setTimeout(pollLoop, 1000);
}

async function fetchEstadoServidor() {
  try {
    const r = await fetch(`/TaqueriaLaCruz/controlador/obtenerEstado.php?pedido_id=${PEDIDO_ID}`, { cache: 'no-store' });
    if (!r.ok) {
      console.warn('obtenerEstado no OK', r.status);
      return null;
    }
    return await r.json();
  } catch (e) {
    console.error('fetchEstadoServidor', e);
    return null;
  }
}

async function postActualizarEstado(nuevoEstado) {
  try {
    const fd = new FormData();
    fd.append('pedido_id', PEDIDO_ID);
    fd.append('nuevo_estado', nuevoEstado);
    const r = await fetch('/TaqueriaLaCruz/controlador/actualizarEstado.php', { method: 'POST', body: fd });
    if (!r.ok) {
      console.warn('postActualizarEstado fallo HTTP', r.status);
      return null;
    }
    return await r.json();
  } catch (e) {
    console.error('postActualizarEstado', e);
    return null;
  }
}

// CLAVE: Solo recalcular ruta si han pasado suficientes segundos O si se fuerza
async function recalcularRutaYBarra(forzar = false) {
  if (!directionsService || !coordsValid(repartidorPos) || !coordsValid(clientePos)) return;

  const ahora = Date.now();
  const tiempoTranscurrido = ahora - lastRouteCalcTime;

  // Solo recalcular si se fuerza o si ha pasado el intervalo mínimo
  if (!forzar && tiempoTranscurrido < ROUTE_CALC_INTERVAL) {
    // Actualizar solo la barra de progreso sin llamar a Directions API
    actualizarBarraProgreso();
    return;
  }

  lastRouteCalcTime = ahora;

  return new Promise((resolve) => {
    directionsService.route({
      origin: new google.maps.LatLng(repartidorPos.lat, repartidorPos.lng),
      destination: new google.maps.LatLng(clientePos.lat, clientePos.lng),
      travelMode: google.maps.TravelMode.DRIVING
    }, (res, status) => {
      if (status === 'OK' && res.routes && res.routes.length) {
        rutaActual = res; // Cachear la ruta
        directionsRenderer.setDirections(res);
        
        // Extraer puntos de la ruta para que el marcador los siga
        puntosRuta = extraerPuntosRuta(res);
        
        // Encontrar el punto más cercano en la nueva ruta
        if (puntosRuta.length > 0) {
          indicePuntoActual = encontrarPuntoCercano(repartidorPos, puntosRuta);
          console.log(`Ruta recalculada: ${puntosRuta.length} puntos. Comenzando desde índice ${indicePuntoActual}`);
        }
        
        const leg = res.routes[0].legs[0];
        if (leg) {
          document.getElementById('tiempo').textContent = `Tiempo estimado: ${leg.duration.text}`;
          actualizarBarraProgreso();
          
          // llegada automática si muy cerca
          const distanciaLegMeters = leg.distance.value;
          if (distanciaLegMeters <= ARRIVAL_THRESHOLD_METERS && estadoActual === 'en_camino') {
            postActualizarEstado('entregado').then(res => {
              if (res && res.ok) {
                estadoActual = 'entregado';
                actualizarUI();
              }
            });
          }
        }
        resolve(true);
      } else if (status === 'OVER_QUERY_LIMIT') {
        console.warn('OVER_QUERY_LIMIT detectado - esperando antes de reintentar');
        document.getElementById('tiempo').textContent = 'Calculando ruta...';
        // Esperar más tiempo antes del próximo intento
        lastRouteCalcTime = ahora + 60000; // Esperar 1 minuto adicional
        resolve(false);
      } else {
        console.warn('DirectionsService no devolvió ruta OK:', status);
        directionsRenderer.setDirections({ routes: [] });
        document.getElementById('tiempo').textContent = `Ruta no disponible (${status})`;
        resolve(false);
      }
    });
  });
}

// Nueva función: actualizar solo la barra de progreso sin llamar a la API
function actualizarBarraProgreso() {
  if (!puntosRuta.length || !rutaActual || !rutaActual.routes[0]) {
    return;
  }
  
  const leg = rutaActual.routes[0].legs[0];
  const distanciaTotal = leg.distance.value; // distancia total en metros
  
  // Calcular distancia recorrida basada en el índice actual
  let distanciaRecorrida = 0;
  for (let i = 0; i < indicePuntoActual && i < puntosRuta.length - 1; i++) {
    distanciaRecorrida += distanciaEntre(puntosRuta[i], puntosRuta[i + 1]);
  }
  
  let porcentaje = 0;
  if (distanciaTotal > 0) {
    porcentaje = Math.round(100 * (distanciaRecorrida / distanciaTotal));
    porcentaje = Math.max(0, Math.min(100, porcentaje));
  }
  
  document.getElementById('barra-progreso').style.width = porcentaje + '%';
}

function animateStep() {
  // Si no hay puntos de ruta, no animar
  if (!puntosRuta || puntosRuta.length === 0) {
    cancelAnimationFrame(animFrame);
    animFrame = null;
    return;
  }
  
  // Si llegamos al final de la ruta, marcar como entregado
  if (indicePuntoActual >= puntosRuta.length - 1) {
    cancelAnimationFrame(animFrame);
    animFrame = null;
    console.log('Llegó al destino - marcando como entregado');
    
    // Cambiar estado a entregado automáticamente
    if (estadoActual === 'en_camino') {
      postActualizarEstado('entregado').then(res => {
        if (res && res.ok) {
          estadoActual = 'entregado';
          actualizarUI();
          setStatusMessage('¡Pedido entregado!');
        }
      });
    }
    return;
  }
  
  const puntoDestino = puntosRuta[indicePuntoActual + 1];
  const dx = puntoDestino.lng - repartidorPos.lng;
  const dy = puntoDestino.lat - repartidorPos.lat;
  const distancia = Math.sqrt(dx * dx + dy * dy);
  
  // Calcular velocidad basada en km/h (más realista)
  // Aproximadamente: 1 grado ≈ 111km, entonces velocidad en grados/segundo
  const velocidadGradosPorSegundo = (SPEED_KM_H / 3600) / 111;
  const velocidadPorFrame = velocidadGradosPorSegundo / 60; // 60 fps
  
  // Si estamos muy cerca del siguiente punto, avanzar al siguiente
  if (distancia < velocidadPorFrame * 2) {
    indicePuntoActual++;
    if (indicePuntoActual >= puntosRuta.length - 1) {
      repartidorPos = { ...puntosRuta[puntosRuta.length - 1] };
      repartidorMarker.setPosition(repartidorPos);
      actualizarBarraProgreso();
      cancelAnimationFrame(animFrame);
      animFrame = null;
      return;
    }
  } else {
    // Mover hacia el siguiente punto
    const factor = velocidadPorFrame / distancia;
    repartidorPos.lat += dy * factor;
    repartidorPos.lng += dx * factor;
  }
  
  repartidorMarker.setPosition(repartidorPos);
  actualizarBarraProgreso();
  
  animFrame = requestAnimationFrame(animateStep);
}

function startSmoothMove() {
  if (!animFrame && puntosRuta.length > 0) {
    // Encontrar el punto más cercano antes de comenzar
    indicePuntoActual = encontrarPuntoCercano(repartidorPos, puntosRuta);
    console.log(`Iniciando movimiento desde punto ${indicePuntoActual} de ${puntosRuta.length}`);
    animFrame = requestAnimationFrame(animateStep);
  }
}

function actualizarUI() {
  const estadoEl = document.getElementById('estado-texto');
  if (estadoEl) estadoEl.textContent = estadoActual;
  const src = IMAGENES[estadoActual] || IMAGENES['en_espera'];
  const imgEl = document.getElementById('toro-img');
  if (imgEl) {
    imgEl.classList.remove('fade');
    void imgEl.offsetWidth;
    imgEl.src = src;
    imgEl.classList.add('fade');
  }

  // Solo actualizar barra, no recalcular ruta completa
  actualizarBarraProgreso();
}

async function pollLoop() {
  const info = await fetchEstadoServidor();
  if (!info) {
    setTimeout(pollLoop, POLLING_MS);
    return;
  }

  // validar coords recibidas
  if (info.latitud !== null && info.longitud !== null) {
    const newLat = Number(info.latitud);
    const newLng = Number(info.longitud);
    if (isFinite(newLat) && isFinite(newLng)) {
      const coordsCambiaron = Math.abs(clientePos.lat - newLat) > 0.0001 || 
                              Math.abs(clientePos.lng - newLng) > 0.0001;
      
      clientePos.lat = newLat;
      clientePos.lng = newLng;
      if (clienteMarker) clienteMarker.setPosition(clientePos);
      
      // Si las coordenadas cambiaron significativamente, forzar recálculo
      if (coordsCambiaron) {
        await recalcularRutaYBarra(true);
      }
    } else {
      console.warn('Coordenadas del servidor inválidas:', info.latitud, info.longitud);
    }
  }

  const servidorEstado = info.estadopedido;

  if (servidorEstado !== estadoActual) {
    if (servidorEstado === 'en_espera') {
      const dentro = distanciaEntre(clientePos, TAQUERIA) <= RADIUS_METERS;
      if (dentro) {
        await postActualizarEstado('preparando');
        estadoActual = 'preparando';
        actualizarUI();
      } else {
        estadoActual = 'en_espera';
        actualizarUI();
        setStatusMessage(`<strong>Fuera del área</strong> — el pedido permanecerá en espera hasta que se ajuste la dirección.`);
      }
    } else if (servidorEstado === 'listo') {
      const dentro = distanciaEntre(clientePos, TAQUERIA) <= RADIUS_METERS;
      if (dentro) {
        await postActualizarEstado('en_camino');
        estadoActual = 'en_camino';
        actualizarUI();
        await recalcularRutaYBarra(true); // Forzar recálculo al iniciar entrega
        startSmoothMove();
      } else {
        estadoActual = 'listo';
        actualizarUI();
        setStatusMessage(`<strong>Listo pero fuera del área</strong> — el repartidor no fue asignado.`);
      }
    } else {
      estadoActual = servidorEstado;
      actualizarUI();
    }
  }

  if (estadoActual === 'en_camino') {
    setStatusMessage('Repartidor en camino...');
    startSmoothMove();
  }

  setTimeout(pollLoop, POLLING_MS);
}

// Exponer initMap globalmente para callback de Google
window.initMap = initMap;