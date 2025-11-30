// ===============================
//   CALLBACK GLOBAL PARA GOOGLE
// ===============================
window.handleCredentialResponse = function (response) {
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
        .then(res => {
            const ctype = res.headers.get("content-type");
            if (!ctype || !ctype.includes("application/json")) {
                throw new TypeError("Respuesta no es JSON válido");
            }
            return res.json();
        })
        .then(respuesta => {
            console.log("Respuesta del servidor (CLoginGoogle):", respuesta);

            if (!respuesta || typeof respuesta !== "object") {
                alert("Respuesta inválida del servidor.");
                return;
            }

            if (respuesta.status === "error") {
                console.error("Error servidor:", respuesta.mensaje);
                alert("Error: " + (respuesta.mensaje || "Error en el servidor"));
                return;
            }

            if ((respuesta.status === "existe" || respuesta.status === "nuevo") &&
                respuesta.usuario && respuesta.usuario.id) {

                const usuario = {
                    id: respuesta.usuario.id,
                    nombre: respuesta.usuario.nombre || usuarioGoogle.nombre,
                    inicial: (respuesta.usuario.nombre || usuarioGoogle.nombre).charAt(0).toUpperCase(),
                    correo: respuesta.usuario.email || usuarioGoogle.email || null,
                    email: respuesta.usuario.email || usuarioGoogle.email || null,
                    foto: usuarioGoogle.foto || null,
                    metodo: "Google"
                };

                // ✅ Guardar usuario
                localStorage.setItem("usuario", JSON.stringify(usuario));
                
                // 🔥 LIMPIAR ubicación anterior (de otro usuario)
                localStorage.removeItem("ubicacion_validada");
                localStorage.removeItem("modal_mostrado");
                localStorage.removeItem("modal_mostrado_" + usuario.id);
                
                console.log("✅ Usuario guardado:", usuario);
                console.log("🧹 Ubicación limpiada");

                alert(`Bienvenido ${usuario.nombre} 🌮`);
                window.location.href = "../../index.php";
                return;
            }

            console.error("La respuesta no contiene usuario.id:", respuesta);
            alert("No se pudo completar el registro. Revisa la consola (Network).");
        })
        .catch(error => {
            console.error("Error en login Google (catch):", error);
            alert("Ocurrió un error en la comunicación con el servidor.");
        });
};

// ===============================
//     FUNCIÓN PARA DECODIFICAR JWT
// ===============================
function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );
    return JSON.parse(jsonPayload);
}

// ===============================
//     LÓGICA PRINCIPAL DEL LOGIN
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    function irAMiCuenta() {
        window.location.href = "../../index.php";
    }

    // -------- MODAL --------
    const phoneBtn = document.querySelector(".boton-telefono");
    const modal = document.getElementById("telefonoModal");
    const closeModal = document.querySelector(".close");

    if (phoneBtn && modal && closeModal) {
        phoneBtn.addEventListener("click", () => modal.style.display = "block");
        closeModal.addEventListener("click", () => modal.style.display = "none");

        window.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    // -------- VALIDACIÓN DE CONTRASEÑA --------
    const loginInput = document.getElementById("celular");
    const passwordInput = document.getElementById("password");
    const passwordMessage = document.getElementById("passwordMessage");

    if (passwordInput && passwordMessage) {
        passwordInput.addEventListener("input", () => {
            const pass = passwordInput.value;
            const errores = [];

            if (pass.length < 8) errores.push("mínimo 8 caracteres");
            if (!/[A-Z]/.test(pass)) errores.push("una mayúscula");
            if (!/[a-z]/.test(pass)) errores.push("una minúscula");
            if (!/[0-9]/.test(pass)) errores.push("un número");
            if (!/[!@#$%^&*]/.test(pass)) errores.push("un símbolo (!@#$%^&*)");

            if (errores.length > 0) {
                passwordMessage.textContent = "Falta: " + errores.join(", ");
                passwordMessage.style.color = "red";
            } else {
                passwordMessage.textContent = "Contraseña correcta";
                passwordMessage.style.color = "#235b0f";
            }
        });
    }

    // -------- LOGIN NORMAL --------
    const telefonoForm = document.getElementById("telefonoForm");

    if (telefonoForm) {
        telefonoForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const loginValor = loginInput.value.trim();
            const password = passwordInput.value.trim();

            if (!loginValor) {
                alert("Ingresa un número de celular o usuario.");
                return;
            }

            const esTelefono = /^[0-9]{10}$/.test(loginValor);
            if (!esTelefono && loginValor.length < 3) {
                alert("Ingresa un número válido o un usuario (mínimo 3 letras).");
                return;
            }

            const passRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
            if (!passRegex.test(password)) {
                alert("La contraseña no cumple los requisitos.");
                return;
            }

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
                        const usuario = {
                            id: respuesta.usuario.id,
                            nombre: respuesta.usuario.nombre,
                            correo: respuesta.usuario.correo || null,
                            telefono: respuesta.usuario.telefono || null,
                            metodo: "Normal",
                            inicial:
                                respuesta.usuario.nombre?.charAt(0).toUpperCase() || "",
                            foto: null
                        };

                        // ✅ Guardar usuario
                        localStorage.setItem("usuario", JSON.stringify(usuario));
                        
                        // 🔥 LIMPIAR ubicación anterior (de otro usuario)
                        localStorage.removeItem("ubicacion_validada");
                        localStorage.removeItem("modal_mostrado");
                        localStorage.removeItem("modal_mostrado_" + usuario.id);
                        
                        console.log("✅ Usuario guardado:", usuario);
                        console.log("🧹 Ubicación limpiada");

                        alert(`Bienvenido ${usuario.nombre} 🌮`);
                        modal.style.display = "none";
                        irAMiCuenta();
                    } else {
                        alert(respuesta.mensaje || "Error en el inicio de sesión.");
                    }
                })
                .catch(err => {
                    console.error("Error login normal:", err);
                });
        });
    }
});