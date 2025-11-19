<?php
//CloginNormal.php
require_once "../modelo/MUsuarios.php";
header("Content-Type: application/json");

// Recibir JSON desde fetch
$data = json_decode(file_get_contents("php://input"), true);

$login = trim($data["usuario_o_telefono"]);
$password = trim($data["contrasena"]);

$model = new MUsuarios();
$user = $model->loginNormal($login, $password);

if ($user) {
    // Determinar si es correo o teléfono
    $correo = filter_var($user['correo_telefono'], FILTER_VALIDATE_EMAIL) ? $user['correo_telefono'] : null;
    $telefono = preg_match('/^[0-9]{10}$/', $user['correo_telefono']) ? $user['correo_telefono'] : null;

    echo json_encode([
        "status" => "ok",
        "mensaje" => "Usuario autenticado",
        "usuario" => [
            "nombre"   => $user['usuario'],
            "correo"   => $correo,
            "telefono" => $telefono,
            "metodo"   => "Normal"
        ]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Usuario o contraseña incorrectos, o no está registrado"
    ]);
}
?>


