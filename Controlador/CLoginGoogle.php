<?php
//CLoginGoogle.php
session_start();
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
    // ✅ GUARDAR ID DE USUARIO EN SESIÓN
    $_SESSION['usuario_id'] = $usuario['id'];
    
    echo json_encode([
        "status" => "existe",
        "mensaje" => "El usuario ya estaba registrado",
        "usuario" => [
            "id" => $usuario['id'], // ✅ AGREGAR ID
            "nombre" => $usuario['usuario'],
            "email" => $usuario['correo_telefono']
        ]
    ]);
    exit;
}

// 2. Registrar si es nuevo
$registrado = $usuarioModel->registrarUsuarioGoogle($nombre, $email, $google_id);

if ($registrado) {
    // Obtener el ID del nuevo usuario
    $nuevoUsuario = $usuarioModel->buscarUsuarioGoogle($email, $google_id);
    $_SESSION['usuario_id'] = $nuevoUsuario['id'];
    
    echo json_encode([
        "status" => "nuevo",
        "mensaje" => "Usuario registrado por Google exitosamente",
        "usuario" => [
            "id" => $nuevoUsuario['id'],
            "nombre" => $nombre,
            "email" => $email
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error al registrar usuario"
    ]);
}
?>