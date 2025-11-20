<?php
// Controlador/validarUbicacion.php
session_start();
header("Content-Type: application/json");

error_log("=== INICIO validarUbicacion.php ===");

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    error_log("ERROR: Usuario no logueado. Session: " . print_r($_SESSION, true));
    echo json_encode([
        "status" => "error",
        "mensaje" => "Debes iniciar sesión para continuar"
    ]);
    exit;
}

error_log("Usuario logueado - ID: " . $_SESSION['usuario_id']);

// Recibir datos de ubicación
$input = file_get_contents("php://input");
error_log("Input recibido: " . $input);

$data = json_decode($input, true);
error_log("Data decodificada: " . print_r($data, true));

$latitud = isset($data['latitud']) ? floatval($data['latitud']) : null;
$longitud = isset($data['longitud']) ? floatval($data['longitud']) : null;
$direccion = isset($data['direccion']) ? trim($data['direccion']) : null;
$dentro_rango = isset($data['dentro_rango']) ? (bool)$data['dentro_rango'] : false;

error_log("Valores procesados - Lat: $latitud, Lng: $longitud, Dentro: " . ($dentro_rango ? 'SI' : 'NO'));

// Validar datos
if ($latitud === null || $longitud === null) {
    error_log("ERROR: Ubicación inválida");
    echo json_encode([
        "status" => "error",
        "mensaje" => "Ubicación inválida"
    ]);
    exit;
}

// Solo guardar en sesión si está dentro del rango
if ($dentro_rango) {
    $_SESSION['ubicacion_validada'] = true;
    $_SESSION['latitud'] = $latitud;
    $_SESSION['longitud'] = $longitud;
    $_SESSION['direccion'] = $direccion;
    
    error_log("✅ Ubicación guardada en sesión: " . print_r($_SESSION, true));
    
    echo json_encode([
        "status" => "success",
        "mensaje" => "Ubicación validada correctamente",
        "puede_ordenar" => true,
        "debug" => [
            "latitud" => $latitud,
            "longitud" => $longitud,
            "direccion" => $direccion
        ]
    ]);
} else {
    // Usuario fuera del rango
    unset($_SESSION['ubicacion_validada']);
    unset($_SESSION['latitud']);
    unset($_SESSION['longitud']);
    unset($_SESSION['direccion']);
    
    error_log("❌ Usuario fuera del rango - Sesión limpiada");
    
    echo json_encode([
        "status" => "error",
        "mensaje" => "Tu ubicación está fuera del área de entrega",
        "puede_ordenar" => false,
        "debug" => [
            "latitud" => $latitud,
            "longitud" => $longitud
        ]
    ]);
}

error_log("=== FIN validarUbicacion.php ===");
?>