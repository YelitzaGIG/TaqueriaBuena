<!DOCTYPE html>
<html lang="es">
    <!--MenuGeneral.php-->
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Taquería y Antojitos - Los de Cabeza</title>
        <link rel="stylesheet" href="../styles/index.css">
        <link rel="stylesheet" href="../styles/MenuGeneral.css" />
        <script src="../scripts/index.js"></script>
        <!-- Botón flotante (Login o Validar Ubicación) -->
    <button id="btn-flotante-ubicacion"></button>
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
                     onclick="window.location.href = '../vistas/miCuenta.php'">
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
            <button onclick="window.location.href = '../vistas/login.php'">Entrar</button>
            <button class="register" onclick="window.location.href = '../vistas/registrarse.php'">Registrar</button>
        </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
        <div class="hero-content">
            <h1>Taquería y Antojitos</h1>
            <p>Los de cabeza</p>
        </div>
    </section>

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
            <button class="checkout" onclick="finalizarPedido()">Finalizar Pedido</button>
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
        
        <h2 class="titulo-metodo">Elige tu método de pago</h2>
        
        <div class="payment-options">
            
            <!-- Botón Mercado Pago -->
            <button id="btn-mercado" class="pay-btn mercado-btn">
                <img class="pay-logo" 
                     src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png"
                     alt="Mercado Pago">
            </button>
            
            <!-- ✅ CONTENEDOR que se mostrará cuando hagas clic -->
            <div id="wallet_container"></div>
            
            <!-- Botón PayPal -->
            <button class="pay-btn paypal-btn">
                <img class="pay-logo" 
                     src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                     alt="PayPal">
            </button>
            
            <!-- ✅ CONTENEDOR que se mostrará cuando hagas clic -->
            <div id="paypal-button-container"></div>
            
        </div>
        
        <button class="close-payment">X</button>
        
    </div>
</div>
    
    
    
    <script src="https://sdk.mercadopago.com/js/v2"></script>

    <!-- SDK de PayPal en MXN -->
    <script src="https://www.paypal.com/sdk/js?client-id=sb&currency=MXN&intent=capture"></script>
    <!--carrito-->

 <script>
 // ===============================
// MERCADO PAGO
// ===============================

document.getElementById("btn-mercado")?.addEventListener("click", async function () {
    console.log("💳 ===== ABRIENDO MERCADO PAGO EMBEBIDO =====");

    // 1️⃣ VALIDAR SESIÓN Y UBICACIÓN
    const validacion = verificarSesionYUbicacion();
    if (!validacion.valido) {
        alert(validacion.mensaje);
        return;
    }

    // 2️⃣ VALIDAR CARRITO
    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    const total = parseFloat(document.getElementById("cart-total").textContent);
    if (total <= 0) {
        alert("Carrito vacío");
        return;
    }

    console.log("💰 Total del pedido: $" + total);

    try {
        // 3️⃣ CREAR PREFERENCIA
        console.log("📝 Creando preferencia de pago...");
        
        const res = await fetch("http://localhost:3000/create_preference", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ total: total })
        });

        const data = await res.json();
        console.log("✅ Preferencia creada:", data.id);

        // 4️⃣ LIMPIAR CONTENEDOR
        const walletContainer = document.getElementById("wallet_container");
        walletContainer.innerHTML = "";
        walletContainer.style.display = "block";

        // 5️⃣ INICIALIZAR MERCADO PAGO
        const mp = new MercadoPago("APP_USR-ae72e001-96d4-42df-8159-1cd12f01675d", {
            locale: "es-MX"
        });

        const bricksBuilder = mp.bricks();

        // 6️⃣ CREAR WALLET BRICK (EMBEBIDO)
        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: data.id,
                redirectMode: "modal" // ✅ CLAVE: NO abre nueva ventana
            },
            customization: {
                texts: {
                    valueProp: "smart_option"
                }
            },
            callbacks: {
                onReady: () => {
                    console.log("✅ Botón de Mercado Pago listo");
                },
                
                onSubmit: () => {
                    console.log("🔄 Usuario hizo clic en pagar...");
                    
                    // Ocultar el modal de métodos de pago
                    const paymentModal = document.getElementById("payment-modal");
                    if (paymentModal) {
                        paymentModal.style.display = "none";
                    }
                    
                    // Iniciar simulación de 30 segundos
                    simularPagoYCrearPedido("Mercado Pago");
                },
                
                onError: (error) => {
                    console.error(" Error en Mercado Pago:", error);
                    alert("Error al procesar el pago. Intenta nuevamente.");
                }
            }
        });

        console.log("✅ Wallet Brick renderizado correctamente");

    } catch (error) {
        console.error(" ERROR:", error);
        alert("Error al conectar con Mercado Pago: " + error.message);
    }
});

