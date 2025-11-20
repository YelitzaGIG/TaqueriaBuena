<?php
// Controlador/validarUbicacion.php
// Sistema de validación de ubicación para pedidos a domicilio

session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../modelo/conexion.php";

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ========================================
// CONSTANTES
// ========================================
define('TAQUERIA_LAT', 20.186040);
define('TAQUERIA_LNG', -99.272593);
define('RADIO_MAX_METROS', 3000);

// ========================================
// FUNCIÓN: Calcular distancia entre dos puntos
// ========================================
function calcularDistancia($lat1, $lng1, $lat2, $lng2) {
    $radioTierra = 6371000; // metros
    
    $dLat = deg2rad($lat2 - $lat1);
    $dLng = deg2rad($lng2 - $lng1);
    
    $a = sin($dLat/2) * sin($dLat/2) +
         cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
         sin($dLng/2) * sin($dLng/2);
    
    $c = 2 * atan2(sqrt($a), sqrt(1-$a));
    $distancia = $radioTierra * $c;
    
    return round($distancia, 2);
}

// ========================================
// FUNCIÓN: Registrar log de validación
// ========================================
function registrarLog($db, $usuario_id, $datos) {
    try {
        $sql = "INSERT INTO validaciones_ubicacion 
                (usuario_id, latitud, longitud, distancia_metros, dentro_rango, fecha_validacion) 
                VALUES (?, ?, ?, ?, ?, NOW())";
        
        $stmt = $db->prepare($sql);
        $stmt->bind_param(
            "idddi",
            $usuario_id,
            $datos['latitud'],
            $datos['longitud'],
            $datos['distancia'],
            $datos['dentro_rango']
        );
        
        return $stmt->execute();
    } catch (Exception $e) {
        error_log("Error al registrar log: " . $e->getMessage());
        return false;
    }
}

// ========================================
// VERIFICAR SESIÓN
// ========================================
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode([
        "status" => "error",
        "codigo" => "NO_SESION",
        "mensaje" => "Debes iniciar sesión para validar tu ubicación",
        "puede_ordenar" => false
    ]);
    exit;
}

// ========================================
// PROCESAR SOLICITUD
// ========================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibir datos JSON
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    
    // Validar datos recibidos
    $latitud = isset($data['latitud']) ? floatval($data['latitud']) : null;
    $longitud = isset($data['longitud']) ? floatval($data['longitud']) : null;
    $direccion = isset($data['direccion']) ? trim($data['direccion']) : null;
    
    // Validación de coordenadas
    if ($latitud === null || $longitud === null) {
        echo json_encode([
            "status" => "error",
            "codigo" => "DATOS_INVALIDOS",
            "mensaje" => "Las coordenadas proporcionadas no son válidas",
            "puede_ordenar" => false
        ]);
        exit;
    }
    
    // Validar rango de coordenadas (México)
    if ($latitud < 14 || $latitud > 33 || $longitud < -119 || $longitud > -86) {
        echo json_encode([
            "status" => "error",
            "codigo" => "FUERA_PAIS",
            "mensaje" => "La ubicación debe estar dentro de México",
            "puede_ordenar" => false
        ]);
        exit;
    }
    
    // Calcular distancia
    $distanciaMetros = calcularDistancia(
        $latitud, 
        $longitud, 
        TAQUERIA_LAT, 
        TAQUERIA_LNG
    );
    
    $distanciaKm = round($distanciaMetros / 1000, 2);
    $dentroRango = $distanciaMetros <= RADIO_MAX_METROS;
    
    // Preparar datos para guardar
    $datosValidacion = [
        'latitud' => $latitud,
        'longitud' => $longitud,
        'direccion' => $direccion,
        'distancia' => $distanciaMetros,
        'distancia_km' => $distanciaKm,
        'dentro_rango' => $dentroRango ? 1 : 0,
        'fecha_validacion' => date('Y-m-d H:i:s')
    ];
    
    // Registrar en base de datos
    $db = conectarDB();
    registrarLog($db, $_SESSION['usuario_id'], $datosValidacion);
    
    if ($dentroRango) {
        // Usuario DENTRO del rango
        $_SESSION['ubicacion_validada'] = true;
        $_SESSION['latitud'] = $latitud;
        $_SESSION['longitud'] = $longitud;
        $_SESSION['distancia_km'] = $distanciaKm;
        $_SESSION['direccion'] = $direccion;
        $_SESSION['fecha_validacion'] = time();
        
        echo json_encode([
            "status" => "success",
            "codigo" => "DENTRO_RANGO",
            "mensaje" => "¡Perfecto! Tu ubicación está dentro del área de entrega",
            "puede_ordenar" => true,
            "datos" => [
                "distancia_km" => $distanciaKm,
                "distancia_metros" => $distanciaMetros,
                "radio_maximo_km" => RADIO_MAX_METROS / 1000
            ]
        ]);
        
    } else {
        // Usuario FUERA del rango
        unset($_SESSION['ubicacion_validada']);
        unset($_SESSION['latitud']);
        unset($_SESSION['longitud']);
        unset($_SESSION['distancia_km']);
        unset($_SESSION['direccion']);
        
        echo json_encode([
            "status" => "error",
            "codigo" => "FUERA_RANGO",
            "mensaje" => "Lo sentimos, tu ubicación está fuera del área de entrega",
            "puede_ordenar" => false,
            "datos" => [
                "distancia_km" => $distanciaKm,
                "distancia_metros" => $distanciaMetros,
                "radio_maximo_km" => RADIO_MAX_METROS / 1000,
                "exceso_km" => round($distanciaKm - (RADIO_MAX_METROS / 1000), 2)
            ]
        ]);
    }
    
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "codigo" => "METODO_NO_PERMITIDO",
        "mensaje" => "Solo se permiten solicitudes POST"
    ]);
}

?>