<?php
// controlador/CLoginGoogle.php
session_start();
require_once __DIR__ . "/../modelo/MUsuarios.php";
header("Content-Type: application/json; charset=utf-8");

// Para debugging
error_log("=== INICIO CLoginGoogle ===");

// Leer JSON de la petición
$input = file_get_contents("php://input");
error_log("Input recibido: " . $input);

$data = json_decode($input, true);
error_log("Data decodificada: " . print_r($data, true));

if (!$data || !is_array($data)) {
    error_log("ERROR: Datos JSON inválidos");
    echo json_encode([
        "status" => "error",
        "mensaje" => "No se recibieron datos JSON válidos"
    ]);
    exit;
}

$nombre = isset($data['nombre']) ? trim($data['nombre']) : null;
$email = isset($data['email']) ? trim($data['email']) : null;
$google_id = isset($data['google_id']) ? trim($data['google_id']) : null;

error_log("Datos extraídos - Nombre: $nombre, Email: $email, Google_ID: $google_id");

if (empty($email) || empty($google_id) || empty($nombre)) {
    error_log("ERROR: Faltan campos obligatorios");
    echo json_encode([
        "status" => "error",
        "mensaje" => "Faltan campos obligatorios (nombre, email o google_id)"
    ]);
    exit;
}

$model = new MUsuarios();

// 1) Buscar si el usuario ya existe
error_log("=== Buscando usuario existente ===");
$usuario = $model->buscarUsuarioGoogle($email, $google_id);
error_log("Usuario encontrado: " . print_r($usuario, true));

if ($usuario && isset($usuario['id'])) {
    // Usuario existente encontrado
    $_SESSION['usuario_id'] = (int)$usuario['id'];
    error_log("✅ Usuario existente - ID: " . $usuario['id']);
    
    echo json_encode([
        "status" => "existe",
        "mensaje" => "El usuario ya estaba registrado",
        "usuario" => [
            "id" => (int)$usuario['id'],
            "nombre" => $usuario['usuario'],
            "email" => $usuario['correo_telefono'] ?? $email,
            "google_id" => $usuario['google_id'] ?? $google_id
        ]
    ]);
    error_log("=== Respuesta enviada: existe ===");
    exit;
}

// 2) Registrar nuevo usuario
error_log("=== Intentando registrar nuevo usuario ===");
$nuevoId = $model->registrarUsuarioGoogle($nombre, $email, $google_id);
error_log("Resultado registrarUsuarioGoogle: " . var_export($nuevoId, true));
error_log("Tipo de dato: " . gettype($nuevoId));
error_log("Es numérico: " . (is_numeric($nuevoId) ? 'SI' : 'NO'));
error_log("Valor entero: " . (int)$nuevoId);

// Verificar diferentes formas en que puede venir el ID
if ($nuevoId !== false && $nuevoId !== null && $nuevoId !== 0) {
    $idFinal = (int)$nuevoId;
    
    if ($idFinal > 0) {
        // Registro exitoso
        $_SESSION['usuario_id'] = $idFinal;
        error_log("✅ Usuario registrado exitosamente - ID: " . $idFinal);
        
        echo json_encode([
            "status" => "nuevo",
            "mensaje" => "Usuario registrado por Google exitosamente",
            "usuario" => [
                "id" => $idFinal,
                "nombre" => $nombre,
                "email" => $email,
                "google_id" => $google_id
            ]
        ]);
        error_log("=== Respuesta enviada: nuevo ===");
        exit;
    }
}

// Si llegó aquí, hubo un error
error_log("❌ ERROR: No se pudo registrar el usuario");
error_log("nuevoId = " . var_export($nuevoId, true));
error_log("Verificando si el usuario se registró de todas formas...");

// Última verificación: buscar si se registró a pesar del error
$usuarioRegistrado = $model->buscarUsuarioGoogle($email, $google_id);
if ($usuarioRegistrado && isset($usuarioRegistrado['id'])) {
    error_log("⚠️ Usuario SÍ se registró pero hubo problema en el retorno");
    $_SESSION['usuario_id'] = (int)$usuarioRegistrado['id'];
    
    echo json_encode([
        "status" => "nuevo",
        "mensaje" => "Usuario registrado exitosamente",
        "usuario" => [
            "id" => (int)$usuarioRegistrado['id'],
            "nombre" => $usuarioRegistrado['usuario'],
            "email" => $usuarioRegistrado['correo_telefono'],
            "google_id" => $usuarioRegistrado['google_id']
        ]
    ]);
    exit;
}

echo json_encode([
    "status" => "error",
    "mensaje" => "Error al registrar usuario. Por favor, intenta de nuevo.",
    "debug_info" => [
        "nuevoId_type" => gettype($nuevoId),
        "nuevoId_value" => $nuevoId,
        "is_numeric" => is_numeric($nuevoId),
        "int_value" => (int)$nuevoId
    ]
]);
error_log("=== FIN CLoginGoogle (con error) ===");
exit;
?>