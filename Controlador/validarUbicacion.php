<?php
session_start();
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        throw new Exception("No se recibieron datos");
    }

    $lat = isset($data["latitud"]) ? floatval($data["latitud"]) : null;
    $lng = isset($data["longitud"]) ? floatval($data["longitud"]) : null;
    $direccion = isset($data["direccion"]) ? trim($data["direccion"]) : "Sin dirección";
    $dentro = isset($data["dentro_rango"]) ? (bool)$data["dentro_rango"] : false;

    error_log("Validación ubicación - Lat: $lat, Lng: $lng, Dentro: " . ($dentro ? "true" : "false"));

    // Guardar en sesión
    $_SESSION["latitud"] = $lat;
    $_SESSION["longitud"] = $lng;
    $_SESSION["direccion"] = $direccion;
    $_SESSION["ubicacion_validada"] = $dentro;

    // También guardar en un formato que JavaScript pueda leer desde localStorage
    $ubicacionData = [
        "latitud" => $lat,
        "longitud" => $lng,
        "direccion" => $direccion,
        "dentro_rango" => $dentro
    ];

    error_log("Ubicación guardada: " . json_encode($ubicacionData));

    echo json_encode([
        "status" => $dentro ? "success" : "error",
        "message" => $dentro ? "Ubicación válida y dentro del rango" : "Ubicación fuera del rango de entrega",
        "ubicacion" => $ubicacionData,
        "sesion_guardada" => $_SESSION
    ]);

} catch (Exception $e) {
    error_log("Error en validarUbicacion: " . $e->getMessage());
    
    echo json_encode([
        "status" => "error",
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>