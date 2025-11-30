<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registro | Taquería El Sabor Mexicano</title>

    <!-- Estilos generales -->
    <link rel="stylesheet" href="../styles/index.css" />
    <link rel="stylesheet" href="../styles/login.css" />
    <link rel="stylesheet" href="../styles/registrarse.css" />
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
                onclick="window.location.href='/vista/vistas/miCuenta.php'">
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

    <!-- SECCIÓN PRINCIPAL -->
    <main class="main-container">
        <section class="left-side"></section>

        <section class="login-container">
            <h1>Regístrate</h1>
            <p class="subtitulo">Crea tu cuenta para continuar</p>

            <!-- FORMULARIO DE REGISTRO -->
            <!-- FORMULARIO DE REGISTRO -->
<form id="registroForm">
    <label for="usuario">Nombre de usuario:</label>
    <input type="text" id="usuario" name="usuario" placeholder="Ingresa tu usuario" required>

    <label for="celular">Número de celular:</label>
    <input type="tel" id="celular" name="celular" placeholder="Ej. 5551234567" required>

    <label for="password">Contraseña:</label>
    <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña" required>
    <div id="passwordMessage" class="password-message"></div>

    <label for="confirmPassword">Confirmar contraseña:</label>
    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repite tu contraseña" required>
    <div id="confirmMessage" class="password-message"></div>

    <button type="submit" class="btn boton-telefono">Registrarse</button>
</form>


            <p class="texto-registro">
                ¿Ya tienes cuenta?
                <a href="login.php" class="link-invitado">Inicia sesión aquí</a>
            </p>
        </section>
    </main>
    <script src="../scripts/registrarse.js"></script>
     <script src="../scripts/index.js"></script>
</body>

</html>