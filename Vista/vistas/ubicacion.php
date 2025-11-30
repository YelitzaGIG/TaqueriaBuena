<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ubicación | Taquería y Antojitos La Cruz</title>
  <link rel="stylesheet" href="../styles/ubicacion_style.css" />
  <link rel="icon" href="../images/logo lc 2.png" />
</head>
<body>

  <?php include '../../vista/vistas/nav.php'; ?>

  <!-- CONTENIDO PRINCIPAL -->
  <main class="main-container">
    <section class="mapa-section">
      <h1>📍 Nuestra ubicación</h1>
      <p>Explora el mapa o usa tu ubicación para ver qué tan cerca estás.</p>

      <div class="controls">
        <input id="searchBox" type="text" placeholder="Buscar una dirección..." />
        <button id="useLocationBtn" class="btn">📍 Usar mi ubicación</button>
        <button id="openMapsBtn" class="btn secondary">🗺️ Ver en Google Maps</button>
      </div>

      <div id="map" class="map-frame"></div>

      <p id="status" class="status">Selecciona tu ubicación para calcular la distancia.</p>
      <button id="orderBtn" disabled class="order-btn" aria-disabled="true">Realizar Pedido</button>
    </section>
  </main>


  <!-- JS -->
  <script src="../scripts/ubicacion.js"></script>

  <!-- Carga moderna de Google Maps -->
  <script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyASgpQAGYYQpy-jFvs0veojI1q96d9LroI&libraries=places,geometry&callback=initMap&loading=async"
    async defer>
  </script>

  <!-- Menú hamburguesa -->
  <script>
    const btn = document.getElementById('btn');
    const menu = document.getElementById('menu');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        menu.classList.toggle('active');
      });
    }
  </script>
  <?php include '../../vista/vistas/footer.php'; ?>

</body>
</html>
