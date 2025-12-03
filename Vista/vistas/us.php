<?php
// vistas/us.php
?>
<!doctype html>
<html lang="es">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Sobre Nosotros | Taquería La Cruz</title>
        <link rel="icon" href="../images/logo lc 2.png" />
        <link rel="stylesheet" href="../styles/us_style.css" />

        <!-- Fuentes -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Fugaz+One&display=swap" rel="stylesheet" />
    </head>
    <body>

        <!-- Nav -->
        <?php include '../vistas/nav.php'; ?>

        <!-- HERO INTERNO -->
        <section class="hero-interno hero-pro" aria-label="Hero sobre nosotros">
            <div class="hero-inner">
                <h1 class="hero-title">Taquería La Cruz</h1>
                <p class="hero-sub">Más de <strong>40 años</strong> de tradición — Don Cruz y su familia</p>

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
                <h2 class="titulo-seccion">Sobre Nosotros</h2>
                <p class="lead">Tradición, familia y compromiso con el sabor auténtico.</p>
            </div>

            <!-- HISTORIA -->
            <section class="historia section" id="historia">

                <div class="historia-texto">
                    <h3 class="titulo-seccion">Nuestra Historia</h3>

                    <p>Somos una taquería con más de <strong>40 años</strong> de historia. Todo comenzó con <strong>Don Cruz</strong>,
                        tablajero y carnicero, quien ponía el corazón en cada corte y en cada taco. Sus manos y su esfuerzo dieron vida
                        a los primeros sabores que, con el tiempo, se volvieron parte del barrio.</p>

                    <p>Con los años, la familia fue añadiendo antojitos, no solo para ampliar el menú, sino para compartir esos platillos
                        que nacían en la cocina de casa. Cada receta surgía de momentos simples: reuniones, risas y el deseo de seguir
                        creciendo juntos.</p>

                    <p>La actual dueña creció entre esos aromas y recuerdos. Desde niña repartía pedidos, sintiendo el cariño de los vecinos 
                        y el orgullo de formar parte de un legado familiar. Esa unión, ese esfuerzo y ese amor por lo que hacemos son la base
                        de todo lo que hoy somos.</p>
                </div>

                <div class="historia-imagen parallax" data-speed="0.32">
                    <img src="../images/taquero.png" alt="Taquero trabajando">
                </div>

            </section>


            <!-- MVV -->
            <section class="mvv section glass-grid" id="mvv">
                <article class="mv-card glass">
                    <h4 class="titulo-seccion">Misión</h4>
                    <p>Ofrecer platillos auténticos usando ingredientes frescos del municipio.</p>
                </article>

                <article class="mv-card glass">
                    <h4 class="titulo-seccion">Visión</h4>
                    <p>Ser la taquería de referencia por calidad, tradición y sostenibilidad.</p>
                </article>

                <article class="mv-card glass">
                    <h4 class="titulo-seccion">Valores</h4>
                    <ul>
                        <li>Respeto por la tradición</li>
                        <li>Apoyo al comercio local</li>
                        <li>Sustentabilidad integral</li>
                        <li>Calidad y honestidad</li>
                        <li>Economía circular</li>
                        <li>Responsabilidad social</li>
                    </ul>
                </article>
            </section>

         <!-- SUSTENTABILIDAD -->
