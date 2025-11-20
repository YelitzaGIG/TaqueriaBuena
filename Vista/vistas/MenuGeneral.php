<!DOCTYPE html>
<html lang="es">
<!--MenuGeneral.php-->
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Taquería y Antojitos - Los de Cabeza</title>
    <link rel="stylesheet" href="../styles/index.css">
    <link rel="stylesheet" href="../styles/MenuGeneral.css" />
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
            <li><a href="#">Contacto</a></li>
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
    <!-- INDICADOR DE ESTADO (Agregar después del navbar en MenuGeneral.php) -->
<div id="estado-pedido" class="estado-pedido">
    👤 Cargando estado...
</div>

<style>
/* ========================================
   INDICADOR DE ESTADO
   ======================================== */
.estado-pedido {
    position: fixed;
    top: 70px; /* Debajo del navbar */
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    z-index: 9998;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    text-align: center;
    max-width: 90%;
}

/* Estado: Invitado */
.estado-invitado {
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    color: #fff;
    border: 2px solid #ff9800;
}

/* Estado: Sin ubicación */
.estado-sin-ubicacion {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: #fff;
    border: 2px solid #c82333;
    cursor: pointer;
}

.estado-sin-ubicacion:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.3);
}

/* Estado: Listo */
.estado-listo {
    background: linear-gradient(135deg, #28a745 0%, #218838 100%);
    color: #fff;
    border: 2px solid #218838;
}

/* Animación de entrada */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

.estado-pedido {
    animation: slideDown 0.5s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
    .estado-pedido {
        top: 60px;
        font-size: 12px;
        padding: 10px 20px;
    }
}

@media (max-width: 480px) {
    .estado-pedido {
        position: relative;
        top: 0;
        left: 0;
        transform: none;
        margin: 10px;
        max-width: calc(100% - 20px);
    }
}
</style>

<script>
// Hacer clic en el indicador cuando no hay ubicación
document.addEventListener('DOMContentLoaded', () => {
    const indicador = document.getElementById('estado-pedido');
    
    indicador?.addEventListener('click', () => {
        if (indicador.classList.contains('estado-sin-ubicacion')) {
            const modal = document.getElementById('modal-ubicacion');
            if (modal) {
                modal.style.display = 'flex';
            }
        }
    });
});
</script>
    

    <!-- TABS -->
    <div class="tabs-wrap">
        <div class="tabs">
            <button class="tab active" data-target="tacos">TACOS</button>
            <button class="tab" data-target="antojitos">ANTOJITOS MEX.</button>
            <button class="tab" data-target="bebidas">BEBIDAS</button>
        </div>
        <div class="tab-underline" aria-hidden="true"></div>
    </div>

    <!-- MENU LIST -->
    <main class="menu-list" id="menu-list">

        <!-- TACOS -->
        <article class="menu-item" data-category="tacos">
            <div class="item-left">
                <h3 class="item-title">TACO DE CACHETE</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Taco de cachete de res tierno, sazonado al estilo tradicional, servido con
                    cilantro y cebolla.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/tacoscachete.png" alt="Taco de cachete">
                    <button class="plus-btn" aria-label="Agregar Taco de cachete" data-name="Taco de cachete"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="tacos">
            <div class="item-left">
                <h3 class="item-title">TACO DE LENGUA</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Taco de lengua suave y jugosa, con cebolla, cilantro y un toque de limón.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/tacoslengua.png" alt="Taco de lengua">
                    <button class="plus-btn" aria-label="Agregar Taco de Lengua" data-name="Taco de Lengua"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="tacos">
            <div class="item-left">
                <h3 class="item-title">TACO DE LABIO</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Taco de labio de res cocido a fuego lento, con su jugo natural y especias
                    mexicanas.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/tacolabio.png" alt="Taco de Labio">
                    <button class="plus-btn" aria-label="Agregar Taco de Labio" data-name="Taco de Labio"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="tacos">
            <div class="item-left">
                <h3 class="item-title">TACO DE OJO</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Taco de ojo de res, sazonado con nuestra receta especial y acompañado de cebolla
                    y cilantro.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/tacosojo.png" alt="Taco de ojo">
                    <button class="plus-btn" aria-label="Agregar Taco de Ojo" data-name="Taco de Ojo"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="tacos">
            <div class="item-left">
                <h3 class="item-title">TACO DE SESOS</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Taco de sesos de res, cremoso y suave, acompañado de cebolla fresca y cilantro.
                </p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/tacossesos.png" alt="Taco de sesos">
                    <button class="plus-btn" aria-label="Agregar Taco de Sesos" data-name="Taco de Sesos"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="tacos">
            <div class="item-left">
                <h3 class="item-title">TACO DE TRIPA</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Taco de tripa crujiente por fuera y suave por dentro, con salsa especial y limón.
                </p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/tacostripa.png" alt="Taco de tripa">
                    <button class="plus-btn" aria-label="Agregar Taco de Tripa" data-name="Taco de Tripa"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="tacos">
            <div class="item-left">
                <h3 class="item-title">TACO DE CABEZA</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Taco de cabeza de res, jugoso y lleno de sabor, con cebolla, cilantro y salsa al
                    gusto.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/tacoscabeza.png" alt="Taco de cabeza">
                    <button class="plus-btn" aria-label="Agregar Taco de Cabeza" data-name="Taco de Cabeza"
                        data-price="20">+</button>
                </div>
            </div>
        </article>


        <!-- ANTOJITOS -->
        <article class="menu-item" data-category="antojitos">
            <div class="item-left">
                <h3 class="item-title">QUESADILLAS</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Quesadillas de queso fundido con opción de carne al gusto, servidas calientes en
                    tortilla de maíz.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/quesadillas.png" alt="Quesadillas">
                    <button class="plus-btn" aria-label="Agregar Quesadillas" data-name="Quesadillas"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="antojitos">
            <div class="item-left">
                <h3 class="item-title">SOPES</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Sopes gruesos de maíz, cubiertos con frijoles, carne, crema, queso y salsa al
                    gusto.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/sopes.png" alt="Sopes">
                    <button class="plus-btn" aria-label="Agregar Sopes" data-name="Sopes" data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="antojitos">
            <div class="item-left">
                <h3 class="item-title">TLACOYOS</h3>
                <div class="meta">
                    <span class="price">$25.00</span>
                </div>
                <p class="description">Tlacoyos rellenos de frijoles, chicharrón o haba, con queso fresco y salsa
                    picante.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/tlacoyos.png" alt="Tlacoyos">
                    <button class="plus-btn" aria-label="Agregar Tlacoyos" data-name="Tlacoyos"
                        data-price="25">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="antojitos">
            <div class="item-left">
                <h3 class="item-title">GORDITAS</h3>
                <div class="meta">
                    <span class="price">$25.00</span>
                </div>
                <p class="description">Gorditas rellenas de carne, chicharrón o frijoles, servidas con salsa y crema al
                    gusto.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/gorditas.png" alt="Gorditas">
                    <button class="plus-btn" aria-label="Agregar Gorditas" data-name="Gorditas"
                        data-price="25">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="antojitos">
            <div class="item-left">
                <h3 class="item-title">TAMALES</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Tamales tradicionales de masa suave, rellenos de carne, pollo o rajas, envueltos
                    en hoja de maíz.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/tamales.png" alt="Tamales">
                    <button class="plus-btn" aria-label="Agregar Tamales" data-name="Tamales" data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="antojitos">
            <div class="item-left">
                <h3 class="item-title">ENCHILADAS</h3>
                <div class="meta">
                    <span class="price">$35.00</span>
                </div>
                <p class="description">Enchiladas bañadas en salsa roja o verde, rellenas de pollo o queso y acompañadas
                    de crema y queso fresco.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/enchiladas.png" alt="Enchiladas">
                    <button class="plus-btn" aria-label="Agregar Enchiladas" data-name="Enchiladas"
                        data-price="35">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="antojitos">
            <div class="item-left">
                <h3 class="item-title">EMPANADAS</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Empanadas rellenas de carne, queso o verduras, fritas hasta dorarse y servidas
                    calientes.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/empanadas.png" alt="Empanadas">
                    <button class="plus-btn" aria-label="Agregar Empanadas" data-name="Empanadas"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="antojitos">
            <div class="item-left">
                <h3 class="item-title">PAMBAZOS</h3>
                <div class="meta">
                    <span class="price">$25.00</span>
                </div>
                <p class="description">Pambazos rellenos de papa con chorizo, bañados en salsa roja y acompañados de
                    lechuga y crema.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/pambazos.png" alt="Pambazos">
                    <button class="plus-btn" aria-label="Agregar Pambazos" data-name="Pambazos"
                        data-price="25">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="antojitos">
            <div class="item-left">
                <h3 class="item-title">CHILAQUILES</h3>
                <div class="meta">
                    <span class="price">$35.00</span>
                </div>
                <p class="description">Chilaquiles crujientes bañados en salsa roja o verde, acompañados de crema, queso
                    y cebolla.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/chilaquiles.png" alt="Chilaquiles">
                    <button class="plus-btn" aria-label="Agregar Chilaquiles" data-name="Chilaquiles"
                        data-price="35">+</button>
                </div>
            </div>
        </article>


        <!-- BEBIDAS -->
        <article class="menu-item" data-category="bebidas">
            <div class="item-left">
                <h3 class="item-title">COCA-COLA</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Refresco clásico de cola, burbujeante y refrescante, ideal para acompañar
                    cualquier platillo.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/coca.png" alt="Coca-Cola">
                    <button class="plus-btn" aria-label="Agregar Coca-Cola" data-name="Coca-Cola"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="bebidas">
            <div class="item-left">
                <h3 class="item-title">SPRITE</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Refresco de limón y burbujas refrescantes, perfecto para calmar la sed y
                    disfrutar en cualquier momento.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/Sprite.png" alt="Sprite">
                    <button class="plus-btn" aria-label="Agregar Sprite" data-name="Sprite" data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="bebidas">
            <div class="item-left">
                <h3 class="item-title">FANTA</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Refresco de naranja vibrante y dulce, ideal para acompañar antojitos mexicanos
                    con sabor único.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/fanta.png" alt="Fanta">
                    <button class="plus-btn" aria-label="Agregar Fanta" data-name="Fanta" data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="bebidas">
            <div class="item-left">
                <h3 class="item-title">PEPSI</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Refresco de cola con un sabor intenso y refrescante, perfecto para acompañar
                    tacos y antojitos.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/pepsi.png" alt="Pepsi">
                    <button class="plus-btn" aria-label="Agregar Pepsi" data-name="Pepsi" data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="bebidas">
            <div class="item-left">
                <h3 class="item-title">SIDRAL MUNDET</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Refresco de manzana natural, dulce y burbujeante, perfecto para acompañar
                    antojitos tradicionales.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/sidralmundet.png" alt="Sidral Mundet">
                    <button class="plus-btn" aria-label="Agregar Sidral Mundet" data-name="Sidral Mundet"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

        <article class="menu-item" data-category="bebidas">
            <div class="item-left">
                <h3 class="item-title">AGUAS FRESCAS</h3>
                <div class="meta">
                    <span class="price">$20.00</span>
                </div>
                <p class="description">Aguas frescas de sabores naturales como jamaica, naranja o limón, refrescantes y
                    deliciosas.</p>
            </div>
            <div class="item-right">
                <div class="img-box">
                    <img src="../images/aguasbelight.png" alt="Aguas Frescas">
                    <button class="plus-btn" aria-label="Agregar Aguas Frescas" data-name="Aguas Frescas"
                        data-price="20">+</button>
                </div>
            </div>
        </article>

    </main>

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


    <!-- BOTÓN FLOTANTE DEL CARRITO -->
    <button id="cart-btn" class="cart-btn">🛒</button>

    <!-- PANEL DEL CARRITO -->
    <div class="cart-panel" id="cart-panel">
        <div class="cart-panel-header">
            <span>Tu Pedido</span>
            <button id="close-cart">✖</button>
        </div>
        <div class="cart-items" id="cart-items"></div>
        <div class="cart-summary">
            <p>Total: $<span id="cart-total">0</span></p>
            <button class="checkout">Finalizar Pedido</button>
        </div>
    </div>

    <!-- CUADRO DE PERSONALIZACIÓN -->
    <div class="customization-overlay" id="customization-overlay">
        <div class="customization-box">
            <button id="close-customization" class="close-customization">✖</button>
            <img id="custom-img" src="" alt="" />
            <h3 id="custom-name"></h3>
            <p id="custom-desc"></p>

            <!-- Opciones se generan dinámicamente según categoría -->
            <div class="custom-options"></div>

            <label>Instrucciones especiales:</label>
            <textarea id="custom-instructions" placeholder="Escribe aquí..."></textarea>

            <div class="custom-qty">
                <label>Cantidad:</label>
                <input type="number" id="custom-qty" value="1" min="1">
            </div>

            <button id="add-to-cart">Agregar al carrito</button>
        </div>
    </div>

<!-- 🟦 MODAL DE MÉTODOS DE PAGO -->
<div id="payment-modal" class="payment-modal">
    <div class="payment-content">

        <!-- Título -->
        <h2 class="titulo-metodo">Elige tu método de pago</h2>

        <!-- Opciones de pago -->
        <div class="payment-options">

            <!-- Mercado Pago -->
            <button class="pay-btn mercado-btn">
                <img class="pay-logo" 
                     src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png"
                     alt="Mercado Pago">
            </button>

            <!-- PayPal -->
            <div class="pay-btn paypal-btn">

                <!-- Contenedor para el botón oficial de PayPal -->
                <div id="paypal-button-container" style="margin-top: 10px; width: 100%;"></div>
            </div>

        </div>

        <!-- Botón cerrar -->
        <button class="close-payment">X</button>

    </div>
</div>


<!-- SDK de PayPal en MXN -->
<script src="https://www.paypal.com/sdk/js?client-id=sb&currency=MXN&intent=capture"></script>
<!--carrito-->
<script>
document.querySelector(".paypal-btn").addEventListener("click", function () {
    // Limpiar contenedor previo
    document.getElementById("paypal-button-container").innerHTML = "";

    // Obtener el total del carrito
    let total = parseFloat(document.getElementById("cart-total").textContent) || 0;

    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: "Pedido Taquería Los de Cabeza",
                    amount: {
                        currency_code: "MXN", // ← CAMBIADO A PESO MEXICANO
                        value: total.toFixed(2)
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                const nombre = details.payer.name.given_name || "Comprador";
                alert(`¡Pago Completado por ${nombre}! Transacción de $${total.toFixed(2)} MXN (SANDBOX).`);
                console.log("Detalles completos:", details);
            });
        },
        onError: function (err) {
            console.error("Error en el pago:", err);
            alert("Ocurrió un error en PayPal.");
        }
    }).render("#paypal-button-container");
});
</script>


