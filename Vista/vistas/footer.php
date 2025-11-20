<footer>
  <style>
    /* ==== FUENTE === */
    @import url('https://fonts.googleapis.com/css2?family=Bungee+Shade&family=Bungee&display=swap');

    /* ==== FOOTER ==== */
    footer {
      background-color: #742b0c;
      padding: 30px 0 10px;
      color: #f1d29a;
      font-family: 'Bungee', sans-serif;
    }

    .footer-container {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      text-align: left;
      color: #f1d29a;
      max-width: 1200px;
      margin: auto;
    }

    .footer-column {
      width: 250px;
      margin-bottom: 20px;
    }

    .footer-column h3 {
      color: #ffcc66;
      margin-bottom: 10px;
      font-size: 1.1em;
    }

    .footer-column ul {
      list-style: none;
      padding: 0;
    }

    .footer-column li {
      margin-bottom: 6px;
      font-size: 0.9em;
    }

    .footer-column a {
      color: #ffd98a;
      text-decoration: none;
    }

    .footer-icons span {
      font-size: 1.5em;
      margin-right: 10px;
    }

    .footer-bottom {
      margin-top: 20px;
      border-top: 1px solid #a65a2f;
      padding-top: 10px;
      font-size: 0.9em;
      text-align: center;
    }

    .payment-icons span {
      margin: 0 5px;
    }

    /* ======= RESPONSIVE ======= */

    @media (max-width: 850px) {
      .footer-container {
        justify-content: center;
        text-align: center;
      }

      .footer-column {
        width: 80%;
      }
    }

    @media (max-width: 450px) {
      .footer-column h3 {
        font-size: 1em;
      }
      .footer-bottom {
        font-size: 0.75em;
      }
    }
  </style>

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
        <li><a href="../vistas/us.php">Nosotros</a></li>
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
