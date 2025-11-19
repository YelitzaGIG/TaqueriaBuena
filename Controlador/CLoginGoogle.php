<?php
//CLoginGoogle.php
require_once "../modelo/MUsuarios.php";

header("Content-Type: application/json");

// Recibir JSON desde fetch de JS
$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data["nombre"];
$email = $data["email"];
$google_id = $data["google_id"];

$usuarioModel = new MUsuarios();

// 1. Buscar usuario existente
$usuario = $usuarioModel->buscarUsuarioGoogle($email, $google_id);

if ($usuario) {
    echo json_encode([
        "status" => "existe",
        "mensaje" => "El usuario ya estaba registrado",
        "usuario" => $usuario
    ]);
    exit;
}

// 2. Registrar si es nuevo
$registrado = $usuarioModel->registrarUsuarioGoogle($nombre, $email, $google_id);

if ($registrado) {
    echo json_encode([
        "status" => "nuevo",
        "mensaje" => "Usuario registrado por Google exitosamente"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al registrar usuario"
    ]);
}
?>