<section class="sustentable section" id="sustentabilidad">
    <h3 class="titulo-seccion">Compromiso con la Sustentabilidad</h3>
    
    <div class="sustentable-intro">
        <p class="intro-sust">En Taquería La Cruz, nuestra responsabilidad con el medio ambiente es tan importante como nuestro compromiso con el sabor auténtico. Creemos que un negocio próspero debe coexistir en armonía con su entorno, por eso hemos implementado prácticas sostenibles que nos permiten servir a nuestra comunidad mientras cuidamos el planeta.</p>
        
        <p class="intro-sust">Nuestro enfoque se basa en tres pilares fundamentales: <strong>comercio local consciente</strong>, <strong>reducción de residuos</strong> y <strong>educación ambiental</strong>. Cada decisión que tomamos, desde la selección de proveedores hasta el empaque final, está guiada por nuestro deseo de dejar un legado positivo para las futuras generaciones.</p>
    </div>

    <div class="sustentable-grid">

        <div class="s-card sabor-card glass">
            <div class="img-wrap">
                <img src="../images/local.png" alt="Apoyo local">
            </div>
            <h4 class="titulo-mini">Economía Local Circular</h4>
            <p>Más del <strong>85% de nuestros ingredientes</strong> provienen de productores locales dentro de un radio de 20 kilómetros. Trabajamos directamente con agricultores familiares, carniceros artesanales y cooperativas agrícolas, eliminando intermediarios y garantizando precios justos.</p>

        </div>

        <div class="s-card sabor-card glass">
            <div class="img-wrap">
                <img src="../images/no-plastico.png" alt="Cero plásticos">
            </div>
            <h4 class="titulo-mini">Cero Plásticos de Un Solo Uso</h4>
            <p>Hemos eliminado completamente los plásticos desechables de nuestras operaciones. Utilizamos <strong>vajilla reutilizable de plastico y acero inoxidable</strong> para servicio en local, y empaques compostables para pedidos para llevar.</p>
         
 
        </div>

        <div class="s-card sabor-card glass">
            <div class="img-wrap">
                <img src="../images/utensilios.png" alt="Trae utensilios">
            </div>
            <h4 class="titulo-mini">Programa "Trae Tu Propio Envase"</h4>
            <p>Incentivamos a nuestros clientes a participar activamente a traer su propio termo o vaso reutilizable.</p>
          
         
        </div>

    </div>
    </div>
</section>

            <!-- PRÁCTICAS ECOLÓGICAS -->
            <section class="practicas-ecologicas section" id="practicas">
                <h3 class="titulo-seccion">Nuestras Prácticas Ecológicas</h3>
                <p class="intro-sust">Implementamos acciones concretas para reducir nuestro impacto ambiental</p>

                <div class="practicas-grid">

                    <div class="practica-card glass">
                        <div class="practica-icon">🌱</div>
                        <h4 class="titulo-mini">Compostaje Orgánico</h4>
                        <p>Convertimos el 70% de nuestros residuos orgánicos en compost para huertos locales.</p>
                    </div>

                    <div class="practica-card glass">
                        <div class="practica-icon">💧</div>
                        <h4 class="titulo-mini">Ahorro de Agua</h4>
                        <p>hacemos un buen uso del agua ayudamos a reducir la huella hídrica.</p>
                    </div>


                    <div class="practica-card glass">
                        <div class="practica-icon">🌽</div>
                        <h4 class="titulo-mini">Menú de Temporada</h4>
                        <p>Ingredientes locales según temporada para reducir transporte y apoyar agricultura regional.</p>
                    </div>

                </div>
            </section>

            <!-- SABORES -->
            <section class="sabores section" id="sabores">
                <h3 class="titulo-seccion">Nuestros Sabores</h3>
                <p class="sub-text">Platillos que cuentan nuestra historia.</p>

                <div class="sabores-grid">

                    <div class="sabor-card glass">
                        <div class="img-wrap">
                            <img src="../images/tacoscabeza.png" alt="Taco de Cabeza">
                        </div>
                        <h4 class="titulo-mini">Taco de Cabeza</h4>
                        <p>Carne jugosa al estilo familiar.</p>
                    </div>

                    <div class="sabor-card glass">
                        <div class="img-wrap">
                            <img src="../images/tacoslengua.png" alt="Taco de Lengua">
                        </div>
                        <h4 class="titulo-mini">Taco de Lengua</h4>
                        <p>Sabor suave y tradicional.</p>
                    </div>

                    <div class="sabor-card glass">
                        <div class="img-wrap">
                            <img src="../images/tacossesos.png" alt="Sesos">
                        </div>
                        <h4 class="titulo-mini">Sesos</h4>
                        <p>Receta familiar con sazón especial.</p>
                    </div>

                </div>
            </section>

      

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

            document.querySelectorAll('.section,.mv-card,.s-card,.sabor-card,.practica-card')
                    .forEach(el => io.observe(el));

            // parallax
            function parallax() {
                document.querySelectorAll('.parallax').forEach(el => {
                    const s = parseFloat(el.dataset.speed || 0.25);
                    const r = el.getBoundingClientRect();
                    const c = r.top + r.height / 2 - window.innerHeight / 2;
                    el.style.transform = `translateY(${c * -s}px)`;
                });
            }
            window.addEventListener('scroll', parallax, {passive: true});
            parallax();

            // salsa btns
            document.querySelectorAll('.salsa-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const on = btn.classList.toggle("active");
                    btn.setAttribute("aria-pressed", on ? "true" : "false");
                });
            });
        </script>

    </body>
</html>