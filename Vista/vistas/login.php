<!DOCTYPE html>
<!-- login.php -->
<html lang="es">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login | Taquería El Sabor Mexicano</title>

        <!-- Estilos generales -->
        <link rel="stylesheet" href="../styles/index.css" />
        <link rel="stylesheet" href="../styles/login.css" />
             <!-- Scripts -->
        <script src="../scripts/login.js"></script>
        <script src="../scripts/index.js"></script>

        <!-- Script de Google Identity -->
        <script src="https://accounts.google.com/gsi/client" async defer></script>
    </head>

    <body>
        <!-- NAVBAR -->
        <nav class="navbar">
            <div class="logo">
                <img src="../images/la cruz logo1.png" alt="Logo Taquería El Sabor Mexicano">
            </div>

            <div class="nav-right">
                <div class="user-menu" id="userMenu" style="display: none;">
                    <img id="userIcon" src="../images/default-user.png" alt="Cuenta" 
                         onclick="window.location.href = '../vistas/miCuenta.php'">
                </div>

                <div class="hamburger" onclick="toggleMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <ul class="nav-links">
                <li><a href="../../index.php">Inicio</a></li>
                <li><a href="../vistas/MenuGeneral.php">Menú</a></li>
                <li><a href="#">Ubicación</a></li>
                <li><a href="../vistas/contacto.php">Contacto</a></li>
                <li><a href="#">Sobre Nosotros</a></li>
            </ul>

            <div class="nav-buttons" id="authButtons">
                <button onclick="window.location.href = '../vistas/login.php'">Entrar</button>
                <button class="register" onclick="window.location.href = '../vistas/registrarse.php'">Registrar</button>
            </div>
        </nav>

        <!-- SECCIÓN PRINCIPAL -->
        <main class="main-container">
            <section class="left-side"></section>

            <section class="login-container">
                <h1>Taquería El Sabor Mexicano</h1>
                <p class="subtitulo">Elige cómo quieres continuar</p>

                <!-- Botón para iniciar con teléfono o usuario -->
                <button class="btn boton-telefono">
                    <img src="../images/telefono.png" class="icono" alt="Teléfono Icon">
                    Continuar con teléfono o usuario
                </button>

                <!-- Botón de Google -->
                <div id="g_id_onload" data-client_id="656539192338-6pftpqqqkqif8e0qe9lurrf0utvskg3o.apps.googleusercontent.com"
                     data-context="signin" data-ux_mode="popup" data-callback="handleCredentialResponse" data-auto_select="false" data-use_fedcm_for_prompt="false"
                     >
                </div>
                <div class="google-center">
                    <div class="google-wrapper">
                        <div class="g_id_signin"
                             data-type="standard"
                             data-shape="rectangular"
                             data-theme="outline"
                             data-text="signin_with"
                             data-size="large"
                             data-logo_alignment="left">
                        </div>
                    </div>
                </div>


                <!-- Continuar como invitado -->
                <a href="../../index.php" class="link-invitado" id="guestLink">Continuar como invitado</a>

                <p class="texto-registro">
                    ¿No tienes cuenta?
                    <a href="registrarse.php" class="link-invitado">Regístrate aquí</a>
                </p>
            </section>
        </main>

        <!-- MODAL DE TELÉFONO/USUARIO -->
        <div id="telefonoModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Iniciar sesión con teléfono o usuario</h2>
                <form id="telefonoForm">
                    <label for="celular">Número de celular o usuario:</label>
                    <input type="text" id="celular" name="celular" placeholder="Ej. 5551234567 o nombreUsuario" required>

                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña" required>
                    <div id="passwordMessage" class="password-message"></div>

                    <button type="submit">Iniciar sesión</button>
                </form>
            </div>
        </div>

   
    </body>

</html>
