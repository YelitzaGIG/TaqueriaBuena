<?php
// vista/vistas/nav.php
session_start();

// Si existe la imagen del usuario en sesión, usarla; sino, default
$userImage = $_SESSION['user_image'] ?? '../images/default-user.png';
?>
<style>
@import url('https://fonts.googleapis.com/css2?family=Bungee+Shade&family=Bungee&display=swap');

/* ==== NAVBAR ==== */
.navbar {
    background-color: #b8561d;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 30px;
    position: relative;
    font-family: 'Bungee', cursive;
}

.navbar .logo {
    font-family: 'Bungee', cursive;
    font-size: 2em;
    color: #ffeb99;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    margin-left: 24px;
}

.logo img {
    height: 85px;
    width: auto;
}

/* MENÚ CENTRADO */
.nav-links {
    display: flex;
    gap: 20px;
    list-style: none;
    margin: 0 auto;
}

.nav-links a {
    text-decoration: none;
    color: #fff;
    font-weight: bold;
    transition: color 0.3s;
}
.nav-links a:hover {
    color: #ffcc66;
}

/* BOTONES */
.nav-buttons button {
    background-color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 8px;
    font-family: 'Bungee Shade', cursive;
}
.nav-buttons .register {
    background-color: #ffb347;
}

/* ICONO DE USUARIO */
.user-menu {
    display: none;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #e63946;
    background-size: cover;
    background-position: center;
    transition: transform 0.2s;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-menu img {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #e63946;
    transition: transform 0.2s;
    object-fit: cover;
}

.user-menu img:hover {
    transform: scale(1.1);
}

/* CONTENEDOR DERECHA */
.nav-right {
    display: flex;
    align-items: center;
    gap: 20px;
    position: absolute;
    right: 25px;
}

/* HAMBURGUESA */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 25px;
    height: 18px;
    cursor: pointer;
    position: static;
}
.hamburger span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: #fff;
    border-radius: 2px;
    transition: all 0.3s ease;
}

/* Animación menú */
.hamburger.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}
.hamburger.open span:nth-child(2) {
    opacity: 0;
}
.hamburger.open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
}

/* Ocultar botones si hay sesión */
.nav-buttons.hidden {
    display: none;
}

/* ==== RESPONSIVE NAVBAR ==== */
@media (max-width: 850px) {
    .nav-links,
    .nav-buttons {
        display: none;
        flex-direction: column;
        width: 100%;
        background-color: #b8561d;
        text-align: center;
        padding: 10px 0;
    }
    .nav-links.active,
    .nav-buttons.active {
        display: flex;
    }
    .nav-links li {
        margin: 10px 0;
    }
    .nav-buttons button {
        margin: 10px auto;
        width: 80%;
    }
    .hamburger {
        display: flex;
    }
    .navbar {
        flex-wrap: wrap;
    }
    .logo img {
        height: 70px;
    }
}

@media (max-width: 600px) {
    .navbar {
        flex-direction: column;
        align-items: flex-start;
        padding: 10px 20px;
    }
    .navbar .logo {
        font-size: 1.6em;
    }
    .nav-links {
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }
    .nav-buttons button {
        font-size: 0.9em;
        padding: 5px 10px;
    }
}

@media (max-width: 400px) {
    .navbar .logo {
        font-size: 1.4em;
    }
    .nav-buttons button {
        font-size: 0.85em;
    }
}

</style>

<nav class="navbar">
    <div class="logo">
        <img src="../images/la cruz logo1.png" alt="Logo Taquería El Sabor Mexicano">
    </div>

    <!-- CONTENEDOR DEL ÍCONO DE USUARIO + HAMBURGUESA -->
    <div class="nav-right">
        <!-- ÍCONO DE CUENTA (solo visible si hay sesión) -->
        <div class="user-menu" id="userMenu" style="display: none;">
            <img id="userIcon" src="<?php echo $userImage; ?>" alt="Cuenta" 
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

<script>
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.classList.toggle('active');
    if(navButtons) navButtons.classList.toggle('active');
    hamburger.classList.toggle('open');
}
</script>
<script src="../scripts/index.js"></script>
