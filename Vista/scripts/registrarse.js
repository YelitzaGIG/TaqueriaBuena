//registrarse.js
document.addEventListener("DOMContentLoaded", () => {
  const registroForm = document.getElementById("registroForm");
  const usuarioInput = document.getElementById("usuario");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const passwordMessage = document.getElementById("passwordMessage");
  const confirmMessage = document.getElementById("confirmMessage");

  function irAlIndex() {
    window.location.href = "../../index.php";
  }

  // Validación de contraseña en tiempo real
  passwordInput.addEventListener("input", () => {
    const pass = passwordInput.value;
    const errores = [];
    if (pass.length < 8) errores.push("mínimo 8 caracteres");
    if (!/[A-Z]/.test(pass)) errores.push("una letra mayúscula");
    if (!/[a-z]/.test(pass)) errores.push("una letra minúscula");
    if (!/[0-9]/.test(pass)) errores.push("un número");
    if (!/[!@#$%^&*]/.test(pass)) errores.push("un carácter especial (!@#$%^&*)");

    passwordMessage.textContent = errores.length > 0 ? "Falta: " + errores.join(", ") : "Contraseña fuerte";
    passwordMessage.style.color = errores.length > 0 ? "red" : "#0f5b0fff";
  });

  // Validación de confirmación
  confirmInput.addEventListener("input", () => {
    if (confirmInput.value !== passwordInput.value) {
      confirmMessage.textContent = "Las contraseñas no coinciden";
      confirmMessage.style.color = "red";
    } else {
      confirmMessage.textContent = "¡Coinciden!";
      confirmMessage.style.color = "#0f5b0fff";
    }
  });

  // Submit del formulario
  registroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreUsuario = usuarioInput.value.trim();
    const celular = document.getElementById("celular").value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    if (!nombreUsuario) return alert("Ingresa un nombre de usuario válido.");
    if (!/^[0-9]{10}$/.test(celular)) return alert("Ingresa un número de celular válido de 10 dígitos.");
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(password))
      return alert("La contraseña no cumple con los requisitos de seguridad.");
    if (password !== confirmPassword) return alert("Las contraseñas no coinciden.");

    console.log("Datos enviados:", { usuario: nombreUsuario, celular, password });

    try {
      const response = await fetch("../../Modelo/registrarse.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: nombreUsuario, celular, password })
      });

      const data = await response.json();

      if (data.status === "success") {
        // ✅ Obtener ID del usuario recién registrado
        const usuario = {
          id: data.usuario_id || null, // ⚠️ DEBE VENIR DEL BACKEND
          nombre: nombreUsuario,
          inicial: nombreUsuario.charAt(0).toUpperCase(),
          telefono: celular,
          metodo: "Usuario y Número telefónico",
          foto: null
        };

        localStorage.setItem("usuario", JSON.stringify(usuario));

        alert(`Cuenta creada con éxito para ${nombreUsuario} 🌮`);
        registroForm.reset();
        passwordMessage.textContent = "";
        confirmMessage.textContent = "";

        irAlIndex();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al registrar el usuario");
    }
  });
});