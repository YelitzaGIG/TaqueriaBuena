<?php
// HERO + CSS
?>
<style>
/* ==== HERO ==== */
.hero {
    background: url('../images/tacos y antojitos.png') center/cover no-repeat;
  /*background: url('../images/tacos\ y\ antojitos.png') center/cover no-repeat; */
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
}

.hero-content {
    background: rgba(0, 0, 0, 0.55);
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
}

.hero-content h1 {
    font-family: 'Bungee Shade', cursive;
    font-size: 3.8em;
    color: #ffcc66;
    text-shadow:
        0 0 25px rgba(0, 0, 0, 0.9),
        0 0 60px rgba(0, 0, 0, 0.7);
    letter-spacing: 3px;
    margin-bottom: 10px;
}

.hero-content p {
    font-family: 'Bungee', cursive;
    font-size: 1.6em;
    color: #ffe08a;
    text-shadow:
        0 0 15px rgba(0, 0, 0, 0.8),
        0 0 40px rgba(0, 0, 0, 0.6);
}
</style>

<!-- HERO -->
        <section class="hero">
            <div class="hero-content">
                <h1>Taquería y Antojitos</h1>
                <p>Los de cabeza</p>
            </div>
        </section>
