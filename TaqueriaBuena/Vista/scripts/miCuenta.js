//miCuenta.js
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Si no hay sesión, redirigir al login
  if (!usuario) {
    alert("Debes iniciar sesión primero");
    window.location.href = "../vistas/login.php";
    return;
  }

  // Elementos del DOM
  const fotoUsuario = document.getElementById("fotoUsuario");
  const nombreUsuario = document.getElementById("nombreUsuario");
  const telefonoUsuario = document.getElementById("telefonoUsuario");
  const emailUsuario = document.getElementById("emailUsuario");
  const metodoUsuario = document.getElementById("metodoUsuario");
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");

  // Mostrar datos del usuario
  if (nombreUsuario) nombreUsuario.textContent = usuario.nombre;
  
  if (telefonoUsuario) {
    telefonoUsuario.textContent = usuario.telefono 
      ? `📱 ${usuario.telefono}` 
      : "";
  }
  
  if (emailUsuario) {
    emailUsuario.textContent = usuario.correo || usuario.email 
      ? `📧 ${usuario.correo || usuario.email}` 
      : "";
  }
  
  if (metodoUsuario) {
    metodoUsuario.textContent = `Método de ingreso: ${usuario.metodo}`;
  }

  // Mostrar foto o inicial
  if (fotoUsuario) {
    if (usuario.foto) {
      // Si tiene foto (Google)
      fotoUsuario.src = usuario.foto;
      fotoUsuario.alt = "Foto de perfil de Google";
    } else {
      // Si no tiene foto, crear un círculo con la inicial
      fotoUsuario.style.display = "none";
      
      const circleDiv = document.createElement("div");
      circleDiv.textContent = usuario.inicial || usuario.nombre.charAt(0).toUpperCase();
      circleDiv.style.width = "120px";
      circleDiv.style.height = "120px";
      circleDiv.style.borderRadius = "50%";
      circleDiv.style.backgroundColor = "#0f5b0fff";
      circleDiv.style.color = "#fff";
      circleDiv.style.display = "flex";
      circleDiv.style.alignItems = "center";
      circleDiv.style.justifyContent = "center";
      circleDiv.style.fontSize = "48px";
      circleDiv.style.fontWeight = "bold";
      circleDiv.style.margin = "0 auto";
      
      fotoUsuario.parentNode.insertBefore(circleDiv, fotoUsuario);
    }
  }

  // Cerrar sesión
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        localStorage.removeItem("usuario");
        alert("Sesión cerrada exitosamente");
        window.location.href = "../../index.php";
      }
    });
  }
});