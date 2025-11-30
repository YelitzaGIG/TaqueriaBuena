<?php
session_start();
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data"]);
    exit;
}

$lat = $data["latitud"];
$lng = $data["longitud"];
$direccion = $data["direccion"];
$dentro = $data["dentro_rango"];

// Guardar en sesión SOLO SI ESTÁ DENTRO DEL RANGO
if ($dentro) {
    $_SESSION["ubicacion_validada"] = true;
    $_SESSION["latitud"] = $lat;
    $_SESSION["longitud"] = $lng;
    $_SESSION["direccion"] = $direccion;

    echo json_encode([
        "status" => "success",
        "message" => "Ubicación válida",
        "sesion" => $_SESSION
    ]);
} else {
    $_SESSION["ubicacion_validada"] = false;
    echo json_encode([
        "status" => "error",
        "message" => "Fuera del rango"
    ]);
}
?>
