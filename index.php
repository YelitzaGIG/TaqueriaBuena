<?php
//index.php
session_start();

// Si existe la imagen del usuario en sesión, usarla; sino, default
$userImage = $_SESSION['user_image'] ?? 'Vista/images/default-user.png';

if (isset($_GET['pedido_id'])) {
    require "controlador/SeguimientoController.php";
    $seg = new SeguimientoController();
    $seg->mostrar();
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Taquería y Antojitos</title>
        <link rel="stylesheet" href="Vista/styles/index.css" />
    </head>

    
    <body>
   <!-- NAVBAR -->
    <nav class="navbar">
        <div class="logo">
            <img src="Vista/images/la cruz logo1.png" alt="Logo Taquería El Sabor Mexicano">
        </div>

        <!-- CONTENEDOR DEL ÍCONO DE USUARIO + HAMBURGUESA -->
        <div class="nav-right">
            <!-- ÍCONO DE CUENTA (solo visible si hay sesión) -->
            <div class="user-menu" id="userMenu" style="display: none;">
                <img id="userIcon" src="Vista/images/default-user.png" alt="Cuenta" 
                onclick="window.location.href='Vista/vistas/miCuenta.php'">
            </div>

            <!-- BOTÓN HAMBURGER -->
            <div class="hamburger" onclick="toggleMenu()">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

         <ul class="nav-links">
             <li><a href="index.php">Inicio</a></li>
             <li><a href="Vista/vistas/MenuGeneral.php">Menú</a></li>
            <li><a href="Vista/vistas/ubicacion.php">Ubicación</a></li>
            <li><a href="Vista/vistas/contacto.php">Contacto</a></li>
            <li><a href="Vista/vistas/us.php">Sobre Nosotros</a></li>
    </ul>

        <!-- BOTONES DE AUTENTICACIÓN -->
        <div class="nav-buttons" id="authButtons">
            <button onclick="window.location.href='Vista/vistas/login.php'">Entrar</button>
            <button class="register" onclick="window.location.href='Vista/vistas/registrarse.php'">Registrar</button>
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
                    <img src="Vista/images/tacoslengua.png" alt="Lengua">
                    <h3>Lengua</h3>
                    <p>Sabor intenso y único, preparado con longaniza doradita y especias que conquistan desde el primer
                        bocado.</p>
                </div>
                <div class="card">
                    <img src="Vista/images/tacoscabeza.png" alt="Cabeza">
                    <h3>Cabeza</h3>
                    <p>Jugosa carne de res a la plancha, cortada en trozos tiernos. Acompañada con cebolla, cilantro y
                        salsas de la casa.</p>
                </div>
                <div class="card">
                    <img src="Vista/images/tacossesos.png" alt="Sesos">
                    <h3>Sesos</h3>
                    <p>La estrella de la taquería: carne de cerdo marinada con especias y achiote, servida con piña, cebolla
                        y cilantro.</p>
                </div>
            </div>
        </section>

        <!-- MENÚ -->
        <section class="menu-section">
            <div class="menu-header">
                <div class="menu-deco"></div>
                <h2 class="menu-title">MENÚ</h2>
                <div class="menu-deco"></div>
            </div>

            <div class="menu-items">
                <div class="menu-item">
                    <a href="Vista/vistas/MenuTacos.php">
                        <img src="Vista/images/tacoscabeza.png" alt="Tacos">
                        <p>Tacos</p>
                    </a>
                </div>
                <div class="menu-item">
                    <a href="Vista/vistas/MenuAntojitos.php">
                        <img src="Vista/images/antojitos.png" alt="Antojitos">
                        <p>Antojitos</p>
                    </a>
                </div>
                <div class="menu-item">
                    <a href="Vista/vistas/MenuBebidas.php">
                        <img src="Vista/images/bebidas.png" alt="Bebidas">
                        <p>Bebidas</p>
                    </a>
                </div>
            </div>
        </section>

        <footer>
            <div class="footer-container">

                <!-- Columna 1 -->
                <div class="footer-column">
                    <h3>VENTAS AL MAYOREO</h3>
                    <p>
                        <a href="mailto:contacto@tacoslacruz.com">contacto@tacoslacruz.com</a>
                    </p>
                    <div class="footer-icons">
                        <span>📞</span>
                        <span>💳</span>
                    </div>
                </div>

                <!-- Columna 2 -->
                <div class="footer-column">
                    <h3>EMPRESA</h3>
                    <ul>
                        <li><a href="Vista/vistas/us.php">Nosotros</a></li>
                        <li><a href="#">Términos de servicio</a></li>
                        <li><a href="#">Aviso de privacidad</a></li>
                    </ul>
                </div>

                <!-- Columna 3 -->
                <div class="footer-column">
                    <h3>TIENDA EN LÍNEA</h3>
                    <ul>
                        <li><a href="#">Políticas de compra</a></li>
                        <li><a href="#">Políticas de envío</a></li>
                        <li><a href="#">Formas de pago</a></li>
                        <li><a href="#">Cambios y devoluciones</a></li>
                    </ul>
                </div>

            </div>

            <div class="footer-bottom">
                <p>© 2025 Taquería y Antojitos La Cruz • Todos los derechos reservados</p>
                <div class="payment-icons">
                    <span>💳</span>
                    <span>🧾</span>
                </div>
            </div>
        </footer>

        <!-- Scripts -->
        <script src="Vista/scripts/index.js"></script>
    </body>

</html>