// ===============================
// PAYPAL - EMBEBIDO
// ===============================
document.querySelector(".paypal-btn")?.addEventListener("click", function () {
    console.log("💳 ===== ABRIENDO PAYPAL =====");

    // Validar sesión y carrito
    const validacion = verificarSesionYUbicacion();
    if (!validacion.valido) {
        alert(validacion.mensaje);
        return;
    }

    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    const total = parseFloat(document.getElementById("cart-total").textContent);

    // Limpiar contenedor
    const paypalContainer = document.getElementById("paypal-button-container");
    paypalContainer.innerHTML = "";
    paypalContainer.style.display = "block";

    // Renderizar botón de PayPal
    paypal.Buttons({
        createOrder: function (data, actions) {
            console.log("📝 Creando orden PayPal");
            return actions.order.create({
                purchase_units: [{
                    description: "Pedido Taqueria Los de Cabeza",
                    amount: {
                        currency_code: "MXN",
                        value: total.toFixed(2)
                    }
                }]
            });
        },

        onApprove: async function (data, actions) {
            console.log("✅ Usuario aprobó el pago de PayPal");
            
            const details = await actions.order.capture();
            console.log("📦 Detalles del pago:", details);

            // Ocultar modal de pago
            const paymentModal = document.getElementById("payment-modal");
            if (paymentModal) {
                paymentModal.style.display = "none";
            }
            
            // Iniciar simulación
            simularPagoYCrearPedido("PayPal");
            
            return details;
        },

        onError: function (err) {
            console.error(" Error en PayPal:", err);
            alert("Ocurrió un error en PayPal. Por favor intenta de nuevo.");
        },

        onCancel: function (data) {
            console.warn("⚠️ Pago cancelado por el usuario");
            alert("Pago cancelado");
        },

        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 45
        }

    }).render("#paypal-button-container");

    console.log("✅ Botón de PayPal renderizado");
});
//
// ===============================
// FUNCIÓN DE SIMULACIÓN (30 segundos)
// ===============================
function simularPagoYCrearPedido(metodo) {
    console.log(`🎭 ===== SIMULANDO PAGO CON ${metodo} =====`);
    
    // Mostrar modal de "procesando pago"
    mostrarModalProcesando();
    
    let segundosRestantes = 15;
    
    // Actualizar contador cada segundo
    const intervalo = setInterval(() => {
        segundosRestantes--;
        actualizarContadorModal(segundosRestantes);
        
        console.log(`⏳ Esperando... ${segundosRestantes} segundos restantes`);
    }, 1000);
    
    // Después de 10 segundos, crear el pedido
    setTimeout(async () => {
        clearInterval(intervalo);
        
        console.log("Simulación completada, creando pedido...");
        
        try {
            // 1️Crear el pedido en tu base de datos Y registrar el pago
            const pedidoId = await crearPedido(metodo);
            
            if (!pedidoId) {
                throw new Error("No se pudo crear el pedido");
            }
            
            // Cerrar modal de procesando
            cerrarModalProcesando();
            
            console.log("🎉 ¡Pedido creado exitosamente con ID:", pedidoId);
            
            // Mostrar alerta de éxito
            alert("¡Pedido creado y pago registrado exitosamente! Serás redirigido al seguimiento.");
            
            // Redirigir después de 2 segundos
            console.log("  🔄 Redirigiendo en 2 segundos...");
            setTimeout(function() {
                window.location.href = `/TaqueriaBuenaV4/Vista/vistas/SeguimientoPedido.php?pedido_id=${pedidoId}`;
            }, 2000);
            
        } catch (error) {
            console.error(" Error al crear pedido:", error);
            cerrarModalProcesando();
            alert("Error al crear el pedido: " + error.message);
        }
        
    }, 15000); // 30 segundos
}


//function simularPagoYCrearPedido(metodo) {
//    console.log(`🎭 ===== SIMULANDO PAGO CON ${metodo} =====`);
//    
//    // Mostrar modal de "procesando pago"
//    mostrarModalProcesando();
//    
//    let segundosRestantes = 15;
//    
//    // Actualizar contador cada segundo
//    const intervalo = setInterval(() => {
//        segundosRestantes--;
//        actualizarContadorModal(segundosRestantes);
//        
//        console.log(`⏳ Esperando... ${segundosRestantes} segundos restantes`);
//    }, 1000);
//    
//    // Después de 15 segundos, crear el pedido
//    setTimeout(async () => {
//        clearInterval(intervalo);
//        
//        console.log("Simulación completada, creando pedido...");
//        
//        try {
//            // 1️⃣ Crear el pedido en tu base de datos Y registrar el pago
//            const pedidoId = await crearPedido(metodo);
//            
//            if (!pedidoId) {
//                throw new Error("No se pudo crear el pedido");
//            }
//            
//            // Cerrar modal de procesando
//            cerrarModalProcesando();
//            
//            console.log("🎉 ¡Pedido creado exitosamente con ID:", pedidoId);
//            
//            // Mostrar alerta de éxito
//            alert("¡Pedido creado y pago registrado exitosamente! Serás redirigido al seguimiento.");
//            
//            // 🔧 CAMBIO: Redirigir al CONTROLADOR en lugar de la vista directa
//            console.log("🔄 Redirigiendo en 2 segundos...");
//            setTimeout(function() {
//                // Pasar por el controlador para que obtenga los datos
//                window.location.href = `/TaqueriaBuenaV4/Controlador/SeguimientoController.php?pedido_id=${pedidoId}`;
//            }, 2000);
//            
//        } catch (error) {
//            console.error(" Error al crear pedido:", error);
//            cerrarModalProcesando();
//            alert("Error al crear el pedido: " + error.message);
//        }
//        
//    }, 15000); // 15 segundos
//}