<!-- 📍 MODAL DE VALIDACIÓN DE UBICACIÓN -->
<div id="modal-ubicacion" class="modal-ubicacion">
    <div class="modal-content">
        <!-- Botón cerrar -->
        <button class="close-modal-ubicacion" aria-label="Cerrar modal">✖</button>
        
        <!-- Encabezado -->
        <h2>📍 Valida tu ubicación</h2>
        <p>Para realizar pedidos a domicilio, necesitamos verificar que estés dentro de nuestra área de entrega (máximo 3 km).</p>

        <!-- Instrucciones -->
        <div class="ubicacion-info">
            <p><strong>¿Cómo validar?</strong></p>
            <ul style="list-style: none; padding-left: 0; margin-top: 10px;">
                <li>1️⃣ Busca tu dirección en el campo de abajo</li>
                <li>2️⃣ Usa el botón para obtener tu ubicación automáticamente</li>
                <li>3️⃣ O haz clic directamente en el mapa</li>
                <li>4️⃣ Confirma tu ubicación con el botón verde</li>
            </ul>
        </div>

        <!-- Modo invitado -->
        <div class="alerta-invitado" id="alerta-invitado" style="display: none;">
            <p>👤 <strong>Navegando como invitado</strong></p>
            <p>Puedes ver el menú, pero necesitas iniciar sesión para hacer pedidos.</p>
            <button class="btn-iniciar-sesion" onclick="window.location.href='../vistas/login.php'">
                🔐 Iniciar sesión
            </button>
        </div>

        <!-- Campo de búsqueda -->
        <input 
            id="searchBox" 
            type="text" 
            placeholder="🔍 Buscar dirección (ej: Calle Juárez 123)"
            autocomplete="off"
        />

        <!-- Botón geolocalización -->
        <button id="btn-obtener-ubicacion" class="btn-ubicacion">
            📍 Usar mi ubicación actual
        </button>

        <!-- Mapa interactivo -->
        <div id="map" class="map-frame"></div>

        <!-- Mensaje de estado -->
        <p id="mensaje-ubicacion" class="status info">
            Selecciona o busca tu ubicación para verificar si podemos entregar en tu zona.
        </p>

        <!-- Botón de confirmar ubicación -->
        <button id="btn-confirmar-ubicacion" class="btn-confirmar-ubicacion" disabled style="display: none;">
            ✓ Confirmar mi ubicación
        </button>

        <!-- Información adicional -->
        <div class="info-adicional">
            <p><small>💡 <strong>Nota:</strong> Tu ubicación se guarda por 24 horas. Puedes cambiarla cuando quieras.</small></p>
        </div>
    </div>
