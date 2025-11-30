// Vista/scripts/validarUbicacionMenu.js - COMPLETO

// ===============================
// GUARDAR UBICACION CUANDO SE VALIDA
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    const btnValidarUbicacion = document.getElementById("btn-validar-ubicacion");
    
    if (btnValidarUbicacion) {
        btnValidarUbicacion.addEventListener("click", async function() {
            console.log("Validando ubicacion...");
            
            const latitud = parseFloat(document.getElementById("latitud-input")?.value) || window.mapLatitud;
            const longitud = parseFloat(document.getElementById("longitud-input")?.value) || window.mapLongitud;
            const direccion = document.getElementById("searchBox")?.value || window.mapDireccion || "Sin direccion";
            
            if (!latitud || !longitud) {
                alert("Por favor selecciona una ubicacion en el mapa");
                return;
            }
            
            try {
                const response = await fetch("/TaqueriaBuena/Controlador/validarUbicacion.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        latitud: latitud,
                        longitud: longitud,
                        direccion: direccion,
                        dentro_rango: verificarRangoEntrega(latitud, longitud)
                    })
                });
                
                const data = await response.json();
                
                if (data.status === "success" && data.ubicacion.dentro_rango) {
                    console.log("Ubicacion dentro del rango");
                    
                    guardarUbicacionTemporal({
                        latitud: latitud,
                        longitud: longitud,
                        direccion: direccion,
                        dentro_rango: true
                    });
                    
                    alert("Ubicacion validada correctamente");
                    
                    cerrarModalUbicacion();
                    
                    habilitarBotonesMenu();
                    ocultarBotonFlotanteUbicacion();
                    
                } else {
                    console.log("Ubicacion fuera del rango");
                    alert("Tu ubicacion esta fuera de nuestro rango de entrega");
                }
                
            } catch (error) {
                console.error("Error validando ubicacion: " + error);
                alert("Error al validar la ubicacion");
            }
        });
    }
});

// ===============================
// VERIFICAR RANGO DE ENTREGA
// ===============================
function verificarRangoEntrega(latitud, longitud) {
    const centerLat = 20.5888;
    const centerLng = -100.3899;
    
    const radioKm = 5;
    
    const R = 6371;
    const dLat = (latitud - centerLat) * Math.PI / 180;
    const dLng = (longitud - centerLng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(centerLat * Math.PI / 180) * Math.cos(latitud * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distancia = R * c;
    
    console.log("Distancia calculada: " + distancia.toFixed(2) + " km");
    
    return distancia <= radioKm;
}

// ===============================
// CERRAR MODAL DE UBICACION
// ===============================
function cerrarModalUbicacion() {
    const modal = document.getElementById("modal-ubicacion");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
}

// ===============================
// CALLBACK GLOBAL PARA GOOGLE
// ===============================
window.handleCredentialResponse = function (response) {
    console.log("Respuesta de Google recibida");
    const data = parseJwt(response.credential);

    const usuarioGoogle = {
        nombre: data.name,
        email: data.email,
        google_id: data.sub,
        foto: data.picture
    };

    fetch("/TaqueriaBuena/Controlador/CLoginGoogle.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioGoogle)
    })
        .then(function(res) {
            const ctype = res.headers.get("content-type");
            if (!ctype || !ctype.includes("application/json")) {
                throw new TypeError("Respuesta no es JSON valido");
            }
            return res.json();
        })
        .then(function(respuesta) {
            console.log("Respuesta del servidor: " + JSON.stringify(respuesta));

            if (!respuesta || typeof respuesta !== "object") {
                alert("Respuesta invalida del servidor.");
                return;
            }

            if (respuesta.status === "error") {
                console.error("Error servidor: " + respuesta.mensaje);
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

                localStorage.setItem("usuario", JSON.stringify(usuario));
                
                localStorage.removeItem("modal_mostrado");
                
                console.log("Usuario guardado: " + usuario.nombre);

                alert("Bienvenido " + usuario.nombre);
                window.location.href = "../../index.php";
                return;
            }

            console.error("La respuesta no contiene usuario.id: " + JSON.stringify(respuesta));
            alert("No se pudo completar el registro.");
        })
        .catch(function(error) {
            console.error("Error en login Google: " + error);
            alert("Ocurrio un error en la comunicacion con el servidor.");
        });
};

// ===============================
// FUNCION PARA DECODIFICAR JWT
// ===============================
function parseJwt(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function(c) { return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2); })
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar JWT: " + e);
        return null;
    }
}

