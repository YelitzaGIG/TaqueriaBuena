//login.js
document.addEventListener("DOMContentLoaded", () => {

  // Función para redirigir
  function irAMiCuenta() {
    window.location.href = "../../index.php";
  }

  // Modal
  const phoneBtn = document.querySelector(".boton-telefono");
  const modal = document.getElementById("telefonoModal");
  const closeModal = document.querySelector(".close");
  const telefonoForm = document.getElementById("telefonoForm");
  const loginInput = document.getElementById("celular");
  const passwordInput = document.getElementById("password");
  const passwordMessage = document.getElementById("passwordMessage");

  // Abrir / cerrar modal
  if (phoneBtn && modal && closeModal) {
    phoneBtn.addEventListener("click", () => modal.style.display = "block");
    closeModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }

  // Validación de contraseña
  if (passwordInput && passwordMessage) {
    passwordInput.addEventListener("input", () => {
      const pass = passwordInput.value;
      const errores = [];

      if (pass.length < 8) errores.push("mínimo 8 caracteres");
      if (!/[A-Z]/.test(pass)) errores.push("una letra mayúscula");
      if (!/[a-z]/.test(pass)) errores.push("una letra minúscula");
      if (!/[0-9]/.test(pass)) errores.push("un número");
      if (!/[!@#$%^&*]/.test(pass)) errores.push("un carácter especial (!@#$%^&*)");

      if (errores.length > 0) {
        passwordMessage.textContent = "Falta: " + errores.join(", ");
        passwordMessage.style.color = "red";
      } else {
        passwordMessage.textContent = "Contraseña correcta";
        passwordMessage.style.color = "#235b0f";
      }
    });
  }

  // --- Login Normal ---
  if (telefonoForm) {
    telefonoForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const loginValor = loginInput.value.trim();
      const password = passwordInput.value.trim();

      if (!loginValor) {
        alert("Por favor ingresa un número de celular o usuario.");
        return;
      }

      // Validar si es número o usuario
      const esTelefono = /^[0-9]{10}$/.test(loginValor);
      if (!esTelefono && loginValor.length < 3) {
        alert("Ingresa un número de celular válido o un nombre de usuario (mínimo 3 caracteres).");
        return;
      }

      // Validar contraseña
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(password)) {
        alert("La contraseña no cumple con los requisitos de seguridad.");
        return;
      }

      // --- Enviar al controlador ---
      fetch("/TaqueriaBuena/controlador/CLoginNormal.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_o_telefono: loginValor,
          contrasena: password
        })
      })
      .then(res => res.json())
      .then(respuesta => {

        if (respuesta.status === "ok") {

          const usuarioNormal = {
            id: respuesta.usuario.id, // ✅ GUARDAR ID
            nombre: respuesta.usuario.nombre,
            correo: respuesta.usuario.correo || null,
            telefono: respuesta.usuario.telefono || null,
            metodo: "Normal",
            inicial: respuesta.usuario.nombre?.charAt(0).toUpperCase() || "",
            foto: null
          };

          localStorage.setItem("usuario", JSON.stringify(usuarioNormal));

          alert(`Bienvenido ${usuarioNormal.nombre} 🌮`);
          modal.style.display = "none";
          irAMiCuenta();

        } else {
          alert(respuesta.mensaje || "Error en el inicio de sesión.");
        }
      })
      .catch(error => console.error("Error en login normal:", error));
    });
  }

  // --- Login con Google ---
  window.handleCredentialResponse = function(response) {
    const data = parseJwt(response.credential);

    const usuarioGoogle = {
      nombre: data.name,
      email: data.email,
      google_id: data.sub,
      foto: data.picture
    };

    fetch("/TaqueriaBuena/controlador/CLoginGoogle.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuarioGoogle)
    })
    .then(res => res.json())
    .then(respuesta => {

      const usuario = {
        id: respuesta.usuario.id, // ✅ GUARDAR ID
        nombre: usuarioGoogle.nombre,
        inicial: usuarioGoogle.nombre.charAt(0).toUpperCase(),
        correo: usuarioGoogle.email,
        email: usuarioGoogle.email,
        foto: usuarioGoogle.foto,
        metodo: "Google"
      };

      localStorage.setItem("usuario", JSON.stringify(usuario));

      alert(`Bienvenido ${usuario.nombre} 🌮 (${respuesta.status})`);
      irAMiCuenta();
    })
    .catch(error => console.error("Error en login Google:", error));
  };

  // Decodificar JWT
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload =
      decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    return JSON.parse(jsonPayload);
  }

});