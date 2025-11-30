<?php
// CLoginNormal.php
session_start();
require_once "../modelo/MUsuarios.php";

// ✅ EVITAR WARNINGS/ERRORES ANTES DEL JSON
error_reporting(E_ALL);
ini_set('display_errors', 0); // No mostrar errores en pantalla
ini_set('log_errors', 1);

header("Content-Type: application/json; charset=utf-8");

try {
    // Recibir JSON desde fetch
    $input = file_get_contents("php://input");
    
    if (empty($input)) {
        throw new Exception("No se recibieron datos");
    }
    
    $data = json_decode($input, true);
    
    if (!$data || !is_array($data)) {
        throw new Exception("Datos JSON inválidos");
    }
    
    if (!isset($data["usuario_o_telefono"]) || !isset($data["contrasena"])) {
        throw new Exception("Faltan campos obligatorios");
    }
    
    $login = trim($data["usuario_o_telefono"]);
    $password = trim($data["contrasena"]);
    
    if (empty($login) || empty($password)) {
        throw new Exception("Usuario y contraseña son obligatorios");
    }

    $model = new MUsuarios();
    $user = $model->loginNormal($login, $password);

    if ($user && isset($user['id'])) {
        // ✅ GUARDAR ID DE USUARIO EN SESIÓN
        $_SESSION['usuario_id'] = (int)$user['id'];
        
        // Determinar si es correo o teléfono
        $correo = filter_var($user['correo_telefono'], FILTER_VALIDATE_EMAIL) 
            ? $user['correo_telefono'] 
            : null;
            
        $telefono = preg_match('/^[0-9]{10}$/', $user['correo_telefono']) 
            ? $user['correo_telefono'] 
            : null;

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Usuario autenticado",
            "usuario" => [
                "id"       => (int)$user['id'],
                "nombre"   => $user['usuario'],
                "correo"   => $correo,
                "telefono" => $telefono,
                "metodo"   => "Normal"
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            "status" => "error",
            "mensaje" => "Usuario o contraseña incorrectos"
        ], JSON_UNESCAPED_UNICODE);
    }
    
} catch (Exception $e) {
    error_log("Error en CLoginNormal: " . $e->getMessage());
    
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error en el servidor: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>