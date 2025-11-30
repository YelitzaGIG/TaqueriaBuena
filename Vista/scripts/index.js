//index.js
// --- Función para menú hamburguesa ---
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  const navButtons = document.querySelector('.nav-buttons');
  const hamburger = document.querySelector('.hamburger');
  navLinks.classList.toggle('active');
  navButtons.classList.toggle('active');
  hamburger.classList.toggle('open');
}

// --- Mostrar ícono de cuenta si hay sesión ---
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const authButtons = document.getElementById("authButtons");
  const userMenu = document.getElementById("userMenu");
  const userIconImg = document.getElementById("userIcon");

  console.log("Usuario desde localStorage:", usuario); // ✅ DEBUG

  if (usuario) {
    // Ocultar botones de autenticación y mostrar menú de usuario
    if (authButtons) authButtons.style.display = "none";
    if (userMenu) {
      userMenu.style.display = "flex";
      console.log("UserMenu mostrado"); // ✅ DEBUG
    }

    // Si tiene foto de Google
    if (usuario.foto) {
      console.log("Usuario con foto de Google:", usuario.foto); // ✅ DEBUG
      if (userIconImg) {
        userIconImg.src = usuario.foto;
        userIconImg.style.display = "block";
        userIconImg.style.cursor = "pointer";
      }
    } else {
      // Si NO tiene foto → crear círculo con inicial
      console.log("Usuario sin foto, creando inicial:", usuario.inicial); // ✅ DEBUG
      
      const userIconDiv = document.createElement("div");
      userIconDiv.textContent = usuario.inicial || usuario.nombre.charAt(0).toUpperCase();
      userIconDiv.className = "icon-inicial";
      
      // Estilos en línea para asegurar visibilidad
      userIconDiv.style.width = "40px";
      userIconDiv.style.height = "40px";
      userIconDiv.style.borderRadius = "50%";
      userIconDiv.style.backgroundColor = "#0f5b0fff";
      userIconDiv.style.color = "#fff";
      userIconDiv.style.display = "flex";
      userIconDiv.style.alignItems = "center";
      userIconDiv.style.justifyContent = "center";
      userIconDiv.style.fontWeight = "bold";
      userIconDiv.style.fontSize = "18px";
      userIconDiv.style.cursor = "pointer";
      
      userIconDiv.addEventListener("click", () => {
        window.location.href = "../vistas/miCuenta.php";
      });

      // Reemplazar la imagen por el div con la inicial
      if (userMenu && userIconImg) {
        userMenu.replaceChild(userIconDiv, userIconImg);
        console.log("Inicial reemplazada correctamente"); // ✅ DEBUG
      }
    }
  } else {
    // No hay sesión → mostrar botones de login/registro
    console.log("No hay usuario en localStorage"); // ✅ DEBUG
    if (authButtons) authButtons.style.display = "flex";
    if (userMenu) userMenu.style.display = "none";
  }
});