// ===============================
// MODAL DE "PROCESANDO PAGO"
// ===============================
function mostrarModalProcesando() {
    let modal = document.getElementById("modal-procesando-pago");
    
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-procesando-pago";
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 50px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            ">
                <div class="spinner" style="
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #0f5b0f;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                
                <h2 style="color: #333; margin: 20px 0;">Procesando Pago</h2>
                
                <p style="color: #666; font-size: 16px; margin: 15px 0;">
                    Por favor espera mientras validamos tu pago...
                </p>
                
                <div style="
                    background: #f0f0f0;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                ">
                    <p style="font-size: 14px; color: #999; margin: 0;">
                        Tiempo restante:
                    </p>
                    <p id="contador-segundos" style="
                        font-size: 36px;
                        font-weight: bold;
                        color: #0f5b0f;
                        margin: 10px 0 0 0;
                    ">30</p>
                    <p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">
                        segundos
                    </p>
                </div>
                
                <p style="
                    color: #999;
                    font-size: 12px;
                    margin-top: 20px;
                ">
                    ⚠️ No cierres esta ventana
                </p>
            </div>
            
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.appendChild(modal);
    }
    
    modal.style.display = "flex";
}

function actualizarContadorModal(segundos) {
    const contador = document.getElementById("contador-segundos");
    if (contador) {
        contador.textContent = segundos;
        
        if (segundos <= 10) {
            contador.style.color = "#ff6b6b";
        }
    }
}

function cerrarModalProcesando() {
    const modal = document.getElementById("modal-procesando-pago");
    if (modal) {
        modal.style.display = "none";
        modal.remove();
    }
}

console.log("✅ Script de pagos embebidos cargado correctamente");
 </script>
 
 

    <!-- Modal de ubicación -->
    <div id="modal-ubicacion" class="modal-ubicacion">
        <div class="modal-content">
            <button class="close-modal-ubicacion">×</button>
            <h2>Validar ubicación</h2>
            <p>Asegúrate de estar dentro del área de entrega. Puedes buscar, usar tu ubicación o tocar el mapa.</p>

            <input id="searchBox" type="text" placeholder="Buscar dirección..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #ccc;margin-bottom:10px;">

            <div style="display:flex;gap:8px;margin-bottom:10px;">
                <button id="useLocationBtn" class="btn-ubicacion" style="flex:1;">📍 Usar mi ubicación</button>
                <button id="openMapsBtn" class="btn-ubicacion" style="flex:1;background:#6c757d;">🗺 Ver en Maps</button>
            </div>

            <div id="map" class="map-frame" style="height:300px;border-radius:12px;"></div>

            <div id="mensaje-ubicacion" class="status info" style="margin-top:12px;">Selecciona o busca tu ubicación.</div>

            <div style="display:flex;gap:10px;margin-top:12px;">
                <!--                    <button id="btn-validar-ubicacion" class="btn-ubicacion" style="flex:1;background:linear-gradient(135deg,#28a745,#1e7e34);">✅ Validar ubicación</button>-->
                <button id="btn-validar-ubicacion" class="btn-ubicacion">
                    ✅ Validar ubicación
                </button>


                <button class="close-modal-ubicacion" style="flex:1;background:#dc3545;">✖ Cerrar</button>
            </div>
        </div>
    </div>
    <!-- Botón flotante (Login o Validar Ubicación) -->
    <button id="btn-flotante-ubicacion"></button>

    <script src="/TaqueriaBuenaV4/Vista/scripts/validarUbicacionMenu.js"></script>
<script src="/TaqueriaBuenaV4/Vista/scripts/MenuGeneral.js"></script>
<!--<script src="/TaqueriaBuenaV4/Vista/scripts/pagos.js"></script>-->
<!--    <script src="/TaqueriaBuenaV4/Vista/scripts/validarUbicacionMenu.js"></script>
    <script src="/TaqueriaBuenaV4/Vista/scripts/MenuGeneral.js"></script>-->
    
    
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyASgpQAGYYQpy-jFvs0veojI1q96d9LroI&libraries=places,geometry&callback=initMap" async defer></script>




</body>

</html>