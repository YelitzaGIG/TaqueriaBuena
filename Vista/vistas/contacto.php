<?php
// vistas/contacto.php
?>
<!doctype html>
<html lang="es">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Contacto | Taquería La Cruz</title>
        <link rel="icon" href="../images/logo lc 2.png" />
        <link rel="stylesheet" href="../styles/us_style.css" />

        <!-- Fuentes -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Fugaz+One&display=swap" rel="stylesheet" />
    <style>
/* Tarjetas con vida */
.s-card.enhanced {
  padding: 28px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
  text-align: center;
  transition: transform .25s ease, box-shadow .25s ease;
  position: relative;
  overflow: hidden;
}
.s-card.enhanced:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.22);
}
.icon-bubble {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background: linear-gradient(135deg,#ff9a3c,#ffce4a);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:36px;
  margin:0 auto 14px auto;
  color:#fff;
  box-shadow:0 6px 12px rgba(0,0,0,0.18);
  animation:float 3s ease-in-out infinite;
}
@keyframes float {
  0%{transform:translateY(0);}50%{transform:translateY(-8px);}100%{transform:translateY(0);}
}
.titulo-mini{
  font-size:1.35rem;
  margin-bottom:6px;
  font-weight:700;
  color:#c4372a;
}
.beneficio{
  margin-top:10px;
  font-size:1.1rem;
  font-weight:600;
}
</style>
</head>
    <body>

        <!-- Nav -->
        <?php include '../vistas/nav.php'; ?>

        <!-- HERO CONTACTO -->
        <section class="hero-interno hero-pro" aria-label="Hero contacto">
            <div class="hero-inner">
                <h1 class="hero-title">Contacto</h1>
                <p class="hero-sub">Estamos aquí para atenderte con gusto.</p>
                <div class="hero-ctas">
                    <a class="btn-primary" href="../vistas/MenuGeneral.php">Ver Menú</a>
                    <a class="btn-outline" href="../vistas/ubicacion.php">Ver ubicación</a>
                </div>
            </div>

            <!-- Waves -->
            <div class="hero-waves" aria-hidden="true">
                <svg class="wave wave-back" viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,20 L1440,120 L0,120 Z"
                        fill="rgba(255,255,255,0.65)"/>
                </svg>

                <svg class="wave wave-front" viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,60 C200,10 400,110 600,60 C800,10 1000,110 1200,60 C1320,30 1440,70 1440,70 L1440,120 L0,120 Z"
                        fill="rgba(255,255,255,0.85)"/>
                </svg>
            </div>
        </section>

        <main class="us-container">

            <!-- PAGE TOP -->
            <div class="page-top">
                <h2 class="titulo-seccion">Información de Contacto</h2>
                <p class="lead">Encuentra aquí todos nuestros medios oficiales.</p>
            </div>

            <!-- CONTACTO GRID -->
            <section class="section contacto-grid">

                <article class="s-card clean enhanced"><div class="icon-bubble">✨</div>
                    
                    <h4 class="titulo-mini">Teléfono</h4>
                    <p>Llámanos directamente para hacer pedidos o resolver dudas.</p>
                    <div class="beneficio"><strong>📞</strong> 771 880 3344</div>
                </article>

                <article class="s-card clean enhanced"><div class="icon-bubble">✨</div>
                    
                    <h4 class="titulo-mini">Envíos Internacionales</h4>
                    <p>Enviamos pedidos especiales a Canadá y Estados Unidos.</p>
                    <div class="beneficio"><strong>🌎</strong> +52 771 445 9022</div>
                </article>

                <article class="s-card clean enhanced"><div class="icon-bubble">✨</div>
                    
                    <h4 class="titulo-mini">Dirección</h4>
                    <p>Visítanos en nuestra sucursal principal.</p>
                    <div class="beneficio"><strong>📍</strong> Juan Aldama 708-762, Centro, 42760 Tezontepec de Aldama, Hgo.</div>
                </article>

                <article class="s-card clean enhanced"><div class="icon-bubble">✨</div>
                    
                    <h4 class="titulo-mini">Horario</h4>
                    <p>Conoce nuestros horarios de servicio.</p>
                    <div class="beneficio"><strong>🕒</strong><br> Antojitos: Lun-Vie 9:00 AM – 1:00 PM<br>Taquitos: Todos los días 6:00 PM – 11:00 PM</div>
                </article>

            </section>

            <!-- MAPA -->
            

        </main>

        <?php include '../vistas/footer.php'; ?>

        <script>
            // reveal
            const io = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting)
                        e.target.classList.add('visible');
                });
            }, {threshold: 0.18});

            document.querySelectorAll('.section,.s-card')
                .forEach(el => io.observe(el));
        </script>

    </body>
</html>