</div>

<!-- 🔄 BOTÓN FLOTANTE PARA REVALIDAR (Visible después de cerrar modal) -->
<button id="btn-revalidar-ubicacion" style="display: none;" title="Cambiar ubicación">
    Cambiar ubicación
</button>

<style>
.ubicacion-info {
    background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
    border-left: 4px solid #1b7a3f;
    padding: 15px;
    margin: 15px 0;
    border-radius: 10px;
}

.ubicacion-info ul li {
    margin: 8px 0;
    color: #2e7d32;
    font-weight: 500;
}

/* Alerta de invitado */
.alerta-invitado {
    background: linear-gradient(135deg, #fff3cd 0%, #ffe5a0 100%);
    border: 2px solid #ffc107;
    border-radius: 12px;
    padding: 20px;
    margin: 15px 0;
    text-align: center;
}

.alerta-invitado p {
    margin: 8px 0;
    color: #856404;
    font-weight: 600;
}

.btn-iniciar-sesion {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.btn-iniciar-sesion:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

/* Botón confirmar ubicación */
.btn-confirmar-ubicacion {
    width: 100%;
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
    border: none;
    padding: 16px 20px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 700;
    cursor: not-allowed;
    margin: 20px 0 10px 0;
    transition: all 0.3s ease;
    opacity: 0.6;
}

.btn-confirmar-ubicacion.enabled {
    background: linear-gradient(135deg, #28a745 0%, #218838 100%);
    cursor: pointer;
    opacity: 1;
    box-shadow: 0 5px 20px rgba(40, 167, 69, 0.4);
    animation: pulse-confirm 2s ease-in-out infinite;
}

.btn-confirmar-ubicacion.enabled:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.5);
}

@keyframes pulse-confirm {
    0%, 100% {
        box-shadow: 0 5px 20px rgba(40, 167, 69, 0.4);
    }
    50% {
        box-shadow: 0 5px 30px rgba(40, 167, 69, 0.6);
    }
}

.info-adicional {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px;
    margin-top: 15px;
    text-align: center;
}

.info-adicional small {
    color: #666;
}

/* Responsive */
@media (max-width: 768px) {
    .ubicacion-info ul li {
        font-size: 14px;
    }
    
    .btn-confirmar-ubicacion {
        font-size: 16px;
        padding: 14px 20px;
    }
}
</style>

<script>
// Verificar si es invitado y mostrar alerta
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    const alertaInvitado = document.getElementById("alerta-invitado");
    
    if (!usuario && alertaInvitado) {
        alertaInvitado.style.display = "block";
    }
    
    // Ocultar botón de confirmar inicialmente
    const btnConfirmar = document.getElementById("btn-confirmar-ubicacion");
    if (btnConfirmar) {
        btnConfirmar.style.display = "none";
    }
});
</script>



    <script src="../scripts/validarUbicacionMenu.js"></script>
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyASgpQAGYYQpy-jFvs0veojI1q96d9LroI&libraries=places,geometry&callback=initMap&loading=async"
      async defer>
    </script>
    <script src="../scripts/MenuGeneral.js"></script>
         <script src="../scripts/index.js"></script>
</body>

</html>