<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Taquería y Antojitos</title>
  <link rel="stylesheet" href="../styles/index.css">
  <link rel="stylesheet" href="../styles/Menutab.css">


</head>

<body>
   <!-- NAVBAR -->
    <nav class="navbar">
        <div class="logo">
            <img src="../images/la cruz logo1.png" alt="Logo Taquería El Sabor Mexicano">
        </div>

        <!-- CONTENEDOR DEL ÍCONO DE USUARIO + HAMBURGUESA -->
        <div class="nav-right">
            <!-- ÍCONO DE CUENTA (solo visible si hay sesión) -->
            <div class="user-menu" id="userMenu" style="display: none;">
                <img id="userIcon" src="../images/default-user.png" alt="Cuenta" 
                onclick="window.location.href='../vistas/miCuenta.php'">
            </div>

            <!-- BOTÓN HAMBURGER -->
            <div class="hamburger" onclick="toggleMenu()">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

    <ul class="nav-links">
        <li><a href="../../index.php">Inicio</a></li>
            <li><a href="../vistas/MenuGeneral.php">Menú</a></li>
            <li><a href="../vistas/ubicacion.php">Ubicación</a></li>
            <li><a href="../vistas/contacto.php">Contacto</a></li>
            <li><a href="../vistas/us.php">Sobre Nosotros</a></li>
    </ul>
        <!-- BOTONES DE AUTENTICACIÓN -->
        <div class="nav-buttons" id="authButtons">
            <button onclick="window.location.href='../vistas/login.php'">Entrar</button>
            <button class="register" onclick="window.location.href='../vistas/registrarse.php'">Registrar</button>
        </div>
    </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-content">
      <h1>Taquería y Antojitos</h1>
      <p>Los de cabeza</p>
    </div>
  </section>

  <!-- RECOMENDACIONES -->
  <section class="recomendaciones">
    <h2>Recomendaciones del día</h2>
    <div class="cards">
      <div class="card">
        <img src="../images/tacoslengua.png" alt="Lengua">
        <h3>Lengua</h3>
        <p>Sabor intenso y único, preparado con longaniza doradita y especias que conquistan desde el primer bocado.</p>
      </div>
      <div class="card">
        <img src="../images/tacoscabeza.png" alt="Cabeza">
        <h3>Cabeza</h3>
        <p>Jugosa carne de res a la plancha, cortada en trozos tiernos. Acompañada con cebolla, cilantro y salsas de la
          casa.</p>
      </div>
      <div class="card">
        <img src="../images/tacossesos.png" alt="Sesos">
        <h3>Sesos</h3>
        <p>La estrella de la taquería: carne de cerdo marinada con especias y achiote, servida con piña, cebolla y
          cilantro.</p>
      </div>
    </div>
  </section>

  <!-- MENÚ CON CARRUSEL -->
  <section class="menu-section">
    <div class="menu-header">
      <div class="menu-deco"></div>
      <h2 class="menu-title">MENÚ BEBIDAS</h2>
      <div class="menu-deco"></div>
    </div>
    <div class="carousel">
      <div class="carousel-track">
        <div class="carousel-item">
          <img src="../images/coca.png" alt="Coca-Cola">
          <p>Coca-Cola</p>
        </div>
        <div class="carousel-item">
          <img src="../images/Sprite.png" alt="Sprite">
          <p>Sprite</p>
        </div>
        <div class="carousel-item">
          <img src="../images/fanta.png" alt="Fanta">
          <p>Fanta</p>
        </div>
        <div class="carousel-item">
          <img src="../images/pepsi.png" alt="Pepsi">
          <p>Pepsi</p>
        </div>
        <div class="carousel-item">
          <img src="../images/sidralmundet.png" alt="Sidral Mundet">
          <p>Sidral Mundet</p>
        </div>
        <div class="carousel-item">
          <img src="../images/aguasbelight.png" alt="Aguas">
          <p>Aguas Be Light</p>
        </div>

      </div>
    </div>

    <!-- SECCIÓN SELECCIONA -->
    <div class="selecciona">
      <h3>Selecciona</h3>
      <div class="opciones">
        <div class="opcion">
          <img src="../images/comida-a-domicilio.png" alt="Pedir a domicilio">
          <p>Pedir a domicilio</p>
        </div>
        <div class="opcion">
          <img src="../images/establecimiento.png" alt="Tienda">
          <p>Tienda</p>
        </div>
      </div>
    </div>

    <!-- INFO EXTRA -->
    <div class="info-extra">
      <div class="info-item">
        <span>🚚</span>
        <p>ENVÍO GRATIS DESDE $900<br><a href="#">Conoce más</a></p>
      </div>
      <div class="info-item">
        <span>💳</span>
        <p>Formas de pago<br><a href="#">Conoce más</a></p>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="footer-container">
      <div class="footer-column">
        <h3>VENTAS MAYOREO</h3>
        <p><a href="mailto:cronere@cafepurtadeliclo.ca">cronere@cafepurtadeliclo.ca</a></p>
        <div class="footer-icons">
          <span>ℹ️</span>
          <span>💳</span>
        </div>
      </div>

      <div class="footer-column">
        <h3>EMPRESA</h3>
        <ul>
          <li>Nesofros</li>
          <li>Facture to compra</li>
          <li>Suctusaus</li>
          <li>Aviso de Privacidad</li>
        </ul>
      </div>

      <div class="footer-column">
        <h3>TIENDA EN LÍNEA</h3>
        <ul>
          <li>Políticas de compra</li>
          <li>Políticas de envío</li>
          <li>Formas de pago</li>
          <li>Cambios o devoluciones</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>Powered by Cafe Puerta del Cado</p>
      <div class="payment-icons">
        <span>💳 VGA</span>
        <span>🧾 3ED</span>
      </div>
    </div>
  </footer>




  <script src="../scripts/MenuTab.js"></script>
   <script src="../scripts/index.js"></script>
</body>

</html>