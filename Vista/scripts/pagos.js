// ===============================
// ARCHIVO: Vista/scripts/pagos.js
// Maneja Mercado Pago y PayPal embebidos
// ===============================

console.log("✅ Módulo de pagos cargado");

// ===============================
// MERCADO PAGO - EMBEBIDO EN MODAL
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
        alert("Total inválido");
        return;
    }

    console.log("💰 Total del pedido: $" + total);

    try {
        // 3️⃣ CREAR PREFERENCIA
        console.log("📝 Creando preferencia de pago...");
        
        const resMercadoPago = await fetch("http://localhost:3000/create_preference", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ total: total })
        });

        const dataMercadoPago = await resMercadoPago.json();
        console.log("✅ Preferencia creada:", dataMercadoPago.id);

        // 4️⃣ CREAR MODAL PERSONALIZADO PARA MERCADO PAGO
        crearModalMercadoPago(dataMercadoPago.id, total);

    } catch (error) {
        console.error("❌ ERROR GENERAL:", error);
        alert("Error al conectar con Mercado Pago: " + error.message);
    }
});

// ===============================
// CREAR MODAL PERSONALIZADO MERCADO PAGO
// ===============================
function crearModalMercadoPago(preferenceId, total) {
    console.log("🎨 Creando modal personalizado de Mercado Pago");

    // Remover modal anterior si existe
    const modalAnterior = document.getElementById("modal-mercadopago-custom");
    if (modalAnterior) modalAnterior.remove();

    // Crear nuevo modal
    const modal = document.createElement("div");
    modal.id = "modal-mercadopago-custom";
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
        animation: fadeIn 0.3s;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            position: relative;
        ">
            <button id="cerrar-modal-mp" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: #f0f0f0;
                border: none;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
                color: #666;
                transition: all 0.3s;
            ">×</button>

            <h2 style="
                color: #333;
                margin: 0 0 10px 0;
                font-size: 24px;
            ">Pagar con Mercado Pago</h2>

            <p style="
                color: #666;
                margin: 0 0 20px 0;
                font-size: 16px;
            ">Total a pagar: <strong style="color: #0f5b0f; font-size: 20px;">$${total.toFixed(2)} MXN</strong></p>

            <div style="
                background: #f8f8f8;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
            ">
                <p style="
                    margin: 0;
                    font-size: 14px;
                    color: #666;
                    line-height: 1.5;
                ">
                    ✓ Pago 100% seguro<br>
                    ✓ Tarjetas de crédito y débito<br>
                    ✓ Protección al comprador
                </p>
            </div>

            <div id="mercadopago-checkout-container"></div>

            <p style="
                margin-top: 20px;
                font-size: 12px;
                color: #999;
                text-align: center;
            ">
                🔒 Transacción segura mediante Mercado Pago
            </p>
        </div>

        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            #cerrar-modal-mp:hover {
                background: #e0e0e0;
                transform: scale(1.1);
            }
        </style>
    `;

    document.body.appendChild(modal);

    // Botón cerrar
    document.getElementById("cerrar-modal-mp").addEventListener("click", () => {
        modal.remove();
        console.log("❌ Modal de Mercado Pago cerrado");
    });

    // Cerrar al hacer clic fuera
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
            console.log("❌ Modal cerrado (clic fuera)");
        }
    });

    // Renderizar checkout
    renderizarCheckoutMercadoPago(preferenceId);
}

// ===============================
// RENDERIZAR CHECKOUT EMBEBIDO MERCADO PAGO
// ===============================
async function renderizarCheckoutMercadoPago(preferenceId) {
    console.log("🔧 Inicializando Checkout Brick de Mercado Pago");

    const mp = new MercadoPago("APP_USR-ae72e001-96d4-42df-8159-1cd12f01675d", {
        locale: "es-MX"
    });

    const bricksBuilder = mp.bricks();

    try {
        await bricksBuilder.create("wallet", "mercadopago-checkout-container", {
            initialization: {
                preferenceId: preferenceId,
                redirectMode: "modal"
            },
            customization: {
                texts: {
                    valueProp: "smart_option",
                    action: "pay",
                    actionComplement: "Pagar"
                },
                visual: {
                    buttonBackground: "default",
                    borderRadius: "8px"
                }
            },
            callbacks: {
                onReady: () => {
                    console.log("✅ Checkout Brick listo");
                },
                onSubmit: () => {
                    console.log("🔄 Usuario inició el pago...");
                    
                    // Cerrar modal de Mercado Pago
                    const modal = document.getElementById("modal-mercadopago-custom");
                    if (modal) modal.remove();

                    // Cerrar modal de pago principal
                    const paymentModal = document.getElementById("payment-modal");
                    if (paymentModal) paymentModal.style.display = "none";
                    
                    // Iniciar simulación
                    simularPagoYCrearPedido("Mercado Pago");
                },
                onError: (error) => {
                    console.error("❌ Error en Mercado Pago:", error);
                    alert("Error al procesar el pago. Intenta nuevamente.");
                }
            }
        });

        console.log("✅ Checkout Brick renderizado correctamente");

    } catch (error) {
        console.error("❌ Error al crear Checkout Brick:", error);
        alert("Error al cargar el formulario de pago: " + error.message);
    }
}

// ===============================
// PAYPAL - EMBEBIDO EN MODAL
// ===============================
document.querySelector(".paypal-btn")?.addEventListener("click", function () {
    console.log("💳 ===== ABRIENDO PAYPAL EMBEBIDO =====");

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

    // Crear modal personalizado para PayPal
    crearModalPayPal(total);
});

// ===============================
// CREAR MODAL PERSONALIZADO PAYPAL
// ===============================
function crearModalPayPal(total) {
    console.log("🎨 Creando modal personalizado de PayPal");

    // Remover modal anterior si existe
    const modalAnterior = document.getElementById("modal-paypal-custom");
    if (modalAnterior) modalAnterior.remove();

    // Crear nuevo modal
    const modal = document.createElement("div");
    modal.id = "modal-paypal-custom";
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
        animation: fadeIn 0.3s;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            position: relative;
        ">
            <button id="cerrar-modal-paypal" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: #f0f0f0;
                border: none;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
                color: #666;
                transition: all 0.3s;
            ">×</button>

            <h2 style="
                color: #333;
                margin: 0 0 10px 0;
                font-size: 24px;
            ">Pagar con PayPal</h2>

            <p style="
                color: #666;
                margin: 0 0 20px 0;
                font-size: 16px;
            ">Total a pagar: <strong style="color: #0f5b0f; font-size: 20px;">$${total.toFixed(2)} MXN</strong></p>

            <div style="
                background: #f8f8f8;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 20px;
            ">
                <p style="
                    margin: 0;
                    font-size: 14px;
                    color: #666;
                    line-height: 1.5;
                ">
                    ✓ Pago 100% seguro<br>
                    ✓ Protección del comprador<br>
                    ✓ Sin compartir datos bancarios
                </p>
            </div>

            <div id="paypal-button-container-custom"></div>

            <p style="
                margin-top: 20px;
                font-size: 12px;
                color: #999;
                text-align: center;
            ">
                🔒 Transacción segura mediante PayPal
            </p>
        </div>

        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            #cerrar-modal-paypal:hover {
                background: #e0e0e0;
                transform: scale(1.1);
            }
        </style>
    `;

    document.body.appendChild(modal);

    // Botón cerrar
    document.getElementById("cerrar-modal-paypal").addEventListener("click", () => {
        modal.remove();
        console.log("❌ Modal de PayPal cerrado");
    });

    // Cerrar al hacer clic fuera
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
            console.log("❌ Modal cerrado (clic fuera)");
        }
    });

    // Renderizar botón
    renderizarBotonPayPal(total);
}

// ===============================
// RENDERIZAR BOTÓN PAYPAL
// ===============================
function renderizarBotonPayPal(total) {
    console.log("🔧 Inicializando botón de PayPal");

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

            // Cerrar modal de PayPal
            const modal = document.getElementById("modal-paypal-custom");
            if (modal) modal.remove();

            // Cerrar modal de pago principal
            const paymentModal = document.getElementById("payment-modal");
            if (paymentModal) paymentModal.style.display = "none";
            
            // Iniciar simulación
            simularPagoYCrearPedido("PayPal");
        },

        onError: function (err) {
            console.error("❌ Error en PayPal:", err);
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

    }).render("#paypal-button-container-custom");

    console.log("✅ Botón de PayPal renderizado");
}

console.log("✅ Módulo de pagos completamente cargado");