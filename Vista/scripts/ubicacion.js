//ubicacion.js
let map;
let taqueriaMarker;
let userMarker = null;
let directionsService;
let directionsRenderer;
const rutaMenu = '/TaqueriaBuenaV4/vista/vistas/MenuAntojitos.php';

const RADIUS_METERS = 3000;
const TAQUERIA = { lat: 20.186040, lng: -99.272593 };

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: TAQUERIA,
    zoom: 15,
    mapTypeId: "roadmap",
    streetViewControl: false,
    fullscreenControl: false,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    preserveViewport: true,
    polylineOptions: {
      strokeColor: "#b8561d",
      strokeOpacity: 0.8,
      strokeWeight: 5,
    },
  });
  directionsRenderer.setMap(map);

  taqueriaMarker = new google.maps.Marker({
    position: TAQUERIA,
    map,
    title: "Taquería y Antojitos La Cruz",
    icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  });

  new google.maps.Circle({
    map,
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
        document.getElementById("status").textContent =
          "No se encontró la ubicación seleccionada.";
        return;
      }
      handleUserLocation(place.geometry.location);
    });
  }

  const geoBtn = document.getElementById("useLocationBtn");
  if (geoBtn) {
    geoBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        document.getElementById("status").textContent =
          "Tu navegador no soporta geolocalización.";
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          handleUserLocation(loc);
        },
        () => {
          document.getElementById("status").textContent =
            "No se pudo obtener tu ubicación.";
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    });
  }

  map.addListener("click", (e) => {
    const loc = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    handleUserLocation(loc);
  });

  const openBtn = document.getElementById("openMapsBtn");
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      if (userMarker && userMarker.getPosition()) {
        const p = userMarker.getPosition();
        const origin = `${p.lat()},${p.lng()}`;
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

  // Configurar clic del botón una sola vez
  const orderBtn = document.getElementById("orderBtn");
  orderBtn.addEventListener("click", () => {
    if (!orderBtn.classList.contains("enabled")) {
      alert(
        "Lo sentimos, no se puede realizar pedido a domicilio. Estás fuera del área de entrega."
      );
    } else {
      window.location.href = rutaMenu;
    }
  });
}

function toLatLngObj(any) {
  if (!any) return null;
  try {
    if (typeof any.lat === "function" && typeof any.lng === "function") {
      return { lat: any.lat(), lng: any.lng() };
    }
    if (any.lat !== undefined && any.lng !== undefined) {
      return { lat: Number(any.lat), lng: Number(any.lng) };
    }
  } catch (err) {
    console.warn("Error al convertir coordenadas:", err);
  }
  return null;
}

function handleUserLocation(rawLocation) {
  const loc = toLatLngObj(rawLocation);
  if (!loc) {
    document.getElementById("status").textContent = "Ubicación inválida.";
    return;
  }

  if (!userMarker) {
    userMarker = new google.maps.Marker({
      map,
      position: loc,
      title: "Tu ubicación",
      icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    });
  } else {
    userMarker.setPosition(loc);
  }

  map.setCenter(loc);

  const distanciaMetros = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(loc.lat, loc.lng),
    new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng)
  );

  const km = (distanciaMetros / 1000).toFixed(2);
  const statusEl = document.getElementById("status");
  const orderBtn = document.getElementById("orderBtn");
  directionsRenderer.setDirections({ routes: [] });

  if (distanciaMetros <= RADIUS_METERS) {
    statusEl.innerHTML = `Estás a ${km} km de la taquería. Dentro del área de entrega.`;
    orderBtn.classList.add("enabled");
  } else {
    statusEl.innerHTML = `Estás a ${km} km de la taquería. Fuera del área de entrega.<br>Se mostrará la ruta.`;
    orderBtn.classList.remove("enabled");
    showRoute(loc);
  }
}

function showRoute(originObj) {
  const origin = toLatLngObj(originObj);
  if (!origin) return;

  directionsService.route(
    {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(TAQUERIA.lat, TAQUERIA.lng),
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
      } else {
        document.getElementById("status").innerHTML += `<br>(Error: ${status})`;
      }
    }
  );
}

window.initMap = initMap;
