<?php
// vista/vistas/SeguimientoPedido.php (CORREGIDO)
// Se espera que $data venga del controlador

$pedido_id = $data['idpedido'];
$estado_inicial = $data['estadopedido'];
$lat_pedido = $data['latitud'] !== null ? $data['latitud'] : 20.186040;
$lng_pedido = $data['longitud'] !== null ? $data['longitud'] : -99.272593;

$imagenes = [
    "en_espera"  => "/TaqueriaLaCruz/vista/images/Toro_espera.png",
    "preparando" => "/TaqueriaLaCruz/vista/images/Toro_enpreparacion.png",
    "listo"      => "/TaqueriaLaCruz/vista/images/Toro_listo.png",
    "en_camino"  => "/TaqueriaLaCruz/vista/images/Toro_repartiendo.png",
    "entregado"  => "/TaqueriaLaCruz/vista/images/Toro_agradeciendo.png"
];

include $_SERVER["DOCUMENT_ROOT"] . "/TaqueriaLaCruz/vista/vistas/nav.php";
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Seguimiento del pedido #<?= htmlspecialchars($pedido_id) ?></title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="stylesheet" href="/TaqueriaLaCruz/vista/styles/seguimiento.css">
  <link rel="stylesheet" href="/TaqueriaLaCruz/vista/styles/seguimiento_extra.css">
</head>
<body>

<main class="tracking-container">
  <h1 class="tracking-title">Seguimiento del Pedido #<?= htmlspecialchars($pedido_id) ?></h1>

  <div class="estado-box">
    Estado actual: <span id="estado-texto"><?= htmlspecialchars($estado_inicial) ?></span>
  </div>

  <img id="toro-img" class="toro-img" src="<?= $imagenes[$estado_inicial] ?? $imagenes['en_espera'] ?>" alt="Torito">

  <div class="barra">
    <div class="progreso" id="barra-progreso" style="width:0%"></div>
  </div>

  <p class="detalle">Entrega en: <strong id="direccion"><?= htmlspecialchars($data['direccion'] ?? 'Sin dirección') ?></strong></p>
  <p id="tiempo">Tiempo estimado: --</p>

  <!-- status para mensajes (dentro/fuera del radio, errores) -->
  <div id="status" style="text-align:center;margin-top:8px;color:#6b5a50"></div>

  <div id="map"></div>
</main>

<?php include $_SERVER["DOCUMENT_ROOT"] . "/TaqueriaLaCruz/vista/vistas/footer.php"; ?>

<!-- Variables para JS -->
<script>
  const PEDIDO_ID = <?= json_encode($pedido_id) ?>;
  const POLLING_MS = 10000; // 10s
  const IMAGENES = <?= json_encode($imagenes) ?>;
  const TAQUERIA = { lat: 20.186040, lng: -99.272593 };
  let estadoActual = <?= json_encode($estado_inicial) ?>;
  // Asegurar que sean números válidos
  let clientePos = { 
    lat: Number(<?= json_encode($lat_pedido) ?>) || TAQUERIA.lat, 
    lng: Number(<?= json_encode($lng_pedido) ?>) || TAQUERIA.lng 
  };
  let repartidorPos = { lat: TAQUERIA.lat, lng: TAQUERIA.lng }; // inicia en taquería
</script>

<!-- JS externo (mapa, animación y polling) -->
<script src="/TaqueriaLaCruz/vista/scripts/seguimientoMap.js"></script>

<!-- Google Maps: reemplaza TU_API_KEY -->
<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyASgpQAGYYQpy-jFvs0veojI1q96d9LroI&libraries=geometry,places&callback=initMap"></script>
</body>
</html>