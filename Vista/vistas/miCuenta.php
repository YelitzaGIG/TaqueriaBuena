<!DOCTYPE html>
<!--miCuenta.php-->
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Cuenta</title>
  <link rel="stylesheet" href="../styles/miCuenta.css">
  <link rel="stylesheet" href="../styles/index.css">
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

  <!-- PERFIL DEL USUARIO -->
  <main class="perfil">
    <img id="fotoUsuario" class="foto" src="" alt="Foto de usuario">
    <h3 id="nombreUsuario"></h3>
     <p id="telefonoUsuario"></p> <!-- <- aquí agregamos el teléfono -->
    <p id="emailUsuario"></p>
    <p id="metodoUsuario"></p>

    <!-- AQUI VA EL BOTÓN DE CERRAR SESIÓN -->
    <button id="btnCerrarSesion" class="btn-logout">Cerrar sesión</button>
  </main>

  <script src="../scripts/miCuenta.js"></script>
  <script src="../scripts/index.js"></script>
</body>
</html>