// ===============================
// LOGICA PRINCIPAL
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando validarUbicacionMenu.js");

    function irAlIndex() {
        window.location.href = "../../index.php";
    }

    const phoneBtn = document.querySelector(".boton-telefono");
    const modal = document.getElementById("telefonoModal");
    const closeModal = document.querySelector(".close");

    if (phoneBtn && modal && closeModal) {
        phoneBtn.addEventListener("click", function() { modal.style.display = "block"; });
        closeModal.addEventListener("click", function() { modal.style.display = "none"; });

        window.addEventListener("click", function(e) {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    const loginInput = document.getElementById("celular");
    const passwordInput = document.getElementById("password");
    const passwordMessage = document.getElementById("passwordMessage");

    if (passwordInput && passwordMessage) {
        passwordInput.addEventListener("input", function() {
            const pass = passwordInput.value;
            const errores = [];

            if (pass.length < 8) errores.push("minimo 8 caracteres");
            if (!/[A-Z]/.test(pass)) errores.push("una mayuscula");
            if (!/[a-z]/.test(pass)) errores.push("una minuscula");
            if (!/[0-9]/.test(pass)) errores.push("un numero");
            if (!/[!@#$%^&*]/.test(pass)) errores.push("un simbolo (!@#$%^&*)");

            if (errores.length > 0) {
                passwordMessage.textContent = "Falta: " + errores.join(", ");
                passwordMessage.style.color = "red";
            } else {
                passwordMessage.textContent = "Contrasena correcta";
                passwordMessage.style.color = "#235b0f";
            }
        });
    }

    const telefonoForm = document.getElementById("telefonoForm");

    if (telefonoForm) {
        telefonoForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const loginValor = loginInput.value.trim();
            const password = passwordInput.value.trim();

            if (!loginValor) {
                alert("Ingresa un numero de celular o usuario.");
                return;
            }

            const esTelefono = /^[0-9]{10}$/.test(loginValor);
            if (!esTelefono && loginValor.length < 3) {
                alert("Ingresa un numero valido o un usuario (minimo 3 letras).");
                return;
            }

            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
            if (!passRegex.test(password)) {
                alert("La contrasena no cumple los requisitos.");
                return;
            }

            fetch("/TaqueriaBuena/Controlador/CLoginNormal.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario_o_telefono: loginValor,
                    contrasena: password
                })
            })
                .then(function(res) { return res.json(); })
                .then(function(respuesta) {
                    if (respuesta.status === "ok") {
                        const usuario = {
                            id: respuesta.usuario.id,
                            nombre: respuesta.usuario.nombre,
                            correo: respuesta.usuario.correo || null,
                            telefono: respuesta.usuario.telefono || null,
                            metodo: "Normal",
                            inicial: (respuesta.usuario.nombre || "").charAt(0).toUpperCase(),
                            foto: null
                        };

                        localStorage.setItem("usuario", JSON.stringify(usuario));
                        
                        localStorage.removeItem("modal_mostrado");

                        console.log("Usuario guardado: " + usuario.nombre);

                        alert("Bienvenido " + usuario.nombre);
                        modal.style.display = "none";
                        irAlIndex();
                    } else {
                        alert(respuesta.mensaje || "Error en el inicio de sesion.");
                    }
                })
                .catch(function(err) {
                    console.error("Error login normal: " + err);
                });
        });
    }
});