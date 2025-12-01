<?php
// Controlador/CLoginNormal.php
session_start();
require_once __DIR__ . "/../Modelo/MUsuarios.php";

// ✅ EVITAR WARNINGS/ERRORES ANTES DEL JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header("Content-Type: application/json; charset=utf-8");

try {
    // Leer JSON de la petición
    $input = file_get_contents("php://input");
    
    error_log("📥 Input recibido en CLoginNormal: " . $input);
    
    if (empty($input)) {
        throw new Exception("No se recibieron datos");
    }
    
    $data = json_decode($input, true);
    
    error_log("📊 Data decodificada: " . print_r($data, true));
    
    if (!$data || !is_array($data)) {
        throw new Exception("Datos JSON inválidos");
    }
    
    if (!isset($data["usuario_o_telefono"]) || !isset($data["contrasena"])) {
        throw new Exception("Faltan campos obligatorios: usuario_o_telefono, contrasena");
    }
    
    $login = trim($data["usuario_o_telefono"]);
    $password = trim($data["contrasena"]);
    
    error_log("🔐 Intentando login con: usuario_o_telefono=$login");
    
    if (empty($login) || empty($password)) {
        throw new Exception("Usuario y contraseña son obligatorios");
    }

    $model = new MUsuarios();
    $user = $model->loginNormal($login, $password);

    error_log("🔍 Resultado de loginNormal: " . print_r($user, true));

    if ($user && isset($user['id'])) {
        // ✅ GUARDAR ID DE USUARIO EN SESIÓN
        $_SESSION['usuario_id'] = (int)$user['id'];
        
        error_log("✅ Login exitoso - Usuario ID: " . $user['id']);
        
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
        
        error_log("📤 Respuesta enviada: OK");
    } else {
        error_log("❌ Login fallido - Credenciales inválidas");
        echo json_encode([
            "status" => "error",
            "mensaje" => "Usuario o contraseña incorrectos"
        ], JSON_UNESCAPED_UNICODE);
    }
    
} catch (Exception $e) {
    error_log("❌ Exception en CLoginNormal: " . $e->getMessage());
    
    echo json_encode([
        "status" => "error",
        "mensaje" => "Error en el servidor: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>